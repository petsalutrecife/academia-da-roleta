import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface InfoBannerProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  style?: React.CSSProperties;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  type = 'info',
  message,
  title,
  style,
}) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34D399',
          icon: <CheckCircle size={20} color="#10B981" />,
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#FBBF24',
          icon: <AlertTriangle size={20} color="#F59E0B" />,
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#FCA5A5',
          icon: <AlertCircle size={20} color="#EF4444" />,
        };
      case 'info':
      default:
        return {
          bg: 'rgba(18, 61, 132, 0.15)',
          border: '1px solid rgba(18, 61, 132, 0.3)',
          color: 'var(--color-silver-light)',
          icon: <Info size={20} color="#3B82F6" />,
        };
    }
  };

  const currentColors = getColors();

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.85rem',
        padding: '1rem 1.25rem',
        borderRadius: '10px',
        backgroundColor: currentColors.bg,
        border: currentColors.border,
        color: currentColors.color,
        fontSize: '0.9rem',
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: '1.25rem',
        ...style,
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>{currentColors.icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {title && (
          <span
            style={{
              fontWeight: 700,
              fontFamily: 'var(--font-title)',
              color: 'var(--color-white)',
              fontSize: '0.95rem',
            }}
          >
            {title}
          </span>
        )}
        <span style={{ color: 'var(--color-silver-medium)', lineHeight: 1.5 }}>{message}</span>
      </div>
    </div>
  );
};
