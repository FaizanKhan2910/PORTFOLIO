// components/dsa/DsaPlatforms.tsx
'use client'

import React from "react"
import { motion } from "framer-motion"
import { DSA_CONFIG } from "@/config/dsaConfig"
import { LeetCodeIcon, GeeksforGeeksIcon, CodolioIcon } from "./PlatformIcons"

export default function DsaPlatforms() {
  const getIcon = (id: string) => {
    switch (id) {
      case "leetcode":
        return <LeetCodeIcon size={32} />
      case "geeksforgeeks":
        return <GeeksforGeeksIcon size={32} />
      case "codolio":
        return <CodolioIcon size={32} />
      default:
        return null
    }
  }

  return (
    <section
      id="platforms"
      style={{
        position: "relative",
        padding: "80px 24px 100px",
        background: "#08080A",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: "48px", textAlign: "left" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-space), monospace",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#7A7572",
              }}
            >
              01
            </span>
            <div style={{ height: "1px", width: "40px", background: "#C9A96E33" }} />
            <span
              style={{
                fontFamily: "var(--font-space), monospace",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#C9A96E",
                textTransform: "uppercase",
              }}
            >
              Verified Coding Footprint
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-space), sans-serif",
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: 700,
              color: "#F0ECE3",
              letterSpacing: "-0.5px",
              margin: 0,
            }}
          >
            THREE PLATFORMS · ONE JOURNEY
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "15px",
              color: "#8A8582",
              marginTop: "8px",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            Live problem-solving activity across major competitive coding platforms. Click any card to inspect original verified profiles.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {DSA_CONFIG.platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              style={{
                borderRadius: "14px",
                background: "linear-gradient(180deg, rgba(18, 18, 22, 0.75) 0%, rgba(10, 10, 12, 0.95) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.45)"
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(201, 169, 110, 0.12)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {/* Top Accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "28px",
                  right: "28px",
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${platform.color}66, transparent)`,
                }}
              />

              <div>
                {/* Header: Icon + Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getIcon(platform.id)}
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "10px",
                      letterSpacing: "1.5px",
                      color: "#C9A96E",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background: "rgba(201, 169, 110, 0.08)",
                      border: "1px solid rgba(201, 169, 110, 0.2)",
                    }}
                  >
                    {platform.badge}
                  </span>
                </div>

                {/* Platform Name & Handle */}
                <h3
                  style={{
                    fontFamily: "var(--font-space), sans-serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#F0ECE3",
                    margin: "0 0 6px 0",
                  }}
                >
                  {platform.name}
                </h3>
                <div
                  style={{
                    fontFamily: "var(--font-space), monospace",
                    fontSize: "12px",
                    color: "#C9A96E",
                    letterSpacing: "0.5px",
                    marginBottom: "16px",
                  }}
                >
                  @{platform.handle}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "#9A9592",
                    margin: 0,
                  }}
                >
                  {platform.description}
                </p>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#F0ECE3",
                    textDecoration: "none",
                    fontFamily: "var(--font-space), monospace",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(201, 169, 110, 0.12)"
                    e.currentTarget.style.borderColor = "#C9A96E"
                    e.currentTarget.style.color = "#C9A96E"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"
                    e.currentTarget.style.color = "#F0ECE3"
                  }}
                >
                  <span>View Verified Profile</span>
                  <span style={{ fontSize: "13px" }}>↗</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
