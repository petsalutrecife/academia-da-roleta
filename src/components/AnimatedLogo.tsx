import React, { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  size?: string | number; // e.g. '220px' or 220
  className?: string;
  spinDuration?: number; // in seconds
  introMode?: boolean; // if true, uses splash-screen styles/animations
  showAnimation?: boolean; // if false, disables rotation
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size,
  className = '',
  spinDuration = 6,
  introMode = false,
  showAnimation = true,
}) => {
  // transformOrigin is the center of the wheel within imagem2's full canvas
  // imagem2 is pre-positioned to match imagem1 at the same canvas size
  const [isAdjustMode, setIsAdjustMode] = useState(false);

  useEffect(() => {
    // Preload images
    const img1 = new Image();
    img1.src = '/imagem1.png';
    const img2 = new Image();
    img2.src = '/imagem2.png';

    // Check if adjustment mode is active in query string
    if (window.location.search.includes('adjust=true')) {
      setIsAdjustMode(true);
    }
  }, []);

  // No keyboard controls needed – imagem2 is pre-positioned at canvas level

  const widthStyle = size ? (typeof size === 'number' ? `${size}px` : size) : undefined;

  // Animation inline style if animating
  const spinStyle: React.CSSProperties = showAnimation
    ? {
        animationName: 'rouletteSpin',
        animationDuration: `${spinDuration}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        willChange: 'transform',
      }
    : {};

  return (
    <div
      className={`animated-logo-container ${className} ${introMode ? 'intro-logo-container' : ''}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: widthStyle || undefined,
        lineHeight: 0,
      }}
    >
      {/* Imagem 1: Estática e Principal */}
      <img
        src="/imagem1.png"
        alt="Academia da Roleta"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />

      {/* Imagem 2: Sobreposta e Animada — canvas pré-alinhado com imagem1 */}
      <img
        src="/imagem2.png"
        alt=""
        aria-hidden="true"
        className="animated-logo-wheel"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          // transformOrigin = centro exato da roda calculado por análise de pixel
          // BBox: 699,1710 -> 1416,2432 | Centro: 1057.5px, 2071px
          // Canvas: 3375 x 4219 => 31.33% x 49.09%
          transformOrigin: '31.33% 49.09%',
          objectFit: 'contain',
          pointerEvents: 'none',
          ...spinStyle,
        }}
      />

      {/* Debug overlay — only shown when ?adjust=true */}
      {isAdjustMode && (
        <div
          className="no-print"
          style={{
            position: 'absolute',
            top: '-28px',
            left: 0,
            background: 'rgba(3, 13, 36, 0.95)',
            border: '1px solid var(--color-blue-highlight)',
            borderRadius: '6px',
            padding: '4px 8px',
            color: '#fff',
            fontSize: '10px',
            fontFamily: 'monospace',
            zIndex: 99999,
            whiteSpace: 'nowrap',
            lineHeight: '1.2',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          }}
        >
          imagem2 canvas overlay — transformOrigin: 29% 48%
        </div>
      )}
    </div>
  );
};
