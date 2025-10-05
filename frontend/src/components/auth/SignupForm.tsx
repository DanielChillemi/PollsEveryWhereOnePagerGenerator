/**
 * Signup Form Component
 * 
 * User registration form with full_name/email/password validation
 * Poll Everywhere brand styling
 */

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Box, Text, VStack } from '@chakra-ui/react'
import { FormInput } from './FormInput'
import { FormButton } from './FormButton'
import { FormError } from './FormError'
import { useSignup } from '../../hooks/useAuth'
import type { SignupFormData, FormErrors } from '../../types/auth'

export function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    full_name: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const signup = useSignup()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full name validation
    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required'
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Name must be at least 2 characters'
    } else if (formData.full_name.length > 100) {
      newErrors.full_name = 'Name must be less than 100 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (formData.password.length > 100) {
      newErrors.password = 'Password must be less than 100 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await signup.mutateAsync(formData)
    } catch (error: any) {
      const detail = error.response?.data?.detail
      setErrors({
        general: detail === 'Email already registered' 
          ? 'This email is already registered. Please sign in instead.'
          : detail || 'Signup failed. Please try again.',
      })
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap="md" align="stretch">
        {errors.general && <FormError message={errors.general} />}

        <FormInput
          id="full_name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          error={errors.full_name}
          required
          autoComplete="name"
        />

        <FormInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
          autoComplete="email"
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <FormButton
          type="submit"
          variant="primary"
          isLoading={signup.isPending}
          fullWidth
        >
          {signup.isPending ? 'Creating Account...' : 'Create Account'}
        </FormButton>

        <Text textAlign="center" fontSize="sm" color="brand.textLight">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default SignupForm
