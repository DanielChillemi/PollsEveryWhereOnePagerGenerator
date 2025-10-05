/**
 * Form Button Component
 * 
 * Branded button with Poll Everywhere styling
 * Supports primary gradient, secondary, and outline variants
 */

import { Button } from '@chakra-ui/react'
import { brandConfig } from '../../config/brandConfig'
import type { ReactNode } from 'react'

interface FormButtonProps {
  children: ReactNode
  type?: 'submit' | 'button' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline'
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  fullWidth?: boolean
}

export function FormButton({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  fullWidth = false,
}: FormButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: brandConfig.gradients.primary,
          color: 'white',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: brandConfig.shadows.button,
          },
        }
      case 'secondary':
        return {
          bg: 'brand.primary',
          color: 'white',
          _hover: {
            bg: '#005A9C',
            transform: 'translateY(-2px)',
          },
        }
      case 'outline':
        return {
          bg: 'transparent',
          color: 'brand.primary',
          borderWidth: '2px',
          borderColor: 'brand.primary',
          _hover: {
            bg: 'brand.primary',
            color: 'white',
          },
        }
      default:
        return {}
    }
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      loading={isLoading}
      width={fullWidth ? 'full' : 'auto'}
      size="lg"
      fontSize="lg"
      fontWeight="semibold"
      borderRadius="full"
      px="lg"
      py="md"
      transition="all 0.3s ease"
      {...getVariantStyles()}
      _disabled={{
        opacity: 0.6,
        cursor: 'not-allowed',
      }}
    >
      {children}
    </Button>
  )
}

export default FormButton
