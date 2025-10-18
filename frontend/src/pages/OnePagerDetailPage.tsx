import { useState } from 'react';
import { Box, Container, HStack, Button } from '@chakra-ui/react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { OnePagerEditor } from '../components/onepager/OnePagerEditor';
import { PDFExportModal } from '../components/onepager/PDFExportModal';
import { useOnePager } from '../hooks/useOnePager';

export function OnePagerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { data: onepager } = useOnePager(id || '');

  if (!id) {
    return <Navigate to="/onepagers" replace />;
  }

  return (
    <Box minH="100vh" bg="#F9FAFB">
      <Box bg="white" borderBottom="1px solid #e2e8f0" position="sticky" top={0} zIndex={10}>
        <Container maxW="1400px" px={{ base: 4, md: 8 }}>
          <HStack justify="space-between" py={3}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/onepagers')}>
              ← Back to One-Pagers
            </Button>
            <Button colorScheme="purple" size="sm" onClick={() => setIsExportOpen(true)}>
              📄 Export PDF
            </Button>
          </HStack>
        </Container>
      </Box>

      <Container maxW="1400px" px={{ base: 4, md: 8 }} py={6}>
        <OnePagerEditor onePagerId={id} mode="standalone" />
      </Container>

      {onepager && (
        <PDFExportModal 
          isOpen={isExportOpen} 
          onClose={() => setIsExportOpen(false)} 
          onepagerId={id}
          title={onepager.title}
        />
      )}
    </Box>
  );
}

export default OnePagerDetailPage;
