import { NextRequest, NextResponse } from 'next/server'
import { generateDevlogDrafts } from '@/lib/github/devlog'

export const dynamic = 'force-dynamic'

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'JoshTVR'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await generateDevlogDrafts(GITHUB_USERNAME)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[github-devlog]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}
