/**
 * OnePager Create Page
 *
 * Form for creating new OnePagers with AI generation:
 * - Title input
 * - AI prompt textarea (10-2000 chars)
 * - Brand Kit selection (optional)
 * - Target audience input (optional)
 * - Loading state during AI generation
 * - Auto-navigate to detail page on success
 */

import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Select,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCreateOnePager } from '../hooks/useOnePager';
import { useBrandKits } from '../hooks/useBrandKit';
import type { OnePagerCreateData } from '../types/onepager';

export function OnePagerCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateOnePager();
  const { data: brandKits } = useBrandKits();

  const [formData, setFormData] = useState<OnePagerCreateData>({
    title: '',
    input_prompt: '',
    brand_kit_id: '',
    target_audience: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.input_prompt.trim()) {
      newErrors.input_prompt = 'AI prompt is required';
    } else if (formData.input_prompt.length < 10) {
      newErrors.input_prompt = 'Prompt must be at least 10 characters';
    } else if (formData.input_prompt.length > 2000) {
      newErrors.input_prompt = 'Prompt must be less than 2000 characters';
    }

    if (formData.target_audience && formData.target_audience.length > 500) {
      newErrors.target_audience = 'Target audience must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Remove empty optional fields
      const submitData = { ...formData };
      if (!submitData.brand_kit_id) delete submitData.brand_kit_id;
      if (!submitData.target_audience) delete submitData.target_audience;

      const result = await createMutation.mutateAsync(submitData);
      // Navigate to detail page to view AI-generated content
      navigate(`/onepager/${result.id}`);
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.detail || 'Failed to create OnePager. Please try again.',
      });
    }
  };

  return (
    <Box minH="100vh" bg="#FFFFFF">
      {/* Header */}
      <Box background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)" py={16} px={4}>
        <Container maxW="1200px">
          <VStack gap={4} align="start">
            <HStack gap={4}>
              <Button
                onClick={() => navigate('/onepager/list')}
                variant="ghost"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
              >
                ← Back
              </Button>
            </HStack>
            <Heading
              fontSize={{ base: '36px', md: '48px' }}
              fontWeight={700}
              color="white"
              letterSpacing="-0.02em"
            >
              Create One-Pager
            </Heading>
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              color="rgba(255, 255, 255, 0.9)"
              maxW="700px"
            >
              Describe your vision and let AI create a professional marketing one-pager in seconds
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Form */}
      <Container maxW="900px" px={{ base: 4, md: 8 }} py={12}>
        <Box
          bg="white"
          borderRadius="16px"
          boxShadow="0 4px 24px rgba(0, 0, 0, 0.08)"
          p={{ base: 6, md: 10 }}
          border="1px solid #e2e8f0"
          mx="auto"
          maxW="800px"
        >
          <form onSubmit={handleSubmit}>
            <VStack gap={6} align="stretch">
              {/* General Error */}
              {errors.general && (
                <Box
                  bg="#fed7d7"
                  border="2px solid #fc8181"
                  borderRadius="12px"
                  p={4}
                >
                  <Text color="#c53030" fontWeight={600}>
                    {errors.general}
                  </Text>
                </Box>
              )}

              {/* Title */}
              <FormControl isInvalid={!!errors.title} isRequired>
                <FormLabel fontWeight={600} fontSize="16px" color="#2d3748">
                  One-Pager Title
                </FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Product Launch 2025, Sales Enablement Guide"
                  h="56px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                {errors.title && (
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                )}
              </FormControl>

              {/* AI Prompt */}
              <FormControl isInvalid={!!errors.input_prompt} isRequired>
                <FormLabel fontWeight={600} fontSize="16px" color="#2d3748">
                  Describe Your One-Pager
                </FormLabel>
                <Textarea
                  value={formData.input_prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, input_prompt: e.target.value })
                  }
                  placeholder="Describe what you want in your one-pager. Include key messages, target audience, and main features you want to highlight. The more detail you provide, the better the AI can generate relevant content.

Example: Create a one-pager for our new SaaS product targeting IT managers. Focus on security, scalability, and cost savings. Include a hero section, 3-4 key features, and a strong call-to-action."
                  minH="200px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                <HStack justify="space-between" mt={2}>
                  <FormHelperText fontSize="sm" color="gray.600">
                    {formData.input_prompt.length < 10 && formData.input_prompt.length > 0
                      ? `${10 - formData.input_prompt.length} more characters needed`
                      : 'Be specific for best results'}
                  </FormHelperText>
                  <Text
                    fontSize="sm"
                    color={
                      formData.input_prompt.length > 2000
                        ? '#c53030'
                        : formData.input_prompt.length > 1800
                        ? '#dd6b20'
                        : 'gray.600'
                    }
                  >
                    {formData.input_prompt.length}/2000
                  </Text>
                </HStack>
                {errors.input_prompt && (
                  <FormErrorMessage>{errors.input_prompt}</FormErrorMessage>
                )}
              </FormControl>

              {/* Brand Kit Selection */}
              <FormControl>
                <FormLabel fontWeight={600} fontSize="16px" color="#2d3748">
                  Brand Kit (Optional)
                </FormLabel>
                <Select
                  value={formData.brand_kit_id}
                  onChange={(e) =>
                    setFormData({ ...formData, brand_kit_id: e.target.value })
                  }
                  h="56px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                >
                  <option value="">No Brand Kit (Use default styling)</option>
                  {brandKits && brandKits.length > 0 && brandKits[0] && (
                    <option value={brandKits[0].id}>
                      {brandKits[0].company_name}
                    </option>
                  )}
                </Select>
                <FormHelperText fontSize="sm" color="gray.600">
                  Apply your brand colors and fonts to the generated one-pager
                </FormHelperText>
              </FormControl>

              {/* Target Audience */}
              <FormControl isInvalid={!!errors.target_audience}>
                <FormLabel fontWeight={600} fontSize="16px" color="#2d3748">
                  Target Audience (Optional)
                </FormLabel>
                <Input
                  value={formData.target_audience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target_audience: e.target.value,
                    })
                  }
                  placeholder="e.g., IT decision makers in mid-size companies, Marketing professionals"
                  h="56px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                <FormHelperText fontSize="sm" color="gray.600">
                  Helps AI tailor content and tone for your specific audience
                </FormHelperText>
                {errors.target_audience && (
                  <FormErrorMessage>{errors.target_audience}</FormErrorMessage>
                )}
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={createMutation.isPending}
                h="56px"
                borderRadius="50px"
                fontSize="18px"
                fontWeight={600}
                background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
                color="white"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(134, 76, 189, 0.4)',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.3s ease"
                isDisabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <HStack gap={3}>
                    <Spinner size="sm" />
                    <Text>AI is generating your one-pager...</Text>
                  </HStack>
                ) : (
                  '✨ Generate with AI'
                )}
              </Button>

              {/* Info Box */}
              {!createMutation.isPending && (
                <Box
                  bg="rgba(134, 76, 189, 0.05)"
                  border="1px solid rgba(134, 76, 189, 0.2)"
                  borderRadius="12px"
                  p={4}
                >
                  <Text fontSize="sm" color="#2d3748" lineHeight="1.6">
                    <strong>💡 Pro Tip:</strong> Generation typically takes 3-7 seconds. The AI will
                    create a wireframe layout with 4-6 sections based on your description. You
                    can refine it afterwards using our Smart Canvas editor.
                  </Text>
                </Box>
              )}
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}

export default OnePagerCreatePage;
