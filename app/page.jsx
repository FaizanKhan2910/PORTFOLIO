'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Cursor from '@/components/Cursor'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Work from '@/components/Work'
import Achievements from '@/components/Achievements'
import Stack from '@/components/Stack'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) {
      // Reveal on scroll
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('visible')
        }),
        { threshold: 0.1 }
      )
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
      return () => observer.disconnect()
    }
  }, [loaded])

  return (
    <>
      <Cursor />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <div style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: loaded ? 'all' : 'none'
      }}>
        <Navbar />
        <Hero />
        <About />
        <Work />
        <Achievements />
        <Stack />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
