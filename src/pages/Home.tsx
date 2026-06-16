import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ContentCard } from '../components/ContentCard';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { Modal } from '../components/Modal';
import { hasInProgressAttempt, clearAttempt } from '../data/quizSession';
import { ShieldAlert, BarChart3, Target, HelpCircle, Clock, Award, AlertTriangle, PlayCircle, RotateCcw } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [hasProgress, setHasProgress] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);

  useEffect(() => {
    setHasProgress(hasInProgressAttempt());
  }, []);

  const handleRestart = () => {
    clearAttempt();
    setHasProgress(false);
    setShowRestartModal(false);
    navigate('/identificacao');
  };

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', minHeight: 'calc(100vh - 170px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Decorative rotating background vector wheel */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(90vw, 750px)',
        height: 'min(90vw, 750px)',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'spinSlow 40s linear infinite',
        color: 'var(--color-silver-light)',
      }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="90" strokeWidth="1"/>
          <circle cx="100" cy="100" r="70" strokeWidth="1" strokeDasharray="3 3"/>
          <circle cx="100" cy="100" r="50" strokeWidth="1"/>
          <circle cx="100" cy="100" r="30" strokeWidth="1" strokeDasharray="2 2"/>
          <line x1="100" y1="10" x2="100" y2="190" strokeWidth="0.5"/>
          <line x1="10" y1="100" x2="190" y2="100" strokeWidth="0.5"/>
          <line x1="36" y1="36" x2="164" y2="164" strokeWidth="0.5"/>
          <line x1="36" y1="164" x2="164" y2="36" strokeWidth="0.5"/>
          {[...Array(24)].map((_, i) => {
            const angle = (i * Math.PI) / 12;
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + 90 * Math.cos(angle)}
                y2={100 + 90 * Math.sin(angle)}
                strokeWidth="0.25"
              />
            );
          })}
        </svg>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%',
          zIndex: 1, // On top of the decorative wheel
          animation: 'fadeIn 0.5s ease forwards',
        }}
      >
        {/* Center Logo */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <AnimatedLogo size={280} spinDuration={10} showAnimation={true} />
        </div>

        {/* Card: Diagnóstico em andamento */}
        {hasProgress && (
          <div
            role="alert"
            style={{
              width: '100%',
              maxWidth: '500px',
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(18,61,132,0.18)',
              border: '1px solid rgba(18,61,132,0.45)',
              boxShadow: '0 4px 18px rgba(18,61,132,0.2)',
              animation: 'fadeIn 0.4s ease forwards',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-silver-medium)',
                marginBottom: '0.75rem',
                margin: '0 0 0.75rem',
              }}
            >
              Você possui um diagnóstico em andamento
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                id="btn-continuar-diagnostico-home"
                onClick={() => navigate('/quiz')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  border: '1px solid rgba(192,200,216,0.3)',
                  background: 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)',
                  color: 'var(--color-white)',
                  transition: 'all 0.2s ease',
                }}
              >
                <PlayCircle size={13} />
                Continuar Diagnóstico
              </button>
              <button
                id="btn-recomecar-diagnostico-home"
                onClick={() => setShowRestartModal(true)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  border: '1px solid rgba(182,187,198,0.15)',
                  background: 'rgba(7,26,68,0.35)',
                  color: 'var(--color-silver-light)',
                  transition: 'all 0.2s ease',
                }}
              >
                <RotateCcw size={13} />
                Recomeçar
              </button>
            </div>
          </div>
        )}

        {/* Title section with styling */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontSize: '2.2rem',
              lineHeight: '1.2',
              fontWeight: 800,
              marginBottom: '1rem',
              fontFamily: 'var(--font-title)',
              letterSpacing: '0.05em',
            }}
          >
            <span className="text-gradient-metallic">DESCUBRA O SEU NÍVEL NA ROLETA</span>
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-silver-medium)',
              maxWidth: '650px',
              margin: '0 auto',
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Responda ao diagnóstico e descubra como está o seu conhecimento sobre Controle Emocional, Gestão Financeira e Estratégia.
          </p>
        </div>

        {/* Grid of the three pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            marginBottom: '3rem',
          }}
        >
          <ContentCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'rgba(18, 61, 132, 0.25)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(18, 61, 132, 0.4)',
                }}
              >
                <ShieldAlert size={22} color="#D7DAE2" />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                CONTROLE EMOCIONAL
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-medium)', lineHeight: 1.6 }}>
                Disciplina para evitar decisões impulsivas e manter o planejamento.
              </p>
            </div>
          </ContentCard>

          <ContentCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'rgba(18, 61, 132, 0.25)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(18, 61, 132, 0.4)',
                }}
              >
                <BarChart3 size={22} color="#D7DAE2" />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                GESTÃO FINANCEIRA
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-medium)', lineHeight: 1.6 }}>
                Organização da banca, definição de limites e proteção do capital.
              </p>
            </div>
          </ContentCard>

          <ContentCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'rgba(18, 61, 132, 0.25)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(18, 61, 132, 0.4)',
                }}
              >
                <Target size={22} color="#D7DAE2" />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                ESTRATÉGIA
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-medium)', lineHeight: 1.6 }}>
                Análise de fatores e identificação de oportunidades com critérios definidos.
              </p>
            </div>
          </ContentCard>
        </div>

        {/* Diagnostic Meta Info & Button */}
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          {/* Metadata bullet cards list */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              width: '100%',
              fontSize: '0.8rem',
              color: 'var(--color-silver-medium)',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(7, 26, 68, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(182, 187, 198, 0.1)' }}>
              <HelpCircle size={14} color="var(--color-blue-highlight)" />
              <span>5 perguntas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(7, 26, 68, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(182, 187, 198, 0.1)' }}>
              <Clock size={14} color="var(--color-blue-highlight)" />
              <span>~3 minutos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(7, 26, 68, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(182, 187, 198, 0.1)' }}>
              <Award size={14} color="var(--color-blue-highlight)" />
              <span>Resultado personalizado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(7, 26, 68, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(182, 187, 198, 0.1)' }}>
              <AlertTriangle size={14} color="var(--color-blue-highlight)" />
              <span>Maiores de 18 anos</span>
            </div>
          </div>

          <Button
            variant="metallic"
            fullWidth
            onClick={() => navigate('/identificacao')}
            style={{ fontSize: '1.1rem', padding: '1rem 2rem', letterSpacing: '0.05em' }}
          >
            INICIAR DIAGNÓSTICO
          </Button>
        </div>
      </div>
    </div>

    {/* Modal: Confirmar reinício */}
    <Modal
      isOpen={showRestartModal}
      onClose={() => setShowRestartModal(false)}
      title="Reiniciar Diagnóstico?"
      size="sm"
      footer={
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button
            id="btn-cancelar-reinicio"
            onClick={() => setShowRestartModal(false)}
            style={{
              flex: 1,
              fontFamily: 'var(--font-title)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.7rem',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid rgba(192,200,216,0.25)',
              background: 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)',
              color: 'var(--color-white)',
            }}
          >
            Cancelar
          </button>
          <button
            id="btn-confirmar-reinicio"
            onClick={handleRestart}
            style={{
              flex: 1,
              fontFamily: 'var(--font-title)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.7rem',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid rgba(182,187,198,0.2)',
              background: 'rgba(7,26,68,0.4)',
              color: 'var(--color-silver-light)',
            }}
          >
            Reiniciar Diagnóstico
          </button>
        </div>
      }
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Todo o progresso atual será apagado. Os seus dados de identificação serão mantidos.
        Deseja realmente reiniciar?
      </p>
    </Modal>
    </>
  );
};
