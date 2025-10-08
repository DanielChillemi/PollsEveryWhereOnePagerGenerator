/**
 * PDF Export Modal
 *
 * Modal for exporting OnePager to PDF with format selection
 * Showcases in-house PDF engine advantages
 */

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Radio,
  RadioGroup,
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
  const exportMutation = useExportPDF();

  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync({
        id: onepagerId,
        format,
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}_${format}.pdf`;
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="16px">
        <ModalHeader fontSize="24px" fontWeight={700}>
          Export as PDF
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack gap={6} align="stretch">
            {/* Format Selection */}
            <Box>
              <Text fontWeight={600} fontSize="16px" color="#2d3748" mb={3}>
                Select Page Format:
              </Text>
              <RadioGroup value={format} onChange={(val) => setFormat(val as PDFFormat)}>
                <VStack align="stretch" gap={3}>
                  {(Object.keys(formatDescriptions) as PDFFormat[]).map((formatKey) => {
                    const info = formatDescriptions[formatKey];
                    return (
                      <Box
                        key={formatKey}
                        p={4}
                        borderRadius="12px"
                        border="2px solid"
                        borderColor={format === formatKey ? '#864CBD' : '#e2e8f0'}
                        bg={format === formatKey ? 'rgba(134, 76, 189, 0.05)' : 'white'}
                        cursor="pointer"
                        onClick={() => setFormat(formatKey)}
                        transition="all 0.2s"
                        _hover={{
                          borderColor: '#864CBD',
                          bg: 'rgba(134, 76, 189, 0.05)',
                        }}
                      >
                        <Radio value={formatKey} colorScheme="purple">
                          <HStack gap={3}>
                            <Text fontSize="24px">{info.icon}</Text>
                            <VStack align="start" gap={0}>
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
                        </Radio>
                      </Box>
                    );
                  })}
                </VStack>
              </RadioGroup>
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
                    Powered by In-House PDF Engine
                  </Text>
                  <Text fontSize="xs" color="#4a5568" lineHeight="1.6">
                    Instant generation with zero API delays. Your brand styles are automatically
                    applied for professional results.
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleExport}
            isLoading={exportMutation.isPending}
            leftIcon={exportMutation.isPending ? <Spinner size="sm" /> : <Text>📥</Text>}
          >
            {exportMutation.isPending ? 'Generating...' : 'Download PDF'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
