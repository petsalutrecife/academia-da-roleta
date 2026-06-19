// src/utils/resultUtils.ts

export interface AnswerRecord {
  questionId: string;
  selectedOption: string;
  answeredAt: string;
  rouletteNumber: number;
  rouletteColor: string;
  isCorrect?: boolean;
  pillar: string;
}

export interface PillarPerformance {
  correct: number;
  total: number;
  percentage: number;
  level: {
    name: string;
    emoji: string;
    colorKey: string;
  };
}

export interface AttemptResult {
  attemptId: string;
  student: {
    name: string;
    email?: string;
    phone?: string;
    group?: string;
  };
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number; // same as correctAnswers (0-30)
  percentage: number; // integer 0-100
  level: {
    name: string;
    emoji: string;
    colorKey: string;
  };
  pillars: Record<string, PillarPerformance>;
  answers: AnswerRecord[];
  status: 'completed';
}

/**
 * Calculates total correct answers given questions and answers.
 */
export function calculateScore(
  questions: { id: string; correctAnswer: string; pillar: string }[],
  answers: { questionId: string; selectedOption: string }[],
): number {
  return questions.reduce((total, q) => {
    const ans = answers.find((a) => a.questionId === q.id);
    if (ans && ans.selectedOption === q.correctAnswer) {
      return total + 1;
    }
    return total;
  }, 0);
}

/** Calculates level based on general score (0-30) */
export function calculateLevel(score: number) {
  if (score >= 0 && score <= 12) {
    return { name: 'Iniciante', emoji: '🟢', colorKey: 'green' };
  }
  if (score >= 13 && score <= 18) {
    return { name: 'Básico', emoji: '🔵', colorKey: 'blue' };
  }
  if (score >= 19 && score <= 24) {
    return { name: 'Intermediário', emoji: '🟣', colorKey: 'purple' };
  }
  if (score >= 25 && score <= 30) {
    return { name: 'Avançado', emoji: '🟠', colorKey: 'orange' };
  }
  throw new Error(`Pontuação geral inválida: ${score}`);
}

/** Calculates level based on module score (0-10) */
export function calculateModuleLevel(score: number) {
  if (score >= 0 && score <= 4) {
    return { name: 'Iniciante', emoji: '🟢', colorKey: 'green' };
  }
  if (score >= 5 && score <= 6) {
    return { name: 'Básico', emoji: '🔵', colorKey: 'blue' };
  }
  if (score >= 7 && score <= 8) {
    return { name: 'Intermediário', emoji: '🟣', colorKey: 'purple' };
  }
  if (score >= 9 && score <= 10) {
    return { name: 'Avançado', emoji: '🟠', colorKey: 'orange' };
  }
  throw new Error(`Pontuação de módulo inválida: ${score}`);
}

/** Compute pillar performance */
export function calculatePillarPerformance(
  questions: { id: string; pillar: string }[],
  answers: AnswerRecord[],
): Record<string, PillarPerformance> {
  const pillarMap: Record<string, { correct: number; total: number }> = {};
  
  questions.forEach((q) => {
    if (!pillarMap[q.pillar]) pillarMap[q.pillar] = { correct: 0, total: 0 };
    pillarMap[q.pillar].total += 1;
  });

  answers.forEach((a) => {
    const q = questions.find((q) => q.id === a.questionId);
    if (q) {
      if (a.isCorrect) {
        pillarMap[q.pillar].correct += 1;
      }
    }
  });

  const result: Record<string, PillarPerformance> = {};
  Object.entries(pillarMap).forEach(([pill, data]) => {
    const perc = Math.round((data.correct / data.total) * 100);
    result[pill] = {
      correct: data.correct,
      total: data.total,
      percentage: perc,
      level: calculateModuleLevel(data.correct),
    };
  });
  return result;
}

/** Build the final attempt object */
export function buildAttemptResult(params: {
  attemptId: string;
  student: { name: string; email?: string; phone?: string; group?: string };
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  answers: AnswerRecord[];
}): AttemptResult {
  const { attemptId, student, startedAt, completedAt, totalQuestions, answers } = params;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const score = correctAnswers; // 0-30
  const percentage = Math.round((score / totalQuestions) * 100);
  const level = calculateLevel(score);
  const pillars = calculatePillarPerformance(
    answers.map((a) => ({ id: a.questionId, pillar: a.pillar })),
    answers,
  );
  return {
    attemptId,
    student,
    startedAt,
    completedAt,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
    percentage,
    level,
    pillars,
    answers,
    status: 'completed',
  };
}
