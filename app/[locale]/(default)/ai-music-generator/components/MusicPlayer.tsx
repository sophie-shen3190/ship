'use client'
import { useEffect, useRef, useState } from 'react'
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { cn } from '@/components/ui/cn'

interface MusicPlayerProps {
  audioUrl?: string
  coverUrl?: string
  title?: string
  artist?: string
}

export function MusicPlayer({ audioUrl, coverUrl, title = 'Unknown Title', artist = 'Unknown Artist' }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 当 audioUrl 改变时重置播放状态
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time) || time < 0) return 'Generating...'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  // 音频播放结束时的处理
  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className='flex flex-col h-full p-6'>
      {/* 音乐封面区域 */}
      <div className='flex-1 flex items-center justify-center relative'>
        {/* 模糊背景 */}
        {/* <div
          className='absolute inset-0 blur-1xl '
          style={{
            backgroundImage: `url(${coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1)' // 稍微放大背景以避免模糊边缘
          }}
        /> */}

        <div className={cn('relative w-64 h-64', isPlaying && 'scale-105')}>
          {coverUrl ? (
            <div className='relative w-full h-full'>
              {/* 黑胶唱片底座 */}
              <div
                className={cn(
                  'absolute inset-0 rounded-full bg-gray-900',
                  "before:content-[''] before:absolute before:inset-0 before:rounded-full",
                  'before:bg-gradient-to-br before:from-gray-800 before:to-gray-950',
                  'shadow-xl'
                )}
              />

              {/* 唱片主体 - 确保完美圆形 */}
              <div
                className={cn(
                  'absolute inset-2 rounded-full bg-gray-900',
                  'flex items-center justify-center',
                  // 'aspect-square', // 确保宽高比为1:1
                  isPlaying && 'animate-spin-slow'
                )}>
                {/* 封面图片容器 */}

                <img src={coverUrl} alt='Album Cover' className='w-[200px] h-[200px] rounded-[200px]' />
                {/* <div
                  className={cn(
                    'w-[85%] aspect-square', // 使用百分比宽度和固定宽高比
                    'rounded-full overflow-hidden',
                    'border-4 border-gray-900'
                  )}>
                  <div className='w-full h-full rounded-full overflow-hidden'>
                    <img src={coverUrl} alt='Album Cover' className='w-full h-full object-cover rounded-full' />
                  </div>
                </div> */}
              </div>

              {/* 唱臂 */}
              <div
                className={cn(
                  'absolute -top-4 -right-4 w-24 h-4',
                  'origin-right transition-transform duration-1000',
                  isPlaying ? 'rotate-12' : '-rotate-12'
                )}>
                <div className='absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full' />
                <div className='absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-300' />
              </div>
            </div>
          ) : (
            <div className='w-full h-full rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center'>
              <Volume2 className='w-16 h-16 text-gray-400' />
            </div>
          )}
        </div>
      </div>

      {/* 播放控制区域 */}
      <div className='mt-6 space-y-4'>
        {/* 音乐信息 */}
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-white/90'>{title}</h3>
          <p className='text-sm text-gray-400'>{artist}</p>
        </div>

        {/* 进度条 */}
        <div className='space-y-2'>
          <div className='relative'>
            <input
              type='range'
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className='w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
              style={{
                backgroundImage: `linear-gradient(to right, rgb(168 85 247) ${(currentTime / (duration || 1)) * 100}%, rgb(75 85 99) ${
                  (currentTime / (duration || 1)) * 100
                }%)`
              }}
            />
          </div>
          <div className='flex justify-between text-xs text-gray-400'>
            <span>{formatTime(currentTime)}</span>
            <span>{duration && !isNaN(duration) ? formatTime(duration) : '0:00'}</span>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className='flex items-center justify-center gap-6'>
          <button
            className='text-gray-400 hover:text-white transition-colors'
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
              }
            }}>
            <SkipBack className='w-5 h-5' />
          </button>

          <button
            onClick={togglePlay}
            disabled={!audioUrl}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all',
              audioUrl ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-700 cursor-not-allowed'
            )}>
            {isPlaying ? <Pause className='w-6 h-6' /> : <Play className='w-6 h-6' />}
          </button>

          <button
            className='text-gray-400 hover:text-white transition-colors'
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
              }
            }}>
            <SkipForward className='w-5 h-5' />
          </button>
        </div>

        {/* 音量控制 */}
        <div className='flex items-center gap-2'>
          <Volume2 className='w-4 h-4 text-gray-400' />
          <input
            type='range'
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className='w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
            style={{
              backgroundImage: `linear-gradient(to right, rgb(168 85 247) ${volume * 100}%, rgb(75 85 99) ${volume * 100}%)`
            }}
          />
        </div>
      </div>

      {/* 音频元素 */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}
    </div>
  )
}
