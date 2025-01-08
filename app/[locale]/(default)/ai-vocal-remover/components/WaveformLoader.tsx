export function WaveformLoader() {
  return (
    <div className='flex justify-center items-center space-x-2 h-24'>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className='w-2 bg-purple-500 rounded-full animate-pulse'
          style={{
            height: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}
