/**
 * Signup Page
 * 
 * User registration page with Poll Everywhere branding
 */

import { AuthLayout } from '../components/layouts/AuthLayout'
import { SignupForm } from '../components/auth/SignupForm'

export function SignupPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join us to start creating professional marketing one-pagers"
    >
      <SignupForm />
    </AuthLayout>
  )
}

export default SignupPage
