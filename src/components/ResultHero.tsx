// src/components/ResultHero.tsx
import React from 'react';
import { format } from 'date-fns';
import logo from '../assets/logo.png'; // assume placeholder logo

interface ResultHeroProps {
  studentName: string;
  date?: Date;
}

export const ResultHero: React.FC<ResultHeroProps> = ({ studentName, date }) => {
  const today = date ? date : new Date();
  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '2rem',
        animation: 'fadeIn 0.8s ease forwards',
      }}
    >
      <img src={logo} alt="Academia da Roleta" style={{ width: '80px', marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', margin: 0 }}>
        SEU DIAGNÓSTICO ESTÁ PRONTO!
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--color-silver-medium)', marginTop: '0.5rem' }}>
        Parabéns, {studentName}. Você concluiu o Diagnóstico do Método C.G.E.
      </p>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-silver-dark)' }}>
        {format(today, 'dd/MM/yyyy')}
      </p>
    </div>
  );
};
