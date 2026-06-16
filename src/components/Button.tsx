import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'metallic';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    fontWeight: 600,
    padding: '0.85rem 1.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    textAlign: 'center',
    outline: 'none',
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-blue-highlight)',
          color: 'var(--color-white)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 14px rgba(18, 61, 132, 0.4)',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-silver-light)',
          border: '1px solid rgba(182, 187, 198, 0.3)',
        };
      case 'metallic':
        return {
          background: 'var(--metallic-gradient)',
          color: 'var(--color-navy-primary)',
          boxShadow: '0 4px 14px rgba(182, 187, 198, 0.25)',
          fontWeight: 700,
        };
      default:
        return {};
    }
  };

  // Combining inline style definitions for cross-compatibility and flexibility
  const combinedStyles: React.CSSProperties = {
    ...baseStyle,
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button
      className={`btn-interactive ${className}`}
      style={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
};
