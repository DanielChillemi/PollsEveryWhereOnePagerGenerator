import { useState, type FormEvent } from 'react';
import { VStack, Input, Button, Box, Text } from '@chakra-ui/react';
import { FormSection } from './FormSection';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { LogoUploader } from './LogoUploader';
import { TargetAudienceInput } from './TargetAudienceInput';
import { ProductInput } from './ProductInput';
import type { TargetAudience } from './TargetAudienceInput';
import type { Product } from './ProductInput';

interface BrandKitFormData {
  company_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  primary_font: string;
  logo_url: string;
  target_audiences: TargetAudience[];
  products: Product[];
}

interface BrandKitFormProps {
  initialData?: Partial<BrandKitFormData>;
  onSubmit: (data: BrandKitFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

/**
 * BrandKitForm - Main form for creating/editing Brand Kits
 * Integrates all sub-components with state management
 */
export const BrandKitForm: React.FC<BrandKitFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Brand Kit',
}) => {
  const [formData, setFormData] = useState<BrandKitFormData>({
    company_name: initialData?.company_name || '',
    primary_color: initialData?.primary_color || '#007ACC',
    secondary_color: initialData?.secondary_color || '#864CBD',
    accent_color: initialData?.accent_color || '#1568B8',
    text_color: initialData?.text_color || '#333333',
    background_color: initialData?.background_color || '#FFFFFF',
    primary_font: initialData?.primary_font || 'Source Sans Pro',
    logo_url: initialData?.logo_url || '',
    target_audiences: initialData?.target_audiences || [{ name: '', description: '' }],
    products: initialData?.products || [{
      name: '',
      description: '',
      benefits: [''],
      features: [''],
      default_problem: '',
      default_solution: '',
    }],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Company name validation
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    // Color validation (hex format)
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    const colorFields = ['primary_color', 'secondary_color', 'accent_color', 'text_color', 'background_color'];
    colorFields.forEach((field) => {
      if (!hexRegex.test(formData[field as keyof BrandKitFormData] as string)) {
        newErrors[field] = 'Invalid color format (use #RRGGBB)';
      }
    });

    // Target audiences validation
    const hasValidAudience = formData.target_audiences.some(
      (aud) => aud.name.trim() !== '' || aud.description.trim() !== ''
    );
    if (!hasValidAudience) {
      newErrors.target_audiences = 'At least one audience with name or description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to save Brand Kit',
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack align="stretch" gap={10}>
        {/* Error Display */}
        {errors.general && (
          <Box bg="#fed7d7" border="2px solid #fc8181" borderRadius="12px" p={4}>
            <Text color="#c53030" fontWeight={600} fontSize="16px">
              {errors.general}
            </Text>
          </Box>
        )}

        {/* Company Information */}
        <FormSection
          title="Company Information"
          description="Basic details about your company or brand"
        >
          <VStack align="stretch" gap={3}>
            <Text fontWeight={600} fontSize="16px" color="#2d3748">
              Company Name *
            </Text>
            <Input
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="Enter company name"
              h="56px"
              fontSize="16px"
              borderRadius="12px"
              border="2px solid #e2e8f0"
              _focus={{
                borderColor: '#007ACC',
                boxShadow: '0 0 0 1px #007ACC',
              }}
            />
            {errors.company_name && (
              <Text color="#dc3545" fontSize="14px" fontWeight={600}>
                {errors.company_name}
              </Text>
            )}
          </VStack>

          <LogoUploader
            value={formData.logo_url}
            onChange={(logo) => setFormData({ ...formData, logo_url: logo })}
          />
        </FormSection>

        {/* Divider */}
        <Box h="2px" bg="#e2e8f0" borderRadius="full" />

        {/* Brand Colors */}
        <FormSection
          title="Brand Colors"
          description="Define your color palette for consistent branding"
        >
          <VStack align="stretch" gap={4}>
            <ColorPicker
              label="Primary Color"
              description="Main brand color (e.g., buttons, headers)"
              color={formData.primary_color}
              onChange={(color) => setFormData({ ...formData, primary_color: color })}
            />
            <ColorPicker
              label="Secondary Color"
              description="Accent color for supporting elements"
              color={formData.secondary_color}
              onChange={(color) => setFormData({ ...formData, secondary_color: color })}
            />
            <ColorPicker
              label="Accent Color"
              description="Additional accent for variety"
              color={formData.accent_color}
              onChange={(color) => setFormData({ ...formData, accent_color: color })}
            />
            <ColorPicker
              label="Text Color"
              description="Primary text color"
              color={formData.text_color}
              onChange={(color) => setFormData({ ...formData, text_color: color })}
            />
            <ColorPicker
              label="Background Color"
              description="Main background color"
              color={formData.background_color}
              onChange={(color) => setFormData({ ...formData, background_color: color })}
            />
          </VStack>
        </FormSection>

        {/* Divider */}
        <Box h="2px" bg="#e2e8f0" borderRadius="full" />

        {/* Typography */}
        <FormSection
          title="Typography"
          description="Choose fonts that represent your brand voice"
        >
          <FontSelector
            value={formData.primary_font}
            onChange={(font) => setFormData({ ...formData, primary_font: font })}
          />
        </FormSection>

        {/* Divider */}
        <Box h="2px" bg="#e2e8f0" borderRadius="full" />

        {/* Target Audiences */}
        <FormSection
          title="Target Audiences"
          description="Define who you're creating marketing materials for"
        >
          <TargetAudienceInput
            value={formData.target_audiences}
            onChange={(audiences) => setFormData({ ...formData, target_audiences: audiences })}
          />
          {errors.target_audiences && (
            <Text color="#dc3545" fontSize="14px" fontWeight={600}>
              {errors.target_audiences}
            </Text>
          )}
        </FormSection>

        {/* Divider */}
        <Box h="2px" bg="#e2e8f0" borderRadius="full" />

        {/* Products */}
        <FormSection
          title="Products"
          description="Define your products with benefits, features, and default messaging"
        >
          <ProductInput
            value={formData.products}
            onChange={(products) => setFormData({ ...formData, products })}
          />
        </FormSection>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
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
          transition="all 0.3s ease"
        >
          {submitLabel}
        </Button>
      </VStack>
    </Box>
  );
};

export default BrandKitForm;
