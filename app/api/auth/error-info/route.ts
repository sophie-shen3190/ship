import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get('error')

  // 获取详细的错误信息
  const errorInfo = {
    error,
    timestamp: new Date().toISOString(),
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? '已设置' : '未设置',
      AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? '已设置' : '未设置',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '已设置' : '未设置',
      AUTH_SECRET: process.env.AUTH_SECRET ? '已设置' : '未设置',
    },
    // 添加其他可能有用的调试信息
    headers: Object.fromEntries(request.headers),
  }

  return NextResponse.json(errorInfo)
} 