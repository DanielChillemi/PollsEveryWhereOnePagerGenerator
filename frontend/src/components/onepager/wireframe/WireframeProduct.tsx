/**
 * WireframeProduct Component
 * ===========================
 * Template-specific wireframe preview matching the "product" PDF template layout.
 *
 * Layout Structure:
 * - Brand bar with logo/name
 * - Visual hero with text overlay
 * - Feature gallery grid (3x2 = 6 cards):
 *   - Card 1 (spans 2 columns): First LIST (showcase)
 *   - Card 2: First TEXT
 *   - Card 3: Second LIST
 *   - Card 4: Third LIST or Second TEXT
 *   - Card 5: Hardcoded placeholder
 *   - Card 6: Hardcoded placeholder
 * - CTA banner footer
 *
 * Mirrors: backend/templates/pdf/onepager_product.html
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import type { OnePager, ContentSection } from '../../../types/onepager';
import './wireframe-common.css';

interface WireframeProductProps {
  onepager: OnePager;
}

export const WireframeProduct: React.FC<WireframeProductProps> = ({ onepager }) => {
  const { content } = onepager;

  // Filter sections by type (mirrors Jinja2 logic in PDF template)
  const heroSections = content.sections.filter(s => s.type === 'hero');
  const listSections = content.sections.filter(s => s.type === 'list');
  const textSections = content.sections.filter(s => s.type === 'text');
  const buttonSections = content.sections.filter(s => s.type === 'button');
  const ctaSections = content.sections.filter(s => s.type === 'cta');

  // Section distribution logic (matches onepager_product.html)
  const card1Section = listSections[0];     // First list (showcase)
  const card2Section = textSections[0];     // First text
  const card3Section = listSections[1];     // Second list
  const card4Section = listSections[2] || textSections[1]; // Third list OR second text

  /**
   * Get icon emoji based on section title keywords
   */
  const getIconForSection = (section: ContentSection): string => {
    if (!section?.title) return '✨';
    const title = section.title.toLowerCase();
    if (title.includes('feature')) return '⚡';
    if (title.includes('benefit')) return '🎯';
    if (title.includes('product')) return '📦';
    if (title.includes('integration')) return '🔧';
    return '💎';
  };

  /**
   * Render a feature card
   */
  const renderFeatureCard = (
    section: ContentSection | undefined,
    cardNumber: number,
    isShowcase?: boolean,
    placeholderTitle?: string,
    placeholderDescription?: string
  ) => {
    const isPlaceholder = !section && placeholderTitle;
    const icon = section ? (section.type === 'text' ? '📄' : getIconForSection(section)) : (cardNumber === 5 ? '🚀' : '💬');

    return (
      <div
        className={`wireframe-section ${isShowcase ? 'showcase-large' : ''}`}
        style={{
          gridColumn: isShowcase ? '1 / 3' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          border: '2px solid #F0F0F0',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: isShowcase ? '200px' : '150px'
        }}
      >
        {/* Feature image area with icon */}
        <div style={{
          height: isShowcase ? '120px' : '90px',
          background: 'linear-gradient(135deg, #EBF8FF 0%, #FFF5F5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '3px solid #3182CE',
          position: 'relative'
        }}>
          <div style={{
            fontSize: isShowcase ? '60px' : '40px',
            opacity: 0.3
          }}>
            {icon}
          </div>

          {/* Section type label */}
          <div className="wireframe-section-label" style={{
            position: 'absolute',
            top: '8px',
            left: '8px'
          }}>
            {section ? section.type.toUpperCase() : 'PLACEHOLDER'}
          </div>

          {/* Stats badge for Card 1 */}
          {cardNumber === 1 && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '8px 12px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 'calc(18px * var(--layout-h2-scale, 1.0))',
                fontWeight: 'bold',
                color: '#3182CE',
                lineHeight: '1'
              }}>99+</div>
              <div style={{
                fontSize: 'calc(7px * var(--layout-body-scale, 1.0))',
                color: '#6B7280',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>STAT</div>
            </div>
          )}
        </div>

        {/* Feature content */}
        <div style={{
          padding: 'calc(16px * var(--layout-padding-scale, 1.0))',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {section ? (
            <>
              {section.title && (
                <h3 style={{
                  fontSize: isShowcase ? 'calc(14px * var(--layout-h2-scale, 1.0))' : 'calc(11px * var(--layout-h2-scale, 1.0))',
                  fontWeight: 'bold',
                  color: '#1A202C',
                  marginBottom: '8px',
                  lineHeight: '1.2'
                }}>
                  {section.title}
                </h3>
              )}

              {section.type === 'list' && Array.isArray(section.content) && (
                <ul className="wireframe-list">
                  {section.content.slice(0, isShowcase ? 4 : 5).map((item, idx) => (
                    <li key={idx} className="wireframe-list-item" style={{
                      fontSize: isShowcase ? 'calc(9.5px * var(--layout-body-scale, 1.0))' : 'calc(8.5px * var(--layout-body-scale, 1.0))'
                    }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.type === 'text' && typeof section.content === 'string' && (
                <p style={{
                  fontSize: isShowcase ? 'calc(9.5px * var(--layout-body-scale, 1.0))' : 'calc(8.5px * var(--layout-body-scale, 1.0))',
                  lineHeight: '1.5',
                  color: '#6B7280',
                  flex: 1
                }}>
                  {section.content.length > 150 ? `${section.content.substring(0, 150)}...` : section.content}
                </p>
              )}
            </>
          ) : isPlaceholder ? (
            <>
              <h3 style={{
                fontSize: 'calc(11px * var(--layout-h2-scale, 1.0))',
                fontWeight: 'bold',
                color: '#1A202C',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                {placeholderTitle}
              </h3>
              <p style={{
                fontSize: 'calc(8.5px * var(--layout-body-scale, 1.0))',
                lineHeight: '1.5',
                color: '#6B7280',
                flex: 1
              }}>
                {placeholderDescription}
              </p>
            </>
          ) : (
            <div className="wireframe-placeholder">
              No section for Card {cardNumber}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Box className="wireframe-container wireframe-product">
      {/* Template Info Header */}
      <div className="wireframe-template-header">
        <span className="wireframe-template-name">PRODUCT TEMPLATE</span>
        <span className="wireframe-template-description">3-Column Gallery Layout</span>
      </div>

      {/* Brand Bar */}
      <div className="wireframe-section" style={{
        background: 'white',
        padding: 'calc(12px * var(--layout-padding-scale, 1.0)) calc(16px * var(--layout-padding-scale, 1.0))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '3px solid #3182CE',
        marginBottom: 'calc(16px * var(--layout-section-gap, 1.0))'
      }}>
        <div className="wireframe-section-label" style={{ position: 'absolute', top: '-12px' }}>
          BRAND BAR
        </div>
        <div style={{
          fontWeight: 'bold',
          fontSize: 'calc(24px * var(--layout-h1-scale, 1.0))',
          color: '#3182CE',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          [Brand Logo/Name]
        </div>
        <div style={{
          fontSize: 'calc(9px * var(--layout-body-scale, 1.0))',
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Premium Quality
        </div>
      </div>

      {/* Visual Hero with Text Overlay */}
      {heroSections.length > 0 && (
        <div className="wireframe-section" style={{
          background: 'linear-gradient(135deg, #3182CE 0%, #ED8936 100%)',
          padding: 'calc(40px * var(--layout-padding-scale, 1.0))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '200px',
          marginBottom: 'calc(20px * var(--layout-section-gap, 1.0))',
          position: 'relative',
          color: 'white'
        }}>
          <div className="wireframe-section-label" style={{ color: 'white', borderColor: 'white' }}>
            HERO VISUAL
          </div>

          {typeof heroSections[0].content === 'object' && 'headline' in heroSections[0].content ? (
            <div style={{ maxWidth: '600px' }}>
              <h1 style={{
                fontSize: 'calc(38px * var(--layout-h1-scale, 1.0))',
                fontWeight: 'bold',
                lineHeight: '1',
                marginBottom: '16px',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                letterSpacing: '-0.5px'
              }}>
                {heroSections[0].content.headline}
              </h1>
              {(heroSections[0].content.subheadline || heroSections[0].content.description) && (
                <p style={{
                  fontSize: 'calc(14px * var(--layout-body-scale, 1.0))',
                  fontWeight: '600',
                  lineHeight: '1.3',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  opacity: 0.95
                }}>
                  {heroSections[0].content.subheadline || (
                    heroSections[0].content.description && heroSections[0].content.description.length > 100
                      ? `${heroSections[0].content.description.substring(0, 100)}...`
                      : heroSections[0].content.description
                  )}
                </p>
              )}
            </div>
          ) : null}

          {/* Visual frame indicator */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            height: '80%',
            border: '3px dashed rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            zIndex: 0
          }} />
        </div>
      )}

      {/* Feature Gallery Grid - 3x2 */}
      <div style={{ marginBottom: 'calc(20px * var(--layout-section-gap, 1.0))' }}>
        <div className="wireframe-three-column-grid" style={{
          background: '#F8F9FA',
          padding: 'calc(16px * var(--layout-padding-scale, 1.0))',
          borderRadius: '8px'
        }}>
          {/* Card 1: Large Showcase (First List, spans 2 columns) */}
          {renderFeatureCard(card1Section, 1, true)}

          {/* Card 2: First Text */}
          {renderFeatureCard(card2Section, 2)}

          {/* Card 3: Second List */}
          {renderFeatureCard(card3Section, 3)}

          {/* Card 4: Third List OR Second Text */}
          {renderFeatureCard(card4Section, 4)}

          {/* Card 5: Hardcoded Placeholder */}
          {renderFeatureCard(
            undefined,
            5,
            false,
            'Fast & Reliable',
            'Built for performance and scalability to grow with your needs.'
          )}

          {/* Card 6: Hardcoded Placeholder */}
          {renderFeatureCard(
            undefined,
            6,
            false,
            '24/7 Support',
            'Our team is always here to help you succeed and answer questions.'
          )}
        </div>
      </div>

      {/* CTA Banner Footer */}
      {(buttonSections.length > 0 || ctaSections.length > 0) && (
        <div className="wireframe-section" style={{
          background: 'linear-gradient(to right, #ED8936 0%, #DD6B20 100%)',
          padding: 'calc(20px * var(--layout-padding-scale, 1.0)) calc(24px * var(--layout-padding-scale, 1.0))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '4px solid #C05621',
          color: 'white'
        }}>
          <div className="wireframe-section-label" style={{ color: 'white', borderColor: 'white' }}>
            CTA BANNER
          </div>
          <div>
            <h3 style={{
              fontSize: 'calc(20px * var(--layout-h2-scale, 1.0))',
              fontWeight: 'bold',
              marginBottom: '4px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
            }}>
              Get Started Today
            </h3>
            <p style={{
              fontSize: 'calc(10px * var(--layout-body-scale, 1.0))',
              opacity: 0.95
            }}>
              Experience the difference for yourself
            </p>
          </div>
          {buttonSections.length > 0 && typeof buttonSections[0].content === 'object' && 'text' in buttonSections[0].content && (
            <button style={{
              background: 'white',
              color: '#ED8936',
              padding: 'calc(14px * var(--layout-padding-scale, 1.0)) calc(32px * var(--layout-padding-scale, 1.0))',
              fontSize: 'calc(12px * var(--layout-body-scale, 1.0))',
              fontWeight: 'bold',
              border: '3px solid white',
              borderRadius: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}>
              {buttonSections[0].content.text}
            </button>
          )}
        </div>
      )}

      {/* Template Grid Visualization */}
      <div className="wireframe-grid-overlay">
        <div className="wireframe-grid-line wireframe-vertical-line" style={{ left: '33.33%' }} />
        <div className="wireframe-grid-line wireframe-vertical-line" style={{ left: '66.66%' }} />
      </div>
    </Box>
  );
};
