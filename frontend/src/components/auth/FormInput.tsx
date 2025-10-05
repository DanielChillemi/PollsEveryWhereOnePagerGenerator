/**
 * Form Input Component
 * 
 * Reusable input field with Poll Everywhere brand styling
 * Supports validation errors and various input types
 */

import { Input, Field } from '@chakra-ui/react'
import { brandConfig } from '../../config/brandConfig'
import type { ChangeEvent } from 'react'

interface FormInputProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  autoComplete?: string
  disabled?: boolean
}

export function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  disabled = false,
}: FormInputProps) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label htmlFor={id} mb="xs">
        {label}
        {required && <span style={{ color: brandConfig.colors.primary }}> *</span>}
      </Field.Label>
      
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        size="lg"
        fontSize="md"
        borderRadius="md"
        px="md"
        borderColor={error ? 'red.500' : 'brand.border'}
        _focus={{
          borderColor: error ? 'red.500' : 'brand.primary',
          boxShadow: error
            ? '0 0 0 1px var(--chakra-colors-red-500)'
            : `0 0 0 1px ${brandConfig.colors.primary}`,
        }}
        _hover={{
          borderColor: error ? 'red.500' : 'brand.primary',
        }}
      />
      
      {error && (
        <Field.ErrorText mt="xs" fontSize="sm">
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  )
}

export default FormInput
