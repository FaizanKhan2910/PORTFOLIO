import { NextResponse } from 'next/server'

// Codolio has no public JSON API - it's a CSR Next.js app.
// fetchCodolioData returns null to trigger honest fallback.
// Replace this function when/if Codolio exposes a real API.
const MANUAL_COUNT = 435
const CACHE_TTL_MS = 60 * 60 * 1000

let cache: { total: number; source: string; updatedAt: number } | null = null

async function fetchCodolioData(): Promise<{ total: number; source: string } | null> {
  return null
}

export async function GET() {
  if (cache && Date.now() - cache.updatedAt < CACHE_TTL_MS) {
    return NextResponse.json({ total: cache.total, source: cache.source, updatedAt: new Date(cache.updatedAt).toISOString(), cached: true })
  }
  const live = await fetchCodolioData()
  const result = live ?? { total: MANUAL_COUNT, source: 'manual' }
  cache = { ...result, updatedAt: Date.now() }
  return NextResponse.json({ total: cache.total, source: cache.source, updatedAt: new Date(cache.updatedAt).toISOString(), cached: false })
}
