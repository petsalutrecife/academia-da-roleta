import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { HelpCircle, FileText, Award, ShieldAlert, BarChart3, Target, CheckCircle2, Play } from 'lucide-react';

const useWindowWidth = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

const StepsIndicator: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const width = useWindowWidth();
  const isMobile = width < 600;

  if (isMobile) {
    const stepsMobile = [
      { num: 1, label: 'Identificação' },
      { num: 2, label: 'Instruções' },
      { num: 3, label: 'Diagnóstico' },
      { num: 4, label: 'Resultado' }
    ];
    return (
      <div
        role="status"
        aria-label="Etapa 2 de 4: Instruções"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-title)',
          color: 'var(--color-silver-medium)',
          marginBottom: '1.5rem',
          width: '100%',
          flexWrap: 'wrap'
        }}
      >
        {stepsMobile.map((s, idx) => {
          const isActive = s.num === activeStep;
          const isCompleted = s.num < activeStep;
          return (
            <React.Fragment key={s.num}>
              {idx > 0 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>&gt;</span>}
              <span
                style={{
                  color: isActive ? 'var(--color-white)' : isCompleted ? 'var(--color-success)' : 'var(--color-silver-dark)',
                  fontWeight: isActive ? 800 : 500
                }}
              >
                {s.label}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Identificação' },
    { num: 2, label: 'Instruções' },
    { num: 3, label: 'Módulo 1' },
    { num: 4, label: 'Módulo 2' },
    { num: 5, label: 'Módulo 3' },
    { num: 6, label: 'Resultado' }
  ];

  return (
    <div
      role="status"
      aria-label="Etapa 2 de 6: Instruções"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '700px',
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
              opacity: isActive ? 1 : isCompleted ? 0.85 : 0.45,
              transition: 'opacity 0.3s ease',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
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
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '0.3rem',
                boxShadow: isActive ? 'var(--glow-highlight)' : 'none',
              }}
            >
              {step.num}
            </div>
            <span
              style={{
                fontSize: '0.62rem',
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

  // Rota guard de segurança com validação total
  useEffect(() => {
    const savedInfo = localStorage.getItem('student_info');
    if (!savedInfo) {
      navigate('/identificacao');
      return;
    }
    try {
      const parsed = JSON.parse(savedInfo);
      if (parsed && parsed.name && parsed.email && parsed.phone && parsed.consent) {
        setStudentName(parsed.name);
      } else {
        navigate('/identificacao');
      }
    } catch (e) {
      console.error('Erro ao ler student_info do localStorage', e);
      navigate('/identificacao');
    }
  }, [navigate]);

  const handleStartQuiz = () => {
    const savedInfo = localStorage.getItem('student_info');
    if (!savedInfo) {
      navigate('/identificacao');
      return;
    }
    try {
      const parsed = JSON.parse(savedInfo);
      if (parsed && parsed.name && parsed.email && parsed.phone && parsed.consent) {
        localStorage.setItem('instructions_viewed', 'true');
        navigate('/quiz');
      } else {
        navigate('/identificacao');
      }
    } catch (e) {
      navigate('/identificacao');
    }
  };

  const firstName = studentName ? studentName.trim().split(/\s+/)[0] : '';
  const personalizedMsg = firstName
    ? `Tudo pronto, ${firstName}. Agora você passará por uma jornada de avaliação dividida em três módulos.`
    : 'Tudo pronto. Agora você passará por uma jornada de avaliação dividida em três módulos.';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem 4rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 170px)',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      <StepsIndicator activeStep={2} />

      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <AnimatedLogo size={160} spinDuration={15} showAnimation={true} />
        </div>
        <h1
          style={{
            fontSize: '1.8rem',
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            marginBottom: '0.4rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          ANTES DE COMEÇAR
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--color-silver-medium)',
            fontWeight: 500,
            marginBottom: '1rem',
          }}
        >
          “Entenda como funcionará o seu Diagnóstico do Método C.G.E.”
        </p>
        <div
          style={{
            padding: '0.8rem 1.2rem',
            background: 'rgba(18, 61, 132, 0.12)',
            border: '1px solid rgba(18, 61, 132, 0.3)',
            borderRadius: '8px',
            display: 'inline-block',
            maxWidth: '600px',
            fontSize: '0.88rem',
            color: 'var(--color-silver-light)',
            lineHeight: '1.45',
          }}
        >
          {personalizedMsg}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        
        {/* Seção 1: Resumo do Diagnóstico */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', letterSpacing: '0.02em' }}>
            COMO O DIAGNÓSTICO FUNCIONA?
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-silver-medium)', lineHeight: 1.5 }}>
            O diagnóstico foi estruturado para avaliar seu conhecimento sobre os três pilares do Método C.G.E.: Controle Emocional, Gestão Financeira e Estratégias.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
              width: '100%',
            }}
          >
            {/* Card 1 */}
            <div style={{ background: 'rgba(7, 26, 68, 0.3)', border: '1px solid rgba(182,187,198,0.15)', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--color-white)', fontFamily: 'var(--font-title)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--color-blue-highlight)" />
                3 módulos
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-silver-medium)', lineHeight: 1.45 }}>
                Você responderá perguntas separadas por área de conhecimento.
              </p>
            </div>
            {/* Card 2 */}
            <div style={{ background: 'rgba(7, 26, 68, 0.3)', border: '1px solid rgba(182,187,198,0.15)', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--color-white)', fontFamily: 'var(--font-title)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} color="var(--color-blue-highlight)" />
                30 perguntas
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-silver-medium)', lineHeight: 1.45 }}>
                Cada módulo possui 10 perguntas, totalizando 30 questões.
              </p>
            </div>
            {/* Card 3 */}
            <div style={{ background: 'rgba(7, 26, 68, 0.3)', border: '1px solid rgba(182,187,198,0.15)', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--color-white)', fontFamily: 'var(--font-title)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--color-blue-highlight)" />
                Feedback imediato
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-silver-medium)', lineHeight: 1.45 }}>
                Após confirmar cada resposta, você verá se acertou ou errou.
              </p>
            </div>
            {/* Card 4 */}
            <div style={{ background: 'rgba(7, 26, 68, 0.3)', border: '1px solid rgba(182,187,198,0.15)', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--color-white)', fontFamily: 'var(--font-title)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} color="var(--color-blue-highlight)" />
                Resultado completo
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-silver-medium)', lineHeight: 1.45 }}>
                Ao final, você receberá seu desempenho geral e o desempenho em cada módulo.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 2: Explicação dos Módulos */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', letterSpacing: '0.02em' }}>
            OS 3 MÓDULOS DO DIAGNÓSTICO
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            width: '100%',
          }}>
            {/* Módulo 1 */}
            <div style={{ background: 'rgba(7, 26, 68, 0.3)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--color-white)', margin: 0, fontFamily: 'var(--font-title)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={18} color="#4a90e2" />
                  Controle Emocional
                </h3>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--color-silver-light)' }}>
                  10 perguntas
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-silver-medium)', margin: 0, lineHeight: 1.5 }}>
                Neste módulo, você responderá perguntas sobre disciplina, foco, emoções, impulsividade, Tilt, Flow e tomada de decisão.
              </p>
            </div>
            {/* Módulo 2 */}
            <div style={{ background: 'rgba(7, 26, 68, 0.3)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--color-white)', margin: 0, fontFamily: 'var(--font-title)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={18} color="#7c9cd4" />
                  Gestão Financeira
                </h3>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--color-silver-light)' }}>
                  10 perguntas
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-silver-medium)', margin: 0, lineHeight: 1.5 }}>
                Neste módulo, você responderá perguntas sobre banca, Stop Loss, risco, variância, metas e preservação do capital.
              </p>
            </div>
            {/* Módulo 3 */}
            <div style={{ background: 'rgba(7, 26, 68, 0.3)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--color-white)', margin: 0, fontFamily: 'var(--font-title)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} color="#a0b4e0" />
                  Estratégias
                </h3>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--color-silver-light)' }}>
                  10 perguntas
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-silver-medium)', margin: 0, lineHeight: 1.5 }}>
                Neste módulo, você responderá perguntas sobre análise da roleta, padrões, confluência, confirmações e critérios de entrada.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 3: Explicação da Roleta */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', letterSpacing: '0.02em' }}>
            COMO A ROLETA SERÁ UTILIZADA?
          </h2>
          <div style={{ background: 'rgba(7, 26, 68, 0.2)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-silver-light)', margin: 0 }}>
              A roleta será utilizada apenas como elemento visual de gamificação para iniciar cada módulo.
            </p>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--color-silver-medium)', display: 'flex', flexDirection: 'column', gap: '0.45rem', lineHeight: 1.5 }}>
              <li>a roleta aparecerá somente no início de cada módulo;</li>
              <li>você girará a roleta uma vez para liberar o módulo;</li>
              <li>após o giro, as 10 perguntas daquele módulo serão liberadas;</li>
              <li>a roleta não aparecerá entre uma pergunta e outra dentro do mesmo módulo;</li>
              <li>o número sorteado não influencia sua pontuação;</li>
              <li>o número sorteado não define acerto, erro ou dificuldade;</li>
              <li>a pontuação depende exclusivamente das respostas escolhidas.</li>
            </ul>
            <div style={{ padding: '0.9rem', background: 'rgba(18, 61, 132, 0.15)', border: '1px dashed rgba(182, 187, 198, 0.25)', borderRadius: '8px', color: 'var(--color-white)', fontSize: '0.8rem', lineHeight: '1.45', textAlign: 'center', fontWeight: 600 }}>
              “A roleta não representa aposta, prêmio, saldo, ganho ou perda financeira. Ela serve apenas para tornar a experiência mais interativa.”
            </div>
          </div>
        </section>

        {/* Seção 4: Explicação do Feedback */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', letterSpacing: '0.02em' }}>
            COMO FUNCIONA O FEEDBACK?
          </h2>
          <div style={{ background: 'rgba(7, 26, 68, 0.2)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-silver-light)', margin: 0, lineHeight: 1.5 }}>
              Após selecionar uma alternativa, você deverá clicar em <strong>‘Confirmar resposta’</strong>. Somente depois da confirmação o sistema mostrará o feedback.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.2rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-success)', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>SE VOCÊ ACERTAR</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-silver-medium)', margin: 0, lineHeight: 1.45 }}>
                  • a alternativa correta ficará destacada em verde;<br />
                  • aparecerá a mensagem “Resposta correta.”
                </p>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-error)', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>SE VOCÊ ERRAR</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-silver-medium)', margin: 0, lineHeight: 1.45 }}>
                  • a alternativa escolhida ficará destacada em vermelho;<br />
                  • a alternativa correta ficará destacada em verde;<br />
                  • aparecerá a mensagem “Resposta incorreta. Veja a alternativa correta destacada.”
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--color-silver-medium)' }}>
              <div>• “Depois de confirmar uma resposta, ela não poderá ser alterada.”</div>
              <div>• “Antes da confirmação, o sistema não mostrará qual é a resposta correta.”</div>
            </div>
          </div>
        </section>

        {/* Seção 5: Explicação da Pontuação */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', letterSpacing: '0.02em' }}>
            COMO SUA PONTUAÇÃO SERÁ CALCULADA?
          </h2>
          <div style={{ background: 'rgba(7, 26, 68, 0.2)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-silver-light)', margin: 0 }}>
              “Cada resposta correta vale 1 ponto.”
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--color-silver-light)', fontWeight: 600 }}>
              <div>• Total de perguntas: <span style={{ color: 'var(--color-white)' }}>30</span></div>
              <div>• Pontuação máxima: <span style={{ color: 'var(--color-white)' }}>30 pontos</span></div>
              <div>• Cada módulo possui <span style={{ color: 'var(--color-white)' }}>10 pontos possíveis</span></div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-silver-medium)', margin: 0, lineHeight: 1.5 }}>
              “O resultado final será calculado com base na quantidade total de acertos e também no desempenho em cada módulo.”
            </p>
            
            {/* Exemplo demonstrativo */}
            <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(7, 26, 68, 0.4)', border: '1px solid rgba(182, 187, 198, 0.1)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-silver-dark)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Exemplo Demonstrativo (Não utilizar esse exemplo como resultado real do aluno. Deixar claro que é apenas um exemplo demonstrativo):</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-silver-medium)' }}>
                <div>Controle Emocional: 8 de 10 acertos</div>
                <div>Gestão Financeira: 7 de 10 acertos</div>
                <div>Estratégias: 6 de 10 acertos</div>
                <div style={{ fontWeight: 700, color: 'var(--color-white)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.25rem', marginTop: '0.25rem' }}>Resultado geral: 21 de 30 acertos</div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 6: Classificações */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Classificação Geral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.3rem' }}>
              CLASSIFICAÇÃO GERAL
            </h3>
            <div style={{ background: 'rgba(7, 26, 68, 0.2)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-silver-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.15rem 0' }}>
                  <span>0 a 12 acertos:</span>
                  <span style={{ fontWeight: 700, color: '#22C55E' }}>Iniciante 🟢</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.15rem 0' }}>
                  <span>13 a 18 acertos:</span>
                  <span style={{ fontWeight: 700, color: '#3B82F6' }}>Básico 🔵</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.15rem 0' }}>
                  <span>19 a 24 acertos:</span>
                  <span style={{ fontWeight: 700, color: '#8B5CF6' }}>Intermediário 🟣</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.15rem 0' }}>
                  <span>25 a 30 acertos:</span>
                  <span style={{ fontWeight: 700, color: '#F97316' }}>Avançado 🟠</span>
                </div>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-silver-dark)', margin: '0.2rem 0 0 0', lineHeight: 1.35 }}>
                “A classificação geral mostra seu nível considerando as 30 perguntas do diagnóstico.”
              </p>
            </div>
          </div>

          {/* Classificação por Módulo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.3rem' }}>
              CLASSIFICAÇÃO POR MÓDULO
            </h3>
            <div style={{ background: 'rgba(7, 26, 68, 0.2)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-silver-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.15rem 0' }}>
                  <span>0 a 4 acertos no módulo:</span>
                  <span style={{ fontWeight: 700, color: '#22C55E' }}>Iniciante 🟢</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.15rem 0' }}>
                  <span>5 a 6 acertos no módulo:</span>
                  <span style={{ fontWeight: 700, color: '#3B82F6' }}>Básico 🔵</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.15rem 0' }}>
                  <span>7 a 8 acertos no módulo:</span>
                  <span style={{ fontWeight: 700, color: '#8B5CF6' }}>Intermediário 🟣</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.15rem 0' }}>
                  <span>9 a 10 acertos no módulo:</span>
                  <span style={{ fontWeight: 700, color: '#F97316' }}>Avançado 🟠</span>
                </div>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-silver-dark)', margin: '0.2rem 0 0 0', lineHeight: 1.35 }}>
                “Além do resultado geral, você também verá seu nível em Controle Emocional, Gestão Financeira e Estratégias.”
              </p>
            </div>
          </div>
        </section>

        {/* Seção 7: Regras Importantes */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', color: 'var(--color-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', letterSpacing: '0.02em' }}>
            REGRAS IMPORTANTES
          </h2>
          <div style={{ background: 'rgba(7, 26, 68, 0.25)', border: '1px solid rgba(182, 187, 198, 0.15)', borderRadius: '12px', padding: '1.25rem' }}>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem 1.25rem', fontSize: '0.8rem', color: 'var(--color-silver-light)', margin: 0, paddingLeft: '1rem', lineHeight: '1.45' }}>
              <li>leia cada pergunta com atenção;</li>
              <li>escolha apenas uma alternativa por pergunta;</li>
              <li>confirme somente quando tiver certeza da resposta;</li>
              <li>depois de confirmar, a resposta não poderá ser alterada;</li>
              <li>o feedback será exibido logo após a confirmação;</li>
              <li>a roleta aparece apenas no início de cada módulo;</li>
              <li>o número sorteado na roleta não influencia sua nota;</li>
              <li>não será possível pular perguntas;</li>
              <li>o resultado final será exibido após as 30 perguntas.</li>
            </ul>
          </div>
        </section>

        {/* Seção 8: Aviso Educacional e Responsável */}
        <footer style={{ marginTop: '1rem', borderTop: '1px solid rgba(182,187,198,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-silver-dark)', lineHeight: 1.5, margin: 0 }}>
            “Este diagnóstico possui finalidade exclusivamente educacional. A roleta envolve risco, e nenhum método elimina a aleatoriedade ou garante resultados financeiros.”
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-silver-dark)', lineHeight: 1.5, margin: 0 }}>
            “Esta ferramenta não envolve apostas com dinheiro real, saldo, depósito, saque ou premiação.”
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-silver-dark)', lineHeight: 1.5, margin: 0 }}>
            “Conteúdo destinado exclusivamente a maiores de 18 anos.”
          </p>
        </footer>

        {/* Botões de Ação */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1.5rem',
          width: '100%',
          flexWrap: 'wrap'
        }}>
          <Button
            variant="secondary"
            onClick={() => navigate('/identificacao')}
            style={{
              flex: 1,
              minWidth: '150px',
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}
          >
            VOLTAR
          </Button>
          <Button
            variant="primary"
            onClick={handleStartQuiz}
            style={{
              flex: 1.5,
              minWidth: '220px',
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <span>COMEÇAR DIAGNÓSTICO</span>
            <Play size={12} fill="currentColor" />
          </Button>
        </div>

      </div>
    </div>
  );
};
