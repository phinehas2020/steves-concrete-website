import { useParams } from 'react-router-dom'
import { servicePages } from '../data/servicePages'
import { NotFound } from './NotFound'
import { ServiceLanding } from './ServiceLanding'

export function ServiceLandingRoute() {
  const { slug } = useParams()
  const page = servicePages.find((entry) => entry.slug === slug)

  if (!page) {
    return <NotFound />
  }

  return <ServiceLanding page={page} />
}
