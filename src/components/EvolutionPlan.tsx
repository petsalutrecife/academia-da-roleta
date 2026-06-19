// src/components/EvolutionPlan.tsx
import React from 'react';
import { Compass, BookOpen, CheckCircle } from 'lucide-react';

interface EvolutionStep {
  title: string;
  description: string;
  priority: string; // 'ALTA' | 'MÉDIA' | 'APROFUNDAMENTO'
}

interface EvolutionPlanProps {
  steps: EvolutionStep[];
}

export const EvolutionPlan: React.FC<EvolutionPlanProps> = ({ steps }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'ALTA':
        return { text: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' };
      case 'MÉDIA':
        return { text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' };
      case 'APROFUNDAMENTO':
        return { text: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)' };
      default:
        return { text: 'var(--color-silver-medium)', bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <BookOpen size={20} />;
      case 1:
        return <Compass size={20} />;
      case 2:
        return <CheckCircle size={20} />;
      default:
        return <Compass size={20} />;
    }
  };

  return (
    <div
      style={{
        background: 'rgba(10, 40, 99, 0.2)',
        border: '1px solid rgba(182, 187, 198, 0.15)',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        marginBottom: '2rem',
        animation: 'slideUp 0.6s ease forwards',
      }}
    >
      <h3
        style={{
          margin: '0 0 1.5rem 0',
          fontFamily: 'var(--font-title)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--color-white)',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        PLANO DE EVOLUÇÃO SUGERIDO
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        {steps.map((step, idx) => {
          const colors = getPriorityColor(step.priority);
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '1rem',
                position: 'relative',
              }}
            >
              {/* Left Timeline Line */}
              {idx < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '40px',
                    bottom: '-25px',
                    width: '2px',
                    background: 'rgba(182, 187, 198, 0.15)',
                  }}
                />
              )}

              {/* Number Icon Circle */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-dark)',
                  border: '2px solid var(--color-silver-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-silver-medium)',
                  flexShrink: 0,
                  boxShadow: '0 0 10px rgba(18, 61, 132, 0.4)',
                }}
              >
                {getStepIcon(idx)}
              </div>

              {/* Step content */}
              <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--color-white)',
                    }}
                  >
                    Etapa {idx + 1}: {step.title}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: colors.text,
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {step.priority.toUpperCase()}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--color-silver-medium)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
