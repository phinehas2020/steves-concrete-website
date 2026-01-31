import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AdminApp } from './admin/AdminApp'
import { BlogIndex } from './pages/BlogIndex'
import { BlogPost } from './pages/BlogPost'
import { NotFound } from './pages/NotFound'
import { LocationLanding } from './pages/LocationLanding'
import { ServiceLanding } from './pages/ServiceLanding'
import { JobsIndex } from './pages/JobsIndex'
import { JobDetail } from './pages/JobDetail'
import { locationPages } from './data/locationPages'
import { servicePages } from './data/servicePages'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/jobs" element={<JobsIndex />} />
        <Route path="/jobs/:slug" element={<JobDetail />} />
        <Route path="/admin/*" element={<AdminApp />} />
        {locationPages.map((page) => (
          <Route
            key={page.slug}
            path={`/${page.slug}`}
            element={<LocationLanding page={page} />}
          />
        ))}
        {servicePages.map((page) => (
          <Route
            key={page.slug}
            path={`/services/${page.slug}`}
            element={<ServiceLanding page={page} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
