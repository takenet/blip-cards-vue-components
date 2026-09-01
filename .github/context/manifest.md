# Context Manifest — blip-cards-vue-components

Índice do conhecimento permanente deste repositório. Leia este arquivo primeiro para saber onde procurar.

| Arquivo                              | Conteúdo                                                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [project.md](./project.md)           | O que é o pacote, como é distribuído (npm) e consumido (`blip-chat` e outros)                      |
| [architecture.md](./architecture.md) | Componentes de card expostos, roteamento por `document.type`, agrupamento                          |
| [development.md](./development.md)   | Toolchain, comandos de build/lint/test, limitações de ambiente conhecidas                          |
| [conventions.md](./conventions.md)   | Convenções de commit (Conventional Commits/semantic-release), lint, código                         |
| [decisions.md](./decisions.md)       | Decisões permanentes registradas nesta sessão                                                      |
| [roadmap.md](./roadmap.md)           | Estado de E2/E3/E4 (discovery Energisa) frente à arquitetura real de `BlipSelect`/`DocumentSelect` |

## Fatos rápidos

- **Pacote npm**: `blip-cards` (nome no `package.json`), publicado no registry padrão (consumido publicamente, não é pacote com `@escopo`).
- **Stack**: Vue 2.5.x (Options API), Webpack 3, Babel (preset-env + stage-2), Sass. Toolchain típica do `vue-cli` clássico (webpack template), igual a `blip-chat`.
- **Consumidor conhecido no workspace**: `blip-chat` (`/Users/marcelo.amaro/Development/blip-chat/package.json` declara `"blip-cards": "3.51.2"`, usa `Vue.use(BlipCards)` e as tags `<blip-group-card>`/`<blip-card>`).
- **Versão local do `package.json` está desatualizada em relação ao publicado**: neste checkout (branch `feat/blip-chat-evolution-energisa`, HEAD = tag `v3.52.0`) o campo `"version"` no `package.json` ainda mostra `3.22.0`. A tag Git/versão publicada real é gerenciada pelo `semantic-release` na pipeline CI, não pelo valor do `package.json` no repo — não confiar nesse campo como fonte de verdade da versão publicada.
- **Testes**: existe infraestrutura Karma/Mocha/Sinon/Chai/PhantomJS em `test/unit/`, mas `test/unit/specs/` contém apenas um `Hello.spec.js` de exemplo — não há suíte de testes real para os componentes de card, e não há script `test` no `package.json`.
- **CI/CD**: `azure-pipelines.yml` (Azure DevOps) usa template externo (`Operações/template-take-blip`) e roda `npm install && npm prune && npm run lint && npm run bundle:min`, com `to: semantic-release` — é o pipeline que efetivamente publica no npm.
