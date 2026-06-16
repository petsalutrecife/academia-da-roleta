import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ContentCard } from '../components/ContentCard';
import { ToastMessage } from '../components/ToastMessage';
import { InfoBanner } from '../components/InfoBanner';
import { Download, ArrowLeft, ShieldAlert, BarChart3, Target, Calendar, User } from 'lucide-react';

interface ResultData {
  emo: number;
  fin: number;
  est: number;
  scoreAverage: number;
}

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultData>({ emo: 65, fin: 50, est: 70, scoreAverage: 61 });
  const [studentInfo, setStudentInfo] = useState({ name: 'Aluno Exemplo', email: 'aluno@email.com', phone: '(00) 00000-0000' });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('quiz_results');
    if (data) {
      setResults(JSON.parse(data));
    }
    const info = localStorage.getItem('student_info');
    if (info) {
      setStudentInfo(JSON.parse(info));
    }
  }, []);

  const handleDownloadPDF = () => {
    setToastMsg('Preparando para salvar como PDF...');
    setShowToast(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        maxWidth: '850px',
        margin: '0 auto',
        width: '100%',
        minHeight: 'calc(100vh - 170px)',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      {/* Title Header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)' }}>Relatório de Desempenho</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-dark)' }}>Método C.G.E. - Academia da Roleta</p>
        </div>

        <Button className="no-print" variant="metallic" onClick={handleDownloadPDF}>
          <Download size={16} />
          <span>Salvar Relatório (PDF)</span>
        </Button>
      </div>

      {/* Meta details card */}
      <ContentCard style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--color-silver-medium)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-silver-dark)' }}>ALUNO</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-white)' }}>{studentInfo.name}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--color-silver-medium)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-silver-dark)' }}>DATA DE AVALIAÇÃO</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-white)' }}>{currentDate}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-silver-dark)' }}>PERFIL DO ALUNO</span>
              <strong style={{ fontSize: '0.9rem', color: results.scoreAverage < 50 ? '#EF4444' : results.scoreAverage < 80 ? '#F59E0B' : '#10B981' }}>
                {results.scoreAverage < 50 ? 'Iniciante' : results.scoreAverage < 80 ? 'Intermediário' : 'Estrategista'}
              </strong>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* Warning/Educational warning */}
      <InfoBanner
        type="info"
        message="Abaixo estão listadas recomendações conceituais baseadas no seu perfil de respostas. Estude cada ponto para qualificar sua leitura matemática."
        style={{ marginBottom: '2rem' }}
      />

      {/* Detailed Pillars Analysis */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', marginBottom: '2.5rem' }}>
        
        {/* Pillar 1 */}
        <ContentCard title="Análise de Controle Emocional">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-white)' }}>
                <ShieldAlert size={18} color="var(--color-silver-medium)" />
                Nível de Controle Emocional
              </span>
              <strong style={{ color: results.emo < 50 ? '#EF4444' : results.emo < 80 ? '#F59E0B' : '#10B981' }}>
                {results.emo}% - {results.emo < 50 ? 'Crítico' : results.emo < 80 ? 'Moderado' : 'Excelente'}
              </strong>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-medium)', lineHeight: 1.6 }}>
              {results.emo < 50
                ? 'Seu controle emocional está sob forte pressão de perdas (Red). A tendência de recuperar a banca de imediato de forma impetuosa é o maior fator de quebra de bancas. A recomendação da mentoria é implementar um diário de operações rígido.'
                : results.emo < 80
                ? 'Você demonstra uma disciplina razoável, porém ainda vulnerável em momentos de perdas repetidas ou ansiedade após bater a meta. Estipular limites automáticos e alarmes ajudará a estabilizar suas operações.'
                : 'Sua blindagem mental é exemplar. Você aceita o Stop Loss como parte do cálculo matemático e não estica sessões após bater sua meta estabelecida.'}
            </p>
          </div>
        </ContentCard>

        {/* Pillar 2 */}
        <ContentCard title="Análise de Gestão Financeira">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-white)' }}>
                <BarChart3 size={18} color="var(--color-silver-medium)" />
                Nível de Gestão de Risco
              </span>
              <strong style={{ color: results.fin < 50 ? '#EF4444' : results.fin < 80 ? '#F59E0B' : '#10B981' }}>
                {results.fin}% - {results.fin < 50 ? 'Crítico' : results.fin < 80 ? 'Ajustável' : 'Excelente'}
              </strong>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-medium)', lineHeight: 1.6 }}>
              {results.fin < 50
                ? 'Operações sem metas percentuais expõem seu capital a riscos insustentáveis. É imperativo adotar uma gestão de no máximo 1% por ficha/rodada, protegendo seu saldo de variações abruptas de probabilidade.'
                : results.fin < 80
                ? 'Sua divisão de capital é saudável, mas faltam regras claras para saques frequentes ou planos de proteção contra longos ciclos de oscilações na roleta. Refine seu plano de saques periódicos.'
                : 'Excelente gestão de risco. A divisão de capital está adequada à distribuição matemática dos cenários na roleta, minimizando chances de perda total.'}
            </p>
          </div>
        </ContentCard>

        {/* Pillar 3 */}
        <ContentCard title="Análise Estratégica">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-white)' }}>
                <Target size={18} color="var(--color-silver-medium)" />
                Nível de Leitura Técnica
              </span>
              <strong style={{ color: results.est < 50 ? '#EF4444' : results.est < 80 ? '#F59E0B' : '#10B981' }}>
                {results.est}% - {results.est < 50 ? 'Necessita Ajustes' : results.est < 80 ? 'Moderado' : 'Excelente'}
              </strong>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-silver-medium)', lineHeight: 1.6 }}>
              {results.est < 50
                ? 'Cair na "Falácia do Apostador" (achar que a roleta compensa eventos anteriores de imediato) é um erro comum. Estude distribuições independentes de Bernoulli para guiar melhor suas estratégias baseadas em probabilidade.'
                : results.est < 80
                ? 'Sua compreensão das dinâmicas matemáticas está no caminho certo. Aprimore a análise estatística de setores vizinhos e desvios de frequência para qualificar suas análises.'
                : 'Entendimento técnico apurado. Você opera com base em estatísticas e desvios probabilísticos, ciente da independência estatística de cada rodada.'}
            </p>
          </div>
        </ContentCard>
      </div>

      {/* Return Buttons */}
      <div className="no-print" style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '350px' }}>
        <Button variant="secondary" onClick={() => navigate('/resultado')} style={{ flex: 1 }}>
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>

      {showToast && (
        <ToastMessage
          message={toastMsg}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
