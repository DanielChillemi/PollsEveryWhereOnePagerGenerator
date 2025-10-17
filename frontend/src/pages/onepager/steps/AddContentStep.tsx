/**
 * Add Content Step (Step 1)
 * 
 * Modern, compact form for collecting one-pager content
 */

import { Box, VStack, HStack, Text, Input, Textarea, Button, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { useBrandKits } from '../../../hooks/useBrandKit';
import type { OnePagerCreateData } from '../../../types/onepager';

interface AddContentStepProps {
  formData: OnePagerCreateData;
  setFormData: (data: OnePagerCreateData) => void;
  isLoading?: boolean;
}

export function AddContentStep({ formData, setFormData }: AddContentStepProps) {
  const { data: brandKits } = useBrandKits();

  // Get selected brand kit for product dropdown
  const selectedBrandKit = brandKits?.find(kit => kit.id === formData.brand_kit_id);

  // Handle product selection and auto-populate fields
  const handleProductSelect = (productId: string) => {
    const product = selectedBrandKit?.products?.find(p => p.id === productId);

    if (product) {
      // Prioritize product data over existing form data, including title
      setFormData({
        ...formData,
        product_id: productId,
        title: product.name || formData.title,
        problem: product.default_problem && product.default_problem.trim() 
          ? product.default_problem 
          : formData.problem,
        solution: product.default_solution && product.default_solution.trim() 
          ? product.default_solution 
          : formData.solution,
        features: (product.features && product.features.length > 0) 
          ? product.features 
          : formData.features,
        benefits: (product.benefits && product.benefits.length > 0) 
          ? product.benefits 
          : formData.benefits,
      });
    } else {
      setFormData({ ...formData, product_id: '' });
    }
  };

  return (
    <VStack align="stretch" gap={4}>
      {/* Step Header - Compact */}
      <Box mb={2}>
        <Text fontSize="22px" fontWeight="700" color="#1568B8" mb={1}>
          Add Content
        </Text>
        <Text fontSize="13px" color="gray.500" lineHeight="1.5">
          Define your product's problem, solution, and key details for AI-powered one-pager generation
        </Text>
      </Box>

      {/* Brand Kit Selection */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Brand Kit
        </Text>
        <NativeSelectRoot>
          <NativeSelectField
            value={formData.brand_kit_id}
            onChange={(e) => {
              setFormData({ ...formData, brand_kit_id: e.target.value, product_id: '', title: '' });
            }}
            px={3}
            fontSize="14px"
            h="40px"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.300"
            bg="white"
            transition="all 0.2s"
            _hover={{ borderColor: 'gray.400' }}
            _focus={{
              borderColor: '#864CBD',
              boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
              outline: 'none',
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
        <Text fontSize="11px" color="gray.500" mt={1}>
          Apply your brand colors and fonts
        </Text>
      </Box>

      {/* Product Selection */}
      {selectedBrandKit && selectedBrandKit.products && selectedBrandKit.products.length > 0 && (
        <Box>
          <HStack justify="space-between" mb={1.5}>
            <Text fontWeight={600} fontSize="13px" color="gray.700" letterSpacing="0.3px">
              Product
            </Text>
            {formData.product_id && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="gray"
                onClick={() => handleProductSelect('')}
                fontSize="11px"
                h="24px"
              >
                Clear
              </Button>
            )}
          </HStack>
          <NativeSelectRoot>
            <NativeSelectField
              value={formData.product_id || ''}
              onChange={(e) => handleProductSelect(e.target.value)}
              px={3}
              fontSize="14px"
              h="40px"
              borderRadius="8px"
              border="1px solid"
              borderColor="gray.300"
              bg={formData.product_id ? 'rgba(16, 185, 129, 0.05)' : 'white'}
              transition="all 0.2s"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{
                borderColor: '#864CBD',
                boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
                outline: 'none',
              }}
            >
              <option value="">Select a product</option>
              {selectedBrandKit.products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
          {!formData.product_id && (
            <Text fontSize="11px" color="green.600" fontWeight={500} mt={1}>
              💡 Auto-fills title, problem, solution, features, and benefits
            </Text>
          )}
        </Box>
      )}

      {/* Target Audience */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Target Audience
        </Text>
        <NativeSelectRoot>
          <NativeSelectField
            value={formData.target_audience || ''}
            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            px={3}
            fontSize="14px"
            h="40px"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.300"
            opacity={!selectedBrandKit ? 0.5 : 1}
            pointerEvents={!selectedBrandKit ? 'none' : 'auto'}
            transition="all 0.2s"
            _hover={{ borderColor: 'gray.400' }}
            _focus={{
              borderColor: '#864CBD',
              boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
              outline: 'none',
            }}
          >
            <option value="">Select target audience</option>
            {selectedBrandKit?.target_audiences?.map((audience, index) => (
              <option key={index} value={audience.name}>
                {audience.name}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
        <Text fontSize="11px" color="gray.500" mt={1}>
          {selectedBrandKit ? 'Helps AI tailor content and tone' : 'Select a Brand Kit first'}
        </Text>
      </Box>

      {/* Title */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          One-Pager Title <Text as="span" color="red.500">*</Text>
        </Text>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Product Launch 2025"
          px={4}
          h="40px"
          fontSize="14px"
          borderRadius="8px"
          border="2px solid"
          borderColor={!formData.title ? 'red.300' : 'gray.300'}
          bg={formData.product_id && formData.title ? 'rgba(16, 185, 129, 0.05)' : 'white'}
          transition="all 0.2s"
          _hover={{ borderColor: !formData.title ? 'red.400' : 'gray.400' }}
          _focus={{
            borderColor: '#864CBD',
            boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
            outline: 'none',
          }}
        />
        <Text fontSize="11px" color="gray.500" mt={1}>
          {formData.product_id ? 'Auto-populated (editable)' : 'Descriptive title for your one-pager'}
        </Text>
      </Box>

      {/* Problem Statement */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Problem Statement <Text as="span" color="red.500">*</Text>
        </Text>
        <Textarea
          value={formData.problem}
          onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
          placeholder="What problem does this product solve?"
          minH="80px"
          fontSize="14px"
          px={4}
          py={3}
          borderRadius="8px"
          border="2px solid"
          borderColor={!formData.problem ? 'red.300' : 'gray.300'}
          transition="all 0.2s"
          _hover={{ borderColor: !formData.problem ? 'red.400' : 'gray.400' }}
          _focus={{
            borderColor: '#864CBD',
            boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
            outline: 'none',
          }}
        />
        <HStack justify="space-between" mt={1}>
          <Text fontSize="11px" color="gray.500">
            Core problem your product addresses
          </Text>
          <Text fontSize="11px" color="gray.400">
            {formData.problem.length}
          </Text>
        </HStack>
      </Box>

      {/* Solution */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Solution <Text as="span" color="red.500">*</Text>
        </Text>
        <Textarea
          value={formData.solution}
          onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
          placeholder="How does your product solve this?"
          minH="80px"
          fontSize="14px"
          px={4}
          py={3}
          borderRadius="8px"
          border="2px solid"
          borderColor={!formData.solution ? 'red.300' : 'gray.300'}
          transition="all 0.2s"
          _hover={{ borderColor: !formData.solution ? 'red.400' : 'gray.400' }}
          _focus={{
            borderColor: '#864CBD',
            boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
            outline: 'none',
          }}
        />
        <HStack justify="space-between" mt={1}>
          <Text fontSize="11px" color="gray.500">
            How your product solves the problem
          </Text>
          <Text fontSize="11px" color="gray.400">
            {formData.solution.length}
          </Text>
        </HStack>
      </Box>

      {/* Features */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Features
        </Text>
        <Textarea
          value={formData.features.join(', ')}
          onChange={(e) =>
            setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()).filter(Boolean) })
          }
          placeholder="Key features (separate with commas)"
          minH="70px"
          fontSize="14px"
          px={3}
          py={2.5}
          borderRadius="8px"
          border="1px solid"
          borderColor="gray.300"
          bg={formData.features.length > 0 && formData.product_id ? 'rgba(16, 185, 129, 0.05)' : 'white'}
          transition="all 0.2s"
          _hover={{ borderColor: 'gray.400' }}
          _focus={{
            borderColor: '#864CBD',
            boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
            outline: 'none',
          }}
        />
        <Text fontSize="11px" color="gray.500" mt={1}>
          Separate with commas
        </Text>
      </Box>

      {/* Benefits */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Benefits
        </Text>
        <Textarea
          value={formData.benefits.join(', ')}
          onChange={(e) =>
            setFormData({ ...formData, benefits: e.target.value.split(',').map(b => b.trim()).filter(Boolean) })
          }
          placeholder="Customer benefits (separate with commas)"
          minH="70px"
          fontSize="14px"
          px={3}
          py={2.5}
          borderRadius="8px"
          border="1px solid"
          borderColor="gray.300"
          bg={formData.benefits.length > 0 && formData.product_id ? 'rgba(16, 185, 129, 0.05)' : 'white'}
          transition="all 0.2s"
          _hover={{ borderColor: 'gray.400' }}
          _focus={{
            borderColor: '#864CBD',
            boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
            outline: 'none',
          }}
        />
        <Text fontSize="11px" color="gray.500" mt={1}>
          Separate with commas
        </Text>
      </Box>

      {/* Call-to-Action */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Call-to-Action
        </Text>
        <HStack gap={3}>
          <Box flex={1}>
            <Input
              value={formData.cta?.text || ''}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, text: e.target.value } })}
              placeholder="Button text"
              px={3}
              h="40px"
              fontSize="14px"
              borderRadius="8px"
              border="1px solid"
              borderColor="gray.300"
              transition="all 0.2s"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{
                borderColor: '#864CBD',
                boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
                outline: 'none',
              }}
            />
          </Box>
          <Box flex={1}>
            <Input
              value={formData.cta?.url || ''}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, url: e.target.value } })}
              placeholder="URL"
              px={3}
              h="40px"
              fontSize="14px"
              borderRadius="8px"
              border="1px solid"
              borderColor="gray.300"
              transition="all 0.2s"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{
                borderColor: '#864CBD',
                boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
                outline: 'none',
              }}
            />
          </Box>
        </HStack>
        <Text fontSize="11px" color="gray.500" mt={1}>
          Add a button to drive action
        </Text>
      </Box>

      {/* Integrations */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Integrations
        </Text>
        <Textarea
          value={formData.integrations?.join(', ') || ''}
          onChange={(e) =>
            setFormData({ ...formData, integrations: e.target.value.split(',').map(i => i.trim()).filter(Boolean) })
          }
          placeholder="Compatible platforms (separate with commas)"
          minH="60px"
          fontSize="14px"
          px={3}
          py={2.5}
          borderRadius="8px"
          border="1px solid"
          borderColor="gray.300"
          transition="all 0.2s"
          _hover={{ borderColor: 'gray.400' }}
          _focus={{
            borderColor: '#864CBD',
            boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
            outline: 'none',
          }}
        />
        <Text fontSize="11px" color="gray.500" mt={1}>
          Separate with commas
        </Text>
      </Box>

      {/* Social Proof */}
      <Box>
        <Text fontWeight={600} fontSize="13px" color="gray.700" mb={1.5} letterSpacing="0.3px">
          Social Proof
        </Text>
        <Textarea
          value={formData.social_proof}
          onChange={(e) => setFormData({ ...formData, social_proof: e.target.value })}
          placeholder="Testimonials, case studies, or metrics"
          minH="70px"
          fontSize="14px"
          px={3}
          py={2.5}
          borderRadius="8px"
          border="1px solid"
          borderColor="gray.300"
          transition="all 0.2s"
          _hover={{ borderColor: 'gray.400' }}
          _focus={{
            borderColor: '#864CBD',
            boxShadow: '0 0 0 3px rgba(134, 76, 189, 0.1)',
            outline: 'none',
          }}
        />
        <Text fontSize="11px" color="gray.500" mt={1}>
          Add credibility through testimonials
        </Text>
      </Box>
    </VStack>
  );
}
