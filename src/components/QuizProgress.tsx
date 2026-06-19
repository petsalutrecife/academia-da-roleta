/**
 * QuizProgress.tsx
 * Indicador visual de progresso do quiz atualizado:
 * - Módulo atual (1 de 3) e seu título.
 * - Pergunta atual no módulo e pergunta global no diagnóstico.
 * - Barra de progresso geral de 0% a 100%.
 * - Barra / badges por módulo com contagem de 0 a 10.
 */

import React from 'react';

interface QuizProgressProps {
  currentGlobal: number;            // 1 a 30
  totalGlobal: number;              // 30
  currentModuleIndex: number;       // 0, 1 ou 2
  currentModuleQuestion: number;    // 1 a 10
  moduleTitle: string;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentGlobal,
  totalGlobal,
  currentModuleIndex,
  currentModuleQuestion,
  moduleTitle,
}) => {
  // Porcentagem de progresso geral
  // Usamos (currentGlobal - 1) para representar a porcentagem de progresso real concluído antes da atual,
  // ou simplesmente (currentGlobal / totalGlobal) * 100 para o progresso incluindo a questão sob visualização.
  // Vamos usar a questão sob visualização para ficar alinhado ao indicador.
  const overallPercentage = Math.round((currentGlobal / totalGlobal) * 100);

  // Calcular contagens para os indicadores individuais dos módulos
  let ceCount = 0;
  let gfCount = 0;
  let esCount = 0;

  if (currentGlobal <= 10) {
    ceCount = currentModuleQuestion;
    gfCount = 0;
    esCount = 0;
  } else if (currentGlobal <= 20) {
    ceCount = 10;
    gfCount = currentModuleQuestion;
    esCount = 0;
  } else {
    ceCount = 10;
    gfCount = 10;
    esCount = currentModuleQuestion;
  }

  // Cores ativas e inativas para badges
  const getBadgeStyle = (index: number) => {
    const isActive = currentModuleIndex === index;
    const isCompleted = currentModuleIndex > index;
    
    return {
      flex: 1,
      padding: '0.5rem 0.4rem',
      borderRadius: '8px',
      fontSize: '0.72rem',
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      textAlign: 'center' as const,
      border: isActive 
        ? '1px solid rgba(192, 200, 216, 0.4)' 
        : isCompleted 
        ? '1px solid rgba(16, 185, 129, 0.2)' 
        : '1px solid rgba(182, 187, 198, 0.08)',
      background: isActive
        ? 'rgba(18, 61, 132, 0.3)'
        : isCompleted
        ? 'rgba(16, 185, 129, 0.08)'
        : 'rgba(7, 26, 68, 0.2)',
      color: isActive
        ? 'var(--color-white)'
        : isCompleted
        ? 'var(--color-success)'
        : 'var(--color-silver-dark)',
      transition: 'all 0.3s ease',
    };
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Módulo ${currentModuleIndex + 1}: ${moduleTitle}. Pergunta ${currentGlobal} de ${totalGlobal}.`}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        padding: '1.2rem',
        borderRadius: '12px',
        background: 'rgba(7, 26, 68, 0.25)',
        border: '1px solid rgba(182, 187, 198, 0.08)',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      {/* 1. Módulo e Título */}
      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-silver-medium)',
            margin: '0 0 0.15rem 0',
          }}
        >
          Módulo {currentModuleIndex + 1} de 3 — {moduleTitle}
        </h3>
        <p
          style={{
            fontSize: '0.72rem',
            color: 'var(--color-silver-dark)',
            margin: 0,
          }}
        >
          Pergunta {currentModuleQuestion} de 10 neste módulo • {currentGlobal} de {totalGlobal} no geral
        </p>
      </div>

      {/* 2. Barra de Progresso Geral */}
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--color-silver-medium)',
            marginBottom: '0.25rem',
          }}
        >
          <span>Progresso Geral</span>
          <span>{overallPercentage}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(3, 13, 36, 0.6)',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid rgba(182, 187, 198, 0.05)',
          }}
        >
          <div
            style={{
              width: `${overallPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-blue-highlight) 0%, #4a90e2 100%)',
              borderRadius: '3px',
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </div>

      {/* 3. Indicadores por Módulo */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.15rem',
          width: '100%',
        }}
        aria-hidden="true"
      >
        <div style={getBadgeStyle(0)}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '0.1rem' }}>C. Emocional</div>
          <div>{ceCount} / 10</div>
        </div>
        <div style={getBadgeStyle(1)}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '0.1rem' }}>G. Financeira</div>
          <div>{gfCount} / 10</div>
        </div>
        <div style={getBadgeStyle(2)}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '0.1rem' }}>Estratégias</div>
          <div>{esCount} / 10</div>
        </div>
      </div>
    </div>
  );
};
