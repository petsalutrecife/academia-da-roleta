/**
 * RouletteResult.tsx
 * Card com o número e cor sorteados, exibido após o giro.
 * Aparece com animação de fade-in. Anuncia o resultado via aria-live.
 *
 * NÃO exibe textos de prêmio, ganho, perda ou aposta.
 */

import React from 'react';
import type { NumberColor } from '../../data/rouletteData';

interface RouletteResultProps {
  number: number;
  color: NumberColor;
  colorLabel: string;
  visible: boolean;
}

const COLOR_INDICATOR: Record<NumberColor, string> = {
  green:  '#1a6b3a',
  red:    '#8b1c1c',
  black:  '#1a1a2e',
};

const COLOR_BORDER: Record<NumberColor, string> = {
  green:  'rgba(26,107,58,0.5)',
  red:    'rgba(139,28,28,0.5)',
  black:  'rgba(192,200,216,0.2)',
};

export const RouletteResult: React.FC<RouletteResultProps> = ({
  number,
  color,
  colorLabel,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.7rem 1.2rem',
        borderRadius: '10px',
        background: 'rgba(7,26,68,0.7)',
        border: `1px solid ${COLOR_BORDER[color]}`,
        boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.35s ease forwards',
      }}
    >
      {/* Círculo colorido */}
      <div
        aria-hidden="true"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: COLOR_INDICATOR[color],
          border: '2px solid rgba(192,200,216,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 12px ${COLOR_INDICATOR[color]}66`,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.9rem',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1,
          }}
        >
          {number}
        </span>
      </div>

      {/* Texto */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-silver-medium)',
            margin: '0 0 0.15rem',
          }}
        >
          Número Sorteado
        </p>
        <p
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.92rem',
            fontWeight: 800,
            color: 'var(--color-white)',
            margin: 0,
          }}
        >
          {number}{' '}
          <span style={{ color: 'var(--color-silver-medium)', fontWeight: 600 }}>
            — {colorLabel}
          </span>
        </p>
      </div>
    </div>
  );
};
