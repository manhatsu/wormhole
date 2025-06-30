import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
  z: number;
}

export const useCameraAnimation = (
  currentPosition: Position,
  targetPosition: Position,
  isAnimating: boolean,
  setIsAnimating: (animating: boolean) => void
) => {
  const [animatedPosition, setAnimatedPosition] = useState(currentPosition);

  useEffect(() => {
    if (!isAnimating) {
      setAnimatedPosition(currentPosition);
      return;
    }

    // Start animation
    const startTime = Date.now();
    const duration = 1200; // Slightly faster for more responsive feel
    const startPosition = { ...animatedPosition };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Enhanced easing function for smoother zoom transitions
      const easeInOutQuart = progress < 0.5
        ? 8 * progress * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      // Apply different easing for different axes for more natural movement
      const xyEasing = easeInOutQuart;
      const zEasing = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2; // Smoother zoom easing

      const newPosition = {
        x: startPosition.x + (targetPosition.x - startPosition.x) * xyEasing,
        y: startPosition.y + (targetPosition.y - startPosition.y) * xyEasing,
        z: startPosition.z + (targetPosition.z - startPosition.z) * zEasing,
      };
      setAnimatedPosition(newPosition);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        setAnimatedPosition(targetPosition);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [targetPosition, isAnimating]);

  return animatedPosition;
};