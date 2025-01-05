// app/[locale]/(main)/create/page.tsx (Server Component)
import { getTranslations } from 'next-intl/server'
import CreatePageClient from './components/CreatePageClient'
import Head from 'next/head'
import { LeftNav } from '../components/LeftNav'
import { Metadata } from 'next'

//
// export default function CreatePage() {
//   return (
//     <div className='px-2 w-full pt-24 h-[100vh]'>
//       <CreatePageClient />
//     </div>
//   )
// }

export const metadata: Metadata = {
  title: 'MakeSong: Free AI music generator online',
  description: 'Free AI music generator online'
}

export default function CreatePage() {
  return (
    <div className='w-full h-[100vh]'>
      <LeftNav>
        <div className='px-2 pt-24 h-[100vh]'>
          <CreatePageClient />
        </div>
      </LeftNav>
    </div>
  )
}
