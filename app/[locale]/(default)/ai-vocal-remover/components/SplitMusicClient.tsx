'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload } from './Upload'
import { WaveformLoader } from './WaveformLoader'
import { StemTrack } from './StemTrack'

interface StemResult {
  id: string
  title: string
  status: number
  progress: number
  progressMsg: string
  cld2AudioUrl: string
}

export default function SplitMusicClient() {
  const [isUploading, setIsUploading] = useState(false)
  const [taskBatchId, setTaskBatchId] = useState<string>('')
  const [stems, setStems] = useState<StemResult[]>([])
  const [originalAudio, setOriginalAudio] = useState<string>('')
  const [error, setError] = useState('')

  const pollInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (originalAudio) {
        URL.revokeObjectURL(originalAudio)
      }
      stopPolling()
    }
  }, [originalAudio])

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should not exceed 10MB')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const localUrl = URL.createObjectURL(file)
      setOriginalAudio(localUrl)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/music/split', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      if (result.code === 200) {
        setTaskBatchId(result.data.taskBatchId)
        startPolling(result.data.taskBatchId)
      } else {
        setError(result.msg || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const checkProgress = async (batchId: string) => {
    try {
      const response = await fetch(`/api/music/status?taskBatchId=${batchId}`, {
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch status')
      }

      const result = await response.json()

      if (result.code === 200) {
        setStems(result.data.items)

        if (result.data.items.every((item: any) => item.status === 30)) {
          stopPolling()
        }
      }
    } catch (err) {
      setError('Failed to check progress')
      stopPolling()
    }
  }

  const startPolling = (batchId: string) => {
    stopPolling()
    pollInterval.current = setInterval(() => checkProgress(batchId), 2000)
  }

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current)
      pollInterval.current = null
    }
  }

  useEffect(() => {
    return () => stopPolling()
  }, [])

  return (
    <>
      {!stems.length && <Upload isUploading={isUploading} onUpload={handleFileUpload} error={error} />}

      {isUploading && <WaveformLoader />}

      {stems.length > 0 && (
        <div className='space-y-6'>
          {/* 显示原始音频 */}
          <div className='border border-gray-700 rounded-lg p-4 bg-gray-800/50'>
            <h3 className='text-lg font-medium text-purple-400 mb-2'>Original Track</h3>
            <StemTrack
              key='original'
              stem={{
                id: 'original',
                title: 'Original Audio',
                status: 30,
                progress: 100,
                progressMsg: 'Complete',
                cld2AudioUrl: originalAudio
              }}
            />
          </div>

          {/* 分离的音轨 */}
          <div className='border border-gray-700 rounded-lg p-4 bg-gray-800/50'>
            <h3 className='text-lg font-medium text-purple-400 mb-2'>Separated Tracks</h3>
            <div className='space-y-4'>
              {stems.map((stem) => (
                <StemTrack key={stem.id} stem={stem} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
