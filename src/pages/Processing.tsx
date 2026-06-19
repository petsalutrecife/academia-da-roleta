/**
 * Processing.tsx
 * Processa as respostas do quiz, salva o resultado definitivo e exibe
 * uma animação premium de carregamento antes de redirecionar para a tela de resultados.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ShieldAlert, BarChart3, Loader2 } from 'lucide-react';
import { loadAttempt, clearAttempt } from '../data/quizSession';
import { quizQuestions } from '../data/quizData';
import { buildAttemptResult, type AnswerRecord } from '../utils/resultUtils';
import { saveAttempt as saveHistoricalAttempt } from '../utils/storage';

const STAGES = [
  { message: 'Processando respostas...', icon: <Loader2 className="animate-spin" size={32} color="var(--color-silver-light)" /> },
  { message: 'Analisando perfil de Controle Emocional...', icon: <ShieldAlert size={32} color="#4a90e2" /> },
  { message: 'Calculando métricas de Gestão Financeira...', icon: <BarChart3 size={32} color="#7c9cd4" /> },
  { message: 'Avaliando desempenho de Estratégias...', icon: <Target size={32} color="#a0b4e0" /> },
  { message: 'Gerando relatório detalhado C.G.E...', icon: <Loader2 className="animate-spin" size={32} color="var(--color-success)" /> }
];

export const Processing: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    // 1. Carregar a tentativa atual ativa
    const attempt = loadAttempt();
    if (!attempt) {
      console.error('[Processing] Nenhuma tentativa ativa encontrada.');
      navigate('/');
      return;
    }

    try {
      // 2. Mapear respostas para o formato do histórico
      const mappedAnswers: AnswerRecord[] = attempt.answers.map((ans) => {
        const origQuestion = quizQuestions.find((q) => q.id === ans.questionId);
        const isCorrect = ans.selectedOption === (origQuestion?.correctAnswer ?? '');
        return {
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
          answeredAt: ans.answeredAt,
          rouletteNumber: ans.rouletteNumber,
          rouletteColor: ans.rouletteColor,
          isCorrect,
          pillar: ans.pillar,
        };
      });

      // 3. Gerar o resultado consolidado e salvar
      const resultObj = buildAttemptResult({
        attemptId: attempt.attemptId,
        student: attempt.student || { name: 'Aluno', email: '', phone: '', consent: true },
        startedAt: attempt.startedAt,
        completedAt: new Date().toISOString(),
        totalQuestions: quizQuestions.length,
        answers: mappedAnswers,
      });

      // Salvar na lista de tentativas históricas
      saveHistoricalAttempt(resultObj);
      
      // Salvar o ID selecionado para a página de resultado carregar
      localStorage.setItem('selectedAttemptId', attempt.attemptId);
    } catch (e) {
      console.error('[Processing] Erro ao consolidar resultado:', e);
    }

    // 4. Fluxo de animação dos estágios (2.5s no total)
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 600);

    const timeout = setTimeout(() => {
      // Limpa progresso ativo e vai para o resultado
      clearAttempt();
      navigate('/resultado');
    }, 3100);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const stage = STAGES[currentStage];

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
      {/* Icon Wrapper com pulso */}
      <div
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(18,61,132,0.3) 0%, rgba(7,26,68,0.5) 100%)',
          border: '1px solid rgba(192,200,216,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 0 40px rgba(18,61,132,0.4)',
          transition: 'all 0.3s ease',
        }}
      >
        {stage.icon}
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
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-white)',
            marginBottom: '1.2rem',
            lineHeight: 1.25,
          }}
        >
          Análise em Andamento
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
          role="status"
          aria-live="assertive"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            fontWeight: 600,
            lineHeight: 1.6,
            color: 'var(--color-silver-light)',
            margin: 0,
            height: '2.5em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {stage.message}
        </p>

        {/* Barra de progresso visual simulada */}
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(3, 13, 36, 0.6)',
            borderRadius: '2px',
            marginTop: '1.5rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${((currentStage + 1) / STAGES.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--color-success)',
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      <p
        style={{
          marginTop: '2rem',
          fontSize: '0.72rem',
          color: 'var(--color-silver-dark)',
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.5,
        }}
      >
        Aguarde. O algoritmo do Método C.G.E. está tabulando sua pontuação.
      </p>
    </div>
  );
};
