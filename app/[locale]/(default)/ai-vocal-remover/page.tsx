import { Metadata } from 'next'
import { LeftNav } from '@/components/blocks/left-nav'
import SplitMusicClient from './components/SplitMusicClient'

// export default  function SplitMusicPage() {
//   return (
// <div className='w-full h-[100vh]'>
//   <h1 className='text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>
//     Splitter AI
//   </h1>
//   <p className='text-center text-gray-400 mb-12'>Split music into separated parts with AI-Powered algorithms</p>

//   <SplitMusicClient />
// </div>
//   )
// }

// w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-lg font-medium hover:opacity-90 transition-opacity

export const metadata: Metadata = {
  title: 'Free AI Vocal Remover & Isolator Online-MakeSong',
  description:
    'AI vocal remover, spilt vocals or instrumentals from any song. You will get two high-quality tracks - a karaoke version of your song (no vocals) and an acapella version (isolated vocals).'
}

export default function CreatePage() {
  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-gray-900 to-[#120724]'>
      <LeftNav>
        <div className='px-6 pt-16 pb-8 h-full overflow-y-auto'>
          <div className='max-w-3xl mx-auto'>
            {/* 标题区域 */}
            <div className='space-y-4 mb-12 mt-48'>
              <h1 className='text-8xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent '>
                Splitter AI
              </h1>
              <p className='text-center text-gray-200 text-2xl font-bold'>Split music into separated parts with AI-Powered algorithms</p>
            </div>

            {/* 主内容区域 */}
            <SplitMusicClient />
          </div>
        </div>
      </LeftNav>
    </div>
  )
}

