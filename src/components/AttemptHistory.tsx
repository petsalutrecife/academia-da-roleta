// src/components/AttemptHistory.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, Award, Eye, Trash2, History } from 'lucide-react';
import { loadAttempts, clearAttempts } from '../utils/storage';

export const AttemptHistory: React.FC = () => {
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    setAttempts(loadAttempts());
  }, []);

  const handleSelectAttempt = (attemptId: string) => {
    localStorage.setItem('selectedAttemptId', attemptId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Pequeno atraso para a rolagem suave antes de atualizar
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const handleClearHistory = () => {
    if (confirm('Deseja realmente apagar todo o seu histórico de tentativas locais?')) {
      clearAttempts();
      localStorage.removeItem('selectedAttemptId');
      setAttempts([]);
      window.location.reload();
    }
  };

  if (attempts.length <= 1) {
    return null; // Oculta o histórico se houver apenas 1 tentativa (a atual)
  }

  const activeSelectedId = localStorage.getItem('selectedAttemptId') || (attempts.length > 0 ? attempts[attempts.length - 1].attemptId : '');

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} style={{ color: 'var(--color-silver-medium)' }} />
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--color-white)',
              letterSpacing: '0.05em',
            }}
          >
            HISTÓRICO DE TENTATIVAS (LMT. 10)
          </h3>
        </div>

        <button
          onClick={handleClearHistory}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-red-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Trash2 size={14} />
          Limpar Tudo
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {[...attempts].reverse().map((attempt) => {
          const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(attempt.completedAt));

          const isActive = attempt.attemptId === activeSelectedId;

          return (
            <div
              key={attempt.attemptId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: isActive ? 'rgba(182, 187, 198, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                border: isActive ? '1px solid rgba(182, 187, 198, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} style={{ color: 'var(--color-silver-dark)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-white)', fontWeight: 600 }}>
                    {formattedDate}
                  </span>
                  {isActive && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        background: 'rgba(182, 187, 198, 0.15)',
                        color: 'var(--color-white)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      Exibindo
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-silver-medium)' }}>
                  <Award size={12} />
                  <span>
                    Nível {attempt.level.name} ({attempt.percentage}%)
                  </span>
                  <span>•</span>
                  <span>
                    {attempt.correctAnswers} / {attempt.totalQuestions} acertos
                  </span>
                </div>
              </div>

              {!isActive && (
                <button
                  onClick={() => handleSelectAttempt(attempt.attemptId)}
                  style={{
                    background: 'rgba(182, 187, 198, 0.1)',
                    border: '1px solid rgba(182, 187, 198, 0.2)',
                    color: 'var(--color-white)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(182, 187, 198, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(182, 187, 198, 0.1)';
                  }}
                >
                  <Eye size={12} />
                  Visualizar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
