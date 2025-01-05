'use client'

import { Button } from '@ui/components/button'
import { cn } from '@ui/lib'
import { useEffect, useRef, useState } from 'react'
import MusicEdit, { TaskResponse } from '../../(home)/components/MusicEdit'
import { MusicPlayer } from './MusicPlayer'
import * as Tooltip from '@radix-ui/react-tooltip'
import { getPresetResponse } from './json/presetResponses'
import { Download, Loader2 } from 'lucide-react'

// 获取音乐
// 如果 cld2AudioUrl 的格式如下，说明是流式音乐，还没完全生成完毕
//  "cld2AudioUrl": "https://audiopipe.suno.ai/?item_id=cb8fc763-1469-493b-87de-f86467e100fe",
// 如果 cld2AudioUrl 的格式结尾为 .mp3 说明已经生成完毕
//  "cld2AudioUrl": "https://file.dzwlai.com/suno/music/api/000/008/400/cb8fc763-1469-493b-87de-f86467e100fe.mp3?v=30",

interface Props {
  batchId?: string
}

interface TaskItem {
  id: string
  inputType: string
  prompt: string
  title: string
  tags: string
  clipId: string
  progress: number
  continueClipId: string
  status: number
  cld2AudioUrl: string
  cld2VideoUrl: string
  progressMsg: string
  cld2ImageUrl: string
}

export default function CreatePage({ batchId }: Props) {
  const [selectedSong, setSelectedSong] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [batchIdItems, setBatchIdItems] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSelectItem = useRef<any>(null)

  // 判断是否是模拟的数据，主页上面的
  const isPresetId = (id: string) => {
    return /^1074794245686558(00[1-8])$/.test(id)
  }

  // const getPresetResponse = (id: string): any => {
  //   return {
  //     data: {
  //       items: [
  //         {
  //           id: '1867917589846528001',
  //           inputType: '10',
  //           makeInstrumental: false,
  //           prompt:
  //             '[Verse]\n星星闪烁在无尽夜空\n爱情缓缓洒落在心中\n城市喧嚣渐渐被风吹走\n我们肩并肩走在平坦的路\n[Verse 2]\n烟花绽放在我们的天空\n和平的信号在心间涌动\n手牵手超越时间的枷锁\n彼此相伴是我们的承诺\n[Chorus]\n爱与和平在前进的脚步中\n迷失自我在幸福的旅途中\n天使歌唱在心灵的舞台上\n希望的光照亮每一个方向\n[Bridge]\n所有的悲伤如浮云飘散\n希望的种子在心田里发芽\n你我的笑容映在阳光下\n携手迈向崭新的未来\n[Chorus]\n爱与和平在前进的脚步中\n迷失自我在幸福的旅途中\n天使歌唱在心灵的舞台上\n希望的光照亮每一个方向\n[Verse 3]\n我们飞翔在无尽的天空\n梦的翅膀带来美好的期盼\n拥抱未来没有任何阻挡\n爱与和平在每一次呼吸间',
  //           gptDescriptionPrompt: '来一首关于：love and peace的歌曲，我对歌曲的风格要求是pop',
  //           title: '爱与和平',
  //           tags: 'modern, pop',
  //           clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
  //           progress: 21,
  //           continueClipId: '',
  //           status: 20,
  //           cld2AudioUrl: 'https://audiopipe.suno.ai/?item_id=67ddc1c9-87da-4d31-b708-2338ac4cf66c',
  //           cld2VideoUrl: '',
  //           progressMsg: '努力生成音乐，预计3-6分钟',
  //           cld2ImageUrl: 'https://file.dzwlai.com/suno/music/api/000/008/400/67ddc1c9-87da-4d31-b708-2338ac4cf66c.jpeg?v=93'
  //         }
  //       ]
  //     }
  //   }
  // }

  const handleParams = async () => {
    if (!batchId) return

    const checkUrlsComplete = (items: any[]) => {
      return items.every((item) => item.cld2AudioUrl?.includes('.mp3') && item.cld2VideoUrl?.includes('.mp4'))
    }

    let isFirstLoad = true

    const pollData = async () => {
      if (isFirstLoad) {
        setIsLoading(true)
        isFirstLoad = false
      }

      try {
        let data: any

        // 检查是否是预设 ID
        if (isPresetId(batchId)) {
          data = getPresetResponse(batchId)
        } else {
          // 如果不是预设 ID，则正常请求 API
          const response = await fetch(`/api/music/status?taskBatchId=${batchId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch music data')
          }
          data = await response.json()
        }

        setIsLoading(false)

        const items = data?.data?.items ?? []

        if (items.length > 0) {
          setBatchIdItems(items)

          if (currentSelectItem.current) {
            // 找到当前选中歌曲的更新数据
            const updatedSelectedItem = items.find((item: any) => item.id === currentSelectItem.current.id)
            if (updatedSelectedItem) {
              console.log('faith=============updatedSelectedItem', updatedSelectedItem)
              setSelectedItem(updatedSelectedItem)
            }
          } else {
            // 只有在没有选中歌曲时才设置第一首
            currentSelectItem.current = items[0]
            setSelectedItem(items[0])
          }

          // 检查是否所有 URL 都已生成
          if (!checkUrlsComplete(items)) {
            // 如果未完成，10秒后重新请求
            setTimeout(pollData, 10000)
          }
        } else {
          setError('No music items found')
          setBatchIdItems([])
          setSelectedItem(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching music data:', err)
        setBatchIdItems([])
        setSelectedItem(null)
      } finally {
        if (isFirstLoad) {
          setIsLoading(false)
        }
      }
    }

    // 开始轮询
    pollData()
  }

  const handleDownload = async (url: string, fileType: 'audio' | 'video', title: string) => {
    try {
      const response = await fetch('/api/music/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      // 生成时间戳 格式如：20231211_1430 (年月日_时分)
      const now = new Date()
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(
        2,
        '0'
      )}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${title}_${timestamp}.${fileType === 'audio' ? 'mp3' : 'mp4'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  useEffect(() => {
    handleParams()
    return () => {}
  }, [])

  return (
    <div className='grid grid-cols-12 gap-6 h-full bg-gradient-to-br from-purple-900/20 to-gray-900/20 p-3'>
      {/* 左侧编辑区 - 使用 MusicEdit 组件 */}
      <div className=' col-span-3 rounded-xl border border-gray-800 bg-gray-900/50 pt-3'>
        <MusicEdit batchId={batchId} />
      </div>

      {/* 中间列表区 */}
      {/* 中间播放器区 */}
      <div className='col-span-5 rounded-xl border border-gray-800 bg-gray-900/50'>
        {isLoading ? (
          <div className='flex items-center justify-center h-full'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500' />
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-full text-red-400'>{error}</div>
        ) : selectedItem ? (
          <MusicPlayer
            audioUrl={selectedItem.cld2AudioUrl}
            coverUrl={selectedItem.cld2ImageUrl}
            title={selectedItem.title}
            artist={'Unknown Artist'}
          />
        ) : (
          <div className='flex items-center justify-center h-full text-gray-400'>No music selected</div>
        )}
      </div>

      {/* 右侧预览区 */}
      <div className='col-span-4 rounded-xl border border-gray-800 bg-gray-900/50 flex flex-col'>
        <div className='flex-1 overflow-auto bg-[#1C1F26]'>
          {/* 添加深色背景 */}
          {batchIdItems.map((item: any, index: any) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-4 p-4 cursor-pointer border-b border-[#2A2D36]/50 transition-all duration-300',
                'hover:bg-gradient-to-r hover:from-[#2A2D36]/30 hover:to-[#1C1F26]/30',
                'group relative',
                selectedSong === item.id && 'bg-gradient-to-r from-[#9D5BF0]/10 to-[#F5567C]/10' // 使用紫色到粉色的渐变
              )}
              onClick={() => {
                setSelectedSong(item.id)
                setSelectedItem(batchIdItems[index])
                currentSelectItem.current = batchIdItems[index]
              }}>
              {/* 封面图片 */}
              <div className='relative w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden group-hover:shadow-lg group-hover:shadow-[#9D5BF0]/10 transition-shadow'>
                <div className='absolute inset-0 bg-[#2A2D36] animate-pulse' />
                {item.cld2ImageUrl && (
                  <img
                    src={item.cld2ImageUrl}
                    alt={item.title}
                    className='absolute inset-0 w-full h-full object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500'
                  />
                )}
              </div>

              {/* 歌曲信息 */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-[#E4E6EB] group-hover:text-white transition-colors'>{item.title}</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs rounded-full text-[#9DA3B4]',
                      'bg-[#2A2D36]/50 group-hover:bg-gradient-to-r from-[#9D5BF0]/20 to-[#F5567C]/20',
                      'transition-all duration-300'
                    )}>
                    {item.inputType === '20' ? '灵感' : '默认风格'}
                  </span>
                </div>

                {/* Prompt预览 */}
                <Tooltip.Provider delayDuration={200}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <div className='text-xs text-[#9DA3B4] truncate mt-1 cursor-help'>{item.prompt?.slice(0, 60)}...</div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className={cn(
                          'max-w-[400px] p-4 rounded-lg',
                          'bg-[#1C1F26]/95 backdrop-blur-sm',
                          'shadow-xl shadow-[#9D5BF0]/10',
                          'text-xs text-[#E4E6EB]',
                          'border border-[#2A2D36]/50',
                          'animate-in fade-in-0 zoom-in-95 duration-200'
                        )}
                        side='top'
                        sideOffset={5}>
                        <div className='whitespace-pre-wrap'>{item.prompt}</div>
                        <Tooltip.Arrow className='fill-[#1C1F26]/95' />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>

                <div className='text-xs text-[#9DA3B4] truncate mt-1'>{item.tags || 'No tags'}</div>
              </div>

              {/* 下载按钮 */}
              <div key={index} className='relative z-10 flex gap-2'>
                {item?.cld2AudioUrl?.includes('.mp3') ? (
                  <div
                    onClick={() => handleDownload(item.cld2AudioUrl, 'audio', item.title)}
                    className='flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer'>
                    <Download className='w-4 h-4' />
                    <span>Audio</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-800/50'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Audio</span>
                  </div>
                )}

                {item?.cld2VideoUrl?.includes('.mp4') ? (
                  <div
                    onClick={() => handleDownload(item.cld2VideoUrl, 'video', item.title)}
                    className='flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer'>
                    <Download className='w-4 h-4' />
                    <span>Video</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-800/50'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Video</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
