// src/components/StrengthCard.tsx
import React from 'react';
import { Award } from 'lucide-react';

interface StrengthCardProps {
  pillar: string;
  percent: number;
  description: string;
}

export const StrengthCard: React.FC<StrengthCardProps> = ({ pillar, percent, description }) => (
  <div style={{
    border: '1px solid var(--color-silver-dark)',
    borderRadius: '12px',
    padding: '1rem',
    backgroundColor: 'rgba(3,13,36,0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  }}>
    <Award size={24} color="var(--color-silver-medium)" />
    <div>
      <h3 style={{ margin: 0, fontFamily: 'var(--font-title)', fontSize: '0.95rem' }}>{pillar} - Ponto forte</h3>
      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-silver-medium)' }}>{description}</p>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-white)' }}>{percent}% de aproveitamento</span>
    </div>
  </div>
);
