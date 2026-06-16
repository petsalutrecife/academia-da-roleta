import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
  style?: React.CSSProperties;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  label,
  style,
}) => {
  const percentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  return (
    <div style={{ width: '100%', marginBottom: '1.5rem', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        {label && (
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-silver-light)', fontFamily: 'var(--font-title)' }}>
            {label}
          </span>
        )}
        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-silver-medium)', fontFamily: 'var(--font-body)' }}>
          Passo {currentStep} de {totalSteps} ({Math.round(percentage)}%)
        </span>
      </div>
      
      {/* Outer track */}
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'rgba(3, 13, 36, 0.6)',
          borderRadius: '4px',
          border: '1px solid rgba(182, 187, 198, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Fill bar */}
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: 'var(--color-blue-highlight)',
            background: 'linear-gradient(90deg, var(--color-blue-deep) 0%, var(--color-blue-highlight) 100%)',
            borderRadius: '4px',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 0 10px rgba(18, 61, 132, 0.5)',
          }}
        />
      </div>
    </div>
  );
};
