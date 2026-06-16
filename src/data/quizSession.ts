/**
 * quizSession.ts
 * Utilitários para salvar e recuperar o progresso do quiz no localStorage.
 */

import type { OptionId } from './quizData';

export interface QuizAnswer {
  questionId: number;
  selectedOption: OptionId;
  answeredAt: string; // ISO 8601
}

/** Dados de um giro da roleta por rodada */
export interface RoundSpinData {
  round: number;              // 1–5
  rouletteNumber: number;     // 0–36
  rouletteColor: 'green' | 'red' | 'black';
  finalWheelAngle: number;    // ângulo final da roda em graus (para restauração)
  spunAt: string;             // ISO 8601
  questionUnlocked: boolean;  // se a pergunta foi liberada
  answerConfirmed: boolean;   // se a resposta foi confirmada
}

export interface QuizAttempt {
  attemptId: string;
  currentQuestionIndex: number;
  roundState: 'waiting' | 'open' | 'confirmed';
  answers: QuizAnswer[];
  roundSpins: RoundSpinData[];  // dados de cada giro da roleta
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

// ─── Fábrica de nova tentativa ──────────────────────────────────────────────
export function createNewAttempt(): QuizAttempt {
  return {
    attemptId: generateAttemptId(),
    currentQuestionIndex: 0,
    roundState: 'waiting',
    answers: [],
    roundSpins: [],
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
