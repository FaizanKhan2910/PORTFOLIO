// components/dsa/PlatformIcons.tsx
// High-fidelity SVG icons for LeetCode, GeeksforGeeks, and Codolio.

import React from "react"

export function LeetCodeIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.358l4.353-4.667c.54-.579.54-1.517 0-2.096a1.374 1.374 0 0 0-1-.438z"
        fill="#FFA116"
      />
      <path
        d="M20.24 12.393h-9.98c-.76 0-1.375.615-1.375 1.375s.615 1.375 1.375 1.375h9.98c.76 0 1.375-.615 1.375-1.375s-.615-1.375-1.375-1.375z"
        fill="#B3B3B3"
      />
    </svg>
  )
}

export function GeeksforGeeksIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20.89 9.17c-.55-1.53-1.63-2.61-3.17-3.17-1.15-.42-3.1-.42-5.72-.42s-4.57 0-5.72.42C4.74 6.56 3.66 7.64 3.11 9.17 2.69 10.32 2.69 12.27 2.69 14.89s0 4.57.42 5.72c.55 1.53 1.63 2.61 3.17 3.17 1.15.42 3.1.42 5.72.42s4.57 0 5.72-.42c1.54-.56 2.62-1.64 3.17-3.17.42-1.15.42-3.1.42-5.72s0-4.57-.42-5.72z"
        fill="#0E1E12"
      />
      {/* Characteristic GFG twin curls in signature emerald green */}
      <path
        d="M8.2 14.4c0-1.7 1.3-3.1 3-3.1.9 0 1.7.4 2.2 1l-1 1c-.3-.4-.8-.6-1.2-.6-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8c.8 0 1.4-.5 1.7-1.2H11.2v-1.3h3.2v2.7c-.7 1-1.8 1.6-3.1 1.6-1.8 0-3.1-1.5-3.1-3.7zm7.6 0c0-1.7 1.3-3.1 3-3.1.9 0 1.7.4 2.2 1l-1 1c-.3-.4-.8-.6-1.2-.6-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8c.8 0 1.4-.5 1.7-1.2H18.8v-1.3h3.2v2.7c-.7 1-1.8 1.6-3.1 1.6-1.8 0-3.1-1.5-3.1-3.7z"
        fill="#2F8D46"
      />
    </svg>
  )
}

export function CodolioIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="6" fill="#131326" />
      <path
        d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 6l-4 12"
        stroke="#818CF8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
