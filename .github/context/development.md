# Desenvolvimento

## Toolchain

- Node `>= 8.0.0`, npm `>= 4.0.0` (`engines` no `package.json` — bem antigo; usar uma versão de Node compatível com Webpack 3/Babel 6 se for rodar `npm install` localmente sem atualizar dependências).
- Instalação: `npm install`.

## Comandos disponíveis (`package.json` → `scripts`)

| Comando                           | O que faz                                                                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev` (alias `npm start`) | Sobe `build/dev-server.js` com hot reload em `0.0.0.0` (porta configurada internamente)                                                                                  |
| `npm run bundle:min`              | Build de produção minificado (`MINIFY=true webpack ... webpack.build.config.js`) → gera `dist/blip-cards.js` + `dist/blip-cards.css`, únicos artefatos publicados no npm |
| `npm run bundle:watch`            | Mesmo build de produção em modo watch                                                                                                                                    |
| `npm run lint`                    | ESLint (`eslint-config-standard` + plugin `html`) sobre `src` e `test/unit/specs`                                                                                        |
| `npm run commit`                  | Commitizen (`cz-conventional-changelog`) para gerar mensagens de commit no padrão Conventional Commits                                                                   |
| `npm run semantic-release`        | Roda `semantic-release` (chamado pela pipeline CI, não é uso interativo local)                                                                                           |

## Testes — limitação conhecida

- Infraestrutura de teste existe (Karma + Mocha + Chai + Sinon + PhantomJS + `karma-webpack`, config em [test/unit/karma.conf.js](../../test/unit/karma.conf.js) e [test/unit/index.js](../../test/unit/index.js)), mas **não há script `test` no `package.json`** — não é rodada pela pipeline (`azure-pipelines.yml` só chama `lint` e `bundle:min`).
- [test/unit/specs/](../../test/unit/specs) contém apenas `Hello.spec.js`, um spec de exemplo/boilerplate do template original do `vue-cli`. **Não existe cobertura de teste real para os componentes de card** (`BlipCard`, `BlipSelect`, `MediaLink`, etc.).
- Runner de browser é `PhantomJS`, projeto descontinuado — rodar a suíte hoje pode exigir ajuste de dependências/ambiente.
- Conclusão prática: mudanças em componentes de card não têm rede de segurança automatizada; validar manualmente (via `npm run dev` ou consumindo o build local a partir de `blip-chat`) é a forma real de verificação hoje.

## Build de produção — detalhes

- Bundler: Webpack 3 (`build/webpack.base.conf.js`, `build/webpack.build.config.js`, `build/webpack.prod.conf.js`).
- CSS extraído via `extract-text-webpack-plugin` + minificado via `optimize-css-assets-webpack-plugin` (somente quando `MINIFY=true`).
- Análise de bundle disponível via `webpack-bundle-analyzer` (não há script dedicado, precisa configurar manualmente se necessário).

## CI/CD

- `azure-pipelines.yml` (Azure DevOps): trigger em `master`, usa template externo `Operações/template-take-blip` (`template-pipeline.yml@templates`, tag `v1.3.2`), Node 14.x, executa `npm install && npm prune && npm run lint && npm run bundle:min`, `to: semantic-release` (a publicação no npm acontece dentro do template compartilhado, não visível neste repositório).
- Versionamento: `semantic-release` a partir de commits Conventional Commits — tags Git (`vX.Y.Z`) confirmam isso (ex.: `v3.52.0` no HEAD atual). O campo `"version"` no `package.json` do checkout local **não reflete** a última versão publicada (ver [manifest.md](./manifest.md)).
