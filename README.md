# Quiz de Língua Portuguesa

Quiz web com 10 perguntas de gramática e uso da língua, explicação comentada após cada resposta,
pontuação automática, ranking ao vivo (top 10) e contador de acessos compartilhados.

## Arquivos
- `index.html`: estrutura das telas (início, pergunta, resultado) e do ranking
- `style.css`: estilos, responsividade e cores de acerto (verde) e erro (vermelho)
- `questions.js`: as 10 perguntas, cada uma com o campo `explanation`
- `script.js`: navegação, pontuação, ranking e contador de acessos
- `config.js`: URL do banco do ranking ao vivo e nomes dos nós usados
- `database.rules.json`: regras de segurança para colar no Firebase

## 1. Banco do ranking (Firebase, gratuito)
1. Acesse https://console.firebase.google.com e crie um projeto.
2. Menu **Build > Realtime Database > Create Database**, em modo **bloqueado**.
3. Na aba **Rules**, cole o conteúdo de `database.rules.json` e clique em **Publish**.
4. Copie a URL do banco (aba **Data**) e cole em `FIREBASE_URL` no `config.js`.

Este quiz grava em `ranking_portugues` e `acessos_portugues`, então pode dividir o mesmo banco
com o quiz de Física sem misturar os rankings. O arquivo de regras já cobre os dois quizzes.

## 2. Publicar no GitHub Pages
1. Crie um repositório público e envie todos os arquivos para a raiz.
2. Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O link ficará em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Segurança
As regras só aceitam novos registros válidos (nome de até 20 caracteres, nota de 0 a 10, tempo válido)
e não permitem editar nem apagar resultados. Como o site é estático, alguém com conhecimento técnico
ainda poderia enviar uma nota falsa direto à API. Um ranking à prova de fraude exigiria um back-end
que corrija as respostas (por exemplo, em Java/Spring).
