/**
 * AnswerOption.tsx
 * Componente reutilizável para cada alternativa do quiz.
 * Suporta: normal | hover | selecionado | bloqueado
 * Não exibe se a resposta é correta ou incorreta.
 */

import React, { useCallback } from 'react';
import { Check } from 'lucide-react';
import type { OptionId } from '../data/quizData';

interface AnswerOptionProps {
  id: OptionId;
  text: string;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: (id: OptionId) => void;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  id,
  text,
  isSelected,
  isLocked,
  onSelect,
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
        backgroundColor: isSelected
          ? 'rgba(18, 61, 132, 0.35)'
          : isLocked
          ? 'rgba(7, 26, 68, 0.25)'
          : 'rgba(7, 26, 68, 0.4)',
        border: isSelected
          ? '1px solid rgba(192, 200, 216, 0.7)'
          : '1px solid rgba(182, 187, 198, 0.12)',
        boxShadow: isSelected ? '0 0 14px rgba(18,61,132,0.35)' : 'none',
        opacity: isLocked && !isSelected ? 0.55 : 1,
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
      {/* Badge da letra */}
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
          background: isSelected
            ? 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #1a4fa0 100%)'
            : 'rgba(182,187,198,0.08)',
          border: isSelected
            ? '1.5px solid rgba(192,200,216,0.5)'
            : '1.5px solid rgba(182,187,198,0.25)',
          color: isSelected ? 'var(--color-white)' : 'var(--color-silver-medium)',
        }}
      >
        {isSelected ? <Check size={14} strokeWidth={3} /> : id}
      </div>

      {/* Texto */}
      <span
        style={{
          fontSize: '0.95rem',
          lineHeight: '1.45',
          color: isSelected ? 'var(--color-white)' : 'var(--color-silver-light)',
          fontFamily: 'var(--font-body)',
          transition: 'color 0.2s ease',
        }}
      >
        {text}
      </span>
    </div>
  );
};
