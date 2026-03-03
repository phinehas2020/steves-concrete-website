import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { NotFound } from './pages/NotFound'

const AdminApp = lazy(() => import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })))
const BlogIndex = lazy(() => import('./pages/BlogIndex').then((m) => ({ default: m.BlogIndex })))
const BlogPost = lazy(() => import('./pages/BlogPost').then((m) => ({ default: m.BlogPost })))
const TermsAndConditions = lazy(() =>
  import('./pages/TermsAndConditions').then((m) => ({ default: m.TermsAndConditions })),
)
const PrivacyPolicy = lazy(() =>
  import('./pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })),
)
const RootSlugLanding = lazy(() =>
  import('./pages/RootSlugLanding').then((m) => ({ default: m.RootSlugLanding })),
)
const ServiceLandingRoute = lazy(() =>
  import('./pages/ServiceLandingRoute').then((m) => ({ default: m.ServiceLandingRoute })),
)
const JobsIndex = lazy(() => import('./pages/JobsIndex').then((m) => ({ default: m.JobsIndex })))
const JobDetail = lazy(() => import('./pages/JobDetail').then((m) => ({ default: m.JobDetail })))
const GuidesIndex = lazy(() => import('./pages/GuidesIndex').then((m) => ({ default: m.GuidesIndex })))
const GuideLandingRoute = lazy(() =>
  import('./pages/GuideLandingRoute').then((m) => ({ default: m.GuideLandingRoute })),
)
const SportsCourtAreaLandingRoute = lazy(() =>
  import('./pages/SportsCourtAreaLandingRoute').then((m) => ({
    default: m.SportsCourtAreaLandingRoute,
  })),
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
          <Route path="/guides/:slug" element={<GuideLandingRoute />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/services/:slug" element={<ServiceLandingRoute />} />
          <Route path="/sports-court-coating/:slug" element={<SportsCourtAreaLandingRoute />} />
          <Route path="/:slug" element={<RootSlugLanding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
