interface ProgressBarProps {
  progress: number
  progressMessage: string
}

const ProgressBar = ({ progress, progressMessage }: ProgressBarProps) => {
  return (
    <div className='w-full'>
      <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
        <div
          className='h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500'
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className='mt-2 text-center text-sm text-gray-400'>{progressMessage || 'Generating...'}</div>
    </div>
  )
}

export default ProgressBar 