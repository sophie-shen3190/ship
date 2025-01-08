'use client'

interface UploadProps {
  isUploading: boolean
  onUpload: (file: File) => void
  error: string
}

export function Upload({ isUploading, onUpload, error }: UploadProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
  }

  return (
    <div
      className='border-2 border-dashed border-gray-600 rounded-lg p-12 text-center'
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}>
      <input type='file' id='file' className='hidden' onChange={handleChange} accept='audio/*' disabled={isUploading} />
      <label htmlFor='file' className='cursor-pointer text-gray-400 hover:text-white'>
        <div className='space-y-2'>
          <div className='text-4xl'>🎵</div>
          <div>Drop your audio file here or click to upload</div>
          <div className='text-sm text-gray-500'>Supports MP3, WAV (max 10MB)</div>
        </div>
      </label>
      {error && <div className='mt-4 text-red-500'>{error}</div>}
    </div>
  )
}
