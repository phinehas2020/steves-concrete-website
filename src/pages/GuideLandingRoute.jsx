import { useParams } from 'react-router-dom'
import { guidePages } from '../data/guides'
import { GuideLanding } from './GuideLanding'
import { NotFound } from './NotFound'

export function GuideLandingRoute() {
  const { slug } = useParams()
  const page = guidePages.find((entry) => entry.slug === slug)

  if (!page) {
    return <NotFound />
  }

  return <GuideLanding page={page} />
}
