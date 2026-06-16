/**
 * QuizProgress.tsx
 * Indicador visual de progresso do quiz: "Pergunta X de 5" + dots ● ○ ○ ○ ○
 */

import React from 'react';

interface QuizProgressProps {
  current: number;       // 1-based, pergunta atual
  total: number;         // total de perguntas (5)
  answeredCount: number; // quantas já foram confirmadas
}

export const QuizProgress: React.FC<QuizProgressProps> = ({ current, total, answeredCount }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Pergunta ${current} de ${total}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Texto */}
      <p
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-silver-medium)',
          margin: 0,
        }}
      >
        Pergunta{' '}
        <span style={{ color: 'var(--color-white)' }}>{current}</span>
        {' '}de{' '}
        <span style={{ color: 'var(--color-white)' }}>{total}</span>
      </p>

      {/* Dots */}
      <div
        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        aria-hidden="true"
      >
        {Array.from({ length: total }).map((_, i) => {
          const stepNumber = i + 1;
          const isDone = stepNumber < current && i < answeredCount;
          const isCurrent = stepNumber === current;

          return (
            <div
              key={i}
              title={
                isDone
                  ? `Pergunta ${stepNumber} respondida`
                  : isCurrent
                  ? `Pergunta ${stepNumber} atual`
                  : `Pergunta ${stepNumber}`
              }
              style={{
                width: isCurrent ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                background: isDone
                  ? 'linear-gradient(90deg, var(--color-blue-highlight), #4a90e2)'
                  : isCurrent
                  ? 'linear-gradient(90deg, #c0c8d8, var(--color-white))'
                  : 'rgba(182, 187, 198, 0.2)',
                border: isCurrent
                  ? '1px solid rgba(255,255,255,0.4)'
                  : isDone
                  ? '1px solid rgba(18,61,132,0.6)'
                  : '1px solid rgba(182,187,198,0.15)',
                boxShadow: isCurrent
                  ? '0 0 8px rgba(255,255,255,0.3)'
                  : isDone
                  ? '0 0 6px rgba(18,61,132,0.5)'
                  : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
