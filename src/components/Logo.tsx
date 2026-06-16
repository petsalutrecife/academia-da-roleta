import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const dimensions = {
    sm: { height: 32, iconSize: 32 },
    md: { height: 48, iconSize: 48 },
    lg: { height: 80, iconSize: 80 },
  };

  const selected = dimensions[size];

  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* SVG Icon representing a sophisticated educational probability wheel */}
      <svg
        width={selected.iconSize}
        height={selected.iconSize}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* Metallic silver gradient */}
          <linearGradient id="metallicSilver" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="50%" stopColor="#D7DAE2" />
            <stop offset="100%" stopColor="#B6BBC6" />
          </linearGradient>
          {/* Deep Navy/Blue gradient */}
          <linearGradient id="blueGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#123D84" />
            <stop offset="60%" stopColor="#0A2863" />
            <stop offset="100%" stopColor="#071A44" />
          </linearGradient>
          {/* Outer glow shadow */}
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#123D84" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer metallic ring */}
        <circle cx="60" cy="60" r="54" stroke="url(#metallicSilver)" strokeWidth="3" filter="url(#glow)" />
        
        {/* Inner deep blue circle */}
        <circle cx="60" cy="60" r="48" fill="url(#blueGradient)" />

        {/* Wheel lines representing statistical subdivisions/probabilities */}
        <g stroke="url(#metallicSilver)" strokeWidth="1" opacity="0.3">
          <line x1="60" y1="12" x2="60" y2="108" />
          <line x1="12" y1="60" x2="108" y2="60" />
          <line x1="26" y1="26" x2="94" y2="94" />
          <line x1="26" y1="94" x2="94" y2="26" />
        </g>

        {/* Concentric inner rings */}
        <circle cx="60" cy="60" r="32" stroke="url(#metallicSilver)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <circle cx="60" cy="60" r="22" stroke="url(#metallicSilver)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="12" fill="url(#metallicSilver)" />

        {/* Center dot/star symbolizing accuracy/probability center */}
        <path d="M60 55L61.5 58.5L65 60L61.5 61.5L60 65L58.5 61.5L55 60L58.5 58.5Z" fill="#071A44" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: size === 'sm' ? '0.9rem' : size === 'md' ? '1.2rem' : '1.75rem',
              fontWeight: 800,
              color: 'var(--color-white)',
              lineHeight: 1.1,
              letterSpacing: '0.05em',
            }}
          >
            ACADEMIA
          </span>
          <span
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: size === 'sm' ? '0.65rem' : size === 'md' ? '0.8rem' : '1.1rem',
              fontWeight: 600,
              color: 'var(--color-silver-medium)',
              lineHeight: 1,
              letterSpacing: '0.3em',
            }}
          >
            DA ROLETA
          </span>
        </div>
      )}
    </div>
  );
};
