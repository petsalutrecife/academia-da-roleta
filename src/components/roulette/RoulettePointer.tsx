/**
 * RoulettePointer.tsx
 * Marcador fixo no topo (12h) da roleta — indica o número final.
 * Não gira. Sempre posicionado apontando para dentro da roda.
 */

import React from 'react';
import { WHEEL_SVG } from '../../data/rouletteData';

const { CX, POINTER_BASE_R } = WHEEL_SVG;
const CY_POINTER = 200;

// Triângulo apontando para baixo (para dentro da roda), centralizado no topo
const POINTER_TIP_Y  = CY_POINTER - POINTER_BASE_R + 24; // ponta (mais próxima do setor)
const POINTER_BASE_Y = CY_POINTER - POINTER_BASE_R + 4;  // base (mais próxima do aro)
const POINTER_HALF_W = 6;

export const RoulettePointer: React.FC = () => (
  <g aria-hidden="true">
    {/* Sombra suave */}
    <polygon
      points={`
        ${CX},${POINTER_TIP_Y + 2}
        ${CX - POINTER_HALF_W},${POINTER_BASE_Y + 2}
        ${CX + POINTER_HALF_W},${POINTER_BASE_Y + 2}
      `}
      fill="rgba(0,0,0,0.4)"
    />
    {/* Ponteiro */}
    <polygon
      points={`
        ${CX},${POINTER_TIP_Y}
        ${CX - POINTER_HALF_W},${POINTER_BASE_Y}
        ${CX + POINTER_HALF_W},${POINTER_BASE_Y}
      `}
      fill="url(#pointerGradient)"
      stroke="rgba(192,200,216,0.5)"
      strokeWidth={0.5}
    />
    {/* Bolinha na base do ponteiro */}
    <circle
      cx={CX}
      cy={POINTER_BASE_Y}
      r={3}
      fill="rgba(192,200,216,0.9)"
    />
  </g>
);
