// apps/web/app/api/music/generate/route.ts
import { NextResponse } from 'next/server'

const API_TOKEN = process.env.AI_MUSIC_API_TOKEN || 'sk-b37bf1237a3b45788c9569ebccc03a88'
const USER_ID = process.env.AI_MUSIC_USER_ID || '413564'
const BASE_URL = process.env.AI_MUSIC_BASE_URL || 'https://dzwlai.com/apiuser/_open/suno'


export async function POST(req: Request) {
  try {
    const body = await req.json()

    const response = await fetch(`${BASE_URL}/music/generateLyrics`, {
      method: 'POST',
      headers: {
        'x-token': API_TOKEN!,
        'x-userId': USER_ID!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate music' }, { status: 500 })
  }
}
