# Faizan Khan — Portfolio

Cinematic portfolio built with **Next.js 14 + Three.js (@react-three/fiber) + Framer Motion**.

## Stack
- **Next.js 14** (App Router)
- **Three.js** via `@react-three/fiber` + `@react-three/drei`
- **Framer Motion** for page transitions
- **GSAP** for scroll animations
- **Lenis** for smooth scroll
- **Tailwind CSS** for utility classes
- **Space Grotesk** + **Inter** from Google Fonts

## Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#0C0C0E` | Background |
| `--gold` | `#C9A96E` | Primary accent |
| `--rose` | `#D4847A` | Secondary accent |
| `--cream` | `#F0ECE3` | Primary text |
| `--muted` | `#7A7572` | Muted text |
| `--ember` | `#8B5E3C` | Three.js sphere base |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open http://localhost:3000
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to vercel.com — auto-deploys on every push.

## Add your resume
Place your resume PDF at `public/resume.pdf` — the Resume button in the hero will link to it.

## Customise

All content is in the component files:
- `src/components/Hero.jsx` — name, roles, social links
- `src/components/About.jsx` — bio text, stats
- `src/components/Work.jsx` — project list
- `src/components/Achievements.jsx` — hackathon wins
- `src/components/Stack.jsx` — tech stack
- `src/components/Contact.jsx` — contact links

## Three.js Sphere
The animated sphere in the hero is in `src/components/ThreeSphere.jsx`.
- Responds to mouse movement (parallax)
- `MeshDistortMaterial` creates the morphing effect
- 120 gold particles orbit around it
- Lit with gold + rose directional lights
