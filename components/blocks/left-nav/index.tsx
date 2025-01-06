'use client'

import { useEffect, useState } from 'react'
import { Music, Speaker, Volume2, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/components/ui/cn'

const colors = {
  primary: '#DA62C4',
  primaryFrom: '#9F3BF9',
  primaryTo: '#DA62C4',
  textGray: '#4B5563'
} as const

interface LeftNavProps {
  children: React.ReactNode
}

export function LeftNav({ children }: LeftNavProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const path = window.location.pathname
    const activeIndex = navItems.findIndex((item) => item.href === path)

    if (activeIndex !== -1) {
      setActiveItem(activeIndex)
    }
  }, [])

  const navItems = [
    {
      icon: <Music className='h-6 w-6' />,
      label: 'Music generator',
      href: '/ai-music-generator'
    },
    {
      icon: <Speaker className='h-6 w-6' />,
      label: 'Vocal Isolation',
      href: '/ai-vocal-remover'
    }
  ]

  const handleNavClick = (index: number, href: string) => {
    setActiveItem(index)
    router.push(href)
  }

  return (
    <div className='flex'>
      <div
        className={cn(
          'h-screen fixed left-0 top-0 z-40 flex flex-col bg-[#212936] transition-all duration-300 ease-in-out',
          'border-r pt-24',
          isExpanded ? 'w-60' : 'w-16'
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}>
        <div className='flex flex-col space-y-2'>
          {' '}
          {/* 增加间距从 space-y-1 到 space-y-2 */}
          {navItems.map((item, index) => (
            <button
              key={index}
              // onClick={() => setActiveItem(index)}
              onClick={() => handleNavClick(index, item.href)}
              className={cn(
                'flex items-center px-4 py-3 w-full text-left relative text-base', // 增加 padding-y 从 py-2 到 py-3
                activeItem === index ? `text-[${colors.primary}]` : `text-[${colors.textGray}] hover:bg-gray-800 hover:text-white`
              )}>
              {activeItem === index && <div className='absolute left-0 top-0 h-full w-0.5' style={{ backgroundColor: colors.primary }} />}
              <span className={cn('flex items-center justify-center w-8', activeItem === index && `text-[${colors.primary}]`)}>
                {item.icon}
              </span>
              <span
                className={cn(
                  'ml-3 whitespace-nowrap overflow-hidden transition-all duration-300',
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                )}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className='mt-auto mb-4'>
          <button
            className='flex items-center px-4 py-3 w-full text-left text-base hover:opacity-90' // 同样增加 padding-y
          >
            <span className='flex items-center justify-center w-8'>
              <Crown className='h-6 w-6' />
            </span>
            <span
              className={cn(
                'ml-3 whitespace-nowrap overflow-hidden transition-all duration-300',
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              )}>
              Upgrade now
            </span>
          </button>
        </div>
      </div>

      <div className='flex-1 ml-16'>{children}</div>
    </div>
  )
}
