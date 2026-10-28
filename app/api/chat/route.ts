// app/api/chat/route.ts
// Faizan Khan's AI Portfolio Assistant — streaming API route.
//
// REQUEST PIPELINE:
//   1. Rate-limit check
//   2. Extract user query
//   3. Deterministic skill-presence check (resume.ts) — no LLM needed
//   4. Relevance-scored RAG retrieval — targeted context only
//   5. Groq streaming (primary) → OpenAI streaming (fallback) → offline fallback
//
// The LLM only receives context that is relevant to the question asked.

import { NextRequest } from "next/server"
import { KNOWLEDGE_BASE } from "@/ai/knowledge"
import { getFallbackAnswer } from "@/ai/fallback"
import { LIMITS, OWNER } from "@/ai/config"
import {
  extractSkillQuery,
  buildSkillAnswer,
  findSkill,
  findProjectsForSkill,
  findProject,
  getAllSkillsText,
  PROJECTS,
  SKILLS,
} from "@/ai/resume"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - LIMITS.rateLimitWindowMs
  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => t > windowStart)
  if (timestamps.length >= LIMITS.maxRequestsPerMinute) return false
  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return true
}

// ── SSE stream helpers ────────────────────────────────────────────────────────

/** Word-by-word simulated stream for deterministic / fallback answers */
function simulateStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const tokens = text.match(/\S+|\s+/g) || [text]

  return new ReadableStream({
    async start(controller) {
      for (const token of tokens) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
        const delay = /\s+/.test(token) ? 8 : 28 + Math.random() * 18
        await new Promise((r) => setTimeout(r, delay))
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"))
      controller.close()
    },
  })
}

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
}

// ── Relevance-scored RAG retrieval ────────────────────────────────────────────
// Only entries whose keywords genuinely match the query are injected.
// "know", "skill", "tech" are intentionally NOT keywords so that
// "does he know Kafka?" does NOT pull the full skills list.

function scoreEntry(query: string, keywords: string[]): number {
  const q = query.toLowerCase()
  const qTokens = q.split(/\W+/).filter(Boolean)
  let score = 0
  for (const kw of keywords) {
    const k = kw.toLowerCase()
    if (q.includes(k)) score += k.includes(" ") ? 4 : 2
    for (const token of qTokens) {
      if (token.length > 2 && k === token) score += 1
    }
  }
  return score
}

// Queries that explicitly request the full profile / all entries
const BROAD_PATTERNS = [
  "who is", "tell me about faizan", "introduce yourself", "introduce faizan",
  "summarize", "summary", "overview", "about faizan", "background",
  "everything about", "full profile",
]

// Queries that explicitly want the complete skills list
const ALL_SKILLS_PATTERNS = [
  "all skills", "all his skills", "list his skills", "list all skills",
  "what are his skills", "what skills does he have", "technical skills",
  "tech stack", "what does he know", "what can he do",
]

// Queries about all projects
const ALL_PROJECTS_PATTERNS = [
  "all projects", "list projects", "what projects", "his projects",
  "show projects", "portfolio projects", "featured projects",
]

function retrieveContext(userQuery: string): { context: string; noMatch: boolean } {
  const q = userQuery.toLowerCase()

  if (BROAD_PATTERNS.some((p) => q.includes(p))) {
    return { context: KNOWLEDGE_BASE.map((e) => `[${e.title}]\n${e.text}`).join("\n\n"), noMatch: false }
  }

  if (ALL_SKILLS_PATTERNS.some((p) => q.includes(p))) {
    return { context: `[Technical Skills]\n${getAllSkillsText()}`, noMatch: false }
  }

  if (ALL_PROJECTS_PATTERNS.some((p) => q.includes(p))) {
    const projectsText = PROJECTS.map(
      (p) => `**${p.name}**\n${p.description}\nTechnologies: ${p.technologies.join(", ")}${p.awards ? `\nAward: ${p.awards}` : ""}`
    ).join("\n\n")
    return { context: `[Projects]\n${projectsText}`, noMatch: false }
  }

  // Check if a specific project is mentioned
  const projectMatch = findProject(userQuery)
  if (projectMatch) {
    const ctx = `[${projectMatch.name}]\n${projectMatch.description}\nTechnologies: ${projectMatch.technologies.join(", ")}\nEvidence: ${projectMatch.evidence}${projectMatch.awards ? `\nAward: ${projectMatch.awards}` : ""}`
    return { context: ctx, noMatch: false }
  }

  // Score knowledge base entries by keyword relevance
  const scored = KNOWLEDGE_BASE
    .map((entry) => ({ entry, score: scoreEntry(userQuery, entry.keywords) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  if (scored.length === 0) {
    return { context: "", noMatch: true }
  }

  return {
    context: scored.map(({ entry }) => `[${entry.title}]\n${entry.text}`).join("\n\n"),
    noMatch: false,
  }
}

// ── System prompt builder ─────────────────────────────────────────────────────

function buildSystemPrompt(userQuery: string, context: string, noMatch: boolean): string {
  if (noMatch) {
    return `You are the official AI portfolio assistant for ${OWNER}.

The user asked: "${userQuery}"

This topic does not appear anywhere in Faizan's verified resume or portfolio.

RESPOND WITH EXACTLY ONE SENTENCE:
"[Topic] is not listed on Faizan's verified resume."

Do not list other skills. Do not redirect. Do not add anything else.`
  }

  return `You are the official AI portfolio assistant for ${OWNER}.

=== RELEVANT VERIFIED CONTEXT ===
${context}
=== END CONTEXT ===

INSTRUCTIONS:
1. Answer ONLY the question: "${userQuery}"
2. Use ONLY the context above — no invented facts.
3. Match response length to the question:
   - Yes/no question → one sentence with brief evidence.
   - Skill check → confirm or deny, cite the evidence if present.
   - List request → provide only that list.
   - Explanation request → explain using only the context above.
4. NEVER include contact details, achievements, or profile info unless directly asked.
5. NEVER list unrelated skills or projects.
6. If something is not in the context, say "[X] is not listed on Faizan's verified resume."
7. You are Faizan's personal AI portfolio assistant — not OpenAI, Groq, or any external model.`
}

// ── Groq streaming call ───────────────────────────────────────────────────────

async function callGroqStream(
  systemPrompt: string,
  messages: ChatMessage[],
  groqKey: string
): Promise<Response | null> {
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-LIMITS.maxHistory).map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: LIMITS.maxOutputTokens,
        temperature: 0.1, // Very low for factual grounding
        stream: true,
      }),
    })

    if (!groqRes.ok || !groqRes.body) return null

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const transformedStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = groqRes.body!.getReader()
        let done = false
        try {
          while (!done) {
            const { value, done: readerDone } = await reader.read()
            done = readerDone
            if (!value) continue

            const lines = decoder.decode(value, { stream: true }).split("\n")
            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith("data:")) continue
              const jsonStr = trimmed.slice(5).trim()
              if (jsonStr === "[DONE]") { done = true; break }
              try {
                const token: string = JSON.parse(jsonStr).choices?.[0]?.delta?.content ?? ""
                if (token) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`))
              } catch { /* skip malformed chunk */ }
            }
          }
        } finally {
          reader.cancel()
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      },
    })

    return new Response(transformedStream, { headers: SSE_HEADERS })
  } catch (err) {
    console.error("Groq error:", err)
    return null
  }
}

// ── Main POST handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown"

    if (!checkRateLimit(ip)) {
      return new Response(
        simulateStream("You're sending messages too quickly — please wait a moment."),
        { headers: SSE_HEADERS }
      )
    }

    const body = await req.json().catch(() => null)
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(simulateStream("Invalid request."), { headers: SSE_HEADERS })
    }

    const rawMessages: ChatMessage[] = body.messages
    const lastUserMessage = rawMessages[rawMessages.length - 1]

    if (!lastUserMessage || typeof lastUserMessage.content !== "string") {
      return new Response(simulateStream("Empty message."), { headers: SSE_HEADERS })
    }

    const userQuery = lastUserMessage.content.trim().slice(0, LIMITS.maxInputChars)
    if (!userQuery) {
      return new Response(simulateStream("Please type a question."), { headers: SSE_HEADERS })
    }

    // ── STEP 1: Deterministic skill-presence check ────────────────────────────
    // Handles: "does he know X?", "is X on his resume?", etc.
    const skillQuery = extractSkillQuery(userQuery)
    if (skillQuery) {
      const { answer } = buildSkillAnswer(skillQuery)
      return new Response(simulateStream(answer), { headers: SSE_HEADERS })
    }

    // ── STEP 2: "Where did he use X?" — project evidence for a skill ─────────
    const wherePattern = userQuery.toLowerCase().match(
      /where\s+(?:did|has|does)\s+(?:he|faizan)\s+(?:use|used|work with|apply)\s+(.+)/
    )
    if (wherePattern) {
      const techName = wherePattern[1].trim().replace(/[?.!]+$/, "")
      const skill = findSkill(techName) // re-use findSkill for normalisation
      const projectsUsed = skill
        ? findProjectsForSkill(skill.name)
        : PROJECTS.filter((p) =>
            p.technologies.some((t) => t.toLowerCase().includes(techName.toLowerCase()))
          )

      if (projectsUsed.length === 0) {
        const label = skill ? skill.name : techName
        return new Response(
          simulateStream(`${label} is not explicitly listed in any of Faizan's verified projects.`),
          { headers: SSE_HEADERS }
        )
      }
      const list = projectsUsed
        .map((p) => `**${p.name}**: ${p.description.split(".")[0]}.`)
        .join("\n")
      const label = skill ? skill.name : techName
      return new Response(
        simulateStream(`${label} was used in the following projects:\n\n${list}`),
        { headers: SSE_HEADERS }
      )
    }

    // ── STEP 3: "List all technical skills" → deterministic ───────────────────
    const qLower = userQuery.toLowerCase()
    if (ALL_SKILLS_PATTERNS.some((p) => qLower.includes(p))) {
      const skillsText = `Here are Faizan's verified technical skills from his resume:\n\n${getAllSkillsText()}`
      return new Response(simulateStream(skillsText), { headers: SSE_HEADERS })
    }

    // ── STEP 4: Direct project inquiry ───────────────────────────────────────
    const projDirect = findProject(userQuery)
    if (projDirect && !ALL_PROJECTS_PATTERNS.some((p) => qLower.includes(p))) {
      const projectText = `**${projDirect.name}**\n\n${projDirect.description}\n\n**Technologies:** ${projDirect.technologies.join(", ")}${projDirect.awards ? `\n\n🏆 **Award:** ${projDirect.awards}` : ""}`
      return new Response(simulateStream(projectText), { headers: SSE_HEADERS })
    }

    // ── STEP 5: Targeted RAG retrieval + LLM for everything else ─────────────
    const { context, noMatch } = retrieveContext(userQuery)
    const systemPrompt = buildSystemPrompt(userQuery, context, noMatch)

    const groqKey = process.env.GROQ_API_KEY

    if (groqKey) {
      const groqResponse = await callGroqStream(systemPrompt, rawMessages, groqKey)
      if (groqResponse) return groqResponse
    }

    // ── STEP 4: Offline fallback ──────────────────────────────────────────────
    const fallbackAnswer = getFallbackAnswer(userQuery)
    return new Response(simulateStream(fallbackAnswer), { headers: SSE_HEADERS })

  } catch (err) {
    console.error("Chat route error:", err)
    return new Response(
      simulateStream("A momentary error occurred. Please ask again."),
      { headers: SSE_HEADERS }
    )
  }
}
