import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { locationPages } from './data/locationPages'
import { servicePages } from './data/servicePages'
import { seoServicePages } from './data/seoServicePages'
import { guidePages } from './data/guides'
import { sportsCourtAreaPages } from './data/sportsCourtAreaPages'

const AdminApp = lazy(() => import('./admin/AdminApp').then((module) => ({ default: module.AdminApp })))
const BlogIndex = lazy(() => import('./pages/BlogIndex').then((module) => ({ default: module.BlogIndex })))
const BlogPost = lazy(() => import('./pages/BlogPost').then((module) => ({ default: module.BlogPost })))
const TermsAndConditions = lazy(() =>
  import('./pages/TermsAndConditions').then((module) => ({ default: module.TermsAndConditions })),
)
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })))
const PrivacyPolicy = lazy(() =>
  import('./pages/PrivacyPolicy').then((module) => ({ default: module.PrivacyPolicy })),
)
const LocationLanding = lazy(() =>
  import('./pages/LocationLanding').then((module) => ({ default: module.LocationLanding })),
)
const ServiceLanding = lazy(() =>
  import('./pages/ServiceLanding').then((module) => ({ default: module.ServiceLanding })),
)
const SeoServiceLanding = lazy(() =>
  import('./pages/SeoServiceLanding').then((module) => ({ default: module.SeoServiceLanding })),
)
const JobsIndex = lazy(() => import('./pages/JobsIndex').then((module) => ({ default: module.JobsIndex })))
const JobDetail = lazy(() => import('./pages/JobDetail').then((module) => ({ default: module.JobDetail })))
const GuidesIndex = lazy(() =>
  import('./pages/GuidesIndex').then((module) => ({ default: module.GuidesIndex })),
)
const GuideLanding = lazy(() =>
  import('./pages/GuideLanding').then((module) => ({ default: module.GuideLanding })),
)
const SportsCourtAreaLanding = lazy(() =>
  import('./pages/SportsCourtAreaLanding').then((module) => ({ default: module.SportsCourtAreaLanding })),
)
const Reviews = lazy(() => import('./pages/Reviews').then((module) => ({ default: module.Reviews })))

function RouteFallback() {
  return (
    <div className="min-h-dvh bg-stone-50 text-stone-600 flex items-center justify-center">
      Loading...
    </div>
  )
}

function withSuspense(element) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={withSuspense(<BlogIndex />)} />
        <Route path="/blog/:slug" element={withSuspense(<BlogPost />)} />
        <Route path="/jobs" element={withSuspense(<JobsIndex />)} />
        <Route path="/jobs/:slug" element={withSuspense(<JobDetail />)} />
        <Route path="/guides" element={withSuspense(<GuidesIndex />)} />
        <Route path="/admin/*" element={withSuspense(<AdminApp />)} />
        <Route path="/privacy-policy" element={withSuspense(<PrivacyPolicy />)} />
        <Route path="/terms-and-conditions" element={withSuspense(<TermsAndConditions />)} />
        <Route path="/reviews" element={withSuspense(<Reviews />)} />
        {locationPages.map((page) => (
          <Route
            key={page.slug}
            path={`/${page.slug}`}
            element={withSuspense(<LocationLanding page={page} />)}
          />
        ))}
        {seoServicePages.map((page) => (
          <Route
            key={page.slug}
            path={`/${page.slug}`}
            element={withSuspense(<SeoServiceLanding page={page} />)}
          />
        ))}
        {servicePages.map((page) => (
          <Route
            key={page.slug}
            path={`/services/${page.slug}`}
            element={withSuspense(<ServiceLanding page={page} />)}
          />
        ))}
        {guidePages.map((page) => (
          <Route
            key={page.slug}
            path={`/guides/${page.slug}`}
            element={withSuspense(<GuideLanding page={page} />)}
          />
        ))}
        {sportsCourtAreaPages.map((page) => (
          <Route
            key={page.slug}
            path={`/sports-court-coating/${page.slug}`}
            element={withSuspense(<SportsCourtAreaLanding page={page} />)}
          />
        ))}
        <Route path="*" element={withSuspense(<NotFound />)} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
