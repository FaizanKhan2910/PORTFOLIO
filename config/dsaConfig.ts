// config/dsaConfig.ts
// Central single-source-of-truth configuration for Faizan Khan's DSA Section.
// Easily update problem counts and platform links here.

export interface PlatformProfile {
  name: string
  id: string
  url: string
  handle: string
  badge: string
  description: string
  color: string
}

export interface DsaConfig {
  name: string
  totalSolved: number
  totalSolvedDisplay: string
  headline: string
  subheadline: string
  eyebrow: string
  quote: string
  platforms: PlatformProfile[]
  coreTopics: {
    title: string
    category: string
    description: string
    pattern: string
  }[]
}

export const DSA_CONFIG: DsaConfig = {
  name: "Faizan Khan",
  totalSolved: 435,
  totalSolvedDisplay: "435+",
  eyebrow: "DSA JOURNEY / 001",
  headline: "THE ART OF PROBLEM SOLVING.",
  subheadline: "435+ problems solved. One problem at a time. Always getting better.",
  quote: "Every problem is a new perspective. Breaking complex constraints into optimal time and space complexity.",
  platforms: [
    {
      name: "LeetCode",
      id: "leetcode",
      url: "https://leetcode.com/u/Faizan__Khan2910/",
      handle: "Faizan__Khan2910",
      badge: "Verified Profile",
      description: "Algorithmic challenges, data structure implementations, and competitive coding problem sets.",
      color: "#FFA116",
    },
    {
      name: "GeeksforGeeks",
      id: "geeksforgeeks",
      url: "https://www.geeksforgeeks.org/profile/fk63076v1z8?tab=activity",
      handle: "fk63076v1z8",
      badge: "Verified Profile",
      description: "Core computer science fundamentals, DSA problem of the day, and company-specific coding tracks.",
      color: "#2F8D46",
    },
    {
      name: "Codolio",
      id: "codolio",
      url: "https://codolio.com/profile/Faizankhan2910/",
      handle: "Faizankhan2910",
      badge: "Verified Profile",
      description: "Aggregated problem-solving analytics, portfolio tracking, and cross-platform verification.",
      color: "#6366F1",
    },
  ],
  coreTopics: [
    {
      title: "Arrays & Strings",
      category: "Fundamental",
      description: "Prefix sums, in-place manipulation, two-pass techniques, and frequency mapping.",
      pattern: "Kadane's, Sliding Window, Dutch National Flag",
    },
    {
      title: "Two Pointers",
      category: "Optimization",
      description: "Shrinking search boundaries, collision pointers, and fast/slow pointer cycle detection.",
      pattern: "Two-Sum II, Container With Most Water, 3Sum",
    },
    {
      title: "Sliding Window",
      category: "Optimization",
      description: "Fixed and dynamic contiguous subarrays with monotonic queues and hash maps.",
      pattern: "Longest Substring Without Repeating, Minimum Window Substring",
    },
    {
      title: "Binary Search",
      category: "Logarithmic Search",
      description: "Searching monotonic spaces, condition boundaries, and search-on-answer problems.",
      pattern: "Search in Rotated Sorted Array, Peak Element, Koko Eating Bananas",
    },
    {
      title: "Stacks & Queues",
      category: "Linear Structure",
      description: "Monotonic stacks for next-greater element, bracket validation, and LIFO/FIFO pipelines.",
      pattern: "Daily Temperatures, Largest Rectangle in Histogram, Min Stack",
    },
    {
      title: "Linked Lists",
      category: "Pointer Graph",
      description: "Reversals, fast & slow pointers, merge operations, and cycle detection.",
      pattern: "Reverse K-Group, Merge Two Sorted Lists, Copy List with Random Pointer",
    },
    {
      title: "Trees & Graphs",
      category: "Hierarchical",
      description: "DFS/BFS traversals, lowest common ancestor, topological sorting, and Dijkstra.",
      pattern: "Binary Tree Maximum Path Sum, Word Ladder, Course Schedule",
    },
    {
      title: "Dynamic Programming",
      category: "Subproblem Optimization",
      description: "Memoization and bottom-up tabulation for optimal substructure and overlapping problems.",
      pattern: "0/1 Knapsack, Longest Increasing Subsequence, Coin Change",
    },
  ],
}
