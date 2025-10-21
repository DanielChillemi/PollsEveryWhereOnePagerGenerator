import { useRef, useState } from 'react';
import { VStack, Text, Button, Image, HStack, Box } from '@chakra-ui/react';

interface LogoUploaderProps {
  value: string;
  onChange: (logo: string) => void;
}

/**
 * LogoUploader component with preview and validation
 * Accepts PNG, JPG, SVG - Max 2MB
 * Converts to base64 for storage
 */
export const LogoUploader: React.FC<LogoUploaderProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG, JPG, or SVG file');
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 2MB');
      return;
    }

    setError('');

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight={600} fontSize="16px" color="#333">
        Company Logo
      </Text>
      <Text fontSize="14px" color="#666">
        Upload your logo (PNG, JPG, or SVG - Max 2MB)
      </Text>

      {!value ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            h="56px"
            borderRadius="50px"
            bg="transparent"
            color="#007ACC"
            border="2px solid #007ACC"
            fontWeight={600}
            fontSize="16px"
            _hover={{
              bg: '#007ACC',
              color: 'white',
            }}
            transition="all 0.3s ease"
          >
            Choose File
          </Button>
        </>
      ) : (
        <Box
          p={6}
          bg="#f7fafc"
          borderRadius="12px"
          border="2px solid #e2e8f0"
        >
          <VStack gap={3}>
            <Image
              src={value}
              alt="Company Logo"
              maxH="120px"
              maxW="100%"
              objectFit="contain"
            />
            <HStack gap={2}>
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                bg="#007ACC"
                color="white"
                borderRadius="50px"
                _hover={{ bg: '#005A9C' }}
              >
                Change
              </Button>
              <Button
                onClick={handleRemove}
                size="sm"
                bg="transparent"
                color="#dc3545"
                border="2px solid #dc3545"
                borderRadius="50px"
                _hover={{ bg: '#dc3545', color: 'white' }}
              >
                Remove
              </Button>
            </HStack>
          </VStack>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Box>
      )}

      {error && (
        <Text color="#dc3545" fontSize="14px" fontWeight={600}>
          {error}
        </Text>
      )}
    </VStack>
  );
};
