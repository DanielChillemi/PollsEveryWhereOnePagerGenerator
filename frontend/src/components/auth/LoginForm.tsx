/**
 * Login Form Component
 * 
 * User login form with email/password validation
 * Poll Everywhere brand styling
 */

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Box, Text, VStack } from '@chakra-ui/react'
import { FormInput } from './FormInput'
import { FormButton } from './FormButton'
import { FormError } from './FormError'
import { useLogin } from '../../hooks/useAuth'
import type { LoginFormData, FormErrors } from '../../types/auth'

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const login = useLogin()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

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
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await login.mutateAsync(formData)
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.detail || 'Login failed. Please check your credentials.',
      })
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap="md" align="stretch">
        {errors.general && <FormError message={errors.general} />}

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
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
          autoComplete="current-password"
        />

        <FormButton
          type="submit"
          variant="primary"
          isLoading={login.isPending}
          fullWidth
        >
          {login.isPending ? 'Signing In...' : 'Sign In'}
        </FormButton>

        <Text textAlign="center" fontSize="sm" color="brand.textLight">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign up
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default LoginForm
