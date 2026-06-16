/**
 * rouletteData.ts
 * Dados e utilitários da roleta europeia.
 * Sequência oficial, mapeamento de cores e geometria SVG.
 */

// ─── Sequência oficial da roleta europeia (sentido horário) ──────────────────
export const EUROPEAN_SEQUENCE = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
  8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
  28, 12, 35, 3, 26,
] as const;

// ─── Números vermelhos ────────────────────────────────────────────────────────
export const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

export type NumberColor = 'green' | 'red' | 'black';

export interface SpinResult {
  number: number;
  color: NumberColor;
  colorLabel: string;
  sectorIndex: number;
  finalWheelAngle: number;
  spunAt: string;
}

// ─── Funções de cor ───────────────────────────────────────────────────────────
export function getNumberColor(n: number): NumberColor {
  if (n === 0) return 'green';
  return RED_NUMBERS.has(n) ? 'red' : 'black';
}

export function getColorLabel(color: NumberColor): string {
  return { green: 'Verde', red: 'Vermelho', black: 'Preto' }[color];
}

// ─── Geometria dos setores ────────────────────────────────────────────────────
export const SECTOR_COUNT = EUROPEAN_SEQUENCE.length; // 37
export const SECTOR_ANGLE = 360 / SECTOR_COUNT; // ≈ 9.7297°

/** Retorna o índice do setor na roda europeia para um dado número */
export function getSectorIndex(number: number): number {
  return EUROPEAN_SEQUENCE.indexOf(number as (typeof EUROPEAN_SEQUENCE)[number]);
}

/**
 * Ângulo de offset necessário para que o setor do número alvo
 * chegue ao ponteiro (topo, 12h) após a rotação.
 *
 * Pressupõe que a roda foi desenhada com o setor 0 centralizado
 * exatamente no topo (ângulo 0°). O setor i está centralizado
 * em i × SECTOR_ANGLE graus no sentido horário a partir do topo.
 *
 * Para trazer o setor i ao topo: rodar CW por (360 - i × SECTOR_ANGLE) % 360.
 */
export function getTargetOffsetAngle(targetNumber: number): number {
  const idx = getSectorIndex(targetNumber);
  return (360 - (idx * SECTOR_ANGLE) % 360) % 360;
}

/** Sorteia um número aleatório entre 0 e 36 */
export function pickRandomNumber(): number {
  return Math.floor(Math.random() * 37);
}

/** Constrói um SpinResult a partir do número e do ângulo final da roda */
export function buildSpinResult(number: number, finalWheelAngle: number): SpinResult {
  const color = getNumberColor(number);
  return {
    number,
    color,
    colorLabel: getColorLabel(color),
    sectorIndex: getSectorIndex(number),
    finalWheelAngle,
    spunAt: new Date().toISOString(),
  };
}

// ─── Constantes de geometria SVG (viewBox 0 0 400 400, centro em 200,200) ────
export const WHEEL_SVG = {
  CX: 200,
  CY: 200,
  /** Aro externo decorativo */
  OUTER_RING_R: 198,
  /** Borda externa da pista da bola */
  BALL_TRACK_OUTER_R: 184,
  /** Borda interna da pista da bola / borda externa dos setores */
  BALL_TRACK_INNER_R: 168,
  /** Borda externa dos setores com números */
  SECTOR_OUTER_R: 165,
  /** Raio onde o texto dos números é centralizado */
  NUMBER_RADIUS: 138,
  /** Borda interna dos setores com números */
  SECTOR_INNER_R: 110,
  /** Anel interno decorativo estático */
  INNER_RING_R: 106,
  /** Hub central (estático) */
  CENTER_HUB_R: 72,
  CENTER_INNER_R: 56,
  CENTER_CORE_R: 40,
  /** Raio da bola durante o giro (na pista) */
  BALL_START_R: 176,
  /** Raio final da bola (dentro do setor) */
  BALL_END_R: 136,
  /** Raio do ponteiro fixo (base) */
  POINTER_BASE_R: 188,
} as const;

// ─── Utilitários SVG ──────────────────────────────────────────────────────────
/**
 * Converte coordenadas polares (ângulo em graus a partir do topo, sentido horário)
 * para coordenadas SVG cartesianas.
 */
export function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/** Constrói um path SVG para um setor (arco entre raio interno e externo) */
export function buildSectorPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
): string {
  const s1 = polarToXY(cx, cy, outerR, startDeg);
  const s2 = polarToXY(cx, cy, outerR, endDeg);
  const s3 = polarToXY(cx, cy, innerR, endDeg);
  const s4 = polarToXY(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const f = (n: number) => n.toFixed(3);
  return [
    `M ${f(s1.x)} ${f(s1.y)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${f(s2.x)} ${f(s2.y)}`,
    `L ${f(s3.x)} ${f(s3.y)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${f(s4.x)} ${f(s4.y)}`,
    'Z',
  ].join(' ');
}
