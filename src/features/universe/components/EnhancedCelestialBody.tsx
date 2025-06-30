import React from 'react';
import { motion } from 'framer-motion';
import { CelestialBody } from '../../../hooks/useCelestialBodies';
import { useUniverseStore } from '../../../stores/universe';

interface EnhancedCelestialBodyProps {
  body: CelestialBody;
  isSelected: boolean;
  isInConstellation: boolean;
  onClick: () => void;
  scale: number;
}

export const EnhancedCelestialBody: React.FC<EnhancedCelestialBodyProps> = ({
  body,
  isSelected,
  isInConstellation,
  onClick,
  scale,
}) => {
  const { selectedBody } = useUniverseStore();
  const { focusedBody } = useUniverseStore();
  const isFocused = focusedBody === body.id;
  
  // Calculate baseSize and brightness at component level for global access
  const baseSize = Math.max(body.visual_attributes.size * 30, 20);
  const brightness = body.visual_attributes.brightness;
  
  const getContentTypeVisualization = () => {
    switch (body.content_type) {
      case 'movie':
        return {
          component: (
            <div className="relative">
              {/* Planet with atmosphere */}
              <div 
                className="rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 relative overflow-hidden"
                style={{ width: baseSize, height: baseSize }}
              >
                {/* Surface details */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-300/20 to-blue-900/40" />
                {/* Atmosphere glow */}
                <div className="absolute -inset-2 bg-blue-400/30 rounded-full blur-md" />
                {/* Movie reel pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white/60 rounded-full" />
                </div>
              </div>
              {/* Orbital rings for high impact */}
              {body.has_impact && (
                <motion.div
                  className="absolute inset-0 border border-blue-300/40 rounded-full"
                  style={{ width: baseSize * 1.5, height: baseSize * 1.5, left: -baseSize * 0.25, top: -baseSize * 0.25 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
          ),
          glow: `0 0 ${baseSize * 0.8}px rgba(59, 130, 246, ${brightness * 0.6})`
        };

      case 'book':
        return {
          component: (
            <div className="relative">
              {/* Star with knowledge emanation */}
              <div 
                className="rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 relative"
                style={{ width: baseSize, height: baseSize }}
              >
                {/* Core brightness */}
                <div className="absolute inset-1 bg-gradient-to-br from-white/80 via-yellow-200/60 to-transparent rounded-full" />
                {/* Knowledge rays */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 bg-gradient-to-r from-yellow-200 to-transparent"
                    style={{
                      height: baseSize * 0.6,
                      left: '50%',
                      top: '50%',
                      transformOrigin: 'bottom',
                      transform: `rotate(${i * 45}deg) translateY(-${baseSize * 0.3}px)`,
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scaleY: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          ),
          glow: `0 0 ${baseSize * 1.2}px rgba(251, 191, 36, ${brightness * 0.8})`
        };

      case 'album':
        return {
          component: (
            <div className="relative">
              {/* Nebula with musical waves */}
              <div 
                className="rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-purple-700 relative overflow-hidden"
                style={{ width: baseSize, height: baseSize }}
              >
                {/* Nebula clouds */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-pink-300/40 via-transparent to-purple-600/40"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                {/* Sound waves */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute border border-pink-300/50 rounded-full"
                    style={{
                      width: baseSize * (1 + i * 0.3),
                      height: baseSize * (1 + i * 0.3),
                      left: -baseSize * i * 0.15,
                      top: -baseSize * i * 0.15,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.2, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          ),
          glow: `0 0 ${baseSize * 1.0}px rgba(236, 72, 153, ${brightness * 0.7})`
        };

      case 'game':
        return {
          component: (
            <div className="relative">
              {/* Crystalline asteroid */}
              <div 
                className="relative"
                style={{ width: baseSize, height: baseSize }}
              >
                {/* Main crystal */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-green-500 to-emerald-800 transform rotate-45 rounded-lg" />
                <div className="absolute inset-1 bg-gradient-to-br from-white/60 via-emerald-200/40 to-transparent transform rotate-45 rounded-lg" />
                
                {/* Crystal facets */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/80 rounded-full"
                    style={{
                      left: `${30 + Math.cos(i * 90 * Math.PI / 180) * 8}%`,
                      top: `${30 + Math.sin(i * 90 * Math.PI / 180) * 8}%`,
                    }}
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          ),
          glow: `0 0 ${baseSize * 0.6}px rgba(34, 197, 94, ${brightness * 0.5})`
        };

      case 'studying':
        return {
          component: (
            <div className="relative">
              {/* Pulsar with knowledge beams */}
              <div 
                className="rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-700 relative"
                style={{ width: baseSize, height: baseSize }}
              >
                {/* Core */}
                <div className="absolute inset-2 bg-gradient-to-br from-white/90 via-cyan-200/70 to-transparent rounded-full" />
                
                {/* Knowledge pulse beams */}
                {Array.from({ length: 2 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-gradient-to-r from-cyan-200 via-cyan-400 to-transparent"
                    style={{
                      width: baseSize * 2,
                      height: 2,
                      left: '50%',
                      top: '50%',
                      transformOrigin: 'left center',
                      transform: `rotate(${i * 180}deg)`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scaleX: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 1,
                    }}
                  />
                ))}
              </div>
            </div>
          ),
          glow: `0 0 ${baseSize * 1.0}px rgba(6, 182, 212, ${brightness * 0.7})`
        };

      case 'work':
        return {
          component: (
            <div className="relative">
              {/* Binary star system */}
              <div className="relative" style={{ width: baseSize, height: baseSize }}>
                {/* Primary star */}
                <div 
                  className="absolute rounded-full bg-gradient-to-br from-orange-300 via-red-500 to-orange-700"
                  style={{ 
                    width: baseSize * 0.7, 
                    height: baseSize * 0.7,
                    left: '15%',
                    top: '15%',
                  }}
                />
                {/* Secondary star */}
                <motion.div 
                  className="absolute rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500"
                  style={{ 
                    width: baseSize * 0.4, 
                    height: baseSize * 0.4,
                  }}
                  animate={{
                    x: [baseSize * 0.6, baseSize * 0.2, baseSize * 0.6],
                    y: [baseSize * 0.6, baseSize * 0.2, baseSize * 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                {/* Energy bridge */}
                <motion.div
                  className="absolute w-0.5 bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300"
                  style={{
                    height: baseSize * 0.3,
                    left: '50%',
                    top: '35%',
                    transformOrigin: 'center',
                  }}
                  animate={{
                    rotate: [0, 360],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 2, repeat: Infinity },
                  }}
                />
              </div>
            </div>
          ),
          glow: `0 0 ${baseSize * 0.8}px rgba(249, 115, 22, ${brightness * 0.6})`
        };

      default:
        return {
          component: (
            <div 
              className="rounded-full bg-gradient-to-br from-gray-400 to-gray-600"
              style={{ width: baseSize, height: baseSize }}
            />
          ),
          glow: `0 0 ${baseSize * 0.5}px rgba(156, 163, 175, ${brightness * 0.4})`
        };
    }
  };

  const visualization = getContentTypeVisualization();

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${50 + (body.position_x * 0.5)}%`,
        top: `${50 + (body.position_y * 0.5)}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ 
        opacity: 0, 
        scale: 0,
        rotateZ: 0,
      }}
      animate={{ 
        opacity: 1, 
        scale: scale,
        rotateZ: 360,
      }}
      transition={{ 
        duration: 1.2,
        delay: Math.random() * 0.5,
        type: "spring",
        stiffness: 120,
        damping: 18,
        rotateZ: {
          duration: 1.8,
          ease: "easeOut"
        }
      }}
      whileHover={{ 
        scale: scale * 1.15,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: scale * 0.95,
        transition: { duration: 0.1, ease: "easeOut" }
      }}
      onClick={onClick}
    >
      <div
        className={`
          transition-all duration-300 relative group
          ${isSelected ? 'ring-4 ring-stellar-400 ring-opacity-60 rounded-full' : ''}
          ${isInConstellation ? 'ring-2 ring-white/40 rounded-full' : ''}
          ${isFocused ? 'ring-4 ring-yellow-300 ring-opacity-80 rounded-full' : ''}
        `}
        style={{
          filter: `drop-shadow(${visualization.glow}) ${isFocused ? 'brightness(2.2) saturate(2) contrast(1.3)' : ''}`,
        }}
      >
        {visualization.component}
        
        {/* Focus Highlight Effect */}
        {isFocused && (
          <>
            {/* Bright pulsing ring */}
            <motion.div
              className="absolute border-4 border-yellow-200 rounded-full"
              style={{
                width: `${baseSize * 2}px`,
                height: `${baseSize * 2}px`,
                left: `-${baseSize * 0.5}px`,
                top: `-${baseSize * 0.5}px`,
              }}
              animate={{
                scale: [1, 2.2, 1],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Secondary pulsing ring */}
            <motion.div
              className="absolute border-2 border-yellow-100 rounded-full"
              style={{
                width: `${baseSize * 1.6}px`,
                height: `${baseSize * 1.6}px`,
                left: `-${baseSize * 0.3}px`,
                top: `-${baseSize * 0.3}px`,
              }}
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.6, 0.1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.3,
                ease: "easeInOut",
              }}
            />
            
            {/* Bright glow effect */}
            <motion.div
              className="absolute bg-yellow-100/30 rounded-full blur-sm"
              style={{
                width: `${baseSize * 1.8}px`,
                height: `${baseSize * 1.8}px`,
                left: `-${baseSize * 0.4}px`,
                top: `-${baseSize * 0.4}px`,
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Sparkle particles around the body */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-yellow-100 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * (baseSize + 20),
                  y: Math.sin(i * 30 * Math.PI / 180) * (baseSize + 20),
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
        
        {/* Singularity effect overlay */}
        {body.is_singularity && (
          <div className="absolute inset-0">
            {/* Event horizon */}
            <motion.div
              className="absolute inset-0 border-2 border-purple-400/70 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            {/* Accretion disk */}
            <motion.div
              className="absolute inset-0 border border-purple-300/50 rounded-full"
              style={{
                width: '150%',
                height: '150%',
                left: '-25%',
                top: '-25%',
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity },
              }}
            />
          </div>
        )}
        
        {/* High impact enhancement */}
        {body.has_impact && !body.is_singularity && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
        
        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 border-2 border-stellar-400 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-cosmic-900/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-cosmic-600 shadow-lg">
          <div className="font-medium">{body.title}</div>
          <div className="text-cosmic-300 capitalize">{body.content_type}</div>
          {body.creator_id && body.creator_id !== 'Unknown Creator' && (
            <div className="text-cosmic-400 text-xs">by {body.creator_id}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};