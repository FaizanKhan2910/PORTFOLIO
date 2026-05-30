'use client'
import { useState, useEffect } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check initial width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIsMobile()

    // Add event listener
    window.addEventListener('resize', checkIsMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}
