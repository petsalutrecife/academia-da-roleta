// src/utils/recommendations.ts

import type { ResultData } from '../pages/Result';
import { quizQuestions } from '../data/quizData';

/**
 * Generate a list of personalized recommendations based on:
 *  - Overall level (Iniciante, Básico, Intermediário, Avançado)
 *  - Incorrect answers
 *  - Pillar performance percentages
 */
export function getRecommendations(
  result: ResultData,
  _incorrectAnswers: string[],
  _attempt: any,
): string[] {
  const recommendations: string[] = [];

  // Helper to add only if not duplicated
  const add = (text: string) => {
    if (!recommendations.includes(text) && recommendations.length < 5) {
      recommendations.push(text);
    }
  };

  // 1. Recommendations based on general percentage
  if (result.scoreAverage <= 40) {
    add('Comece pelos fundamentos. Uma base clara facilita a compreensão das etapas seguintes do Método C.G.E.');
    add('Revise os conceitos essenciais de Controle Emocional, Gestão Financeira e Estratégia.');
  } else if (result.scoreAverage <= 60) {
    add('Revise as respostas incorretas e fortaleça o pilar com menor desempenho.');
    add('Relacionar controle emocional e gestão financeira ajudará na tomada de decisão.');
  } else if (result.scoreAverage < 90) {
    add('Aprofunde o conceito das respostas incorretas e integre os três pilares de forma consistente.');
    add('Pratique a aplicação dos princípios em situações simuladas para ganhar consistência.');
  } else {
    add('Excelente desempenho! Continue mantendo a disciplina na revisão periódica dos fundamentos e aplicando o plano operacional.');
  }

  // 2. Recommendations for each incorrect answer using its studyTip
  const incorrectRecords = result.answers.filter((a) => !a.isCorrect);
  incorrectRecords.forEach((rec) => {
    const origQuestion = quizQuestions.find((q) => q.id === rec.questionId);
    if (origQuestion && origQuestion.studyTip) {
      add(origQuestion.studyTip);
    }
  });

  // 3. Recommendations based on pillar performance
  const pillars = [
    { name: 'Controle Emocional', perc: result.emo },
    { name: 'Gestão Financeira', perc: result.fin },
    { name: 'Estratégia', perc: result.est },
  ];
  
  const low = pillars.filter((p) => p.perc < 50);
  const medium = pillars.filter((p) => p.perc >= 50 && p.perc < 80);
  
  if (low.length === 1) {
    add(`Fortaleça o pilar "${low[0].name}" focando nos conceitos associados. Uma melhoria aqui aumentará seu desempenho geral.`);
  } else if (low.length > 1) {
    add('Fortaleça os pilares com menor desempenho, pois eles impactam diretamente a eficácia da sua estratégia.');
  } else if (medium.length) {
    add('Continue desenvolvendo os pilares com desempenho intermediário para alcançar domínio completo.');
  }

  return recommendations;
}
