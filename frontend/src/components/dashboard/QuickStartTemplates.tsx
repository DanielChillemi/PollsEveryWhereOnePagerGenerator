/**
 * Quick Start Templates Component
 * Display template options for fast one-pager creation
 */

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

interface TemplateCardProps {
  name: string
  description: string
  icon: React.ReactNode
  color: string
  popular?: boolean
  onClick: () => void
}

const TemplateCard = ({ name, description, icon, color, popular, onClick }: TemplateCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="2px"
      borderColor="gray.300"
      p="6"
      cursor="pointer"
      position="relative"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
      transition="all 0.3s"
      _hover={{
        borderColor: color,
        transform: 'translateY(-6px)',
        boxShadow: `0 16px 32px -8px ${color}50`
      }}
      onClick={onClick}
    >
      {popular && (
        <Badge
          position="absolute"
          top="-3"
          right="4"
          colorScheme="purple"
          fontSize="xs"
          px="2"
          py="1"
        >
          Popular
        </Badge>
      )}

      <VStack gap="4" align="start">
        {/* Icon */}
        <Box
          p="3"
          borderRadius="lg"
          bg={`${color}15`}
          color={color}
          fontSize="2xl"
        >
          {icon}
        </Box>

        {/* Content */}
        <VStack gap="2" align="start">
          <Text fontSize="lg" fontWeight="700" color="gray.800">
            {name}
          </Text>
          <Text fontSize="sm" color="gray.600" lineHeight="1.6">
            {description}
          </Text>
        </VStack>

        {/* CTA */}
        <HStack
          mt="2"
          color={color}
          fontSize="sm"
          fontWeight="600"
          transition="all 0.2s"
          _groupHover={{ ml: "2" }}
        >
          <Text>Start creating</Text>
          <Text>→</Text>
        </HStack>
      </VStack>
    </Box>
  )
}

// Template Icons
const MinimalistIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="6" width="20" height="20" rx="2" />
    <line x1="6" y1="12" x2="26" y2="12" />
  </svg>
)

const BoldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
    <path d="M8 4h10c4.418 0 8 3.582 8 8 0 2.21-.895 4.21-2.343 5.657A7.963 7.963 0 0120 20H8V4zm0 18h12c4.418 0 8 3.582 8 8H8v-8z" />
  </svg>
)

const BusinessIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="8" width="24" height="18" rx="2" />
    <path d="M4 12h24M12 8v20M20 8v20" />
  </svg>
)

const ProductIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="26" height="16" rx="2" />
    <circle cx="16" cy="16" r="4" />
    <path d="M22 12h4M22 20h4" />
  </svg>
)

interface Template {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  popular?: boolean
}

const templates: Template[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean 2-column layout with subtle gradients. Perfect for modern brands.',
    icon: <MinimalistIcon />,
    color: '#667eea',
    popular: true
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Diagonal design with strong visual hierarchy. Stand out with confidence.',
    icon: <BoldIcon />,
    color: '#f5576c'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Data-focused grid with charts and metrics. Professional and credible.',
    icon: <BusinessIcon />,
    color: '#4facfe'
  },
  {
    id: 'product',
    name: 'Product',
    description: 'Visual showcase with large images. Highlight features beautifully.',
    icon: <ProductIcon />,
    color: '#43e97b'
  }
]

export const QuickStartTemplates = () => {
  const navigate = useNavigate()

  const handleTemplateClick = (templateId: string) => {
    // Navigate to create page with template preselected
    navigate(`/onepager/create?template=${templateId}`)
  }

  return (
    <VStack gap="6" align="start" w="full">
      {/* Header */}
      <VStack gap="2" align="start">
        <Heading size="md" color="#007ACC">
          Quick Start Templates
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Choose a template and start creating in seconds
        </Text>
      </VStack>

      {/* Template Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="6" w="full">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            name={template.name}
            description={template.description}
            icon={template.icon}
            color={template.color}
            popular={template.popular}
            onClick={() => handleTemplateClick(template.id)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  )
}
