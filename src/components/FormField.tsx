import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  style,
  ...props
}) => {
  return (
    <div className={`form-field-container ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', marginBottom: '1.25rem', ...style }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-silver-light)',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </label>
      <input
        id={id}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(3, 13, 36, 0.7)',
          border: error ? '1px solid var(--color-error)' : '1px solid rgba(182, 187, 198, 0.25)',
          color: 'var(--color-white)',
          outline: 'none',
          transition: 'all 0.2s ease',
          width: '100%',
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = 'var(--color-blue-highlight)';
            e.target.style.boxShadow = '0 0 10px rgba(18, 61, 132, 0.3)';
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = 'rgba(182, 187, 198, 0.25)';
            e.target.style.boxShadow = 'none';
          }
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-error)', fontWeight: 500, marginTop: '0.1rem' }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)', marginTop: '0.1rem' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
