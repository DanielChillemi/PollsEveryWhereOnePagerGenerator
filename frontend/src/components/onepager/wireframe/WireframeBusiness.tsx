/**
 * WireframeBusiness Component
 * ============================
 * Template-specific wireframe preview matching the "business" PDF template layout.
 *
 * Layout Structure:
 * - Professional header with brand logo/name
 * - Executive summary (hero headline + description)
 * - Metrics dashboard (4-column grid, if stats exist)
 * - Structured content grid (2x2):
 *   - Box 1 (top-left): First LIST
 *   - Box 2 (top-right): First TEXT
 *   - Box 3 (bottom-left): Second LIST
 *   - Box 4 (bottom-right): Second TEXT or Third LIST
 * - Professional footer with CTA
 *
 * Mirrors: backend/templates/pdf/onepager_business.html
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import type { OnePager, ContentSection } from '../../../types/onepager';
import './wireframe-common.css';

interface WireframeBusinessProps {
  onepager: OnePager;
}

export const WireframeBusiness: React.FC<WireframeBusinessProps> = ({ onepager }) => {
  const { content } = onepager;

  // Filter sections by type (mirrors Jinja2 logic in PDF template)
  const heroSections = content.sections.filter(s => s.type === 'hero');
  const listSections = content.sections.filter(s => s.type === 'list');
  const textSections = content.sections.filter(s => s.type === 'text');
  const buttonSections = content.sections.filter(s => s.type === 'button');
  const ctaSections = content.sections.filter(s => s.type === 'cta');

  // Section distribution logic (matches onepager_business.html)
  const box1Section = listSections[0];     // First list
  const box2Section = textSections[0];     // First text
  const box3Section = listSections[1];     // Second list
  const box4Section = textSections[1] || listSections[2]; // Second text OR third list

  /**
   * Get icon emoji based on section title keywords
   */
  const getIconForSection = (section: ContentSection): string => {
    if (!section?.title) return '📊';
    const title = section.title.toLowerCase();
    if (title.includes('feature')) return '⚡';
    if (title.includes('benefit')) return '🎯';
    if (title.includes('integration')) return '🔗';
    if (title.includes('social') || title.includes('proof')) return '💬';
    return '📋';
  };

  /**
   * Render a content box with icon header
   */
  const renderContentBox = (section: ContentSection | undefined, boxNumber: number, isKeyPoints?: boolean) => {
    if (!section) {
      return (
        <div className="wireframe-placeholder" style={{ height: '100%' }}>
          No section for Box {boxNumber}
        </div>
      );
    }

    const icon = section.type === 'text' ? '📄' : getIconForSection(section);
    const boxClass = isKeyPoints ? 'key-points-box' : '';

    return (
      <div className={`wireframe-section ${boxClass}`} style={{
        height: '100%',
        background: isKeyPoints ? '#EBF8FF' : '#FAFAFA',
        borderLeft: isKeyPoints ? '4px solid #3182CE' : '1px solid #E2E8F0'
      }}>
        <div className="wireframe-section-label">{section.type.toUpperCase()}</div>

        {/* Box header with icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: 'calc(12px * var(--layout-padding-scale, 1.0))',
          paddingBottom: '10px',
          borderBottom: '2px solid #F3F4F6'
        }}>
          <div style={{
            fontSize: '18px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #3182CE, #ED8936)',
            color: 'white',
            borderRadius: '8px',
            flexShrink: 0
          }}>
            {icon}
          </div>
          {section.title && (
            <h3 style={{
              fontSize: 'calc(13px * var(--layout-h2-scale, 1.0))',
              fontWeight: 'bold',
              color: '#1A202C',
              margin: 0,
              lineHeight: '1.2'
            }}>
              {section.title}
            </h3>
          )}
        </div>

        {/* Content */}
        {section.type === 'list' && Array.isArray(section.content) && (
          <ul className="wireframe-list">
            {section.content.slice(0, 6).map((item, idx) => (
              <li key={idx} className="wireframe-list-item">{item}</li>
            ))}
          </ul>
        )}

        {section.type === 'text' && typeof section.content === 'string' && (
          <p className="wireframe-text">
            {section.content.length > 250 ? `${section.content.substring(0, 250)}...` : section.content}
          </p>
        )}
      </div>
    );
  };

  return (
    <Box className="wireframe-container wireframe-business">
      {/* Template Info Header */}
      <div className="wireframe-template-header">
        <span className="wireframe-template-name">BUSINESS TEMPLATE</span>
        <span className="wireframe-template-description">Professional 2x2 Grid + Metrics</span>
      </div>

      {/* Professional Header */}
      <div className="wireframe-section" style={{
        background: 'linear-gradient(to right, #3182CE, #2C5282)',
        color: 'white',
        padding: 'calc(16px * var(--layout-padding-scale, 1.0))',
        marginBottom: 'calc(16px * var(--layout-section-gap, 1.0))',
        borderBottom: '4px solid #ED8936'
      }}>
        <div className="wireframe-section-label" style={{ color: 'white', borderColor: 'white' }}>
          HEADER
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: 'calc(16px * var(--layout-h2-scale, 1.0))' }}>
            [Brand Logo/Name]
          </div>
          {heroSections.length > 0 && typeof heroSections[0].content === 'object' && 'subheadline' in heroSections[0].content && (
            <div style={{ fontSize: 'calc(11px * var(--layout-body-scale, 1.0))', opacity: 0.9, maxWidth: '300px', textAlign: 'right' }}>
              {heroSections[0].content.subheadline}
            </div>
          )}
        </div>
      </div>

      {/* Executive Summary (Hero) */}
      {heroSections.length > 0 && (
        <div className="wireframe-section" style={{
          background: 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)',
          borderLeft: '6px solid #3182CE',
          marginBottom: 'calc(16px * var(--layout-section-gap, 1.0))'
        }}>
          <div className="wireframe-section-label">EXECUTIVE SUMMARY</div>
          {typeof heroSections[0].content === 'object' && 'headline' in heroSections[0].content ? (
            <div>
              <h1 style={{
                fontSize: 'calc(28px * var(--layout-h1-scale, 1.0))',
                fontWeight: 'bold',
                color: '#1A202C',
                marginBottom: '12px',
                lineHeight: '1.1'
              }}>
                {heroSections[0].content.headline}
              </h1>
              {heroSections[0].content.description && (
                <p style={{
                  fontSize: 'calc(12px * var(--layout-body-scale, 1.0))',
                  color: '#6B7280',
                  lineHeight: '1.4',
                  maxWidth: '700px'
                }}>
                  {heroSections[0].content.description}
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Metrics Dashboard - 4 Column Grid */}
      <div style={{ marginBottom: 'calc(20px * var(--layout-section-gap, 1.0))' }}>
        <div className="wireframe-section" style={{
          background: 'white',
          padding: 'calc(16px * var(--layout-padding-scale, 1.0))',
          borderBottom: '2px solid #E5E7EB'
        }}>
          <div className="wireframe-section-label">METRICS DASHBOARD</div>
          <div className="wireframe-metrics-bar">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="wireframe-metric-card">
                <div className="wireframe-metric-value">99+</div>
                <div className="wireframe-metric-label">Metric {idx}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Content Grid - 2x2 */}
      <div style={{ marginBottom: 'calc(20px * var(--layout-section-gap, 1.0))' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 'calc(20px * var(--layout-padding-scale, 1.0))',
          background: '#FAFAFA',
          padding: 'calc(16px * var(--layout-padding-scale, 1.0))',
          borderRadius: '8px'
        }}>
          {/* Box 1 - Top Left (First List with Key Points styling) */}
          <div>
            <div className="wireframe-column-label">BOX 1: First LIST</div>
            {renderContentBox(box1Section, 1, true)}
          </div>

          {/* Box 2 - Top Right (First Text) */}
          <div>
            <div className="wireframe-column-label">BOX 2: First TEXT</div>
            {renderContentBox(box2Section, 2)}
          </div>

          {/* Box 3 - Bottom Left (Second List) */}
          <div>
            <div className="wireframe-column-label">BOX 3: Second LIST</div>
            {renderContentBox(box3Section, 3)}
          </div>

          {/* Box 4 - Bottom Right (Second Text OR Third List) */}
          <div>
            <div className="wireframe-column-label">
              BOX 4: Second TEXT or Third LIST
            </div>
            {renderContentBox(box4Section, 4)}
          </div>
        </div>
      </div>

      {/* Professional Footer with CTA */}
      {(buttonSections.length > 0 || ctaSections.length > 0) && (
        <div className="wireframe-section" style={{
          background: 'linear-gradient(to right, #2C5282, #3182CE, #2C5282)',
          color: 'white',
          padding: 'calc(16px * var(--layout-padding-scale, 1.0))',
          borderTop: '4px solid #ED8936',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className="wireframe-section-label" style={{ color: 'white', borderColor: 'white' }}>
            FOOTER CTA
          </div>
          <h3 style={{
            fontSize: 'calc(18px * var(--layout-h2-scale, 1.0))',
            fontWeight: 'bold',
            margin: 0
          }}>
            Take the Next Step
          </h3>
          {buttonSections.length > 0 && typeof buttonSections[0].content === 'object' && 'text' in buttonSections[0].content && (
            <button style={{
              background: 'white',
              color: '#3182CE',
              padding: 'calc(12px * var(--layout-padding-scale, 1.0)) calc(24px * var(--layout-padding-scale, 1.0))',
              fontSize: 'calc(11px * var(--layout-body-scale, 1.0))',
              fontWeight: 'bold',
              border: '2px solid white',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              cursor: 'pointer'
            }}>
              {buttonSections[0].content.text}
            </button>
          )}
        </div>
      )}

      {/* Template Grid Visualization */}
      <div className="wireframe-grid-overlay">
        <div className="wireframe-grid-line wireframe-vertical-line" style={{ left: '50%' }} />
      </div>
    </Box>
  );
};
