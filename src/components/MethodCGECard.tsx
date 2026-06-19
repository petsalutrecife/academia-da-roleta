// src/components/MethodCGECard.tsx
import React from 'react';
import { ShieldCheck, Brain, Wallet, Target } from 'lucide-react';

export const MethodCGECard: React.FC = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(18, 61, 132, 0.25) 0%, rgba(10, 40, 99, 0.1) 100%)',
        border: '1px solid rgba(182, 187, 198, 0.2)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px 0 rgba(7, 26, 68, 0.37)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'slideUp 0.6s ease forwards',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'rgba(182, 187, 198, 0.1)', marginBottom: '1rem' }}>
        <ShieldCheck size={32} style={{ color: 'var(--color-silver-medium)' }} />
      </div>

      <h3
        style={{
          margin: '0 0 1rem 0',
          fontFamily: 'var(--font-title)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-white)',
          letterSpacing: '0.05em',
        }}
      >
        O MÉTODO C.G.E.
      </h3>
      
      <p
        style={{
          margin: '0 auto 2rem auto',
          maxWidth: '600px',
          color: 'var(--color-silver-medium)',
          fontSize: '0.95rem',
          lineHeight: '1.6',
        }}
      >
        O Método C.G.E. é a base fundamental de ensino da Academia da Roleta. A sigla representa os 
        três pilares indispensáveis que sustentam o sucesso sustentável e de longo prazo:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          textAlign: 'left',
        }}
      >
        {/* C - Controle Emocional */}
        <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Brain size={20} style={{ color: 'var(--color-silver-medium)' }} />
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: 600 }}>
              C <span style={{ color: 'var(--color-silver-medium)', fontWeight: 400 }}>- Controle Emocional</span>
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-silver-dark)', lineHeight: '1.4' }}>
            Disciplina para lidar com as vitórias e perdas, evitando comportamentos de risco e impulsos como o "Tilt".
          </p>
        </div>
 
        {/* G - Gestão Financeira */}
        <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Wallet size={20} style={{ color: 'var(--color-silver-medium)' }} />
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: 600 }}>
              G <span style={{ color: 'var(--color-silver-medium)', fontWeight: 400 }}>- Gestão Financeira</span>
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-silver-dark)', lineHeight: '1.4' }}>
            Controle estrito da banca (Bankroll) e definição clara de metas e limites de perda (Stop Loss) diários.
          </p>
        </div>

        {/* E - Estratégia */}
        <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Target size={20} style={{ color: 'var(--color-silver-medium)' }} />
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: 600 }}>
              E <span style={{ color: 'var(--color-silver-medium)', fontWeight: 400 }}>- Estratégia</span>
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-silver-dark)', lineHeight: '1.4' }}>
            Leitura analítica dos giros, uso de confluências estatísticas e aplicação de táticas validadas.
          </p>
        </div>
      </div>
    </div>
  );
};
