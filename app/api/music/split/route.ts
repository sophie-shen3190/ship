import { NextResponse } from 'next/server'

const API_TOKEN = process.env.AI_MUSIC_API_TOKEN || 'sk-b37bf1237a3b45788c9569ebccc03a88'
const USER_ID = process.env.AI_MUSIC_USER_ID || '413564'
const BASE_URL = process.env.AI_MUSIC_BASE_URL || 'https://dzwlai.com/apiuser/_open/suno'

const API_BASE_URL = 'https://dzwlai.com/apiuser/_open/suno/music'
const HEADERS = {
  'x-token': API_TOKEN!,
  'x-userId': USER_ID!
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const apiFormData = new FormData()
    apiFormData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/stemsByAudio`, {
      method: 'POST',
      headers: HEADERS,
      body: apiFormData
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing audio:', error)
    return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 })
  }
}
