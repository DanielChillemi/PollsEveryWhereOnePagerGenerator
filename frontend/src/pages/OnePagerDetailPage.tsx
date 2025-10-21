import { useState } from 'react';
import { Box, Container } from '@chakra-ui/react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layouts/Sidebar';
import { OnePagerEditor } from '../components/onepager/OnePagerEditor';
import { PDFExportModal } from '../components/onepager/PDFExportModal';
import { DesignControlPanel } from '../components/onepager/DesignControlPanel';
import { useOnePager, useSuggestLayoutParams, useApplyLayoutParams } from '../hooks/useOnePager';
import { toaster } from '../components/ui/toaster';
import type { LayoutParams, LayoutSuggestionResponse } from '../types/onepager';

export function OnePagerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [suggestedLayout, setSuggestedLayout] = useState<LayoutSuggestionResponse | null>(null);

  const { data: onepager } = useOnePager(id || '');
  const suggestLayoutMutation = useSuggestLayoutParams();
  const applyLayoutMutation = useApplyLayoutParams();

  if (!id) {
    return <Navigate to="/onepagers" replace />;
  }

  const handleRequestLayoutSuggestion = async () => {
    try {
      const suggestion = await suggestLayoutMutation.mutateAsync({
        id: id!,
      });

      setSuggestedLayout(suggestion);

      toaster.create({
        title: 'AI Suggestion Ready!',
        description: 'Review the suggested layout parameters.',
        type: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to get layout suggestion:', error);
      toaster.create({
        title: 'Suggestion Failed',
        description: error?.response?.data?.detail || 'Could not generate layout suggestions.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleApplyLayoutChanges = async (layoutParams: LayoutParams) => {
    try {
      await applyLayoutMutation.mutateAsync({
        id: id!,
        layoutParams,
      });

      setSuggestedLayout(null);

      toaster.create({
        title: 'Layout Updated!',
        description: 'Design parameters have been applied.',
        type: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to apply layout changes:', error);
      toaster.create({
        title: 'Apply Failed',
        description: error?.response?.data?.detail || 'Could not apply layout changes.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box minH="100vh" bg="#F7F8FA">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content with margins for both sidebars */}
      <Box ml="280px" mr="360px">
        {/* OnePagerEditor now includes its own navigation bar */}
        <OnePagerEditor
          onePagerId={id}
          mode="standalone"
          onBack={() => navigate('/onepager/list')}
          onExport={() => setIsExportOpen(true)}
          hideDesignControls={true}
        />

        {onepager && (
          <PDFExportModal
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
            onepagerId={id}
            title={onepager.title}
          />
        )}
      </Box>

      {/* Right Sidebar - Design Controls */}
      {onepager && (
        <Box
          position="fixed"
          right="0"
          top="0"
          h="100vh"
          w="360px"
          bg="#F7F8FA"
          borderLeft="2px solid"
          borderColor="gray.300"
          boxShadow="-2px 0 8px rgba(0,0,0,0.05)"
        >
          <DesignControlPanel
            currentLayoutParams={onepager.layout_params}
            designRationale={onepager.design_rationale}
            onRequestSuggestion={handleRequestLayoutSuggestion}
            isSuggestionLoading={suggestLayoutMutation.isPending}
            suggestedLayoutParams={suggestedLayout?.suggested_layout_params}
            suggestedRationale={suggestedLayout?.design_rationale}
            onApplyChanges={handleApplyLayoutChanges}
            isApplying={applyLayoutMutation.isPending}
          />
        </Box>
      )}
    </Box>
  );
}

export default OnePagerDetailPage;
