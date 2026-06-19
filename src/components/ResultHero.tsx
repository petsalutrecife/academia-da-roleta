// src/components/ResultHero.tsx
import React from 'react';
import { Logo } from './Logo';

interface ResultHeroProps {
  studentName: string;
  date?: Date;
}

export const ResultHero: React.FC<ResultHeroProps> = ({ studentName, date }) => {
  const today = date ? date : new Date();
  
  // Formata a data nativamente no padrão pt-BR
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(today);

  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '2rem',
        animation: 'fadeIn 0.8s ease forwards',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Logo size="lg" showText={false} className="mb-4" />
      <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', margin: '1rem 0 0 0' }}>
        SEU DIAGNÓSTICO ESTÁ PRONTO!
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--color-silver-medium)', marginTop: '0.5rem' }}>
        Parabéns, {studentName}. Você concluiu o Diagnóstico do Método C.G.E.
      </p>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-silver-dark)' }}>
        {formattedDate}
      </p>
    </div>
  );
};

