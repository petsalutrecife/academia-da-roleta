// src/components/AnswerReviewAccordion.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { quizQuestions } from '../data/quizData';

interface AnswerReviewItem {
  questionId: string;
  selectedOption: string;
  rouletteNumber: number;
  rouletteColor: string;
  isCorrect?: boolean;
  pillar: string;
}

interface AnswerReviewAccordionProps {
  items: AnswerReviewItem[];
}

export const AnswerReviewAccordion: React.FC<AnswerReviewAccordionProps> = ({ items }) => {
  const [openQuestionIds, setOpenQuestionIds] = useState<string[]>([]);

  const toggleAccordion = (qId: string) => {
    if (openQuestionIds.includes(qId)) {
      setOpenQuestionIds(openQuestionIds.filter((id) => id !== qId));
    } else {
      setOpenQuestionIds([...openQuestionIds, qId]);
    }
  };

  // Agrupamento por módulo
  const modulesGroup = [
    {
      title: '1. Controle Emocional',
      items: items.filter((item) => item.pillar === 'Controle Emocional'),
    },
    {
      title: '2. Gestão Financeira',
      items: items.filter((item) => item.pillar === 'Gestão Financeira'),
    },
    {
      title: '3. Estratégias',
      items: items.filter((item) => item.pillar === 'Estratégia' || item.pillar === 'Estratégias'),
    },
  ];

  return (
    <div
      style={{
        background: 'rgba(10, 40, 99, 0.1)',
        border: '1px solid rgba(182, 187, 198, 0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        animation: 'slideUp 0.6s ease forwards',
      }}
    >
      <h3
        style={{
          margin: '0 0 1.5rem 0',
          fontFamily: 'var(--font-title)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--color-white)',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        REVISÃO DETALHADA DAS QUESTÕES
      </h3>

      {modulesGroup.map((mod, modIdx) => {
        if (mod.items.length === 0) return null;

        return (
          <div key={modIdx} style={{ marginBottom: '2rem' }}>
            {/* Título do módulo */}
            <h4
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--color-silver-light)',
                letterSpacing: '0.06em',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(182, 187, 198, 0.15)',
                paddingBottom: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              {mod.title}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mod.items.map((item, index) => {
                const origQuestion = quizQuestions.find((q) => q.id === item.questionId);
                if (!origQuestion) return null;

                const isExpanded = openQuestionIds.includes(item.questionId);
                const isCorrect = item.isCorrect ?? (item.selectedOption === origQuestion.correctAnswer);

                return (
                  <div
                    key={index}
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      background: isExpanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(item.questionId)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        textAlign: 'left',
                        outline: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        {isCorrect ? (
                          <CheckCircle2 size={22} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                        ) : (
                          <XCircle size={22} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: 'var(--color-silver-medium)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Pergunta {origQuestion.questionNumber}
                          </span>
                          <span
                            style={{
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              color: 'var(--color-white)',
                              marginTop: '0.2rem',
                            }}
                          >
                            {origQuestion.text}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        {/* Badge do Giro da Roleta */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: item.rouletteColor === 'green' ? '#10B981' : item.rouletteColor === 'red' ? '#EF4444' : '#1F2937',
                            color: '#FFF',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          Giro: {item.rouletteNumber} ({item.rouletteColor === 'red' ? 'V' : item.rouletteColor === 'black' ? 'P' : 'Z'})
                        </div>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '0 1.25rem 1.25rem 1.25rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          animation: 'fadeIn 0.3s ease forwards',
                        }}
                      >
                        {/* Options List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                          {origQuestion.options.map((opt) => {
                            const isSelected = item.selectedOption === opt.id;
                            const isAnswerCorrect = origQuestion.correctAnswer === opt.id;
                            
                            let optionStyle: React.CSSProperties = {
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              lineHeight: '1.4',
                              background: 'rgba(255, 255, 255, 0.01)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              color: 'var(--color-silver-medium)',
                            };

                            if (isAnswerCorrect) {
                              optionStyle.background = 'rgba(16, 185, 129, 0.1)';
                              optionStyle.border = '1px solid rgba(16, 185, 129, 0.3)';
                              optionStyle.color = '#FFF';
                            } else if (isSelected) {
                              optionStyle.background = 'rgba(239, 68, 68, 0.1)';
                              optionStyle.border = '1px solid rgba(239, 68, 68, 0.3)';
                              optionStyle.color = '#FFF';
                            }

                            return (
                              <div key={opt.id} style={optionStyle}>
                                <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{opt.id})</span>
                                {opt.text}
                                {isAnswerCorrect && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginLeft: '0.5rem', fontWeight: 600 }}>
                                    (Correta)
                                  </span>
                                )}
                                {isSelected && !isAnswerCorrect && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-error)', marginLeft: '0.5rem', fontWeight: 600 }}>
                                    (Sua Escolha)
                                  </span>
                                )}
                                {isSelected && isAnswerCorrect && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginLeft: '0.5rem', fontWeight: 600 }}>
                                    (Sua Escolha - Correta!)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Section */}
                        <div
                          style={{
                            marginTop: '1.25rem',
                            padding: '1rem',
                            borderRadius: '8px',
                            background: 'rgba(182, 187, 198, 0.03)',
                            border: '1px solid rgba(182, 187, 198, 0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <HelpCircle size={16} style={{ color: 'var(--color-silver-medium)' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-white)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Explicação
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-silver-light)', lineHeight: '1.5' }}>
                            {origQuestion.explanation}
                          </p>

                          {origQuestion.studyTip && (
                            <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isCorrect ? 'var(--color-success)' : 'var(--color-warning)', textTransform: 'uppercase' }}>
                                {isCorrect ? 'Orientação de Manutenção:' : 'Orientação de Estudo:'}
                              </span>
                              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-silver-medium)', lineHeight: '1.4' }}>
                                {origQuestion.studyTip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
