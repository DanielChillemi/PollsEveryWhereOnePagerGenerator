import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

/**
 * Poll Everywhere Design System Theme
 * 
 * Brand Colors:
 * - Primary Blue: #007ACC
 * - Purple Accent: #864CBD
 * - Deep Blue: #1568B8
 * - Background White: #FFFFFF
 * - Gradient: linear-gradient(135deg, #864CBD 0%, #1568B8 100%)
 * 
 * Typography: Source Sans Pro
 * - Heading 1: 48px / 700 weight
 * - Heading 2: 32px / 700 weight
 * - Heading 3: 24px / 600 weight
 * - Body: 18px / 400 weight
 * - Small: 14px / 400 weight
 * 
 * Spacing Scale: 8px, 16px, 24px, 32px, 48px, 64px
 */

const pollEverywhereConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Poll Everywhere Brand Colors
        brand: {
          primary: { value: '#007ACC' },         // Primary Blue
          purple: { value: '#864CBD' },          // Purple Accent
          deepBlue: { value: '#1568B8' },        // Deep Blue
          background: { value: '#FFFFFF' },       // Background White
          text: { value: '#333333' },            // Text Color
          textLight: { value: '#666666' },       // Secondary Text
          textDark: { value: '#1a1a1a' },        // Dark Text
          border: { value: '#e0e0e0' },          // Border Color
          backgroundGray: { value: '#f8f9fa' },  // Light Gray Background
          backgroundBlue: { value: '#f0f4f8' },  // Light Blue Background
        },
        // Extended color scales for UI components
        blue: {
          50: { value: '#e6f4ff' },
          100: { value: '#b3ddff' },
          200: { value: '#80c7ff' },
          300: { value: '#4db0ff' },
          400: { value: '#1a99ff' },
          500: { value: '#007ACC' },  // Primary Blue
          600: { value: '#0062a3' },
          700: { value: '#004a7a' },
          800: { value: '#003251' },
          900: { value: '#001a29' },
        },
        purple: {
          50: { value: '#f3e8fb' },
          100: { value: '#ddc2f1' },
          200: { value: '#c79ce7' },
          300: { value: '#b176dd' },
          400: { value: '#9b50d3' },
          500: { value: '#864CBD' },  // Purple Accent
          600: { value: '#6d3d9a' },
          700: { value: '#542e77' },
          800: { value: '#3b1f54' },
          900: { value: '#221031' },
        },
      },
      fonts: {
        heading: { value: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
        body: { value: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      },
      fontSizes: {
        xs: { value: '12px' },
        sm: { value: '14px' },
        md: { value: '16px' },
        lg: { value: '18px' },
        xl: { value: '20px' },
        '2xl': { value: '24px' },
        '3xl': { value: '32px' },
        '4xl': { value: '48px' },
        '5xl': { value: '56px' },
      },
      fontWeights: {
        light: { value: 300 },
        normal: { value: 400 },
        semibold: { value: 600 },
        bold: { value: 700 },
      },
      lineHeights: {
        tight: { value: '1.2' },
        normal: { value: '1.6' },
        relaxed: { value: '1.8' },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '4px' },
        md: { value: '8px' },
        lg: { value: '12px' },
        xl: { value: '16px' },
        full: { value: '50px' },
      },
      spacing: {
        xs: { value: '8px' },
        sm: { value: '16px' },
        md: { value: '24px' },
        lg: { value: '32px' },
        xl: { value: '48px' },
        xxl: { value: '64px' },
      },
    },
    semanticTokens: {
      colors: {
        // Semantic color mappings for easier usage
        primary: { value: '{colors.brand.primary}' },
        background: { value: '{colors.brand.background}' },
        text: { value: '{colors.brand.text}' },
        textSecondary: { value: '{colors.brand.textLight}' },
        border: { value: '{colors.brand.border}' },
      },
    },
    recipes: {
      // Button component styling
      button: {
        base: {
          fontFamily: 'body',
          fontWeight: 'semibold',
          borderRadius: 'full',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-2px)',
          },
        },
        variants: {
          primary: {
            background: 'linear-gradient(135deg, #864CBD 0%, #1568B8 100%)',
            color: 'white',
            padding: '14px 32px',
            fontSize: 'lg',
            _hover: {
              boxShadow: '0 6px 20px rgba(134, 76, 189, 0.4)',
            },
          },
          secondary: {
            background: 'brand.primary',
            color: 'white',
            padding: '14px 32px',
            fontSize: 'lg',
            _hover: {
              background: '#005A9C',
            },
          },
          outline: {
            background: 'transparent',
            color: 'brand.primary',
            border: '2px solid',
            borderColor: 'brand.primary',
            padding: '12px 30px',
            fontSize: 'lg',
            _hover: {
              background: 'brand.primary',
              color: 'white',
            },
          },
        } as any, // Chakra UI v3 type workaround
      },
      // Heading styles
      heading: {
        variants: {
          h1: {
            fontSize: '4xl',
            fontWeight: 'bold',
            lineHeight: 'tight',
            color: 'brand.textDark',
          },
          h2: {
            fontSize: '3xl',
            fontWeight: 'bold',
            color: 'brand.textDark',
          },
          h3: {
            fontSize: '2xl',
            fontWeight: 'semibold',
            color: 'brand.textDark',
          },
        } as any, // Chakra UI v3 type workaround
      },
    },
  },
})

// Create the theme system with Poll Everywhere configuration
export const system = createSystem(defaultConfig, pollEverywhereConfig)
