import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#030D24',
        borderTop: '1px solid rgba(182, 187, 198, 0.1)',
        padding: '2rem 1.5rem',
        marginTop: 'auto',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
      }}
    >
      <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-silver-dark)',
            lineHeight: '1.5',
            fontFamily: 'var(--font-body)',
          }}
        >
          Conteúdo educacional destinado exclusivamente a maiores de 18 anos. Esta ferramenta não envolve apostas com dinheiro real e não garante resultados financeiros.
        </p>
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-silver-medium)',
            fontFamily: 'var(--font-title)',
            letterSpacing: '0.05em',
            marginTop: '0.2rem',
          }}
        >
          Academia da Roleta — Método C.G.E.
        </p>
      </div>
    </footer>
  );
};
