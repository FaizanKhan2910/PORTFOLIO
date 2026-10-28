// app/dsa/page.tsx
// Dedicated World-Class DSA Experience & Interactive Problem-Solving Lab

import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Cursor from "@/components/Cursor"
import DsaHero from "@/components/dsa/DsaHero"
import DsaPlatforms from "@/components/dsa/DsaPlatforms"
import AlgorithmVisualizer from "@/components/dsa/AlgorithmVisualizer"
import DsaJourney from "@/components/dsa/DsaJourney"
import DsaCta from "@/components/dsa/DsaCta"

export const metadata: Metadata = {
  title: "DSA & Problem-Solving Lab · Faizan Khan | 435+ Solved",
  description:
    "Interactive algorithm visualizations and problem-solving journey of Faizan Khan. 435+ verified DSA problems solved across LeetCode, GeeksforGeeks, and Codolio.",
  keywords: [
    "Faizan Khan DSA",
    "Data Structures and Algorithms",
    "LeetCode Faizan Khan",
    "Algorithm Visualizer",
    "Binary Search",
    "Two Pointers",
    "Sliding Window",
  ],
}

export default function DsaPage() {
  return (
    <main
      style={{
        background: "#08080A",
        minHeight: "100vh",
        color: "#F0ECE3",
        position: "relative",
      }}
    >
      <Cursor />
      <Navbar />

      {/* 1. Immersive Hero & 435+ Counter */}
      <DsaHero />

      {/* 2. Platform Profiles (LeetCode, GFG, Codolio) */}
      <DsaPlatforms />

      {/* 3. Interactive Algorithm Playground (5 Algorithms) */}
      <AlgorithmVisualizer />

      {/* 4. Problem-Solving Domains & Verified Journey */}
      <DsaJourney />

      {/* 5. Final Perspective Call To Action */}
      <DsaCta />

      <Footer />
    </main>
  )
}
