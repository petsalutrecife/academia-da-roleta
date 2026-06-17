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
  const [studentName, setStudentName] = useState('Aluno');
  const [error, setError] = useState<string | null>(null);

  // Load stored attempt (selected or latest)
  useEffect(() => {
    try {
      const selectedId = localStorage.getItem('selectedAttemptId');
      const attempts = JSON.parse(localStorage.getItem('diagnosticoAttempts') || '[]');
      const attempt = selectedId
        ? attempts.find((a: any) => a.attemptId === selectedId)
        : attempts[attempts.length - 1];
      if (!attempt) {
        setError('Não foi possível carregar o resultado completo. Retorne ao início e tente novamente.');
        return;
      }
      const pageData: ResultData = {
        emo: attempt.pillars['Controle Emocional']?.percentage || 0,
        fin: attempt.pillars['Gestão Financeira']?.percentage || 0,
        est: attempt.pillars['Estratégia']?.percentage || 0,
        scoreAverage: attempt.percentage,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        answers: attempt.answers,
      };
      setData(pageData);
      setStudentName(attempt.student.name.split(' ')[0]);
    } catch (e) {
      console.error(e);
      setError('Erro ao ler os dados locais.');
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-silver-medium)' }}>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Voltar ao início</button>
      </div>
    );
  }

  if (!data) {
    return null; // loading spinner could be added later
  }

  const getLevelName = (avg: number) => {
    if (avg < 50) return 'Iniciante';
    if (avg < 80) return 'Básico';
    if (avg < 100) return 'Intermediário';
    return 'Avançado';
  };

  const levelName = getLevelName(data.scoreAverage);

  const pillars = [
    { name: 'Controle Emocional', percent: data.emo },
    { name: 'Gestão Financeira', percent: data.fin },
    { name: 'Estratégia', percent: data.est },
  ];
  const maxPercent = Math.max(...pillars.map(p => p.percent));
  const minPercent = Math.min(...pillars.map(p => p.percent));
  const strongPillars = pillars.filter(p => p.percent === maxPercent);
  const attentionPillars = pillars.filter(p => p.percent === minPercent);

  const incorrectAnswers = data.answers
    .filter((a: any) => !a.isCorrect)
    .map((a: any) => a.pillar?.toLowerCase().replace(/ /g, ''));

  const recommendations = getRecommendations(data, incorrectAnswers, null);

  const evolutionSteps = [
    {
      title: 'Revisar',
      description: incorrectAnswers.length > 0 ? `Revise os conceitos: ${incorrectAnswers.join(', ')}` : 'Reforce os fundamentos gerais.',
      priority: maxPercent === 100 ? 'APROFUNDAMENTO' : maxPercent === 0 ? 'ALTA' : 'MÉDIA',
    },
    {
      title: 'Aprofundar',
      description: `Aprofunde o pilar com menor desempenho (${attentionPillars.map(p => p.name).join(' e ')}) e relacione-o aos demais.`,
      priority: minPercent === 0 ? 'ALTA' : minPercent < 50 ? 'MÉDIA' : 'APROFUNDAMENTO',
    },
    {
      title: 'Aplicar',
      description: 'Utilize os conteúdos estudados em exercícios e simulações, mantendo disciplina.',
      priority: 'APROFUNDAMENTO',
    },
  ];

  const handleShare = async () => {
    const text = `Concluí o Diagnóstico da Academia da Roleta e alcancei o nível ${levelName}, com ${data.scoreAverage}% de aproveitamento nos conceitos do Método C.G.E.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Meu Resultado', text, url: window.location.href });
      } catch (e) {
        console.error('Share canceled', e);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Resumo do resultado copiado.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <ResultHero studentName={studentName} />
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <ScoreCircle percentage={data.scoreAverage} />
        <LevelBadge level={levelName as any} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {pillars.map(p => (
          <PillarPerformanceCard
            key={p.name}
            pillar={p.name as any}
            percent={p.percent}
            correct={Math.round((p.percent / 100) * (p.name === 'Estratégia' ? 1 : 2))}
            total={p.name === 'Estratégia' ? 1 : 2}
          />
        ))}
      </div>

      {strongPillars.length === 1 && (
        <StrengthCard
          pillar={strongPillars[0].name}
          percent={strongPillars[0].percent}
          description={
            strongPillars[0].name === 'Controle Emocional'
              ? 'Você demonstrou compreender os conceitos avaliados sobre equilíbrio emocional, foco e decisões impulsivas.'
              : strongPillars[0].name === 'Gestão Financeira'
              ? 'Você demonstrou compreender os conceitos avaliados sobre organização da banca e definição de limites.'
              : 'Você demonstrou compreender o conceito avaliado sobre a combinação de fatores de análise.'
          }
        />
      )}
      {strongPillars.length > 1 && (
        <StrengthCard
          pillar="SEUS DESTAQUES"
          percent={maxPercent}
          description={`${strongPillars.map(p => p.name).join(' e ')} apresentaram o mesmo alto desempenho nesta avaliação.`}
        />
      )}

      <AttentionCard
        pillars={attentionPillars}
        description={
          attentionPillars.length === 1
            ? attentionPillars[0].name === 'Controle Emocional'
              ? 'Revise como estados emocionais, como Tilt e Flow, podem influenciar a qualidade das decisões.'
              : attentionPillars[0].name === 'Gestão Financeira'
              ? 'Revise os conceitos de Bankroll e Stop Loss, especialmente a separação do capital e a definição de limites.'
              : 'Revise o conceito de Confluência e como diferentes fatores de análise podem apontar para uma mesma possibilidade.'
            : 'Os pilares abaixo merecem atenção conjunta.'
        }
      />

      <RecommendationList items={recommendations} />
      <EvolutionPlan steps={evolutionSteps} />
      <AnswerReviewAccordion items={data.answers} />
      <MethodCGECard />

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button onClick={handleShare} style={{ background: 'var(--color-primary)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none' }}>
          Compartilhar Resultado
        </button>
        <ShareResultCard level={levelName} percent={data.scoreAverage} score={data.correctAnswers} />
      </div>

      <ResultActions />
      <AttemptHistory />
      <AttemptComparison
        current={{ score: data.correctAnswers, level: levelName, percent: data.scoreAverage }}
        previous={null}
      />
    </div>
  );
};
