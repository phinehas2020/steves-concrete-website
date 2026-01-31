import { JobGallery } from '../components/JobGallery'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export function JobsIndex() {
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
