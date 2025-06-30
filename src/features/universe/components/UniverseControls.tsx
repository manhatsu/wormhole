import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Dices, Home, Search, Filter, ZoomIn, ZoomOut, Telescope, BarChart3, EyeOff, LogOut, Share2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useUniverseStore } from '../../../stores/universe';
import { useAuthStore } from '../../../stores/auth';
import { CelestialBody } from '../../../hooks/useCelestialBodies';
import { DiscoveryModal } from './DiscoveryModal';
import { ShareGalaxyModal } from './ShareGalaxyModal';

interface UniverseControlsProps {
  celestialBodies: CelestialBody[];
  onZoomToContent: (contentType: string) => void;
  onOpenAtlas: () => void;
}

export const UniverseControls: React.FC<UniverseControlsProps> = ({
  celestialBodies,
  onZoomToContent,
  onOpenAtlas,
}) => {
  const { 
    setAddingContent, 
    showKnowledgeMetrics,
    setShowKnowledgeMetrics,
    targetPosition,
    setCameraPosition,
    setTargetPosition,
    setIsAnimating,
    resetView,
    viewMode
  } = useUniverseStore();
  const { signOut } = useAuthStore();
  
  const [showDiscovery, setShowDiscovery] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);

  const contentTypeCounts = celestialBodies.reduce((acc, body) => {
    acc[body.content_type] = (acc[body.content_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleZoomIn = () => {
    setCameraPosition(targetPosition); // Sync positions
    const currentZ = targetPosition.z;
    const newZ = Math.max(currentZ * 0.7, 15);
    
    // Smooth zoom with momentum-based scaling
    setTargetPosition({
      ...targetPosition,
      z: newZ
    });
    setIsAnimating(true);
  };

  const handleZoomOut = () => {
    setCameraPosition(targetPosition); // Sync positions
    const currentZ = targetPosition.z;
    const newZ = Math.min(currentZ * 1.4, 200);
    
    // Smooth zoom with momentum-based scaling
    setTargetPosition({
      ...targetPosition,
      z: newZ
    });
    setIsAnimating(true);
  };

  return (
    <>
      {/* Main Action Buttons - Bottom Right */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-30">
        {/* Constellation Atlas Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="stellar"
            size="lg"
            onClick={onOpenAtlas}
            className="w-16 h-16 rounded-full p-0 shadow-2xl border-2 border-stellar-300"
            title="Open Constellation Atlas"
          >
            <Telescope className="w-8 h-8" />
          </Button>
        </motion.div>

        {/* Share Galaxy Button */}
        {celestialBodies.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="stellar"
              size="lg"
              onClick={() => setShowShareModal(true)}
              className="w-16 h-16 rounded-full p-0 shadow-2xl border-2 border-stellar-300"
              title="Share your galaxy"
            >
              <Share2 className="w-8 h-8" />
            </Button>
          </motion.div>
        )}

        {/* Discover Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="stellar"
            size="lg"
            onClick={() => setShowDiscovery(true)}
            className="w-16 h-16 rounded-full p-0 shadow-2xl border-2 border-stellar-300"
            title="Discover your universe"
          >
            <Dices className="w-8 h-8" />
          </Button>
        </motion.div>

        {/* Add Content Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="cosmic"
            size="lg"
            onClick={() => setAddingContent(true)}
            className="w-16 h-16 rounded-full p-0 shadow-2xl border-2 border-cosmic-300"
            title="Add content to universe"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </motion.div>
      </div>

      {/* Navigation Controls - Bottom Left */}
      <div className="fixed bottom-8 left-8 flex flex-col gap-3 z-30">
        {/* Zoom Controls */}
        <div className="flex flex-col gap-2">
          <Button
            variant="stellar"
            size="sm"
            onClick={handleZoomIn}
            className="w-12 h-12 rounded-full p-0"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button
            variant="stellar"
            size="sm"
            onClick={handleZoomOut}
            className="w-12 h-12 rounded-full p-0"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          <Button
            variant="stellar"
            size="sm"
            onClick={resetView}
            className="w-12 h-12 rounded-full p-0"
            title="Reset View"
          >
            <Home className="w-5 h-5" />
          </Button>
          
          {/* Toggle Knowledge Metrics */}
          <Button
            variant={showKnowledgeMetrics ? "cosmic" : "stellar"}
            size="sm"
            onClick={() => setShowKnowledgeMetrics(!showKnowledgeMetrics)}
            className="w-12 h-12 rounded-full p-0"
            title={showKnowledgeMetrics ? "Hide Knowledge Metrics" : "Show Knowledge Metrics"}
          >
            {showKnowledgeMetrics ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <BarChart3 className="w-5 h-5" />
            )}
          </Button>
          
          {/* Logout Button */}
          <Button
            variant="stellar"
            size="sm"
            onClick={signOut}
            className="w-12 h-12 rounded-full p-0 border-2 border-red-400/50 hover:border-red-400 hover:bg-red-900/30"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-red-400" />
          </Button>
        </div>
      </div>

      {/* Content Type Navigation - Top Right */}
      {celestialBodies.length > 0 && (
        <div className="fixed top-8 right-8 z-30">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cosmic-900/80 backdrop-blur-lg border border-cosmic-700 rounded-xl p-4 shadow-2xl"
          >
            <h3 className="text-white font-medium mb-3 text-sm">Navigate Universe</h3>
            <div className="space-y-2">
              {Object.entries(contentTypeCounts).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => onZoomToContent(type)}
                  className={`
                    flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors
                    ${viewMode === 'zone' ? 'text-stellar-200 bg-cosmic-800' : 'text-cosmic-200 hover:text-white hover:bg-cosmic-800'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {type === 'movie' ? '🎬' : 
                       type === 'book' ? '📚' : 
                       type === 'album' ? '🎵' : 
                       type === 'game' ? '🎮' : 
                       type === 'studying' ? '🎓' : 
                       type === 'work' ? '💼' : '⭐'}
                    </span>
                    <span className="capitalize">{type}s</span>
                  </div>
                  <span className="text-cosmic-400 text-xs">{count}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Universe Stats - Top Left */}
      {/* Removed - now handled by KnowledgeMetrics component */}
      
      {/* Discovery Modal */}
      <DiscoveryModal 
        isOpen={showDiscovery}
        onClose={() => setShowDiscovery(false)}
      />
      
      {/* Share Galaxy Modal */}
      <ShareGalaxyModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
};