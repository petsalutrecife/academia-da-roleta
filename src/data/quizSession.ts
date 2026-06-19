/**
 * quizSession.ts
 * Utilitários para salvar e recuperar o progresso do quiz no localStorage.
 * Atualizado para fluxo modular de 30 perguntas em 3 módulos.
 */

import type { OptionId } from './quizData';

export interface QuizAnswer {
  questionId: string; // e.g. "ce-01"
  selectedOption: OptionId;
  answeredAt: string; // ISO 8601
  rouletteNumber: number; // número sorteado na roleta na abertura do módulo correspondente
  rouletteColor: string; // cor sorteada
  pillar: string; // pilar correspondente
  isCorrect: boolean; // se acertou
}

/** Dados de um giro da roleta por módulo */
export interface ModuleSpinData {
  moduleId: string;           // 'controle-emocional' | 'gestao-financeira' | 'estrategias'
  rouletteNumber: number;     // 0–36
  rouletteColor: 'green' | 'red' | 'black';
  finalWheelAngle: number;    // ângulo final da roda em graus (para restauração)
  spunAt: string;             // ISO 8601
  unlocked: boolean;          // se o módulo foi liberado
  questionUnlocked: boolean;  // alias de compatibilidade para RouletteStage
  answerConfirmed: boolean;   // alias de compatibilidade para RouletteStage
}

export type RoundSpinData = ModuleSpinData;

export interface QuizAttempt {
  attemptId: string;
  student?: {
    name: string;
    email: string;
    phone: string;
    consent: boolean;
  };
  currentModuleIndex: number;   // 0, 1 ou 2
  currentQuestionIndex: number;  // index global 0 a 29
  roundState: 'waiting' | 'open' | 'confirmed';
  answers: QuizAnswer[];
  moduleSpins: ModuleSpinData[];  // giros por módulo (máximo 3)
  startedAt: string;       // ISO 8601
  completedAt: string | null;
  status: 'in_progress' | 'completed';
}

const STORAGE_KEY = 'quiz_attempt';

// ─── Geração de ID único ────────────────────────────────────────────────────
export function generateAttemptId(): string {
  return `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ─── CRUD no localStorage ───────────────────────────────────────────────────
export function saveAttempt(attempt: QuizAttempt): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
  } catch (e) {
    console.error('[quizSession] Erro ao salvar progresso:', e);
  }
}

export function loadAttempt(): QuizAttempt | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizAttempt;
  } catch {
    return null;
  }
}

export function clearAttempt(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Consultas de estado ────────────────────────────────────────────────────
export function hasInProgressAttempt(): boolean {
  const attempt = loadAttempt();
  return attempt !== null && attempt.status === 'in_progress';
}

/** Verifica se a tentativa salva no localStorage é do formato antigo incompatível */
export function isIncompatibleAttempt(): boolean {
  const attempt = loadAttempt();
  if (!attempt) return false;
  // Se for in_progress mas não tiver moduleSpins ou currentModuleIndex, é incompatível
  return (
    attempt.status === 'in_progress' &&
    (attempt.moduleSpins === undefined || attempt.currentModuleIndex === undefined)
  );
}

// ─── Fábrica de nova tentativa ──────────────────────────────────────────────
export function createNewAttempt(): QuizAttempt {
  const studentInfo = getStudentInfo();
  return {
    attemptId: generateAttemptId(),
    student: studentInfo || undefined,
    currentModuleIndex: 0,
    currentQuestionIndex: 0,
    roundState: 'waiting',
    answers: [],
    moduleSpins: [],
    startedAt: new Date().toISOString(),
    completedAt: null,
    status: 'in_progress',
  };
}

// ─── Verificação de pré-requisitos ──────────────────────────────────────────
export interface StudentInfo {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

export function getStudentInfo(): StudentInfo | null {
  try {
    const raw = localStorage.getItem('student_info');
    if (!raw) return null;
    return JSON.parse(raw) as StudentInfo;
  } catch {
    return null;
  }
}

export function isEligibleForQuiz(): boolean {
  const info = getStudentInfo();
  if (!info) return false;
  const hasFields = !!(info.name?.trim() && info.email?.trim() && info.phone?.trim());
  const hasConsent = info.consent === true;
  const hasViewedInstructions = localStorage.getItem('instructions_viewed') === 'true';
  return hasFields && hasConsent && hasViewedInstructions;
}
