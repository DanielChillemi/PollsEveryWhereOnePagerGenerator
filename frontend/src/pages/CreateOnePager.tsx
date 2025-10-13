/**
 * CreateOnePager Page
 * Form for creating new OnePagers with structured fields matching backend schema
 * Version: 2025-10-12-v2
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
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCreateOnePager } from '../hooks/useOnePager';
import { useBrandKits } from '../hooks/useBrandKit';
import type { OnePagerCreateData } from '../types/onepager';

export function CreateOnePager() {
  const navigate = useNavigate();
  const createMutation = useCreateOnePager();
  const { data: brandKits, isLoading: isLoadingBrandKits } = useBrandKits();

  const [formData, setFormData] = useState<OnePagerCreateData>({
    title: '',
    problem: '',
    solution: '',
    features: [],
    benefits: [],
    cta: { text: '', url: '' },
    brand_kit_id: '',
    target_audience: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.problem.trim()) {
      newErrors.problem = 'Problem statement is required';
    } else if (formData.problem.length < 10) {
      newErrors.problem = 'Problem must be at least 10 characters';
    }

    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution statement is required';
    } else if (formData.solution.length < 10) {
      newErrors.solution = 'Solution must be at least 10 characters';
    }

    if (!formData.cta.text.trim() || !formData.cta.url.trim()) {
      newErrors.cta = 'Call-to-action text and URL are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const submitData: any = { ...formData };
      if (!submitData.brand_kit_id) delete submitData.brand_kit_id;
      if (!submitData.target_audience) delete submitData.target_audience;

      const result = await createMutation.mutateAsync(submitData);
      navigate(`/onepager/${result.id}`);
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.detail || 'Failed to create OnePager. Please try again.',
      });
    }
  };

  return (
    <Box minH="100vh" bg="#FFFFFF">
      <Box background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)" py={16} px={4}>
        <Container maxW="1200px">
          <VStack gap={4} align="start">
            <Button
              onClick={() => navigate('/onepager/list')}
              variant="ghost"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
            >
              ← Back
            </Button>
            <Heading fontSize={{ base: '36px', md: '48px' }} fontWeight={700} color="white">
              Create One-Pager
            </Heading>
            <Text fontSize={{ base: '18px', md: '20px' }} color="rgba(255, 255, 255, 0.9)">
              Define your product's problem, solution, and key details
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="900px" px={{ base: 4, md: 8 }} py={12}>
        <Box bg="white" borderRadius="16px" boxShadow="lg" p={{ base: 6, md: 10 }} border="1px solid #e2e8f0">
          <form onSubmit={handleSubmit}>
            <VStack gap={6} align="stretch">
              {errors.general && (
                <Box bg="#fed7d7" border="2px solid #fc8181" borderRadius="12px" p={4}>
                  <Text color="#c53030" fontWeight={600}>{errors.general}</Text>
                </Box>
              )}

              {/* Title */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  One-Pager Title <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Product Launch 2025"
                  h="56px"
                  fontSize="16px"
                  borderRadius="12px"
                />
                {errors.title && <Text color="red.500" fontSize="sm" mt={1}>{errors.title}</Text>}
              </Box>

              {/* Problem Statement */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Problem Statement <Text as="span" color="red.500">*</Text>
                </Text>
                <Textarea
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="What problem does this solve? (e.g., Finding authentic Vietnamese food that's quick and healthy)"
                  minH="100px"
                  fontSize="16px"
                  borderRadius="12px"
                />
                {errors.problem && <Text color="red.500" fontSize="sm" mt={1}>{errors.problem}</Text>}
              </Box>

              {/* Solution Statement */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Solution Statement <Text as="span" color="red.500">*</Text>
                </Text>
                <Textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="How does this solve the problem? (e.g., Authentic Vietnamese flavors made fresh daily)"
                  minH="100px"
                  fontSize="16px"
                  borderRadius="12px"
                />
                {errors.solution && <Text color="red.500" fontSize="sm" mt={1}>{errors.solution}</Text>}
              </Box>

              {/* Features */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Features (Optional)
                </Text>
                <Textarea
                  value={formData.features.join(', ')}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()).filter(f => f) })
                  }
                  placeholder="Enter features separated by commas (e.g., Traditional pho, House-made banh mi)"
                  minH="80px"
                  fontSize="16px"
                  borderRadius="12px"
                />
                <Text fontSize="sm" color="gray.600" mt={1}>Separate multiple features with commas</Text>
              </Box>

              {/* Benefits */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Benefits (Optional)
                </Text>
                <Textarea
                  value={formData.benefits.join(', ')}
                  onChange={(e) =>
                    setFormData({ ...formData, benefits: e.target.value.split(',').map(b => b.trim()).filter(b => b) })
                  }
                  placeholder="Enter benefits separated by commas (e.g., Quick service, Affordable pricing)"
                  minH="80px"
                  fontSize="16px"
                  borderRadius="12px"
                />
                <Text fontSize="sm" color="gray.600" mt={1}>Separate multiple benefits with commas</Text>
              </Box>

              {/* Call-to-Action */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Call-to-Action <Text as="span" color="red.500">*</Text>
                </Text>
                <VStack gap={3} align="stretch">
                  <Input
                    value={formData.cta.text}
                    onChange={(e) =>
                      setFormData({ ...formData, cta: { ...formData.cta, text: e.target.value } })
                    }
                    placeholder="Button text (e.g., Order Now)"
                    h="56px"
                    fontSize="16px"
                    borderRadius="12px"
                  />
                  <Input
                    value={formData.cta.url}
                    onChange={(e) =>
                      setFormData({ ...formData, cta: { ...formData.cta, url: e.target.value } })
                    }
                    placeholder="URL (e.g., https://example.com/order)"
                    h="56px"
                    fontSize="16px"
                    borderRadius="12px"
                  />
                </VStack>
                {errors.cta && <Text color="red.500" fontSize="sm" mt={1}>{errors.cta}</Text>}
              </Box>

              {/* Brand Kit - Temporarily disabled for testing */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Brand Kit (Optional)
                </Text>
                <Input
                  value={formData.brand_kit_id || ''}
                  onChange={(e) => setFormData({ ...formData, brand_kit_id: e.target.value })}
                  placeholder="Brand Kit ID (optional)"
                  h="56px"
                  fontSize="16px"
                  borderRadius="12px"
                />
              </Box>

              {/* Target Audience */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Target Audience (Optional)
                </Text>
                <Input
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="e.g., IT decision makers"
                  h="56px"
                  fontSize="16px"
                  borderRadius="12px"
                />
              </Box>

              <Button
                type="submit"
                isLoading={createMutation.isPending}
                h="56px"
                borderRadius="50px"
                fontSize="18px"
                fontWeight={600}
                background="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
                color="white"
                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(134, 76, 189, 0.4)' }}
                transition="all 0.3s ease"
              >
                {createMutation.isPending ? (
                  <HStack gap={3}>
                    <Spinner size="sm" />
                    <Text>Generating...</Text>
                  </HStack>
                ) : (
                  '✨ Generate with AI'
                )}
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
