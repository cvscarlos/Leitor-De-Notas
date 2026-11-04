# AGENTS.md — Leitor de Notas (front-end)

Interface web do Leitor de Notas (`leitordenotas.com.br`). Ela envia PDFs de notas de corretagem e extratos para a API, mostra o resultado e o exporta. Toda a leitura dos arquivos acontece no backend, que é outro projeto e não é público: este repositório só formata o que a API devolve.

O app roda sozinho e também dentro de um iframe no app DLP Invest. A aparência segue o [`DESIGN.md`](DESIGN.md).

## Repositório público

Tudo aqui é público: código, commits, branches, títulos e descrições de PR. Não escreva nada sobre o backend ou sobre o código interno do DLP Invest além do que já está neste repositório: nomes de repositórios privados, links, caminhos, URLs internas, segredos, dados de clientes. Editar um PR não apaga o texto antigo, que continua no histórico de edições.

Descrições de PR são curtas: uma lista do que muda para quem usa o app.

## Stack

- Angular 22 com componentes standalone. Todo componente declara `changeDetection: ChangeDetectionStrategy.Eager`, e componentes novos seguem o mesmo padrão, salvo se você revisar aquele componente para OnPush.
- Bootstrap 5.3 e ng-bootstrap. Estilos globais em `src/styles.scss`; estilos de componente em Less.
- Node conforme `engines` do `package.json` e `.nvmrc`.

## Comandos e verificação

- `npm start`: servidor de desenvolvimento em `:4200`, apontando para a API local em `localhost:5001` (`src/environments/environment.ts`).
- `npm run build`: build de produção. É a verificação completa do projeto: checa os tipos e compila todos os templates.
- Não há testes: `npm test` não tem alvo no `angular.json`.
- `npm run lint` falha no `main` por erros antigos. Para uma mudança, rode `npx eslint <arquivos>` só nos arquivos tocados e compare com o `main` antes de culpar sua alteração.
- Mudança visual: confira no navegador nos dois temas, com `?theme=light` e `?theme=dark` na URL.
- Hooks do Git em `.githooks/` (ativados pelo script `prepare`): o `pre-commit` roda ESLint nos `.ts`/`.html` em stage (o arquivo inteiro, não só o diff) e `prettier --check` nos demais; o `pre-push` roda o build.

## Commits e versão

- Conventional Commits em português: `tipo(escopo): resumo`, com no máximo 100 caracteres.
- Não há semantic-release. Todo commit que chega ao `main` sobe a versão à mão: `npm version <versão> --no-git-tag-version`, que atualiza `package.json` e `package-lock.json`. Use semver a partir dos commits desde a última mudança de versão: `feat` sobe minor; `fix`, `refactor` e `chore` sobem patch; mudança incompatível sobe major.

## Estilos e UI

- **As cores vêm dos tokens `--app-*` em `src/styles.scss`**, com os valores e papéis do `DESIGN.md`. O Bootstrap é compilado do Sass (`@use 'bootstrap/scss/bootstrap' with (...)`), com as variáveis de cor, fundo, borda, raio e sombra configuradas lá. Assim `--bs-body-bg`, `--bs-secondary-color`, `.btn-primary` etc. já saem com a paleta certa.
- **Importe o Bootstrap sempre por `bootstrap/scss/bootstrap`.** `@use 'bootstrap'` resolve para o CSS pré-compilado: ele não aceita configuração e, carregado ao lado do Sass, emite o Bootstrap duas vezes, e a segunda cópia (com as cores padrão) sobrescreve a configurada.
- **Nada de cor fixa no template.** Sem hex, sem `text-dark`, `bg-light`, `text-bg-light`, `text-muted` ou `text-secondary`: eles não acompanham o modo escuro ou falham o contraste. Use os tokens ou as classes que mudam com o tema (`text-body-secondary`, `bg-body-tertiary`, `bg-body-secondary`).
- **`.small-font` é intencional.** Tabelas de dados, listas de upload e logs usam `.small-font` (`0.85rem`); não remova nem troque pelo tamanho padrão, e use em tabelas novas.
- **Fundo colorido sempre com `text-bg-*`**, que também define a cor do texto. `bg-danger` sozinho deixa o texto na cor do tema e falha o contraste.
- **Tema:** `ThemeService` aplica `data-bs-theme="light|dark"` (Bootstrap) e a classe `.dark-theme` (tokens `--app-*`) no `<html>`. O parâmetro `?theme=` da URL tem prioridade sobre a preferência salva; é assim que o DLP Invest passa o tema para o iframe.
- **SweetAlert2:** os popups saem do `NotifyService` e herdam o tema pelas variáveis `--swal2-*` definidas em `.swal2-container` no `src/styles.scss`. Não passe cores (`confirmButtonColor`, `denyButtonColor`…) nas opções.
- **Acessibilidade:** todo par texto/fundo e todo contorno de controle passa WCAG 2.2 AA nos dois temas (tabela e critérios no `DESIGN.md`). Para um token novo, calcule o contraste contra todos os fundos onde ele aparece. Não remova o `outline` de foco sem substituto.
- **Sem recursos de terceiros.** Fontes, CSS e JS são servidos pelo próprio app, nunca por CDN: cada requisição externa expõe o IP do visitante e cria uma dependência fora do nosso controle. Para uma fonte nova, baixe o `woff2` oficial para `src/assets/fonts/<fonte>/`, com a licença ao lado, e declare o `@font-face` no `src/styles.scss`.

## Integração com o DLP Invest

Dentro do iframe, o app conversa com a página do DLP Invest por `window.parent.postMessage`. Os formatos são um contrato: mudar nome de campo, ordem de coluna ou formato de mensagem quebra a importação do lado de lá.

- `height:<px>` (`IframeHeightService`): altura do conteúdo, para o iframe se ajustar.
- `{"dlpBrokerageNotes": [...]}` (`home/export-tool/`): operações das notas de corretagem.
- `{"dlpStatements": [...]}` (`home/statement-export/`): proventos dos extratos.
- As mensagens vão como string JSON, não como objeto.

Os mesmos dados também saem como texto separado por tabulação, para colar na planilha:

- Operações (`export-tool`): `ticker`, `date`, `type`, `quantity`, `price`, `tax`, `broker`, `irrf`, `currency`, `NC:<número da nota>`.
- Proventos (`statement-export`): `Ativo`, `Data`, `Evento`, `Valor`, `Irrf`, `Taxas`, `Moeda`, `Corretora`. `Taxas` sai vazia, porque os extratos não trazem esse valor; a coluna existe para manter o alinhamento na planilha.
- Números usam vírgula como separador decimal.

**`tax` significa coisas opostas nas duas exportações.** Nos proventos, `tax` é o IRRF (é o nome do campo vindo da API e o que o DLP Invest já recebe). Nas operações, `tax` são as taxas e o IRRF vem em `irrf`. Não "alinhe" os nomes: o DLP Invest depende dos dois.
