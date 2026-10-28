// components/dsa/AlgorithmVisualizer.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

export type AlgorithmType = "binary-search" | "two-pointers" | "sliding-window" | "stack" | "sorting"

interface StepState {
  description: string
  pseudocodeLine: number
  highlightIndices: number[]
  leftPointer?: number
  rightPointer?: number
  midPointer?: number
  foundIndex?: number
  eliminatedRange?: [number, number]
  currentSum?: number
  targetSum?: number
  windowStart?: number
  windowEnd?: number
  maxSum?: number
  stackItems?: number[]
  swapped?: [number, number]
  sortedIndices?: number[]
  arraySnapshot?: number[]
}

export default function AlgorithmVisualizer() {
  const [activeTab, setActiveTab] = useState<AlgorithmType>("binary-search")

  // Common Controls State
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(900) // 400ms to 1600ms
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [steps, setSteps] = useState<StepState[]>([])

  // Binary Search State
  const [bsArray, setBsArray] = useState<number[]>([4, 9, 15, 23, 38, 45, 59, 72, 86, 94])
  const [bsTarget, setBsTarget] = useState<number>(45)

  // Two Pointers State
  const [tpArray, setTpArray] = useState<number[]>([2, 5, 8, 11, 14, 18, 23, 29])
  const [tpTarget, setTpTarget] = useState<number>(22)

  // Sliding Window State
  const [swArray, setSwArray] = useState<number[]>([3, 1, 5, 8, 2, 7, 4, 6])
  const [swWindowK, setSwWindowK] = useState<number>(3)

  // Stack State
  const [stackArray, setStackArray] = useState<number[]>([12, 45, 29, 64])
  const [pushInput, setPushInput] = useState<number>(53)

  // Sorting State
  const [sortArray, setSortArray] = useState<number[]>([42, 17, 89, 31, 55, 8, 64])

  // Timer Ref for auto-play
  const playTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Stop playback safely
  const stopPlayback = useCallback(() => {
    setIsPlaying(false)
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current)
      playTimerRef.current = null
    }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. GENERATE BINARY SEARCH STEPS
  // ─────────────────────────────────────────────────────────────────────────────
  const generateBinarySearchSteps = useCallback((arr: number[], target: number): StepState[] => {
    const list: StepState[] = []
    let left = 0
    let right = arr.length - 1

    list.push({
      description: `Initial state: search space spans index ${left} to ${right}. Looking for target ${target}.`,
      pseudocodeLine: 1,
      highlightIndices: [],
      leftPointer: left,
      rightPointer: right,
      arraySnapshot: [...arr],
    })

    let found = false

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const midVal = arr[mid]

      list.push({
        description: `Calculate mid = floor((${left} + ${right}) / 2) = ${mid}. arr[${mid}] is ${midVal}.`,
        pseudocodeLine: 3,
        highlightIndices: [mid],
        leftPointer: left,
        rightPointer: right,
        midPointer: mid,
        arraySnapshot: [...arr],
      })

      if (midVal === target) {
        list.push({
          description: `Target ${target} matches arr[${mid}]! Element found in O(log N) time.`,
          pseudocodeLine: 4,
          highlightIndices: [mid],
          foundIndex: mid,
          leftPointer: left,
          rightPointer: right,
          midPointer: mid,
          arraySnapshot: [...arr],
        })
        found = true
        break
      } else if (midVal < target) {
        list.push({
          description: `arr[${mid}] (${midVal}) < target (${target}). Discard left half [${left}..${mid}], set left = ${mid + 1}.`,
          pseudocodeLine: 6,
          highlightIndices: [mid],
          leftPointer: left,
          rightPointer: right,
          midPointer: mid,
          eliminatedRange: [left, mid],
          arraySnapshot: [...arr],
        })
        left = mid + 1
      } else {
        list.push({
          description: `arr[${mid}] (${midVal}) > target (${target}). Discard right half [${mid}..${right}], set right = ${mid - 1}.`,
          pseudocodeLine: 8,
          highlightIndices: [mid],
          leftPointer: left,
          rightPointer: right,
          midPointer: mid,
          eliminatedRange: [mid, right],
          arraySnapshot: [...arr],
        })
        right = mid - 1
      }
    }

    if (!found) {
      list.push({
        description: `Search space exhausted (left > right). Target ${target} is NOT present in the array.`,
        pseudocodeLine: 10,
        highlightIndices: [],
        leftPointer: left,
        rightPointer: right,
        arraySnapshot: [...arr],
      })
    }

    return list
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. GENERATE TWO POINTERS STEPS
  // ─────────────────────────────────────────────────────────────────────────────
  const generateTwoPointersSteps = useCallback((arr: number[], target: number): StepState[] => {
    const list: StepState[] = []
    let left = 0
    let right = arr.length - 1

    list.push({
      description: `Initialize Left at 0 (val ${arr[0]}), Right at ${right} (val ${arr[right]}). Seeking pair sum = ${target}.`,
      pseudocodeLine: 1,
      highlightIndices: [left, right],
      leftPointer: left,
      rightPointer: right,
      currentSum: arr[left] + arr[right],
      targetSum: target,
      arraySnapshot: [...arr],
    })

    let found = false

    while (left < right) {
      const sum = arr[left] + arr[right]

      if (sum === target) {
        list.push({
          description: `Pair found! arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${target}.`,
          pseudocodeLine: 4,
          highlightIndices: [left, right],
          foundIndex: left,
          leftPointer: left,
          rightPointer: right,
          currentSum: sum,
          targetSum: target,
          arraySnapshot: [...arr],
        })
        found = true
        break
      } else if (sum < target) {
        list.push({
          description: `Sum ${sum} < target ${target}. Since array is sorted, increment Left pointer from ${left} to ${left + 1}.`,
          pseudocodeLine: 6,
          highlightIndices: [left, right],
          leftPointer: left,
          rightPointer: right,
          currentSum: sum,
          targetSum: target,
          arraySnapshot: [...arr],
        })
        left++
      } else {
        list.push({
          description: `Sum ${sum} > target ${target}. Since array is sorted, decrement Right pointer from ${right} to ${right - 1}.`,
          pseudocodeLine: 8,
          highlightIndices: [left, right],
          leftPointer: left,
          rightPointer: right,
          currentSum: sum,
          targetSum: target,
          arraySnapshot: [...arr],
        })
        right--
      }
    }

    if (!found) {
      list.push({
        description: `Pointers met (left >= right). No pair in array sums to ${target}.`,
        pseudocodeLine: 10,
        highlightIndices: [],
        leftPointer: left,
        rightPointer: right,
        currentSum: undefined,
        targetSum: target,
        arraySnapshot: [...arr],
      })
    }

    return list
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. GENERATE SLIDING WINDOW STEPS (Max Subarray Sum of size K)
  // ─────────────────────────────────────────────────────────────────────────────
  const generateSlidingWindowSteps = useCallback((arr: number[], k: number): StepState[] => {
    const list: StepState[] = []
    if (arr.length < k) return list

    // Compute initial window
    let currentSum = 0
    for (let i = 0; i < k; i++) currentSum += arr[i]
    let maxSum = currentSum

    list.push({
      description: `Compute base window [0..${k - 1}]: sum = ${arr.slice(0, k).join(" + ")} = ${currentSum}. Max sum = ${maxSum}.`,
      pseudocodeLine: 2,
      highlightIndices: Array.from({ length: k }, (_, idx) => idx),
      windowStart: 0,
      windowEnd: k - 1,
      currentSum,
      maxSum,
      arraySnapshot: [...arr],
    })

    // Slide window
    for (let i = k; i < arr.length; i++) {
      const removed = arr[i - k]
      const added = arr[i]
      currentSum = currentSum - removed + added
      const isNewMax = currentSum > maxSum
      if (isNewMax) maxSum = currentSum

      list.push({
        description: `Slide window to [${i - k + 1}..${i}]: subtract ${removed}, add ${added}. Current sum = ${currentSum}.${isNewMax ? ` New Max: ${maxSum}!` : ` Max remains: ${maxSum}.`}`,
        pseudocodeLine: 5,
        highlightIndices: Array.from({ length: k }, (_, idx) => i - k + 1 + idx),
        windowStart: i - k + 1,
        windowEnd: i,
        currentSum,
        maxSum,
        arraySnapshot: [...arr],
      })
    }

    list.push({
      description: `Sliding window complete. The maximum subarray sum of size ${k} is ${maxSum}.`,
      pseudocodeLine: 7,
      highlightIndices: [],
      maxSum,
      arraySnapshot: [...arr],
    })

    return list
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. GENERATE STACK STEPS
  // ─────────────────────────────────────────────────────────────────────────────
  const generateStackSteps = useCallback((items: number[]): StepState[] => {
    return [
      {
        description: `Stack contains ${items.length} element(s). Top of stack is ${items[items.length - 1] ?? "empty"}. LIFO (Last-In, First-Out).`,
        pseudocodeLine: 1,
        highlightIndices: items.length > 0 ? [items.length - 1] : [],
        stackItems: [...items],
      },
    ]
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. GENERATE BUBBLE SORT STEPS
  // ─────────────────────────────────────────────────────────────────────────────
  const generateSortSteps = useCallback((initialArr: number[]): StepState[] => {
    const list: StepState[] = []
    const a = [...initialArr]
    const n = a.length
    const sorted: number[] = []

    list.push({
      description: `Initial unsorted array of size ${n}. Starting Bubble Sort comparison passes.`,
      pseudocodeLine: 1,
      highlightIndices: [],
      sortedIndices: [],
      arraySnapshot: [...a],
    })

    for (let i = 0; i < n; i++) {
      let swappedInPass = false
      for (let j = 0; j < n - i - 1; j++) {
        list.push({
          description: `Compare arr[${j}] (${a[j]}) and arr[${j + 1}] (${a[j + 1]}).`,
          pseudocodeLine: 3,
          highlightIndices: [j, j + 1],
          sortedIndices: [...sorted],
          arraySnapshot: [...a],
        })

        if (a[j] > a[j + 1]) {
          const temp = a[j]
          a[j] = a[j + 1]
          a[j + 1] = temp
          swappedInPass = true

          list.push({
            description: `arr[${j}] > arr[${j + 1}]. Swapped ${a[j + 1]} and ${a[j]}.`,
            pseudocodeLine: 4,
            highlightIndices: [j, j + 1],
            swapped: [j, j + 1],
            sortedIndices: [...sorted],
            arraySnapshot: [...a],
          })
        }
      }
      sorted.unshift(n - i - 1)
      list.push({
        description: `Pass complete. Element ${a[n - i - 1]} locked at final sorted index ${n - i - 1}.`,
        pseudocodeLine: 6,
        highlightIndices: [n - i - 1],
        sortedIndices: [...sorted],
        arraySnapshot: [...a],
      })
      if (!swappedInPass) break
    }

    list.push({
      description: `Array fully sorted in non-decreasing order! Verified.`,
      pseudocodeLine: 8,
      highlightIndices: [],
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      arraySnapshot: [...a],
    })

    return list
  }, [])

  // Re-generate steps whenever tab or parameters change
  useEffect(() => {
    stopPlayback()
    let generated: StepState[] = []
    if (activeTab === "binary-search") {
      generated = generateBinarySearchSteps(bsArray, bsTarget)
    } else if (activeTab === "two-pointers") {
      generated = generateTwoPointersSteps(tpArray, tpTarget)
    } else if (activeTab === "sliding-window") {
      generated = generateSlidingWindowSteps(swArray, swWindowK)
    } else if (activeTab === "stack") {
      generated = generateStackSteps(stackArray)
    } else if (activeTab === "sorting") {
      generated = generateSortSteps(sortArray)
    }
    setSteps(generated)
    setCurrentStepIdx(0)
  }, [
    activeTab,
    bsArray,
    bsTarget,
    tpArray,
    tpTarget,
    swArray,
    swWindowK,
    stackArray,
    sortArray,
    generateBinarySearchSteps,
    generateTwoPointersSteps,
    generateSlidingWindowSteps,
    generateStackSteps,
    generateSortSteps,
    stopPlayback,
  ])

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIdx < steps.length - 1) {
        playTimerRef.current = setTimeout(() => {
          setCurrentStepIdx((prev) => prev + 1)
        }, speedMs)
      } else {
        stopPlayback()
      }
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current)
    }
  }, [isPlaying, currentStepIdx, steps.length, speedMs, stopPlayback])

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback()
    } else {
      if (currentStepIdx >= steps.length - 1) {
        setCurrentStepIdx(0)
      }
      setIsPlaying(true)
    }
  }

  // Next / Prev step
  const handleNext = () => {
    stopPlayback()
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    stopPlayback()
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1)
    }
  }

  const handleReset = () => {
    stopPlayback()
    setCurrentStepIdx(0)
  }

  // Helper: Generate Random Arrays
  const randomizeBinarySearch = () => {
    stopPlayback()
    const set = new Set<number>()
    while (set.size < 10) set.add(Math.floor(Math.random() * 90) + 10)
    const sorted = Array.from(set).sort((a, b) => a - b)
    setBsArray(sorted)
    // 80% of the time pick an element from array, 20% pick outside
    const pickExisting = Math.random() < 0.8
    if (pickExisting) {
      setBsTarget(sorted[Math.floor(Math.random() * sorted.length)])
    } else {
      setBsTarget(99)
    }
  }

  const randomizeTwoPointers = () => {
    stopPlayback()
    const set = new Set<number>()
    while (set.size < 8) set.add(Math.floor(Math.random() * 40) + 2)
    const sorted = Array.from(set).sort((a, b) => a - b)
    setTpArray(sorted)
    // pick a valid pair sum
    const i = Math.floor(Math.random() * 4)
    const j = sorted.length - 1 - Math.floor(Math.random() * 3)
    setTpTarget(sorted[i] + sorted[j])
  }

  const randomizeSlidingWindow = () => {
    stopPlayback()
    const fresh = Array.from({ length: 8 }, () => Math.floor(Math.random() * 12) + 1)
    setSwArray(fresh)
  }

  const randomizeSorting = () => {
    stopPlayback()
    const fresh = Array.from({ length: 7 }, () => Math.floor(Math.random() * 88) + 10)
    setSortArray(fresh)
  }

  // Stack Push / Pop
  const handleStackPush = () => {
    if (stackArray.length >= 8) return
    const val = pushInput || Math.floor(Math.random() * 80) + 10
    const next = [...stackArray, val]
    setStackArray(next)
    setSteps(generateStackSteps(next))
    setCurrentStepIdx(0)
  }

  const handleStackPop = () => {
    if (stackArray.length === 0) return
    const next = stackArray.slice(0, -1)
    setStackArray(next)
    setSteps(generateStackSteps(next))
    setCurrentStepIdx(0)
  }

  const currentStep = steps[currentStepIdx] || {
    description: "Initializing visualizer state...",
    pseudocodeLine: 1,
    highlightIndices: [],
    arraySnapshot: [],
  }

  // Complexity & Pseudocode definitions
  const metaMap = {
    "binary-search": {
      title: "Binary Search",
      time: "O(log N)",
      space: "O(1)",
      best: "O(1) (middle match)",
      description: "Divides sorted search interval in half at each iteration. Eliminates exponential search space.",
      code: [
        "function binarySearch(arr, target):",
        "  left = 0, right = arr.length - 1",
        "  while left <= right:",
        "    mid = floor((left + right) / 2)",
        "    if arr[mid] == target: return mid",
        "    else if arr[mid] < target: left = mid + 1",
        "    else: right = mid - 1",
        "  return -1",
      ],
    },
    "two-pointers": {
      title: "Two Pointers",
      time: "O(N)",
      space: "O(1)",
      best: "O(1) (outer pair)",
      description: "Converging pointers from array boundaries to find pair satisfying monotonic condition.",
      code: [
        "function twoSumSorted(arr, target):",
        "  left = 0, right = arr.length - 1",
        "  while left < right:",
        "    sum = arr[left] + arr[right]",
        "    if sum == target: return [left, right]",
        "    else if sum < target: left++",
        "    else: right--",
        "  return null",
      ],
    },
    "sliding-window": {
      title: "Sliding Window",
      time: "O(N)",
      space: "O(1)",
      best: "O(N)",
      description: "Maintains a continuous subsegment frame across linear data, eliminating redundant recalculation.",
      code: [
        "function maxSubarraySum(arr, k):",
        "  currentSum = sum(arr[0..k-1]), maxSum = currentSum",
        "  for i from k to arr.length - 1:",
        "    currentSum += arr[i] - arr[i - k]",
        "    maxSum = max(maxSum, currentSum)",
        "  return maxSum",
      ],
    },
    stack: {
      title: "Stack (LIFO)",
      time: "O(1) push/pop",
      space: "O(N)",
      best: "O(1)",
      description: "Last-In, First-Out linear container. Critical for DFS, monotonic evaluation, and parsing.",
      code: [
        "class Stack:",
        "  push(item): items.append(item) // O(1)",
        "  pop(): return items.pop()     // O(1)",
        "  peek(): return items[-1]       // O(1)",
        "  isEmpty(): return len == 0",
      ],
    },
    sorting: {
      title: "Bubble Sort",
      time: "O(N²)",
      space: "O(1)",
      best: "O(N) (pre-sorted)",
      description: "Iteratively compares adjacent items and bubbles maximum values to final positions.",
      code: [
        "function bubbleSort(arr):",
        "  for i from 0 to n - 1:",
        "    for j from 0 to n - i - 2:",
        "      if arr[j] > arr[j + 1]:",
        "        swap(arr[j], arr[j + 1])",
        "    mark(n - i - 1, sorted)",
        "  return arr",
      ],
    },
  }

  const currentMeta = metaMap[activeTab]

  return (
    <section
      id="algorithm-visualizer"
      style={{
        position: "relative",
        padding: "100px 24px 120px",
        background: "#0A0A0D",
        borderTop: "1px solid rgba(201, 169, 110, 0.15)",
        borderBottom: "1px solid rgba(201, 169, 110, 0.15)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section Eyebrow & Title */}
        <div style={{ textAlign: "left", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", letterSpacing: "3px", color: "#7A7572" }}>
              02
            </span>
            <div style={{ height: "1px", width: "40px", background: "#C9A96E33" }} />
            <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", letterSpacing: "3px", color: "#C9A96E", textTransform: "uppercase" }}>
              Interactive Algorithm Lab
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
            STEP-BY-STEP PROBLEM SOLVING IN MOTION
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "15px",
              color: "#8A8582",
              marginTop: "8px",
              maxWidth: "680px",
              lineHeight: 1.6,
            }}
          >
            Interact with true algorithmic behavior. Control execution speed, step through pointer mutations, and observe real-time search space elimination.
          </p>
        </div>

        {/* ── Navigation Tabs ── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "32px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "16px",
          }}
        >
          {(
            [
              { id: "binary-search", label: "Binary Search", badge: "O(log N)" },
              { id: "two-pointers", label: "Two Pointers", badge: "O(N)" },
              { id: "sliding-window", label: "Sliding Window", badge: "O(N)" },
              { id: "stack", label: "Stack (LIFO)", badge: "O(1)" },
              { id: "sorting", label: "Sorting", badge: "O(N²)" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  stopPlayback()
                  setActiveTab(tab.id)
                }}
                style={{
                  fontFamily: "var(--font-space), monospace",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  border: isActive ? "1px solid #C9A96E" : "1px solid rgba(255, 255, 255, 0.08)",
                  background: isActive ? "rgba(201, 169, 110, 0.12)" : "rgba(255, 255, 255, 0.02)",
                  color: isActive ? "#F0ECE3" : "#8A8582",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.3)"
                    e.currentTarget.style.color = "#C9A96E"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"
                    e.currentTarget.style.color = "#8A8582"
                  }
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: isActive ? "rgba(201, 169, 110, 0.25)" : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? "#C9A96E" : "#7A7572",
                  }}
                >
                  {tab.badge}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Main Interactive Canvas & Dashboard Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "28px",
          }}
          className="dsa-dashboard-grid"
        >
          {/* LEFT: The Interactive Visualization Stage */}
          <div
            style={{
              borderRadius: "14px",
              background: "linear-gradient(180deg, rgba(16, 16, 20, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
              minHeight: "480px",
            }}
          >
            {/* Top Toolbar / Interactive Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                paddingBottom: "20px",
                marginBottom: "32px",
              }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  style={{
                    fontFamily: "var(--font-space), monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    background: isPlaying ? "#C9A96E" : "rgba(201, 169, 110, 0.15)",
                    color: isPlaying ? "#0A0A0C" : "#C9A96E",
                    border: "1px solid #C9A96E",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isPlaying ? "❚❚ Pause" : "▶ Start / Resume"}
                </button>

                {/* Step Prev */}
                <button
                  onClick={handlePrev}
                  disabled={currentStepIdx === 0}
                  style={{
                    fontFamily: "var(--font-space), monospace",
                    fontSize: "12px",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: currentStepIdx === 0 ? "#555" : "#F0ECE3",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: currentStepIdx === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  ← Prev
                </button>

                {/* Step Next */}
                <button
                  onClick={handleNext}
                  disabled={currentStepIdx >= steps.length - 1}
                  style={{
                    fontFamily: "var(--font-space), monospace",
                    fontSize: "12px",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: currentStepIdx >= steps.length - 1 ? "#555" : "#F0ECE3",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: currentStepIdx >= steps.length - 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Next Step →
                </button>

                {/* Reset */}
                <button
                  onClick={handleReset}
                  style={{
                    fontFamily: "var(--font-space), monospace",
                    fontSize: "12px",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    background: "transparent",
                    color: "#8A8582",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A96E")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8582")}
                >
                  ↺ Reset
                </button>
              </div>

              {/* Speed Slider & Custom Inputs */}
              <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#7A7572" }}>
                    Speed:
                  </span>
                  <input
                    type="range"
                    min="350"
                    max="1600"
                    step="50"
                    value={speedMs}
                    onChange={(e) => setSpeedMs(Number(e.target.value))}
                    style={{
                      width: "80px",
                      accentColor: "#C9A96E",
                      cursor: "pointer",
                    }}
                    title={`${speedMs}ms step interval`}
                  />
                  <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", color: "#C9A96E", width: "38px" }}>
                    {(1000 / speedMs).toFixed(1)}x
                  </span>
                </div>

                {/* Algorithm-Specific Generator Buttons */}
                {activeTab === "binary-search" && (
                  <button
                    onClick={randomizeBinarySearch}
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "11px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "rgba(201, 169, 110, 0.08)",
                      border: "1px solid rgba(201, 169, 110, 0.2)",
                      color: "#C9A96E",
                      cursor: "pointer",
                    }}
                  >
                    🎲 New Array
                  </button>
                )}
                {activeTab === "two-pointers" && (
                  <button
                    onClick={randomizeTwoPointers}
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "11px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "rgba(201, 169, 110, 0.08)",
                      border: "1px solid rgba(201, 169, 110, 0.2)",
                      color: "#C9A96E",
                      cursor: "pointer",
                    }}
                  >
                    🎲 New Array
                  </button>
                )}
                {activeTab === "sliding-window" && (
                  <button
                    onClick={randomizeSlidingWindow}
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "11px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "rgba(201, 169, 110, 0.08)",
                      border: "1px solid rgba(201, 169, 110, 0.2)",
                      color: "#C9A96E",
                      cursor: "pointer",
                    }}
                  >
                    🎲 New Array
                  </button>
                )}
                {activeTab === "sorting" && (
                  <button
                    onClick={randomizeSorting}
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "11px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "rgba(201, 169, 110, 0.08)",
                      border: "1px solid rgba(201, 169, 110, 0.2)",
                      color: "#C9A96E",
                      cursor: "pointer",
                    }}
                  >
                    🎲 New Array
                  </button>
                )}
              </div>
            </div>

            {/* Parameter Inputs (Target, Window K, Push/Pop) */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "32px",
                background: "rgba(255, 255, 255, 0.02)",
                padding: "12px 18px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {activeTab === "binary-search" && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "12px", color: "#C9A96E" }}>
                    Target:
                  </span>
                  <input
                    type="number"
                    value={bsTarget}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setBsTarget(v)
                    }}
                    style={{
                      width: "65px",
                      background: "#141418",
                      border: "1px solid rgba(201, 169, 110, 0.3)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: "#F0ECE3",
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "13px",
                    }}
                  />
                  <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#7A7572" }}>
                    (Type any value to search)
                  </span>
                </div>
              )}

              {activeTab === "two-pointers" && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "12px", color: "#C9A96E" }}>
                    Target Sum:
                  </span>
                  <input
                    type="number"
                    value={tpTarget}
                    onChange={(e) => setTpTarget(Number(e.target.value))}
                    style={{
                      width: "65px",
                      background: "#141418",
                      border: "1px solid rgba(201, 169, 110, 0.3)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: "#F0ECE3",
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "13px",
                    }}
                  />
                  {currentStep.currentSum !== undefined && (
                    <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "12px", color: "#8A8582" }}>
                      Current Sum: <strong style={{ color: "#F0ECE3" }}>{currentStep.currentSum}</strong>
                    </span>
                  )}
                </div>
              )}

              {activeTab === "sliding-window" && (
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "12px", color: "#C9A96E" }}>
                    Window Size (K):
                  </span>
                  <input
                    type="number"
                    min="2"
                    max="5"
                    value={swWindowK}
                    onChange={(e) => setSwWindowK(Math.min(5, Math.max(2, Number(e.target.value))))}
                    style={{
                      width: "55px",
                      background: "#141418",
                      border: "1px solid rgba(201, 169, 110, 0.3)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: "#F0ECE3",
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "13px",
                    }}
                  />
                  {currentStep.maxSum !== undefined && (
                    <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "12px", color: "#8A8582" }}>
                      Max Sum Found: <strong style={{ color: "#C9A96E" }}>{currentStep.maxSum}</strong>
                    </span>
                  )}
                </div>
              )}

              {activeTab === "stack" && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="number"
                    value={pushInput}
                    onChange={(e) => setPushInput(Number(e.target.value))}
                    style={{
                      width: "60px",
                      background: "#141418",
                      border: "1px solid rgba(201, 169, 110, 0.3)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: "#F0ECE3",
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "13px",
                    }}
                  />
                  <button
                    onClick={handleStackPush}
                    disabled={stackArray.length >= 8}
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "11px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "#C9A96E",
                      color: "#0A0A0C",
                      fontWeight: 700,
                      border: "none",
                      cursor: stackArray.length >= 8 ? "not-allowed" : "pointer",
                    }}
                  >
                    + Push
                  </button>
                  <button
                    onClick={handleStackPop}
                    disabled={stackArray.length === 0}
                    style={{
                      fontFamily: "var(--font-space), monospace",
                      fontSize: "11px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "rgba(255, 68, 68, 0.15)",
                      color: "#FF6B6B",
                      border: "1px solid rgba(255, 68, 68, 0.3)",
                      cursor: stackArray.length === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    - Pop
                  </button>
                  <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#7A7572" }}>
                    Capacity: {stackArray.length}/8
                  </span>
                </div>
              )}

              {activeTab === "sorting" && (
                <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "12px", color: "#8A8582" }}>
                  Bubble Sort · Compares adjacent pairs and bubbles the max element to the right.
                </div>
              )}

              <div style={{ marginLeft: "auto", fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#7A7572" }}>
                Step {currentStepIdx + 1} of {Math.max(1, steps.length)}
              </div>
            </div>

            {/* ── DYNAMIC ALGORITHM VIEWPORT ── */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "220px",
                padding: "20px 0",
              }}
            >
              {/* 1. BINARY SEARCH VISUALIZATION */}
              {activeTab === "binary-search" && (
                <div style={{ width: "100%", maxWidth: "780px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      flexWrap: "nowrap",
                      overflowX: "auto",
                      padding: "16px 8px 36px",
                    }}
                  >
                    {(currentStep.arraySnapshot || bsArray).map((val, idx) => {
                      const isLeft = currentStep.leftPointer === idx
                      const isRight = currentStep.rightPointer === idx
                      const isMid = currentStep.midPointer === idx
                      const isFound = currentStep.foundIndex === idx
                      const isEliminated =
                        currentStep.eliminatedRange &&
                        idx >= currentStep.eliminatedRange[0] &&
                        idx <= currentStep.eliminatedRange[1]

                      let borderColor = "rgba(255, 255, 255, 0.12)"
                      let bgColor = "rgba(255, 255, 255, 0.03)"
                      let textColor = "#F0ECE3"

                      if (isFound) {
                        borderColor = "#22C55E"
                        bgColor = "rgba(34, 197, 94, 0.2)"
                        textColor = "#4ADE80"
                      } else if (isMid) {
                        borderColor = "#C9A96E"
                        bgColor = "rgba(201, 169, 110, 0.22)"
                        textColor = "#F5D899"
                      } else if (isLeft || isRight) {
                        borderColor = "rgba(201, 169, 110, 0.6)"
                        bgColor = "rgba(201, 169, 110, 0.08)"
                      }

                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative",
                            opacity: isEliminated ? 0.25 : 1,
                            transition: "all 0.3s ease",
                          }}
                        >
                          {/* Array Cell */}
                          <div
                            style={{
                              width: "48px",
                              height: "56px",
                              borderRadius: "8px",
                              border: `1px solid ${borderColor}`,
                              background: bgColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-space), monospace",
                              fontSize: "16px",
                              fontWeight: 700,
                              color: textColor,
                              boxShadow: isFound
                                ? "0 0 20px rgba(34, 197, 94, 0.4)"
                                : isMid
                                ? "0 0 16px rgba(201, 169, 110, 0.3)"
                                : "none",
                              transition: "all 0.25s ease",
                            }}
                          >
                            {val}
                          </div>

                          {/* Index Below */}
                          <span
                            style={{
                              fontFamily: "var(--font-space), monospace",
                              fontSize: "10px",
                              color: "#666",
                              marginTop: "6px",
                            }}
                          >
                            [{idx}]
                          </span>

                          {/* Pointer Callouts */}
                          <div
                            style={{
                              position: "absolute",
                              top: "66px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "2px",
                            }}
                          >
                            {isMid && (
                              <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", fontWeight: 700, color: "#C9A96E" }}>
                                ▲ MID
                              </span>
                            )}
                            {isLeft && (
                              <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", fontWeight: 700, color: "#60A5FA" }}>
                                L
                              </span>
                            )}
                            {isRight && (
                              <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", fontWeight: 700, color: "#F43F5E" }}>
                                R
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 2. TWO POINTERS VISUALIZATION */}
              {activeTab === "two-pointers" && (
                <div style={{ width: "100%", maxWidth: "780px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      flexWrap: "nowrap",
                      overflowX: "auto",
                      padding: "16px 8px 36px",
                    }}
                  >
                    {(currentStep.arraySnapshot || tpArray).map((val, idx) => {
                      const isLeft = currentStep.leftPointer === idx
                      const isRight = currentStep.rightPointer === idx
                      const isPair = currentStep.foundIndex !== undefined && (isLeft || isRight)

                      let borderColor = "rgba(255, 255, 255, 0.12)"
                      let bgColor = "rgba(255, 255, 255, 0.03)"
                      let textColor = "#F0ECE3"

                      if (isPair) {
                        borderColor = "#22C55E"
                        bgColor = "rgba(34, 197, 94, 0.22)"
                        textColor = "#4ADE80"
                      } else if (isLeft) {
                        borderColor = "#60A5FA"
                        bgColor = "rgba(96, 165, 250, 0.15)"
                        textColor = "#93C5FD"
                      } else if (isRight) {
                        borderColor = "#F43F5E"
                        bgColor = "rgba(244, 63, 94, 0.15)"
                        textColor = "#FDA4AF"
                      }

                      return (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                          <div
                            style={{
                              width: "52px",
                              height: "60px",
                              borderRadius: "8px",
                              border: `1px solid ${borderColor}`,
                              background: bgColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-space), monospace",
                              fontSize: "18px",
                              fontWeight: 700,
                              color: textColor,
                              boxShadow: isPair ? "0 0 20px rgba(34, 197, 94, 0.4)" : "none",
                              transition: "all 0.25s ease",
                            }}
                          >
                            {val}
                          </div>
                          <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", color: "#666", marginTop: "6px" }}>
                            [{idx}]
                          </span>
                          <div style={{ position: "absolute", top: "70px", display: "flex", gap: "4px" }}>
                            {isLeft && (
                              <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", fontWeight: 700, color: "#60A5FA" }}>
                                ▲ LEFT
                              </span>
                            )}
                            {isRight && (
                              <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", fontWeight: 700, color: "#F43F5E" }}>
                                ▲ RIGHT
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 3. SLIDING WINDOW VISUALIZATION */}
              {activeTab === "sliding-window" && (
                <div style={{ width: "100%", maxWidth: "780px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      flexWrap: "nowrap",
                      overflowX: "auto",
                      padding: "16px 8px 36px",
                      position: "relative",
                    }}
                  >
                    {(currentStep.arraySnapshot || swArray).map((val, idx) => {
                      const inWindow =
                        currentStep.windowStart !== undefined &&
                        currentStep.windowEnd !== undefined &&
                        idx >= currentStep.windowStart &&
                        idx <= currentStep.windowEnd

                      return (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div
                            style={{
                              width: "52px",
                              height: "60px",
                              borderRadius: "8px",
                              border: inWindow ? "2px solid #C9A96E" : "1px solid rgba(255, 255, 255, 0.1)",
                              background: inWindow ? "rgba(201, 169, 110, 0.18)" : "rgba(255, 255, 255, 0.02)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-space), monospace",
                              fontSize: "18px",
                              fontWeight: 700,
                              color: inWindow ? "#F5D899" : "#666",
                              boxShadow: inWindow ? "0 0 24px rgba(201, 169, 110, 0.25)" : "none",
                              transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                            }}
                          >
                            {val}
                          </div>
                          <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", color: inWindow ? "#C9A96E" : "#444", marginTop: "6px" }}>
                            {inWindow ? "window" : `[${idx}]`}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 4. STACK (LIFO) VISUALIZATION */}
              {activeTab === "stack" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                  <div
                    style={{
                      width: "180px",
                      minHeight: "220px",
                      border: "2px solid rgba(201, 169, 110, 0.35)",
                      borderTop: "none",
                      borderRadius: "0 0 12px 12px",
                      background: "rgba(255, 255, 255, 0.02)",
                      display: "flex",
                      flexDirection: "column-reverse",
                      padding: "8px",
                      gap: "6px",
                      boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    <AnimatePresence>
                      {stackArray.map((item, idx) => {
                        const isTop = idx === stackArray.length - 1
                        return (
                          <motion.div
                            key={`${idx}-${item}`}
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{
                              height: "36px",
                              borderRadius: "6px",
                              background: isTop ? "rgba(201, 169, 110, 0.25)" : "rgba(255, 255, 255, 0.05)",
                              border: isTop ? "1px solid #C9A96E" : "1px solid rgba(255, 255, 255, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0 12px",
                              fontFamily: "var(--font-space), monospace",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: isTop ? "#F0ECE3" : "#8A8582",
                            }}
                          >
                            <span>{item}</span>
                            {isTop && (
                              <span style={{ fontSize: "10px", color: "#C9A96E", letterSpacing: "1px" }}>
                                TOP (LIFO)
                              </span>
                            )}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                  <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#7A7572", marginTop: "12px" }}>
                    Bottom of Stack
                  </span>
                </div>
              )}

              {/* 5. SORTING VISUALIZATION */}
              {activeTab === "sorting" && (
                <div style={{ width: "100%", maxWidth: "780px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      gap: "12px",
                      height: "180px",
                      padding: "16px 8px 10px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {(currentStep.arraySnapshot || sortArray).map((val, idx) => {
                      const isHighlighted = currentStep.highlightIndices?.includes(idx)
                      const isSorted = currentStep.sortedIndices?.includes(idx)
                      const isSwapped = currentStep.swapped?.includes(idx)

                      let barBg = "rgba(255, 255, 255, 0.1)"
                      let barBorder = "rgba(255, 255, 255, 0.2)"

                      if (isSorted) {
                        barBg = "rgba(34, 197, 94, 0.25)"
                        barBorder = "#22C55E"
                      } else if (isSwapped) {
                        barBg = "rgba(244, 63, 94, 0.35)"
                        barBorder = "#F43F5E"
                      } else if (isHighlighted) {
                        barBg = "rgba(201, 169, 110, 0.35)"
                        barBorder = "#C9A96E"
                      }

                      // normalize height up to 140px
                      const heightPx = Math.max(28, (val / 100) * 140)

                      return (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "12px", color: isHighlighted ? "#C9A96E" : "#A19B96" }}>
                            {val}
                          </span>
                          <motion.div
                            layout
                            style={{
                              width: "38px",
                              height: `${heightPx}px`,
                              borderRadius: "6px 6px 0 0",
                              background: barBg,
                              border: `1px solid ${barBorder}`,
                              borderBottom: "none",
                              boxShadow: isHighlighted ? "0 0 16px rgba(201, 169, 110, 0.3)" : "none",
                              transition: "all 0.2s ease",
                            }}
                          />
                          <span style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", color: "#555" }}>
                            [{idx}]
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status / Plain English Step Explanation */}
            <div
              style={{
                marginTop: "24px",
                padding: "16px 20px",
                borderRadius: "8px",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isPlaying ? "#22C55E" : "#C9A96E",
                  boxShadow: isPlaying ? "0 0 10px #22C55E" : "0 0 8px #C9A96E",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-space), monospace",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#F0ECE3",
                }}
              >
                {currentStep.description}
              </div>
            </div>
          </div>

          {/* RIGHT: Complexity Card & Pseudocode Tracker */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Complexity Overview Card */}
            <div
              style={{
                borderRadius: "14px",
                background: "linear-gradient(180deg, rgba(16, 16, 20, 0.85) 0%, rgba(10, 10, 12, 0.95) 100%)",
                border: "1px solid rgba(201, 169, 110, 0.22)",
                padding: "24px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-space), monospace",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#C9A96E",
                  marginBottom: "8px",
                }}
              >
                Algorithm Metrics
              </div>

              <h4
                style={{
                  fontFamily: "var(--font-space), sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#F0ECE3",
                  margin: "0 0 14px 0",
                }}
              >
                {currentMeta.title}
              </h4>

              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "13px",
                  color: "#9A9592",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                }}
              >
                {currentMeta.description}
              </p>

              {/* Time & Space Complexity Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", color: "#7A7572", textTransform: "uppercase" }}>
                    Time Complexity
                  </div>
                  <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "16px", fontWeight: 700, color: "#C9A96E", marginTop: "4px" }}>
                    {currentMeta.time}
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "10px", color: "#7A7572", textTransform: "uppercase" }}>
                    Space Complexity
                  </div>
                  <div style={{ fontFamily: "var(--font-space), monospace", fontSize: "16px", fontWeight: 700, color: "#60A5FA", marginTop: "4px" }}>
                    {currentMeta.space}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "12px", fontFamily: "var(--font-space), monospace", fontSize: "11px", color: "#7A7572" }}>
                Best Case: <span style={{ color: "#22C55E" }}>{currentMeta.best}</span>
              </div>
            </div>

            {/* Pseudocode Execution Tracker */}
            <div
              style={{
                flex: 1,
                borderRadius: "14px",
                background: "#08080A",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-space), monospace",
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#7A7572",
                  marginBottom: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Live Pseudocode Trace</span>
                <span style={{ color: "#C9A96E" }}>Line {currentStep.pseudocodeLine}</span>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-space), monospace",
                  fontSize: "12px",
                  lineHeight: 1.8,
                  color: "#8A8582",
                  overflowY: "auto",
                }}
              >
                {currentMeta.code.map((line, idx) => {
                  const lineNumber = idx + 1
                  const isCurrent = currentStep.pseudocodeLine === lineNumber

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: isCurrent ? "rgba(201, 169, 110, 0.15)" : "transparent",
                        borderLeft: isCurrent ? "2px solid #C9A96E" : "2px solid transparent",
                        color: isCurrent ? "#F0ECE3" : "#666",
                        transition: "all 0.2s ease",
                        whiteSpace: "pre",
                        overflowX: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span style={{ color: "#444", marginRight: "10px", userSelect: "none" }}>
                        {lineNumber}
                      </span>
                      {line}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .dsa-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
