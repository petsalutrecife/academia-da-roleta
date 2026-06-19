/**
 * QuestionCard.tsx
 * Card da pergunta com: categoria/pilar, número, texto principal, alternativas e feedback imediato.
 */

import React from 'react';
import { AnswerOption } from './AnswerOption';
import type { QuizQuestion, OptionId } from '../data/quizData';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: OptionId | null;
  isLocked: boolean; // Equivale a isConfirmed
  onSelectOption: (id: OptionId) => void;
}

// Cor de destaque por pilar
const pillarColors: Record<string, string> = {
  'Controle Emocional': '#4a90e2',
  'Gestão Financeira': '#7c9cd4',
  'Estratégia': '#a0b4e0',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  isLocked,
  onSelectOption,
}) => {
  const pillarColor = pillarColors[question.pillar] ?? 'var(--color-silver-medium)';
  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(160deg, rgba(7,26,68,0.7) 0%, rgba(3,13,36,0.85) 100%)',
        border: '1px solid rgba(192,200,216,0.15)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        animation: 'fadeIn 0.35s ease forwards',
      }}
    >
      {/* Cabeçalho do card */}
      <div
        style={{
          padding: '1rem 1.4rem 0.9rem',
          borderBottom: '1px solid rgba(192,200,216,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          background: 'rgba(7,26,68,0.4)',
        }}
      >
        {/* Pilar / Módulo */}
        <span
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: pillarColor,
            padding: '0.25rem 0.7rem',
            borderRadius: '20px',
            border: `1px solid ${pillarColor}33`,
            background: `${pillarColor}14`,
          }}
        >
          {question.pillar}
        </span>

        {/* Contador */}
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-silver-medium)',
            flexShrink: 0,
          }}
        >
          Pergunta{' '}
          <strong style={{ color: 'var(--color-silver-light)' }}>{questionNumber}</strong>
          {' '}de{' '}
          <strong style={{ color: 'var(--color-silver-light)' }}>{totalQuestions}</strong>
          {' '}no módulo
        </span>
      </div>

      {/* Corpo */}
      <div style={{ padding: '1.4rem' }}>
        {/* Texto da pergunta */}
        <p
          style={{
            fontSize: '1.05rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            lineHeight: '1.55',
            color: 'var(--color-white)',
            marginBottom: '1.4rem',
          }}
        >
          {question.text}
        </p>

        {/* Alternativas */}
        <div
          role="radiogroup"
          aria-label="Alternativas"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
        >
          {question.options.map((opt) => (
            <AnswerOption
              key={opt.id}
              id={opt.id}
              text={opt.text}
              isSelected={selectedOption === opt.id}
              isLocked={isLocked}
              onSelect={onSelectOption}
              isCorrectAlternative={opt.id === question.correctAnswer}
              isConfirmed={isLocked}
            />
          ))}
        </div>

        {/* Painel de Feedback Imediato */}
        {isLocked && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(7, 26, 68, 0.4)',
              border: isCorrect
                ? '1px solid rgba(16, 185, 129, 0.25)'
                : '1px solid rgba(239, 68, 68, 0.25)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.4s ease forwards',
            }}
          >
            {/* Mensagem principal de acerto/erro */}
            <p
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                margin: '0 0 0.8rem 0',
                color: isCorrect ? 'var(--color-success)' : 'var(--color-error)',
              }}
            >
              {isCorrect ? '✓ Resposta correta.' : '✗ Resposta incorreta. Veja a alternativa correta destacada.'}
            </p>

            {/* Divisor */}
            <div
              style={{
                height: '1px',
                background: 'rgba(182, 187, 198, 0.1)',
                marginBottom: '0.8rem',
              }}
            />

            {/* Explicação da resposta */}
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--color-silver-light)',
                lineHeight: '1.55',
                margin: '0 0 0.8rem 0',
              }}
            >
              <strong style={{ color: 'var(--color-white)', fontFamily: 'var(--font-title)', fontSize: '0.8rem', letterSpacing: '0.02em', display: 'block', marginBottom: '0.15rem' }}>
                EXPLICAÇÃO:
              </strong>
              {question.explanation}
            </p>

            {/* Dica de estudo */}
            {question.studyTip && (
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--color-silver-medium)',
                  lineHeight: '1.5',
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                <strong style={{ color: 'var(--color-warning)', fontStyle: 'normal', fontFamily: 'var(--font-title)', fontSize: '0.8rem', letterSpacing: '0.02em', display: 'block', marginBottom: '0.15rem' }}>
                  DICA DE ESTUDO:
                </strong>
                {question.studyTip}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
