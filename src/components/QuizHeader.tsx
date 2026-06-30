import React from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { Link } from 'react-router-dom';

export const QuizHeader: React.FC = () => {
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
      </div>
    </header>
  );
};
