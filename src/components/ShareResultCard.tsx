// src/components/ShareResultCard.tsx
import React from 'react';
import { Award, CheckCircle } from 'lucide-react';

interface ShareResultCardProps {
  level: string;
  percent: number;
  score: number;
}

export const ShareResultCard: React.FC<ShareResultCardProps> = ({ level, percent, score }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #071A44 0%, #0A2863 100%)',
        border: '3px solid #D7DAE2', // Borda metálica
        borderRadius: '16px',
        padding: '1.75rem',
        maxWidth: '380px',
        margin: '1.5rem auto',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(7, 26, 68, 0.5), inset 0 0 20px rgba(182, 187, 198, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        color: '#FFF',
      }}
    >
      {/* Decorative metal rivets */}
      <div style={{ position: 'absolute', top: '8px', left: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#D7DAE2' }} />
      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#D7DAE2' }} />
      <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#D7DAE2' }} />
      <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#D7DAE2' }} />

      <div style={{ marginBottom: '1rem' }}>
        <Award size={48} style={{ color: '#D7DAE2', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
      </div>

      <span
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: '0.8rem',
          fontWeight: 800,
          color: 'var(--color-silver-medium)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Desempenho no Método C.G.E.
      </span>

      <h4
        style={{
          margin: '0.25rem 0 0.75rem 0',
          fontSize: '1.75rem',
          fontFamily: 'var(--font-title)',
          fontWeight: 800,
          color: '#FFF',
          letterSpacing: '0.05em',
        }}
      >
        Nível {level}
      </h4>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: '0.25rem',
          margin: '1rem 0',
        }}
      >
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-white)' }}>
          {percent}%
        </span>
        <span style={{ fontSize: '1.25rem', color: 'var(--color-silver-medium)', fontWeight: 600 }}>
          de aproveitamento
        </span>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--color-silver-medium)',
        }}
      >
        <CheckCircle size={16} style={{ color: 'var(--color-green-light)' }} />
        {score} de 5 acertos
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--color-silver-dark)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Academia da Roleta
      </div>
    </div>
  );
};
