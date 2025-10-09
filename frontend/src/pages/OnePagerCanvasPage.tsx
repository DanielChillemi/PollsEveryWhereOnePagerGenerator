/**
 * OnePager Canvas Page
 * 
 * Main editing interface for viewing and editing created one-pagers
 * Loads one-pager by ID and displays it in the Smart Canvas
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Center,
  Alert,
  Badge
} from '@chakra-ui/react'
import { SmartCanvas } from '@/components/canvas/SmartCanvas'
import { useOnePager } from '@/hooks/useOnePager'
import { useOnePagerUpdate } from '@/hooks/useOnePagerUpdate'
import { useOnePagerStore } from '@/stores/onePagerStore'
import { useBrandKits } from '@/hooks/useBrandKit'
import { brandConfig } from '@/config/brandConfig'
import { PDFExportService } from '@/services/pdfExportService'
import { useRef } from 'react'

export function OnePagerCanvasPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // Fetch one-pager data
  const { data: onePager, isLoading, error, refetch } = useOnePager(id)
  
  // Fetch brand kit data
  const { data: brandKits, isLoading: isBrandKitLoading } = useBrandKits()
  
  // Update hook
  const { updateOnePager, isPending: isSaving } = useOnePagerUpdate()
  
  // Local state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  
  // Ref for canvas element
  const canvasRef = useRef<HTMLDivElement>(null)
  
  // Store actions
  const { currentOnePager, setOnePager } = useOnePagerStore()

  // Load one-pager into store when fetched
  useEffect(() => {
    if (onePager && onePager.id !== currentOnePager?.id) {
      setOnePager(onePager)
      setSaveStatus('saved')
      setLastSaved(new Date(onePager.updated_at))
    }
  }, [onePager, currentOnePager?.id, setOnePager])

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    if (saveStatus === 'unsaved' && currentOnePager && id) {
      const timer = setTimeout(() => {
        handleSave()
      }, 30000) // 30 seconds

      return () => clearTimeout(timer)
    }
  }, [saveStatus, currentOnePager, id])

  // Handle manual save
  const handleSave = async () => {
    if (!currentOnePager || !id) return

    try {
      setSaveStatus('saving')
      
      await updateOnePager({
        onePagerId: id,
        updates: {
          elements: currentOnePager.elements,
          style_overrides: currentOnePager.style_overrides,
          title: currentOnePager.title
        }
      })
      
      setSaveStatus('saved')
      setLastSaved(new Date())
    } catch (err) {
      console.error('Failed to save one-pager:', err)
      setSaveStatus('unsaved')
    }
  }

  // Handle export to PDF
  const handleExportPDF = async () => {
    if (!canvasRef.current || !currentOnePager) return

    try {
      setIsExporting(true)
      
      await PDFExportService.exportToPDF(canvasRef.current, {
        filename: `${currentOnePager.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`,
        quality: 0.95,
        format: 'letter',
        orientation: 'portrait'
      })
      
      console.log('PDF exported successfully!')
      alert('PDF exported successfully! Check your downloads folder.')
    } catch (error) {
      console.error('Failed to export PDF:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to export PDF: ${errorMessage}\n\nTry refreshing the page and trying again.`)
    } finally {
      setIsExporting(false)
    }
  }

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    if (saveStatus === 'unsaved') {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to save before leaving?'
      )
      if (confirmLeave) {
        handleSave().then(() => navigate('/dashboard'))
      } else {
        navigate('/dashboard')
      }
    } else {
      navigate('/dashboard')
    }
  }

  // Find active brand kit
  const activeBrandKit = brandKits?.find(
    (kit) => kit.id === currentOnePager?.brand_kit_id
  )

  // Loading state
  if (isLoading || isBrandKitLoading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text fontSize="lg" color="gray.600">
            Loading your one-pager...
          </Text>
        </VStack>
      </Center>
    )
  }

  // Error state
  if (error || !currentOnePager) {
    return (
      <Container maxW="container.md" py={12}>
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Failed to Load One-Pager</Alert.Title>
          <Alert.Description>
            {error instanceof Error ? error.message : 'One-pager not found'}
          </Alert.Description>
        </Alert.Root>
        <Box mt={6}>
          <Button onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        bg={brandConfig.gradients.primary}
        color="white"
        py={6}
        boxShadow="md"
      >
        <Container maxW="container.xl">
          <VStack gap={4} align="stretch">
            <HStack justify="space-between" align="center">
              <VStack align="start" gap={1}>
                <Heading size="xl">{currentOnePager.title}</Heading>
                <HStack gap={2} fontSize="sm">
                  <Badge
                    colorScheme={
                      currentOnePager.status === 'final' ? 'green' :
                      currentOnePager.status === 'styled' ? 'blue' :
                      'gray'
                    }
                  >
                    {currentOnePager.status}
                  </Badge>
                  {activeBrandKit && (
                    <>
                      <Text>•</Text>
                      <Text opacity={0.9}>{activeBrandKit.company_name}</Text>
                    </>
                  )}
                </HStack>
              </VStack>

              <HStack gap={3}>
                {/* Save Status */}
                {saveStatus === 'saving' && (
                  <HStack gap={2}>
                    <Spinner size="sm" />
                    <Text fontSize="sm">Saving...</Text>
                  </HStack>
                )}
                {saveStatus === 'saved' && lastSaved && (
                  <Text fontSize="sm" opacity={0.9}>
                    Saved {lastSaved.toLocaleTimeString()}
                  </Text>
                )}
                {saveStatus === 'unsaved' && (
                  <Text fontSize="sm" color="yellow.200">
                    Unsaved changes
                  </Text>
                )}

                {/* Action Buttons */}
                <Button
                  variant="outline"
                  colorScheme="whiteAlpha"
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={saveStatus === 'saved'}
                >
                  Save
                </Button>
                <Button
                  variant="solid"
                  bg="white"
                  color="brand.primary"
                  onClick={handleExportPDF}
                  loading={isExporting}
                  _hover={{ bg: 'gray.100' }}
                >
                  Export PDF
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  onClick={handleBackToDashboard}
                >
                  ← Dashboard
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Canvas Section */}
      <Container maxW="container.xl" py={8}>
        <Box
          ref={canvasRef}
          bg="white"
          borderRadius="lg"
          overflow="hidden"
          minH="600px"
          // Simplified styles for PDF export compatibility
          style={{
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <SmartCanvas brandKit={activeBrandKit} />
        </Box>

        {/* Help Section */}
        <Box mt={6} p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
          <Heading size="sm" mb={2} color="blue.900">
            💡 Canvas Tips
          </Heading>
          <VStack gap={2} align="start" fontSize="sm" color="blue.800">
            <Text>• Toggle between Wireframe and Styled modes using the toolbar</Text>
            <Text>• Click any section to select and view its properties</Text>
            <Text>• Use zoom controls (+/-) to adjust canvas view</Text>
            <Text>• Changes are auto-saved every 30 seconds</Text>
            <Text>• Click Save to manually save your progress</Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
