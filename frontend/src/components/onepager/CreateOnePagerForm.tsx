/**
 * CreateOnePagerForm Component
 * 
 * Form for creating new one-pagers with validation
 * Uses React Hook Form with Zod schema validation
 */

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Button,
  VStack,
  HStack,
  Input,
  Textarea,
  Text,
  Field
} from '@chakra-ui/react'
import axios from 'axios'
import type { OnePagerFormData } from '@/types/api.types'
import type { BrandKit } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// Validation schema
const onePagerFormSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  product: z.string()
    .min(10, 'Product description must be at least 10 characters')
    .max(1000, 'Product description must be less than 1000 characters'),
  problem: z.string()
    .min(10, 'Problem statement must be at least 10 characters')
    .max(1000, 'Problem statement must be less than 1000 characters'),
  target_audience: z.string()
    .max(200, 'Target audience must be less than 200 characters')
    .optional(),
  brand_kit_id: z.string().optional()
})

interface CreateOnePagerFormProps {
  onSubmit: (data: OnePagerFormData) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CreateOnePagerForm({ onSubmit, onCancel, isSubmitting = false }: CreateOnePagerFormProps) {
  const [brandKits, setBrandKits] = useState<BrandKit[]>([])
  const [loadingBrandKits, setLoadingBrandKits] = useState(false)
  const [targetAudiences, setTargetAudiences] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<OnePagerFormData>({
    resolver: zodResolver(onePagerFormSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      product: '',
      problem: '',
      target_audience: '',
      brand_kit_id: ''
    }
  })

  // Watch values
  const productValue = watch('product')
  const problemValue = watch('problem')
  const selectedBrandKitId = watch('brand_kit_id')

  // Fetch user's active brand kit on mount
  useEffect(() => {
    const fetchBrandKit = async () => {
      try {
        setLoadingBrandKits(true)
        const token = localStorage.getItem('access_token')
        
        if (!token) {
          console.warn('No access token found')
          return
        }

        console.log('Fetching user brand kit...')

        // API returns single active brand kit at /me endpoint
        const response = await axios.get<any>(
          `${API_BASE_URL}/brand-kits/me`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        console.log('Brand kit loaded (raw):', response.data)
        console.log('Brand kit _id:', response.data._id)
        console.log('Brand kit id:', response.data.id)
        
        // Transform backend response to match frontend types
        // Backend uses _id, frontend expects id
        const brandKit: BrandKit = {
          ...response.data,
          id: response.data._id || response.data.id  // Map _id to id
        }
        
        console.log('Transformed brand kit:', brandKit)
        console.log('Target audiences raw:', brandKit.target_audiences)
        
        // Store as array with single item for consistency
        setBrandKits([brandKit])
        
        // Auto-populate target audiences
        if (brandKit.target_audiences && brandKit.target_audiences.length > 0) {
          // Trim whitespace from audience names
          const audiences = brandKit.target_audiences.map(ta => ta.name.trim())
          setTargetAudiences(audiences)
          console.log('Target audiences loaded (trimmed):', audiences)
        } else {
          console.log('No target audiences in brand kit')
        }
      } catch (error) {
        console.error('Failed to fetch brand kit:', error)
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            console.log('No active brand kit found - user needs to create one')
          } else {
            console.error('Response:', error.response?.data)
            console.error('Status:', error.response?.status)
          }
        }
      } finally {
        setLoadingBrandKits(false)
      }
    }

    fetchBrandKit()
  }, [])

  // Update target audiences when brand kit changes
  useEffect(() => {
    if (selectedBrandKitId) {
      const selectedKit = brandKits.find(kit => kit.id === selectedBrandKitId)
      if (selectedKit && selectedKit.target_audiences && selectedKit.target_audiences.length > 0) {
        const audiences = selectedKit.target_audiences.map(ta => ta.name)
        setTargetAudiences(audiences)
        console.log('Target audiences for selected brand kit:', audiences)
      } else {
        setTargetAudiences([])
      }
    } else {
      setTargetAudiences([])
    }
  }, [selectedBrandKitId, brandKits])

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={6} align="stretch">
        {/* Title */}
        <Field.Root invalid={!!errors.title}>
          <Field.Label htmlFor="title">
            One-Pager Title <Text as="span" color="red.500">*</Text>
          </Field.Label>
          <Input
            id="title"
            placeholder="e.g., Product Launch: Q1 2025"
            {...register('title')}
            disabled={isSubmitting}
          />
          {errors.title && (
            <Field.ErrorText>{errors.title.message}</Field.ErrorText>
          )}
          <Field.HelperText>
            Give your one-pager a descriptive title (3-100 characters)
          </Field.HelperText>
        </Field.Root>

        {/* Product Description */}
        <Field.Root invalid={!!errors.product}>
          <Field.Label htmlFor="product">
            What is your product or service? <Text as="span" color="red.500">*</Text>
          </Field.Label>
          <Textarea
            id="product"
            placeholder="Describe your product, its features, and benefits. Be specific about what makes it unique and valuable to users."
            rows={6}
            {...register('product')}
            disabled={isSubmitting}
          />
          {errors.product && (
            <Field.ErrorText>{errors.product.message}</Field.ErrorText>
          )}
          <Field.HelperText>
            {productValue?.length || 0} / 1000 characters • 10 character minimum
          </Field.HelperText>
        </Field.Root>

        {/* Problem Statement */}
        <Field.Root invalid={!!errors.problem}>
          <Field.Label htmlFor="problem">
            What problem does it solve? <Text as="span" color="red.500">*</Text>
          </Field.Label>
          <Textarea
            id="problem"
            placeholder="Explain the problem your target audience faces and how your solution addresses it. Include pain points and challenges."
            rows={5}
            {...register('problem')}
            disabled={isSubmitting}
          />
          {errors.problem && (
            <Field.ErrorText>{errors.problem.message}</Field.ErrorText>
          )}
          <Field.HelperText>
            {problemValue?.length || 0} / 1000 characters • 10 character minimum
          </Field.HelperText>
        </Field.Root>

        {/* Brand Kit Info/Selector */}
        <Field.Root>
          <Field.Label htmlFor="brand_kit_id">
            Brand Kit
          </Field.Label>
          
          {loadingBrandKits ? (
            <Input value="Loading your brand kit..." disabled />
          ) : brandKits.length > 0 ? (
            <>
              <Box
                as="select"
                id="brand_kit_id"
                {...register('brand_kit_id')}
                py={2}
                px={3}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.300"
                bg="white"
                defaultValue={brandKits[0].id}
              >
                <option value="">Don't use brand kit</option>
                {brandKits.map(kit => (
                  <option key={kit.id} value={kit.id}>
                    {kit.company_name} (Active)
                  </option>
                ))}
              </Box>
              <Field.HelperText>
                ✅ Using "{brandKits[0].company_name}" brand colors, fonts, and voice
              </Field.HelperText>
            </>
          ) : (
            <>
              <Input 
                value="No brand kit found" 
                disabled 
                placeholder="Create a brand kit first"
              />
              <Field.HelperText color="orange.500">
                💡 Create a brand kit to apply your brand automatically
              </Field.HelperText>
            </>
          )}
        </Field.Root>

        {/* Target Audience */}
        <Field.Root invalid={!!errors.target_audience}>
          <Field.Label htmlFor="target_audience">
            Target Audience <Text as="span" color="gray.500">(optional)</Text>
          </Field.Label>
          
          {loadingBrandKits ? (
            <Input value="Loading..." disabled />
          ) : targetAudiences.length > 0 ? (
            <>
              <Box
                as="select"
                id="target_audience"
                {...register('target_audience')}
                py={2}
                px={3}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.300"
                bg="white"
              >
                <option value="">Select from brand kit audiences</option>
                {targetAudiences.map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </Box>
              {console.log('Rendering target audience dropdown with:', targetAudiences)}
            </>
          ) : (
            <>
              <Input
                id="target_audience"
                placeholder="e.g., B2B marketers, sales teams, small businesses"
                {...register('target_audience')}
                disabled={isSubmitting}
              />
              {console.log('Rendering target audience input (no audiences found)')}
            </>
          )}
          
          {errors.target_audience && (
            <Field.ErrorText>{errors.target_audience.message}</Field.ErrorText>
          )}
          <Field.HelperText>
            {targetAudiences.length > 0 
              ? `✅ ${targetAudiences.length} target ${targetAudiences.length === 1 ? 'audience' : 'audiences'} loaded from your brand kit`
              : 'Who is this one-pager for? Helps AI personalize messaging. Add audiences to your brand kit to see them here.'
            }
          </Field.HelperText>
        </Field.Root>

        {/* Action Buttons */}
        <HStack gap={4} pt={4}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            flex={1}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            flex={2}
          >
            {isSubmitting ? 'Generating...' : 'Generate with AI →'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
