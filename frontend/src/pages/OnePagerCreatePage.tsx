/**
 * OnePager Create Page
 * 
 * Main page for creating new one-pagers with AI generation
 * Users fill out a form describing their product/problem
 * and AI generates a wireframe structure
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  Alert
} from '@chakra-ui/react'
import { CreateOnePagerForm } from '@/components/onepager/CreateOnePagerForm'
import { useOnePagerCreation } from '@/hooks/useOnePagerCreation'
import type { OnePagerFormData, OnePagerCreateRequest } from '@/types'

export function OnePagerCreatePage() {
  const navigate = useNavigate()
  const { createOnePager, isPending, error } = useOnePagerCreation()
  const [generationStatus, setGenerationStatus] = useState<string>('')

  const handleSubmit = async (data: OnePagerFormData) => {
    try {
      setGenerationStatus('Analyzing your input...')
      
      // Combine product and problem into input_prompt
      const inputPrompt = `Product/Service: ${data.product}\n\nProblem/Challenge: ${data.problem}`
      
      // Clean up optional fields - send undefined instead of empty strings
      const requestData: OnePagerCreateRequest = {
        title: data.title,
        input_prompt: inputPrompt,
        target_audience: data.target_audience && data.target_audience.trim() !== '' 
          ? data.target_audience.trim() 
          : undefined,
        brand_kit_id: data.brand_kit_id && data.brand_kit_id.trim() !== '' 
          ? data.brand_kit_id.trim() 
          : undefined
      }

      console.log('Submitting one-pager creation request:', requestData)
      console.log('Brand Kit ID being sent:', requestData.brand_kit_id)
      console.log('Brand Kit ID type:', typeof requestData.brand_kit_id)
      console.log('Brand Kit ID length:', requestData.brand_kit_id?.length)
      console.log('Target Audience being sent:', requestData.target_audience)
      setGenerationStatus('Generating wireframe structure...')
      
      await createOnePager(requestData)
      
      // Navigation happens in the hook's onSuccess
    } catch (err) {
      console.error('Failed to create one-pager:', err)
      setGenerationStatus('')
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        py={6}
        boxShadow="sm"
      >
        <Container maxW="container.lg">
          <VStack gap={2} align="start">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
            >
              ← Back to Dashboard
            </Button>
            <Heading size="xl">Create New One-Pager</Heading>
            <Text color="gray.600">
              Describe your product and problem, and AI will generate a professional wireframe structure
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.lg" py={8}>
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          p={8}
          position="relative"
        >
          {/* Loading Overlay */}
          {isPending && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="whiteAlpha.900"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={10}
            >
              <VStack gap={4}>
                <Spinner size="xl" color="blue.500" />
                <VStack gap={2}>
                  <Heading size="md">Creating Your One-Pager</Heading>
                  <Text color="gray.600" textAlign="center" maxW="400px">
                    {generationStatus || 'AI is analyzing your input and generating content...'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    This may take 10-30 seconds
                  </Text>
                </VStack>
              </VStack>
            </Box>
          )}

          {/* Error Display */}
          {error && !isPending && (
            <Alert.Root status="error" mb={6}>
              <Alert.Indicator />
              <Alert.Title>Generation Failed</Alert.Title>
              <Alert.Description>
                {error instanceof Error ? error.message : 'Failed to generate one-pager. Please try again.'}
              </Alert.Description>
            </Alert.Root>
          )}

          {/* Form */}
          <CreateOnePagerForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isPending}
          />
        </Box>

        {/* Help Text */}
        <Box mt={6} p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
          <Heading size="sm" mb={2} color="blue.900">
            💡 Tips for Better Results
          </Heading>
          <VStack gap={2} align="start" fontSize="sm" color="blue.800">
            <Text>• Be specific about your product features and benefits</Text>
            <Text>• Clearly describe the problem you're solving</Text>
            <Text>• Include your target audience for personalized messaging</Text>
            <Text>• Select a brand kit to automatically apply your brand styling</Text>
            <Text>• You can refine and iterate on the generated content after creation</Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
