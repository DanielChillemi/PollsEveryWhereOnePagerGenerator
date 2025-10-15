import { VStack, Input, Textarea, Button, Box, Text, HStack, IconButton } from '@chakra-ui/react';

export interface Product {
  id?: string;
  name: string;
  default_problem?: string;
  default_solution?: string;
  features?: string[];
  benefits?: string[];
}

interface ProductInputProps {
  value: Product[];
  onChange: (products: Product[]) => void;
}

/**
 * ProductInput - Multi-entry form for defining products
 * Each product can have description, benefits, features, problem, and solution
 */
export const ProductInput: React.FC<ProductInputProps> = ({ value, onChange }) => {
  const addProduct = () => {
    onChange([
      ...value,
      {
        name: '',
        default_problem: '',
        default_solution: '',
        benefits: [''],
        features: [''],
      },
    ]);
  };

  const removeProduct = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated.length === 0 ? [{ name: '', benefits: [''], features: [''], default_problem: '', default_solution: '' }] : updated);
  };

  const updateProduct = (index: number, field: keyof Product, fieldValue: string | string[]) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const addListItem = (productIndex: number, field: 'benefits' | 'features') => {
    const updated = [...value];
    const currentArray = updated[productIndex][field] || [];
    updated[productIndex] = {
      ...updated[productIndex],
      [field]: [...currentArray, ''],
    };
    onChange(updated);
  };

  const removeListItem = (productIndex: number, field: 'benefits' | 'features', itemIndex: number) => {
    const updated = [...value];
    const currentArray = updated[productIndex][field] || [];
    const items = currentArray.filter((_, i) => i !== itemIndex);
    updated[productIndex] = {
      ...updated[productIndex],
      [field]: items.length === 0 ? [''] : items,
    };
    onChange(updated);
  };

  const updateListItem = (productIndex: number, field: 'benefits' | 'features', itemIndex: number, itemValue: string) => {
    const updated = [...value];
    const currentArray = updated[productIndex][field] || [];
    const items = [...currentArray];
    items[itemIndex] = itemValue;
    updated[productIndex] = { ...updated[productIndex], [field]: items };
    onChange(updated);
  };

  return (
    <VStack align="stretch" gap={6}>
      {value.map((product, productIndex) => (
        <Box
          key={productIndex}
          p={6}
          bg="#f7fafc"
          borderRadius="12px"
          border="2px solid #e2e8f0"
        >
          <VStack align="stretch" gap={4}>
            {/* Product Name */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight={600} fontSize="16px" color="#2d3748">
                  Product Name *
                </Text>
                {value.length > 1 && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeProduct(productIndex)}
                  >
                    Remove Product
                  </Button>
                )}
              </HStack>
              <Input
                value={product.name}
                onChange={(e) => updateProduct(productIndex, 'name', e.target.value)}
                placeholder="e.g., Marketing Analytics Platform"
                h="48px"
                fontSize="15px"
                bg="white"
                borderRadius="8px"
                border="2px solid #e2e8f0"
                _focus={{
                  borderColor: '#007ACC',
                  boxShadow: '0 0 0 1px #007ACC',
                }}
              />
            </Box>

            {/* Benefits */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight={600} fontSize="16px" color="#2d3748">
                  Benefits
                </Text>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => addListItem(productIndex, 'benefits')}
                >
                  + Add Benefit
                </Button>
              </HStack>
              <VStack align="stretch" gap={2}>
                {(product.benefits || []).map((benefit, itemIndex) => (
                  <HStack key={itemIndex}>
                    <Input
                      value={benefit}
                      onChange={(e) => updateListItem(productIndex, 'benefits', itemIndex, e.target.value)}
                      placeholder="e.g., Increase ROI by 40%"
                      h="44px"
                      fontSize="14px"
                      bg="white"
                      borderRadius="8px"
                      border="2px solid #e2e8f0"
                      _focus={{
                        borderColor: '#007ACC',
                        boxShadow: '0 0 0 1px #007ACC',
                      }}
                    />
                    {(product.benefits || []).length > 1 && (
                      <IconButton
                        aria-label="Remove benefit"
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeListItem(productIndex, 'benefits', itemIndex)}
                      >
                        <Text>×</Text>
                      </IconButton>
                    )}
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Features */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight={600} fontSize="16px" color="#2d3748">
                  Features
                </Text>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => addListItem(productIndex, 'features')}
                >
                  + Add Feature
                </Button>
              </HStack>
              <VStack align="stretch" gap={2}>
                {(product.features || []).map((feature, itemIndex) => (
                  <HStack key={itemIndex}>
                    <Input
                      value={feature}
                      onChange={(e) => updateListItem(productIndex, 'features', itemIndex, e.target.value)}
                      placeholder="e.g., Real-time dashboard"
                      h="44px"
                      fontSize="14px"
                      bg="white"
                      borderRadius="8px"
                      border="2px solid #e2e8f0"
                      _focus={{
                        borderColor: '#007ACC',
                        boxShadow: '0 0 0 1px #007ACC',
                      }}
                    />
                    {(product.features || []).length > 1 && (
                      <IconButton
                        aria-label="Remove feature"
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeListItem(productIndex, 'features', itemIndex)}
                      >
                        <Text>×</Text>
                      </IconButton>
                    )}
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Default Problem */}
            <Box>
              <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                Default Problem Statement
              </Text>
              <Textarea
                value={product.default_problem || ''}
                onChange={(e) => updateProduct(productIndex, 'default_problem', e.target.value)}
                placeholder="What problem does this product solve?"
                minH="80px"
                fontSize="15px"
                bg="white"
                borderRadius="8px"
                border="2px solid #e2e8f0"
                _focus={{
                  borderColor: '#007ACC',
                  boxShadow: '0 0 0 1px #007ACC',
                }}
              />
            </Box>

            {/* Default Solution */}
            <Box>
              <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={2}>
                Default Solution Statement
              </Text>
              <Textarea
                value={product.default_solution || ''}
                onChange={(e) => updateProduct(productIndex, 'default_solution', e.target.value)}
                placeholder="How does this product solve the problem?"
                minH="80px"
                fontSize="15px"
                bg="white"
                borderRadius="8px"
                border="2px solid #e2e8f0"
                _focus={{
                  borderColor: '#007ACC',
                  boxShadow: '0 0 0 1px #007ACC',
                }}
              />
            </Box>
          </VStack>
        </Box>
      ))}

      {/* Add Product Button */}
      <Button
        onClick={addProduct}
        variant="outline"
        borderColor="#007ACC"
        color="#007ACC"
        h="48px"
        borderRadius="12px"
        fontWeight={600}
        _hover={{
          bg: '#007ACC',
          color: 'white',
        }}
      >
        + Add Another Product
      </Button>
    </VStack>
  );
};

export default ProductInput;
