import React from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

export const QuizHeader: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  return (
    <header
      className="no-print"
      style={{
        backgroundColor: 'rgba(7, 26, 68, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(182, 187, 198, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
      }}
    >
      <div className="quiz-header-logo-wrapper">
        <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
          <AnimatedLogo
            spinDuration={6} // eleganted and moderated 6s duration rotation
            showAnimation={true}
          />
        </Link>
      </div>

      <div
        className="quiz-header-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginRight: '24px',
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
          className="md-inline-block"
        >
          Diagnóstico C.G.E.
        </span>

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
