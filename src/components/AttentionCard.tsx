// src/components/AttentionCard.tsx
import React from 'react';
import { AlertTriangle, Brain, Wallet, Target } from 'lucide-react';

interface AttentionCardProps {
  pillars: { name: string; percent: number }[];
  description: string;
}

export const AttentionCard: React.FC<AttentionCardProps> = ({ pillars, description }) => {
  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'Controle Emocional':
        return <Brain size={20} style={{ color: '#EF4444' }} />;
      case 'Gestão Financeira':
        return <Wallet size={20} style={{ color: '#EF4444' }} />;
      case 'Estratégia':
        return <Target size={20} style={{ color: '#EF4444' }} />;
      default:
        return <AlertTriangle size={20} style={{ color: '#EF4444' }} />;
    }
  };

  return (
    <div
      style={{
        background: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)',
        animation: 'slideUp 0.6s ease forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <AlertTriangle size={24} style={{ color: '#EF4444' }} />
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-title)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#FCA5A5',
          }}
        >
          {pillars.length === 1 ? 'PONTO DE ATENÇÃO PRINCIPAL' : 'PONTOS QUE MERECEM ATENÇÃO'}
        </h3>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        {pillars.map((p) => (
          <div
            key={p.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            {getPillarIcon(p.name)}
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFF' }}>
              {p.name} ({p.percent}%)
            </span>
          </div>
        ))}
      </div>

      <p style={{ margin: 0, color: 'var(--color-silver-medium)', fontSize: '0.95rem', lineHeight: '1.5' }}>
        {description}
      </p>
    </div>
  );
};
