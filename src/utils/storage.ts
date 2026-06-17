// src/utils/storage.ts

import type { AttemptResult } from './resultUtils';

const ATTEMPTS_KEY = 'diagnosticoAttempts';

/** Save an attempt (append to array) */
export function saveAttempt(attempt: AttemptResult): void {
  try {
    const existing = localStorage.getItem(ATTEMPTS_KEY);
    const attempts: AttemptResult[] = existing ? JSON.parse(existing) : [];
    // replace if same attemptId exists
    const filtered = attempts.filter((a) => a.attemptId !== attempt.attemptId);
    filtered.push(attempt);
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(filtered));
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
