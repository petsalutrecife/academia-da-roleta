/**
 * Quiz.tsx
 * Página principal do diagnóstico com fluxo modular de 3 módulos e 30 perguntas.
 *
 * Fluxo de estados:
 *   - waiting (intro do módulo com giro da roleta) -> open (pergunta exibida) -> confirmed (feedback imediato)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { RouletteStage } from '../components/RouletteStage';
import { QuizProgress } from '../components/QuizProgress';
import { QuestionCard } from '../components/QuestionCard';
import { Modal } from '../components/Modal';

import { quizQuestions, quizModules } from '../data/quizData';
import type { OptionId } from '../data/quizData';
import type { SpinResult } from '../data/rouletteData';
import {
  loadAttempt,
  saveAttempt,
  createNewAttempt,
  isEligibleForQuiz,
  getStudentInfo,
  isIncompatibleAttempt,
  clearAttempt,
  type QuizAttempt,
  type QuizAnswer,
  type ModuleSpinData,
} from '../data/quizSession';

type RoundState = 'waiting' | 'open' | 'confirmed';

export const Quiz: React.FC = () => {
  const navigate = useNavigate();

  // ── Estados locais ──
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>('waiting');
  const [selectedOption, setSelectedOption] = useState<OptionId | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isIncompatible, setIsIncompatible] = useState(false);

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];
  
  // Mapeamentos de módulo atual
  const currentModuleIndex = Math.floor(currentIndex / 10);
  const currentModule = quizModules[currentModuleIndex];
  
  const studentInfo = getStudentInfo();
  const firstName = studentInfo?.name?.split(' ')[0] ?? 'Aluno';

  // ── Proteção de rota + inicialização ─────────────────────────────────────────
  useEffect(() => {
    if (!isEligibleForQuiz()) {
      navigate('/identificacao', { replace: true });
      return;
    }

    if (isIncompatibleAttempt()) {
      setIsIncompatible(true);
      return;
    }

    const existing = loadAttempt();

    if (existing && existing.status === 'in_progress') {
      setAttempt(existing);
      setCurrentIndex(existing.currentQuestionIndex);

      const qIndex = existing.currentQuestionIndex;
      const q = quizQuestions[qIndex];
      
      // Verificar se o módulo da pergunta atual já foi girado
      const isSpun = (existing.moduleSpins || []).some((s) => s.moduleId === q.moduleId);

      if (!isSpun) {
        setRoundState('waiting');
        setSelectedOption(null);
      } else {
        // Módulo já foi girado. Verificar se a pergunta já foi confirmada
        const isAnswered = (existing.answers || []).some((a) => a.questionId === q.id);
        if (isAnswered) {
          const savedAnswer = existing.answers.find((a) => a.questionId === q.id);
          setSelectedOption(savedAnswer?.selectedOption ?? null);
          setRoundState('confirmed');
        } else {
          setRoundState('open');
          setSelectedOption(null);
        }
      }
    } else {
      // Nova tentativa modularizada
      const newAttempt = createNewAttempt();
      saveAttempt(newAttempt);
      setAttempt(newAttempt);
      setCurrentIndex(0);
      setRoundState('waiting');
      setSelectedOption(null);
    }
  }, [navigate]);

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
   * Chamado pela RouletteStage quando a animação de giro da roleta do módulo termina.
   * Persiste o resultado do giro e destrava as perguntas do módulo.
   */
  const handleSpinComplete = useCallback(
    (result: SpinResult) => {
      if (!attempt) return;

      const newSpin: ModuleSpinData = {
        moduleId: currentModule.id,
        rouletteNumber: result.number,
        rouletteColor: result.color,
        finalWheelAngle: result.finalWheelAngle,
        spunAt: result.spunAt,
        unlocked: true,
        questionUnlocked: true,
        answerConfirmed: false,
      };

      const existingSpins = attempt.moduleSpins ?? [];
      const updatedSpins = [
        ...existingSpins.filter((s) => s.moduleId !== newSpin.moduleId),
        newSpin,
      ];

      persistAttempt({
        roundState: 'open',
        moduleSpins: updatedSpins,
      });
      setRoundState('open');
    },
    [attempt, currentModule.id, persistAttempt],
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

    const currentSpin = attempt.moduleSpins.find((s) => s.moduleId === currentQuestion.moduleId);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      answeredAt: new Date().toISOString(),
      rouletteNumber: currentSpin ? currentSpin.rouletteNumber : 0,
      rouletteColor: currentSpin ? currentSpin.rouletteColor : 'green',
      pillar: currentQuestion.pillar,
      isCorrect,
    };

    const updatedAnswers = [
      ...attempt.answers.filter((a) => a.questionId !== currentQuestion.id),
      newAnswer,
    ];

    persistAttempt({
      answers: updatedAnswers,
      roundState: 'confirmed',
    });

    setRoundState('confirmed');
  }, [selectedOption, roundState, attempt, currentQuestion, persistAttempt]);

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
      const nextQuestion = quizQuestions[nextIndex];
      const isNextModuleSpun = attempt.moduleSpins.some((s) => s.moduleId === nextQuestion.moduleId);
      
      const nextRoundState = isNextModuleSpun ? 'open' : 'waiting';

      persistAttempt({
        currentQuestionIndex: nextIndex,
        roundState: nextRoundState,
      });

      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setRoundState(nextRoundState);
    }
  }, [attempt, currentIndex, totalQuestions, persistAttempt, navigate]);

  /** Sair e salvar */
  const handleExitAndSave = useCallback(() => {
    setShowExitModal(false);
    navigate('/');
  }, [navigate]);

  // ── Render de compatibilidade para sessões antigas ─────────────────────────
  if (isIncompatible) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '1rem' }}>
        <div className="card-glass" style={{ maxWidth: '500px', textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-white)', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>
            Diagnóstico Desatualizado
          </h2>
          <p style={{ color: 'var(--color-silver-light)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
            Identificamos que você possui um progresso de uma versão anterior do diagnóstico. 
            Para ter acesso à nova estrutura de 30 perguntas em 3 módulos, é necessário reiniciar.
          </p>
          <button
            onClick={() => {
              clearAttempt();
              setIsIncompatible(false);
              const newAttempt = createNewAttempt();
              saveAttempt(newAttempt);
              setAttempt(newAttempt);
              setCurrentIndex(0);
              setRoundState('waiting');
              setSelectedOption(null);
            }}
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.85rem 2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              border: '1px solid rgba(192,200,216,0.3)',
              background: 'linear-gradient(135deg, var(--color-blue-highlight) 0%, #0f2f6e 100%)',
              color: 'var(--color-white)',
              boxShadow: '0 4px 16px rgba(18,61,132,0.4)',
              width: '100%',
              transition: 'all 0.25s ease',
            }}
          >
            Iniciar novo diagnóstico atualizado
          </button>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--color-silver-medium)', fontFamily: 'var(--font-body)' }}>
          Carregando diagnóstico...
        </p>
      </div>
    );
  }

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
        >
          {isLastQuestion ? '✓ Finalizar Diagnóstico' : 'Próxima Pergunta →'}
        </button>
      );
    }

    return null;
  };

  // Se o módulo atual não foi girado ainda, exibe a tela de abertura do módulo
  const isModuleSpun = attempt.moduleSpins.some((s) => s.moduleId === currentModule.id);

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
        >
          <LogOut size={13} />
          Sair
        </button>
      </div>

      {/* ── Indicador de progresso ── */}
      <QuizProgress
        currentGlobal={currentIndex + 1}
        totalGlobal={totalQuestions}
        currentModuleIndex={currentModuleIndex}
        currentModuleQuestion={(currentIndex % 10) + 1}
        moduleTitle={currentModule.title}
      />

      {/* ── Conteúdo Central (Introdução do Módulo ou Pergunta Ativa) ── */}
      {!isModuleSpun ? (
        /* Tela de Introdução do Módulo com a Roleta */
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            animation: 'fadeIn 0.5s ease forwards',
          }}
        >
          <div
            className="card-glass"
            style={{
              width: '100%',
              padding: '1.8rem',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: 'var(--color-silver-medium)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              Módulo {currentModuleIndex + 1} de 3
            </span>
            <h1
              style={{
                fontSize: '1.8rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                marginBottom: '0.8rem',
                color: 'var(--color-white)',
                letterSpacing: '0.04em',
              }}
            >
              {currentModule.title}
            </h1>
            <div
              style={{
                width: '40px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(182, 187, 198, 0.4), transparent)',
                margin: '0 auto 1rem',
              }}
            />
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-silver-light)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {currentModule.description}
            </p>
          </div>

          {/* Roleta */}
          <div style={{ width: '100%' }}>
            <RouletteStage
              questionNumber={currentModuleIndex + 1}
              savedSpinData={null}
              isAnswerConfirmed={false}
              onSpinComplete={handleSpinComplete}
              buttonLabel="GIRAR ROLETA E INICIAR MÓDULO"
            />
          </div>
        </div>
      ) : (
        /* Caso o módulo já esteja liberado, renderiza a Pergunta atômica */
        <>
          {/* Card da pergunta */}
          <div style={{ width: '100%', marginBottom: '1.2rem' }}>
            <QuestionCard
              question={currentQuestion}
              questionNumber={(currentIndex % 10) + 1}
              totalQuestions={10}
              selectedOption={selectedOption}
              isLocked={roundState === 'confirmed'}
              onSelectOption={handleSelectOption}
            />
          </div>

          {/* Botão de ação */}
          <div style={{ width: '100%', marginTop: '0.5rem' }}>
            {renderActionButton()}
          </div>
        </>
      )}

      {/* ── Aviso educacional ── */}
      <p
        style={{
          marginTop: '2.5rem',
          fontSize: '0.7rem',
          color: 'var(--color-silver-dark)',
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          maxWidth: '480px',
          lineHeight: 1.5,
        }}
      >
        Este diagnóstico possui finalidade exclusivamente educacional. A roleta envolve risco, e nenhum método elimina a aleatoriedade ou garante resultados financeiros. Nunca utilize recursos destinados a despesas essenciais.
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
          Seu progresso ficará salvo neste dispositivo e poderá ser retomado posteriormente.
        </p>
      </Modal>
    </div>
  );
};
