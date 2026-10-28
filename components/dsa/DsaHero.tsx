// components/dsa/DsaHero.tsx
'use client'

import React, { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { DSA_CONFIG } from "@/config/dsaConfig"

interface DsaHeroProps {
  onExploreClick?: () => void
}

export default function DsaHero({ onExploreClick }: DsaHeroProps) {
  const shouldReduceMotion = useReducedMotion()
  const [count, setCount] = useState(shouldReduceMotion ? DSA_CONFIG.totalSolved : 0)

  // Animated Count-Up for 435+
  useEffect(() => {
    if (shouldReduceMotion) return

    let start: number | null = null
    const duration = 2200 // 2.2 seconds for cinematic feel
    const target = DSA_CONFIG.totalSolved

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    const frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [shouldReduceMotion])

  return (
    <section
      style={{
        position: "relative",
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "140px 24px 80px",
        overflow: "hidden",
        background: "#08080A",
      }}
    >
      {/* ── Technical Grid with Radial Gold Glow Mask ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201, 169, 110, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 169, 110, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 20%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Subtle Ambient Gold Core ── */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "380px",
          background: "radial-gradient(circle, rgba(201, 169, 110, 0.08) 0%, rgba(201, 169, 110, 0.02) 45%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Content Container ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1080px",
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "6px 18px",
            borderRadius: "999px",
            border: "1px solid rgba(201, 169, 110, 0.22)",
            background: "rgba(201, 169, 110, 0.05)",
            backdropFilter: "blur(8px)",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#C9A96E",
              boxShadow: "0 0 10px #C9A96E",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-space), monospace",
              fontSize: "11px",
              letterSpacing: "3px",
              color: "#C9A96E",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {DSA_CONFIG.eyebrow}
          </span>
        </motion.div>

        {/* Main Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-space), sans-serif",
            fontSize: "clamp(32px, 6vw, 68px)",
            fontWeight: 700,
            letterSpacing: "-1.5px",
            lineHeight: 1.08,
            color: "#F0ECE3",
            margin: "0 0 20px 0",
            textTransform: "uppercase",
          }}
        >
          {DSA_CONFIG.headline.split("PROBLEM")[0]}
          <span
            style={{
              background: "linear-gradient(135deg, #F0ECE3 20%, #C9A96E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PROBLEM
          </span>{" "}
          SOLVING.
        </motion.h1>

        {/* Supporting Quote / Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(16px, 1.8vw, 20px)",
            lineHeight: 1.7,
            color: "#A19B96",
            maxWidth: "680px",
            margin: "0 auto 48px auto",
            fontWeight: 400,
          }}
        >
          “{DSA_CONFIG.totalSolvedDisplay} problems solved. One problem at a time.{" "}
          <span style={{ color: "#F0ECE3", fontStyle: "italic" }}>Always getting better.</span>”
        </motion.p>

        {/* Stat Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 56px",
            borderRadius: "16px",
            background: "linear-gradient(180deg, rgba(20, 20, 24, 0.85) 0%, rgba(12, 12, 15, 0.95) 100%)",
            border: "1px solid rgba(201, 169, 110, 0.28)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-space), monospace",
              fontSize: "clamp(56px, 8vw, 92px)",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1,
              background: "linear-gradient(135deg, #FFFFFF 0%, #C9A96E 60%, #9E7D42 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}
          >
            {count}+
          </div>
          <div
            style={{
              fontFamily: "var(--font-space), monospace",
              fontSize: "13px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#A19B96",
              fontWeight: 600,
            }}
          >
            Total Problems Solved · Verified Starting Metric
          </div>
        </motion.div>

        {/* Action Button & Smooth Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <button
            onClick={() => {
              if (onExploreClick) onExploreClick()
              else {
                document.getElementById("algorithm-visualizer")?.scrollIntoView({ behavior: "smooth" })
              }
            }}
            style={{
              fontFamily: "var(--font-space), monospace",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "14px 28px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #C9A96E 0%, #B08D4D 100%)",
              color: "#0A0A0C",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(201, 169, 110, 0.25)",
              transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(201, 169, 110, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(201, 169, 110, 0.25)"
            }}
          >
            Explore Algorithm Lab ↓
          </button>

          <a
            href="#platforms"
            style={{
              fontFamily: "var(--font-space), monospace",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "14px 28px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.03)",
              color: "#F0ECE3",
              fontWeight: 600,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201, 169, 110, 0.08)"
              e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.4)"
              e.currentTarget.style.color = "#C9A96E"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"
              e.currentTarget.style.color = "#F0ECE3"
            }}
          >
            Verified Profiles ↗
          </a>
        </motion.div>
      </div>
    </section>
  )
}
