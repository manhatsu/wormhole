import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Dices } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useUniverseStore } from '../../../stores/universe';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { CelestialBodyDetails } from './CelestialBodyDetails';
import { UniverseControls } from './UniverseControls';
import { EnhancedCosmicPhenomena } from './EnhancedCosmicPhenomena';
import { EnhancedCelestialBody } from './EnhancedCelestialBody';
import { KnowledgeMetrics } from './KnowledgeMetrics';
import { useCameraAnimation } from '../../../hooks/useCameraAnimation';
import { useDragging } from '../../../hooks/useDragging';
import { ConstellationLines } from '../../constellation/components/ConstellationLines';
import { ConstellationBirthEffect } from '../../constellation/components/ConstellationBirthEffect';
import { ConstellationInfoPanel } from '../../constellation/components/ConstellationInfoPanel';
import { ConstellationAtlas } from '../../constellation/components/ConstellationAtlas';
import { useConstellationInteraction } from '../../constellation/hooks/useConstellationInteraction';
import { GalacticCollisionEffect } from '../../galactic-collision/components/GalacticCollisionEffect';

export const UniverseCanvas: React.FC = () => {
  const { 
    setAddingContent, 
    discover, 
    selectedBody, 
    setSelectedBody,
    closeDetailsModal,
    showKnowledgeMetrics,
    cameraPosition,
    setCameraPosition,
    targetPosition,
    setTargetPosition,
    isAnimating,
    setIsAnimating,
    viewMode,
    setViewMode,
    focusOnBody,
    resetView
  } = useUniverseStore();
  const { data: celestialBodies = [], isLoading } = useCelestialBodies();
  
  // Constellation interaction
  const {
    activeConstellationId,
    selectedConstellation,
    showAtlas,
    handleBodyClick: handleConstellationBodyClick,
    handleCenterConstellation,
    handleNavigateToBody,
    handleClosePanel,
    handleOpenAtlas,
    handleCloseAtlas,
    handleNavigateToConstellation,
  } = useConstellationInteraction();
  
  // Use camera animation hook
  const animatedPosition = useCameraAnimation(
    cameraPosition, 
    targetPosition, 
    isAnimating, 
    setIsAnimating
  );
  
  // Use dragging hook
  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useDragging(
    animatedPosition,
    (position) => {
      setCameraPosition(position);
      setTargetPosition(position);
    },
    isAnimating
  );

  // Add global mouse/touch event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      // Change cursor to grabbing
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleBodyClick = (bodyId: string) => {
    // Set focused body when clicking any celestial body
    const { setFocusedBody } = useUniverseStore.getState();
    setFocusedBody(bodyId);
    
    // Also handle constellation interaction
    handleConstellationBodyClick(bodyId, celestialBodies);
  };

  const handleZoomToContent = (contentType: string) => {
    const zones = {
      movie: { x: 0, y: 0, z: 50 },
      book: { x: 110, y: 0, z: 50 },
      album: { x: -110, y: 0, z: 50 },
      game: { x: 0, y: 70, z: 50 },
      studying: { x: 110, y: 70, z: 50 },
      work: { x: -110, y: 70, z: 50 },
      other: { x: 0, y: -70, z: 50 },
    };
    
    const zone = zones[contentType as keyof typeof zones];
    if (zone) {
      setTargetPosition(zone);
      setIsAnimating(true);
      setViewMode('zone');
    }
  };
  // Add wheel zoom support for smoother zooming
  const handleWheel = React.useCallback((e: WheelEvent) => {
    if (isAnimating) return;
    
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.87;
    const currentZ = animatedPosition.z;
    const newZ = Math.max(15, Math.min(200, currentZ * zoomFactor));
    
    if (newZ !== currentZ) {
      setTargetPosition({
        ...animatedPosition,
        z: newZ
      });
      setIsAnimating(true);
    }
  }, [animatedPosition, isAnimating, setTargetPosition, setIsAnimating]);

  // Add wheel event listener
  React.useEffect(() => {
    const canvas = document.querySelector('.universe-canvas');
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div 
      className={`universe-canvas relative w-full h-screen overflow-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Universe Background */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-cosmic-900/30 via-void-950 to-void-950" />
        
        {/* Animated cosmic dust */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-stellar-300 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Universe Content Area */}
      <div 
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="text-cosmic-300 text-lg">Loading your universe...</div>
          </motion.div>
        ) : celestialBodies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-4xl font-light text-white mb-4">
              Your Universe Awaits
            </h2>
            <p className="text-cosmic-300 mb-8 text-lg">
              Add your first piece of knowledge to begin your cosmic journey
            </p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-cosmic-300 text-sm mt-4"
            >
              Use the + button in the bottom-right corner to add content
            </motion.p>
          </motion.div>
        ) : (
          // Render celestial bodies
          <div 
            className="absolute inset-0"
            style={{
              transform: `translate(${-animatedPosition.x * 2}px, ${-animatedPosition.y * 2}px) scale(${100 / animatedPosition.z})`,
              transition: isAnimating ? 'none' : 'transform 0.1s ease-out',
              willChange: isAnimating ? 'transform' : 'auto',
            }}
          >
            {/* Enhanced Cosmic Phenomena (background groupings) */}
            <EnhancedCosmicPhenomena celestialBodies={celestialBodies} />
            
            {/* Constellation Lines */}
            <ConstellationLines activeConstellationId={activeConstellationId} />
            
            {/* Galactic Collision Effects */}
            <GalacticCollisionEffect />
            
            {/* Enhanced Individual Celestial Bodies */}
            {celestialBodies.map((body) => {
              const isInConstellation = activeConstellationId && 
                selectedConstellation?.celestialBodies.includes(body.id);
              
              return (
                <EnhancedCelestialBody
                  key={body.id}
                  body={body}
                  isSelected={selectedBody === body.id}
                  isInConstellation={!!isInConstellation}
                  onClick={() => handleBodyClick(body.id)}
                  scale={1}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Universe Controls */}
      <UniverseControls 
        celestialBodies={celestialBodies}
        onZoomToContent={handleZoomToContent}
        onOpenAtlas={handleOpenAtlas}
      />

      {/* Knowledge Metrics Panel */}
      {showKnowledgeMetrics && (
        <KnowledgeMetrics celestialBodies={celestialBodies} />
      )}

      {/* Premium Portal (subtle) */}
      <motion.div
        className="absolute top-8 left-8"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      >
        <div className="w-4 h-4 bg-gradient-to-r from-stellar-400 to-cosmic-400 rounded-full shadow-lg cursor-pointer" />
      </motion.div>

      {/* Built with Bolt.new Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed bottom-4 right-32 z-20"
      >
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-2 bg-cosmic-900/90 backdrop-blur-sm border border-cosmic-600 rounded-lg hover:border-stellar-400 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-stellar-400 to-cosmic-400 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">⚡</span>
            </div>
            <span className="text-cosmic-200 text-sm font-medium group-hover:text-white transition-colors">
              Built with Bolt.new
            </span>
          </div>
        </a>
      </motion.div>

      {/* Celestial Body Details Modal */}
      {selectedBody && (
        <CelestialBodyDetails
          bodyId={selectedBody}
          onClose={closeDetailsModal}
        />
      )}

      {/* Constellation Info Panel */}
      <ConstellationInfoPanel
        constellation={selectedConstellation}
        onClose={handleClosePanel}
        onCenterConstellation={handleCenterConstellation}
        onNavigateToBody={(bodyId) => handleNavigateToBody(bodyId, celestialBodies)}
      />

      {/* Constellation Atlas */}
      <ConstellationAtlas
        isOpen={showAtlas}
        onClose={handleCloseAtlas}
        onNavigateToConstellation={handleNavigateToConstellation}
      />

      {/* Constellation Birth Effect */}
      <ConstellationBirthEffect />
    </div>
  );
};