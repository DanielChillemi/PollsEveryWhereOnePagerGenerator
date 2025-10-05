/**
 * Login Page
 * 
 * User login page with Poll Everywhere branding
 */

import { AuthLayout } from '../components/layouts/AuthLayout'
import { LoginForm } from '../components/auth/LoginForm'

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue creating amazing marketing content"
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
