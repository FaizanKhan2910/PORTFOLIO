// components/dsa/DsaJourney.tsx
'use client'

import React, { useState } from "react"
import { motion } from "framer-motion"
import { DSA_CONFIG } from "@/config/dsaConfig"

export default function DsaJourney() {
  const [selectedTopic, setSelectedTopic] = useState<number>(0)

  return (
    <section
      id="journey"
      style={{
        position: "relative",
        padding: "100px 24px 120px",
        background: "#08080A",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", letterSpacing: "3px", color: "#7A7572" }}>
              03
            </span>
            <div style={{ height: "1px", width: "40px", background: "#C9A96E33" }} />
            <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", letterSpacing: "3px", color: "#C9A96E", textTransform: "uppercase" }}>
              Curated Problem Domains
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-space), sans-serif",
              fontSize: "clamp(26px, 3.5vw, 42px)",
              fontWeight: 700,
              color: "#F0ECE3",
              letterSpacing: "-0.5px",
              margin: 0,
            }}
          >
            THE WORK BEHIND THE SOLUTIONS
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "15px",
              color: "#8A8582",
              marginTop: "8px",
              maxWidth: "620px",
              lineHeight: 1.6,
            }}
          >
            Systematic exploration across essential algorithmic patterns. Every topic represents hours of deep constraint analysis and optimization.
          </p>
        </div>

        {/* ── Metric Callout Row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "56px",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(201, 169, 110, 0.3)",
            }}
          >
            <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#C9A96E", letterSpacing: "2px", textTransform: "uppercase" }}>
              Primary Verified Total
            </div>
            <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "40px", fontWeight: 700, color: "#F0ECE3", margin: "8px 0" }}>
              {DSA_CONFIG.totalSolvedDisplay}
            </div>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "#8A8582" }}>
              Verified problems solved across LeetCode, GeeksforGeeks, and Codolio.
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#7A7572", letterSpacing: "2px", textTransform: "uppercase" }}>
              Platform Verification
            </div>
            <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "40px", fontWeight: 700, color: "#F0ECE3", margin: "8px 0" }}>
              3 Hubs
            </div>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "#8A8582" }}>
              Direct live profile links to ensure 100% genuine data authenticity.
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#7A7572", letterSpacing: "2px", textTransform: "uppercase" }}>
              Core Pattern Domains
            </div>
            <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "40px", fontWeight: 700, color: "#F0ECE3", margin: "8px 0" }}>
              8 Tracks
            </div>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "#8A8582" }}>
              From two pointers and binary search to trees and dynamic programming.
            </div>
          </div>
        </div>

        {/* ── Interactive Pattern Navigator ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: "28px",
          }}
          className="dsa-journey-grid"
        >
          {/* Topic List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {DSA_CONFIG.coreTopics.map((topic, idx) => {
              const isSelected = selectedTopic === idx
              return (
                <button
                  key={topic.title}
                  onClick={() => setSelectedTopic(idx)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "8px",
                    background: isSelected ? "rgba(201, 169, 110, 0.12)" : "rgba(255, 255, 255, 0.02)",
                    border: isSelected ? "1px solid #C9A96E" : "1px solid rgba(255, 255, 255, 0.06)",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.3)"
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"
                    }
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "14px", fontWeight: 700, color: isSelected ? "#F0ECE3" : "#C0BCB8" }}>
                      {topic.title}
                    </div>
                    <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", color: isSelected ? "#C9A96E" : "#666", marginTop: "4px" }}>
                      {topic.category}
                    </div>
                  </div>
                  <span style={{ color: isSelected ? "#C9A96E" : "#444", fontSize: "14px" }}>
                    →
                  </span>
                </button>
              )
            })}
          </div>

          {/* Detailed Topic Detail Viewer */}
          <div
            style={{
              borderRadius: "14px",
              background: "linear-gradient(180deg, rgba(16, 16, 20, 0.85) 0%, rgba(10, 10, 12, 0.95) 100%)",
              border: "1px solid rgba(201, 169, 110, 0.22)",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {DSA_CONFIG.coreTopics[selectedTopic] && (
              <div>
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-space), monospace",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#C9A96E",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    background: "rgba(201, 169, 110, 0.1)",
                    border: "1px solid rgba(201, 169, 110, 0.25)",
                    marginBottom: "16px",
                  }}
                >
                  {DSA_CONFIG.coreTopics[selectedTopic].category}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-space), sans-serif",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#F0ECE3",
                    margin: "0 0 16px 0",
                  }}
                >
                  {DSA_CONFIG.coreTopics[selectedTopic].title}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "16px",
                    lineHeight: 1.8,
                    color: "#A19B96",
                    marginBottom: "28px",
                  }}
                >
                  {DSA_CONFIG.coreTopics[selectedTopic].description}
                </p>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    background: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "11px",
                      letterSpacing: "1.5px",
                      color: "#7A7572",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Representative Patterns & Problems
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "14px",
                      color: "#F0ECE3",
                      lineHeight: 1.6,
                    }}
                  >
                    {DSA_CONFIG.coreTopics[selectedTopic].pattern}
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: "36px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "12px", color: "#7A7572" }}>
                Grounded in actual implementations on LeetCode & GFG
              </span>

              <a
                href={DSA_CONFIG.platforms[0].url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-space), monospace",
                  fontSize: "12px",
                  color: "#C9A96E",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Inspect on LeetCode ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .dsa-journey-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
