/**
 * Banco de perguntas do quiz: Língua Portuguesa.
 *
 * Estrutura de cada item:
 *  - question:    enunciado
 *  - options:     lista de alternativas
 *  - correct:     índice (começando em 0) da alternativa correta
 *  - explanation: explicação comentada, exibida assim que o usuário responde
 */
const QUESTIONS = [
  {
    question: "Qual alternativa traz palavras escritas de acordo com o Acordo Ortográfico atual?",
    options: [
      "idéia",
      "ideia",
      "heróico",
      "feiúra"
    ],
    correct: 1,
    explanation:
      "Com o Acordo Ortográfico, as palavras paroxítonas com ditongo aberto \"ei\" ou \"oi\" perderam o acento: " +
      "ideia (e não \"idéia\") e heroico (e não \"heróico\"). Também perdeu o acento o \"i\" ou \"u\" tônico " +
      "que vem depois de ditongo em paroxítonas: feiura (e não \"feiúra\")."
  },
  {
    question: "Em qual frase o sinal indicativo de crase está usado corretamente?",
    options: [
      "Entreguei o prêmio à diretora.",
      "Fomos à pé até o centro.",
      "Ela começou à cantar.",
      "Estou disposta à ajudar."
    ],
    correct: 0,
    explanation:
      "A crase é a fusão da preposição \"a\" com o artigo \"a\". Em \"entreguei o prêmio à diretora\", " +
      "o verbo pede a preposição \"a\" (entregar a alguém) e a palavra \"diretora\" aceita o artigo \"a\". " +
      "Nas demais frases não há crase: \"a pé\" é expressão de palavra masculina, e diante de verbo " +
      "(\"cantar\", \"ajudar\") não existe artigo, então só cabe a preposição \"a\"."
  },
  {
    question: "Assinale a frase com concordância verbal de acordo com a norma-padrão.",
    options: [
      "Haviam muitas pessoas na fila.",
      "Fazem dois anos que me formei.",
      "Houve muitos problemas na reunião.",
      "Existe muitas dúvidas sobre o tema."
    ],
    correct: 2,
    explanation:
      "Quando significa \"existir\", o verbo haver é impessoal: não tem sujeito e fica sempre na 3ª pessoa " +
      "do singular (\"houve muitos problemas\", \"havia muitas pessoas\"). Na primeira alternativa deveria ser " +
      "\"havia\". Na segunda, o verbo fazer indicando tempo também é impessoal: \"faz dois anos\". " +
      "Na última, o verbo existir tem sujeito (\"dúvidas\") e deve concordar com ele: \"existem\"."
  },
  {
    question: "Complete a frase: \"Ele é um ___ aluno, pois se comporta ___ na sala.\"",
    options: [
      "mal / mau",
      "mal / mal",
      "mau / mau",
      "mau / mal"
    ],
    correct: 3,
    explanation:
      "\"Mau\" é adjetivo e é o oposto de \"bom\": mau aluno. \"Mal\" é advérbio (ou substantivo) e é o " +
      "oposto de \"bem\": comporta-se mal. Um truque é trocar por seus opostos: \"bom aluno\" e " +
      "\"comporta-se bem\" fazem sentido, então usamos mau e mal, nessa ordem."
  },
  {
    question: "Em \"O vento sussurrava segredos pelas frestas\", que figura de linguagem aparece?",
    options: [
      "Hipérbole",
      "Prosopopeia (personificação)",
      "Antítese",
      "Eufemismo"
    ],
    correct: 1,
    explanation:
      "A prosopopeia, ou personificação, atribui ações e características humanas a seres inanimados: " +
      "o vento \"sussurra segredos\", algo que só pessoas fazem. Hipérbole é exagero, antítese " +
      "é a oposição de ideias (luz e sombra) e eufemismo é a suavização de uma expressão dura."
  },
  {
    question: "Assinale a frase em que a vírgula está empregada corretamente.",
    options: [
      "Maria, venha cá agora.",
      "O aluno, estudioso passou no concurso.",
      "Os alunos, chegaram cedo.",
      "Ele disse, que viria."
    ],
    correct: 0,
    explanation:
      "A vírgula separa o vocativo (o termo que chama alguém): \"Maria, venha cá\". " +
      "Na segunda frase, o termo \"estudioso\" é explicativo e precisa de duas vírgulas: \"O aluno, " +
      "estudioso, passou\". Nas duas últimas, a vírgula separa termos que não devem ser separados: " +
      "sujeito do verbo (\"Os alunos, chegaram\") e verbo do seu complemento (\"disse, que viria\")."
  },
  {
    question: "Complete: \"Não fui à aula ___ estava doente.\"",
    options: [
      "por que",
      "porquê",
      "porque",
      "por quê"
    ],
    correct: 2,
    explanation:
      "\"Porque\" (junto e sem acento) é conjunção que indica causa ou explicação: estava doente é o motivo. " +
      "\"Por que\" (separado) é usado em perguntas (\"Por que você faltou?\") ou com o sentido de \"pelo qual\". " +
      "\"Porquê\" é substantivo e vem com artigo (\"o porquê da falta\"). \"Por quê\" aparece no final de " +
      "frases interrogativas (\"Você faltou por quê?\")."
  },
  {
    question: "Na oração \"Choveu muito ontem.\", qual é o tipo de sujeito?",
    options: [
      "Sujeito simples",
      "Sujeito composto",
      "Sujeito oculto",
      "Sujeito inexistente (oração sem sujeito)"
    ],
    correct: 3,
    explanation:
      "Verbos que indicam fenômenos da natureza (chover, ventar, trovejar, nevar) são impessoais: " +
      "formam orações sem sujeito e ficam na 3ª pessoa do singular. Não há a quem atribuir a ação, " +
      "por isso o sujeito não é simples, composto nem oculto, mas inexistente."
  },
  {
    question: "Qual frase está de acordo com a norma-padrão quanto à regência do verbo assistir?",
    options: [
      "Assisti o filme ontem.",
      "Assisti ao filme ontem.",
      "Assisti no filme ontem.",
      "Assisti de o filme ontem."
    ],
    correct: 1,
    explanation:
      "No sentido de \"ver\", o verbo assistir é transitivo indireto e exige a preposição \"a\": " +
      "assistir a algo (\"assisti ao filme\"). A forma \"assisti o filme\" é comum na fala, mas " +
      "não segue a norma-padrão, e as demais preposições (\"no\", \"de o\") não são pedidas pelo verbo."
  },
  {
    question: "Complete: \"Não o vejo ___ muitos anos, mas nos veremos daqui ___ uma semana.\"",
    options: [
      "há / a",
      "a / há",
      "há / há",
      "a / a"
    ],
    correct: 0,
    explanation:
      "\"Há\" (do verbo haver) indica tempo já passado e equivale a \"faz\": \"não o vejo há muitos anos\". " +
      "\"A\" indica tempo futuro ou distância: \"daqui a uma semana\". Um truque é testar com " +
      "\"faz\": só é possível dizer \"faz muitos anos\" no passado, por isso o primeiro espaço leva \"há\"."
  }
];
