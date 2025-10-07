import { VStack, HStack, Text, Input, Textarea, Button, Box } from '@chakra-ui/react';

export interface TargetAudience {
  name: string;
  description: string;
}

interface TargetAudienceInputProps {
  value: TargetAudience[];
  onChange: (audiences: TargetAudience[]) => void;
}

/**
 * TargetAudienceInput component for managing multiple audience segments
 * Each audience has a name and description
 * Minimum 1 audience required
 */
export const TargetAudienceInput: React.FC<TargetAudienceInputProps> = ({ value, onChange }) => {
  const handleAdd = () => {
    onChange([...value, { name: '', description: '' }]);
  };

  const handleRemove = (index: number) => {
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: 'name' | 'description', newValue: string) => {
    const updated = [...value];
    updated[index][field] = newValue;
    onChange(updated);
  };

  return (
    <VStack align="stretch" gap={4}>
      <HStack justify="space-between">
        <Box>
          <Text fontWeight={600} fontSize="16px" color="#333">
            Target Audiences
          </Text>
          <Text fontSize="14px" color="#666" mt={1}>
            Define the key audience segments for your marketing materials
          </Text>
        </Box>
        <Button
          onClick={handleAdd}
          size="sm"
          bg="#007ACC"
          color="white"
          borderRadius="50px"
          fontWeight={600}
          _hover={{ bg: '#005A9C' }}
        >
          + Add Audience
        </Button>
      </HStack>

      {value.map((audience, index) => (
        <Box
          key={index}
          p={6}
          bg="#f7fafc"
          borderRadius="12px"
          border="2px solid #e2e8f0"
        >
          <VStack align="stretch" gap={4}>
            <HStack justify="space-between">
              <Text fontWeight={600} fontSize="14px" color="#666">
                Audience {index + 1}
              </Text>
              {value.length > 1 && (
                <Button
                  onClick={() => handleRemove(index)}
                  size="xs"
                  bg="transparent"
                  color="#dc3545"
                  border="1px solid #dc3545"
                  borderRadius="50px"
                  _hover={{ bg: '#dc3545', color: 'white' }}
                >
                  Remove
                </Button>
              )}
            </HStack>

            <Input
              value={audience.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              placeholder="Audience name (e.g., 'Small Business Owners')"
              h="56px"
              borderRadius="12px"
              border="2px solid #e2e8f0"
              fontSize="16px"
              _focus={{
                borderColor: '#007ACC',
                boxShadow: '0 0 0 1px #007ACC',
              }}
            />

            <Textarea
              value={audience.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              placeholder="Brief description of this audience segment..."
              minH="100px"
              borderRadius="12px"
              border="2px solid #e2e8f0"
              fontSize="16px"
              _focus={{
                borderColor: '#007ACC',
                boxShadow: '0 0 0 1px #007ACC',
              }}
            />
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};
