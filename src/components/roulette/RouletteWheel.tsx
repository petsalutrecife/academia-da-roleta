/**
 * RouletteWheel.tsx
 * Roda da roleta europeia em SVG.
 *
 * Renderiza 37 setores coloridos com números, separadores e detalhes internos.
 * O grupo principal é rotacionado via a prop `rotation` (graus, sentido horário).
 * O componente é memoizado para evitar re-renders desnecessários durante a animação.
 */

import React, { memo } from 'react';
import {
  EUROPEAN_SEQUENCE,
  SECTOR_COUNT,
  SECTOR_ANGLE,
  WHEEL_SVG,
  getNumberColor,
  buildSectorPath,
  polarToXY,
} from '../../data/rouletteData';

// ─── Cores dos setores ────────────────────────────────────────────────────────
const SECTOR_FILL: Record<'green' | 'red' | 'black', string> = {
  green: '#1a6b3a',
  red:   '#8b1c1c',
  black: '#0d0d1c',
};

const SECTOR_STROKE = 'rgba(192, 200, 216, 0.45)';

interface RouletteWheelProps {
  /** Ângulo de rotação da roda em graus (sentido horário) */
  rotation: number;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = memo(({ rotation }) => {
  const { CX, CY, SECTOR_OUTER_R, SECTOR_INNER_R, NUMBER_RADIUS } = WHEEL_SVG;

  return (
    <g
      transform={`rotate(${rotation}, ${CX}, ${CY})`}
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    >
      {/* ─── 37 setores ─────────────────────────────────────────────────────── */}
      {EUROPEAN_SEQUENCE.map((num, i) => {
        const centerAngle = i * SECTOR_ANGLE;
        const halfSector = SECTOR_ANGLE / 2;
        const startAngle = centerAngle - halfSector;
        const endAngle   = centerAngle + halfSector;
        const color = getNumberColor(num);
        const textPos = polarToXY(CX, CY, NUMBER_RADIUS, centerAngle);

        return (
          <g key={i}>
            {/* Preenchimento do setor */}
            <path
              d={buildSectorPath(CX, CY, SECTOR_INNER_R, SECTOR_OUTER_R, startAngle, endAngle)}
              fill={SECTOR_FILL[color]}
              stroke={SECTOR_STROKE}
              strokeWidth={0.7}
            />

            {/* Número */}
            <text
              x={textPos.x}
              y={textPos.y}
              transform={`rotate(${centerAngle}, ${textPos.x}, ${textPos.y})`}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.95)"
              fontSize={8.5}
              fontWeight="700"
              fontFamily="'Montserrat', 'Inter', Arial, sans-serif"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {num}
            </text>
          </g>
        );
      })}

      {/* ─── Separadores radiais entre setores ──────────────────────────────── */}
      {Array.from({ length: SECTOR_COUNT }).map((_, i) => {
        const edgeAngle = i * SECTOR_ANGLE - SECTOR_ANGLE / 2;
        const inner = polarToXY(CX, CY, SECTOR_INNER_R, edgeAngle);
        const outer = polarToXY(CX, CY, SECTOR_OUTER_R, edgeAngle);
        return (
          <line
            key={`sep-${i}`}
            x1={inner.x.toFixed(2)}
            y1={inner.y.toFixed(2)}
            x2={outer.x.toFixed(2)}
            y2={outer.y.toFixed(2)}
            stroke="rgba(192, 200, 216, 0.3)"
            strokeWidth={0.5}
          />
        );
      })}

      {/* ─── Anel externo do setor (linha divisória da pista) ──────────────── */}
      <circle
        cx={CX}
        cy={CY}
        r={SECTOR_OUTER_R}
        fill="none"
        stroke="rgba(192, 200, 216, 0.5)"
        strokeWidth={1.2}
      />

      {/* ─── Anel interno do setor ──────────────────────────────────────────── */}
      <circle
        cx={CX}
        cy={CY}
        r={SECTOR_INNER_R}
        fill="none"
        stroke="rgba(192, 200, 216, 0.45)"
        strokeWidth={1.2}
      />

      {/* ─── Detalhes decorativos internos (losangos / pins entre setores) ─── */}
      {Array.from({ length: SECTOR_COUNT }).map((_, i) => {
        const centerAngle = i * SECTOR_ANGLE;
        const pinPos = polarToXY(CX, CY, SECTOR_INNER_R + 4, centerAngle);
        return (
          <circle
            key={`pin-${i}`}
            cx={pinPos.x.toFixed(2)}
            cy={pinPos.y.toFixed(2)}
            r={1.8}
            fill="rgba(192, 200, 216, 0.6)"
          />
        );
      })}
    </g>
  );
});

RouletteWheel.displayName = 'RouletteWheel';
