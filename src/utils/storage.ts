// src/utils/storage.ts

import type { AttemptResult } from './resultUtils';
import { supabase } from './supabaseClient';

const ATTEMPTS_KEY = 'diagnosticoAttempts';

export async function syncCompletedAttemptToSupabase(attempt: AttemptResult): Promise<void> {
  try {
    // 1. Upsert student info
    if (attempt.student) {
      await supabase.from('students').upsert(
        {
          name: attempt.student.name,
          email: attempt.student.email || '',
          phone: attempt.student.phone || '',
          consent: true,
        },
        { onConflict: 'email' }
      );
    }

    // 2. Upsert final quiz attempt
    await supabase.from('quiz_attempts').upsert({
      id: attempt.attemptId,
      student_email: attempt.student?.email || '',
      current_module_index: 2,
      current_question_index: attempt.totalQuestions - 1,
      round_state: 'confirmed',
      started_at: attempt.startedAt,
      completed_at: attempt.completedAt,
      status: 'completed',
      score: attempt.score,
      percentage: attempt.percentage,
    });

    // 3. Sincronizar respostas finalizadas (delete-then-insert)
    await supabase.from('quiz_answers').delete().eq('attempt_id', attempt.attemptId);
    if (attempt.answers && attempt.answers.length > 0) {
      const answersData = attempt.answers.map((ans) => ({
        attempt_id: attempt.attemptId,
        question_id: ans.questionId,
        selected_option: ans.selectedOption,
        answered_at: ans.answeredAt,
        roulette_number: ans.rouletteNumber,
        roulette_color: ans.rouletteColor,
        pillar: ans.pillar,
        is_correct: ans.isCorrect,
      }));
      await supabase.from('quiz_answers').insert(answersData);
    }
  } catch (err) {
    console.error('[storage] Erro ao sincronizar tentativa finalizada com Supabase:', err);
  }
}

/** Save an attempt (append to array) */
export function saveAttempt(attempt: AttemptResult): void {
  try {
    const existing = localStorage.getItem(ATTEMPTS_KEY);
    const attempts: AttemptResult[] = existing ? JSON.parse(existing) : [];
    // replace if same attemptId exists
    const filtered = attempts.filter((a) => a.attemptId !== attempt.attemptId);
    filtered.push(attempt);
    // keep only the last 10 attempts
    const limited = filtered.slice(-10);
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(limited));

    // Sincroniza em background com Supabase
    syncCompletedAttemptToSupabase(attempt).catch((err) => {
      console.error('[storage] Sincronização final da tentativa falhou:', err);
    });
  } catch (e) {
    console.error('Error saving attempt', e);
  }
}

/** Load the most recent completed attempt */
export function loadLatestAttempt(): AttemptResult | null {
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    if (!data) return null;
    const attempts: AttemptResult[] = JSON.parse(data);
    if (attempts.length === 0) return null;
    // Assuming attempts are stored in order of completion
    return attempts[attempts.length - 1];
  } catch (e) {
    console.error('Error loading attempts', e);
    return null;
  }
}

/** Clear current in‑progress attempt (used when restarting) */
export function clearCurrentProgress(): void {
  // Remove any attempt with status not 'completed' (if such exists in session storage)
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    if (!data) return;
    const attempts: AttemptResult[] = JSON.parse(data);
    const filtered = attempts.filter((a) => a.status === 'completed');
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error clearing progress', e);
  }
}

/** Load all attempts in historical order */
export function loadAttempts(): AttemptResult[] {
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading all attempts', e);
    return [];
  }
}

/** Clear all stored attempts */
export function clearAttempts(): void {
  try {
    localStorage.removeItem(ATTEMPTS_KEY);
  } catch (e) {
    console.error('Error clearing all attempts', e);
  }
}

