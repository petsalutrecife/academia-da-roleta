/**
 * Quiz.tsx — Etapa 4
 * Página principal do diagnóstico com máquina de 3 estados por rodada:
 *   waiting → open → confirmed → (próxima rodada ou finalização)
 *
 * A Etapa 4 integra a roleta real (RouletteStage) que gerencia internamente
 * o ciclo idle → spinning → settling → result → question_unlocked.
 *
 * O Quiz.tsx é responsável por:
 *  - Proteção de rota
 *  - Salvamento no localStorage
 *  - Coleta e confirmação de respostas
 *  - Navegação entre rodadas
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle } from 'lucide-react';

import { RouletteStage } from '../components/RouletteStage';
import { QuizProgress } from '../components/QuizProgress';
import { QuestionCard } from '../components/QuestionCard';
import { Modal } from '../components/Modal';

import { quizQuestions } from '../data/quizData';
import type { OptionId } from '../data/quizData';
import type { SpinResult } from '../data/rouletteData';
import {
  loadAttempt,
  saveAttempt,
  createNewAttempt,
  isEligibleForQuiz,
  getStudentInfo,
  type QuizAttempt,
  type QuizAnswer,
  type RoundSpinData,
} from '../data/quizSession';

// ─── Tipos locais ─────────────────────────────────────────────────────────────
/** Etapa 4: estado 'spinning' é gerenciado internamente pela RouletteStage */
type RoundState = 'waiting' | 'open' | 'confirmed';

// ─── Componente ───────────────────────────────────────────────────────────────
export const Quiz: React.FC = () => {
  const navigate = useNavigate();

  // ── Estado local ──
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>('waiting');
  const [selectedOption, setSelectedOption] = useState<OptionId | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];
  const studentInfo = getStudentInfo();
  const firstName = studentInfo?.name?.split(' ')[0] ?? 'Aluno';

  // ── Proteção de rota + inicialização ─────────────────────────────────────────
  useEffect(() => {
    if (!isEligibleForQuiz()) {
      navigate('/identificacao', { replace: true });
      return;
    }

    const existing = loadAttempt();

    if (existing && existing.status === 'in_progress') {
      // Retomar tentativa salva
      setAttempt(existing);
      setCurrentIndex(existing.currentQuestionIndex);

      // Verificar se a rodada atual já foi girada (giro salvo)
      const currentRound = existing.currentQuestionIndex + 1;
      const savedSpin = (existing.roundSpins || []).find((s) => s.round === currentRound);

      if (existing.roundState === 'confirmed') {
        const savedAnswer = existing.answers.find(
          (a) => a.questionId === quizQuestions[existing.currentQuestionIndex].id,
        );
        setSelectedOption(savedAnswer?.selectedOption ?? null);
        setRoundState('confirmed');
      } else if (savedSpin?.questionUnlocked) {
        // Giro já aconteceu mas resposta não confirmada → retomar em 'open'
        setRoundState('open');
        setSelectedOption(null);
      } else {
        setRoundState('waiting');
        setSelectedOption(null);
      }
    } else {
      // Nova tentativa
      const newAttempt = createNewAttempt();
      saveAttempt(newAttempt);
      setAttempt(newAttempt);
      setCurrentIndex(0);
      setRoundState('waiting');
      setSelectedOption(null);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers de persistência ───────────────────────────────────────────────────
  const persistAttempt = useCallback(
    (updates: Partial<QuizAttempt>) => {
      setAttempt((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...updates };
        saveAttempt(updated);
        return updated;
      });
    },
    [],
  );

  // ── Handlers de fluxo ─────────────────────────────────────────────────────────

  /**
   * Chamado pela RouletteStage quando a animação de giro termina.
   * Persiste o resultado do giro e libera a pergunta.
   */
  const handleSpinComplete = useCallback(
    (result: SpinResult) => {
      if (!attempt) return;

      const newSpin: RoundSpinData = {
        round: currentIndex + 1,
        rouletteNumber: result.number,
        rouletteColor: result.color,
        finalWheelAngle: result.finalWheelAngle,
        spunAt: result.spunAt,
        questionUnlocked: true,
        answerConfirmed: false,
      };

      const existingSpins = attempt.roundSpins ?? [];
      const updatedSpins = [
        ...existingSpins.filter((s) => s.round !== newSpin.round),
        newSpin,
      ];

      persistAttempt({ roundState: 'open', roundSpins: updatedSpins });
      setRoundState('open');
    },
    [attempt, currentIndex, persistAttempt],
  );

  /** Selecionar alternativa */
  const handleSelectOption = useCallback(
    (id: OptionId) => {
      if (roundState !== 'open') return;
      setSelectedOption(id);
    },
    [roundState],
  );

  /** Confirmar resposta */
  const handleConfirm = useCallback(() => {
    if (!selectedOption || roundState !== 'open' || !attempt) return;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      answeredAt: new Date().toISOString(),
    };

    const updatedAnswers = [
      ...attempt.answers.filter((a) => a.questionId !== currentQuestion.id),
      newAnswer,
    ];

    // Atualiza também o roundSpin marcando answerConfirmed
    const currentRound = currentIndex + 1;
    const existingSpins = attempt.roundSpins ?? [];
    const updatedSpins = existingSpins.map((s) =>
      s.round === currentRound ? { ...s, answerConfirmed: true } : s,
    );

    persistAttempt({
      answers: updatedAnswers,
      roundState: 'confirmed',
      roundSpins: updatedSpins,
    });

    setRoundState('confirmed');
  }, [selectedOption, roundState, attempt, currentQuestion.id, currentIndex, persistAttempt]);

  /** Avançar para próxima rodada ou finalizar */
  const handleNextRound = useCallback(() => {
    if (!attempt) return;

    const nextIndex = currentIndex + 1;
    const isLast = nextIndex >= totalQuestions;

    if (isLast) {
      const completedAttempt: QuizAttempt = {
        ...attempt,
        currentQuestionIndex: currentIndex,
        completedAt: new Date().toISOString(),
        status: 'completed',
        roundState: 'confirmed',
      };
      saveAttempt(completedAttempt);
      setAttempt(completedAttempt);
      navigate('/processamento');
    } else {
      persistAttempt({
        currentQuestionIndex: nextIndex,
        roundState: 'waiting',
      });
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setRoundState('waiting');
    }
  }, [attempt, currentIndex, totalQuestions, persistAttempt, navigate]);

  /** Sair e salvar (modal) */
  const handleExitAndSave = useCallback(() => {
    setShowExitModal(false);
    navigate('/');
  }, [navigate]);

  // ── Dados do giro salvo para a rodada atual ────────────────────────────────
  const savedSpinData =
    attempt
      ? (attempt.roundSpins ?? []).find((s) => s.round === currentIndex + 1) ?? null
      : null;

  // ── Botão de ação principal ────────────────────────────────────────────────
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const renderActionButton = () => {
    if (roundState === 'open') {
      return (
        <button
          id="btn-confirmar-resposta"
          disabled={!selectedOption}
          onClick={handleConfirm}
          aria-disabled={!selectedOption}
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.85rem 2rem',
            borderRadius: '10px',
            cursor: selectedOption ? 'pointer' : 'not-allowed',
            border: '1px solid rgba(192,200,216,0.3)',
            background: selectedOption
              ? 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)'
              : 'rgba(7,26,68,0.3)',
            color: selectedOption ? 'var(--color-white)' : 'var(--color-silver-dark)',
            boxShadow: selectedOption ? '0 4px 16px rgba(18,61,132,0.4)' : 'none',
            transition: 'all 0.25s ease',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle size={16} />
          Confirmar Resposta
        </button>
      );
    }

    if (roundState === 'confirmed') {
      return (
        <button
          id={isLastQuestion ? 'btn-finalizar-diagnostico' : 'btn-proxima-rodada'}
          onClick={handleNextRound}
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.85rem 2rem',
            borderRadius: '10px',
            cursor: 'pointer',
            border: '1px solid rgba(192,200,216,0.4)',
            background: isLastQuestion
              ? 'linear-gradient(135deg, #1a5e3a 0%, #0e3d26 100%)'
              : 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)',
            color: 'var(--color-white)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'all 0.25s ease',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
          }}
        >
          {isLastQuestion ? '✓ Finalizar Diagnóstico' : 'Próxima Rodada →'}
        </button>
      );
    }

    return null;
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  if (!attempt) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--color-silver-medium)', fontFamily: 'var(--font-body)' }}>
          Carregando diagnóstico...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '1.5rem 1rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 160px)',
        animation: 'fadeIn 0.4s ease forwards',
      }}
    >
      {/* ── Cabeçalho da tela ── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            color: 'var(--color-silver-medium)',
            margin: 0,
          }}
        >
          Olá,{' '}
          <strong style={{ color: 'var(--color-silver-light)' }}>{firstName}</strong>
        </p>

        {/* Botão Sair */}
        <button
          id="btn-sair-diagnostico"
          onClick={() => setShowExitModal(true)}
          aria-label="Sair do diagnóstico"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-silver-dark)',
            background: 'transparent',
            border: '1px solid rgba(182,187,198,0.1)',
            borderRadius: '6px',
            padding: '0.35rem 0.7rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-silver-medium)';
            e.currentTarget.style.borderColor = 'rgba(182,187,198,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-silver-dark)';
            e.currentTarget.style.borderColor = 'rgba(182,187,198,0.1)';
          }}
        >
          <LogOut size={13} />
          Sair
        </button>
      </div>

      {/* ── Indicador de progresso ── */}
      <QuizProgress
        current={currentIndex + 1}
        total={totalQuestions}
        answeredCount={attempt.answers.length}
      />

      {/* ── Roleta europeia (Etapa 4) ── */}
      <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        <RouletteStage
          questionNumber={currentIndex + 1}
          savedSpinData={savedSpinData}
          isAnswerConfirmed={roundState === 'confirmed'}
          onSpinComplete={handleSpinComplete}
        />
      </div>

      {/* ── Aviso de resposta confirmada ── */}
      {roundState === 'confirmed' && (
        <div
          role="status"
          aria-live="polite"
          style={{
            width: '100%',
            textAlign: 'center',
            padding: '0.6rem 1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            background: 'rgba(18,61,132,0.15)',
            border: '1px solid rgba(18,61,132,0.3)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            color: 'var(--color-silver-light)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          ✓ Resposta registrada.
        </div>
      )}

      {/* ── Card da pergunta (visível quando pergunta está aberta ou confirmada) ── */}
      {(roundState === 'open' || roundState === 'confirmed') && (
        <div style={{ width: '100%', marginBottom: '1.2rem' }}>
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            selectedOption={selectedOption}
            isLocked={roundState === 'confirmed'}
            onSelectOption={handleSelectOption}
          />
        </div>
      )}

      {/* ── Botão de ação principal ── */}
      <div style={{ width: '100%', marginTop: '0.5rem' }}>
        {renderActionButton()}
      </div>

      {/* ── Aviso educacional ── */}
      <p
        style={{
          marginTop: '2rem',
          fontSize: '0.7rem',
          color: 'var(--color-silver-dark)',
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          maxWidth: '480px',
          lineHeight: 1.5,
        }}
      >
        Este diagnóstico é um instrumento educacional. Não envolve apostas, valores financeiros
        ou qualquer forma de jogo.
      </p>

      {/* ── Modal: Sair do diagnóstico ── */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Deseja sair do diagnóstico?"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
            <button
              id="btn-continuar-diagnostico"
              onClick={() => setShowExitModal(false)}
              style={{
                flex: 1,
                fontFamily: 'var(--font-title)',
                fontSize: '0.78rem',
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
              Continuar Diagnóstico
            </button>
            <button
              id="btn-sair-e-salvar"
              onClick={handleExitAndSave}
              style={{
                flex: 1,
                fontFamily: 'var(--font-title)',
                fontSize: '0.78rem',
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
              Sair e Salvar
            </button>
          </div>
        }
      >
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-silver-light)' }}>
          Seu progresso ficará salvo neste dispositivo e poderá ser retomado
          posteriormente.
        </p>
      </Modal>
    </div>
  );
};
