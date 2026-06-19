// src/components/ResultActions.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, RotateCcw } from 'lucide-react';
import { resultActionsConfig } from '../config/resultActionsConfig';

export const ResultActions: React.FC = () => {
  const navigate = useNavigate();

  const handleAction = (url: string, label: string) => {
    if (!url) {
      alert(`Link de demonstração: o acesso para "${label}" será disponibilizado em breve na versão de produção.`);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRestart = () => {
    // Limpa a tentativa ativa selecionada para permitir novo início limpo
    localStorage.removeItem('selectedAttemptId');
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '2rem',
        marginBottom: '2rem',
        animation: 'slideUp 0.6s ease forwards',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Falar com a Mentora */}
        <button
          onClick={() => handleAction(resultActionsConfig.mentorWhatsappUrl, 'Falar com Mentora')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'var(--color-primary)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(18, 61, 132, 0.4)',
            transition: 'transform 0.2s ease, filter 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
        >
          <MessageSquare size={20} />
          Falar com a Mentora
        </button>

        {/* Conhecer Método C.G.E. */}
        <button
          onClick={() => handleAction(resultActionsConfig.methodUrl, 'Conhecer Método C.G.E.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'rgba(182, 187, 198, 0.1)',
            color: 'var(--color-white)',
            border: '1px solid rgba(182, 187, 198, 0.25)',
            borderRadius: '12px',
            padding: '1rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(182, 187, 198, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(182, 187, 198, 0.1)';
          }}
        >
          <BookOpen size={20} />
          Conhecer Método C.G.E.
        </button>
      </div>

      {/* Refazer o Diagnóstico */}
      <button
        onClick={handleRestart}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          background: 'transparent',
          color: 'var(--color-silver-medium)',
          border: '1px dashed rgba(182, 187, 198, 0.3)',
          borderRadius: '12px',
          padding: '0.75rem',
          fontFamily: 'var(--font-title)',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFF';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-silver-medium)';
          e.currentTarget.style.borderColor = 'rgba(182, 187, 198, 0.3)';
        }}
      >
        <RotateCcw size={16} />
        Refazer Diagnóstico
      </button>
    </div>
  );
};
