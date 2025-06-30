import { useState, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
  z: number;
}

interface DragState {
  isDragging: boolean;
  startPosition: { x: number; y: number };
  startCameraPosition: Position;
}

export const useDragging = (
  cameraPosition: Position,
  onPositionChange: (position: Position) => void,
  isAnimating: boolean
) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    startCameraPosition: { x: 0, y: 0, z: 100 }
  });

  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't start dragging if we're animating or if it's a right click
    if (isAnimating || e.button !== 0) return;

    e.preventDefault();
    
    setDragState({
      isDragging: true,
      startPosition: { x: e.clientX, y: e.clientY },
      startCameraPosition: { ...cameraPosition }
    });
  }, [cameraPosition, isAnimating]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentDragState = dragStateRef.current;
    if (!currentDragState.isDragging) return;

    e.preventDefault();

    const deltaX = e.clientX - currentDragState.startPosition.x;
    const deltaY = e.clientY - currentDragState.startPosition.y;

    // Enhanced movement scaling with smoother response
    const zoomLevel = currentDragState.startCameraPosition.z;
    const movementScale = Math.pow(zoomLevel / 100, 0.8); // Smoother scaling curve
    
    const newPosition = {
      x: currentDragState.startCameraPosition.x - (deltaX * movementScale * 0.6),
      y: currentDragState.startCameraPosition.y - (deltaY * movementScale * 0.6),
      z: currentDragState.startCameraPosition.z
    };

    onPositionChange(newPosition);
  }, [onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  }, []);

  // Touch events for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating || e.touches.length !== 1) return;

    e.preventDefault();
    
    const touch = e.touches[0];
    setDragState({
      isDragging: true,
      startPosition: { x: touch.clientX, y: touch.clientY },
      startCameraPosition: { ...cameraPosition }
    });
  }, [cameraPosition, isAnimating]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const currentDragState = dragStateRef.current;
    if (!currentDragState.isDragging || e.touches.length !== 1) return;

    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - currentDragState.startPosition.x;
    const deltaY = touch.clientY - currentDragState.startPosition.y;

    const movementScale = currentDragState.startCameraPosition.z / 100;
    
    const newPosition = {
      x: currentDragState.startCameraPosition.x - (deltaX * movementScale * 0.5),
      y: currentDragState.startCameraPosition.y - (deltaY * movementScale * 0.5),
      z: currentDragState.startCameraPosition.z
    };

    onPositionChange(newPosition);
  }, [onPositionChange]);

  const handleTouchEnd = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  }, []);

  return {
    isDragging: dragState.isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};