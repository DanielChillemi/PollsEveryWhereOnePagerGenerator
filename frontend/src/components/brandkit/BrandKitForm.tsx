/**
 * Brand Kit Form Component
 *
 * Complete form for creating and editing brand kits
 */

import { useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Heading,
  Input,
  Textarea,
  VStack,
  Text,
  Card,
} from '@chakra-ui/react'
import { ColorPicker } from './ColorPicker'
import { FontSelector } from './FontSelector'
import { LogoUpload } from './LogoUpload'
import { BrandKitFormData } from '../../types/brandKit'
import { useUploadLogo } from '../../hooks/useBrandKit'

interface BrandKitFormProps {
  initialData?: Partial<BrandKitFormData>
  onSubmit: (data: BrandKitFormData) => void
  onCancel?: () => void
  isLoading?: boolean
}

export const BrandKitForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: BrandKitFormProps) => {
  const [formData, setFormData] = useState<BrandKitFormData>({
    company_name: initialData?.company_name || '',
    primary_color: initialData?.primary_color || '#007ACC',
    secondary_color: initialData?.secondary_color || '#864CBD',
    accent_color: initialData?.accent_color || '#1568B8',
    font_heading: initialData?.font_heading || 'Source Sans Pro',
    font_body: initialData?.font_body || 'Source Sans Pro',
    logo_url: initialData?.logo_url || '',
    brand_voice: initialData?.brand_voice || '',
  })

  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const uploadLogoMutation = useUploadLogo()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleLogoUpload = async (file: File) => {
    setIsUploadingLogo(true)
    try {
      // Upload logo to backend
      const { url } = await uploadLogoMutation.mutateAsync(file)
      setFormData({ ...formData, logo_url: url })
    } catch (error: any) {
      alert(`Failed to upload logo: ${error.response?.data?.detail || error.message}`)
      // Fallback to local preview URL if upload fails
      const previewUrl = URL.createObjectURL(file)
      setFormData({ ...formData, logo_url: previewUrl })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleLogoRemove = () => {
    setFormData({ ...formData, logo_url: '' })
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack align="stretch" gap={6}>
        {/* Header */}
        <Box>
          <Heading size="lg" color="brand.textDark">
            {initialData ? 'Edit Brand Kit' : 'Create Brand Kit'}
          </Heading>
          <Text mt={2} color="brand.textLight">
            Define your brand identity to maintain consistency across all marketing materials
          </Text>
        </Box>

        {/* Company Name */}
        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" fontWeight="semibold" color="brand.text">
            Company Name *
          </Text>
          <Input
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            placeholder="Enter your company name"
            required
            size="lg"
          />
        </VStack>

        {/* Logo Upload */}
        <LogoUpload
          label="Company Logo"
          logoUrl={formData.logo_url}
          onUpload={handleLogoUpload}
          onRemove={handleLogoRemove}
        />

        {/* Color Section */}
        <Box>
          <Heading size="md" color="brand.textDark" mb={4}>
            Brand Colors
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <ColorPicker
              label="Primary Color"
              color={formData.primary_color}
              onChange={(color) =>
                setFormData({ ...formData, primary_color: color })
              }
            />
            <ColorPicker
              label="Secondary Color"
              color={formData.secondary_color}
              onChange={(color) =>
                setFormData({ ...formData, secondary_color: color })
              }
            />
            <ColorPicker
              label="Accent Color"
              color={formData.accent_color}
              onChange={(color) =>
                setFormData({ ...formData, accent_color: color })
              }
            />
          </Grid>
        </Box>

        {/* Font Section */}
        <Box>
          <Heading size="md" color="brand.textDark" mb={4}>
            Typography
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <FontSelector
              label="Heading Font"
              value={formData.font_heading}
              onChange={(font) =>
                setFormData({ ...formData, font_heading: font })
              }
            />
            <FontSelector
              label="Body Font"
              value={formData.font_body}
              onChange={(font) => setFormData({ ...formData, font_body: font })}
            />
          </Grid>
        </Box>

        {/* Brand Voice */}
        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" fontWeight="semibold" color="brand.text">
            Brand Voice (Optional)
          </Text>
          <Textarea
            value={formData.brand_voice}
            onChange={(e) =>
              setFormData({ ...formData, brand_voice: e.target.value })
            }
            placeholder="Describe your brand's tone and personality... (e.g., Professional and approachable, Technical but friendly)"
            rows={4}
          />
          <Text fontSize="xs" color="brand.textLight">
            This helps AI generate content that matches your brand's personality
          </Text>
        </VStack>

        {/* Preview Card */}
        <Card.Root bg="brand.backgroundGray" p={6}>
          <Card.Header>
            <Heading size="sm">Preview</Heading>
          </Card.Header>
          <Card.Body>
            <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
              <Box height="40px" bg={formData.primary_color} borderRadius="md" />
              <Box height="40px" bg={formData.secondary_color} borderRadius="md" />
              <Box height="40px" bg={formData.accent_color} borderRadius="md" />
            </Grid>
            <Text fontFamily={formData.font_heading} fontSize="xl" fontWeight="bold" mb={2}>
              {formData.company_name || 'Company Name'}
            </Text>
            <Text fontFamily={formData.font_body} fontSize="md" color="brand.textLight">
              This is how your brand typography will look in marketing materials.
            </Text>
          </Card.Body>
        </Card.Root>

        {/* Action Buttons */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              size="lg"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            disabled={isLoading || !formData.company_name}
            loading={isLoading}
            size="lg"
            gridColumn={onCancel ? 'auto' : '1 / -1'}
          >
            {initialData ? 'Update Brand Kit' : 'Create Brand Kit'}
          </Button>
        </Grid>
      </VStack>
    </Box>
  )
}
