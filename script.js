/**
 * Lógica do Quiz: Língua Portuguesa
 *
 * Responsabilidades:
 *  - navegar entre as telas (início, pergunta, resultado)
 *  - validar a resposta e mostrar a explicação comentada
 *  - calcular a pontuação final
 *  - manter o ranking ao vivo (top 10) e o contador de acessos,
 *    usando Firebase Realtime Database (ou localStorage se não configurado)
 *
 * Depende de: config.js (FIREBASE_URL, NO_RANKING, NO_ACESSOS) e questions.js (QUESTIONS)
 */

/* =========================================================
   1. CONSTANTES E ESTADO
   ========================================================= */

const CHAVE_RANKING = "quizPortugues.ranking"; // usado só no modo local
const CHAVE_ACESSOS = "quizPortugues.acessos"; // usado só no modo local
const TAMANHO_RANKING = 10;

// Modo online: só ativa se a URL do Firebase foi preenchida em config.js
const BASE_URL = (typeof FIREBASE_URL === "string" ? FIREBASE_URL : "").replace(/\/+$/, "");
const MODO_ONLINE = BASE_URL !== "";

/** Estado da partida em andamento */
const estado = {
  nome: "",
  indice: 0,          // pergunta atual (começa em 0)
  pontos: 0,          // acertos
  respondida: false,  // impede responder duas vezes a mesma pergunta
  inicio: 0           // timestamp de início, para medir o tempo total
};

/** Último ranking recebido e o jogador a destacar */
let rankingAtual = [];
let idDestaque = null;

/* =========================================================
   2. REFERÊNCIAS AO DOM
   ========================================================= */

const el = {
  telaInicio:    document.getElementById("tela-inicio"),
  telaPergunta:  document.getElementById("tela-pergunta"),
  telaResultado: document.getElementById("tela-resultado"),

  campoNome:     document.getElementById("campo-nome"),
  erroNome:      document.getElementById("erro-nome"),
  btnIniciar:    document.getElementById("btn-iniciar"),
  btnProxima:    document.getElementById("btn-proxima"),
  btnReiniciar:  document.getElementById("btn-reiniciar"),

  progresso:    document.getElementById("progresso"),
  preenchimento:      document.getElementById("preenchimento"),
  numPergunta:   document.getElementById("num-pergunta"),
  pontosAtuais:  document.getElementById("pontos-atuais"),
  enunciado:     document.getElementById("enunciado"),
  opcoes:        document.getElementById("opcoes"),

  feedback:      document.getElementById("feedback"),
  feedbackTitulo: document.getElementById("feedback-titulo"),
  feedbackTexto: document.getElementById("feedback-texto"),

  notaFinal:     document.getElementById("nota-final"),
  mensagemFinal: document.getElementById("mensagem-final"),
  percentual:    document.getElementById("percentual"),
  tempoFinal:    document.getElementById("tempo-final"),
  posicaoFinal:  document.getElementById("posicao-final"),

  listaRanking:  document.getElementById("lista-ranking"),
  statusRanking: document.getElementById("status-ranking"),
  contadorAcessos: document.getElementById("contador-acessos")
};

/* =========================================================
   3. ARMAZENAMENTO
   Modo online: Firebase Realtime Database (API REST, via fetch).
   Modo local: localStorage (quando o Firebase não está configurado).
   ========================================================= */

/** Lê e converte um valor JSON do localStorage. */
function lerLocal(chave, valorPadrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto === null ? valorPadrao : JSON.parse(bruto);
  } catch (erro) {
    return valorPadrao;
  }
}

/** Salva um valor como JSON no localStorage. */
function salvarLocal(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    /* sem armazenamento: o quiz continua funcionando */
  }
}

/** Faz uma requisição ao Firebase e devolve o JSON da resposta. */
async function chamarFirebase(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}/${caminho}`, opcoes);
  if (!resposta.ok) throw new Error(`Firebase respondeu ${resposta.status}`);
  return resposta.json();
}

/* =========================================================
   4. CONTADOR DE ACESSOS
   ========================================================= */

/** Soma 1 a cada abertura da página e mostra o total. */
async function registrarAcesso() {
  if (!MODO_ONLINE) {
    const total = Number(lerLocal(CHAVE_ACESSOS, 0)) + 1;
    salvarLocal(CHAVE_ACESSOS, total);
    el.contadorAcessos.textContent = total;
    return;
  }

  try {
    // Incremento feito no servidor: vários visitantes ao mesmo tempo não se atropelam
    await chamarFirebase(`${NO_ACESSOS}.json`, {
      method: "PUT",
      body: JSON.stringify({ ".sv": { increment: 1 } })
    });
    el.contadorAcessos.textContent = await chamarFirebase(`${NO_ACESSOS}.json`);
  } catch (erro) {
    el.contadorAcessos.textContent = "-";
  }
}

/* =========================================================
   5. RANKING AO VIVO
   ========================================================= */

/** Ordena por pontos (maior primeiro) e, em empate, por tempo (menor primeiro). */
function compararJogadores(a, b) {
  return b.pontos - a.pontos || a.tempo - b.tempo;
}

/** Formata segundos como mm:ss. */
function formatarTempo(segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  return `${min}:${seg}`;
}

/** Mostra o estado da conexão do ranking. */
function definirStatus(texto, aviso = false) {
  el.statusRanking.textContent = texto;
  el.statusRanking.classList.toggle("aviso", aviso);
}

/** Busca o ranking (do Firebase ou do localStorage) e redesenha a lista. */
async function atualizarRanking() {
  try {
    if (MODO_ONLINE) {
      // Pega os 300 registros mais recentes; a ordenação por nota é feita aqui
      const dados = await chamarFirebase(
        `${NO_RANKING}.json?orderBy=${encodeURIComponent('"$key"')}&limitToLast=300`
      );
      rankingAtual = Object.entries(dados || {}).map(([id, jogador]) => ({ id, ...jogador }));
      definirStatus("Ao vivo: atualiza a cada " + INTERVALO_ATUALIZACAO_SEG + " segundos.");
    } else {
      rankingAtual = lerLocal(CHAVE_RANKING, []);
      definirStatus("Modo local: o ranking aparece só neste navegador.", true);
    }
    rankingAtual.sort(compararJogadores);
  } catch (erro) {
    definirStatus("Sem conexão com o ranking. Tentando de novo...", true);
  }
  renderizarRanking();
}

/** Desenha as 10 posições do ranking. Posições sem jogador aparecem como "Vaga livre". */
function renderizarRanking() {
  el.listaRanking.innerHTML = "";

  for (let i = 0; i < TAMANHO_RANKING; i++) {
    const jogador = rankingAtual[i];
    const li = document.createElement("li");

    const pos = document.createElement("span");
    pos.className = "pos";
    pos.textContent = `${i + 1}º`;

    const nome = document.createElement("span");
    nome.className = "nome";
    const pontos = document.createElement("span");
    pontos.className = "pontos";
    const tempo = document.createElement("span");
    tempo.className = "tempo";

    if (jogador) {
      // textContent (e não innerHTML) evita injeção de HTML pelo nome digitado
      nome.textContent = jogador.nome;
      pontos.textContent = `${jogador.pontos}/10`;
      tempo.textContent = formatarTempo(jogador.tempo);
      if (jogador.id === idDestaque) li.classList.add("atual");
    } else {
      li.classList.add("vazio");
      nome.textContent = "Vaga livre";
    }

    li.append(pos, nome, pontos, tempo);
    el.listaRanking.appendChild(li);
  }
}

/** Envia o resultado da partida e devolve o id do registro criado. */
async function salvarNoRanking(jogador) {
  if (MODO_ONLINE) {
    // POST cria uma chave única em ordem cronológica: { name: "-Nabc..." }
    const resposta = await chamarFirebase(`${NO_RANKING}.json`, {
      method: "POST",
      body: JSON.stringify(jogador)
    });
    return resposta.name;
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const reais = lerLocal(CHAVE_RANKING, []);
  reais.push({ id, ...jogador });
  reais.sort(compararJogadores);
  salvarLocal(CHAVE_RANKING, reais.slice(0, 50));
  return id;
}

/* =========================================================
   6. NAVEGAÇÃO ENTRE TELAS
   ========================================================= */

/** Mostra somente a tela informada. */
function mostrarTela(tela) {
  [el.telaInicio, el.telaPergunta, el.telaResultado].forEach((t) => {
    t.hidden = t !== tela;
  });
}

/* =========================================================
   7. FLUXO DO QUIZ
   ========================================================= */

/** Valida o nome e começa uma nova partida. */
function iniciarQuiz() {
  const nome = el.campoNome.value.trim();

  if (!nome) {
    el.erroNome.hidden = false;
    el.campoNome.focus();
    return;
  }

  el.erroNome.hidden = true;
  estado.nome = nome;
  estado.indice = 0;
  estado.pontos = 0;
  estado.inicio = Date.now();

  mostrarTela(el.telaPergunta);
  mostrarPergunta();
}

/** Desenha a pergunta atual e suas alternativas. */
function mostrarPergunta() {
  const pergunta = QUESTIONS[estado.indice];
  estado.respondida = false;

  el.numPergunta.textContent = estado.indice + 1;
  el.pontosAtuais.textContent = estado.pontos;
  el.enunciado.textContent = pergunta.question;

  // Barra de progresso: sobe conforme as perguntas já respondidas
  atualizarProgresso(estado.indice);

  // Limpa o feedback e o botão da pergunta anterior
  el.feedback.hidden = true;
  el.btnProxima.hidden = true;
  el.opcoes.innerHTML = "";

  const letras = ["A", "B", "C", "D"];
  pergunta.options.forEach((texto, i) => {
    const item = document.createElement("li");
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao";
    botao.dataset.indice = i;

    const letra = document.createElement("span");
    letra.className = "letra";
    letra.textContent = letras[i];

    const conteudo = document.createElement("span");
    conteudo.textContent = texto;

    botao.append(letra, conteudo);
    botao.addEventListener("click", () => responder(i));
    item.appendChild(botao);
    el.opcoes.appendChild(item);
  });

  el.enunciado.setAttribute("tabindex", "-1");
  el.enunciado.focus();
}

/** Atualiza a barra de progresso. */
function atualizarProgresso(respondidas) {
  const porcentagem = (respondidas / QUESTIONS.length) * 100;
  el.preenchimento.style.width = `${porcentagem}%`;
  el.progresso.setAttribute("aria-valuenow", respondidas);
}

/**
 * Trata a resposta do usuário: marca certa/errada,
 * soma ponto e exibe a explicação comentada.
 */
function responder(indiceEscolhido) {
  if (estado.respondida) return; // ignora cliques repetidos
  estado.respondida = true;

  const pergunta = QUESTIONS[estado.indice];
  const acertou = indiceEscolhido === pergunta.correct;
  if (acertou) estado.pontos++;

  // Bloqueia as alternativas e aplica cores + ícones
  const botoes = el.opcoes.querySelectorAll(".opcao");
  botoes.forEach((botao, i) => {
    botao.disabled = true;
    if (i === pergunta.correct) {
      botao.classList.add("certa");
      botao.querySelector(".letra").textContent = "✓";
    } else if (i === indiceEscolhido) {
      botao.classList.add("errada");
      botao.querySelector(".letra").textContent = "✗";
    }
  });

  // Explicação comentada
  el.feedback.className = `feedback ${acertou ? "acertou" : "errou"}`;
  el.feedbackTitulo.textContent = acertou
    ? "Resposta correta!"
    : `Não foi dessa vez. A resposta certa é a alternativa ${["A", "B", "C", "D"][pergunta.correct]}.`;
  el.feedbackTexto.textContent = pergunta.explanation;
  el.feedback.hidden = false;

  el.pontosAtuais.textContent = estado.pontos;
  atualizarProgresso(estado.indice + 1);

  // O último botão muda de texto para levar ao resultado
  const ehUltima = estado.indice === QUESTIONS.length - 1;
  el.btnProxima.textContent = ehUltima ? "Ver resultado" : "Próxima pergunta";
  el.btnProxima.hidden = false;
  el.btnProxima.focus();
}

/** Avança para a próxima pergunta ou encerra o quiz. */
function proximaPergunta() {
  estado.indice++;
  if (estado.indice < QUESTIONS.length) {
    mostrarPergunta();
  } else {
    finalizarQuiz();
  }
}

/** Calcula a nota final, grava no ranking e mostra o resultado. */
async function finalizarQuiz() {
  const tempo = Math.round((Date.now() - estado.inicio) / 1000);
  const percentual = Math.round((estado.pontos / QUESTIONS.length) * 100);

  // Mostra o resultado na hora; a posição no ranking chega logo em seguida
  el.notaFinal.textContent = estado.pontos;
  el.percentual.textContent = `${percentual}%`;
  el.tempoFinal.textContent = formatarTempo(tempo);
  el.posicaoFinal.textContent = "calculando...";
  el.mensagemFinal.textContent = gerarMensagem(percentual);
  mostrarTela(el.telaResultado);

  try {
    idDestaque = await salvarNoRanking({ nome: estado.nome, pontos: estado.pontos, tempo });
    await atualizarRanking();
    const posicao = rankingAtual.findIndex((j) => j.id === idDestaque) + 1;
    el.posicaoFinal.textContent =
      posicao === 0 ? "-" : posicao <= TAMANHO_RANKING ? `${posicao}º` : `${posicao}º (fora do top 10)`;
  } catch (erro) {
    el.posicaoFinal.textContent = "não salvo";
    definirStatus("Não foi possível salvar seu resultado. Verifique a conexão.", true);
  }
}

/** Mensagem de acordo com o desempenho. */
function gerarMensagem(percentual) {
  if (percentual === 100) return "Perfeito! Você domina a norma-padrão.";
  if (percentual >= 70)   return "Muito bom! Revise só as regras que você errou.";
  if (percentual >= 50)   return "Bom começo. Vale reler as explicações e tentar de novo.";
  return "Continue estudando: leia as explicações de cada questão e jogue de novo.";
}

/** Volta para a tela inicial para uma nova tentativa. */
function reiniciar() {
  idDestaque = null;
  atualizarRanking();
  mostrarTela(el.telaInicio);
  el.campoNome.focus();
}

/* =========================================================
   8. EVENTOS E INICIALIZAÇÃO
   ========================================================= */

el.btnIniciar.addEventListener("click", iniciarQuiz);
el.btnProxima.addEventListener("click", proximaPergunta);
el.btnReiniciar.addEventListener("click", reiniciar);

// Permite iniciar pressionando Enter no campo de nome
el.campoNome.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") iniciarQuiz();
});

registrarAcesso();
atualizarRanking();

// Ranking ao vivo: atualiza em intervalo, pausando quando a aba está em segundo plano
setInterval(() => {
  if (!document.hidden) atualizarRanking();
}, INTERVALO_ATUALIZACAO_SEG * 1000);
