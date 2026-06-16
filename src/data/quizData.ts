/**
 * quizData.ts
 * Perguntas definitivas do Diagnóstico Academia da Roleta — Etapa 3.
 * correctAnswer existe na estrutura mas NÃO é usado para feedback visual nesta etapa.
 */

export type PillarType = 'Controle Emocional' | 'Gestão Financeira' | 'Estratégia';
export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  id: OptionId;
  text: string;
}

export interface QuizQuestion {
  id: number;
  pillar: PillarType;
  question: string;
  options: QuizOption[];
  correctAnswer: OptionId; // armazenado, mas não exibido nesta etapa
  explanation: string;     // usado futuramente no relatório
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    pillar: 'Controle Emocional',
    question: 'O que significa estar em "Tilt"?',
    options: [
      { id: 'A', text: 'Estar em uma sequência de vitórias.' },
      { id: 'B', text: 'Jogar seguindo o plano de gestão.' },
      { id: 'C', text: 'Estar emocionalmente abalado e tomando decisões impulsivas.' },
      { id: 'D', text: 'Fazer uma pausa estratégica.' },
    ],
    correctAnswer: 'C',
    explanation:
      'Tilt é um estado de desequilíbrio emocional que pode levar a decisões impulsivas e ao abandono do planejamento.',
  },
  {
    id: 2,
    pillar: 'Controle Emocional',
    question: 'O que é o estado de "Flow"?',
    options: [
      { id: 'A', text: 'Jogar sem estratégia definida.' },
      { id: 'B', text: 'Apostar valores altos após uma vitória.' },
      { id: 'C', text: 'Estado de concentração, foco e execução natural das decisões.' },
      { id: 'D', text: 'Quando a banca atinge seu maior valor.' },
    ],
    correctAnswer: 'C',
    explanation:
      'Flow é um estado de alta concentração no qual a pessoa executa suas decisões com foco, presença e naturalidade.',
  },
  {
    id: 3,
    pillar: 'Gestão Financeira',
    question: 'O que significa "Bankroll" ou "Banca"?',
    options: [
      { id: 'A', text: 'Valor de uma única aposta.' },
      { id: 'B', text: 'Quantidade de estratégias estudadas.' },
      { id: 'C', text: 'Total de números analisados na sessão.' },
      { id: 'D', text: 'Capital destinado exclusivamente para operar na roleta.' },
    ],
    correctAnswer: 'D',
    explanation:
      'Bankroll é o capital separado exclusivamente para a atividade, sem comprometer recursos destinados a outras necessidades.',
  },
  {
    id: 4,
    pillar: 'Gestão Financeira',
    question: 'O que é um "Stop Loss"?',
    options: [
      { id: 'A', text: 'Meta de ganhos da sessão.' },
      { id: 'B', text: 'Estratégia de recuperação de perdas.' },
      { id: 'C', text: 'Limite máximo de perda definido antes de iniciar uma sessão.' },
      { id: 'D', text: 'Valor reservado para futuras entradas.' },
    ],
    correctAnswer: 'C',
    explanation:
      'Stop Loss é um limite definido previamente para interromper a sessão ao atingir determinada perda.',
  },
  {
    id: 5,
    pillar: 'Estratégia',
    question: 'O que significa "Confluência" na análise da roleta?',
    options: [
      { id: 'A', text: 'Quando dois números saem seguidamente na mesma sessão.' },
      { id: 'B', text: 'Quando uma estratégia apresenta prejuízo consecutivo.' },
      { id: 'C', text: 'Quando dois ou mais fatores de análise apontam para a mesma oportunidade de entrada.' },
      { id: 'D', text: 'Quando a banca atinge o valor máximo planejado.' },
    ],
    correctAnswer: 'C',
    explanation:
      'Confluência ocorre quando diferentes critérios ou sinais de análise apontam para a mesma possibilidade de decisão.',
  },
];
