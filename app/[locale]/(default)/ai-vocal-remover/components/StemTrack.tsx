'use client'

interface StemTrackProps {
  stem: {
    id: string
    title: string
    status: number
    progress: number
    progressMsg: string
    cld2AudioUrl: string
  }
}

export function StemTrack({ stem }: StemTrackProps) {
  return (
    <div className='bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-xl font-semibold text-white'>{stem.title}</h3>
        <span className='text-purple-400'>{stem.status === 30 ? '100%' : `${stem.progress}%`}</span>
      </div>

      {stem.status === 30 ? (
        <audio className='w-full' controls src={stem.cld2AudioUrl} />
      ) : (
        <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
          <div className='h-full bg-gradient-to-r from-purple-500 to-pink-500' style={{ width: `${stem.progress}%` }} />
        </div>
      )}

      <p className='mt-2 text-gray-400'>{stem.progressMsg}</p>
    </div>
  )
}
