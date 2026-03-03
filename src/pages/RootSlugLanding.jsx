import { Navigate, useParams } from 'react-router-dom'
import { locationPages } from '../data/locationPages'
import { seoServicePages } from '../data/seoServicePages'
import { LocationLanding } from './LocationLanding'
import { NotFound } from './NotFound'
import { SeoServiceLanding } from './SeoServiceLanding'

export function RootSlugLanding() {
  const { slug } = useParams()

  const seoServicePage = seoServicePages.find((page) => page.slug === slug)
  if (seoServicePage) {
    if (seoServicePage.redirectTo) {
      return <Navigate to={seoServicePage.redirectTo} replace />
    }
    return <SeoServiceLanding page={seoServicePage} />
  }

  const locationPage = locationPages.find((page) => page.slug === slug)
  if (locationPage) {
    return <LocationLanding page={locationPage} />
  }

  return <NotFound />
}
