/**
 * quizData.ts
 * Perguntas do Diagnóstico Academia da Roleta — Método C.G.E.
 * Reestruturado para 30 perguntas divididas em 3 módulos de 10 perguntas cada.
 */

export type PillarType = 'Controle Emocional' | 'Gestão Financeira' | 'Estratégia';
export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  id: OptionId;
  text: string;
}

export interface QuizQuestion {
  id: string; // e.g. "ce-01", "gf-01", "es-01"
  moduleId: string;
  moduleTitle: string;
  questionNumber: number; // 1-10
  text: string;
  question: string; // Retrocompatibilidade com .question
  options: QuizOption[];
  correctAnswer: OptionId;
  explanation: string;
  studyTip: string;
  pillar: PillarType; // Retrocompatibilidade com .pillar
}

export interface QuizModule {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const quizModules: QuizModule[] = [
  {
    id: 'controle-emocional',
    title: 'Controle Emocional',
    description: 'Neste módulo, você responderá perguntas sobre disciplina, foco, emoções, impulsividade e tomada de decisão.',
    questions: [
      {
        id: 'ce-01',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 1,
        text: 'O que significa estar em “Tilt”?',
        question: 'O que significa estar em “Tilt”?',
        options: [
          { id: 'A', text: 'Estar em uma sequência de vitórias' },
          { id: 'B', text: 'Jogar seguindo o plano de gestão' },
          { id: 'C', text: 'Estar emocionalmente abalado e tomando decisões impulsivas' },
          { id: 'D', text: 'Fazer uma pausa estratégica' }
        ],
        correctAnswer: 'C',
        explanation: 'Tilt é um estado de desequilíbrio emocional que pode levar o jogador a agir por impulso e abandonar o planejamento.',
        studyTip: 'Revise como emoções intensas podem interferir na tomada de decisão.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-02',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 2,
        text: 'O que é o estado de “Flow”?',
        question: 'O que é o estado de “Flow”?',
        options: [
          { id: 'A', text: 'Jogar sem estratégia definida' },
          { id: 'B', text: 'Apostar valores altos após uma vitória' },
          { id: 'C', text: 'Estado de concentração, foco e execução natural das decisões' },
          { id: 'D', text: 'Quando a banca atinge seu maior valor' }
        ],
        correctAnswer: 'C',
        explanation: 'Flow é um estado de concentração e presença, em que a pessoa executa suas decisões com foco e naturalidade.',
        studyTip: 'Revise a diferença entre foco estruturado e ação impulsiva.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-03',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 3,
        text: 'Qual comportamento demonstra uma mentalidade mais profissional durante uma sessão de jogo?',
        question: 'Qual comportamento demonstra uma mentalidade mais profissional durante uma sessão de jogo?',
        options: [
          { id: 'A', text: 'Tentar recuperar imediatamente uma perda' },
          { id: 'B', text: 'Alterar a estratégia após cada resultado negativo' },
          { id: 'C', text: 'Seguir o plano definido com disciplina e controle emocional' },
          { id: 'D', text: 'Aumentar as apostas quando estiver confiante' }
        ],
        correctAnswer: 'C',
        explanation: 'A mentalidade profissional está ligada à disciplina, consistência e respeito ao plano definido.',
        studyTip: 'Observe como a disciplina protege o processo de decisões impulsivas.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-04',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 4,
        text: 'Qual hormônio está mais relacionado à sensação de recompensa e pode levar o jogador a buscar novas entradas após uma vitória?',
        question: 'Qual hormônio está mais relacionado à sensação de recompensa e pode levar o jogador a buscar novas entradas após uma vitória?',
        options: [
          { id: 'A', text: 'Cortisol' },
          { id: 'B', text: 'Serotonina' },
          { id: 'C', text: 'Dopamina' },
          { id: 'D', text: 'Melatonina' }
        ],
        correctAnswer: 'C',
        explanation: 'A dopamina está associada ao sistema de recompensa e pode influenciar a busca por novas experiências de prazer ou estímulo.',
        studyTip: 'Revise como recompensas imediatas podem influenciar comportamentos repetitivos.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-05',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 5,
        text: 'O aumento excessivo do cortisol durante uma sessão pode provocar:',
        question: 'O aumento excessivo do cortisol durante uma sessão pode provocar:',
        options: [
          { id: 'A', text: 'Mais clareza e paciência' },
          { id: 'B', text: 'Maior capacidade de seguir o plano' },
          { id: 'C', text: 'Estresse, impulsividade e dificuldade na tomada de decisões' },
          { id: 'D', text: 'Maior controle emocional' }
        ],
        correctAnswer: 'C',
        explanation: 'O cortisol está relacionado ao estresse. Em excesso, pode prejudicar clareza, paciência e tomada de decisão.',
        studyTip: 'Revise como o estresse interfere no controle emocional.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-06',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 6,
        text: 'Um dos maiores riscos dos gatilhos emocionais na roleta é:',
        question: 'Um dos maiores riscos dos gatilhos emocionais na roleta é:',
        options: [
          { id: 'A', text: 'Melhorar a leitura da mesa' },
          { id: 'B', text: 'Aumentar a disciplina operacional' },
          { id: 'C', text: 'Influenciar decisões impulsivas sem critérios técnicos' },
          { id: 'D', text: 'Facilitar a gestão financeira' }
        ],
        correctAnswer: 'C',
        explanation: 'Gatilhos emocionais podem levar a respostas impulsivas, afastando o jogador dos critérios planejados.',
        studyTip: 'Observe quais situações despertam pressa, ansiedade ou desejo de recuperação.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-07',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 7,
        text: 'Segundo os estudos de Pennebaker, a escrita pode ajudar o jogador a:',
        question: 'Segundo os estudos de Pennebaker, a escrita pode ajudar o jogador a:',
        options: [
          { id: 'A', text: 'Descobrir números vencedores' },
          { id: 'B', text: 'Prever movimentos da roleta' },
          { id: 'C', text: 'Aumentar a frequência dos acertos' },
          { id: 'D', text: 'Organizar emoções e reduzir o impacto psicológico das perdas' }
        ],
        correctAnswer: 'D',
        explanation: 'A escrita expressiva pode ajudar na organização emocional e na elaboração de experiências difíceis.',
        studyTip: 'Use registros para observar emoções, padrões de comportamento e decisões tomadas.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-08',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 8,
        text: 'Qual comportamento caracteriza o chamado “modo recuperação”?',
        question: 'Qual comportamento caracteriza o chamado “modo recuperação”?',
        options: [
          { id: 'A', text: 'Encerrar a sessão após atingir o stop' },
          { id: 'B', text: 'Reduzir os valores após uma perda' },
          { id: 'C', text: 'Aumentar a agressividade para recuperar prejuízos rapidamente' },
          { id: 'D', text: 'Registrar os erros da sessão' }
        ],
        correctAnswer: 'C',
        explanation: 'O modo recuperação acontece quando a pessoa tenta compensar perdas rapidamente, aumentando risco e impulsividade.',
        studyTip: 'Revise como o desejo de recuperação pode comprometer o plano.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-09',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 9,
        text: 'Jogadores mais consistentes costumam:',
        question: 'Jogadores mais consistentes costumam:',
        options: [
          { id: 'A', text: 'Operar o maior número possível de entradas' },
          { id: 'B', text: 'Aumentar a exposição quando estão confiantes' },
          { id: 'C', text: 'Buscar emoção durante a sessão' },
          { id: 'D', text: 'Priorizar qualidade de entrada em vez de quantidade' }
        ],
        correctAnswer: 'D',
        explanation: 'A consistência está mais ligada à qualidade das decisões do que à quantidade de entradas.',
        studyTip: 'Revise la diferença entre operar por critério e operar por impulso.',
        pillar: 'Controle Emocional'
      },
      {
        id: 'ce-10',
        moduleId: 'controle-emocional',
        moduleTitle: 'Controle Emocional',
        questionNumber: 10,
        text: 'Qual das opções abaixo mais contribui para a evolução de um jogador?',
        question: 'Qual das opções abaixo mais contribui para a evolução de um jogador?',
        options: [
          { id: 'A', text: 'Trocar constantemente de estratégia' },
          { id: 'B', text: 'Buscar atalhos para recuperar perdas' },
          { id: 'C', text: 'Ignorar erros passados' },
          { id: 'D', text: 'Analisar o próprio comportamento e identificar padrões emocionais' }
        ],
        correctAnswer: 'D',
        explanation: 'A evolução depende da capacidade de observar decisões, emoções e padrões comportamentais.',
        studyTip: 'Use registros para identificar erros recorrentes e pontos de melhoria.',
        pillar: 'Controle Emocional'
      }
    ]
  },
  {
    id: 'gestao-financeira',
    title: 'Gestão Financeira',
    description: 'Neste módulo, você responderá perguntas sobre banca, limites, risco, variância e preservação do capital.',
    questions: [
      {
        id: 'gf-01',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 1,
        text: 'O que significa “Bankroll”?',
        question: 'O que significa “Bankroll”?',
        options: [
          { id: 'A', text: 'Valor de uma única aposta' },
          { id: 'B', text: 'Quantidade de estratégias estudadas' },
          { id: 'C', text: 'Total de números analisados na sessão' },
          { id: 'D', text: 'Capital destinado exclusivamente para operar na roleta' }
        ],
        correctAnswer: 'D',
        explanation: 'Bankroll é o capital separado exclusivamente para operar, sem comprometer recursos essenciais.',
        studyTip: 'Revise a importância de separar a banca dos recursos pessoais.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-02',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 2,
        text: 'O que é um “Stop Loss”?',
        question: 'O que é um “Stop Loss”?',
        options: [
          { id: 'A', text: 'Meta de ganhos da sessão' },
          { id: 'B', text: 'Estratégia de recuperação de perdas' },
          { id: 'C', text: 'Limite máximo de perda definido antes de iniciar uma sessão' },
          { id: 'D', text: 'Valor reservado para futuras entradas' }
        ],
        correctAnswer: 'C',
        explanation: 'Stop Loss é o limite máximo de perda definido previamente para encerrar uma sessão.',
        studyTip: 'Revise a importância de definir limites antes de iniciar.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-03',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 3,
        text: 'Qual é a principal função da gestão de banca para um jogador?',
        question: 'Qual é a principal função da gestão de banca para um jogador?',
        options: [
          { id: 'A', text: 'Recuperar perdas rapidamente' },
          { id: 'B', text: 'Aumentar os valores após cada derrota' },
          { id: 'C', text: 'Preservar o capital e controlar os riscos da operação' },
          { id: 'D', text: 'Buscar lucros maiores em menos tempo' }
        ],
        correctAnswer: 'C',
        explanation: 'A gestão de banca serve para preservar capital, controlar riscos e sustentar o planejamento.',
        studyTip: 'Revise a diferença entre proteger capital e buscar recuperação imediata.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-04',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 4,
        text: 'Antes de separar uma banca para a roleta, o mais recomendado é:',
        question: 'Antes de separar uma banca para a roleta, o mais recomendado é:',
        options: [
          { id: 'A', text: 'Utilizar dinheiro destinado às despesas mensais' },
          { id: 'B', text: 'Utilizar recursos de emergência' },
          { id: 'C', text: 'Pedir empréstimos para aumentar a banca' },
          { id: 'D', text: 'Separar apenas um valor que não comprometa sua vida financeira' }
        ],
        correctAnswer: 'D',
        explanation: 'A banca não deve comprometer despesas essenciais, reservas ou responsabilidades financeiras.',
        studyTip: 'Revise o princípio de operar somente com valor previamente separado e não essencial.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-05',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 5,
        text: 'O que significa ter uma exposição excessiva ao risco?',
        question: 'O que significa ter uma exposição excessiva ao risco?',
        options: [
          { id: 'A', text: 'Operar com disciplina' },
          { id: 'B', text: 'Utilizar valores proporcionais à banca' },
          { id: 'C', text: 'Comprometer uma parcela muito grande da banca em poucas entradas' },
          { id: 'D', text: 'Operar com stop loss definido' }
        ],
        correctAnswer: 'C',
        explanation: 'Exposição excessiva ocorre quando uma parte grande da banca é colocada em risco em poucas entradas.',
        studyTip: 'Revise proporção, limite e proteção do capital.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-06',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 6,
        text: 'Qual é uma prática saudável em relação aos lucros obtidos?',
        question: 'Qual é uma prática saudável em relação aos lucros obtidos?',
        options: [
          { id: 'A', text: 'Apostar todo o lucro na próxima sessão' },
          { id: 'B', text: 'Aumentar as entradas sem planejamento' },
          { id: 'C', text: 'Ignorar a gestão após uma sequência positiva' },
          { id: 'D', text: 'Definir critérios para saque e reinvestimento dos ganhos' }
        ],
        correctAnswer: 'D',
        explanation: 'Critérios de saque e reinvestimento ajudam a proteger resultados e manter organização financeira.',
        studyTip: 'Revise como metas e limites reduzem decisões guiadas pela ganância.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-07',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 7,
        text: 'O que a variância representa para um jogador de roleta?',
        question: 'O que a variância representa para um jogador de roleta?',
        options: [
          { id: 'A', text: 'Um erro na estratégia' },
          { id: 'B', text: 'Uma falha da plataforma' },
          { id: 'C', text: 'As oscilações naturais entre ganhos e perdas ao longo do tempo' },
          { id: 'D', text: 'A quantidade de números analisados' }
        ],
        correctAnswer: 'C',
        explanation: 'Variância representa oscilações naturais de resultados ao longo do tempo.',
        studyTip: 'Revise por que resultados positivos e negativos podem oscilar mesmo com planejamento.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-08',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 8,
        text: 'Qual é a principal função da gestão financeira durante períodos de resultados negativos?',
        question: 'Qual é a principal função da gestão financeira durante períodos de resultados negativos?',
        options: [
          { id: 'A', text: 'Eliminar as perdas' },
          { id: 'B', text: 'Recuperar imediatamente o prejuízo' },
          { id: 'C', text: 'Aumentar a agressividade das apostas' },
          { id: 'D', text: 'Garantir a sobrevivência da banca até que novas oportunidades apareçam' }
        ],
        correctAnswer: 'D',
        explanation: 'A gestão financeira ajuda a preservar a banca durante períodos negativos, evitando decisões impulsivas.',
        studyTip: 'Revise como limites ajudam a atravessar oscilações.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-09',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 9,
        text: 'Por que é importante definir uma meta de lucro?',
        question: 'Por que é importante definir uma meta de lucro?',
        options: [
          { id: 'A', text: 'Porque elimina o risco de perdas' },
          { id: 'B', text: 'Porque garante ganhos diários' },
          { id: 'C', text: 'Porque aumenta a precisão das análises' },
          { id: 'D', text: 'Porque ajuda a controlar a ganância e preservar resultados' }
        ],
        correctAnswer: 'D',
        explanation: 'A meta de lucro ajuda a controlar o excesso de exposição após resultados positivos.',
        studyTip: 'Revise como metas podem proteger resultados já alcançados.',
        pillar: 'Gestão Financeira'
      },
      {
        id: 'gf-10',
        moduleId: 'gestao-financeira',
        moduleTitle: 'Gestão Financeira',
        questionNumber: 10,
        text: 'Qual frase melhor define uma boa gestão financeira?',
        question: 'Qual frase melhor define uma boa gestão financeira?',
        options: [
          { id: 'A', text: 'Ganhar o máximo possível em pouco tempo' },
          { id: 'B', text: 'Recuperar qualquer prejuízo rapidamente' },
          { id: 'C', text: 'Evitar completamente as perdas' },
          { id: 'D', text: 'Proteger o capital para permanecer no jogo e aproveitar oportunidades futuras' }
        ],
        correctAnswer: 'D',
        explanation: 'Boa gestão financeira está ligada à proteção do capital e à continuidade do planejamento.',
        studyTip: 'Revise o conceito de preservação da banca.',
        pillar: 'Gestão Financeira'
      }
    ]
  },
  {
    id: 'estrategias',
    title: 'Estratégias',
    description: 'Neste módulo, você responderá perguntas sobre análise da roleta, padrões, confluência e critérios de entrada.',
    questions: [
      {
        id: 'es-01',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 1,
        text: 'O que significa “Confluência” na análise da roleta?',
        question: 'O que significa “Confluência” na análise da roleta?',
        options: [
          { id: 'A', text: 'Quando dois números saem seguidamente na mesma sessão' },
          { id: 'B', text: 'Quando uma estratégia apresenta prejuízo consecutivo' },
          { id: 'C', text: 'Quando dois ou mais fatores de análise apontam para a mesma oportunidade de entrada' },
          { id: 'D', text: 'Quando a banca atinge o valor máximo planejado' }
        ],
        correctAnswer: 'C',
        explanation: 'Confluência ocorre quando dois ou mais fatores de análise apontam para uma mesma possibilidade.',
        studyTip: 'Revise como diferentes critérios podem reforçar uma leitura de mesa.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-02',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 2,
        text: 'Qual das opções abaixo pertence à área externa da roleta?',
        question: 'Qual das opções abaixo pertence à área externa da roleta?',
        options: [
          { id: 'A', text: 'Cavalo' },
          { id: 'B', text: 'Rua' },
          { id: 'C', text: 'Coluna' },
          { id: 'D', text: 'Pleno' }
        ],
        correctAnswer: 'C',
        explanation: 'Coluna pertence à área externa da roleta, enquanto cavalo, rua e pleno são tipos de apostas internas.',
        studyTip: 'Revise a diferença entre apostas internas e externas.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-03',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 3,
        text: 'O que significa apostar em uma “Dúzia”?',
        question: 'O que significa apostar em uma “Dúzia”?',
        options: [
          { id: 'A', text: 'Apostar em 6 números' },
          { id: 'B', text: 'Apostar em 10 números' },
          { id: 'C', text: 'Apostar em 12 números' },
          { id: 'D', text: 'Apostar em 18 números' }
        ],
        correctAnswer: 'C',
        explanation: 'Dúzia é uma aposta que cobre 12 números.',
        studyTip: 'Revise as divisões externas da mesa.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-04',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 4,
        text: 'Ao observar uma sequência de resultados, qual é o principal objetivo da análise da roleta?',
        question: 'Ao observar uma sequência de resultados, qual é o principal objetivo da análise da roleta?',
        options: [
          { id: 'A', text: 'Prever exatamente o próximo número' },
          { id: 'B', text: 'Identificar comportamentos e informações relevantes da mesa' },
          { id: 'C', text: 'Encontrar números que nunca irão sair' },
          { id: 'D', text: 'Apostar em todos os setores da roleta' }
        ],
        correctAnswer: 'B',
        explanation: 'A análise busca identificar informações relevantes e comportamentos observáveis, não prever resultados com certeza.',
        studyTip: 'Revise a diferença entre análise e previsão garantida.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-05',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 5,
        text: 'Qual comportamento demonstra uma mentalidade mais profissional durante uma sessão de jogo?',
        question: 'Qual comportamento demonstra uma mentalidade mais profissional durante uma sessão de jogo?',
        options: [
          { id: 'A', text: 'Tentar recuperar imediatamente uma perda' },
          { id: 'B', text: 'Alterar a estratégia após cada resultado negativo' },
          { id: 'C', text: 'Seguir o plano definido com disciplina e controle emocional' },
          { id: 'D', text: 'Aumentar as apostas quando estiver confiante' }
        ],
        correctAnswer: 'C',
        explanation: 'A mentalidade profissional envolve disciplina, controle emocional e respeito ao plano.',
        studyTip: 'Revise como estratégia e controle emocional precisam trabalhar juntos.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-06',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 6,
        text: 'Em uma repetição de mesmo número, qual a tendência?',
        question: 'Em uma repetição de mesmo número, qual a tendência?',
        options: [
          { id: 'A', text: 'Buscar terminal zero ou seus vizinhos' },
          { id: 'B', text: 'Buscar seus vizinhos' },
          { id: 'C', text: 'Buscar crescente ou decrescente' },
          { id: 'D', text: 'Todas as respostas acima' }
        ],
        correctAnswer: 'D',
        explanation: 'Em uma repetição, podem ser observadas diferentes possibilidades de leitura, incluindo vizinhos, terminais e movimentos crescentes ou decrescentes.',
        studyTip: 'Revise os critérios utilizados para analisar repetições.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-07',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 7,
        text: 'Um número que encontra-se na diagonal com o zero verde, o que fazer no seu retorno?',
        question: 'Um número que encontra-se na diagonal com o zero verde, o que fazer no seu retorno?',
        options: [
          { id: 'A', text: 'Buscar o zero ou terminais zero' },
          { id: 'B', text: 'Buscar a soma ou subtração dos números em sua outra diagonal' },
          { id: 'C', text: 'Buscar os terminais do número em questão' },
          { id: 'D', text: 'Buscar a crescente ou decrescente do número em questão' }
        ],
        correctAnswer: 'B',
        explanation: 'Nessa leitura específica, a referência está na soma ou subtração dos números em sua outra diagonal.',
        studyTip: 'Revise as relações de diagonal e os critérios utilizados nessa leitura.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-08',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 8,
        text: 'Numa formação de padrão onde um número está entre uma crescente e decrescente, quais as marcações na race?',
        question: 'Numa formação de padrão onde um número está entre uma crescente e decrescente, quais as marcações na race?',
        options: [
          { id: 'A', text: 'Jogar com 1 vizinho na crescente e decrescente do próximo número' },
          { id: 'B', text: 'Jogar com 5 vizinhos no zero verde' },
          { id: 'C', text: 'Jogar com 1 vizinho nos dois números que formou na soma ou subtração entre eles' },
          { id: 'D', text: 'Nenhuma das respostas acima' }
        ],
        correctAnswer: 'C',
        explanation: 'Nessa formação, a marcação indicada considera 1 vizinho nos dois números formados pela soma ou subtração entre eles.',
        studyTip: 'Revise formações de padrão e marcações na race.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-09',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 9,
        text: 'Ao identificar um padrão repetitivo em uma mesa, o jogador deve:',
        question: 'Ao identificar um padrão repetitivo em uma mesa, o jogador deve:',
        options: [
          { id: 'A', text: 'Considerá-lo uma certeza' },
          { id: 'B', text: 'Aumentar imediatamente as apostas' },
          { id: 'C', text: 'Ignorar a gestão financeira' },
          { id: 'D', text: 'Utilizá-lo como informação dentro de um conjunto maior de análises' }
        ],
        correctAnswer: 'D',
        explanation: 'Um padrão deve ser tratado como informação de análise, não como certeza de resultado.',
        studyTip: 'Revise como padrões devem ser combinados com outros critérios.',
        pillar: 'Estratégia'
      },
      {
        id: 'es-10',
        moduleId: 'estrategias',
        moduleTitle: 'Estratégias',
        questionNumber: 10,
        text: 'O que significa aguardar uma confirmação antes de entrar?',
        question: 'O que significa aguardar uma confirmação antes de entrar?',
        options: [
          { id: 'A', text: 'Apostar mais tarde por insegurança' },
          { id: 'B', text: 'Esperar uma sequência de perdas' },
          { id: 'C', text: 'Ignorar a estratégia inicial' },
          { id: 'D', text: 'Buscar sinais adicionais que reforcem a oportunidade identificada' }
        ],
        correctAnswer: 'D',
        explanation: 'Aguardar confirmação significa buscar sinais adicionais que reforcem a leitura antes de tomar uma decisão.',
        studyTip: 'Revise o papel da confirmação dentro da estratégia.',
        pillar: 'Estratégia'
      }
    ]
  }
];

export const quizQuestions: QuizQuestion[] = [
  ...quizModules[0].questions,
  ...quizModules[1].questions,
  ...quizModules[2].questions
];
