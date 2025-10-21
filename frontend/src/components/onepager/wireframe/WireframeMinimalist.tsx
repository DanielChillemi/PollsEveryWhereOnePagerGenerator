/**
 * WireframeMinimalist Component
 * =============================
 * Template-specific wireframe preview matching the "minimalist" PDF template layout.
 *
 * Layout Structure:
 * - Hero section (full width)
 * - 2-column grid (1fr 1fr):
 *   - Left: First 2 LIST sections
 *   - Right: First 2 TEXT sections + 3rd LIST if exists
 * - CTA footer (full width)
 *
 * Mirrors: backend/templates/pdf/onepager_minimalist.html
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import type { OnePager, ContentSection } from '../../../types/onepager';
import './wireframe-common.css';

interface WireframeMinimalistProps {
  onepager: OnePager;
}

export const WireframeMinimalist: React.FC<WireframeMinimalistProps> = ({ onepager }) => {
  const { content } = onepager;

  // Filter sections by type (mirrors Jinja2 logic in PDF template)
  const heroSections = content.sections.filter(s => s.type === 'hero');
  const listSections = content.sections.filter(s => s.type === 'list');
  const textSections = content.sections.filter(s => s.type === 'text');
  const ctaSections = content.sections.filter(s => s.type === 'cta');

  // Section distribution logic (matches onepager_minimalist.html)
  const leftColumnLists = listSections.slice(0, 2);  // First 2 lists
  const rightColumnTexts = textSections.slice(0, 2); // First 2 texts
  const rightColumnList = listSections.slice(2, 3);  // 3rd list if exists

  /**
   * Render a section with wireframe styling
   */
  const renderSection = (section: ContentSection) => {
    const sectionContent = typeof section.content === 'string'
      ? section.content
      : JSON.stringify(section.content);

    return (
      <div key={section.id} className="wireframe-section">
        <div className="wireframe-section-label">{section.type.toUpperCase()}</div>

        {section.title && (
          <h3 className="wireframe-section-title">{section.title}</h3>
        )}

        {/* Render content based on type */}
        {section.type === 'hero' && typeof section.content === 'object' && 'headline' in section.content && (
          <div className="wireframe-hero-content">
            <h1 className="wireframe-headline">{section.content.headline}</h1>
            {section.content.subheadline && (
              <p className="wireframe-subheadline">{section.content.subheadline}</p>
            )}
            {section.content.description && (
              <p className="wireframe-description">{section.content.description}</p>
            )}
          </div>
        )}

        {section.type === 'list' && Array.isArray(section.content) && (
          <ul className="wireframe-list">
            {section.content.map((item, idx) => (
              <li key={idx} className="wireframe-list-item">{item}</li>
            ))}
          </ul>
        )}

        {section.type === 'text' && typeof section.content === 'string' && (
          <p className="wireframe-text">{section.content}</p>
        )}

        {section.type === 'cta' && typeof section.content === 'object' && 'text' in section.content && (
          <div className="wireframe-cta-content">
            <button className="wireframe-cta-button">
              {section.content.text}
            </button>
            {section.content.url && (
              <span className="wireframe-cta-url">{section.content.url}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Box className="wireframe-container wireframe-minimalist">
      {/* Template Info Header */}
      <div className="wireframe-template-header">
        <span className="wireframe-template-name">MINIMALIST TEMPLATE</span>
        <span className="wireframe-template-description">2-Column Equal Layout</span>
      </div>

      {/* Hero Section - Full Width */}
      {heroSections.length > 0 && (
        <div className="wireframe-hero-section">
          {renderSection(heroSections[0])}
        </div>
      )}

      {/* Main Content - 2 Column Grid */}
      <div className="wireframe-two-column-grid">
        {/* Left Column - List Sections */}
        <div className="wireframe-column wireframe-left-column">
          <div className="wireframe-column-label">LEFT COLUMN</div>
          {leftColumnLists.map(section => renderSection(section))}

          {/* Show placeholder if no content */}
          {leftColumnLists.length === 0 && (
            <div className="wireframe-placeholder">
              No list sections to display
            </div>
          )}
        </div>

        {/* Right Column - Text Sections + 3rd List */}
        <div className="wireframe-column wireframe-right-column">
          <div className="wireframe-column-label">RIGHT COLUMN</div>
          {rightColumnTexts.map(section => renderSection(section))}
          {rightColumnList.map(section => renderSection(section))}

          {/* Show placeholder if no content */}
          {rightColumnTexts.length === 0 && rightColumnList.length === 0 && (
            <div className="wireframe-placeholder">
              No text sections to display
            </div>
          )}
        </div>
      </div>

      {/* CTA Footer - Full Width */}
      {ctaSections.length > 0 && (
        <div className="wireframe-cta-section">
          {renderSection(ctaSections[0])}
        </div>
      )}

      {/* Template Grid Visualization */}
      <div className="wireframe-grid-overlay">
        <div className="wireframe-grid-line wireframe-vertical-line" style={{ left: '50%' }} />
      </div>
    </Box>
  );
};
