import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastMessageProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        backgroundColor: 'var(--color-bg-dark)',
        background: 'linear-gradient(135deg, #071A44 0%, #030D24 100%)',
        border: isSuccess ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: isSuccess
          ? '0 10px 25px rgba(16, 185, 129, 0.15)'
          : '0 10px 25px rgba(239, 68, 68, 0.15)',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--color-white)',
        fontSize: '0.9rem',
        maxWidth: '350px',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {isSuccess ? (
          <CheckCircle size={18} color="#10B981" />
        ) : (
          <AlertCircle size={18} color="#EF4444" />
        )}
      </div>
      <span style={{ fontWeight: 500, flexGrow: 1, color: 'var(--color-silver-light)' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-silver-dark)',
          cursor: 'pointer',
          padding: '0.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
