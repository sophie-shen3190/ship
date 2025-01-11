// apps/web/app/api/music/generate/route.ts
import { NextResponse } from 'next/server'

const API_TOKEN = process.env.AI_MUSIC_API_TOKEN || 'sk-222222222222222222222222222'
const USER_ID = process.env.AI_MUSIC_USER_ID || '413564'
const BASE_URL = process.env.AI_MUSIC_BASE_URL || 'https://dzwlai.com/apiuser/_open/suno'

console.log('API_TOKEN----------------------', API_TOKEN)
console.log('USER_ID', USER_ID)
console.log('BASE_URL', BASE_URL)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Generating music with params:', body)

    const response = await fetch(`${BASE_URL}/music/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-token': API_TOKEN,
        'x-userId': USER_ID
      },
      body: JSON.stringify(body)
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
    console.error('Music generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate music', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
