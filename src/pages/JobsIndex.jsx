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
    title: 'Concrete Projects Waco TX | Gallery | Concrete Works LLC',
    description:
      'Driveways, patios, stamped concrete & commercial projects in Waco. Free estimate: (254) 230-3102.',
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
