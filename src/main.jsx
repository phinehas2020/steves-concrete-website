import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AdminApp } from './admin/AdminApp'
import { BlogIndex } from './pages/BlogIndex'
import { BlogPost } from './pages/BlogPost'
import { TermsAndConditions } from './pages/TermsAndConditions'
import { NotFound } from './pages/NotFound'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { LocationLanding } from './pages/LocationLanding'
import { ServiceLanding } from './pages/ServiceLanding'
import { SeoServiceLanding } from './pages/SeoServiceLanding'
import { JobsIndex } from './pages/JobsIndex'
import { JobDetail } from './pages/JobDetail'
import { GuidesIndex } from './pages/GuidesIndex'
import { GuideLanding } from './pages/GuideLanding'
import { SportsCourtAreaLanding } from './pages/SportsCourtAreaLanding'
import { Reviews } from './pages/Reviews'
import { locationPages } from './data/locationPages'
import { servicePages } from './data/servicePages'
import { seoServicePages } from './data/seoServicePages'
import { guidePages } from './data/guides'
import { sportsCourtAreaPages } from './data/sportsCourtAreaPages'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
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
            element={<SeoServiceLanding page={page} />}
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
    </BrowserRouter>
  </StrictMode>,
)
