'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true
      })
    } catch (error) {
      console.error('Google sign in error:', error)
    }
  }

  return (
    <Button 
      onClick={handleSignIn}
      variant="outline"
      className="w-full flex items-center gap-2"
    >
      Sign in with Google
    </Button>
  )
} 