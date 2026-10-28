// components/dsa/DsaCta.tsx
'use client'

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { DSA_CONFIG } from "@/config/dsaConfig"

export default function DsaCta() {
  return (
    <section
      style={{
        position: "relative",
        padding: "120px 24px 140px",
        background: "linear-gradient(180deg, #08080A 0%, #050507 100%)",
        textAlign: "center",
        overflow: "hidden",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Background ambient gold ring */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "300px",
          background: "radial-gradient(circle, rgba(201, 169, 110, 0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            style={{
              fontFamily: "var(--font-space), monospace",
              fontSize: "11px",
              letterSpacing: "3px",
              color: "#C9A96E",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "16px",
            }}
          >
            Always Building · Always Optimizing
          </span>

          <h2
            style={{
              fontFamily: "var(--font-space), sans-serif",
              fontSize: "clamp(30px, 4.5vw, 54px)",
              fontWeight: 700,
              color: "#F0ECE3",
              letterSpacing: "-1px",
              lineHeight: 1.15,
              margin: "0 0 20px 0",
              textTransform: "uppercase",
            }}
          >
            EVERY PROBLEM IS A NEW PERSPECTIVE.
          </h2>

          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#9A9592",
              maxWidth: "600px",
              margin: "0 auto 48px auto",
            }}
          >
            “Explore my solutions, follow the journey, and see how I approach problems.”
          </p>

          {/* 3 Explore Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "48px",
            }}
          >
            <a
              href={DSA_CONFIG.platforms[0].url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space), monospace",
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "14px 24px",
                borderRadius: "6px",
                background: "rgba(255, 161, 22, 0.12)",
                border: "1px solid rgba(255, 161, 22, 0.4)",
                color: "#FFA116",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 161, 22, 0.2)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 161, 22, 0.12)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Explore LeetCode ↗
            </a>

            <a
              href={DSA_CONFIG.platforms[1].url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space), monospace",
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "14px 24px",
                borderRadius: "6px",
                background: "rgba(47, 141, 70, 0.15)",
                border: "1px solid rgba(47, 141, 70, 0.4)",
                color: "#4ADE80",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(47, 141, 70, 0.25)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(47, 141, 70, 0.15)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Explore GeeksforGeeks ↗
            </a>

            <a
              href={DSA_CONFIG.platforms[2].url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space), monospace",
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "14px 24px",
                borderRadius: "6px",
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                color: "#A5B4FC",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.25)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Explore Codolio ↗
            </a>
          </div>

          {/* Return to Portfolio Home Link */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-space), monospace",
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#C9A96E",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(201, 169, 110, 0.25)",
                background: "rgba(201, 169, 110, 0.05)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201, 169, 110, 0.15)"
                e.currentTarget.style.borderColor = "#C9A96E"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(201, 169, 110, 0.05)"
                e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.25)"
              }}
            >
              <span>←</span>
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
