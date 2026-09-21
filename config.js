/**
 * Configuração do ranking ao vivo (Firebase Realtime Database).
 *
 * Cole abaixo a URL do seu banco, sem barra no final. Exemplo:
 *   const FIREBASE_URL = "https://meu-quiz-default-rtdb.firebaseio.com";
 *
 * Se ficar vazia, o quiz funciona em modo local: ranking e acessos
 * ficam salvos somente no navegador de quem joga.
 */
const FIREBASE_URL = "";

/**
 * Nomes dos "nós" do banco usados por este quiz. Assim, dá para usar o mesmo
 * banco Firebase do quiz de Física sem misturar os rankings.
 */
const NO_RANKING = "ranking_portugues";
const NO_ACESSOS = "acessos_portugues";

/** De quantos em quantos segundos o ranking é atualizado na tela. */
const INTERVALO_ATUALIZACAO_SEG = 5;
