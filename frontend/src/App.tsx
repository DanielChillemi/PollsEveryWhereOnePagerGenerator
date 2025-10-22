/**
 * App Component
 *
 * Main application with routing configuration
 * Authentication removed for demo purposes
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { BrandKitCreatePage } from './pages/BrandKitCreatePage'
import { BrandKitEditPage } from './pages/BrandKitEditPage'
import { BrandKitListPage } from './pages/BrandKitListPage'
import { OnePagerListPage } from './pages/OnePagerListPage'
import { OnePagerDetailPage } from './pages/OnePagerDetailPage'
import { OnePagerWizard } from './pages/onepager/OnePagerWizard'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        {/* Default route - redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main routes - No authentication required */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Brand Kit routes */}
        <Route path="/brand-kit/create" element={<BrandKitCreatePage />} />
        <Route path="/brand-kit/edit/:id" element={<BrandKitEditPage />} />
        <Route path="/brand-kit/list" element={<BrandKitListPage />} />

        {/* OnePager routes */}
        <Route path="/onepager/list" element={<OnePagerListPage />} />
        <Route path="/onepager/create" element={<OnePagerWizard />} />
        <Route path="/onepager/:id" element={<OnePagerDetailPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
