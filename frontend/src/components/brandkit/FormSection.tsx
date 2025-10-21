import type { ReactNode } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * FormSection component - reusable wrapper for form sections
 * Provides consistent spacing and styling with Poll Everywhere design system
 */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Text fontSize="24px" fontWeight={700} mb={2} color="#1a202c">
          {title}
        </Text>
        {description && (
          <Text fontSize="16px" color="#718096" lineHeight="1.6">
            {description}
          </Text>
        )}
      </Box>
      {children}
    </VStack>
  );
}
