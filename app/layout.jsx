import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

export const metadata = {
  title: 'Faizan Khan — Full-Stack Developer',
  description: '3× National Hackathon Winner. Full-Stack Engineer building AI-powered products.',
  keywords: 'Full-Stack Developer, React, Node.js, AI/ML, Hackathon Winner, JSSATE',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body className="noise">{children}</body>
    </html>
  )
}
