import React from 'react';
import { Logo } from './Logo';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

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

        {/* Minimalist link for testing/admin */}
        {!isAdminPage && (
          <Link
            to="/admin/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-silver-medium)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid rgba(182, 187, 198, 0.15)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--color-white)';
              e.currentTarget.style.borderColor = 'rgba(182, 187, 198, 0.35)';
              e.currentTarget.style.backgroundColor = 'rgba(18, 61, 132, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--color-silver-medium)';
              e.currentTarget.style.borderColor = 'rgba(182, 187, 198, 0.15)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LayoutDashboard size={14} />
            <span>Área Administrativa</span>
          </Link>
        )}
      </div>
    </header>
  );
};
