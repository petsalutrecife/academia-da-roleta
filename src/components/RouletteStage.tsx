/**
 * RouletteStage.tsx — Etapa 4
 *
 * Orquestrador da roleta europeia. Substitui o componente provisório da Etapa 3.
 * Integra roda, bola, ponteiro, resultado e controles em um único SVG responsivo.
 *
 * Props:
 *   questionNumber     — rodada atual (1–5)
 *   savedSpinData      — dados salvos do giro para restaurar após refresh
 *   isAnswerConfirmed  — true quando a resposta foi confirmada (drive estado)
 *   onSpinComplete     — chamado com SpinResult quando a animação termina
 *   audioEnabled       — preferência de áudio do usuário
 *   onAudioToggle      — alternância do áudio
 */

import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  WHEEL_SVG,
  pickRandomNumber,
  buildSpinResult,
  type SpinResult,
} from '../data/rouletteData';
import { useRouletteAnimation } from '../hooks/useRouletteAnimation';
import { RouletteWheel } from './roulette/RouletteWheel';
import { RoulettePointer } from './roulette/RoulettePointer';
import { RouletteResult } from './roulette/RouletteResult';
import { RouletteControls } from './roulette/RouletteControls';
import type { RoundSpinData } from '../data/quizSession';

// ─── Constantes de áudio (Web Audio API sintético) ────────────────────────────
const AUDIO_PREF_KEY = 'roulette_audio_enabled';

function loadAudioPref(): boolean {
  try {
    return localStorage.getItem(AUDIO_PREF_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveAudioPref(val: boolean) {
  try {
    localStorage.setItem(AUDIO_PREF_KEY, val ? 'true' : 'false');
  } catch { /* noop */ }
}

function playSyntheticStop(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface RouletteStageProps {
  questionNumber: number;
  savedSpinData: RoundSpinData | null;
  isAnswerConfirmed: boolean;
  onSpinComplete: (result: SpinResult) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export const RouletteStage: React.FC<RouletteStageProps> = ({
  questionNumber,
  savedSpinData,
  isAnswerConfirmed,
  onSpinComplete,
}) => {
  const {
    wheelAngle,
    ballAngle,
    ballRadius,
    animState,
    spin,
    unlockQuestion,
    completeRound,
    resetForNextRound,
    restoreSpun,
  } = useRouletteAnimation();

  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(loadAudioPref);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasRestoredRef = useRef(false);

  // ── Restaurar giro salvo após refresh ──────────────────────────────────────
  useEffect(() => {
    if (hasRestoredRef.current) return;

    if (savedSpinData?.questionUnlocked) {
      hasRestoredRef.current = true;
      const restored = buildSpinResult(
        savedSpinData.rouletteNumber,
        savedSpinData.finalWheelAngle,
      );
      setSpinResult(restored);
      restoreSpun(savedSpinData.finalWheelAngle, savedSpinData.answerConfirmed);
    }
  }, [savedSpinData, restoreSpun]);

  // ── Sincronizar estado 'round_completed' quando resposta é confirmada ──────
  useEffect(() => {
    if (isAnswerConfirmed && animState === 'question_unlocked') {
      completeRound();
    }
  }, [isAnswerConfirmed, animState, completeRound]);

  // ── Resetar para próxima rodada quando questionNumber muda ────────────────
  useEffect(() => {
    hasRestoredRef.current = false;
    setSpinResult(null);
    resetForNextRound();
  }, [questionNumber, resetForNextRound]);

  // ── Iniciar giro ──────────────────────────────────────────────────────────
  const handleSpin = useCallback(() => {
    if (animState !== 'idle') return;

    const targetNumber = pickRandomNumber();

    spin(targetNumber, (finalWheelAngle) => {
      const result = buildSpinResult(targetNumber, finalWheelAngle);
      setSpinResult(result);

      // Áudio de parada
      if (audioEnabled) {
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          }
          playSyntheticStop(audioCtxRef.current);
        } catch { /* áudio não disponível */ }
      }

      // Libera a pergunta após 550ms (conforme especificação)
      setTimeout(() => {
        unlockQuestion();
        onSpinComplete(result);
      }, 550);
    });
  }, [animState, spin, unlockQuestion, onSpinComplete, audioEnabled]);

  // ── Toggle de áudio ───────────────────────────────────────────────────────
  const handleAudioToggle = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      saveAudioPref(next);
      return next;
    });
  }, []);

  // ── Cálculo da posição da bola ────────────────────────────────────────────
  const { CX, CY } = WHEEL_SVG;
  const ballRad = (ballAngle * Math.PI) / 180;
  const ballX = CX + ballRadius * Math.sin(ballRad);
  const ballY = CY - ballRadius * Math.cos(ballRad);

  // ── Estados de visibilidade ───────────────────────────────────────────────
  const showBall = animState !== 'idle' && animState !== 'round_completed';
  const showResult =
    spinResult !== null &&
    (animState === 'result' ||
      animState === 'question_unlocked' ||
      animState === 'round_completed');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
      }}
    >
      {/* ─── SVG da roleta ─────────────────────────────────────────────────── */}
      <div
        role="img"
        aria-label={`Roleta europeia. Rodada ${questionNumber} de 5.`}
        style={{
          width: '100%',
          maxWidth: '460px',
          minWidth: '260px',
        }}
      >
        <svg
          viewBox="0 0 400 400"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.6))',
          }}
        >
          <defs>
            {/* Gradiente do aro externo */}
            <radialGradient id="outerRimGrad" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="#1a2a50" />
              <stop offset="92%" stopColor="#7a8aa8" />
              <stop offset="96%" stopColor="#c8d0e0" />
              <stop offset="100%" stopColor="#8a9ab5" />
            </radialGradient>

            {/* Gradiente do hub central */}
            <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#071a44" />
              <stop offset="70%" stopColor="#040f28" />
              <stop offset="100%" stopColor="#020a1a" />
            </radialGradient>

            {/* Gradiente do ponteiro */}
            <linearGradient id="pointerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d0d8e8" />
              <stop offset="100%" stopColor="#8a9ab5" />
            </linearGradient>

            {/* Filtro de brilho para a bola */}
            <filter id="ballGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Aro externo decorativo (estático) ─────────────────────────── */}
          <circle cx={CX} cy={CY} r={198} fill="url(#outerRimGrad)" />
          <circle
            cx={CX}
            cy={CY}
            r={196}
            fill="none"
            stroke="rgba(192,200,216,0.25)"
            strokeWidth={1}
          />

          {/* ── Pista da bola (estático — azul-marinho escuro) ────────────── */}
          <circle cx={CX} cy={CY} r={184} fill="#0b1833" />
          <circle
            cx={CX}
            cy={CY}
            r={184}
            fill="none"
            stroke="rgba(192,200,216,0.3)"
            strokeWidth={0.8}
          />
          <circle
            cx={CX}
            cy={CY}
            r={168}
            fill="none"
            stroke="rgba(192,200,216,0.2)"
            strokeWidth={0.6}
          />

          {/* ── Roda girante (setores + números) ─────────────────────────── */}
          <RouletteWheel rotation={wheelAngle} />

          {/* ── Anel interno estático ─────────────────────────────────────── */}
          <circle cx={CX} cy={CY} r={108} fill="#071a44" />
          <circle
            cx={CX}
            cy={CY}
            r={108}
            fill="none"
            stroke="rgba(192,200,216,0.3)"
            strokeWidth={1}
          />

          {/* ── Hub central decorativo (estático) ────────────────────────── */}
          <circle cx={CX} cy={CY} r={72} fill="url(#hubGrad)" />
          <circle
            cx={CX}
            cy={CY}
            r={72}
            fill="none"
            stroke="rgba(192,200,216,0.2)"
            strokeWidth={1}
          />
          {/* Anel interno do hub */}
          <circle cx={CX} cy={CY} r={56} fill="none" stroke="rgba(192,200,216,0.12)" strokeWidth={1} />
          {/* Texto do hub */}
          <text
            x={CX}
            y={CY - 9}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(192,200,216,0.7)"
            fontSize={11}
            fontWeight="800"
            fontFamily="'Montserrat', 'Inter', Arial, sans-serif"
            letterSpacing="0.15em"
            style={{ userSelect: 'none' }}
          >
            C.G.E.
          </text>
          <text
            x={CX}
            y={CY + 10}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(192,200,216,0.4)"
            fontSize={5.5}
            fontWeight="600"
            fontFamily="'Montserrat', 'Inter', Arial, sans-serif"
            letterSpacing="0.08em"
            style={{ userSelect: 'none' }}
          >
            ACADEMIA DA ROLETA
          </text>
          {/* Círculo central decorativo */}
          <circle cx={CX} cy={CY} r={28} fill="rgba(18,61,132,0.3)" stroke="rgba(192,200,216,0.15)" strokeWidth={0.5} />
          <circle cx={CX} cy={CY} r={5} fill="rgba(192,200,216,0.4)" />

          {/* ── Bola (posição calculada independentemente da roda) ─────────── */}
          {showBall && (
            <circle
              cx={ballX}
              cy={ballY}
              r={5.5}
              fill="ivory"
              stroke="rgba(200,208,224,0.7)"
              strokeWidth={0.8}
              filter="url(#ballGlow)"
              aria-hidden="true"
              style={{ willChange: 'cx, cy' }}
            />
          )}

          {/* ── Ponteiro fixo no topo ─────────────────────────────────────── */}
          <RoulettePointer />
        </svg>
      </div>

      {/* ─── Card de resultado ──────────────────────────────────────────────── */}
      {spinResult && (
        <RouletteResult
          number={spinResult.number}
          color={spinResult.color}
          colorLabel={spinResult.colorLabel}
          visible={showResult}
        />
      )}

      {/* ─── Botão e status ─────────────────────────────────────────────────── */}
      <RouletteControls
        animState={animState}
        audioEnabled={audioEnabled}
        onSpin={handleSpin}
        onAudioToggle={handleAudioToggle}
      />
    </div>
  );
};
