# DESIGN.md — Leitor de Notas

O Leitor de Notas roda sozinho em `leitordenotas.com.br` e também **dentro de um iframe no app DLP Invest**. No iframe ele precisa parecer parte do DLP Invest, por isso a paleta segue a do DLP Invest: neutros azulados (família _slate_), um azul de marca e verde/vermelho para estado. Onde um valor do DLP Invest não atinge o contraste mínimo de acessibilidade, este documento usa o tom mais próximo que atinge (veja [Acessibilidade](#acessibilidade)).

Os tokens `--app-*` abaixo estão em `src/styles.scss`. Como aplicá-los no código (Bootstrap, classes, tema, SweetAlert2) está no [`AGENTS.md`](AGENTS.md).

## Princípios

- **Combinar com quem hospeda.** No iframe, o fundo da página é o fundo do card do DLP Invest: `#ffffff` no claro e `#111827` no escuro. Qualquer outro cinza vira uma "caixa" visível dentro do card.
- **Um azul de marca.** Ações primárias, links, foco e a aba de Notas usam o azul `--app-primary`. O azul padrão do Bootstrap (`#0d6efd`) não aparece.
- **Roxo é a cor da categoria Extratos.** É uma cor própria do Leitor (o DLP Invest não tem roxo) para diferenciar Extratos de Notas. Fica restrito à aba, à área de upload e aos destaques de extratos; nunca em ações genéricas.
- **Acessível por padrão.** Todo par texto/fundo e todo contorno de controle deste documento passa WCAG 2.2 nível AA nos dois temas.

## Tema

- Claro e escuro, escolhidos pela preferência do sistema ou pelo botão de tema.
- No iframe o tema chega pela URL (`?theme=light|dark`) e tem prioridade sobre a preferência salva. Trocar o tema no DLP Invest só chega ao Leitor quando a página recarrega, porque a URL do iframe é montada uma vez.

## Cores

### Superfícies e texto

| Token                  | Claro     | Escuro    | Uso                                                                                                       |
| ---------------------- | --------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `--app-bg`             | `#ffffff` | `#111827` | Fundo da página (= card do DLP Invest)                                                                    |
| `--app-bg-surface`     | `#f6f7fb` | `#1a2232` | Painéis (`.custom-panel`, `bg-body-tertiary`); no escuro fica acima do fundo, como os cards do DLP Invest |
| `--app-bg-component`   | `#f1f4f9` | `#1a2232` | Campos somente leitura, hover, fundo secundário                                                           |
| `--app-text`           | `#0f172a` | `#e6eaf2` | Texto principal, títulos                                                                                  |
| `--app-text-secondary` | `#5b6577` | `#8b97ab` | Texto secundário, legendas, placeholder                                                                   |
| `--app-border`         | `#e5e9f0` | `#1f2937` | Bordas de painel e divisores (decorativas)                                                                |
| `--app-input-border`   | `#7d889a` | `#63738a` | Contorno de campos, checkboxes, selects, botões neutros                                                   |

### Marca e ação

| Token                 | Claro     | Escuro                 | Uso                                                           |
| --------------------- | --------- | ---------------------- | ------------------------------------------------------------- |
| `--app-primary`       | `#2563eb` | `#2563eb`              | Fundo do botão primário, aba Notas, checkbox marcado          |
| `--app-primary-hover` | `#1d4ed8` | `#1d4ed8`              | Hover do botão primário                                       |
| `--app-primary-text`  | `#2563eb` | `#60a5fa`              | Links e texto azul sobre o fundo da página                    |
| `--app-primary-soft`  | `#eaf1ff` | `rgba(59,130,246,.14)` | Fundo de destaque, item ativo (texto em `--app-primary-text`) |
| `--app-focus`         | `#2563eb` | `#60a5fa`              | Indicador de foco: `outline: 2px solid; outline-offset: 2px`  |
| `--app-navbar-bg`     | `#18204d` | `#18204d`              | Barra superior (só fora do iframe)                            |

### Categoria Extratos (roxo adaptado)

Tom _violet_ da mesma família de cores do DLP Invest (o roxo da paleta de gráficos de lá é `#8b5cf6`), ajustado para AA.

| Token                    | Claro     | Escuro                 | Uso                                       |
| ------------------------ | --------- | ---------------------- | ----------------------------------------- |
| `--app-statements`       | `#7c3aed` | `#a78bfa`              | Aba Extratos, bordas e ícones de extratos |
| `--app-statements-hover` | `#6d28d9` | `#c4b5fd`              | Hover                                     |
| `--app-statements-soft`  | `#f3edff` | `rgba(139,92,246,.14)` | Fundo de destaque de extratos             |

### Áreas de upload

| Token                                                         | Claro                             | Escuro                            |
| ------------------------------------------------------------- | --------------------------------- | --------------------------------- |
| `--app-upload-bg` / `-text` / `-border` (Notas)               | `#2563eb` / `#ffffff` / `#1d4ed8` | `#1e3a8a` / `#bfdbfe` / `#3b82f6` |
| `--app-upload-statements-bg` / `-text` / `-border` (Extratos) | `#7c3aed` / `#ffffff` / `#6d28d9` | `#2e1f5e` / `#c4b5fd` / `#8b5cf6` |

### Estado

| Papel   | Texto claro | Texto escuro | Preenchimento (os dois temas) | Uso                                                               |
| ------- | ----------- | ------------ | ----------------------------- | ----------------------------------------------------------------- |
| Sucesso | `#047857`   | `#34d399`    | `#047857` com texto branco    | `--app-success`, `text-success`, `btn-success`, `text-bg-success` |
| Erro    | `#b91c1c`   | `#f87171`    | `#b91c1c` com texto branco    | `--app-danger`, `text-danger`, `btn-danger`, `text-bg-danger`     |
| Aviso   | `#b45309`   | `#fbbf24`    | `#fbbf24` com texto preto     | `--app-warning`, `text-warning`, `text-bg-warning`                |

Fundos suaves de estado (alertas, badges) usam as classes `alert-*` / `*-subtle` do Bootstrap, que acompanham o tema.

### Diálogos (SweetAlert2)

Popups seguem `--app-bg` / `--app-text`, botão de confirmação em `--app-primary` e cancelar neutro (`--app-bg-component` + `--app-text` + borda `--app-input-border`). Nunca o roxo padrão do SweetAlert2, e o popup acompanha o modo escuro.

## Acessibilidade

Referência: **WCAG 2.2 nível AA** (W3C). É o mesmo nível exigido na União Europeia pela EN 301 549 (norma usada pelo _European Accessibility Act_) e no Brasil pelo eMAG / Lei Brasileira de Inclusão, que adotam a WCAG.

| Critério                         | Exigência                                                                       | Como se aplica aqui                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1.4.3 Contraste mínimo           | Texto **4,5:1**; texto grande (≥ 24px, ou ≥ 18,66px em negrito) **3:1**         | Todo par texto/fundo das tabelas acima. Placeholder conta como texto                                                         |
| 1.4.11 Contraste não textual     | **3:1** para contornos de controles, estados e ícones que transmitem informação | `--app-input-border`, checkbox, indicador de foco, contorno da área de upload. Bordas de painel são decorativas e ficam fora |
| 1.4.1 Uso de cor                 | Cor não pode ser o único meio de transmitir informação                          | Notas × Extratos também se distinguem pelo texto da aba e pelo ícone; erro tem ícone/mensagem, não só fundo vermelho         |
| 2.4.7 Foco visível               | Todo elemento focável mostra foco                                               | `--app-focus` em `:focus-visible`; não remova `outline` sem substituto                                                       |
| 2.5.8 Tamanho do alvo            | Alvos de toque com pelo menos **24×24px**                                       | Botões de ícone (tema, copiar, remover)                                                                                      |
| 2.3.3 / `prefers-reduced-motion` | Animações não essenciais respeitam a preferência do sistema                     | Gradiente do carregamento e o `scale` do hover em `.limit-box`                                                               |

Onde o Leitor difere do DLP Invest, e por quê. Todos os outros valores são iguais aos do DLP Invest:

| Papel                                                | DLP Invest            | Contraste   | Leitor                       | Contraste       |
| ---------------------------------------------------- | --------------------- | ----------- | ---------------------------- | --------------- |
| Texto secundário (claro) sobre `#f6f7fb` / `#f1f4f9` | `#64748b`             | 4,45 / 4,32 | `#5b6577`                    | 5,49 / 5,33     |
| Botão primário (escuro), texto branco                | `#3b82f6`             | 3,68        | `#2563eb`                    | 5,17            |
| Texto azul sobre `primary-soft` (escuro)             | `#3b82f6`             | 4,06        | `#60a5fa`                    | 5,87            |
| Sucesso (claro) sobre branco / fundo suave           | `#059669`             | 3,77 / 3,43 | `#047857`                    | 5,48 / 4,99     |
| Erro (claro) sobre fundo suave                       | `#dc2626`             | 4,23        | `#b91c1c`                    | 5,66            |
| Aviso (claro) sobre branco / fundo suave             | `#d97706`             | 3,19 / 2,92 | `#b45309`                    | 5,02 / 4,61     |
| Contorno de campo (claro / escuro)                   | `#e2e8f0` / `#253041` | 1,23 / 1,33 | `#7d889a` / `#63738a`        | ≥ 3,25 / ≥ 3,30 |
| Anel de foco (claro / escuro)                        | azul 35%              | 1,67 / 1,95 | `#2563eb` / `#60a5fa` sólido | 5,17 / 6,98     |

Ao criar um token novo, calcule o contraste contra **todos** os fundos onde ele aparece (`--app-bg`, `--app-bg-surface`, `--app-bg-component`), nos dois temas.

## Tipografia

- Família: **Inter**, com fallback `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`, igual ao DLP Invest. Servida pelo próprio app: o arquivo variável (pesos 100–900) fica em `src/assets/fonts/inter/`, com a licença OFL ao lado.
- Títulos com `letter-spacing: -0.015em`. `.small-font` reduz textos e controles para `0.75rem` (tabelas de resultado); nessa escala vale a regra de 4,5:1, nunca a de texto grande.
- Valores numéricos em tabelas com `font-variant-numeric: tabular-nums`.
- Tamanhos em `rem`, para o texto acompanhar o zoom do navegador (1.4.4).

## Forma e elevação

- Raio: `14px` em painéis e modais, `10px` em botões, campos e áreas de upload, `999px` em badges.
- Sombra: quase invisível (`0 1px 2px rgba(15,23,42,.04), 0 1px 3px rgba(15,23,42,.04)`) no claro; no escuro a separação vem da borda, não da sombra.
