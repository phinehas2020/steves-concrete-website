import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import { NotFound } from './pages/NotFound'
import { locationPages } from './data/locationPages'
import { servicePages } from './data/servicePages'
import { seoServicePages } from './data/seoServicePages'
import { guidePages } from './data/guides'
import { sportsCourtAreaPages } from './data/sportsCourtAreaPages'

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
          {locationPages.map((page) => (
            <Route
              key={page.slug}
              path={`/${page.slug}`}
              element={<LocationLanding page={page} />}
            />
          ))}
          {seoServicePages.map((page) => (
            <Route
              key={page.slug}
              path={`/${page.slug}`}
              element={page.redirectTo ? <Navigate to={page.redirectTo} replace /> : <SeoServiceLanding page={page} />}
            />
          ))}
          {servicePages.map((page) => (
            <Route
              key={page.slug}
              path={`/services/${page.slug}`}
              element={<ServiceLanding page={page} />}
            />
          ))}
          {guidePages.map((page) => (
            <Route
              key={page.slug}
              path={`/guides/${page.slug}`}
              element={<GuideLanding page={page} />}
            />
          ))}
          {sportsCourtAreaPages.map((page) => (
            <Route
              key={page.slug}
              path={`/sports-court-coating/${page.slug}`}
              element={<SportsCourtAreaLanding page={page} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Analytics />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
