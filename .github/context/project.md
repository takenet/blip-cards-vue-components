# Projeto — blip-cards (blip-cards-vue-components)

## O que é

Biblioteca de componentes Vue reutilizáveis (`blip-cards` no npm) para renderizar "cards" de uma conversa de chat do ecossistema BLiP (Take): mensagens de texto, menus/quick-replies, seleção de opções, formulários (`lime.input`), localização, contato, mídia (imagem/áudio/vídeo/documento), pesquisas de satisfação, chamadas de voz/vídeo, resumo de atendimento, templates de mensagem (WhatsApp Business), pedidos com pagamento (Pix/boleto), reações e respostas ("reply"), entre outros.

O README resume o objetivo: "No need to render the cards yourself — one simple `blip-card` tag".

## Como é distribuído

- Publicado no **npm público** como `blip-cards` (`package.json` → `"name": "blip-cards"`, `"private": false`).
- Build gera `dist/blip-cards.js` + `dist/blip-cards.css` (únicos arquivos publicados, ver `"files"` no `package.json`), via `npm run bundle:min` (Webpack 3 + `webpack.build.config.js`).
- Consumo esperado (README): `require('blip-cards')`, chamar `blipCards.install(Vue)` (ou `Vue.use(...)`), depois usar as tags `<blip-card>` / `<blip-group-card>` no template do consumidor.

## Como é consumido

- **`blip-chat`** (workspace irmão, `/Users/marcelo.amaro/Development/blip-chat`): declara `"blip-cards": "3.51.2"` no `package.json`, faz `Vue.use(BlipCards)` e usa `<blip-group-card>`/`<blip-card>` para renderizar as mensagens da thread de conversa dentro do iframe/WebView do chat.
- Nenhum outro consumidor foi identificado neste workspace (`blip-chat-widget`, `blip-chat-ios`, `blip-chat-android`, `blip-agents`, `blip-cards-vue-components` em si não referenciam este pacote como dependência). Pode haver outros consumidores fora deste workspace (outros produtos BLiP/Desk que montam UI de conversa), não verificados nesta sessão.

## Stack e build tooling

| Item                    | Valor                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Vue                     | `^2.5.2` (Options API)                                                              |
| Bundler                 | Webpack `^3.10.0` (template clássico `vue-cli`, mesma geração usada em `blip-chat`) |
| Transpiler              | Babel (`babel-preset-env` + `babel-preset-stage-2`)                                 |
| Estilos                 | Sass (`node-sass` + `sass-loader`), extraídos via `extract-text-webpack-plugin`     |
| Validação de formulário | `vee-validate` (locais `en`/`pt_BR`, validators customizados `json`/`mime`)         |
| Design system           | `blip-ds` (Web Components `bds-*`, ex.: `bds-icon`) como dependência runtime        |
| Touch                   | `vue2-touch-events`                                                                 |
| Sanitização HTML        | `sanitize-html` (mixin `Sanitize`)                                                  |
| Node/npm mínimos        | `node >= 8.0.0`, `npm >= 4.0.0` (`engines`)                                         |

## Relação com outros repositórios deste workspace

| Repositório                           | Relação                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `blip-chat`                           | Consumidor direto via npm (`Vue.use(BlipCards)`), renderiza os cards na thread de mensagens do widget de chat |
| `blip-chat-widget`                    | Sem relação de código detectada; não referencia `blip-cards`                                                  |
| `blip-chat-ios` / `blip-chat-android` | Sem relação de código direta; consomem `blip-chat` via WebView, que por sua vez consome `blip-cards`          |
| `blip-agents`                         | Pasta vazia neste workspace; sem relação detectada                                                            |

Qualquer mudança de contrato nos props/eventos de `<blip-card>`/`<blip-group-card>` (props REQUIRED, formato do `document`, callbacks `on-selected`/`on-save`/`on-deleted`) é uma mudança **cross-repo** que impacta `blip-chat` e potencialmente outros consumidores externos ao workspace.
