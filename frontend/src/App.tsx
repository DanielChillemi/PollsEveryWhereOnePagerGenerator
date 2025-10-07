/**
 * App Component
 * 
 * Main application with routing configuration
 * Handles authentication flow and protected routes
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { BrandKitCreatePage } from './pages/BrandKitCreatePage'
import { BrandKitEditPage } from './pages/BrandKitEditPage'
import { BrandKitListPage } from './pages/BrandKitListPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirect based on auth status */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Brand Kit routes */}
        <Route
          path="/brand-kit/create"
          element={
            <ProtectedRoute>
              <BrandKitCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-kit/edit/:id"
          element={
            <ProtectedRoute>
              <BrandKitEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-kit/list"
          element={
            <ProtectedRoute>
              <BrandKitListPage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
