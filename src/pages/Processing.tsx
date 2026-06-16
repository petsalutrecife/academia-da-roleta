/**
 * Processing.tsx — Tela provisória de conclusão do diagnóstico (Etapa 3).
 * Não exibe pontuação, percentual ou classificação — apenas confirma o registro.
 * A análise de resultados será implementada na Etapa 4.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { clearAttempt } from '../data/quizSession';

export const Processing: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Limpar a tentativa ao concluir — diagnóstico foi encerrado com sucesso
    clearAttempt();
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 160px)',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      {/* Ícone de sucesso */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(18,61,132,0.3) 0%, rgba(7,26,68,0.5) 100%)',
          border: '1px solid rgba(192,200,216,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 0 30px rgba(18,61,132,0.3)',
          animation: 'fadeIn 0.6s ease 0.2s both',
        }}
      >
        <CheckCircle size={40} color="rgba(192,200,216,0.8)" strokeWidth={1.5} />
      </div>

      {/* Card central */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(160deg, rgba(7,26,68,0.7) 0%, rgba(3,13,36,0.85) 100%)',
          border: '1px solid rgba(192,200,216,0.15)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.5s ease 0.1s both',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.6rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-white)',
            marginBottom: '1rem',
            lineHeight: 1.25,
          }}
        >
          Diagnóstico Concluído
        </h1>

        <div
          style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(192,200,216,0.5), transparent)',
            margin: '0 auto 1.5rem',
          }}
        />

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            lineHeight: 1.65,
            color: 'var(--color-silver-light)',
            marginBottom: '2rem',
          }}
        >
          Suas respostas foram registradas com sucesso.
          <br />
          A análise do resultado será implementada em uma próxima etapa.
        </p>

        {/* Botão voltar */}
        <button
          id="btn-voltar-inicio"
          onClick={handleGoHome}
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0.85rem 2rem',
            borderRadius: '10px',
            cursor: 'pointer',
            border: '1px solid rgba(192,200,216,0.25)',
            background: 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)',
            color: 'var(--color-white)',
            boxShadow: '0 4px 16px rgba(18,61,132,0.35)',
            transition: 'all 0.25s ease',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(18,61,132,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(18,61,132,0.35)';
          }}
        >
          Voltar à Página Inicial
        </button>
      </div>

      {/* Nota de rodapé */}
      <p
        style={{
          marginTop: '1.5rem',
          fontSize: '0.72rem',
          color: 'var(--color-silver-dark)',
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.5,
        }}
      >
        Este diagnóstico é um instrumento educacional da Academia da Roleta.
        Não envolve apostas ou valores financeiros.
      </p>
    </div>
  );
};
