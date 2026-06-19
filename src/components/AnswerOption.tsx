/**
 * AnswerOption.tsx
 * Componente reutilizável para cada alternativa do quiz.
 * Suporta: normal | hover | selecionado | bloqueado | revelado (correto/incorreto)
 */

import React, { useCallback } from 'react';
import { Check, X } from 'lucide-react';
import type { OptionId } from '../data/quizData';

interface AnswerOptionProps {
  id: OptionId;
  text: string;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: (id: OptionId) => void;
  isCorrectAlternative?: boolean;
  isConfirmed?: boolean;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  id,
  text,
  isSelected,
  isLocked,
  onSelect,
  isCorrectAlternative = false,
  isConfirmed = false,
}) => {
  const handleClick = useCallback(() => {
    if (!isLocked) onSelect(id);
  }, [id, isLocked, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSelect(id);
      }
    },
    [id, isLocked, onSelect],
  );

  // Determinar cores e bordas com base no feedback imediato se confirmado
  let bg = 'rgba(7, 26, 68, 0.4)';
  let border = '1px solid rgba(182, 187, 198, 0.12)';
  let textColor = 'var(--color-silver-light)';
  let shadow = 'none';
  let opacity = 1;

  if (isConfirmed) {
    if (isCorrectAlternative) {
      // Correta (verde)
      bg = 'rgba(16, 185, 129, 0.18)';
      border = '1px solid rgba(16, 185, 129, 0.7)';
      textColor = 'var(--color-white)';
      shadow = '0 0 14px rgba(16, 185, 129, 0.25)';
    } else if (isSelected && !isCorrectAlternative) {
      // Escolhida incorreta (vermelho)
      bg = 'rgba(239, 68, 68, 0.18)';
      border = '1px solid rgba(239, 68, 68, 0.7)';
      textColor = 'var(--color-white)';
      shadow = '0 0 14px rgba(239, 68, 68, 0.25)';
    } else {
      // Outras opções incorretas e não escolhidas (opaco)
      bg = 'rgba(7, 26, 68, 0.18)';
      border = '1px solid rgba(182, 187, 198, 0.05)';
      textColor = 'var(--color-silver-dark)';
      opacity = 0.55;
    }
  } else {
    // Estado antes de confirmar
    if (isSelected) {
      bg = 'rgba(18, 61, 132, 0.35)';
      border = '1px solid rgba(192, 200, 216, 0.7)';
      shadow = '0 0 14px rgba(18,61,132,0.35)';
      textColor = 'var(--color-white)';
    } else if (isLocked) {
      bg = 'rgba(7, 26, 68, 0.25)';
      opacity = 0.55;
    }
  }

  // Elemento do ícone no badge
  const renderBadgeContent = () => {
    if (isConfirmed) {
      if (isCorrectAlternative) {
        return <Check size={14} strokeWidth={3} />;
      }
      if (isSelected && !isCorrectAlternative) {
        return <X size={14} strokeWidth={3} />;
      }
    }
    return id;
  };

  // Badge background e cor
  let badgeBg = 'rgba(182, 187, 198, 0.08)';
  let badgeBorder = '1.5px solid rgba(182, 187, 198, 0.25)';
  let badgeColor = 'var(--color-silver-medium)';

  if (isConfirmed) {
    if (isCorrectAlternative) {
      badgeBg = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      badgeBorder = '1.5px solid rgba(52, 211, 153, 0.6)';
      badgeColor = 'var(--color-white)';
    } else if (isSelected && !isCorrectAlternative) {
      badgeBg = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
      badgeBorder = '1.5px solid rgba(248, 113, 113, 0.6)';
      badgeColor = 'var(--color-white)';
    }
  } else if (isSelected) {
    badgeBg = 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #1a4fa0 100%)';
    badgeBorder = '1.5px solid rgba(192, 200, 216, 0.5)';
    badgeColor = 'var(--color-white)';
  }

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      aria-disabled={isLocked}
      tabIndex={isLocked ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.95rem 1.2rem',
        borderRadius: '10px',
        cursor: isLocked ? 'default' : 'pointer',
        userSelect: 'none',
        transition: 'all 0.2s ease',
        outline: 'none',
        backgroundColor: bg,
        border: border,
        boxShadow: shadow,
        opacity: opacity,
      }}
      onMouseEnter={(e) => {
        if (!isLocked && !isSelected) {
          e.currentTarget.style.borderColor = 'rgba(182,187,198,0.3)';
          e.currentTarget.style.backgroundColor = 'rgba(7,26,68,0.6)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLocked && !isSelected) {
          e.currentTarget.style.borderColor = 'rgba(182,187,198,0.12)';
          e.currentTarget.style.backgroundColor = 'rgba(7,26,68,0.4)';
        }
      }}
      onFocus={(e) => {
        if (!isLocked) {
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(192,200,216,0.5)';
        }
      }}
      onBlur={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Badge da letra ou ícone */}
      <div
        aria-hidden="true"
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 800,
          fontFamily: 'var(--font-title)',
          letterSpacing: '0.05em',
          transition: 'all 0.2s ease',
          background: badgeBg,
          border: badgeBorder,
          color: badgeColor,
        }}
      >
        {renderBadgeContent()}
      </div>

      {/* Texto da alternativa */}
      <span
        style={{
          fontSize: '0.95rem',
          lineHeight: '1.45',
          color: textColor,
          fontFamily: 'var(--font-body)',
          transition: 'color 0.2s ease',
          flex: 1,
        }}
      >
        {text}
        {isConfirmed && isCorrectAlternative && (
          <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            {' '}(Correta)
          </span>
        )}
        {isConfirmed && isSelected && !isCorrectAlternative && (
          <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            {' '}(Sua resposta - Incorreta)
          </span>
        )}
      </span>
    </div>
  );
};
