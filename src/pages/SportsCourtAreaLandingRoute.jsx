import { useParams } from 'react-router-dom'
import { sportsCourtAreaPages } from '../data/sportsCourtAreaPages'
import { NotFound } from './NotFound'
import { SportsCourtAreaLanding } from './SportsCourtAreaLanding'

export function SportsCourtAreaLandingRoute() {
  const { slug } = useParams()
  const page = sportsCourtAreaPages.find((entry) => entry.slug === slug)

  if (!page) {
    return <NotFound />
  }

  return <SportsCourtAreaLanding page={page} />
}
