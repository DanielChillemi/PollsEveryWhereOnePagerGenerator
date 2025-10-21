/**
 * PDF Export Step (Step 3)
 * 
 * Final step to export one-pager to PDF
 */

import { Box, VStack, Text, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { PDFExportModal } from '../../../components/onepager/PDFExportModal';
import { useOnePager } from '../../../hooks/useOnePager';

interface PDFExportStepProps {
  onePagerId: string | null;
  onComplete: () => void;
}

export function PDFExportStep({ onePagerId, onComplete }: PDFExportStepProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { data: onepager } = useOnePager(onePagerId!);

  const handleExport = () => {
    setIsExportOpen(true);
  };

  const handleExportComplete = () => {
    setIsExportOpen(false);
    // Wait a moment then complete the wizard
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <>
      <VStack align="stretch" gap={6}>
        {/* Step Header */}
        <Box>
          <Text fontSize="24px" fontWeight="700" color="gray.900" mb={2}>
            PDF Export
          </Text>
          <Text fontSize="14px" color="gray.600" lineHeight="1.6">
            Export your one-pager to a professional PDF document
          </Text>
        </Box>

        {/* Export Options */}
        <Box
          bg="white"
          border="2px solid"
          borderColor="gray.200"
          borderRadius="12px"
          p={8}
          textAlign="center"
        >
          <VStack gap={4}>
            <Box
              w="80px"
              h="80px"
              bg="rgba(134, 76, 189, 0.1)"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
            >
              <Text fontSize="40px">📄</Text>
            </Box>

            <Text fontSize="18px" fontWeight="600" color="gray.900">
              Ready to Export
            </Text>

            <Text fontSize="14px" color="gray.600" lineHeight="1.6" maxW="400px">
              Your one-pager is ready to be exported as a high-quality PDF document. 
              Perfect for sharing with your team or clients.
            </Text>

            <Button
              onClick={handleExport}
              size="lg"
              bg="linear-gradient(135deg, #864CBD 0%, #1568B8 100%)"
              color="white"
              px={8}
              mt={4}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
            >
              📥 Export to PDF
            </Button>
          </VStack>
        </Box>

        {/* Info Box */}
        <Box
          bg="rgba(134, 76, 189, 0.05)"
          border="1px solid rgba(134, 76, 189, 0.2)"
          borderRadius="12px"
          p={4}
        >
          <Text fontSize="13px" color="gray.700" lineHeight="1.6">
            <strong>💡 Pro Tip:</strong> The PDF will include all your brand colors, fonts, and content. 
            You can always come back and export again after making changes in the Smart Canvas editor.
          </Text>
        </Box>

        {/* Alternative Actions */}
        <Box pt={4} borderTop="1px solid" borderColor="gray.100">
          <VStack gap={2}>
            <Button
              onClick={() => window.open(`/onepager/create?id=${onePagerId}`, '_blank')}
              variant="outline"
              colorScheme="purple"
              size="md"
              w="100%"
            >
              🎨 Open in Smart Canvas Editor
            </Button>
            <Button
              onClick={onComplete}
              variant="ghost"
              size="sm"
              colorScheme="gray"
            >
              Skip Export & Complete
            </Button>
          </VStack>
        </Box>
      </VStack>

      {/* PDF Export Modal */}
      {isExportOpen && onePagerId && onepager && (
        <PDFExportModal
          onepagerId={onePagerId}
          title={onepager.title}
          isOpen={isExportOpen}
          onClose={() => {
            setIsExportOpen(false);
            handleExportComplete();
          }}
        />
      )}
    </>
  );
}
