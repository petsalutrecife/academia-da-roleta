import React from 'react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: 'rgba(7, 26, 68, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(182, 187, 198, 0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '72px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--color-silver-light)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'none',
          }}
          className="md-inline-block" // Note: we'll handle responsive text visibility in CSS if needed, but a nice simple layout is clean
        >
          Diagnóstico C.G.E.
        </span>
      </div>
    </header>
  );
};
