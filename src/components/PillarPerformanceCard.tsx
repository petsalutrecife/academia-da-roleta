// src/components/PillarPerformanceCard.tsx
import React from 'react';
import { BarChart3, ShieldAlert, Target } from 'lucide-react';

interface PillarPerformanceCardProps {
  pillar: 'Controle Emocional' | 'Gestão Financeira' | 'Estratégia';
  percent: number; // 0-100
  correct: number;
  total: number;
  levelName?: string;
  levelEmoji?: string;
}

const iconMap: Record<PillarPerformanceCardProps['pillar'], React.ReactNode> = {
  'Controle Emocional': <ShieldAlert size={20} color="var(--color-silver-medium)" />, 
  'Gestão Financeira': <BarChart3 size={20} color="var(--color-silver-medium)" />, 
  'Estratégia': <Target size={20} color="var(--color-silver-medium)" />, 
};

const statusMap = (p: number) => {
  if (p === 0) return { status: 'PRECISA DE ATENÇÃO', color: 'var(--color-error)' };
  if (p < 50) return { status: 'PRECISA DE ATENÇÃO', color: 'var(--color-error)' };
  if (p < 80) return { status: 'EM DESENVOLVIMENTO', color: 'var(--color-warning)' };
  return { status: 'BOM DOMÍNIO', color: 'var(--color-success)' };
};

export const PillarPerformanceCard: React.FC<PillarPerformanceCardProps> = ({
  pillar,
  percent,
  correct,
  total,
  levelName,
  levelEmoji,
}) => {
  const { status, color } = statusMap(percent);
  return (
    <div style={{ border: '1px solid var(--color-silver-dark)', borderRadius: '12px', padding: '1rem', backgroundColor: 'rgba(3,13,36,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        {iconMap[pillar]}
        <div style={{ flexGrow: 1 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-title)', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{pillar}</span>
            {levelName && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-body)', color: 'var(--color-silver-light)' }}>
                {levelEmoji} {levelName}
              </span>
            )}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-silver-dark)' }}>{status}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ flexGrow: 1, height: '8px', backgroundColor: 'rgba(3,13,36,0.6)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${percent}%`, height: '100%', backgroundColor: color, borderRadius: '4px' }} />
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-white)', minWidth: '35px', textAlign: 'right' }}>{percent}%</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-medium)', marginTop: '0.5rem' }}>
        {correct} de {total} respostas corretas
      </p>
    </div>
  );
};
