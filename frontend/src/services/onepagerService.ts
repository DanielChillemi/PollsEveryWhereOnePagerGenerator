/**
 * OnePager API Service
 *
 * Handles all OnePager CRUD operations and PDF export.
 * Follows the same pattern as brandKitService.ts
 */

import axios from 'axios';
import type {
  OnePager,
  OnePagerSummary,
  OnePagerCreateData,
  OnePagerIterateData,
  OnePagerUpdateData,
  PDFFormat,
} from '../types/onepager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const onepagerService = {
  /**
   * Create new OnePager with AI generation
   * Calls backend which triggers OpenAI GPT-4 to generate initial wireframe
   */
  async create(data: OnePagerCreateData, token: string): Promise<OnePager> {
    const response = await axios.post(`${API_BASE_URL}/api/v1/onepagers`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Transform MongoDB _id to frontend id convention
    return {
      ...response.data,
      id: response.data._id || response.data.id,
    };
  },

  /**
   * Get all user's OnePagers (summary view for list page)
   * Supports pagination and status filtering
   */
  async getAll(
    token: string,
    skip = 0,
    limit = 20,
    status?: string
  ): Promise<OnePagerSummary[]> {
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await axios.get(`${API_BASE_URL}/api/v1/onepagers?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Transform array of summaries
    return response.data.map((item: any) => ({
      ...item,
      id: item._id || item.id,
    }));
  },

  /**
   * Get single OnePager by ID (full details with content)
   * Used in detail/edit page
   */
  async getById(id: string, token: string): Promise<OnePager> {
    const response = await axios.get(`${API_BASE_URL}/api/v1/onepagers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...response.data,
      id: response.data._id || response.data.id,
    };
  },

  /**
   * Update OnePager metadata (title, status, style overrides)
   * Does NOT trigger AI generation
   */
  async update(
    id: string,
    data: OnePagerUpdateData,
    token: string
  ): Promise<OnePager> {
    const response = await axios.put(`${API_BASE_URL}/api/v1/onepagers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      ...response.data,
      id: response.data._id || response.data.id,
    };
  },

  /**
   * AI iterative refinement
   * Sends user feedback to backend which calls OpenAI to refine content
   * Creates version snapshot before applying changes
   */
  async iterate(
    id: string,
    data: OnePagerIterateData,
    token: string
  ): Promise<OnePager> {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/onepagers/${id}/iterate`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      ...response.data,
      id: response.data._id || response.data.id,
    };
  },

  /**
   * Delete OnePager
   * Hard delete from database
   */
  async delete(id: string, token: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/v1/onepagers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Export OnePager to PDF
   * Uses in-house Playwright-based PDF engine
   * Returns binary Blob for download
   */
  async exportPDF(id: string, format: PDFFormat, token: string): Promise<Blob> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/onepagers/${id}/export/pdf?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important: Get binary data
      }
    );

    return response.data;
  },
};
