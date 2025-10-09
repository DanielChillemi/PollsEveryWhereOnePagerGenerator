/**
 * Canvas Store
 * =============
 * 
 * Zustand store for managing Smart Canvas UI state.
 * Handles canvas mode, element selection, zoom, and editing state.
 * This is ephemeral state (not persisted) as it's purely UI-related.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CanvasMode } from '@/types';

interface CanvasState {
  // Canvas display mode
  mode: CanvasMode;
  
  // Element selection
  selectedElementId: string | null;
  hoveredElementId: string | null;
  
  // Editing state
  isEditing: boolean;
  editingElementId: string | null;
  
  // Zoom level (0.5 to 2.0)
  zoom: number;
  
  // Canvas view settings
  showGrid: boolean;
  showGuides: boolean;
  
  // Actions
  setMode: (mode: CanvasMode) => void;
  toggleMode: () => void;
  selectElement: (elementId: string | null) => void;
  setHoveredElement: (elementId: string | null) => void;
  startEditing: (elementId: string) => void;
  stopEditing: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleGrid: () => void;
  toggleGuides: () => void;
  reset: () => void;
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.1;

export const useCanvasStore = create<CanvasState>()(
  devtools(
    (set, get) => ({
      // Initial state
      mode: 'wireframe',
      selectedElementId: null,
      hoveredElementId: null,
      isEditing: false,
      editingElementId: null,
      zoom: 1.0,
      showGrid: false,
      showGuides: false,

      // Set canvas mode (wireframe | styled)
      setMode: (mode) => {
        set({ mode, isEditing: false, editingElementId: null });
      },

      // Toggle between wireframe and styled modes
      toggleMode: () => {
        const currentMode = get().mode;
        set({
          mode: currentMode === 'wireframe' ? 'styled' : 'wireframe',
          isEditing: false,
          editingElementId: null,
        });
      },

      // Select an element (highlights it)
      selectElement: (elementId) => {
        set({
          selectedElementId: elementId,
          isEditing: false,
          editingElementId: null,
        });
      },

      // Set hovered element (for hover effects)
      setHoveredElement: (elementId) => {
        set({ hoveredElementId: elementId });
      },

      // Start editing an element (makes content editable)
      startEditing: (elementId) => {
        set({
          editingElementId: elementId,
          selectedElementId: elementId,
          isEditing: true,
        });
      },

      // Stop editing
      stopEditing: () => {
        set({
          isEditing: false,
          editingElementId: null,
        });
      },

      // Set zoom level (clamped between min and max)
      setZoom: (zoom) => {
        const clampedZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom));
        set({ zoom: clampedZoom });
      },

      // Zoom in by one step
      zoomIn: () => {
        const currentZoom = get().zoom;
        const newZoom = Math.min(ZOOM_MAX, currentZoom + ZOOM_STEP);
        set({ zoom: newZoom });
      },

      // Zoom out by one step
      zoomOut: () => {
        const currentZoom = get().zoom;
        const newZoom = Math.max(ZOOM_MIN, currentZoom - ZOOM_STEP);
        set({ zoom: newZoom });
      },

      // Reset zoom to 100%
      resetZoom: () => {
        set({ zoom: 1.0 });
      },

      // Toggle grid display
      toggleGrid: () => {
        set((state) => ({ showGrid: !state.showGrid }));
      },

      // Toggle guides display
      toggleGuides: () => {
        set((state) => ({ showGuides: !state.showGuides }));
      },

      // Reset canvas to default state
      reset: () => {
        set({
          mode: 'wireframe',
          selectedElementId: null,
          hoveredElementId: null,
          isEditing: false,
          editingElementId: null,
          zoom: 1.0,
          showGrid: false,
          showGuides: false,
        });
      },
    }),
    {
      name: 'CanvasStore',
    }
  )
);

// Selector hooks for common use cases
export const useCanvasMode = () => useCanvasStore((state) => state.mode);
export const useSelectedElement = () => useCanvasStore((state) => state.selectedElementId);
export const useIsEditing = () => useCanvasStore((state) => state.isEditing);
export const useZoom = () => useCanvasStore((state) => state.zoom);
