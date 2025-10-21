/**
 * PDF Export Modal
 *
 * Modal for exporting OnePager to PDF with format selection
 * Showcases in-house PDF engine advantages
 */

import { useState } from 'react';
import {
  Button,
  VStack,
  Text,
  HStack,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { useExportPDF } from '../../hooks/useOnePager';
import type { PDFFormat } from '../../types/onepager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onepagerId: string;
  title: string;
}

export function PDFExportModal({ isOpen, onClose, onepagerId, title }: Props) {
  const [format, setFormat] = useState<PDFFormat>('letter');
  const [template, setTemplate] = useState<string>('minimalist');
  const exportMutation = useExportPDF();

  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync({
        id: onepagerId,
        format,
        template,
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}_${template}_${format}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const formatDescriptions = {
    letter: {
      name: 'Letter',
      dimensions: '8.5" × 11"',
      description: 'Standard US format',
      icon: '📄',
    },
    a4: {
      name: 'A4',
      dimensions: '8.27" × 11.69"',
      description: 'International standard',
      icon: '📋',
    },
    tabloid: {
      name: 'Tabloid',
      dimensions: '11" × 17"',
      description: 'Large format for presentations',
      icon: '📰',
    },
  };

  const templateDescriptions = {
    minimalist: {
      name: 'Minimalist',
      description: 'Clean 2-column layout with subtle gradients',
      icon: '✨',
    },
    bold: {
      name: 'Bold & Creative',
      description: 'Diagonal layouts and asymmetric design',
      icon: '🎨',
    },
    business: {
      name: 'Professional Business',
      description: 'Data-focused grid with metrics dashboard',
      icon: '📊',
    },
    product: {
      name: 'Product Showcase',
      description: 'Visual-first gallery layout',
      icon: '🖼️',
    },
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.4)"
      backdropFilter="blur(4px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      onClick={onClose}
    >
      <Box
        bg="white"
        borderRadius="16px"
        maxW="600px"
        w="90%"
        maxH="90vh"
        overflowY="auto"
        onClick={(e) => e.stopPropagation()}
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
      >
        {/* Header */}
        <Box p={6} borderBottom="1px solid #e2e8f0">
          <HStack justify="space-between">
            <Text fontSize="24px" fontWeight={700}>
              Export as PDF
            </Text>
            <Button variant="ghost" onClick={onClose} size="sm">
              ✕
            </Button>
          </HStack>
        </Box>

        {/* Body */}
        <Box p={6}>
          <VStack gap={6} align="stretch">
            {/* Template Selection */}
            <Box>
              <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={3}>
                Select Design Template:
              </Text>
              <VStack align="stretch" gap={3}>
                {(Object.keys(templateDescriptions) as string[]).map((templateKey) => {
                  const info = templateDescriptions[templateKey as keyof typeof templateDescriptions];
                  const isSelected = template === templateKey;
                  return (
                    <Box
                      key={templateKey}
                      p={4}
                      borderRadius="12px"
                      border="2px solid"
                      borderColor={isSelected ? '#864CBD' : '#e2e8f0'}
                      bg={isSelected ? 'rgba(134, 76, 189, 0.05)' : 'white'}
                      cursor="pointer"
                      onClick={() => setTemplate(templateKey)}
                      transition="all 0.2s"
                      _hover={{
                        borderColor: '#864CBD',
                        bg: 'rgba(134, 76, 189, 0.05)',
                      }}
                    >
                      <HStack gap={3}>
                        <Box
                          w="20px"
                          h="20px"
                          borderRadius="full"
                          border="2px solid"
                          borderColor={isSelected ? '#864CBD' : '#cbd5e0'}
                          bg={isSelected ? '#864CBD' : 'white'}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          {isSelected && (
                            <Box w="8px" h="8px" borderRadius="full" bg="white" />
                          )}
                        </Box>
                        <Text fontSize="24px">{info.icon}</Text>
                        <VStack align="start" gap={0} flex="1">
                          <Text fontWeight={600} fontSize="16px">
                            {info.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {info.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            </Box>

            {/* Format Selection */}
            <Box>
              <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={3}>
                Select Page Format:
              </Text>
              <VStack align="stretch" gap={3}>
                {(Object.keys(formatDescriptions) as PDFFormat[]).map((formatKey) => {
                  const info = formatDescriptions[formatKey];
                  const isSelected = format === formatKey;
                  return (
                    <Box
                      key={formatKey}
                      p={4}
                      borderRadius="12px"
                      border="2px solid"
                      borderColor={isSelected ? '#864CBD' : '#e2e8f0'}
                      bg={isSelected ? 'rgba(134, 76, 189, 0.05)' : 'white'}
                      cursor="pointer"
                      onClick={() => setFormat(formatKey)}
                      transition="all 0.2s"
                      _hover={{
                        borderColor: '#864CBD',
                        bg: 'rgba(134, 76, 189, 0.05)',
                      }}
                    >
                      <HStack gap={3}>
                        {/* Selection indicator */}
                        <Box
                          w="20px"
                          h="20px"
                          borderRadius="full"
                          border="2px solid"
                          borderColor={isSelected ? '#864CBD' : '#cbd5e0'}
                          bg={isSelected ? '#864CBD' : 'white'}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          {isSelected && (
                            <Box w="8px" h="8px" borderRadius="full" bg="white" />
                          )}
                        </Box>
                        <Text fontSize="24px">{info.icon}</Text>
                        <VStack align="start" gap={0} flex="1">
                          <HStack gap={2}>
                            <Text fontWeight={600} fontSize="16px">
                              {info.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              ({info.dimensions})
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {info.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            </Box>

            {/* Info Box */}
            <Box
              bg="rgba(134, 76, 189, 0.05)"
              border="1px solid rgba(134, 76, 189, 0.2)"
              borderRadius="12px"
              p={4}
            >
              <HStack gap={3} align="start">
                <Text fontSize="20px">✨</Text>
                <VStack align="start" gap={1}>
                  <Text fontSize="sm" color="#2d3748" fontWeight={600}>
                    4 Professional Templates + In-House PDF Engine
                  </Text>
                  <Text fontSize="xs" color="#4a5568" lineHeight="1.6">
                    Choose from 4 unique design styles, each optimized for different use cases.
                    Instant generation with zero API delays. Your brand styles are automatically
                    applied for professional results.
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </Box>

        {/* Footer */}
        <Box p={6} borderTop="1px solid #e2e8f0">
          <HStack justify="flex-end" gap={3} w="full">
            <Button
              variant="ghost"
              onClick={onClose}
              size="md"
            >
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleExport}
              loading={exportMutation.isPending}
              size="md"
              color="white"
              bg="purple.600"
              _hover={{ bg: 'purple.700' }}
            >
              {exportMutation.isPending ? (
                <>
                  <Spinner size="sm" mr={2} />
                  Generating...
                </>
              ) : (
                <>
                  📥 Download PDF
                </>
              )}
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
