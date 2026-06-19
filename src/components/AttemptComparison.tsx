// src/components/AttemptComparison.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';

interface AttemptData {
  score: number;
  level: string;
  percent: number;
}

interface AttemptComparisonProps {
  current: AttemptData;
  previous: AttemptData | null;
}

export const AttemptComparison: React.FC<AttemptComparisonProps> = ({ current, previous }) => {
  if (!previous) {
    return (
      <div
        style={{
          background: 'rgba(182, 187, 198, 0.03)',
          border: '1px solid rgba(182, 187, 198, 0.1)',
          borderRadius: '12px',
          padding: '1.25rem',
          textAlign: 'center',
          marginBottom: '2rem',
          animation: 'fadeIn 0.8s ease forwards',
        }}
      >
        <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '50%', background: 'rgba(182, 187, 198, 0.05)', marginBottom: '0.5rem' }}>
          <Star size={20} style={{ color: 'var(--color-silver-medium)' }} />
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-silver-medium)' }}>
          Este é o seu primeiro diagnóstico registrado. Continue estudando os pilares do Método C.G.E. para evoluir seu desempenho!
        </p>
      </div>
    );
  }

  const percentDiff = current.percent - previous.percent;

  const getEvolutionText = () => {
    if (percentDiff > 0) {
      return {
        title: 'EVOLUÇÃO DETECTADA!',
        text: `Parabéns! Você evoluiu ${percentDiff}% comparado ao seu diagnóstico anterior (que foi de ${previous.percent}% com nível ${previous.level}).`,
        color: 'var(--color-green-light)',
        icon: <TrendingUp size={24} style={{ color: 'var(--color-green-light)' }} />,
      };
    } else if (percentDiff < 0) {
      return {
        title: 'MANTENHA O FOCO',
        text: `Seu desempenho diminuiu ${Math.abs(percentDiff)}% em relação ao teste anterior (que foi de ${previous.percent}% com nível ${previous.level}). Revise as orientações dos pilares com atenção.`,
        color: '#EF4444',
        icon: <TrendingDown size={24} style={{ color: '#EF4444' }} />,
      };
    } else {
      return {
        title: 'DESEMPENHO CONSTANTE',
        text: `Você manteve o mesmo aproveitamento de ${current.percent}% da tentativa anterior. Foque no pilar de menor rendimento para atingir o próximo nível.`,
        color: 'var(--color-silver-medium)',
        icon: <Minus size={24} style={{ color: 'var(--color-silver-medium)' }} />,
      };
    }
  };

  const evolution = getEvolutionText();

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(182, 187, 198, 0.15)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        animation: 'slideUp 0.6s ease forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        {evolution.icon}
        <div>
          <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-silver-medium)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Comparação de Desempenho
          </h4>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: evolution.color }}>
            {evolution.title}
          </h3>
        </div>
      </div>

      <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', color: 'var(--color-silver-medium)', lineHeight: '1.5' }}>
        {evolution.text}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem', background: 'rgba(0, 0, 0, 0.1)', padding: '1rem', borderRadius: '12px' }}>
        {/* Previous */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)', textTransform: 'uppercase', fontWeight: 600 }}>Anterior</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-silver-medium)', margin: '0.2rem 0' }}>
            {previous.percent}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>Nível {previous.level}</span>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Current */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)', textTransform: 'uppercase', fontWeight: 600 }}>Atual</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-white)', margin: '0.2rem 0' }}>
            {current.percent}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-white)', fontWeight: 600 }}>Nível {current.level}</span>
        </div>
      </div>
    </div>
  );
};
