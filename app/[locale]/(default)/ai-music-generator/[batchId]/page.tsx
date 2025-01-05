// app/[locale]/(main)/create/page.tsx (Server Component)
import { getTranslations } from 'next-intl/server'
import CreatePageClient from '../components/CreatePageClient'
import { LeftNav } from '../../components/LeftNav'

export async function generateMetadata() {
  const t = await getTranslations()
  return {
    title: t('blog.title'),
    keywords: ['AI Music', 'Music Generation', 'Create Music']
  }
}

// export default function CreatePage({ params }: any) {
//   return (
//     <div className='px-2 w-full pt-32 h-[100vh]'>
//       <CreatePageClient batchId={params.batchId} />
//     </div>
//   )
// }

export default function CreatePage({ params }: any) {
  return (
    <div className='w-full h-[100vh]'>
      <LeftNav>
        <div className='px-2 pt-24 h-[100vh]'>
          <CreatePageClient batchId={params.batchId} />
        </div>
      </LeftNav>
    </div>
  )
}
