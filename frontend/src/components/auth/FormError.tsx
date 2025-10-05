/**
 * Form Error Component
 * 
 * Displays error messages with Poll Everywhere brand styling
 */

import { Alert } from '@chakra-ui/react'

interface FormErrorProps {
  message: string
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <Alert.Root status="error" mb="md">
      <Alert.Indicator />
      <Alert.Title>{message}</Alert.Title>
    </Alert.Root>
  )
}

export default FormError
