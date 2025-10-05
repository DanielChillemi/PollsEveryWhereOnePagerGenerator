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
import { BrandKitPage } from './pages/BrandKitPage'
import { CanvasPage } from './pages/CanvasPage'
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
        <Route
          path="/brand-kit"
          element={
            <ProtectedRoute>
              <BrandKitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/canvas"
          element={
            <ProtectedRoute>
              <CanvasPage />
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
