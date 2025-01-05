// apps/web/app/api/music/status/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const API_TOKEN = process.env.AI_MUSIC_API_TOKEN || 'sk-b37bf1237a3b45788c9569ebccc03a88'
const USER_ID = process.env.AI_MUSIC_USER_ID || '413564'
const BASE_URL = process.env.AI_MUSIC_BASE_URL || 'https://dzwlai.com/apiuser/_open/suno'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const taskBatchId = searchParams.get('taskBatchId')

    if (!taskBatchId) {
      console.error('TaskBatchId is missing')
      return NextResponse.json({ error: 'TaskBatchId is required' }, { status: 400 })
    }

    console.log(`Fetching status for taskBatchId: ${taskBatchId}`)

    const response = await fetch(`${BASE_URL}/music/getState?taskBatchId=${taskBatchId}`, {
      headers: {
        'x-token': API_TOKEN,
        'x-userId': USER_ID,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error(`Error details: ${errorText}`)
      return NextResponse.json({ error: 'API request failed' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Status check failed:', error)
    return NextResponse.json(
      { error: 'Failed to get status', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
