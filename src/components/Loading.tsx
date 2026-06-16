import React from 'react';

interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  label = 'Processando...',
  fullScreen = false,
}) => {
  const loaderContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        textAlign: 'center',
      }}
    >
      {/* Decorative math-style wheel spinning */}
      <div
        className="animate-spin-slow"
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: '3px solid rgba(182, 187, 198, 0.1)',
          borderTop: '3px solid var(--color-blue-highlight)',
          borderRight: '3px solid var(--color-silver-light)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--glow-highlight)',
        }}
      >
        {/* Inner static pointer representing statistics pivot */}
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-white)',
          }}
        />
        {/* Probability lines inside loader */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(182, 187, 198, 0.15)',
            transform: 'rotate(45deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(182, 187, 198, 0.15)',
            transform: 'rotate(135deg)',
          }}
        />
      </div>
      
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--color-silver-light)',
            letterSpacing: '0.05em',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--color-bg-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {loaderContent}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        padding: '2rem',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {loaderContent}
    </div>
  );
};
