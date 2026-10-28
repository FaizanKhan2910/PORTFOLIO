// ai/knowledge.ts
// GROUND TRUTH knowledge base — sourced directly from Faizan Khan's resume (Faizan_5.pdf).
// Every fact here is 100% verified. The assistant MUST NOT invent details beyond this.

export interface KnowledgeEntry {
  id: string
  title: string
  keywords: string[]
  text: string       // Full detailed answer (used in system prompt & LLM context)
  short: string      // Concise 1–2 sentence answer for the fallback engine
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ── IDENTITY ──────────────────────────────────────────────────────────────
  {
    id: "about_me",
    title: "About Faizan Khan",
    keywords: ["who", "faizan", "faizan khan", "introduce", "yourself", "profile", "background", "bio", "summary", "about faizan", "who is faizan"],
    text: `Faizan Khan is a **pre-final year B.E. Computer Science & Engineering (AI & ML)** student at JSS Academy of Technical Education (JSSATE), Bengaluru (Sep 2024 – Aug 2028).

He is a **Full-Stack Application Developer + AI Engineer** with hands-on industry experience building scalable web applications and AI systems across healthcare, fintech, and developer tooling domains.

🏆 **Achievements:**
• 3× Hackathon Champion with an undefeated 3-0 record (796+ students defeated)
• 400+ DSA problems solved on LeetCode & GeeksforGeeks

📬 **Contact & Profiles:**
• Phone: 6307672466
• Email: fk6307672466@email.com
• LinkedIn: linkedin.com/in/faizan-khan-57092832a
• GitHub: github.com/FaizanKhan2910`,
    short: "Faizan Khan is a pre-final year B.E. CSE (AI & ML) student at JSSATE Bengaluru, Full-Stack Application Developer + AI Engineer, with industry internship experience and an undefeated 3-0 Hackathon Champion record.",
  },

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  {
    id: "education",
    title: "Education",
    keywords: ["education", "college", "university", "degree", "study", "student", "jssate", "jss", "vtu", "cgpa", "gpa", "school", "batch", "year", "graduation"],
    text: `Faizan is pursuing a Bachelor of Engineering in Computer Science & Engineering with AI & ML specialization at JSS Academy of Technical Education (JSSATE), Bengaluru. Duration: September 2024 to August 2028. This is affiliated with Visvesvaraya Technological University (VTU). He is currently in his pre-final year (3rd year).`,
    short: "Faizan is pursuing his B.E. in CSE (AI & ML) at JSSATE Bengaluru (Sep 2024 – Aug 2028), currently in his pre-final year.",
  },

  // ── EXPERIENCE / INTERNSHIP ───────────────────────────────────────────────
  {
    id: "internship",
    title: "Work Experience – Healthrytix Internship",
    keywords: ["experience", "internship", "intern", "work", "job", "company", "healthrytix", "healthtech", "employed", "professional", "industry", "worked"],
    text: `Faizan worked as a Software Developer Intern (Full-Stack & AI) at Healthrytix Healthtech Solutions, Bengaluru, India in 2026. His contributions included:
1. Built "Green Density" — a GIS-based greenery explorer using Next.js, React, Leaflet, and Turf.js with interactive maps and NDVI data.
2. Engineered AI voice assessment workflows using React/Next.js and FastAPI, integrating audio processing and model predictions. Implemented PostgreSQL storage for assessment metadata, consent, stress biomarkers, model probabilities, and user reflections.
3. Reduced database queries from 2,063 to just 3 across 1,031 green spaces using batched queries. Collaborated with Git/GitHub and Docker.`,
    short: "Faizan interned at Healthrytix Healthtech Solutions (2026) as a Full-Stack & AI Developer, where he built a GIS greenery explorer, AI voice assessment workflows, and reduced DB queries from 2,063 to 3 using batched queries.",
  },

  // ── PROJECTS ─────────────────────────────────────────────────────────────
  {
    id: "projects",
    title: "Projects Overview",
    keywords: ["project", "projects", "built", "build", "portfolio", "work", "apps", "software", "best", "showcase"],
    text: `Faizan's key projects are:
1. DENTRA – DentalVision AI (YOLOv8, Llama-3, React.js, Node.js, Express.js, MongoDB): AI-powered dental diagnostic ecosystem that automates X-ray to treatment report workflow. Won 1st at JSS Navotthana 2.0.
2. SigmaGPT (React 19, Node.js, Express.js, MongoDB, Gemini 2.5 Flash, Stripe, Render): Production AI chat & image generation platform with JWT/bcrypt auth, Stripe payments, 50+ monthly transactions, 30+ concurrent users, ImageKit CDN reducing load time by 45%.
3. Airbnb Clone (React.js, Node.js, Express.js, MongoDB Atlas, Multer+Cloudinary, Joi, MapLibre GL, Render): Full-stack Airbnb-inspired travel platform with real-time map discovery (MapLibre/GeoJSON), Passport.js auth with 7-day session persistence, role-based authorization, and cascading review deletion via Mongoose middleware.
4. Green Density (Next.js, React, Leaflet, Turf.js): GIS-based greenery explorer built at his internship with NDVI data and interactive maps.`,
    short: "Faizan's key projects are DENTRA (AI dental diagnostics with YOLOv8 & Llama-3), SigmaGPT (AI SaaS with Stripe), an Airbnb clone (full-stack with MapLibre maps), and Green Density (GIS greenery explorer from his internship).",
  },

  {
    id: "dentra",
    title: "DENTRA – DentalVision AI",
    keywords: ["dentra", "dental", "dentalvision", "xray", "x-ray", "cavity", "yolo", "yolov8", "llama", "diagnostic", "dental ai"],
    text: `DENTRA is an AI-powered dental diagnostic ecosystem built with YOLOv8, Llama-3, React.js, Node.js, Express.js, and MongoDB. It automates the workflow from dental X-rays to patient-ready treatment reports using computer vision and LLM-based reasoning. YOLOv8 performs dental issue detection, Llama-3 generates treatment insights, and the system produces automated patient visualization and reporting. It won 1st place at JSS Navotthana 2.0 National Hackathon (April 2026) among 70+ teams in a 24-hour sprint.`,
    short: "DENTRA is a national-winning AI dental diagnostic platform: users upload an X-ray, YOLOv8 detects issues, Llama-3 generates clinical treatment insights, and the system produces a patient-ready report — built in 24 hours.",
  },

  {
    id: "sigmagpt",
    title: "SigmaGPT – AI Chat & Image SaaS",
    keywords: ["sigmagpt", "sigma", "image", "saas", "stripe", "imagekit", "gemini", "chat", "image generation", "ai platform"],
    text: `SigmaGPT is a production-ready AI chat & image generation platform built with React 19, Node.js, Express.js, MongoDB, Gemini 2.5 Flash API, Stripe, and Render. Features include JWT/bcrypt authentication, Stripe payment integration supporting 50+ monthly transactions, a scalable credit system for 30+ concurrent users, and ImageKit CDN integration that reduced load time by 45%.`,
    short: "SigmaGPT is a production AI SaaS with Gemini 2.5 Flash, Stripe billing, JWT auth, and ImageKit CDN — supporting 50+ monthly transactions and 30+ concurrent users with a 45% load time improvement.",
  },

  {
    id: "airbnb",
    title: "Airbnb Clone – Full-Stack Travel Platform",
    keywords: ["airbnb", "travel", "listing", "maplibre", "map", "geojson", "geopoint", "cloudinary", "passport", "full stack", "clone"],
    text: `Faizan built a full-stack Airbnb-inspired travel platform using React.js, Node.js, Express.js, MongoDB Atlas, Multer + Cloudinary (image uploads), Joi (validation), MapLibre GL (GeoJSON/GeoPoint real-time map discovery), deployed on Render. It has 3 core models (Listings, Reviews, Users), complete CRUD, and Cloudinary CDN image uploads. Authentication uses Passport.js with 7-day session persistence, role-based authorization, Joi schema validation, and RESTful MVC architecture across 3 modular controllers — supporting listing search, geo-tagged locations, and cascading review deletion via Mongoose middleware.`,
    short: "Faizan built a full-stack Airbnb clone with real-time MapLibre map discovery, Cloudinary image uploads, Passport.js auth (7-day sessions), role-based authorization, and a RESTful MVC architecture — deployed live on Render.",
  },

  {
    id: "green_density",
    title: "Green Density – GIS Greenery Explorer",
    keywords: ["green density", "gis", "greenery", "leaflet", "turf", "ndvi", "map", "healthrytix", "geospatial"],
    text: `Green Density is a GIS-based greenery explorer built at Faizan's internship at Healthrytix. Built with Next.js, React, Leaflet, and Turf.js. It displays interactive maps with NDVI (Normalized Difference Vegetation Index) data for urban greenery analysis. The project also involved reducing database queries from 2,063 to 3 across 1,031 green spaces using batched queries.`,
    short: "Green Density is a GIS-based greenery explorer (Next.js, Leaflet, Turf.js, NDVI data) built at Faizan's Healthrytix internship — it also achieved a 99.85% reduction in database queries (2,063 → 3) via batching.",
  },

  {
    id: "nexus_auth",
    title: "NEXUS AUTH – Multimodal Biometric Security",
    keywords: ["nexus", "nexus auth", "biometric", "security", "gesture", "voice-liveness", "spoof", "sos", "hackatronics"],
    text: `NEXUS AUTH is a multimodal biometric authentication platform built with Computer Vision, Voice AI, React, Node.js, and ML. Features include gesture recognition, voice-liveness detection, spoof prevention, and emergency SOS. Built in a 24-hour sprint, it won 1st Place National across 70+ teams (HACKATRONICS 2.0).`,
    short: "NEXUS AUTH is a multimodal biometric security system (gesture recognition, voice-liveness, anti-spoofing) that won 1st Place at HACKATRONICS 2.0 among 70+ teams.",
  },


  {
    id: "stock_platform",
    title: "Stock Platform – Real-Time Fintech Dashboard",
    keywords: ["stock", "trading", "fintech", "dashboard", "finance", "p&l", "portfolio tracking"],
    text: `The Stock Trading Platform is a real-time fintech dashboard built with React, Node.js, MongoDB Atlas, Express, and deployed on Render. It delivers sub-100ms response times for P&L analytics, order management, and portfolio tracking across 100+ concurrent positions.`,
    short: "Faizan's Stock Trading Platform is a real-time fintech dashboard delivering sub-100ms response times for P&L analytics and order management across 100+ positions.",
  },

  {
    id: "ai_code_analyzer",
    title: "AI Code Analyzer – Generation, Debugging & Analysis",
    keywords: ["code analyzer", "code generation", "ast", "ast analysis", "codeforge", "debugging"],
    text: `AI Code Analyzer is a high-performance code analysis platform built with React 19, FastAPI, Gemini AI, AST Analysis, and Python. Features real-time complexity visualisation and intelligent documentation generation. It won 1st Place at CODEFORGE 2K25.`,
    short: "AI Code Analyzer is a developer tool built with React 19, FastAPI, and AST Analysis for code complexity visualization and debugging, winning 1st Place at CODEFORGE 2K25.",
  },


  // ── TECHNICAL SKILLS ─────────────────────────────────────────────────────
  {
    id: "technical_skills",
    title: "Technical Skills",
    keywords: ["stack", "technology", "technologies", "tools", "language", "languages", "frontend", "backend", "database", "devops"],
    text: `Faizan's verified technical skills from his resume:
- Languages: JavaScript, Java, Python, TypeScript
- Frontend: React 19, Vite, Next.js, Redux Toolkit, TailwindCSS, Bootstrap, HTML5, CSS3
- Backend & APIs: Node.js, Express.js, FastAPI, REST APIs, WebSockets, JWT, Bcrypt, Postman, Jest
- Databases: MongoDB, MongoDB Atlas, PostgreSQL, Supabase
- DevOps: Docker, Git, GitHub Actions, CI/CD, Kubernetes`,
    short: "Faizan's verified stack: JavaScript/TypeScript/Python/Java, React 19/Next.js/Vite (frontend), Node.js/Express.js/FastAPI (backend), MongoDB/PostgreSQL/Supabase (databases), Docker/GitHub Actions/Kubernetes (DevOps).",
  },

  // ── AI / ML EXPERIENCE ───────────────────────────────────────────────────
  {
    id: "ai_ml_experience",
    title: "AI & ML Experience",
    keywords: ["ai", "ml", "machine learning", "artificial intelligence", "yolo", "yolov8", "llama", "gemini", "fastapi", "vision", "nlp", "multimodal", "computer vision", "llm", "rag", "retrieval", "retrieval augmented generation", "generative ai", "gen ai"],
    text: `Faizan's AI/ML experience (verified from resume):
- Computer Vision: YOLOv8 for dental issue detection in DENTRA.
- LLM Integration: Llama-3 for clinical reasoning in DENTRA; Gemini 2.5 Flash in SigmaGPT.
- AI Voice Workflows: Built AI voice assessment workflows at Healthrytix using React/Next.js and FastAPI with audio processing and model predictions.
- Backends: FastAPI for low-latency AI model serving.
- Platforms used: Gemini API, Llama-3, YOLOv8.`,
    short: "Faizan has hands-on AI/ML experience: YOLOv8 (computer vision), Llama-3 & Gemini 2.5 Flash (LLM integration), AI voice assessment workflows (Healthrytix internship), and FastAPI for AI model serving.",
  },

  // ── HACKATHONS ───────────────────────────────────────────────────────────
  {
    id: "hackathon_wins",
    title: "Hackathon Record",
    keywords: ["hackathon", "hackathons", "win", "wins", "won", "winner", "record", "losses", "competition", "competitions", "awards", "first", "1st", "navotthana", "hackatronics", "codeforge"],
    text: `Faizan's hackathon record (verified from resume):
- 3× Hackathon Champion – 1st Place across National & Inter-Collegiate Competitions (2025–2026)
- JSS Navotthana 2.0 – 1st Place among 70+ Teams — 24-Hour National Hackathon (April 2026). Built DENTRA (AI dental diagnostics).
- HACKATRONICS 2.0 – 1st Place among 53+ Teams — 24-Hour Inter-Collegiate Hackathon (December 2025).
- CODEFORGE 2K25 – 1st Place among 53 Teams — 8-Hour Inter-Collegiate Hackathon (February 2025).
Total: 3 entered, 3 won, 0 losses, 796+ students defeated.`,
    short: "Faizan is a 3× Hackathon Champion: 1st at JSS Navotthana 2.0 (70+ teams, national, April 2026), 1st at HACKATRONICS 2.0 (53+ teams, Dec 2025), 1st at CODEFORGE 2K25 (53 teams, Feb 2025) — 3 entered, 3 won, 0 losses.",
  },

  // ── DSA ──────────────────────────────────────────────────────────────────
  {
    id: "dsa",
    title: "DSA & Problem Solving",
    keywords: ["dsa", "leetcode", "geeksforgeeks", "gfg", "problem", "solving", "algorithms", "data structures", "competitive", "coding"],
    text: `Faizan has solved 400+ DSA problems across LeetCode and GeeksforGeeks (as of 2026). He has strong algorithmic fundamentals in dynamic programming, graph theory, trees, and optimal data structure design.`,
    short: "Faizan has solved 400+ DSA problems on LeetCode and GeeksforGeeks, with strong fundamentals in dynamic programming, graphs, and data structures.",
  },

  // ── CONTACT ──────────────────────────────────────────────────────────────
  {
    id: "contact",
    title: "Contact & Availability",
    keywords: ["contact", "email", "mail", "hire", "internship", "reach", "github", "linkedin", "resume", "connect", "available", "phone", "number"],
    text: `Faizan is actively seeking Software Engineering and AI/ML internship and full-time opportunities. Contact details from resume:
- Phone: 6307672466
- Email: fk6307672466@email.com
- LinkedIn: linkedin.com/in/faizan-khan-57092832a
- GitHub: github.com/FaizanKhan2910`,
    short: "You can reach Faizan at fk6307672466@email.com, call 6307672466, or visit his LinkedIn (linkedin.com/in/faizan-khan-57092832a) and GitHub (github.com/FaizanKhan2910).",
  },

  // ── WHY HIRE ─────────────────────────────────────────────────────────────
  {
    id: "why_hire_me",
    title: "Why Hire Faizan?",
    keywords: ["why", "hire", "recruiter", "intern", "internship", "strengths", "value", "fit", "candidate", "job", "standout", "unique", "best"],
    text: `Why hire Faizan Khan:
1. Real Industry Experience: Interned at Healthrytix Healthtech Solutions (2026) — built production systems used in real-world healthcare contexts.
2. Proven Execution Under Pressure: 3× National & Inter-Collegiate Hackathon Champion — 3 entered, 3 won, 0 losses, defeating 796+ students.
3. Full-Stack Depth: Proficient across the complete MERN stack, Next.js, FastAPI, PostgreSQL, Docker, Kubernetes, and CI/CD.
4. Applied AI/ML: Hands-on with YOLOv8, Llama-3, Gemini 2.5 Flash, FastAPI AI backends, and voice AI workflows.
5. Strong Fundamentals: 400+ DSA problems solved on LeetCode and GeeksforGeeks.
6. Ships Production-Grade Code: All projects are live, deployed, and functional — not just tutorials.`,
    short: "Faizan brings real industry internship experience (Healthrytix), a 3-0 hackathon record, full MERN/Next.js/FastAPI stack depth, applied AI/ML (YOLOv8, Gemini, Llama-3), 400+ DSA problems, and a track record of shipping production-grade applications.",
  },
]

export const GREETING_WORDS = ["hi", "hello", "hey", "hii", "yo", "namaste", "sup", "greetings", "good morning", "good evening"]
