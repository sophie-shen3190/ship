'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthError() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    console.log('Auth Error:', {
      error,
      params: Object.fromEntries(searchParams.entries())
    })

    // 获取详细错误信息
    fetch('/api/auth/error-info')
      .then(res => res.json())
      .then(data => {
        console.log('Error details:', data)
        setErrorDetails(data)
      })
      .catch(err => console.error('Failed to fetch error details:', err))

    setError(error)
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-red-50 p-8">
        <h1 className="mb-4 text-2xl font-bold text-red-800">认证错误</h1>
        <div className="text-red-600">
          <p>错误类型: {error}</p>
          {errorDetails && (
            <div className="mt-4">
              <p>详细信息:</p>
              <pre className="mt-2 rounded bg-red-100 p-4">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 