// presetResponses.ts

interface PresetItem {
  id: string
  inputType: string
  makeInstrumental: boolean
  prompt: string
  gptDescriptionPrompt: string
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

interface PresetResponse {
  data: {
    items: PresetItem[]
  }
}

const presetResponses: Record<string, PresetResponse> = {
  '1074794245686558001': {
    data: {
      items: [
        {
          id: '1074794245686558001',
          inputType: '10',
          makeInstrumental: false,
          prompt: '',
          gptDescriptionPrompt: '',
          title: 'The Holy Spirit',
          tags: 'rasta rap, soulful, [chipmunk sample], jamaican accent',
          clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
          progress: 21,
          continueClipId: '',
          status: 20,
          cld2AudioUrl: 'https://knowledge-embedding-sg.oss-ap-southeast-1.aliyuncs.com/1.mp3',
          cld2VideoUrl: '',
          progressMsg: '努力生成音乐，预计3-6分钟',
          cld2ImageUrl: '/song_1.jpeg'
        }
      ]
    }
  },
  '1074794245686558002': {
    data: {
      items: [
        {
          id: '1074794245686558002',
          inputType: '10',
          makeInstrumental: false,
          prompt: '',
          gptDescriptionPrompt: '',
          title: 'Circles (Remastered)',
          tags: 'electronic, jazz, experimental, minimal, percussion, deep voice, acid jazz',
          clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
          progress: 21,
          continueClipId: '',
          status: 20,
          cld2AudioUrl: 'https://knowledge-embedding-sg.oss-ap-southeast-1.aliyuncs.com/2.mp3',
          cld2VideoUrl: '',
          progressMsg: '努力生成音乐，预计3-6分钟',
          cld2ImageUrl: 'https://file.dzwlai.com/suno/music/api/000/008/400/67ddc1c9-87da-4d31-b708-2338ac4cf66c.jpeg?v=93'
        }
      ]
    }
  },
  '1074794245686558003': {
    data: {
      items: [
        {
          id: '1074794245686558003',
          inputType: '10',
          makeInstrumental: false,
          prompt: '',
          gptDescriptionPrompt: '',
          title: 'Lost in the now',
          tags: 'edm, guajira',
          clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
          progress: 21,
          continueClipId: '',
          status: 20,
          cld2AudioUrl: 'https://knowledge-embedding-sg.oss-ap-southeast-1.aliyuncs.com/3.mp3',
          cld2VideoUrl: '',
          progressMsg: '努力生成音乐，预计3-6分钟',
          cld2ImageUrl: 'https://file.dzwlai.com/suno/music/api/000/008/400/67ddc1c9-87da-4d31-b708-2338ac4cf66c.jpeg?v=93'
        }
      ]
    }
  },
  '1074794245686558004': {
    data: {
      items: [
        {
          id: '1074794245686558004',
          inputType: '10',
          makeInstrumental: false,
          prompt: '',
          gptDescriptionPrompt: '',
          title: 'Ton PERE',
          tags: 'House French touch, joke',
          clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
          progress: 21,
          continueClipId: '',
          status: 20,
          cld2AudioUrl: 'https://knowledge-embedding-sg.oss-ap-southeast-1.aliyuncs.com/4.mp3',
          cld2VideoUrl: '',
          progressMsg: '努力生成音乐，预计3-6分钟',
          cld2ImageUrl: 'https://file.dzwlai.com/suno/music/api/000/008/400/67ddc1c9-87da-4d31-b708-2338ac4cf66c.jpeg?v=93'
        }
      ]
    }
  },
  '1074794245686558005': {
    data: {
      items: [
        {
          id: '1074794245686558005',
          inputType: '10',
          makeInstrumental: false,
          prompt: '',
          gptDescriptionPrompt: '',
          title: 'Wir sind die Welt 2',
          tags: 'modern, pop',
          clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
          progress: 21,
          continueClipId: '',
          status: 20,
          cld2AudioUrl: 'https://knowledge-embedding-sg.oss-ap-southeast-1.aliyuncs.com/5.mp3',
          cld2VideoUrl: '',
          progressMsg: '努力生成音乐，预计3-6分钟',
          cld2ImageUrl: 'https://file.dzwlai.com/suno/music/api/000/008/400/67ddc1c9-87da-4d31-b708-2338ac4cf66c.jpeg?v=93'
        }
      ]
    }
  },
  '1074794245686558006': {
    data: {
      items: [
        {
          id: '1074794245686558006',
          inputType: '10',
          makeInstrumental: false,
          prompt: '',
          gptDescriptionPrompt: '',
          title: 'Te echo de menos (Bachata)',
          tags: 'modern, pop',
          clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
          progress: 21,
          continueClipId: '',
          status: 20,
          cld2AudioUrl: 'https://knowledge-embedding-sg.oss-ap-southeast-1.aliyuncs.com/6.mp3',
          cld2VideoUrl: '',
          progressMsg: '努力生成音乐，预计3-6分钟',
          cld2ImageUrl: 'https://file.dzwlai.com/suno/music/api/000/008/400/67ddc1c9-87da-4d31-b708-2338ac4cf66c.jpeg?v=93'
        }
      ]
    }
  },
  '1074794245686558007': {
    data: {
      items: [
        {
          id: '1074794245686558007',
          inputType: '10',
          makeInstrumental: false,
          prompt: '',
          gptDescriptionPrompt: '',
          title: 'Terr#ne',
          tags: 'modern, pop',
          clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
          progress: 21,
          continueClipId: '',
          status: 20,
          cld2AudioUrl: 'https://knowledge-embedding-sg.oss-ap-southeast-1.aliyuncs.com/7.mp3',
          cld2VideoUrl: '',
          progressMsg: '努力生成音乐，预计3-6分钟',
          cld2ImageUrl: 'https://file.dzwlai.com/suno/music/api/000/008/400/67ddc1c9-87da-4d31-b708-2338ac4cf66c.jpeg?v=93'
        }
      ]
    }
  },
  '1074794245686558008': {
    data: {
      items: [
        {
          id: '1074794245686558008',
          inputType: '10',
          makeInstrumental: false,
          prompt: '',
          gptDescriptionPrompt: '',
          title: 'Πληγωμένες ψυχές',
          tags: 'modern, pop',
          clipId: '67ddc1c9-87da-4d31-b708-2338ac4cf66c',
          progress: 21,
          continueClipId: '',
          status: 20,
          cld2AudioUrl: 'https://knowledge-embedding-sg.oss-ap-southeast-1.aliyuncs.com/8.mp3',
          cld2VideoUrl: '',
          progressMsg: '努力生成音乐，预计3-6分钟',
          cld2ImageUrl: 'https://file.dzwlai.com/suno/music/api/000/008/400/67ddc1c9-87da-4d31-b708-2338ac4cf66c.jpeg?v=93'
        }
      ]
    }
  }
}

export const getPresetResponse = (id: string): PresetResponse => {
  return (
    presetResponses[id] || {
      data: {
        items: []
      }
    }
  )
}

export default presetResponses
