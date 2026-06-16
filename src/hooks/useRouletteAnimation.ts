/**
 * useRouletteAnimation.ts
 * Hook que gerencia a animação da roda e da bola via requestAnimationFrame.
 *
 * Estados: idle → spinning → settling → result → question_unlocked → round_completed
 *
 * A roda gira no sentido horário.
 * A bola gira no sentido anti-horário.
 * Duração total: ~3,5s (1,2s com prefers-reduced-motion).
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { getTargetOffsetAngle, WHEEL_SVG } from '../data/rouletteData';

export type RouletteAnimState =
  | 'idle'
  | 'spinning'
  | 'settling'
  | 'result'
  | 'question_unlocked'
  | 'round_completed';

const SPIN_DURATION_MS = 3600;
const SPIN_DURATION_REDUCED_MS = 1100;
const WHEEL_ROUNDS_MIN = 5;
const WHEEL_ROUNDS_MAX = 8;
const BALL_EXTRA_ROUNDS = 3;

/** Ease-out cúbico (desaceleração progressiva — ideal para roleta) */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Ease combinado: aceleração leve no início, desaceleração longa */
function spinEase(t: number): number {
  if (t < 0.08) {
    // Breve aceleração inicial
    return (t / 0.08) * (t / 0.08) * 0.06;
  }
  // Desaceleração suave ocupando 92% da animação
  const t2 = (t - 0.08) / 0.92;
  return 0.06 + 0.94 * easeOutCubic(t2);
}

export interface AnimationState {
  wheelAngle: number;
  ballAngle: number;
  ballRadius: number;
  animState: RouletteAnimState;
}

export function useRouletteAnimation() {
  const [wheelAngle, setWheelAngle] = useState(0);
  const [ballAngle, setBallAngle] = useState(0);
  const [ballRadius, setBallRadius] = useState<number>(WHEEL_SVG.BALL_START_R);
  const [animState, setAnimState] = useState<RouletteAnimState>('idle');

  const rafRef = useRef<number | null>(null);
  const lastWheelAngleRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const isSpinningRef = useRef(false);

  // Detecta prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Cancela RAF ao desmontar
  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  /**
   * Inicia a animação de giro.
   * @param targetNumber - Número sorteado (0–36)
   * @param onComplete   - Chamado quando a animação termina, com o ângulo final da roda
   */
  const spin = useCallback(
    (targetNumber: number, onComplete: (finalWheelAngle: number) => void): void => {
      // Proteção contra duplo giro
      if (isSpinningRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      isSpinningRef.current = true;
      const reduced = reducedMotionRef.current;
      const duration = reduced ? SPIN_DURATION_REDUCED_MS : SPIN_DURATION_MS;
      const wheelRounds = reduced
        ? 2
        : WHEEL_ROUNDS_MIN + Math.floor(Math.random() * (WHEEL_ROUNDS_MAX - WHEEL_ROUNDS_MIN + 1));
      const ballRounds = reduced ? 3 : wheelRounds + BALL_EXTRA_ROUNDS;

      const offsetAngle = getTargetOffsetAngle(targetNumber);
      const startWheel = lastWheelAngleRef.current;
      const endWheel = startWheel + wheelRounds * 360 + offsetAngle;
      // Bola gira no sentido anti-horário (valor negativo)
      const endBall = -(ballRounds * 360);

      setAnimState('spinning');
      const t0 = performance.now();

      function frame(now: number) {
        const elapsed = now - t0;
        const rawT = Math.min(elapsed / duration, 1);
        const easedT = spinEase(rawT);

        // Roda: usa easing para desaceleração realista
        const currentWheel = startWheel + (endWheel - startWheel) * easedT;
        // Bola: movimento mais linear para efeito físico distinto
        const currentBall = endBall * Math.pow(rawT, 0.85);

        // Raio da bola: mantém na pista até 60% do giro, depois espirala para dentro
        const currentRadius =
          rawT < 0.6
            ? WHEEL_SVG.BALL_START_R
            : WHEEL_SVG.BALL_START_R +
              ((rawT - 0.6) / 0.4) * (WHEEL_SVG.BALL_END_R - WHEEL_SVG.BALL_START_R);

        setWheelAngle(currentWheel);
        setBallAngle(currentBall);
        setBallRadius(currentRadius);

        if (rawT < 0.62) {
          setAnimState('spinning');
        } else {
          setAnimState('settling');
        }

        if (rawT < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          // Normaliza o ângulo final para 0–360
          const normalizedAngle = ((endWheel % 360) + 360) % 360;
          setWheelAngle(normalizedAngle);
          setBallAngle(0);
          setBallRadius(WHEEL_SVG.BALL_END_R);
          lastWheelAngleRef.current = normalizedAngle;
          isSpinningRef.current = false;
          setAnimState('result');
          onComplete(normalizedAngle);
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    },
    [],
  );

  /** Marca a pergunta como liberada */
  const unlockQuestion = useCallback(() => setAnimState('question_unlocked'), []);

  /** Marca a rodada como concluída (resposta confirmada) */
  const completeRound = useCallback(() => setAnimState('round_completed'), []);

  /** Reseta para o estado idle para a próxima rodada (mantém o ângulo da roda) */
  const resetForNextRound = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isSpinningRef.current = false;
    setBallAngle(0);
    setBallRadius(WHEEL_SVG.BALL_START_R);
    setAnimState('idle');
  }, []);

  /**
   * Restaura o estado a partir de um giro salvo (ex: após refresh da página).
   * Posiciona a roda no ângulo final salvo e define estado como question_unlocked.
   */
  const restoreSpun = useCallback((savedWheelAngle: number, roundCompleted: boolean) => {
    setWheelAngle(savedWheelAngle);
    lastWheelAngleRef.current = savedWheelAngle;
    setBallAngle(0);
    setBallRadius(WHEEL_SVG.BALL_END_R);
    setAnimState(roundCompleted ? 'round_completed' : 'question_unlocked');
  }, []);

  return {
    wheelAngle,
    ballAngle,
    ballRadius,
    animState,
    spin,
    unlockQuestion,
    completeRound,
    resetForNextRound,
    restoreSpun,
  };
}
