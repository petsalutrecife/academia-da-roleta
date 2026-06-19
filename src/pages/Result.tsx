// src/pages/Result.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResultHero } from '../components/ResultHero';
import { ScoreCircle } from '../components/ScoreCircle';
import { LevelBadge } from '../components/LevelBadge';
import { PillarPerformanceCard } from '../components/PillarPerformanceCard';
import { StrengthCard } from '../components/StrengthCard';
import { AttentionCard } from '../components/AttentionCard';
import { RecommendationList } from '../components/RecommendationList';
import { EvolutionPlan } from '../components/EvolutionPlan';
import { AnswerReviewAccordion } from '../components/AnswerReviewAccordion';
import { MethodCGECard } from '../components/MethodCGECard';
import { ResultActions } from '../components/ResultActions';
import { ShareResultCard } from '../components/ShareResultCard';
import { AttemptHistory } from '../components/AttemptHistory';
import { AttemptComparison } from '../components/AttemptComparison';
import { getRecommendations } from '../utils/recommendations';

export interface ResultData {
  emo: number;
  fin: number;
  est: number;
  scoreAverage: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: any[];
}

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ResultData | null>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [studentName, setStudentName] = useState('Aluno');
  const [error, setError] = useState<string | null>(null);
  const [previousData, setPreviousData] = useState<{ score: number; level: string; percent: number } | null>(null);

  const getLevelName = (avg: number, totalCorrect?: number) => {
    if (totalCorrect !== undefined) {
      if (totalCorrect <= 12) return 'Iniciante';
      if (totalCorrect <= 18) return 'Básico';
      if (totalCorrect <= 24) return 'Intermediário';
      return 'Avançado';
    }
    if (avg < 45) return 'Iniciante';
    if (avg < 60) return 'Básico';
    if (avg < 80) return 'Intermediário';
    return 'Avançado';
  };

  // Load stored attempt (selected or latest)
  useEffect(() => {
    try {
      const selectedId = localStorage.getItem('selectedAttemptId');
      const attempts = JSON.parse(localStorage.getItem('diagnosticoAttempts') || '[]');
      
      let currentAttempt = null;
      let prevAttempt = null;

      if (selectedId) {
        const attemptIdx = attempts.findIndex((a: any) => a.attemptId === selectedId);
        if (attemptIdx !== -1) {
          currentAttempt = attempts[attemptIdx];
          if (attemptIdx > 0) {
            prevAttempt = attempts[attemptIdx - 1];
          }
        }
      } else {
        currentAttempt = attempts[attempts.length - 1];
        if (attempts.length > 1) {
          prevAttempt = attempts[attempts.length - 2];
        }
      }

      if (!currentAttempt) {
        setError('Não foi possível carregar o resultado completo. Retorne ao início e tente novamente.');
        return;
      }

      setAttempt(currentAttempt);

      const pageData: ResultData = {
        emo: currentAttempt.pillars?.['Controle Emocional']?.percentage || 0,
        fin: currentAttempt.pillars?.['Gestão Financeira']?.percentage || 0,
        est: currentAttempt.pillars?.['Estratégia']?.percentage || 0,
        scoreAverage: currentAttempt.percentage,
        correctAnswers: currentAttempt.correctAnswers,
        totalQuestions: currentAttempt.totalQuestions,
        answers: currentAttempt.answers,
      };

      setData(pageData);
      setStudentName(currentAttempt.student?.name?.split(' ')[0] ?? 'Aluno');

      if (prevAttempt) {
        setPreviousData({
          score: prevAttempt.correctAnswers,
          level: getLevelName(prevAttempt.percentage, prevAttempt.correctAnswers),
          percent: prevAttempt.percentage,
        });
      } else {
        setPreviousData(null);
      }
    } catch (e) {
      console.error(e);
      setError('Erro ao ler os dados locais.');
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-silver-medium)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            border: '1px solid rgba(192,200,216,0.3)',
            background: 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)',
            color: 'var(--color-white)',
          }}
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  if (!data || !attempt) {
    return null;
  }

  const levelName = getLevelName(data.scoreAverage, data.correctAnswers);

  const pillars = [
    { name: 'Controle Emocional', percent: data.emo },
    { name: 'Gestão Financeira', percent: data.fin },
    { name: 'Estratégia', percent: data.est },
  ];
  const maxPercent = Math.max(...pillars.map(p => p.percent));
  const minPercent = Math.min(...pillars.map(p => p.percent));
  const strongPillars = pillars.filter(p => p.percent === maxPercent);
  const attentionPillars = pillars.filter(p => p.percent === minPercent);

  const incorrectPillars = Array.from(new Set(
    data.answers.filter((a: any) => !a.isCorrect).map((a: any) => a.pillar)
  ));

  const recommendations = getRecommendations(data, [], attempt);

  const evolutionSteps = [
    {
      title: 'Revisar',
      description: incorrectPillars.length > 0 
        ? `Revise as questões incorretas nos pilares: ${incorrectPillars.join(', ')}.`
        : 'Excelente! Reforce os fundamentos gerais e continue estudando.',
      priority: maxPercent === 100 ? 'APROFUNDAMENTO' : maxPercent === 0 ? 'ALTA' : 'MÉDIA',
    },
    {
      title: 'Aprofundar',
      description: `Aprofunde o pilar com menor desempenho (${attentionPillars.map(p => p.name).join(' e ')}) e integre-o ao seu plano de estudos diário.`,
      priority: minPercent === 0 ? 'ALTA' : minPercent < 50 ? 'MÉDIA' : 'APROFUNDAMENTO',
    },
    {
      title: 'Aplicar',
      description: 'Pratique os conceitos estudados em simulações controladas mantendo o gerenciamento de risco rígido.',
      priority: 'APROFUNDAMENTO',
    },
  ];

  const handleShare = async () => {
    const text = `Concluí o Diagnóstico da Academia da Roleta e alcancei o nível ${levelName}, com ${data.correctAnswers} de ${data.totalQuestions} acertos (${data.scoreAverage}%) nos conceitos do Método C.G.E.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Meu Resultado - Academia da Roleta', text, url: window.location.href });
      } catch (e) {
        console.error('Share canceled', e);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Resumo do resultado copiado para a área de transferência.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <ResultHero studentName={studentName} />
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <ScoreCircle percentage={data.scoreAverage} />
        <LevelBadge level={levelName as any} />
      </div>

      {/* Título da seção */}
      <h3
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--color-white)',
          marginBottom: '1rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}
      >
        Desempenho por Módulo
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {pillars.map(p => {
          const pillarData = attempt.pillars?.[p.name];
          const correct = pillarData ? pillarData.correct : 0;
          const total = pillarData ? pillarData.total : 10;
          const mLevelName = pillarData?.level?.name || 'Iniciante';
          const mLevelEmoji = pillarData?.level?.emoji || '🟢';
          
          return (
            <PillarPerformanceCard
              key={p.name}
              pillar={p.name as any}
              percent={p.percent}
              correct={correct}
              total={total}
              levelName={mLevelName}
              levelEmoji={mLevelEmoji}
            />
          );
        })}
      </div>

      {strongPillars.length === 1 && (
        <StrengthCard
          pillar={strongPillars[0].name}
          percent={strongPillars[0].percent}
          description={
            strongPillars[0].name === 'Controle Emocional'
              ? 'Você demonstrou boa disciplina mental e discernimento sobre o equilíbrio emocional, com forte noção de como evitar o estado de Tilt.'
              : strongPillars[0].name === 'Gestão Financeira'
              ? 'Você compreende bem a importância de preservar o bankroll e aplicar limites rígidos de Stop Loss operacional.'
              : 'Você tem excelente entendimento sobre leitura estruturada de mesa, confluências de fatores e critérios técnicos de entrada.'
          }
        />
      )}
      {strongPillars.length > 1 && (
        <StrengthCard
          pillar="SEUS DESTAQUES"
          percent={maxPercent}
          description={`${strongPillars.map(p => p.name).join(' e ')} apresentaram o mesmo alto desempenho nesta avaliação modular.`}
        />
      )}

      <AttentionCard
        pillars={attentionPillars}
        description={
          attentionPillars.length === 1
            ? attentionPillars[0].name === 'Controle Emocional'
              ? 'Mantenha a atenção focada em como suas emoções e o estresse (cortisol) podem perturbar seu planejamento tático.'
              : attentionPillars[0].name === 'Gestão Financeira'
              ? 'Revise os fundamentos de separação de banca, variância matemática e limites operacionais diários.'
              : 'Aprofunde-se em como funciona a confluência de fatores técnicos na mesa e a marcação correta das zonas de race.'
            : 'Os pilares destacados necessitam de revisão cuidadosa para equilibrar sua performance.'
        }
      />

      <RecommendationList items={recommendations} />
      <EvolutionPlan steps={evolutionSteps} />
      <AnswerReviewAccordion items={data.answers} />
      <MethodCGECard />

      <div style={{ textAlign: 'center', margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={handleShare}
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.85rem 2rem',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)',
            color: 'var(--color-white)',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(18,61,132,0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          Compartilhar Resultado
        </button>
        <ShareResultCard level={levelName} percent={data.scoreAverage} score={data.correctAnswers} />
      </div>

      <ResultActions />
      <AttemptHistory />
      <AttemptComparison
        current={{ score: data.correctAnswers, level: levelName, percent: data.scoreAverage }}
        previous={previousData}
      />
    </div>
  );
};
