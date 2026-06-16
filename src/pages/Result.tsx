import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ContentCard } from '../components/ContentCard';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { Award, FileText, ArrowRight, Activity, ShieldAlert, BarChart3, Target } from 'lucide-react';

interface ResultData {
  emo: number;
  fin: number;
  est: number;
  scoreAverage: number;
}

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultData>({ emo: 65, fin: 50, est: 70, scoreAverage: 61 });
  const [studentName, setStudentName] = useState('Aluno');

  useEffect(() => {
    const data = localStorage.getItem('quiz_results');
    if (data) {
      setResults(JSON.parse(data));
    }
    const studentInfo = localStorage.getItem('student_info');
    if (studentInfo) {
      const parsed = JSON.parse(studentInfo);
      if (parsed.name) {
        setStudentName(parsed.name.split(' ')[0]);
      }
    }
  }, []);

  const getProfile = (avg: number) => {
    if (avg < 50) return { title: 'Iniciante / Conservador', desc: 'Sua mentalidade estatística necessita de reforço imediato. Tendência à impulsividade e falta de gestão de risco.', color: '#EF4444' };
    if (avg < 80) return { title: 'Operador Intermediário', desc: 'Você conhece as regras básicas, mas desliza na disciplina emocional ou na gestão sob pressão. Precisa de ajustes estratégicos.', color: '#F59E0B' };
    return { title: 'Estrategista Profissional', desc: 'Parabéns! Suas respostas refletem alta disciplina emocional, excelente gestão de risco e raciocínio de probabilidades refinado.', color: '#10B981' };
  };

  const profile = getProfile(results.scoreAverage);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        maxWidth: '750px',
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 170px)',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      <ProgressIndicator currentStep={6} totalSteps={6} label="Resultado" />

      <h1
        style={{
          fontSize: '2rem',
          fontFamily: 'var(--font-title)',
          marginBottom: '0.25rem',
          textAlign: 'center',
        }}
      >
        Seu Diagnóstico C.G.E.
      </h1>
      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--color-silver-medium)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        Olá, {studentName}! Confira seu desempenho nos pilares da mentoria.
      </p>

      {/* Main card */}
      <ContentCard style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
          
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(18, 61, 132, 0.2)',
              border: '2px solid var(--color-blue-highlight)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glow-highlight)',
            }}
          >
            <Award size={40} color="var(--color-silver-light)" />
          </div>

          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-silver-medium)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Nível Geral de Maturidade
            </span>
            <h2
              style={{
                fontSize: '1.75rem',
                fontFamily: 'var(--font-title)',
                color: profile.color,
                marginTop: '0.25rem',
              }}
            >
              {profile.title}
            </h2>
          </div>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--color-silver-medium)',
              lineHeight: 1.6,
              maxWidth: '550px',
            }}
          >
            {profile.desc}
          </p>

          <div
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              backgroundColor: 'rgba(18, 61, 132, 0.15)',
              border: '1px solid rgba(18, 61, 132, 0.3)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-white)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Activity size={16} />
            Média de Pontuação Geral: {results.scoreAverage}%
          </div>
        </div>
      </ContentCard>

      {/* Pillars details */}
      <h2
        style={{
          fontSize: '1.25rem',
          fontFamily: 'var(--font-title)',
          alignSelf: 'flex-start',
          marginBottom: '1rem',
        }}
      >
        Detalhamento por Pilar
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          width: '100%',
          marginBottom: '2.5rem',
        }}
      >
        <ContentCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '220px' }}>
              <ShieldAlert size={20} color="var(--color-silver-medium)" />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-title)' }}>Controle Emocional</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>Disciplina e Blindagem Mental</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1, minWidth: '200px' }}>
              {/* Progress visual */}
              <div style={{ flexGrow: 1, height: '8px', backgroundColor: 'rgba(3, 13, 36, 0.6)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${results.emo}%`, height: '100%', backgroundColor: results.emo < 50 ? 'var(--color-error)' : results.emo < 80 ? 'var(--color-warning)' : 'var(--color-success)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-white)', minWidth: '35px', textAlign: 'right' }}>{results.emo}%</span>
            </div>
          </div>
        </ContentCard>

        <ContentCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '220px' }}>
              <BarChart3 size={20} color="var(--color-silver-medium)" />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-title)' }}>Gestão Financeira</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>Controle de Risco e Paradas</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1, minWidth: '200px' }}>
              <div style={{ flexGrow: 1, height: '8px', backgroundColor: 'rgba(3, 13, 36, 0.6)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${results.fin}%`, height: '100%', backgroundColor: results.fin < 50 ? 'var(--color-error)' : results.fin < 80 ? 'var(--color-warning)' : 'var(--color-success)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-white)', minWidth: '35px', textAlign: 'right' }}>{results.fin}%</span>
            </div>
          </div>
        </ContentCard>

        <ContentCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '220px' }}>
              <Target size={20} color="var(--color-silver-medium)" />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-title)' }}>Estratégia</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>Estatística e Probabilidades</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1, minWidth: '200px' }}>
              <div style={{ flexGrow: 1, height: '8px', backgroundColor: 'rgba(3, 13, 36, 0.6)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${results.est}%`, height: '100%', backgroundColor: results.est < 50 ? 'var(--color-error)' : results.est < 80 ? 'var(--color-warning)' : 'var(--color-success)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-white)', minWidth: '35px', textAlign: 'right' }}>{results.est}%</span>
            </div>
          </div>
        </ContentCard>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px' }}>
        <Button variant="secondary" onClick={() => navigate('/quiz')} style={{ flex: 1 }}>
          Refazer Teste
        </Button>
        <Button variant="metallic" onClick={() => navigate('/relatorio')} style={{ flex: 1.5 }}>
          <FileText size={18} />
          <span>Ver Relatório Completo</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};
