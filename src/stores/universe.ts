import { create } from 'zustand';
import type { CelestialBody } from '../hooks/useCelestialBodies';

interface UniverseState {
  isAddingContent: boolean;
  selectedBody: string | null;
  focusedBody: string | null; // Separate state for focused (bright) body
  showKnowledgeMetrics: boolean;
  cameraPosition: { x: number; y: number; z: number };
  targetPosition: { x: number; y: number; z: number };
  isAnimating: boolean;
  viewMode: 'overview' | 'focused' | 'zone';
  searchQuery: string;
  setAddingContent: (adding: boolean) => void;
  setSelectedBody: (bodyId: string | null) => void;
  setFocusedBody: (bodyId: string | null) => void;
  setShowKnowledgeMetrics: (show: boolean) => void;
  setCameraPosition: (position: { x: number; y: number; z: number }) => void;
  setTargetPosition: (target: { x: number; y: number; z: number }) => void;
  setIsAnimating: (animating: boolean) => void;
  setViewMode: (mode: 'overview' | 'focused' | 'zone') => void;
  setSearchQuery: (query: string) => void;
  simpleFocusOnBody: (bodyId: string) => void;
  focusOnBody: (bodyId: string, bodies: CelestialBody[]) => void;
  resetView: () => void;
  discover: () => void;
   closeDetailsModal: () => void;
}

export const useUniverseStore = create<UniverseState>((set, get) => ({
  isAddingContent: false,
  selectedBody: null,
  focusedBody: null,
  showKnowledgeMetrics: true,
  cameraPosition: { x: 0, y: 0, z: 100 },
  targetPosition: { x: 0, y: 0, z: 100 },
  isAnimating: false,
  viewMode: 'overview',
  searchQuery: '',
  setAddingContent: (adding) => set({ isAddingContent: adding }),
  setSelectedBody: (bodyId) => set({ selectedBody: bodyId }),
  setFocusedBody: (bodyId) => set({ focusedBody: bodyId }),
  setShowKnowledgeMetrics: (show) => set({ showKnowledgeMetrics: show }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setTargetPosition: (target) => set({ targetPosition: target }),
  setIsAnimating: (animating) => set({ isAnimating: animating }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  simpleFocusOnBody: (bodyId) => {
    // Simply set the focused body for brightness effect
    set({ focusedBody: bodyId });
  },
  focusOnBody: (bodyId, bodies) => {
    const body = bodies.find(b => b.id === bodyId);
    if (!body) return;
    
    const state = get();
    
    // Calculate smooth zoom level based on current position
    const currentZ = state.targetPosition.z;
    const targetZ = currentZ > 50 ? 25 : Math.max(20, currentZ * 0.6);
    
    set({
      targetPosition: {
        x: body.position_x,
        y: body.position_y,
        z: targetZ
      },
      isAnimating: true,
      viewMode: 'focused',
      selectedBody: bodyId,
      focusedBody: bodyId
    });
  },
  resetView: () => {
    const state = get();
    
    // Smooth transition back to overview
    const currentPos = state.targetPosition;
    const targetZ = currentPos.z < 80 ? 100 : Math.min(120, currentPos.z * 1.2);
    
    set({
      cameraPosition: state.targetPosition, // Sync current position
      targetPosition: { x: 0, y: 0, z: targetZ },
      selectedBody: null,
      focusedBody: null,
      viewMode: 'overview',
      isAnimating: true
    });
  },
  discover: () => {
    // This will be handled by the discovery hook
    console.log('Discovery triggered from store');
  },
  closeDetailsModal: () => {
    set({ selectedBody: null });
  }
}
)
)