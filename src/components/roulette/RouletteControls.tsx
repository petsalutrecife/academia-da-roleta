/**
 * RouletteControls.tsx
 * Botão "Girar a Roleta" + toggle de áudio + mensagens de status.
 *
 * Estados do botão:
 *   idle            → "GIRAR A ROLETA" (ativo)
 *   spinning        → "Roleta girando..." (desabilitado)
 *   settling        → "Roleta girando..." (desabilitado)
 *   result          → "Roleta girando..." (desabilitado)
 *   question_unlocked → "Responda a pergunta" (desabilitado)
 *   round_completed → "Avançar para próxima" (desabilitado, Quiz gerencia)
 */

import React from 'react';
import { RotateCw, Volume2, VolumeX } from 'lucide-react';
import type { RouletteAnimState } from '../../hooks/useRouletteAnimation';

interface RouletteControlsProps {
  animState: RouletteAnimState;
  audioEnabled: boolean;
  onSpin: () => void;
  onAudioToggle: () => void;
}

type ButtonConfig = {
  label: string;
  disabled: boolean;
  loading: boolean;
};

function getButtonConfig(animState: RouletteAnimState): ButtonConfig {
  switch (animState) {
    case 'idle':
      return { label: 'GIRAR A ROLETA', disabled: false, loading: false };
    case 'spinning':
    case 'settling':
      return { label: 'Roleta girando...', disabled: true, loading: true };
    case 'result':
      return { label: 'Liberando pergunta...', disabled: true, loading: false };
    case 'question_unlocked':
      return { label: 'Responda a pergunta', disabled: true, loading: false };
    case 'round_completed':
      return { label: 'Rodada concluída', disabled: true, loading: false };
    default:
      return { label: 'GIRAR A ROLETA', disabled: false, loading: false };
  }
}

function getStatusMessage(animState: RouletteAnimState): string {
  switch (animState) {
    case 'idle':
      return 'Gire a roleta para liberar a próxima pergunta.';
    case 'spinning':
    case 'settling':
      return 'A roleta está girando...';
    case 'result':
      return 'Número sorteado! Liberando a pergunta.';
    case 'question_unlocked':
      return 'Pergunta liberada. Escolha uma alternativa.';
    case 'round_completed':
      return 'Resposta confirmada. Avance para a próxima rodada.';
    default:
      return '';
  }
}

export const RouletteControls: React.FC<RouletteControlsProps> = ({
  animState,
  audioEnabled,
  onSpin,
  onAudioToggle,
}) => {
  const { label, disabled, loading } = getButtonConfig(animState);
  const isIdle = animState === 'idle';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
      }}
    >
      {/* ─── Botão principal ─────────────────────────────────────────────── */}
      <button
        id="btn-girar-roleta"
        onClick={onSpin}
        disabled={disabled}
        aria-disabled={disabled}
        aria-label={disabled ? 'Roleta girando, aguarde' : 'Girar a roleta'}
        style={{
          width: '100%',
          maxWidth: '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          fontFamily: 'var(--font-title)',
          fontSize: '0.82rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '0.85rem 1.5rem',
          borderRadius: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: '1px solid rgba(192,200,216,0.3)',
          background: isIdle
            ? 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)'
            : 'rgba(7,26,68,0.35)',
          color: isIdle ? 'var(--color-white)' : 'var(--color-silver-dark)',
          boxShadow: isIdle ? '0 4px 18px rgba(18,61,132,0.45)' : 'none',
          transition: 'all 0.25s ease',
          opacity: disabled && !isIdle ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 26px rgba(18,61,132,0.6)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = isIdle ? '0 4px 18px rgba(18,61,132,0.45)' : 'none';
        }}
        onFocus={(e) => {
          if (!disabled) e.currentTarget.style.outline = '2px solid rgba(192,200,216,0.6)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        <RotateCw
          size={16}
          style={{
            animation: loading ? 'spinSlow 0.6s linear infinite' : 'none',
          }}
        />
        {label}
      </button>

      {/* ─── Mensagem de status (aria-live para leitores) ─────────────────── */}
      <p
        aria-live="polite"
        aria-atomic="true"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.76rem',
          color: 'var(--color-silver-medium)',
          textAlign: 'center',
          margin: 0,
          minHeight: '1.1em',
          transition: 'opacity 0.3s ease',
          opacity: animState === 'round_completed' ? 0 : 0.85,
        }}
      >
        {getStatusMessage(animState)}
      </p>

      {/* ─── Toggle de áudio ─────────────────────────────────────────────── */}
      <button
        id="btn-audio-toggle"
        onClick={onAudioToggle}
        aria-pressed={audioEnabled}
        aria-label={`Efeitos sonoros: ${audioEnabled ? 'ativados' : 'desativados'}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.68rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          color: 'var(--color-silver-dark)',
          background: 'none',
          border: '1px solid rgba(192,200,216,0.12)',
          borderRadius: '6px',
          padding: '0.3rem 0.7rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-silver-light)';
          e.currentTarget.style.borderColor = 'rgba(192,200,216,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-silver-dark)';
          e.currentTarget.style.borderColor = 'rgba(192,200,216,0.12)';
        }}
      >
        {audioEnabled ? (
          <Volume2 size={12} />
        ) : (
          <VolumeX size={12} />
        )}
        EFEITOS SONOROS: {audioEnabled ? 'ATIVADOS' : 'DESATIVADOS'}
      </button>
    </div>
  );
};
