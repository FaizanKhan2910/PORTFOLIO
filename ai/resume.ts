// ai/resume.ts
// Structured Resume Intelligence Engine — Faizan Khan
// All facts sourced from Faizan_5.pdf (verified resume).
//
// PURPOSE: Deterministic, evidence-grounded lookups that answer
// skill-presence and project-evidence questions WITHOUT calling the LLM.
// The LLM is only called when synthesis / explanation is actually needed.

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type SkillCategory =
  | "language"
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "ai_ml"
  | "tool"

export interface Skill {
  /** Canonical display name */
  name: string
  category: SkillCategory
  /** All lowercase aliases / alternate spellings to match against */
  aliases: string[]
  /** The exact resume text this was sourced from */
  evidence: string
  /** Projects where this skill was explicitly used */
  usedIn: string[] // project ids
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[] // canonical skill names
  evidence: string       // exact resume text
  awards?: string
}

// ─── SKILL REGISTRY ──────────────────────────────────────────────────────────
// Every skill is explicit — nothing is inferred.

export const SKILLS: Skill[] = [
  // Languages
  { name: "JavaScript", category: "language", aliases: ["javascript", "js"], evidence: "Languages: JavaScript, Java, Python, TypeScript", usedIn: ["dentra", "sigmagpt", "airbnb", "nexus_auth", "stock_platform"] },
  { name: "TypeScript", category: "language", aliases: ["typescript", "ts"], evidence: "Languages: JavaScript, Java, Python, TypeScript", usedIn: ["airbnb", "sigmagpt"] },
  { name: "Python", category: "language", aliases: ["python", "py"], evidence: "Languages: JavaScript, Java, Python, TypeScript", usedIn: ["ai_code_analyzer", "nexus_auth"] },
  { name: "Java", category: "language", aliases: ["java"], evidence: "Languages: JavaScript, Java, Python, TypeScript", usedIn: [] },

  // Frontend
  { name: "React 19", category: "frontend", aliases: ["react", "react 19", "react19", "reactjs", "react.js"], evidence: "Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3", usedIn: ["dentra", "sigmagpt", "airbnb", "nexus_auth", "stock_platform", "ai_code_analyzer"] },
  { name: "Next.js", category: "frontend", aliases: ["next", "nextjs", "next.js"], evidence: "Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3", usedIn: ["green_density"] },
  { name: "Vite", category: "frontend", aliases: ["vite"], evidence: "Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3", usedIn: [] },
  { name: "Redux Toolkit", category: "frontend", aliases: ["redux", "redux toolkit", "rtk"], evidence: "Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3", usedIn: [] },
  { name: "TailwindCSS", category: "frontend", aliases: ["tailwind", "tailwindcss", "tailwind css"], evidence: "Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3", usedIn: [] },
  { name: "Bootstrap", category: "frontend", aliases: ["bootstrap"], evidence: "Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3", usedIn: [] },
  { name: "HTML5", category: "frontend", aliases: ["html", "html5"], evidence: "Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3", usedIn: [] },
  { name: "CSS3", category: "frontend", aliases: ["css", "css3"], evidence: "Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3", usedIn: [] },

  // Backend
  { name: "Node.js", category: "backend", aliases: ["node", "nodejs", "node.js"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: ["dentra", "sigmagpt", "airbnb", "nexus_auth", "stock_platform"] },
  { name: "Express.js", category: "backend", aliases: ["express", "expressjs", "express.js"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: ["dentra", "sigmagpt", "airbnb", "stock_platform"] },
  { name: "FastAPI", category: "backend", aliases: ["fastapi", "fast api"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: ["ai_code_analyzer", "green_density"] },
  { name: "REST APIs", category: "backend", aliases: ["rest", "rest api", "restful", "rest apis"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: [] },
  { name: "WebSockets", category: "backend", aliases: ["websocket", "websockets"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: [] },
  { name: "JWT", category: "backend", aliases: ["jwt", "json web token"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: ["sigmagpt", "airbnb"] },
  { name: "Bcrypt", category: "backend", aliases: ["bcrypt", "bcryptjs"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: ["sigmagpt"] },
  { name: "Jest", category: "tool", aliases: ["jest"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: [] },
  { name: "Postman", category: "tool", aliases: ["postman"], evidence: "Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest", usedIn: [] },

  // Databases
  { name: "MongoDB", category: "database", aliases: ["mongodb", "mongo"], evidence: "Databases: MongoDB, MongoDB Atlas, PostgreSQL, Supabase", usedIn: ["dentra", "sigmagpt", "airbnb", "stock_platform"] },
  { name: "MongoDB Atlas", category: "database", aliases: ["mongodb atlas", "mongo atlas", "atlas"], evidence: "Databases: MongoDB, MongoDB Atlas, PostgreSQL, Supabase", usedIn: ["airbnb", "stock_platform"] },
  { name: "PostgreSQL", category: "database", aliases: ["postgresql", "postgres", "pg"], evidence: "Databases: MongoDB, MongoDB Atlas, PostgreSQL, Supabase", usedIn: ["green_density"] },
  { name: "Supabase", category: "database", aliases: ["supabase"], evidence: "Databases: MongoDB, MongoDB Atlas, PostgreSQL, Supabase", usedIn: [] },

  // DevOps
  { name: "Docker", category: "devops", aliases: ["docker"], evidence: "DevOps: Docker, Git, GitHub Actions, CI/CD, Kubernetes", usedIn: ["green_density"] },
  { name: "Git", category: "devops", aliases: ["git"], evidence: "DevOps: Docker, Git, GitHub Actions, CI/CD, Kubernetes", usedIn: [] },
  { name: "GitHub Actions", category: "devops", aliases: ["github actions", "github action", "gha"], evidence: "DevOps: Docker, Git, GitHub Actions, CI/CD, Kubernetes", usedIn: [] },
  { name: "CI/CD", category: "devops", aliases: ["ci/cd", "cicd", "ci cd", "continuous integration", "continuous delivery"], evidence: "DevOps: Docker, Git, GitHub Actions, CI/CD, Kubernetes", usedIn: [] },
  { name: "Kubernetes", category: "devops", aliases: ["kubernetes", "k8s"], evidence: "DevOps: Docker, Git, GitHub Actions, CI/CD, Kubernetes", usedIn: [] },

  // AI / ML
  { name: "YOLOv8", category: "ai_ml", aliases: ["yolo", "yolov8", "yolo v8"], evidence: "Computer Vision: YOLOv8 for dental issue detection in DENTRA.", usedIn: ["dentra"] },
  { name: "Llama-3", category: "ai_ml", aliases: ["llama", "llama3", "llama-3", "llama 3"], evidence: "LLM Integration: Llama-3 for clinical reasoning in DENTRA.", usedIn: ["dentra"] },
  { name: "Gemini 2.5 Flash", category: "ai_ml", aliases: ["gemini", "gemini flash", "gemini 2.5", "gemini 2.5 flash"], evidence: "Gemini 2.5 Flash in SigmaGPT.", usedIn: ["sigmagpt"] },

  // Tools / Libraries used in projects (not in explicit skills section but in project evidence)
  { name: "Cloudinary", category: "tool", aliases: ["cloudinary"], evidence: "Airbnb Clone: Multer + Cloudinary (image uploads)", usedIn: ["airbnb"] },
  { name: "Passport.js", category: "tool", aliases: ["passport", "passportjs", "passport.js"], evidence: "Airbnb Clone: Authentication uses Passport.js with 7-day session persistence", usedIn: ["airbnb"] },
  { name: "MapLibre GL", category: "tool", aliases: ["maplibre", "maplibre gl", "maplibre-gl"], evidence: "Airbnb Clone: MapLibre GL (GeoJSON/GeoPoint real-time map discovery)", usedIn: ["airbnb"] },
  { name: "Leaflet", category: "tool", aliases: ["leaflet", "leafletjs"], evidence: "Green Density: Built with Next.js, React, Leaflet, and Turf.js", usedIn: ["green_density"] },
  { name: "Turf.js", category: "tool", aliases: ["turf", "turfjs", "turf.js"], evidence: "Green Density: Built with Next.js, React, Leaflet, and Turf.js", usedIn: ["green_density"] },
  { name: "Stripe", category: "tool", aliases: ["stripe"], evidence: "SigmaGPT: Stripe payment integration supporting 50+ monthly transactions", usedIn: ["sigmagpt"] },
  { name: "ImageKit", category: "tool", aliases: ["imagekit", "imagekit cdn"], evidence: "SigmaGPT: ImageKit CDN integration that reduced load time by 45%", usedIn: ["sigmagpt"] },
]

// ─── PROJECT REGISTRY ────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "dentra",
    name: "DENTRA – DentalVision AI",
    description: "AI-powered dental diagnostic ecosystem that automates the workflow from dental X-rays to patient-ready treatment reports. YOLOv8 performs dental issue detection; Llama-3 generates clinical treatment insights.",
    technologies: ["YOLOv8", "Llama-3", "React 19", "Node.js", "Express.js", "MongoDB"],
    evidence: "DENTRA: YOLOv8, Llama-3, React.js, Node.js, Express.js, MongoDB — Won 1st at JSS Navotthana 2.0 National Hackathon (70+ teams, April 2026).",
    awards: "1st Place – JSS Navotthana 2.0 National Hackathon (70+ teams, April 2026)",
  },
  {
    id: "sigmagpt",
    name: "SigmaGPT – AI Chat & Image SaaS",
    description: "Production AI chat & image generation SaaS platform. Features JWT/bcrypt authentication, Stripe billing (50+ monthly transactions), credit system for 30+ concurrent users, and ImageKit CDN (45% load time reduction).",
    technologies: ["React 19", "Node.js", "Express.js", "MongoDB", "Gemini 2.5 Flash", "Stripe", "ImageKit", "JWT", "Bcrypt"],
    evidence: "SigmaGPT: React 19, Node.js, Express.js, MongoDB, Gemini 2.5 Flash, Stripe, ImageKit CDN — 50+ monthly transactions, 30+ concurrent users.",
  },
  {
    id: "airbnb",
    name: "Airbnb Clone – Full-Stack Travel Platform",
    description: "Full-stack Airbnb-inspired travel platform with real-time MapLibre map discovery (GeoJSON), Cloudinary image uploads, Passport.js auth (7-day sessions), role-based authorization, and RESTful MVC architecture.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB Atlas", "Cloudinary", "MapLibre GL", "Passport.js", "JWT"],
    evidence: "Airbnb Clone: React.js, Node.js, Express.js, MongoDB Atlas, Multer+Cloudinary, MapLibre GL, Passport.js — deployed on Render.",
  },
  {
    id: "green_density",
    name: "Green Density – GIS Greenery Explorer",
    description: "GIS-based greenery explorer built at Healthrytix internship. Displays interactive maps with NDVI data. Reduced database queries from 2,063 to just 3 across 1,031 green spaces using batched queries.",
    technologies: ["Next.js", "React 19", "Leaflet", "Turf.js", "PostgreSQL", "Docker", "FastAPI"],
    evidence: "Green Density: Next.js, React, Leaflet, Turf.js — built at Healthrytix internship. DB queries reduced 2,063 → 3 via batching.",
  },
  {
    id: "nexus_auth",
    name: "NEXUS AUTH – Multimodal Biometric Security",
    description: "Multimodal biometric authentication platform with gesture recognition, voice-liveness detection, spoof prevention, and emergency SOS.",
    technologies: ["React 19", "Node.js", "Python", "YOLOv8", "JavaScript"],
    evidence: "NEXUS AUTH: Computer Vision, Voice AI, React, Node.js, ML — 1st Place HACKATRONICS 2.0 (70+ teams, Dec 2025).",
    awards: "1st Place – HACKATRONICS 2.0 (70+ teams, December 2025)",
  },
  {
    id: "ai_code_analyzer",
    name: "AI Code Analyzer – Generation, Debugging & Analysis",
    description: "High-performance code analysis platform with real-time complexity visualisation, AST analysis, and intelligent documentation generation.",
    technologies: ["React 19", "FastAPI", "Python", "Gemini 2.5 Flash"],
    evidence: "AI Code Analyzer: React 19, FastAPI, Gemini AI, AST Analysis, Python — 1st Place CODEFORGE 2K25 (53 teams, Feb 2025).",
    awards: "1st Place – CODEFORGE 2K25 (53 teams, February 2025)",
  },
  {
    id: "stock_platform",
    name: "Stock Platform – Real-Time Fintech Dashboard",
    description: "Real-time fintech dashboard delivering sub-100ms response times for P&L analytics, order management, and portfolio tracking across 100+ concurrent positions.",
    technologies: ["React 19", "Node.js", "Express.js", "MongoDB Atlas"],
    evidence: "Stock Trading Platform: React, Node.js, MongoDB Atlas, Express — sub-100ms P&L analytics, 100+ concurrent positions.",
  },
]

// ─── LOOKUP FUNCTIONS ─────────────────────────────────────────────────────────

/** Normalize a string for matching */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9.+#]/g, " ").replace(/\s+/g, " ").trim()
}

/**
 * Look up a skill by name/alias in the registry.
 * Returns the matched Skill or null if absent.
 */
export function findSkill(query: string): Skill | null {
  const q = norm(query)
  return SKILLS.find((s) =>
    s.aliases.some((alias) => {
      const a = norm(alias)
      return q === a || q.includes(a) || a.includes(q)
    })
  ) ?? null
}

/**
 * Find all projects that explicitly list a given technology.
 */
export function findProjectsForSkill(skillName: string): Project[] {
  const q = norm(skillName)
  return PROJECTS.filter((p) =>
    p.technologies.some((t) => norm(t) === q || norm(t).includes(q) || q.includes(norm(t)))
  )
}

/**
 * Find a project by name/id.
 */
export function findProject(query: string): Project | null {
  const q = ` ${norm(query)} `
  return PROJECTS.find((p) => {
    const idWithSpace = p.id.replace(/_/g, " ")
    const titleBeforeDash = p.name.split("–")[0].trim().toLowerCase()
    const candidates = [
      norm(p.id),
      norm(idWithSpace),
      norm(titleBeforeDash),
      norm(p.name),
    ].filter((c) => c.length >= 4 && c !== "green" && c !== "stock")

    return candidates.some((cand) => q.includes(` ${cand} `) || q.includes(cand))
  }) ?? null
}

// ─── DETERMINISTIC ANSWER BUILDER ────────────────────────────────────────────

export interface SkillAnswer {
  /** null means skill not found in resume */
  skill: Skill | null
  projects: Project[]
  /** Pre-formatted answer ready to stream — no LLM needed */
  answer: string
}

/**
 * Build a complete, evidence-grounded answer for "does he know X?" style questions.
 * Returns a DeterministicAnswer so the route can skip the LLM entirely.
 */
export function buildSkillAnswer(skillQuery: string): SkillAnswer {
  const skill = findSkill(skillQuery)

  if (!skill) {
    return {
      skill: null,
      projects: [],
      answer: `${skillQuery} is not listed on Faizan's verified resume.`,
    }
  }

  const projects = findProjectsForSkill(skill.name)

  if (projects.length === 0) {
    return {
      skill,
      projects: [],
      answer: `Yes, **${skill.name}** is listed on Faizan's verified resume under ${skill.category.replace("_", " ")}. No specific project in his portfolio explicitly documents its use.`,
    }
  }

  const projectList = projects.map((p) => `**${p.name}**`).join(", ")
  return {
    skill,
    projects,
    answer: `Yes, **${skill.name}** is listed on Faizan's verified resume and was used in ${projectList}.`,
  }
}

/**
 * Detect whether a query is a specific-skill presence question.
 * Pattern: "does he know X", "is X on his resume", "can he use X", etc.
 * Returns the suspected skill term or null if it's a broader question.
 */
export function extractSkillQuery(userQuery: string): string | null {
  const q = userQuery.toLowerCase().trim()

  const patterns = [
    /does\s+(?:he|faizan)\s+know\s+(?:about\s+)?(.+)/,
    /does\s+(?:he|faizan)\s+(?:use|have|work with|understand)\s+(.+)/,
    /(?:is|does)\s+(.+?)\s+(?:listed|on|in)\s+(?:his|the)\s+resume/,
    /(?:can|does)\s+(?:he|faizan)\s+(?:work\s+with|handle|do)\s+(.+)/,
    /(?:has\s+(?:he|faizan)\s+(?:used|worked\s+with))\s+(.+)/,
    /(?:is|are)\s+(?:he|faizan)\s+(?:familiar|experienced|proficient)\s+with\s+(.+)/,
    /(?:just\s+(?:say\s+)?(?:yes\s+or\s+no):?\s+)?is\s+(.+?)\s+listed/,
    /(?:knowledge|experience|expertise)\s+(?:of|in|with)\s+(.+)/,
  ]

  for (const pattern of patterns) {
    const match = q.match(pattern)
    if (match) {
      // Strip trailing punctuation
      return match[1].trim().replace(/[?.!]+$/, "")
    }
  }
  return null
}

/** Get all skills formatted as a clean list */
export function getAllSkillsText(): string {
  const byCategory: Record<string, string[]> = {}
  for (const skill of SKILLS) {
    const cat = skill.category.replace("_", " & ").replace(/\b\w/g, (c) => c.toUpperCase())
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(skill.name)
  }
  return Object.entries(byCategory)
    .map(([cat, skills]) => `**${cat}:** ${skills.join(", ")}`)
    .join("\n")
}
