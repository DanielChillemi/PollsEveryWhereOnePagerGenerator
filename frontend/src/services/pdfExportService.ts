/**
 * PDF Export Service
 * 
 * Client-side PDF generation using html2canvas + jsPDF
 * Captures canvas content and generates high-quality PDF
 */

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface ExportPDFOptions {
  filename?: string
  quality?: number
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

export class PDFExportService {
  /**
   * Export canvas element to PDF
   * @param element - HTML element to capture
   * @param options - Export options
   */
  static async exportToPDF(
    element: HTMLElement,
    options: ExportPDFOptions = {}
  ): Promise<void> {
    const {
      filename = `one-pager-${new Date().getTime()}.pdf`,
      quality = 0.95,
      format = 'letter',
      orientation = 'portrait'
    } = options

    try {
      // Capture element as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // High DPI for better quality
        useCORS: true, // Allow cross-origin images
        logging: false,
        backgroundColor: '#ffffff',
        // Ignore elements that might cause parsing issues
        ignoreElements: (element) => {
          // Skip elements with data-html2canvas-ignore attribute
          return element.hasAttribute('data-html2canvas-ignore')
        },
        // Handle modern CSS features that html2canvas doesn't support
        onclone: (clonedDoc) => {
          // CRITICAL: Strip out all Chakra UI CSS that uses color() functions
          // html2canvas can't parse CSS Color Module Level 4 syntax
          
          // Remove all style elements that might contain color() functions
          const styleElements = clonedDoc.querySelectorAll('style')
          styleElements.forEach((styleEl) => {
            if (styleEl.textContent?.includes('color(')) {
              // Replace color() functions with rgba() fallbacks
              styleEl.textContent = styleEl.textContent.replace(
                /color\([^)]+\)/g,
                'rgba(0, 0, 0, 0.5)'
              )
            }
          })
          
          // Fix inline and computed styles on all elements
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement
            
            // Force override any problematic styles with safe defaults
            // This ensures html2canvas can parse all styles
            if (htmlEl.style.boxShadow) {
              const shadow = htmlEl.style.boxShadow
              if (shadow.includes('color(')) {
                htmlEl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
              }
            }
            
            if (htmlEl.style.color) {
              const color = htmlEl.style.color
              if (color.includes('color(')) {
                htmlEl.style.color = 'rgb(0, 0, 0)'
              }
            }
            
            if (htmlEl.style.backgroundColor) {
              const bgColor = htmlEl.style.backgroundColor
              if (bgColor.includes('color(')) {
                htmlEl.style.backgroundColor = 'rgb(255, 255, 255)'
              }
            }
            
            if (htmlEl.style.borderColor) {
              const borderColor = htmlEl.style.borderColor
              if (borderColor.includes('color(')) {
                htmlEl.style.borderColor = 'rgb(200, 200, 200)'
              }
            }
          })
        }
      })

      // Get canvas dimensions
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: format === 'letter' ? [816, 1056] : 'a4', // Letter: 8.5x11 inches at 96 DPI
        compress: true
      })

      // Calculate dimensions to fit page
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
      const scaledWidth = imgWidth * ratio
      const scaledHeight = imgHeight * ratio

      // Center image on page
      const x = (pageWidth - scaledWidth) / 2
      const y = (pageHeight - scaledHeight) / 2

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/jpeg', quality)

      // Add image to PDF
      pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight)

      // Save PDF
      pdf.save(filename)

      return Promise.resolve()
    } catch (error) {
      console.error('Failed to export PDF:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        element: element ? 'Element exists' : 'Element is null',
        elementDimensions: element ? { width: element.offsetWidth, height: element.offsetHeight } : null
      })
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get estimated PDF file size
   * @param element - HTML element to measure
   */
  static async estimateFileSize(element: HTMLElement): Promise<number> {
    try {
      const canvas = await html2canvas(element, {
        scale: 1,
        logging: false
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      
      // Base64 string length is roughly 4/3 of actual bytes
      const sizeInBytes = (imgData.length * 3) / 4
      
      return sizeInBytes
    } catch (error) {
      console.error('Failed to estimate file size:', error)
      return 0
    }
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
