import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ContentCard } from '../components/ContentCard';
import { InfoBanner } from '../components/InfoBanner';
import { RotateCw, HelpCircle, FileText, Award } from 'lucide-react';

const StepsIndicator: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const steps = [
    { num: 1, label: 'Identificação' },
    { num: 2, label: 'Instruções' },
    { num: 3, label: 'Diagnóstico' },
    { num: 4, label: 'Resultado' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '550px',
        margin: '0 auto 2rem auto',
        padding: '0 0.5rem',
        gap: '0.5rem',
      }}
    >
      {steps.map((step) => {
        const isActive = step.num === activeStep;
        const isCompleted = step.num < activeStep;
        return (
          <div
            key={step.num}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              opacity: isActive ? 1 : isCompleted ? 0.8 : 0.4,
              transition: 'opacity 0.3s ease',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: isActive
                  ? 'var(--color-blue-highlight)'
                  : isCompleted
                  ? 'var(--color-success)'
                  : 'rgba(7, 26, 68, 0.6)',
                border: isActive
                  ? '2px solid var(--color-white)'
                  : '1px solid rgba(182, 187, 198, 0.2)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                marginBottom: '0.3rem',
                boxShadow: isActive ? 'var(--glow-highlight)' : 'none',
              }}
            >
              {step.num}
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-white)' : 'var(--color-silver-medium)',
                fontFamily: 'var(--font-title)',
                whiteSpace: 'nowrap',
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const Instructions: React.FC = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');

  const handleStartQuiz = () => {
    localStorage.setItem('instructions_viewed', 'true');
    navigate('/quiz');
  };

  // Route guard and student data check
  useEffect(() => {
    const savedInfo = localStorage.getItem('student_info');
    if (!savedInfo) {
      navigate('/identificacao');
      return;
    }
    try {
      const parsed = JSON.parse(savedInfo);
      if (parsed && parsed.name) {
        setStudentName(parsed.name);
      } else {
        navigate('/identificacao');
      }
    } catch (e) {
      console.error('Erro ao ler student_info do localStorage', e);
      navigate('/identificacao');
    }
  }, [navigate]);

  // Extract first name for personalized greeting
  const getFirstName = (fullName: string) => {
    if (!fullName) return '';
    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/);
    return parts[0] ? parts[0] : '';
  };

  const firstName = getFirstName(studentName);
  const greeting = firstName ? `TUDO PRONTO, ${firstName.toUpperCase()}!` : 'TUDO PRONTO!';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        maxWidth: '650px',
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 170px)',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      <StepsIndicator activeStep={2} />

      <h1
        style={{
          fontSize: '1.75rem',
          fontFamily: 'var(--font-title)',
          marginBottom: '0.5rem',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        {greeting}
      </h1>
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--color-silver-medium)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        Entenda o funcionamento da ferramenta antes de iniciar sua análise interativa.
      </p>

      <ContentCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(182, 187, 198, 0.1)', paddingBottom: '0.5rem' }}>
            COMO FUNCIONA?
          </h3>

          {/* Steps Grid Timeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            width: '100%',
            marginBottom: '1rem',
          }}>
            {/* Step 1 */}
            <div style={{
              background: 'rgba(7, 26, 68, 0.4)',
              border: '1px solid rgba(182, 187, 198, 0.1)',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}>
              <div style={{
                backgroundColor: 'rgba(18, 61, 132, 0.2)',
                border: '1px solid rgba(18, 61, 132, 0.4)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'var(--color-blue-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <RotateCw size={18} color="var(--color-silver-light)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.25rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)' }}>
                  Passo 1: Gire a Roleta
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-silver-medium)', lineHeight: '1.4' }}>
                  A cada pergunta, clique para girar a roleta e definir a temática da questão.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              background: 'rgba(7, 26, 68, 0.4)',
              border: '1px solid rgba(182, 187, 198, 0.1)',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}>
              <div style={{
                backgroundColor: 'rgba(18, 61, 132, 0.2)',
                border: '1px solid rgba(18, 61, 132, 0.4)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'var(--color-blue-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <HelpCircle size={18} color="var(--color-silver-light)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.25rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)' }}>
                  Passo 2: Escolha sua Resposta
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-silver-medium)', lineHeight: '1.4' }}>
                  Leia atentamente as opções e selecione a conduta que melhor descreve suas ações.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              background: 'rgba(7, 26, 68, 0.4)',
              border: '1px solid rgba(182, 187, 198, 0.1)',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}>
              <div style={{
                backgroundColor: 'rgba(18, 61, 132, 0.2)',
                border: '1px solid rgba(18, 61, 132, 0.4)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'var(--color-blue-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FileText size={18} color="var(--color-silver-light)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.25rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)' }}>
                  Passo 3: Conclua as 5 Perguntas
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-silver-medium)', lineHeight: '1.4' }}>
                  Responda a todas as 5 rodadas para cobrir os pilares de Controle, Gestão e Estratégia.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{
              background: 'rgba(7, 26, 68, 0.4)',
              border: '1px solid rgba(182, 187, 198, 0.1)',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}>
              <div style={{
                backgroundColor: 'rgba(18, 61, 132, 0.2)',
                border: '1px solid rgba(18, 61, 132, 0.4)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'var(--color-blue-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Award size={18} color="var(--color-silver-light)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.25rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)' }}>
                  Passo 4: Receba seu Resultado
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-silver-medium)', lineHeight: '1.4' }}>
                  Veja sua classificação imediata e baixe seu relatório de mentoria completo em PDF.
                </p>
              </div>
            </div>
          </div>

          {/* Sincerity Banner */}
          <InfoBanner
            type="info"
            title="RESPONDA COM SINCERIDADE"
            message="Para obter um diagnóstico preciso do seu nível operacional, seja 100% honesto em suas respostas. Não existem respostas certas ou erradas: cada opção representa uma conduta real que ajuda a mapear sua maturidade de jogo."
            style={{ marginBottom: '0.5rem' }}
          />

          {/* Warning Legal Bullet Footer list */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            textAlign: 'left',
            width: '100%',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(182, 187, 198, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-silver-medium)' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-warning)', flexShrink: 0 }}></span>
              <span>Este diagnóstico é destinado a maiores de 18 anos.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-silver-medium)' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-warning)', flexShrink: 0 }}></span>
              <span>Não envolvemos apostas, dinheiro real, depósitos ou promessas de ganho financeiro.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', width: '100%' }}>
            <Button variant="secondary" onClick={() => navigate('/identificacao')} style={{ flex: 1 }}>
              VOLTAR
            </Button>
            <Button variant="primary" onClick={handleStartQuiz} style={{ flex: 1.5 }}>
              COMEÇAR AGORA
            </Button>
          </div>
        </div>
      </ContentCard>
    </div>
  );
};
