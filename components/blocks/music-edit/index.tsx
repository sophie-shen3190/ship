'use client'
import { useEffect, useRef, useState } from 'react'
import { Wand2, X, Brush, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import mofabang from '@/app/public/mofabang.png'
import ProgressBar from './components/ProgressBar'
import { useLocale } from 'next-intl'

interface TaskItem {
  id: string
  progress: number
  status: number
  cld2AudioUrl: string
  progressMsg: string
  cld2ImageUrl: string
  inputType?: string
}

export interface TaskResponse {
  code: number
  msg: string
  data?: {
    taskBatchId: string
    items: TaskItem[]
  }
}

interface IndexProps {
  batchId?: string
}

const StyleTag = ({ text, onRemove }: { text: string; onRemove: () => void }) => (
  <span className='inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-md text-xs'>
    {text}
    <button onClick={onRemove} className='hover:text-purple-200'>
      ×
    </button>
  </span>
)

const Index = ({ batchId }: IndexProps) => {
  const router = useRouter() // 添加路由器
  const [generationMode, setGenerationMode] = useState<'custom' | 'description'>('custom')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [title, setTitle] = useState('')

  const [customStyle, setCustomStyle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [taskBatchId, setTaskBatchId] = useState<string>(batchId || '')
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [errorMessage, setErrorMessage] = useState('') // 新增错误消息 state

  const [activeCategory, setActiveCategory] = useState<string>('Genre')
  const [isExpanded, setIsExpanded] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<any>(null)

  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false)
  const [hasGeneratedLyrics, setHasGeneratedLyrics] = useState(false)
  const [originalDescription, setOriginalDescription] = useState('')

  const [isInstrumentalOnly, setIsInstrumentalOnly] = useState(false)

  const locale = useLocale()
  console.log('faith=============locale', locale)

  const fetchMusicData = async (innerBatchId: string) => {
    const response = await fetch(`/api/music/status?taskBatchId=${innerBatchId}`)
    const data: TaskResponse = await response.json()

    const { inputType, prompt, title, tags, cld2AudioUrl, cld2VideoUrl, cld2ImageUrl }: any = data.data?.items[0] || {}

    if (inputType === '20') {
      setGenerationMode('custom')
    }

    if (tags.length > 0) {
      const tagsArray = tags.split(',').filter((tag: any) => tag.trim() !== '')
      setSelectedStyles(tagsArray)
    }

    setTitle(title)
    setLyrics(prompt)
  }

  useEffect(() => {
    if (batchId) {
      fetchMusicData(batchId)
    }
  }, []) // 空依赖数组，只在组件挂载时执行

  // 在生成音乐时重置模拟进度
  // 生成音乐
  const generateMusic = async () => {
    setIsGenerating(true)
    setErrorMessage('')
    setProgress(5)

    try {
      // 根据 generationMode 构建请求体
      const requestBody: any = {
        inputType: generationMode === 'description' ? '10' : '20',
        makeInstrumental: isInstrumentalOnly.toString(),
        title: title,
        continueClipId: '',
        continueAt: '',
        mvVersion: 'chirp-v4',
        callbackUrl: ''
      }

      // 根据不同模式添加不同参数
      if (generationMode === 'description') {
        if (locale === 'zh') {
          requestBody.gptDescriptionPrompt = `来一首关于：${lyrics}的歌曲，我对歌曲的风格要求是${selectedStyles.join(',')}`
        } else {
          requestBody.gptDescriptionPrompt = ` ${lyrics}
          Musical Style: ${selectedStyles.join(', ')}`

          // requestBody.gptDescriptionPrompt = `Compose a song with these requirements:
          // Theme/Topic: ${lyrics}
          // Musical Style: ${selectedStyles.join(', ')}
          // Please create a composition that incorporates these elements while maintaining musical coherence and emotional resonance.`
        }
      } else {
        requestBody.prompt = lyrics
        requestBody.tags = selectedStyles.join(',')
      }

      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      if (data.code === 200) {
        setTaskBatchId(data.data.taskBatchId)
        pollTaskStatus(data.data.taskBatchId)
      } else {
        setIsGenerating(false)
        setProgress(0)
        setErrorMessage(data.msg || '生成失败，请稍后重试')
      }
    } catch (error) {
      console.error('Generate music error:', error)
      setIsGenerating(false)
      setProgress(0)
      setErrorMessage('生成失败，请稍后重试')
    }
  }

  // 生成歌词的函数
  const generateLyrics = async (userPrompt?: string) => {
    const promptToUse = userPrompt || lyrics
    if (!promptToUse.trim()) {
      setErrorMessage('请输入音乐描述')
      return
    }

    if (!lyrics.trim()) {
      setErrorMessage('请输入音乐描述')
      return
    }

    setIsGeneratingLyrics(true)
    try {
      const response = await fetch('/api/music/generateLyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: promptToUse
        })
      })

      const data: any = await response.json()
      if (data.code === 200 && data.data?.lyric) {
        setLyrics(data.data.lyric)
        setHasGeneratedLyrics(true)
        if (!userPrompt) {
          setOriginalDescription(promptToUse) // 保存原始描述
        }
      } else {
        setErrorMessage(data.msg || '生成歌词失败')
      }
    } catch (error) {
      setErrorMessage('生成歌词失败，请稍后重试')
    } finally {
      setIsGeneratingLyrics(false)
    }
  }

  // 重新生成歌词
  const regenerateLyrics = () => {
    generateLyrics(originalDescription)
  }

  // 轮询任务状态
  const pollTaskStatus = async (batchId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/music/status?taskBatchId=${batchId}`)
        const data: TaskResponse = await response.json()

        if (data.code === 200 && data.data?.items[0]) {
          const item = data.data.items[0]

          setProgress((prevProgress) => {
            const increment = Math.floor(Math.random() * 10) + 5 // 5到10的随机数
            // 限制最大进度为80
            return Math.min(prevProgress + increment, 80)
          })

          setProgressMessage(item.progressMsg)

          if (item.cld2AudioUrl) {
            setProgress(100)
            setIsGenerating(false)
            router.push(`/ai-music-generator/${batchId}`)
            return true
          }
        }
        return false
      } catch (error) {
        console.error('Poll status error:', error)
        return false
      }
    }

    const poll = async () => {
      if (await checkStatus()) return
      setTimeout(poll, 2000)
    }

    poll()
  }

  interface MusicCategory {
    label: string
    type: 'Style' | 'Moods' | 'Voices' | 'Tempos'
    styles: string[]
  }

  const musicCategories: MusicCategory[] =
    locale === 'zh'
      ? [
          {
            label: '风格',
            type: 'Style',
            styles: [
              // 主流流派
              '流行',
              '摇滚',
              '朋克',
              '电子',
              '说唱',
              '金属',
              '硬摇滚',
              '另类摇滚',
              '新金属',
              '放克',
              '流行摇滚',
              '流行朋克',
              '摇摆乐',
              '凯尔特摇滚',
              '暗黑民谣',
              '慢核',
              '赛科比利',
              '抽象嘻哈',
              '暗潮',
              '新金属',
              '墨西哥民谣',
              '乡村酒吧',
              '硬核',
              '三味线',
              '迷幻噪音',
              '工人阶级朋克',
              '异类音乐',
              '小提琴',
              '西班牙电子',
              '忧郁说唱',
              '数学核',
              '手风琴',
              // 细分风格
              '布鲁斯',
              '乡村',
              '民谣',
              '金属',
              '朋克',
              '放克',
              '灵魂乐',
              '雷鬼',
              '拉丁',
              '世界音乐',
              // 电子音乐细分
              '浩室',
              '科技舞曲',
              '迷幻舞曲',
              '回响贝斯',
              '电子舞曲',
              // 融合风格
              '爵士嘻哈',
              '电子流行',
              '另类摇滚',
              '独立音乐'
            ]
          },
          {
            label: '情绪',
            type: 'Moods',
            styles: ['欢快', '悲伤', '愤怒', '恐惧', '惊喜', '期待', '平静', '浪漫', '怀旧', '神秘', '胜利', '绝望']
          },
          {
            label: '声音',
            type: 'Voices',
            styles: ['女高音', '女中音', '男高音', '男低音', '童声', '男声', '女声']
          },
          {
            label: '速度',
            type: 'Tempos',
            styles: ['快板', '中板', '慢板', '80-120 BPM', '120-160 BPM']
          }
        ]
      : [
          {
            label: 'Style',
            type: 'Style',
            styles: [
              // Mainstream genres
              'Pop',
              'Rock',
              'Punk',
              'Electronic',
              'Rap',
              'Metal',
              'Hard Rock',
              'Alternative Rock',
              'Nu Metal',
              'Funk',
              'Pop Rock',
              'Pop Punk',
              'Swing',
              'Celtic Rock',
              'Dark Folk',
              'Slowcore',
              'Psychobilly',
              'Abstract Hip Hop',
              'Dark Wave',
              'Nu Metal',
              'Corridos Tumbados',
              'Honky Tonk',
              'Hardcore',
              'Shamisen',
              'Grungegaze',
              'Oi',
              'Outsider',
              'Violin',
              'Spanish Electronic',
              'Sad Rap',
              'Mathcore',
              'Accordion',
              // Subgenres
              'Blues',
              'Country',
              'Folk',
              'Metal',
              'Punk',
              'Funk',
              'Soul',
              'Reggae',
              'Latin',
              'World Music',
              // Electronic subgenres
              'House',
              'Techno',
              'Trance',
              'Dubstep',
              'EDM',
              // Fusion genres
              'Jazz Hip Hop',
              'Electropop',
              'Alternative Rock',
              'Indie Music'
            ]
          },
          {
            label: 'Moods',
            type: 'Moods',
            styles: [
              'Joy',
              'Sadness',
              'Anger',
              'Fear',
              'Surprise',
              'Anticipation',
              'Calmness',
              'Romantic',
              'Nostalgia',
              'Mystery',
              'Triumph',
              'Despair'
            ]
          },
          {
            label: 'Voices',
            type: 'Voices',
            styles: ['Soprano', 'Alto', 'Tenor', 'Bass', "Children's Voice", 'Male Voice', 'Female Voice']
          },
          {
            label: 'Tempos',
            type: 'Tempos',
            styles: ['Fast', 'Medium', 'Slow', '80-120 BPM', '120-160 BPM']
          }
        ]

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style))
    } else {
      setSelectedStyles([...selectedStyles, style])
    }
  }

  const handleInputKeyDown = (e: any) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      if (!selectedStyles.includes(inputValue.trim())) {
        setSelectedStyles([...selectedStyles, inputValue.trim()])
      }
      setInputValue('')
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      setInputValue('')
      setIsEditing(false)
    }
  }

  const removeStyle = (styleToRemove: string) => {
    setSelectedStyles(selectedStyles.filter((style) => style !== styleToRemove))
  }

  const generateRandomStyles = () => {
    const allStyles = musicCategories.flatMap((category) => category.styles)
    const shuffled = [...allStyles].sort(() => 0.5 - Math.random())
    const randomCount = Math.floor(Math.random() * (10 - 3 + 1)) + 3
    setSelectedStyles(shuffled.slice(0, randomCount))
  }

  // 切换模式时的处理
  const handleModeChange = (mode: 'custom' | 'description') => {
    setGenerationMode(mode)
    setHasGeneratedLyrics(false)
    setOriginalDescription('')
  }

  const maxLength = 500
  const minLength = 3
  const currentLength = lyrics.length
  const handleToggle = () => {
    setIsInstrumentalOnly(!isInstrumentalOnly)
  }

  return (
    <div className='container mx-auto px-4 pb-8'>
      <div className='max-w-3xl mx-auto bg-gray-800/80 rounded-2xl p-6'>
        {/* Mode Selection */}
        <div className='flex gap-4 mb-6'>
          <button
            type='button'
            onClick={() => handleModeChange('custom')}
            className={`flex-1 py-3 rounded-lg transition-all ${
              generationMode === 'custom' ? 'bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}>
            Custom Lyrics
          </button>
          <button
            type='button'
            onClick={() => handleModeChange('description')}
            className={`flex-1 py-3 rounded-lg transition-all ${
              generationMode === 'description' ? 'bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}>
            Description Mode
          </button>
        </div>

        <div className='flex items-center justify-between w-full gap-4 px-1 mb-3'>
          <div className='flex items-center justify-center'>
            <div className='relative inline-flex items-center gap-3 px-5 py-2 bg-gray-700/30 rounded-full backdrop-blur-sm'>
              <span
                onClick={() => setIsInstrumentalOnly(!isInstrumentalOnly)}
                className={`text-sm transition-colors duration-200 ${!isInstrumentalOnly ? 'text-purple-400' : 'text-gray-400'}`}>
                Include Vocals
              </span>

              <button
                onClick={() => setIsInstrumentalOnly(!isInstrumentalOnly)}
                className='relative w-11 h-5 rounded-full transition-colors duration-200'
                style={{ backgroundColor: isInstrumentalOnly ? '#8B5CF6' : '#374151' }}
                role='switch'
                aria-checked={isInstrumentalOnly}
                aria-label='Toggle instrumental mode'>
                <div
                  className={`
            absolute w-4 h-4 bg-white rounded-full top-0.5
            transition-transform duration-200 ease-out
            ${isInstrumentalOnly ? 'translate-x-6' : 'translate-x-0.5'}
          `}>
                  <div className='absolute inset-0 rounded-full bg-white/80 blur-[1px]' />
                </div>
              </button>

              <span
                onClick={() => setIsInstrumentalOnly(!isInstrumentalOnly)}
                className={`text-sm transition-colors duration-200 ${isInstrumentalOnly ? 'text-purple-400' : 'text-gray-400'}`}>
                Instrumental Only
              </span>
            </div>
          </div>
        </div>

        <div className='relative mb-3'>
          {!(isInstrumentalOnly && generationMode === 'description') && (
            <>
              <textarea
                onChange={(e) => setLyrics(e.target.value)}
                value={lyrics}
                maxLength={maxLength}
                className={`[&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full w-full transition-all duration-300 rounded-lg p-4 text-white resize-none bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 focus:outline-none focus:border-purple-500/30 ${
                  generationMode === 'description' && hasGeneratedLyrics ? 'bg-opacity-50' : ''
                } ${generationMode === 'custom' || hasGeneratedLyrics ? 'h-40' : 'h-32'}`}
                placeholder={
                  generationMode === 'custom'
                    ? 'Enter your lyrics here...'
                    : hasGeneratedLyrics
                    ? '已生成的歌词...'
                    : 'Describe the kind of song you want...'
                }
              />

              {/* 左下角按钮 */}
              {generationMode === 'description' && !isInstrumentalOnly && (
                <div className='absolute bottom-4 left-3'>
                  {hasGeneratedLyrics ? (
                    <button
                      onClick={regenerateLyrics}
                      className='group px-3 py-1 bg-gray-700/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-full transition-all duration-300 flex items-center gap-1.5 text-white/70 hover:text-white text-xs backdrop-blur-sm border border-gray-500/30 hover:border-transparent'>
                      {isGeneratingLyrics ? (
                        <>
                          Generating
                          <Loader2 className='w-3 h-3 animate-spin' />
                        </>
                      ) : (
                        <>
                          换一换
                          <Brush className='w-3 h-3' />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => generateLyrics()}
                      disabled={isGeneratingLyrics || currentLength < minLength}
                      className='group px-3 py-1  hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-full transition-all duration-300 flex items-center gap-1.5  hover:text-white text-xs backdrop-blur-sm border border-gray-500/30 hover:border-transparent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-700/50 disabled:hover:border-gray-500/30'>
                      {isGeneratingLyrics ? (
                        <>
                          Generating
                          <Loader2 className='w-3 h-3 animate-spin' />
                        </>
                      ) : (
                        <>AI generate ✨</>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* 右下角字数限制 */}
              <div
                className={`absolute bottom-4 right-3 text-xs ${
                  currentLength >= maxLength ? 'text-red-400/90' : currentLength < minLength ? 'text-amber-400/90' : 'text-gray-400/90'
                }`}>
                {currentLength}/{maxLength}
              </div>
            </>
          )}
        </div>
        {/* Style Selection */}
        <div className='mb-6 mt-2 p-4 rounded-xl border border-gray-700/50 bg-gray-800/20 backdrop-blur-sm'>
          <div className='flex items-center justify-between mb-4 text-[14px]'>
            <div className=' text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>Styles</div>
            <div className='flex gap-2'>
              <button
                onClick={generateRandomStyles}
                className='flex items-center gap-2 px-4 py-1.5 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors'>
                ✨ Random
              </button>
            </div>
          </div>
          <div className='mb-2 mt-2  rounded-xl  border-gray-700/50 bg-gray-800/20 backdrop-blur-sm'>
            {/* 风格输入框和标签展示区域 */}
            <div className='mb-4 p-2 min-h-[40px] rounded-lg bg-gray-900/50 border border-gray-700/50 focus-within:border-purple-500/50 transition-colors'>
              <div className='flex flex-wrap gap-1.5 items-center'>
                {selectedStyles.map((style) => (
                  <StyleTag key={style} text={style} onRemove={() => removeStyle(style)} />
                ))}
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => setIsEditing(false)}
                    className='w-[100px] bg-transparent text-xs text-white outline-none placeholder:text-gray-500'
                    placeholder='Enter style...'
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className='px-2 py-0.5 text-xs text-gray-400 hover:text-purple-400 transition-colors'>
                    + Add
                  </button>
                )}
              </div>
            </div>

            {/* 分类标签 */}
            <div className='flex flex-nowrap gap-1.5 mb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
              {musicCategories.map((category) => (
                <button
                  key={category.type}
                  onClick={() => setActiveCategory(category.type)}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex-shrink-0 ${
                    activeCategory === category.type
                      ? 'bg-gray-900 text-white border border-gray-700'
                      : 'bg-transparent text-gray-400 border border-gray-700 hover:bg-gray-800'
                  }`}>
                  # {category.label}
                </button>
              ))}
            </div>

            {/* 风格选择器 */}
            <div className='flex flex-wrap gap-1.5'>
              {musicCategories
                .find((c) => c.type === activeCategory)
                ?.styles.slice(0, isExpanded ? undefined : 12)
                .map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-2.5 py-0.5 text-xs rounded-full transition-all ${
                      selectedStyles.includes(style) ? 'bg-purple-500/90 text-white' : 'bg-gray-800/40 text-gray-400 hover:bg-gray-700/40'
                    }`}>
                    {style}
                  </button>
                ))}

              {musicCategories.find((c) => c.type === activeCategory)?.styles.length! > 12 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='px-2.5 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all'>
                  {isExpanded ? 'Show Less ↑' : 'Show More ↓'}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Title Input */}
        <div className='mb-6 flex items-center gap-4'>
          <label className='text-white text-sm font-medium whitespace-nowrap'>Title</label>
          <div className='relative flex-1'>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 30))}
              placeholder='Enter your song title'
              className='w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-16'
            />
            <div className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400'>{title.length}/30</div>
          </div>
        </div>

        {/* 错误提示 */}
        {errorMessage && (
          <div className='mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-center'>{errorMessage}</div>
        )}

        {/* 进度条 */}
        {isGenerating && <ProgressBar progress={progress} progressMessage={progressMessage} />}

        {/* Generate Button */}
        <button
          onClick={generateMusic}
          className='w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-lg font-medium hover:opacity-90 transition-opacity'
          //style={{ cursor: `url(${mofabang.src}), auto` }}
          >
          Generate Music
        </button>
      </div>
    </div>
  )
}

export default Index
