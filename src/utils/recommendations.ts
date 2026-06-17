// src/utils/recommendations.ts

import type { ResultData } from '../pages/Result';
import type { AttemptResult } from './resultUtils';

/**
 * Generate a list of personalized recommendations based on:
 *  - Overall level (Iniciante, Básico, Intermediário, Avançado)
 *  - Incorrect answers (array of question keys)
 *  - Pillar performance percentages
 */
export function getRecommendations(
  result: ResultData,
  incorrectAnswers: string[],
  attempt: AttemptResult | null,
): string[] {
  const recommendations: string[] = [];

  // Helper to add only if not duplicated
  const add = (text: string) => {
    if (!recommendations.includes(text) && recommendations.length < 5) {
      recommendations.push(text);
    }
  };

  // 1. Recommendations based on level
  if (result.scoreAverage <= 40) {
    add('Comece pelos fundamentos. Uma base clara facilita a compreensão das etapas seguintes do Método C.G.E.');
    add('Revise os conceitos de Tilt, Flow, Bankroll, Stop Loss e Confluência.');
  } else if (result.scoreAverage <= 70) {
    add('Revise as respostas incorretas e fortaleça o pilar com menor desempenho.');
    add('Relacionar controle emocional e gestão financeira ajudará na tomada de decisão.');
  } else if (result.scoreAverage < 100) {
    add('Aprofunde o conceito da resposta incorreta e integre os três pilares de forma consistente.');
    add('Pratique a aplicação dos princípios em situações simuladas para ganhar consistência.');
  } else {
    add('Continue aprofundando conteúdos avançados e mantenha disciplina na revisão periódica dos fundamentos.');
  }

  // 2. Recommendations for each incorrect answer
  const answerMap: Record<string, string> = {
    tilt: 'Revise o conceito de Tilt e como o desequilíbrio emocional pode provocar decisões impulsivas.',
    flow: 'Revise o conceito de Flow e sua relação com concentração, foco e execução natural.',
    bankroll: 'Revise o conceito de Bankroll e a importância de separar o capital destinado à atividade.',
    stoploss: 'Revise o conceito de Stop Loss e a importância de definir um limite antes de iniciar uma sessão.',
    confluencia: 'Revise o conceito de Confluência e como diferentes fatores de análise podem apontar para uma mesma possibilidade.',
  };
  incorrectAnswers.forEach((key) => {
    const txt = answerMap[key];
    if (txt) add(txt);
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
    add('Continue desenvolvendo os pilares com desempenho em desenvolvimento para alcançar domínio completo.');
  }

  return recommendations;
}
