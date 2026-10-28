// ai/fallback.ts
// Offline semantic keyword-matching & RAG engine.
// Grounded strictly in Faizan Khan's verified resume and portfolio.
// When an item is not found, answers with genuine humility.

import { KNOWLEDGE_BASE, GREETING_WORDS } from "./knowledge"
import { OWNER } from "./config"
import { findProject } from "./resume"

export function getFallbackAnswer(question: string): string {
  const q = question.toLowerCase().trim()
  const words = q.split(/[^a-z0-9-]+/).filter(Boolean)

  // Direct greetings
  if (words.length > 0 && words.length <= 3 && words.some((w) => GREETING_WORDS.includes(w))) {
    return `Greetings! I am ${OWNER}'s official AI assistant. I am grounded directly in his verified resume. You can ask me about his 3 undefeated hackathon championships, featured projects like DENTRA and SigmaGPT, his technical stack, or his Healthrytix internship experience.`
  }

  // Exact matches for predefined quick question buttons
  if (q === "about me" || q.includes("who is faizan") || q.includes("introduce yourself")) {
    const entry = KNOWLEDGE_BASE.find((k) => k.id === "about_me")
    return entry ? entry.text : "Faizan Khan is a pre-final year B.E. CSE (AI & ML) student at JSSATE Bengaluru, Full-Stack Developer, AI/ML Engineer, and 3x Hackathon Champion."
  }

  if (q === "projects" || q.includes("what projects") || q.includes("top projects") || q.includes("featured projects")) {
    const entry = KNOWLEDGE_BASE.find((k) => k.id === "projects")
    return entry ? entry.text : "Faizan's key projects include DENTRA (AI dental diagnostics with YOLOv8 & Llama-3), SigmaGPT (production AI SaaS with Stripe), an Airbnb Clone (MapLibre & MongoDB Atlas), and Green Density (GIS greenery explorer built during his Healthrytix internship)."
  }

  // Direct project lookup if a specific project was asked about
  const matchedProject = findProject(question)
  if (matchedProject) {
    return `**${matchedProject.name}**\n\n${matchedProject.description}\n\n**Technologies:** ${matchedProject.technologies.join(", ")}${matchedProject.awards ? `\n\n🏆 **Award:** ${matchedProject.awards}` : ""}`
  }

  if (q === "technical skills" || q.includes("tech stack") || q.includes("what skills") || q.includes("skills")) {
    const entry = KNOWLEDGE_BASE.find((k) => k.id === "technical_skills")
    return entry ? entry.text : "Languages: JavaScript, TypeScript, Python, Java. Frontend: React 19, Next.js, Vite, TailwindCSS. Backend: Node.js, Express.js, FastAPI. Databases: MongoDB, PostgreSQL, Supabase. DevOps: Docker, Git, GitHub Actions, Kubernetes."
  }

  if (q === "hackathon wins" || q.includes("hackathons won") || q.includes("hackathon record") || q.includes("hackathons")) {
    const entry = KNOWLEDGE_BASE.find((k) => k.id === "hackathon_wins")
    return entry ? entry.text : "Faizan holds a 3-0 undefeated hackathon record: 1st Place at JSS Navotthana 2.0 (National, 70+ teams, April 2026), 1st Place at HACKATRONICS 2.0 (53+ teams, Dec 2025), and 1st Place at CODEFORGE 2K25 (53 teams, Feb 2025)."
  }

  if (q === "ai/ml experience" || q.includes("ai experience") || q.includes("machine learning experience") || q.includes("ai/ml")) {
    const entry = KNOWLEDGE_BASE.find((k) => k.id === "ai_ml_experience")
    return entry ? entry.text : "Faizan's AI/ML experience includes computer vision with YOLOv8, clinical LLM reasoning with Llama-3, multimodal AI with Gemini 2.5 Flash in SigmaGPT, voice AI pipelines at Healthrytix, and low-latency model serving via FastAPI."
  }

  if (q === "why hire me?" || q === "why hire me" || q.includes("why hire")) {
    const entry = KNOWLEDGE_BASE.find((k) => k.id === "why_hire_me")
    return entry ? entry.text : "Faizan combines real industry internship experience at Healthrytix, an undefeated 3-0 hackathon championship record, full-stack MERN & Next.js mastery, hands-on AI/ML deployment, and 400+ solved DSA problems."
  }

  // Explicit check for unverified technologies like Redis
  if (q.includes("redis")) {
    const redisEntry = KNOWLEDGE_BASE.find((k) => k.id === "redis")
    if (redisEntry) return redisEntry.text
  }

  // Keyword relevance scoring across the full knowledge base
  let bestEntry: (typeof KNOWLEDGE_BASE)[number] | null = null
  let maxScore = 0

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0
    for (const kw of entry.keywords) {
      if (words.includes(kw)) {
        score += 3
      } else if (q.includes(kw)) {
        score += 1
      }
    }
    if (score > maxScore) {
      bestEntry = entry
      maxScore = score
    }
  }

  // If no confident match found in verified facts, answer humbly
  if (maxScore === 0 || !bestEntry) {
    return `I don't have verified information about that specific topic in Faizan's resume.`
  }

  return bestEntry.text
}
