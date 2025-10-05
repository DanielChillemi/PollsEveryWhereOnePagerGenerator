/**
 * Logo Upload Component
 *
 * File upload with preview for brand logos
 */

import { useState, useRef } from 'react'
import { Box, Button, Image, Text, VStack, HStack } from '@chakra-ui/react'

interface LogoUploadProps {
  label: string
  logoUrl?: string
  onUpload: (file: File) => void
  onRemove: () => void
}

export const LogoUpload = ({ label, logoUrl, onUpload, onRemove }: LogoUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(logoUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Call parent handler
      onUpload(file)
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove()
  }

  return (
    <VStack align="stretch" gap={2}>
      <Text fontSize="sm" fontWeight="semibold" color="brand.text">
        {label}
      </Text>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {preview ? (
        <VStack gap={3}>
          {/* Logo Preview */}
          <Box
            width="100%"
            height="200px"
            bg="brand.backgroundGray"
            borderRadius="md"
            border="2px dashed"
            borderColor="brand.border"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <Image
              src={preview}
              alt="Brand logo"
              maxHeight="180px"
              maxWidth="90%"
              objectFit="contain"
            />
          </Box>

          {/* Actions */}
          <HStack width="100%" gap={2}>
            <Button
              flex={1}
              variant="outline"
              colorScheme="blue"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Logo
            </Button>
            <Button
              flex={1}
              variant="outline"
              colorScheme="red"
              onClick={handleRemove}
            >
              Remove
            </Button>
          </HStack>
        </VStack>
      ) : (
        <Box
          width="100%"
          height="200px"
          bg="brand.backgroundGray"
          borderRadius="md"
          border="2px dashed"
          borderColor="brand.border"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={() => fileInputRef.current?.click()}
          transition="all 0.2s"
          _hover={{
            borderColor: 'brand.primary',
            bg: 'brand.backgroundBlue',
          }}
        >
          <VStack gap={2}>
            <Text fontSize="3xl" color="brand.textLight">
              📁
            </Text>
            <Text fontSize="sm" color="brand.textLight" textAlign="center">
              Click to upload logo
              <br />
              <Text as="span" fontSize="xs">
                PNG, JPG, SVG (max 5MB)
              </Text>
            </Text>
          </VStack>
        </Box>
      )}
    </VStack>
  )
}
