// src/components/ResultActions.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, RotateCcw, Users, FileText } from 'lucide-react';
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
        width: '100%',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Entrar no Grupo de Alunos */}
        <button
          onClick={() => handleAction(resultActionsConfig.whatsappGroupUrl, 'Entrar no Grupo Oficial')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Vibrant green gradient for WhatsApp/Group
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            transition: 'transform 0.2s ease, filter 0.2s ease',
            width: '100%',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
        >
          <Users size={20} />
          Entrar no Grupo Oficial de Alunos
        </button>

        {/* Visualizar Relatório Completo */}
        <button
          onClick={() => navigate('/relatorio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0a2863 100%)',
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
            width: '100%',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
        >
          <FileText size={20} />
          Visualizar Relatório Detalhado (PDF / E-mail)
        </button>

        {/* Conhecer Método C.G.E. */}
        <button
          onClick={() => handleAction(resultActionsConfig.methodUrl, 'Conhecer Método C.G.E.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'rgba(18, 61, 132, 0.2)',
            color: 'var(--color-white)',
            border: '1px solid rgba(18, 61, 132, 0.4)',
            borderRadius: '12px',
            padding: '1rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, filter 0.2s ease',
            width: '100%',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
        >
          <BookOpen size={20} />
          Conhecer Método C.G.E.
        </button>

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
            width: '100%',
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
    </div>
  );
};
