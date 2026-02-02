import { JobGallery } from '../components/JobGallery'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import {
  useSeo,
  SITE_URL,
  DEFAULT_IMAGE,
  buildBreadcrumbs,
  buildJsonLdGraph,
} from '../lib/seo'

export function JobsIndex() {
  const breadcrumbsJsonLd = buildBreadcrumbs([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Project Gallery', url: `${SITE_URL}/jobs` },
  ])

  useSeo({
    title: 'Concrete Project Gallery | Concrete Works LLC',
    description:
      'View recent concrete driveways, patios, stamped finishes, and commercial projects across Waco and Central Texas.',
    canonical: `${SITE_URL}/jobs`,
    url: `${SITE_URL}/jobs`,
    image: DEFAULT_IMAGE,
    imageAlt: 'Concrete Works LLC project gallery',
    type: 'website',
    jsonLd: buildJsonLdGraph(breadcrumbsJsonLd),
  })

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <JobGallery />
      </main>
      <Footer />
    </div>
  )
}
