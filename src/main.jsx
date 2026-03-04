import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { NotFound } from './pages/NotFound'

// Lightweight slug-only arrays keep the full data modules (and their image
// references) out of the main entry chunk. Each landing component lazy-imports
// its own data and looks up the page by slug via useParams().
import { locationSlugs } from './data/locationSlugs'
import { serviceSlugs } from './data/serviceSlugs'
import { seoServiceSlugs } from './data/seoServiceSlugs'
import { guideSlugs } from './data/guideSlugs'
import { sportsCourtAreaSlugs } from './data/sportsCourtAreaSlugs'

const AdminApp = lazy(() => import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })))
const BlogIndex = lazy(() => import('./pages/BlogIndex').then((m) => ({ default: m.BlogIndex })))
const BlogPost = lazy(() => import('./pages/BlogPost').then((m) => ({ default: m.BlogPost })))
const TermsAndConditions = lazy(() =>
  import('./pages/TermsAndConditions').then((m) => ({ default: m.TermsAndConditions })),
)
const PrivacyPolicy = lazy(() =>
  import('./pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })),
)
const LocationLanding = lazy(() =>
  import('./pages/LocationLanding').then((m) => ({ default: m.LocationLanding })),
)
const ServiceLanding = lazy(() =>
  import('./pages/ServiceLanding').then((m) => ({ default: m.ServiceLanding })),
)
const SeoServiceLanding = lazy(() =>
  import('./pages/SeoServiceLanding').then((m) => ({ default: m.SeoServiceLanding })),
)
const JobsIndex = lazy(() => import('./pages/JobsIndex').then((m) => ({ default: m.JobsIndex })))
const JobDetail = lazy(() => import('./pages/JobDetail').then((m) => ({ default: m.JobDetail })))
const GuidesIndex = lazy(() =>
  import('./pages/GuidesIndex').then((m) => ({ default: m.GuidesIndex })),
)
const GuideLanding = lazy(() =>
  import('./pages/GuideLanding').then((m) => ({ default: m.GuideLanding })),
)
const SportsCourtAreaLanding = lazy(() =>
  import('./pages/SportsCourtAreaLanding').then((m) => ({ default: m.SportsCourtAreaLanding })),
)
const Reviews = lazy(() => import('./pages/Reviews').then((m) => ({ default: m.Reviews })))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-dvh bg-white" />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/jobs" element={<JobsIndex />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          <Route path="/guides" element={<GuidesIndex />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/reviews" element={<Reviews />} />
          {locationSlugs.map((slug) => (
            <Route
              key={slug}
              path={`/${slug}`}
              element={<LocationLanding slug={slug} />}
            />
          ))}
          {seoServiceSlugs.map(({ slug, redirectTo }) => (
            <Route
              key={slug}
              path={`/${slug}`}
              element={redirectTo ? <Navigate to={redirectTo} replace /> : <SeoServiceLanding slug={slug} />}
            />
          ))}
          {serviceSlugs.map((slug) => (
            <Route
              key={slug}
              path={`/services/${slug}`}
              element={<ServiceLanding slug={slug} />}
            />
          ))}
          {guideSlugs.map((slug) => (
            <Route
              key={slug}
              path={`/guides/${slug}`}
              element={<GuideLanding slug={slug} />}
            />
          ))}
          {sportsCourtAreaSlugs.map((slug) => (
            <Route
              key={slug}
              path={`/sports-court-coating/${slug}`}
              element={<SportsCourtAreaLanding slug={slug} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
