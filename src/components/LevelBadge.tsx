// src/components/LevelBadge.tsx
import React from 'react';

interface LevelBadgeProps {
  level: 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado';
}

const levelMap: Record<LevelBadgeProps['level'], { emoji: string; color: string }> = {
  Iniciante: { emoji: '🟢', color: '#22C55E' },
  Básico: { emoji: '🔵', color: '#3B82F6' },
  Intermediário: { emoji: '🟣', color: '#8B5CF6' },
  Avançado: { emoji: '🟠', color: '#F97316' },
};

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level }) => {
  const { emoji, color } = levelMap[level];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        backgroundColor: `${color}20`,
        color,
        padding: '0.25rem 0.5rem',
        borderRadius: '9999px',
        fontWeight: 600,
        fontFamily: 'var(--font-title)',
      }}
    >
      <span aria-hidden="true">{emoji}</span>
      {level}
    </span>
  );
};
