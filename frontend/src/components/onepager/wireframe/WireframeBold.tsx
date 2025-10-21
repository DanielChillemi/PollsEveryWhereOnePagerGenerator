/**
 * WireframeBold Component
 * =======================
 * Template-specific wireframe preview matching the "bold" PDF template layout.
 *
 * Layout Structure:
 * - Hero section (full width diagonal split)
 * - 3-column asymmetric grid (2.2fr 1fr 2fr, 2 rows):
 *   - Left: Large Feature Block (first LIST, spans 2 rows)
 *   - Center Top: Medium Block (first TEXT)
 *   - Center Bottom: Small Accent Block (hardcoded badge)
 *   - Right: Wide Info Block (second LIST or TEXT, spans 2 rows)
 * - Diagonal CTA footer (full width)
 *
 * Mirrors: backend/templates/pdf/onepager_bold.html
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import type { OnePager, ContentSection } from '../../../types/onepager';
import './wireframe-common.css';

interface WireframeBoldProps {
  onepager: OnePager;
}

export const WireframeBold: React.FC<WireframeBoldProps> = ({ onepager }) => {
  const { content } = onepager;

  // Filter sections by type (mirrors Jinja2 logic in PDF template)
  const heroSections = content.sections.filter(s => s.type === 'hero');
  const listSections = content.sections.filter(s => s.type === 'list');
  const textSections = content.sections.filter(s => s.type === 'text');
  const ctaSections = content.sections.filter(s => s.type === 'cta');
  const buttonSections = content.sections.filter(s => s.type === 'button');

  // Section distribution logic (matches onepager_bold.html)
  const largeFeatureBlock = listSections[0]; // First list
  const mediumBlock = textSections[0];       // First text
  const wideInfoBlock = listSections[1] || textSections[1]; // Second list or text

  /**
   * Render a section with wireframe styling
   */
  const renderSection = (section: ContentSection, variant?: 'large' | 'medium' | 'wide') => {
    if (!section) return null;

    const sectionContent = typeof section.content === 'string'
      ? section.content
      : JSON.stringify(section.content);

    const variantClass = variant ? `wireframe-section-${variant}` : '';

    return (
      <div className={`wireframe-section ${variantClass}`}>
        <div className="wireframe-section-label">{section.type.toUpperCase()}</div>

        {section.title && (
          <h3 className="wireframe-section-title">
            {/* Icon based on title keywords */}
            {section.title.toLowerCase().includes('feature') && <span style={{ marginRight: '8px' }}>⚡</span>}
            {section.title.toLowerCase().includes('benefit') && <span style={{ marginRight: '8px' }}>🎯</span>}
            {section.title}
          </h3>
        )}

        {/* Render content based on type */}
        {section.type === 'list' && Array.isArray(section.content) && (
          <ul className="wireframe-list">
            {section.content.slice(0, 8).map((item, idx) => (
              <li key={idx} className="wireframe-list-item">{item}</li>
            ))}
          </ul>
        )}

        {section.type === 'text' && typeof section.content === 'string' && (
          <p className="wireframe-text">
            {section.content.length > 300 ? `${section.content.substring(0, 300)}...` : section.content}
          </p>
        )}
      </div>
    );
  };

  return (
    <Box className="wireframe-container wireframe-bold">
      {/* Template Info Header */}
      <div className="wireframe-template-header">
        <span className="wireframe-template-name">BOLD TEMPLATE</span>
        <span className="wireframe-template-description">3-Column Asymmetric Layout</span>
      </div>

      {/* Hero Section - Full Width with Diagonal Split */}
      {heroSections.length > 0 && (
        <div className="wireframe-hero-section" style={{ position: 'relative' }}>
          <div className="wireframe-section">
            <div className="wireframe-section-label">HERO (Diagonal Split)</div>
            {typeof heroSections[0].content === 'object' && 'headline' in heroSections[0].content ? (
              <div className="wireframe-hero-content">
                <h1 className="wireframe-headline">{heroSections[0].content.headline}</h1>
                {heroSections[0].content.subheadline && (
                  <p className="wireframe-subheadline">{heroSections[0].content.subheadline}</p>
                )}
                {heroSections[0].content.description && (
                  <p className="wireframe-description">{heroSections[0].content.description}</p>
                )}
              </div>
            ) : null}

            {/* Diagonal decoration indicator */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '10px',
              fontSize: '10px',
              color: '#A0AEC0',
              fontFamily: 'Courier New, monospace',
              fontStyle: 'italic'
            }}>
              Diagonal clip-path applied in PDF
            </div>
          </div>
        </div>
      )}

      {/* Asymmetric Content Grid - 3 Columns (2.2fr 1fr 2fr) */}
      <div className="wireframe-asymmetric-grid">
        {/* Large Feature Block - Left Column (Spans 2 rows) */}
        <div style={{ gridColumn: '1', gridRow: '1 / 3' }}>
          <div className="wireframe-column-label">LEFT COLUMN (2.2fr, 2 rows)</div>
          {largeFeatureBlock ? (
            renderSection(largeFeatureBlock, 'large')
          ) : (
            <div className="wireframe-placeholder">
              No list sections to display
            </div>
          )}
        </div>

        {/* Medium Block - Center Top */}
        <div style={{ gridColumn: '2', gridRow: '1' }}>
          <div className="wireframe-column-label">CENTER (1fr)</div>
          {mediumBlock ? (
            renderSection(mediumBlock, 'medium')
          ) : (
            <div className="wireframe-placeholder">
              No text sections
            </div>
          )}
        </div>

        {/* Small Accent Block - Center Bottom (Hardcoded Badge) */}
        <div style={{ gridColumn: '2', gridRow: '2' }}>
          <div className="wireframe-section" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FED7D7',
            minHeight: '100px'
          }}>
            <div className="wireframe-section-label" style={{ position: 'absolute', top: '-12px' }}>
              ACCENT BADGE
            </div>
            <div style={{
              fontSize: 'calc(28px * var(--layout-h1-scale, 1.0))',
              fontWeight: 'bold',
              color: '#C53030',
              marginBottom: '8px'
            }}>
              100%
            </div>
            <div style={{
              fontSize: 'calc(9px * var(--layout-body-scale, 1.0))',
              fontWeight: 'bold',
              color: '#742A2A',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Quality
            </div>
          </div>
        </div>

        {/* Wide Info Block - Right Column (Spans 2 rows) */}
        <div style={{ gridColumn: '3', gridRow: '1 / 3' }}>
          <div className="wireframe-column-label">RIGHT COLUMN (2fr, 2 rows)</div>
          {wideInfoBlock ? (
            renderSection(wideInfoBlock, 'wide')
          ) : (
            <div className="wireframe-placeholder">
              No second list or text section
            </div>
          )}
        </div>
      </div>

      {/* CTA Footer - Full Width with Diagonal Clip */}
      {(ctaSections.length > 0 || buttonSections.length > 0) && (
        <div className="wireframe-cta-section" style={{ position: 'relative' }}>
          {ctaSections.length > 0 ? (
            <div className="wireframe-section">
              <div className="wireframe-section-label">CTA (Diagonal Footer)</div>
              <div className="wireframe-cta-content">
                {typeof ctaSections[0].content === 'object' && 'text' in ctaSections[0].content && (
                  <>
                    <button className="wireframe-cta-button">
                      {ctaSections[0].content.text}
                    </button>
                    {ctaSections[0].content.url && (
                      <span className="wireframe-cta-url">{ctaSections[0].content.url}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : buttonSections.length > 0 && (
            <div className="wireframe-section">
              <div className="wireframe-section-label">BUTTON (Diagonal Footer)</div>
              <div className="wireframe-cta-content">
                {typeof buttonSections[0].content === 'object' && 'text' in buttonSections[0].content && (
                  <>
                    <button className="wireframe-cta-button">
                      {buttonSections[0].content.text}
                    </button>
                    {buttonSections[0].content.url && (
                      <span className="wireframe-cta-url">{buttonSections[0].content.url}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Diagonal decoration indicator */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            fontSize: '10px',
            color: '#A0AEC0',
            fontFamily: 'Courier New, monospace',
            fontStyle: 'italic'
          }}>
            Diagonal clip-path applied in PDF
          </div>
        </div>
      )}

      {/* Template Grid Visualization */}
      <div className="wireframe-grid-overlay">
        {/* Vertical lines for 3-column grid (2.2fr 1fr 2fr) */}
        <div
          className="wireframe-grid-line wireframe-vertical-line"
          style={{ left: '42%' }}
        />
        <div
          className="wireframe-grid-line wireframe-vertical-line"
          style={{ left: '61%' }}
        />
      </div>
    </Box>
  );
};
