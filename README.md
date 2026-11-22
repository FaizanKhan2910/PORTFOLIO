# ✦ FAIZAN KHAN — DIGITAL PORTFOLIO

### Engineering Ideas. Building Experiences. Creating Impact.

A cinematic, interactive developer portfolio built to showcase my engineering journey, technical expertise, projects and achievements through immersive 3D visuals, elegant motion and a carefully crafted dark aesthetic.

Designed with a focus on **visual storytelling, performance, responsiveness and modern frontend engineering.**

---

## ◈ THE EXPERIENCE

This isn't just a collection of project cards. It's an interactive digital space designed to bring my work and engineering journey to life.

- **Immersive 3D Hero:** An animated Three.js sphere with organic distortion, mouse interaction and orbiting golden particles.
- **Cinematic Motion:** Smooth page transitions and carefully orchestrated animations.
- **Interactive Scrolling:** GSAP-powered scroll animations combined with Lenis smooth scrolling.
- **Minimal Luxury Aesthetic:** Deep dark backgrounds, warm gold accents and refined typography.
- **Responsive Experience:** Designed to deliver a consistent experience across desktop, tablet and mobile.

---

## ⚡ TECH STACK

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework and App Router |
| React | Component-based UI |
| Three.js | 3D graphics and rendering |
| React Three Fiber | Declarative Three.js integration |
| React Three Drei | 3D utilities and helpers |
| Framer Motion | Motion and page transitions |
| GSAP | Scroll-based animations |
| Lenis | Smooth scrolling |
| Tailwind CSS | Utility-first styling |
| Space Grotesk + Inter | Typography |

---

## ✧ VISUAL IDENTITY

A carefully selected palette inspired by cinematic interfaces and understated luxury.

| Color | Hex | Purpose |
|---|---|---|
| Background | `#0C0C0E` | Deep cinematic background |
| Gold | `#C9A96E` | Primary accent |
| Rose | `#D4847A` | Secondary accent |
| Cream | `#F0ECE3` | Primary typography |
| Muted | `#7A7572` | Secondary typography |
| Ember | `#8B5E3C` | 3D sphere base |

**Typography**
- Space Grotesk — Headlines and prominent text.
- Inter — Body text and supporting information.

---

## ◈ 3D SPHERE — THE SIGNATURE ELEMENT

The hero section features an animated 3D sphere built using Three.js and React Three Fiber.

**What makes it special:**

- Organic morphing geometry powered by `MeshDistortMaterial`.
- Mouse-responsive parallax interaction.
- 120 orbiting golden particles.
- Gold and rose directional lighting.
- Dynamic movement that gives the hero a sense of depth and dimension.

**Implementation:** `src/components/ThreeSphere.jsx`

---

## 🗂 PROJECT ARCHITECTURE

The portfolio uses a modular component-based architecture.

```text
portfolio/
│
├── public/
│   └── resume.pdf
│
├── src/
│   └── components/
│       ├── Hero.jsx
│       ├── ThreeSphere.jsx
│       ├── About.jsx
│       ├── Work.jsx
│       ├── Achievements.jsx
│       ├── Stack.jsx
│       └── Contact.jsx
│
├── app/
│   └── ...
│
├── package.json
└── README.md
```

*Note: This illustrates the documented component organization; the complete project structure may contain additional files.*

### Component Responsibilities

| Component | Responsibility |
|---|---|
| `Hero.jsx` | Introduction, roles and social links |
| `ThreeSphere.jsx` | Interactive 3D sphere |
| `About.jsx` | Biography and personal statistics |
| `Work.jsx` | Featured projects |
| `Achievements.jsx` | Hackathon wins and accomplishments |
| `Stack.jsx` | Technical skills and technologies |
| `Contact.jsx` | Contact information and links |

---

## 🚀 GETTING STARTED

Want to explore the project locally?

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Replace the placeholders with your actual GitHub repository URL and directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open in your browser

```text
http://localhost:3000
```

---

## 📄 RESUME INTEGRATION

The Hero section includes a Resume button.

To connect your resume:

1. Add your resume PDF inside the `public/` directory.
2. Name the file `resume.pdf`.
3. Ensure the Resume button points to `/resume.pdf`.

```text
public/resume.pdf
```

---

## 🎨 CUSTOMIZATION

Want to personalize the experience?

All major portfolio content is organized into individual components.

- Update your introduction and social links in `Hero.jsx`.
- Modify your biography and statistics in `About.jsx`.
- Add or update projects in `Work.jsx`.
- Showcase achievements in `Achievements.jsx`.
- Update technologies in `Stack.jsx`.
- Modify contact information in `Contact.jsx`.
- Customize the 3D animation in `ThreeSphere.jsx`.

---

## ☁️ DEPLOYMENT

The project can be deployed using Vercel.

### Option 1 — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2 — GitHub Integration

1. Push your project to GitHub.
2. Import the repository into Vercel.
3. Configure the project settings.
4. Deploy.

Vercel can automatically build and deploy future changes when connected to your GitHub repository.

---

## ◈ ENGINEERING PHILOSOPHY

I believe a great digital experience is more than beautiful visuals.

It should combine:

- Thoughtful engineering.
- Meaningful interactions.
- Performance-conscious implementation.
- Accessible and responsive design.
- Attention to detail.

This portfolio is an evolving representation of my journey as a developer, engineer and builder.

---

<div align="center">

### BUILT WITH CURIOSITY. ENGINEERED WITH PURPOSE.

**Faizan Khan**

Full-Stack Developer · AI/ML Enthusiast · Software Engineer

*Turning ideas into interactive digital experiences.*

</div>
