import React from 'react';

interface ContentCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  hoverEffect?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  children,
  title,
  className = '',
  style,
  hoverEffect = true,
}) => {
  return (
    <div
      className={`${hoverEffect ? 'card-glass' : ''} ${className}`}
      style={{
        background: 'var(--dark-glass-gradient)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: 'var(--border-silver)',
        borderRadius: '12px',
        padding: '1.75rem',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        width: '100%',
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--color-white)',
            marginBottom: '1.25rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(182, 187, 198, 0.1)',
          }}
        >
          {title}
        </h3>
      )}
      <div>{children}</div>
    </div>
  );
};
