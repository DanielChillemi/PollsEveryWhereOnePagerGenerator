/**
 * OnePager Store
 * ===============
 * 
 * Zustand store for managing one-pager state in the Smart Canvas.
 * Handles current one-pager data, loading states, and CRUD operations.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { FrontendOnePager, FrontendElement } from '@/types';

interface OnePagerState {
  // Current one-pager being edited
  currentOnePager: FrontendOnePager | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Undo/Redo stacks
  undoStack: FrontendOnePager[];
  redoStack: FrontendOnePager[];
  
  // Actions
  setOnePager: (onePager: FrontendOnePager) => void;
  updateOnePager: (updates: Partial<FrontendOnePager>) => void;
  updateElement: (elementId: string, updates: Partial<FrontendElement>) => void;
  reorderElements: (newOrder: { id: string; order: number }[]) => void;
  addElement: (element: FrontendElement) => void;
  removeElement: (elementId: string) => void;
  clearOnePager: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Undo/Redo actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  pushToHistory: () => void;
}

export const useOnePagerStore = create<OnePagerState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentOnePager: null,
        isLoading: false,
        error: null,
        undoStack: [],
        redoStack: [],

        // Set entire one-pager
        setOnePager: (onePager) => {
          set({ currentOnePager: onePager, error: null });
        },

        // Update one-pager metadata
        updateOnePager: (updates) =>
          set((state) => {
            if (!state.currentOnePager) return state;
            
            return {
              currentOnePager: {
                ...state.currentOnePager,
                ...updates,
              },
            };
          }),

        // Update specific element
        updateElement: (elementId, updates) =>
          set((state) => {
            if (!state.currentOnePager) return state;
            
            const updatedElements = state.currentOnePager.elements.map((el) =>
              el.id === elementId ? { ...el, ...updates } : el
            );
            
            return {
              currentOnePager: {
                ...state.currentOnePager,
                elements: updatedElements,
              },
            };
          }),

        // Reorder elements
        reorderElements: (newOrder) =>
          set((state) => {
            if (!state.currentOnePager) return state;
            
            const orderMap = new Map(newOrder.map(item => [item.id, item.order]));
            
            const reordered = state.currentOnePager.elements
              .map((el) => ({
                ...el,
                order: orderMap.get(el.id) ?? el.order,
              }))
              .sort((a, b) => a.order - b.order);
            
            return {
              currentOnePager: {
                ...state.currentOnePager,
                elements: reordered,
              },
            };
          }),

        // Add new element
        addElement: (element) =>
          set((state) => {
            if (!state.currentOnePager) return state;
            
            return {
              currentOnePager: {
                ...state.currentOnePager,
                elements: [...state.currentOnePager.elements, element].sort(
                  (a, b) => a.order - b.order
                ),
              },
            };
          }),

        // Remove element
        removeElement: (elementId) =>
          set((state) => {
            if (!state.currentOnePager) return state;
            
            return {
              currentOnePager: {
                ...state.currentOnePager,
                elements: state.currentOnePager.elements.filter(
                  (el) => el.id !== elementId
                ),
              },
            };
          }),

        // Clear current one-pager
        clearOnePager: () =>
          set({
            currentOnePager: null,
            error: null,
            undoStack: [],
            redoStack: [],
          }),

        // Set loading state
        setLoading: (loading) => set({ isLoading: loading }),

        // Set error state
        setError: (error) => set({ error }),

        // Push current state to undo history
        pushToHistory: () =>
          set((state) => {
            if (!state.currentOnePager) return state;
            
            return {
              undoStack: [...state.undoStack, state.currentOnePager],
              redoStack: [], // Clear redo stack when new action is performed
            };
          }),

        // Undo last action
        undo: () =>
          set((state) => {
            if (state.undoStack.length === 0 || !state.currentOnePager) return state;
            
            const previousState = state.undoStack[state.undoStack.length - 1];
            const newUndoStack = state.undoStack.slice(0, -1);
            
            return {
              currentOnePager: previousState,
              undoStack: newUndoStack,
              redoStack: [...state.redoStack, state.currentOnePager],
            };
          }),

        // Redo last undone action
        redo: () =>
          set((state) => {
            if (state.redoStack.length === 0 || !state.currentOnePager) return state;
            
            const nextState = state.redoStack[state.redoStack.length - 1];
            const newRedoStack = state.redoStack.slice(0, -1);
            
            return {
              currentOnePager: nextState,
              undoStack: [...state.undoStack, state.currentOnePager],
              redoStack: newRedoStack,
            };
          }),

        // Check if undo is available
        canUndo: () => get().undoStack.length > 0,

        // Check if redo is available
        canRedo: () => get().redoStack.length > 0,
      }),
      {
        name: 'onepager-storage',
        partialize: (state) => ({
          currentOnePager: state.currentOnePager,
        }),
      }
    ),
    {
      name: 'OnePagerStore',
    }
  )
);
