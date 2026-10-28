// test/regression.mjs
// Regression tests for the resume intelligence engine.
// Run: node test/regression.mjs
// Requires: dev server running on localhost:3001

const BASE = "http://localhost:3001/api/chat"

async function ask(question) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: question }] }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  let full = ""
  const reader = res.body.getReader()
  const dec = new TextDecoder()
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const chunk = dec.decode(value)
    for (const line of chunk.split("\n")) {
      const t = line.trim()
      if (!t.startsWith("data:")) continue
      const json = t.slice(5).trim()
      if (json === "[DONE]") break
      try { full += JSON.parse(json).token ?? "" } catch { /* skip */ }
    }
  }
  return full.trim()
}

function assert(label, answer, { mustContain = [], mustNotContain = [] }) {
  const lower = answer.toLowerCase()
  let pass = true
  const failures = []

  for (const s of mustContain) {
    if (!lower.includes(s.toLowerCase())) {
      pass = false
      failures.push(`  ✗ MISSING: "${s}"`)
    }
  }
  for (const s of mustNotContain) {
    if (lower.includes(s.toLowerCase())) {
      pass = false
      failures.push(`  ✗ SHOULD NOT CONTAIN: "${s}"`)
    }
  }

  const icon = pass ? "✅" : "❌"
  console.log(`\n${icon} ${label}`)
  console.log(`   Answer: "${answer.slice(0, 160)}${answer.length > 160 ? "…" : ""}"`)
  if (!pass) failures.forEach((f) => console.log(f))
  return pass
}

const UNRELATED_PROFILE_TERMS = ["6307672466", "fk6307672466", "linkedin.com", "github.com", "jssate", "navotthana"]

async function run() {
  console.log("=== RESUME INTELLIGENCE REGRESSION TESTS ===\n")
  let passed = 0, total = 0

  const tests = [
    // T1 — Skill absent from resume
    {
      label: "T1: does he know Kafka?",
      q: "does he know Kafka?",
      must: ["kafka", "not listed"],
      mustNot: [...UNRELATED_PROFILE_TERMS, "javascript", "react", "mongodb"],
    },
    // T2 — Skill absent from resume
    {
      label: "T2: does he know AWS?",
      q: "does he know AWS?",
      must: ["aws", "not listed"],
      mustNot: [...UNRELATED_PROFILE_TERMS, "javascript"],
    },
    // T3 — Skill present, with project evidence
    {
      label: "T3: does he know MongoDB?",
      q: "does he know MongoDB?",
      must: ["mongodb", "yes"],
      mustNot: UNRELATED_PROFILE_TERMS,
    },
    // T4 — Skill present (DevOps)
    {
      label: "T4: does he know Docker?",
      q: "does he know Docker?",
      must: ["docker", "yes"],
      mustNot: UNRELATED_PROFILE_TERMS,
    },
    // T5 — Resume check phrasing
    {
      label: "T5: is Kubernetes listed on his resume?",
      q: "is Kubernetes listed on his resume?",
      must: ["kubernetes"],
      mustNot: UNRELATED_PROFILE_TERMS,
    },
    // T6 — Absent skill, alternate phrasing
    {
      label: "T6: does he know Redis?",
      q: "does he know Redis?",
      must: ["redis", "not listed"],
      mustNot: [...UNRELATED_PROFILE_TERMS, "mongodb"],
    },
    // T7 — All skills explicitly requested
    {
      label: "T7: list all his technical skills",
      q: "list all his technical skills",
      must: ["javascript", "react", "mongodb", "docker"],
      mustNot: UNRELATED_PROFILE_TERMS,
    },
    // T8 — Project question
    {
      label: "T8: tell me about DENTRA",
      q: "tell me about DENTRA",
      must: ["dentra", "dental"],
      mustNot: ["6307672466", "linkedin.com"],
    },
    // T9 — Specific project tech question
    {
      label: "T9: where did he use MongoDB?",
      q: "where did he use MongoDB?",
      must: ["mongodb"],
      mustNot: UNRELATED_PROFILE_TERMS,
    },
    // T10 — Yes/no compact phrasing
    {
      label: "T10: just say yes or no: is MongoDB listed?",
      q: "just say yes or no: is MongoDB listed?",
      must: ["yes"],
      mustNot: UNRELATED_PROFILE_TERMS,
    },
  ]

  for (const t of tests) {
    total++
    try {
      const answer = await ask(t.q)
      const ok = assert(t.label, answer, { mustContain: t.must, mustNotContain: t.mustNot })
      if (ok) passed++
    } catch (err) {
      console.log(`\n❌ ${t.label}`)
      console.log(`   ERROR: ${err.message}`)
    }
    // Small delay between requests
    await new Promise((r) => setTimeout(r, 600))
  }

  console.log(`\n${"─".repeat(50)}`)
  console.log(`RESULTS: ${passed}/${total} passed`)
  process.exit(passed === total ? 0 : 1)
}

run().catch((err) => { console.error(err); process.exit(1) })
