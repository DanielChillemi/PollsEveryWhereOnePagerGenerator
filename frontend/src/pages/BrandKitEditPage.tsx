import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  SimpleGrid,
  IconButton,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../components/layouts/Sidebar';
import { ColorPicker } from '../components/brand-kit/ColorPicker';
import { FontSelector } from '../components/brandkit/FontSelector';
import { useBrandKit, useUpdateBrandKit } from '../hooks/useBrandKit';
import type { BrandKitData, ColorPalette, Typography, TargetAudience, Product } from '../services/brandKitService';

type TabType = 'company' | 'colors' | 'typography' | 'audience' | 'products' | 'voice';

/**
 * BrandKitEditPage - Tabbed interface for editing Brand Kits
 * Matches wireframe design with horizontal tab navigation
 */
export function BrandKitEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: brandKit, isLoading, error } = useBrandKit(id!);
  const updateMutation = useUpdateBrandKit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [expandedAudiences, setExpandedAudiences] = useState<Set<number>>(new Set());
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [productFormData, setProductFormData] = useState<Product>({
    name: '',
    description: '',
    default_problem: '',
    default_solution: '',
    features: [],
    benefits: [],
  });
  // Temporary string states for comma-separated inputs
  const [featuresText, setFeaturesText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [formData, setFormData] = useState<BrandKitData>({
    company_name: '',
    brand_voice: '',
    color_palette: {
      primary: '#0094CC',
      secondary: '#0094CC',
      accent: '#0094CC',
      text: '#0094CC',
      background: '#0094CC',
    },
    typography: {
      heading_font: 'Arial',
      body_font: 'Arial',
      heading_size: '32px',
      body_size: '16px',
    },
    logo_url: '',
    target_audiences: [{ name: '', description: '' }],
    products: [],
  });

  // Populate form data when brand kit loads
  useEffect(() => {
    if (brandKit) {
      setFormData(brandKit);
      // Expand all audiences by default
      const audienceIndices = brandKit.target_audiences?.map((_, index) => index) || [];
      setExpandedAudiences(new Set(audienceIndices));
    }
  }, [brandKit]);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'company', label: 'Company' },
    { id: 'colors', label: 'Brand Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'audience', label: 'Target Audience' },
    { id: 'products', label: 'Products' },
    { id: 'voice', label: 'Brand Voice' },
  ];

  const handleSave = async () => {
    // Validate required fields
    if (!formData.company_name.trim()) {
      alert('Please enter a company name');
      setActiveTab('company');
      return;
    }

    if (!formData.color_palette.primary || !formData.color_palette.secondary || !formData.color_palette.accent) {
      alert('Please select all required brand colors (Primary, Secondary, and Accent)');
      setActiveTab('colors');
      return;
    }

    // Check for incomplete target audiences (has name but no description, or vice versa)
    const incompleteAudiences = formData.target_audiences.filter(
      audience => (audience.name.trim() && !audience.description.trim()) || 
                  (!audience.name.trim() && audience.description.trim())
    );

    if (incompleteAudiences.length > 0) {
      alert('Some target audiences are incomplete. Please fill in both name and description for each audience, or remove incomplete entries.');
      setActiveTab('audience');
      return;
    }

    try {
      // Filter out completely empty audiences (both fields empty - user likely didn't use them)
      const validAudiences = formData.target_audiences.filter(
        audience => audience.name.trim() && audience.description.trim()
      );

      // Create clean data object
      const dataToSend = {
        ...formData,
        target_audiences: validAudiences,
      };

      await updateMutation.mutateAsync({ id: id!, data: dataToSend });
      navigate('/brand-kit/list');
    } catch (error) {
      console.error('Failed to update brand kit:', error);
      alert('Failed to update brand kit. Please try again.');
    }
  };

  const updateColorPalette = (key: keyof ColorPalette, value: string) => {
    setFormData({
      ...formData,
      color_palette: { ...formData.color_palette, [key]: value },
    });
  };

  const updateTypography = (key: keyof Typography, value: string) => {
    setFormData({
      ...formData,
      typography: { ...formData.typography, [key]: value },
    });
  };

  const updateAudience = (index: number, field: keyof TargetAudience, value: string) => {
    const newAudiences = [...formData.target_audiences];
    newAudiences[index] = { ...newAudiences[index], [field]: value };
    setFormData({ ...formData, target_audiences: newAudiences });
  };

  const addAudience = () => {
    setFormData({
      ...formData,
      target_audiences: [...formData.target_audiences, { name: '', description: '' }],
    });
    // Auto-expand the newly added audience
    setExpandedAudiences(prev => {
      const newSet = new Set(prev);
      newSet.add(formData.target_audiences.length);
      return newSet;
    });
  };

  const removeAudience = (index: number) => {
    const newAudiences = formData.target_audiences.filter((_, i) => i !== index);
    setFormData({ ...formData, target_audiences: newAudiences });
    // Remove from expanded set
    setExpandedAudiences(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const openProductModal = (index?: number) => {
    if (index !== undefined) {
      setEditingProductIndex(index);
      const product = formData.products?.[index] || {
        name: '',
        description: '',
        default_problem: '',
        default_solution: '',
        features: [],
        benefits: [],
      };
      setProductFormData(product);
      setFeaturesText(product.features?.join(', ') || '');
      setBenefitsText(product.benefits?.join(', ') || '');
    } else {
      setEditingProductIndex(null);
      setProductFormData({
        name: '',
        description: '',
        default_problem: '',
        default_solution: '',
        features: [],
        benefits: [],
      });
      setFeaturesText('');
      setBenefitsText('');
    }
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProductIndex(null);
    setProductFormData({
      name: '',
      description: '',
      default_problem: '',
      default_solution: '',
      features: [],
      benefits: [],
    });
    setFeaturesText('');
    setBenefitsText('');
  };

  const saveProduct = () => {
    // Convert comma-separated text to arrays
    const features = featuresText.split(',').map(f => f.trim()).filter(f => f);
    const benefits = benefitsText.split(',').map(b => b.trim()).filter(b => b);
    
    const productToSave = {
      ...productFormData,
      features,
      benefits,
    };

    const products = formData.products || [];
    if (editingProductIndex !== null) {
      // Edit existing product
      const updatedProducts = [...products];
      updatedProducts[editingProductIndex] = productToSave;
      setFormData({ ...formData, products: updatedProducts });
    } else {
      // Add new product
      setFormData({ ...formData, products: [...products, productToSave] });
    }
    closeProductModal();
  };

  const removeProduct = (index: number) => {
    const updatedProducts = (formData.products || []).filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or SVG file');
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 2MB');
      return;
    }

    // Convert to base64 (same as the old working implementation)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, logo_url: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <VStack align="stretch" gap={6} px={4}>
            <VStack align="start" gap={1}>
              <Heading fontSize="24px" fontWeight="600" color="gray.900">
                Company Information
              </Heading>
              <Text fontSize="14px" color="gray.600">
                Basic details about your company or brand
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              {/* Company Name */}
              <VStack align="stretch" gap={2}>
                <HStack gap={2}>
                  <Text fontWeight="600" fontSize="14px" color="gray.700">
                    Company name
                  </Text>
                  <Box
                    as="span"
                    fontSize="10px"
                    fontWeight="700"
                    px={2}
                    py={0.5}
                    bg="red.50"
                    color="red.600"
                    borderRadius="4px"
                  >
                    REQUIRED
                  </Box>
                </HStack>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Enter company name"
                  size="lg"
                  px={4}
                  borderColor={!formData.company_name.trim() ? 'red.300' : 'gray.200'}
                  _focus={{
                    borderColor: !formData.company_name.trim() ? 'red.500' : '#007ACC',
                    boxShadow: !formData.company_name.trim() 
                      ? '0 0 0 1px rgba(245, 101, 101, 0.5)' 
                      : '0 0 0 1px #007ACC',
                  }}
                />
              </VStack>

              {/* Company Logo */}
              <VStack align="stretch" gap={2}>
                <HStack gap={2}>
                  <Text fontWeight="600" fontSize="14px" color="gray.700">
                    Company Logo
                  </Text>
                  <Box
                    as="span"
                    fontSize="10px"
                    fontWeight="600"
                    px={2}
                    py={0.5}
                    bg="gray.100"
                    color="gray.600"
                    borderRadius="4px"
                  >
                    OPTIONAL
                  </Box>
                </HStack>
                <Box>
                  {/* Hidden file input */}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    display="none"
                  />
                  {/* Visible button that triggers file input */}
                  <Button
                    size="md"
                    onClick={handleChooseFile}
                    bg="#007ACC"
                    color="white"
                    fontWeight="600"
                    px={6}
                    _hover={{
                      bg: "#0056A3",
                      transform: "translateY(-1px)",
                      boxShadow: "md",
                    }}
                  >
                    Choose File
                  </Button>
                </Box>
                {formData.logo_url && (
                  <Text fontSize="12px" color="green.600" fontWeight="500">
                    ✓ Logo uploaded
                  </Text>
                )}
                <Text fontSize="12px" color="gray.500">
                  Upload your company logo (PNG, JPG, SVG - Max 2MB)
                </Text>
              </VStack>
            </SimpleGrid>

            {/* Logo Preview */}
            {formData.logo_url && (
              <Box
                mt={4}
                p={4}
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="12px"
              >
                <VStack align="start" gap={3}>
                  <Text fontWeight="600" fontSize="14px" color="gray.700">
                    Logo Preview
                  </Text>
                  <Box
                    position="relative"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="8px"
                    p={4}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minH="120px"
                  >
                    {/* X button in top right */}
                    <IconButton
                      aria-label="Remove logo"
                      size="sm"
                      position="absolute"
                      top="4px"
                      right="4px"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => {
                        setFormData({ ...formData, logo_url: '' });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      _hover={{
                        bg: "red.50",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </IconButton>
                    <img
                      src={formData.logo_url}
                      alt="Company logo preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '100px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                </VStack>
              </Box>
            )}
          </VStack>
        );

      case 'colors':
        return (
          <VStack align="stretch" gap={6} px={6} py={4}>
            <VStack align="start" gap={1}>
              <Heading fontSize="24px" fontWeight="600" color="gray.900">
                Brand Colors
              </Heading>
              <Text fontSize="14px" color="gray.600">
                Define your color palette for consistent branding
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mt={2}>
              {/* Primary Color */}
              <ColorPicker
                label="Primary Color"
                description="Main brand color (e.g., buttons, headers)"
                value={formData.color_palette.primary}
                onChange={(color) => updateColorPalette('primary', color)}
                required
              />

              {/* Secondary Color */}
              <ColorPicker
                label="Secondary Color"
                description="Accent color for supporting elements"
                value={formData.color_palette.secondary}
                onChange={(color) => updateColorPalette('secondary', color)}
                required
              />

              {/* Accent Color */}
              <ColorPicker
                label="Accent Color"
                description="Additional accent for variety"
                value={formData.color_palette.accent}
                onChange={(color) => updateColorPalette('accent', color)}
                required
              />

              {/* Text Color */}
              <ColorPicker
                label="Text Color"
                description="Primary text color"
                value={formData.color_palette.text}
                onChange={(color) => updateColorPalette('text', color)}
              />

              {/* Background Color */}
              <ColorPicker
                label="Background Color"
                description="Main background color"
                value={formData.color_palette.background}
                onChange={(color) => updateColorPalette('background', color)}
              />
            </SimpleGrid>
          </VStack>
        );

      case 'typography':
        return (
          <VStack align="stretch" gap={6} px={6} py={4}>
            <VStack align="start" gap={1}>
              <Heading fontSize="24px" fontWeight="600" color="gray.900">
                Typography
              </Heading>
              <Text fontSize="14px" color="gray.600">
                Choose fonts for headings and body text
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mt={2}>
              {/* Heading Font */}
              <VStack align="stretch" gap={2}>
                <Text fontWeight="600" fontSize="14px" color="gray.700">
                  Heading Font
                </Text>
                <FontSelector
                  value={formData.typography.heading_font}
                  onChange={(font) => updateTypography('heading_font', font)}
                />
              </VStack>

              {/* Body Font */}
              <VStack align="stretch" gap={2}>
                <Text fontWeight="600" fontSize="14px" color="gray.700">
                  Body Font
                </Text>
                <FontSelector
                  value={formData.typography.body_font}
                  onChange={(font) => updateTypography('body_font', font)}
                />
              </VStack>
            </SimpleGrid>

            {/* Font Preview */}
            <Box
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="12px"
              p={8}
              mt={4}
            >
              <VStack align="start" gap={4}>
                <Text
                  fontSize="32px"
                  fontWeight="700"
                  fontFamily={`'${formData.typography.heading_font}', sans-serif`}
                  color="gray.900"
                >
                  Heading Font Preview
                </Text>
                <Text
                  fontSize="16px"
                  fontWeight="400"
                  color="gray.700"
                  fontFamily={`'${formData.typography.body_font}', sans-serif`}
                  lineHeight="1.6"
                >
                  This is how your body text will look in marketing materials. The quick brown fox jumps over the lazy dog.
                </Text>
              </VStack>
            </Box>
          </VStack>
        );

      case 'audience':
        const toggleAudience = (index: number) => {
          setExpandedAudiences(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
              newSet.delete(index);
            } else {
              newSet.add(index);
            }
            return newSet;
          });
        };

        return (
          <VStack align="stretch" gap={6} px={6} py={4}>
            <HStack justify="space-between" align="center">
              <VStack align="start" gap={1}>
                <Heading fontSize="24px" fontWeight="600" color="gray.900">
                  Target Audiences
                </Heading>
                <Text fontSize="14px" color="gray.600">
                  Define who you're creating marketing materials for
                </Text>
              </VStack>
              <Button
                onClick={addAudience}
                size="md"
                variant="outline"
                colorScheme="blue"
              >
                Add new
              </Button>
            </HStack>

            <VStack align="stretch" gap={4} mt={2}>
              {formData.target_audiences.map((audience, index) => {
                const isExpanded = expandedAudiences.has(index);

                return (
                  <Box
                    key={index}
                    bg="white"
                    border="2px solid"
                    borderColor={isExpanded ? '#007ACC' : 'gray.200'}
                    borderRadius="16px"
                    overflow="hidden"
                    transition="all 0.3s ease"
                    boxShadow={isExpanded ? '0 8px 24px rgba(0, 122, 204, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)'}
                    _hover={{
                      borderColor: isExpanded ? '#007ACC' : 'gray.300',
                      boxShadow: isExpanded ? '0 8px 24px rgba(0, 122, 204, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    {/* Card Header - Always Visible */}
                    <HStack
                      p={5}
                      justify="space-between"
                      cursor="pointer"
                      onClick={() => toggleAudience(index)}
                      bg={isExpanded ? 'blue.50' : 'transparent'}
                      transition="background 0.2s ease"
                      _hover={{ bg: isExpanded ? 'blue.50' : 'gray.50' }}
                    >
                      <Text 
                        fontWeight="600" 
                        fontSize="16px" 
                        color={audience.name ? "gray.900" : "gray.400"}
                        fontStyle={audience.name ? "normal" : "italic"}
                        flex={1}
                      >
                        {audience.name || "Untitled"}
                      </Text>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke={isExpanded ? '#007ACC' : '#718096'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </HStack>

                    {/* Expandable Content */}
                    <Box
                      maxH={isExpanded ? '500px' : '0'}
                      overflow="hidden"
                      transition="max-height 0.4s ease, opacity 0.3s ease"
                      opacity={isExpanded ? 1 : 0}
                    >
                      <VStack align="stretch" gap={4} p={6} pt={2}>
                        <Box>
                          <Text fontWeight="600" fontSize="14px" color="gray.700" mb={2}>
                            Audience Name
                          </Text>
                          <Input
                            value={audience.name}
                            onChange={(e) => updateAudience(index, 'name', e.target.value)}
                            placeholder="e.g., Marketing Managers, Tech Enthusiasts"
                            size="lg"
                            px={4}
                            borderRadius="10px"
                            border="2px solid"
                            borderColor="gray.200"
                            _focus={{
                              borderColor: '#007ACC',
                              boxShadow: '0 0 0 1px #007ACC',
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Text fontWeight="600" fontSize="14px" color="gray.700" mb={2}>
                            Description
                          </Text>
                          <Textarea
                            value={audience.description}
                            onChange={(e) => updateAudience(index, 'description', e.target.value)}
                            placeholder="Describe this audience segment, their needs, pain points, and goals..."
                            rows={4}
                            resize="vertical"
                            px={4}
                            py={3}
                            borderRadius="10px"
                            border="2px solid"
                            borderColor="gray.200"
                            _focus={{
                              borderColor: '#007ACC',
                              boxShadow: '0 0 0 1px #007ACC',
                            }}
                          />
                        </Box>

                        {formData.target_audiences.length > 1 && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAudience(index);
                            }}
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            alignSelf="flex-start"
                            mt={2}
                          >
                            Remove Audience
                          </Button>
                        )}
                      </VStack>
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
        );

      case 'products':
        return (
          <VStack align="stretch" gap={6} px={6} py={4}>
            <HStack justify="space-between" align="center">
              <VStack align="start" gap={1}>
                <Heading fontSize="24px" fontWeight="600" color="gray.900">
                  Products
                </Heading>
                <Text fontSize="14px" color="gray.600">
                  Define your products with benefits, features, and default messaging
                </Text>
              </VStack>
              <Button
                onClick={() => openProductModal()}
                size="md"
                variant="outline"
                colorScheme="blue"
              >
                Add new
              </Button>
            </HStack>

            {(!formData.products || formData.products.length === 0) ? (
              <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="12px"
                p={12}
                textAlign="center"
              >
                <VStack gap={4}>
                  <Text fontSize="16px" color="gray.600">
                    No products added yet
                  </Text>
                  <Button
                    onClick={() => openProductModal()}
                    size="lg"
                    colorScheme="blue"
                  >
                    Add Your First Product
                  </Button>
                </VStack>
              </Box>
            ) : (
              <VStack align="stretch" gap={4} mt={2}>
                {formData.products.map((product, index) => (
                  <Box
                    key={index}
                    bg="white"
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="16px"
                    p={6}
                    transition="all 0.2s ease"
                    _hover={{
                      borderColor: 'gray.300',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <HStack justify="space-between" align="start">
                      <VStack align="start" gap={2} flex={1}>
                        <Text fontWeight="600" fontSize="18px" color="gray.900">
                          {product.name}
                        </Text>
                        {product.description && (
                          <Text fontSize="14px" color="gray.600">
                            {product.description}
                          </Text>
                        )}
                        <HStack gap={4} mt={2}>
                          {product.features && product.features.length > 0 && (
                            <Text fontSize="12px" color="gray.500">
                              {product.features.length} feature{product.features.length !== 1 ? 's' : ''}
                            </Text>
                          )}
                          {product.benefits && product.benefits.length > 0 && (
                            <Text fontSize="12px" color="gray.500">
                              {product.benefits.length} benefit{product.benefits.length !== 1 ? 's' : ''}
                            </Text>
                          )}
                        </HStack>
                      </VStack>
                      <HStack gap={2}>
                        <Button
                          onClick={() => openProductModal(index)}
                          size="sm"
                          variant="outline"
                          colorScheme="blue"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => removeProduct(index)}
                          size="sm"
                          variant="outline"
                          colorScheme="red"
                        >
                          Remove
                        </Button>
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>
        );

      case 'voice':
        return (
          <VStack align="stretch" gap={6} px={6} py={4}>
            <VStack align="start" gap={1}>
              <Heading fontSize="24px" fontWeight="600" color="gray.900" letterSpacing="-0.01em">
                Brand Voice
              </Heading>
              <Text fontSize="14px" color="gray.500">
                Define your brand voice and communication tone
              </Text>
            </VStack>

            {/* Modern Card Container */}
            <Box
              bg="white"
              borderRadius="12px"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
              p={6}
            >
              <VStack align="stretch" gap={4}>
                {/* Suggestion Tags */}
                <Box>
                  <Text fontSize="12px" fontWeight="500" color="gray.600" mb={2}>
                    Quick add:
                  </Text>
                  <HStack gap={2} flexWrap="wrap">
                    {[
                      'Professional', 
                      'Friendly', 
                      'Innovative', 
                      'Authoritative', 
                      'Conversational',
                      'Data-Driven',
                      'Customer-Centric',
                      'Empowering',
                      'Transparent',
                      'Collaborative',
                      'Forward-Thinking',
                      'Solution-Oriented',
                      'Approachable',
                      'Educational',
                      'Results-Focused',
                      'Trustworthy'
                    ].map((tag) => (
                      <Box
                        key={tag}
                        px={3}
                        py={1.5}
                        bg="gray.50"
                        borderRadius="6px"
                        fontSize="12px"
                        fontWeight="500"
                        color="gray.600"
                        border="1px solid"
                        borderColor="gray.100"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          bg: 'blue.50',
                          borderColor: 'blue.200',
                          color: 'blue.700',
                        }}
                        onClick={() => {
                          const currentVoice = formData.brand_voice || '';
                          if (!currentVoice.toLowerCase().includes(tag.toLowerCase())) {
                            setFormData({ 
                              ...formData, 
                              brand_voice: currentVoice ? `${currentVoice}, ${tag}` : tag 
                            });
                          }
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </HStack>
                </Box>

                {/* Textarea */}
                <Box>
                  <Textarea
                    value={formData.brand_voice || ''}
                    onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
                    placeholder="Describe your brand voice and tone. For example: 'Professional yet approachable, combining expertise with clear language.'"
                    rows={8}
                    resize="vertical"
                    px={4}
                    py={3}
                    borderRadius="8px"
                    border="1px solid"
                    borderColor="gray.200"
                    bg="gray.50"
                    fontSize="14px"
                    lineHeight="1.6"
                    _placeholder={{ color: 'gray.400' }}
                    _hover={{
                      borderColor: 'gray.300',
                      bg: 'white',
                    }}
                    _focus={{
                      borderColor: '#007ACC',
                      boxShadow: '0 0 0 3px rgba(0, 122, 204, 0.08)',
                      outline: 'none',
                      bg: 'white',
                    }}
                  />
                  <Text fontSize="11px" color="gray.400" mt={1.5}>
                    Optional - helps AI generate on-brand content
                  </Text>
                </Box>
              </VStack>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Sidebar />
        <Box ml="280px">
          <Container maxW="1200px" px={{ base: 4, md: 8 }} py={16}>
            <VStack gap={4}>
              <Text fontSize="lg" color="gray.600">Loading brand kit...</Text>
            </VStack>
          </Container>
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Sidebar />
        <Box ml="280px">
          <Container maxW="1200px" px={{ base: 4, md: 8 }} py={16}>
            <VStack gap={4}>
              <Text fontSize="lg" color="red.600">Error loading brand kit</Text>
              <Button onClick={() => navigate('/brand-kit/list')} colorScheme="blue">
                Back to Brand Kits
              </Button>
            </VStack>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content */}
      <Box ml="280px">
        {/* Sticky Header with Actions */}
        <Box
          position="sticky"
          top={0}
          zIndex={100}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          boxShadow="0 1px 3px rgba(0,0,0,0.05)"
        >
          <Container maxW="1200px" px={{ base: 4, md: 8 }}>
            <HStack justify="space-between" py={4}>
              {/* Page Title with Progress */}
              <VStack align="start" gap={1}>
                <Heading
                  as="h1"
                  fontSize="24px"
                  fontWeight="700"
                  color="#007ACC"
                  lineHeight="1.2"
                >
                  Edit Brand Kit
                </Heading>
                <HStack gap={2}>
                  <Text fontSize="13px" color="gray.600">
                    {formData.company_name.trim() && 
                     formData.color_palette.primary && 
                     formData.color_palette.secondary && 
                     formData.color_palette.accent 
                      ? '✓ Ready to save' 
                      : 'Complete required fields to save'}
                  </Text>
                  {!(formData.company_name.trim() && 
                     formData.color_palette.primary && 
                     formData.color_palette.secondary && 
                     formData.color_palette.accent) && (
                    <Box
                      fontSize="10px"
                      fontWeight="700"
                      px={2}
                      py={0.5}
                      bg="red.50"
                      color="red.600"
                      borderRadius="4px"
                    >
                      INCOMPLETE
                    </Box>
                  )}
                </HStack>
              </VStack>

              {/* Action Buttons */}
              <HStack gap={3}>
                <Button
                  onClick={() => navigate('/brand-kit/list')}
                  variant="outline"
                  size="md"
                  borderColor="gray.300"
                  color="gray.700"
                  _hover={{
                    bg: 'gray.50',
                    borderColor: 'gray.400',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="md"
                  bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
                  color="white"
                  px={6}
                  loading={updateMutation.isPending}
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                >
                  Update Brand Kit
                </Button>
              </HStack>
            </HStack>
          </Container>
        </Box>

        <Container maxW="1200px" px={{ base: 4, md: 8 }} py={8}>
          <VStack gap="8" align="stretch">

            {/* Tabbed Interface */}
            <Box
              bg="white"
              borderRadius="16px"
              boxShadow="0 1px 3px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.200"
              overflow="hidden"
            >
              {/* Horizontal Tab Menu with Gradient */}
              <Box
                bg="linear-gradient(135deg, #864CBD 0%, #007ACC 100%)"
                position="relative"
              >
                <HStack
                  gap={0}
                  overflowX="auto"
                  css={{
                    '&::-webkit-scrollbar': {
                      height: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '2px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {tabs.map((tab) => {
                    return (
                      <Button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        variant="ghost"
                        borderRadius="0"
                        px={6}
                        py={4}
                        h="auto"
                        minW="fit-content"
                        fontWeight={activeTab === tab.id ? '600' : '500'}
                        fontSize="15px"
                        color={activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.75)'}
                        bg={activeTab === tab.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
                        position="relative"
                        transition="all 0.2s ease"
                        _hover={{
                          bg: activeTab === tab.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                        }}
                        _after={{
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          bg: 'white',
                          opacity: activeTab === tab.id ? 1 : 0,
                          transition: 'opacity 0.2s ease',
                        }}
                      >
                        {tab.label}
                      </Button>
                    );
                  })}
                </HStack>
              </Box>

              {/* Tab Content */}
              <Box p={8}>
                {renderTabContent()}
              </Box>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Product Modal */}
      {isProductModalOpen && (
        <>
          {/* Backdrop */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.5)"
            zIndex={1000}
            onClick={closeProductModal}
          />
          
          {/* Modal Content */}
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            borderRadius="12px"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
            zIndex={1001}
            maxW="800px"
            w="90%"
            maxH="90vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#CBD5E0',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#A0AEC0',
              },
              // Firefox scrollbar
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E0 transparent',
            }}
          >
            <VStack align="stretch" gap={0}>
              {/* Modal Header */}
              <Box
                px={8}
                py={6}
                borderBottom="1px solid"
                borderColor="gray.100"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={1}>
                    <Heading fontSize="20px" fontWeight="600" color="gray.900" letterSpacing="-0.01em">
                      {editingProductIndex !== null ? 'Edit Product' : 'Add Product'}
                    </Heading>
                    <Text fontSize="13px" color="gray.500" fontWeight="400">
                      Define product details for one-pager generation
                    </Text>
                  </VStack>
                  <IconButton
                    onClick={closeProductModal}
                    variant="ghost"
                    size="sm"
                    color="gray.400"
                    fontSize="20px"
                    _hover={{ bg: 'gray.50', color: 'gray.600' }}
                    aria-label="Close"
                  >
                    ✕
                  </IconButton>
                </HStack>
              </Box>

              {/* Modal Body */}
              <Box px={8} py={6} bg="gray.50">
                <VStack align="stretch" gap={6}>
                  {/* Basic Information Section */}
                  <Box
                    bg="white"
                    borderRadius="12px"
                    p={6}
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Text fontSize="14px" fontWeight="600" color="gray.800" mb={5} letterSpacing="-0.01em">
                      Basic Information
                    </Text>
                    <VStack align="stretch" gap={5}>
                      {/* Product Name */}
                      <Box>
                        <Text fontSize="13px" fontWeight="500" color="gray.700" mb={2.5}>
                          Product Name <Text as="span" color="red.500">*</Text>
                        </Text>
                        <Input
                          value={productFormData.name}
                          onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                          placeholder="e.g., Poll Everywhere Pro"
                          size="lg"
                          px={3.5}
                          h="40px"
                          borderRadius="8px"
                          border="1px solid"
                          borderColor="gray.200"
                          bg="white"
                          fontSize="14px"
                          _placeholder={{ color: 'gray.400' }}
                          _hover={{
                            borderColor: 'gray.300',
                          }}
                          _focus={{
                            borderColor: '#007ACC',
                            boxShadow: '0 0 0 3px rgba(0, 122, 204, 0.08)',
                            outline: 'none',
                          }}
                        />
                      </Box>

                      {/* Product Description */}
                      <Box>
                        <Text fontSize="13px" fontWeight="500" color="gray.700" mb={2.5}>
                          Description
                        </Text>
                        <Textarea
                          value={productFormData.description || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                          placeholder="Brief description of the product..."
                          rows={3}
                          resize="vertical"
                          px={3.5}
                          py={2.5}
                          borderRadius="8px"
                          border="1px solid"
                          borderColor="gray.200"
                          bg="white"
                          fontSize="14px"
                          lineHeight="1.5"
                          _placeholder={{ color: 'gray.400' }}
                          _hover={{
                            borderColor: 'gray.300',
                          }}
                          _focus={{
                            borderColor: '#007ACC',
                            boxShadow: '0 0 0 3px rgba(0, 122, 204, 0.08)',
                            outline: 'none',
                          }}
                        />
                      </Box>
                    </VStack>
                  </Box>

                  {/* Problem & Solution Section */}
                  <Box
                    bg="white"
                    borderRadius="12px"
                    p={6}
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Text fontSize="14px" fontWeight="600" color="gray.800" mb={5} letterSpacing="-0.01em">
                      Problem & Solution
                    </Text>
                    <VStack align="stretch" gap={5}>
                      {/* Default Problem */}
                      <Box>
                        <Text fontSize="13px" fontWeight="500" color="gray.700" mb={2.5}>
                          Default Problem Statement
                        </Text>
                        <Textarea
                          value={productFormData.default_problem || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, default_problem: e.target.value })}
                          placeholder="What problem does this product solve?"
                          rows={3}
                          resize="vertical"
                          px={3.5}
                          py={2.5}
                          borderRadius="8px"
                          border="1px solid"
                          borderColor="gray.200"
                          bg="white"
                          fontSize="14px"
                          lineHeight="1.5"
                          _placeholder={{ color: 'gray.400' }}
                          _hover={{
                            borderColor: 'gray.300',
                          }}
                          _focus={{
                            borderColor: '#007ACC',
                            boxShadow: '0 0 0 3px rgba(0, 122, 204, 0.08)',
                            outline: 'none',
                          }}
                        />
                      </Box>

                      {/* Default Solution */}
                      <Box>
                        <Text fontSize="13px" fontWeight="500" color="gray.700" mb={2.5}>
                          Default Solution Statement
                        </Text>
                        <Textarea
                          value={productFormData.default_solution || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, default_solution: e.target.value })}
                          placeholder="How does this product solve the problem?"
                          rows={3}
                          resize="vertical"
                          px={3.5}
                          py={2.5}
                          borderRadius="8px"
                          border="1px solid"
                          borderColor="gray.200"
                          bg="white"
                          fontSize="14px"
                          lineHeight="1.5"
                          _placeholder={{ color: 'gray.400' }}
                          _hover={{
                            borderColor: 'gray.300',
                          }}
                          _focus={{
                            borderColor: '#007ACC',
                            boxShadow: '0 0 0 3px rgba(0, 122, 204, 0.08)',
                            outline: 'none',
                          }}
                        />
                      </Box>
                    </VStack>
                  </Box>

                  {/* Features & Benefits Section */}
                  <Box
                    bg="white"
                    borderRadius="12px"
                    p={6}
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Text fontSize="14px" fontWeight="600" color="gray.800" mb={5} letterSpacing="-0.01em">
                      Features & Benefits
                    </Text>
                    <VStack align="stretch" gap={5}>
                      {/* Features */}
                      <Box>
                        <Text fontSize="13px" fontWeight="500" color="gray.700" mb={2.5}>
                          Features (comma-separated)
                        </Text>
                        <Textarea
                          value={featuresText}
                          onChange={(e) => setFeaturesText(e.target.value)}
                          placeholder="e.g., Real-time polling, Mobile support, Analytics dashboard"
                          rows={2}
                          resize="vertical"
                          px={3.5}
                          py={2.5}
                          borderRadius="8px"
                          border="1px solid"
                          borderColor="gray.200"
                          bg="white"
                          fontSize="14px"
                          lineHeight="1.5"
                          _placeholder={{ color: 'gray.400' }}
                          _hover={{
                            borderColor: 'gray.300',
                          }}
                          _focus={{
                            borderColor: '#007ACC',
                            boxShadow: '0 0 0 3px rgba(0, 122, 204, 0.08)',
                            outline: 'none',
                          }}
                        />
                      </Box>

                      {/* Benefits */}
                      <Box>
                        <Text fontSize="13px" fontWeight="500" color="gray.700" mb={2.5}>
                          Benefits (comma-separated)
                        </Text>
                        <Textarea
                          value={benefitsText}
                          onChange={(e) => setBenefitsText(e.target.value)}
                          placeholder="e.g., Increased engagement, Better insights, Easy to use"
                          rows={2}
                          resize="vertical"
                          px={3.5}
                          py={2.5}
                          borderRadius="8px"
                          border="1px solid"
                          borderColor="gray.200"
                          bg="white"
                          fontSize="14px"
                          lineHeight="1.5"
                          _placeholder={{ color: 'gray.400' }}
                          _hover={{
                            borderColor: 'gray.300',
                          }}
                          _focus={{
                            borderColor: '#007ACC',
                            boxShadow: '0 0 0 3px rgba(0, 122, 204, 0.08)',
                            outline: 'none',
                          }}
                        />
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              {/* Modal Footer */}
              <Box
                px={8}
                py={5}
                borderTop="1px solid"
                borderColor="gray.100"
                bg="white"
              >
                <HStack justify="flex-end" gap={3}>
                  <Button
                    onClick={closeProductModal}
                    variant="ghost"
                    size="lg"
                    h="40px"
                    px={5}
                    fontSize="14px"
                    fontWeight="500"
                    color="gray.600"
                    borderRadius="8px"
                    _hover={{
                      bg: 'gray.50',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveProduct}
                    bg="#007ACC"
                    color="white"
                    size="lg"
                    h="40px"
                    px={5}
                    fontSize="14px"
                    fontWeight="600"
                    borderRadius="8px"
                    disabled={!productFormData.name.trim()}
                    _hover={{
                      bg: '#005a9e',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 122, 204, 0.25)',
                    }}
                    _active={{
                      transform: 'translateY(0)',
                    }}
                    _disabled={{
                      opacity: 0.4,
                      cursor: 'not-allowed',
                      _hover: {
                        transform: 'none',
                        boxShadow: 'none',
                        bg: '#007ACC',
                      },
                    }}
                  >
                    {editingProductIndex !== null ? 'Update Product' : 'Add Product'}
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </>
      )}
    </Box>
  );
}

