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
  NativeSelectRoot,
  NativeSelectField,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCreateOnePager } from '../hooks/useOnePager';
import { useBrandKits } from '../hooks/useBrandKit';
import type { OnePagerCreateData } from '../types/onepager';

export function OnePagerCreatePage() {
  // Fixed: Removed duplicate default export
  const navigate = useNavigate();
  const createMutation = useCreateOnePager();
  const { data: brandKits } = useBrandKits();

  const [formData, setFormData] = useState<OnePagerCreateData>({
    title: '',
    problem: '',
    solution: '',
    features: [],
    benefits: [],
    integrations: [],
    social_proof: '',
    cta: { text: '', url: '' },
    brand_kit_id: '',
    target_audience: '',
    input_prompt: '',
    product_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get selected brand kit for product dropdown
  const selectedBrandKit = brandKits?.find(kit => kit.id === formData.brand_kit_id);

  // Handle product selection and auto-populate fields
  const handleProductSelect = (productId: string) => {
    const product = selectedBrandKit?.products?.find(p => p.id === productId);

    if (product) {
      setFormData({
        ...formData,
        product_id: productId,
        problem: product.default_problem || formData.problem,
        solution: product.default_solution || formData.solution,
        features: (product.features && product.features.length > 0) ? product.features : formData.features,
        benefits: (product.benefits && product.benefits.length > 0) ? product.benefits : formData.benefits,
      });
    } else {
      // Clear product selection
      setFormData({ ...formData, product_id: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.problem.trim()) {
      newErrors.problem = 'Problem statement is required';
    } else if (formData.problem.length < 10) {
      newErrors.problem = 'Problem must be at least 10 characters';
    } else if (formData.problem.length > 2000) {
      newErrors.problem = 'Problem must be less than 2000 characters';
    }

    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution statement is required';
    } else if (formData.solution.length < 10) {
      newErrors.solution = 'Solution must be at least 10 characters';
    } else if (formData.solution.length > 2000) {
      newErrors.solution = 'Solution must be less than 2000 characters';
    }

    if (!formData.cta.text.trim() || !formData.cta.url.trim()) {
      newErrors.cta = 'Call-to-action text and URL are required';
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
      const submitData: any = { ...formData };
      if (!submitData.brand_kit_id) delete submitData.brand_kit_id;
      if (!submitData.target_audience) delete submitData.target_audience;
      if (!submitData.input_prompt) delete submitData.input_prompt;
      if (!submitData.product_id) delete submitData.product_id;
      if (!submitData.integrations || submitData.integrations.length === 0) delete submitData.integrations;
      if (!submitData.social_proof) delete submitData.social_proof;
      if (!submitData.visuals || submitData.visuals.length === 0) delete submitData.visuals;

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
              Define your product's problem, solution, and key details for AI-powered one-pager generation
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
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  One-Pager Title <Text as="span" color="red.500">*</Text>
                </Text>
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
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.title}</Text>
                )}
              </Box>

              {/* Problem Statement */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Problem Statement <Text as="span" color="red.500">*</Text>
                </Text>
                <Textarea
                  value={formData.problem}
                  onChange={(e) =>
                    setFormData({ ...formData, problem: e.target.value })
                  }
                  placeholder="What problem does this product solve? (e.g., Finding authentic, affordable Vietnamese food that's both quick and healthy can be challenging in our busy neighborhood)"
                  minH="100px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                {errors.problem && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.problem}</Text>
                )}
              </Box>

              {/* Solution Statement */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Solution Statement <Text as="span" color="red.500">*</Text>
                </Text>
                <Textarea
                  value={formData.solution}
                  onChange={(e) =>
                    setFormData({ ...formData, solution: e.target.value })
                  }
                  placeholder="How does this product solve the problem? (e.g., Vietspot brings authentic Vietnamese flavors to your neighborhood with traditional pho and banh mi made fresh daily)"
                  minH="100px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                {errors.solution && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.solution}</Text>
                )}
              </Box>

              {/* Features (comma-separated) */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Features (Optional)
                </Text>
                <Textarea
                  value={formData.features.join(', ')}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()).filter(f => f) })
                  }
                  placeholder="Enter features separated by commas (e.g., Traditional pho options, House-made banh mi, Fresh herbs daily)"
                  minH="80px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Separate multiple features with commas
                </Text>
              </Box>

              {/* Benefits (comma-separated) */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Benefits (Optional)
                </Text>
                <Textarea
                  value={formData.benefits.join(', ')}
                  onChange={(e) =>
                    setFormData({ ...formData, benefits: e.target.value.split(',').map(b => b.trim()).filter(b => b) })
                  }
                  placeholder="Enter benefits separated by commas (e.g., Quick service under 10 min, Affordable pricing, Authentic family recipes)"
                  minH="80px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Separate multiple benefits with commas
                </Text>
              </Box>

              {/* Integrations (comma-separated) */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Integrations (Optional)
                </Text>
                <Textarea
                  value={formData.integrations?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, integrations: e.target.value.split(',').map(i => i.trim()).filter(i => i) })
                  }
                  placeholder="Enter integrations separated by commas (e.g., Slack, Google Drive, Salesforce)"
                  minH="80px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Separate multiple integrations with commas
                </Text>
              </Box>

              {/* Social Proof */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Social Proof / Testimonial (Optional)
                </Text>
                <Textarea
                  value={formData.social_proof || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, social_proof: e.target.value })
                  }
                  placeholder="Enter customer testimonial or social proof (e.g., '4.9 stars on Google' or 'Voted Best Pho in the neighborhood by City Magazine')"
                  minH="100px"
                  fontSize="16px"
                  borderRadius="12px"
                  border="2px solid #e2e8f0"
                  _focus={{
                    borderColor: '#864CBD',
                    boxShadow: '0 0 0 1px #864CBD',
                  }}
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Add customer quotes, ratings, or awards to build credibility
                </Text>
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
                    placeholder="Button text (e.g., Order Now, Visit Us, Get Started)"
                    h="56px"
                    fontSize="16px"
                    borderRadius="12px"
                    border="2px solid #e2e8f0"
                    _focus={{
                      borderColor: '#864CBD',
                      boxShadow: '0 0 0 1px #864CBD',
                    }}
                  />
                  <Input
                    value={formData.cta.url}
                    onChange={(e) =>
                      setFormData({ ...formData, cta: { ...formData.cta, url: e.target.value } })
                    }
                    placeholder="URL (e.g., https://vietspot.com/order)"
                    h="56px"
                    fontSize="16px"
                    borderRadius="12px"
                    border="2px solid #e2e8f0"
                    _focus={{
                      borderColor: '#864CBD',
                      boxShadow: '0 0 0 1px #864CBD',
                    }}
                  />
                </VStack>
                {errors.cta && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.cta}</Text>
                )}
              </Box>

              {/* Brand Kit Selection */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Brand Kit (Optional)
                </Text>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={formData.brand_kit_id}
                    onChange={(e) => {
                      setFormData({ ...formData, brand_kit_id: e.target.value, product_id: '' });
                    }}
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
                    {brandKits?.map(kit => (
                      <option key={kit.id} value={kit.id}>
                        {kit.company_name}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Apply your brand colors and fonts to the generated one-pager
                </Text>
              </Box>

              {/* Product Selection (shows if brand kit has products) */}
              {selectedBrandKit && selectedBrandKit.products && selectedBrandKit.products.length > 0 && (
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight={600} fontSize="16px" color="#2d3748">
                      Product (Optional)
                    </Text>
                    {formData.product_id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        onClick={() => handleProductSelect('')}
                        fontSize="xs"
                      >
                        Clear Selection
                      </Button>
                    )}
                  </HStack>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={formData.product_id || ''}
                      onChange={(e) => handleProductSelect(e.target.value)}
                      h="56px"
                      fontSize="16px"
                      borderRadius="12px"
                      border="2px solid #e2e8f0"
                      bg={formData.product_id ? 'rgba(16, 185, 129, 0.05)' : 'white'}
                      _focus={{
                        borderColor: '#864CBD',
                        boxShadow: '0 0 0 1px #864CBD',
                      }}
                    >
                      <option value="">Select a product to auto-populate fields</option>
                      {selectedBrandKit.products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                  {!formData.product_id ? (
                    <Text fontSize="sm" color="green.600" fontWeight={500} mt={1}>
                      💡 Select a product to auto-fill problem, solution, features, and benefits
                    </Text>
                  ) : (
                    <Box
                      mt={2}
                      p={3}
                      bg="rgba(16, 185, 129, 0.1)"
                      border="1px solid rgba(16, 185, 129, 0.3)"
                      borderRadius="8px"
                    >
                      <Text fontSize="sm" color="green.700" fontWeight={600}>
                        ✓ Product selected! Fields have been auto-populated.
                      </Text>
                      <Text fontSize="xs" color="green.600" mt={1}>
                        You can still edit the fields below before generating your one-pager.
                      </Text>
                    </Box>
                  )}
                </Box>
              )}

              {/* Target Audience */}
              <Box>
                <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                  Target Audience (Optional)
                </Text>
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
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Helps AI tailor content and tone for your specific audience
                </Text>
                {errors.target_audience && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.target_audience}</Text>
                )}
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={createMutation.isPending}
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
                disabled={createMutation.isPending}
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
                    <strong>💡 Pro Tip:</strong> Be specific with your problem and solution statements.
                    The AI will create a professional one-pager layout in 3-7 seconds based on your inputs.
                    You can refine it afterwards using our Smart Canvas editor.
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
