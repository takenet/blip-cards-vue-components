# Convenções

## Commits e Pull Requests

- **Conventional Commits obrigatório** (README seção "MUST READ TO COMMIT"): `<type>[optional scope]: <description>`, ex.: `feat: blip cards update audio`, `fix(BlipSelect): Fixing menu text elipisis`.
- Histórico Git confirma o padrão em uso na prática: `feat: rename component (#301)`, `fix: add class to card for right position (#297)`, `feat(componentOrder): Create componentOrder and TemplateOrder`.
- Título de Pull Request também deve seguir Conventional Commits (regra do workspace, aplicável a todos os repositórios BLiP deste ambiente).
- `npm run commit` (Commitizen) disponível para gerar mensagens no formato correto interativamente.
- Versionamento é 100% derivado dessas mensagens via `semantic-release` — commits fora do padrão não geram release (README: "There are no relevant changes, so no new version is released").

## Convenção específica para publicar versão a partir de uma branch não-master

O README documenta um fluxo manual (seção "Steps to generate a version manually"):

1. Criar branch com nome no padrão de branches do `semantic-release` (ex.: `2.11.x`) para permitir gerar release a partir dela.
2. Adicionar temporariamente `"release": { "branch": "<nome-da-branch>" }` no `package.json`.
3. Commitar com Conventional Commits.
4. Rodar a pipeline manualmente a partir dessa branch.
5. **Antes de mergear para master, desfazer a alteração no `package.json`** (a config de branch do semantic-release não deve ir para `master`).

Relevante para a branch atual (`feat/blip-chat-evolution-energisa`): esse nome não segue o padrão esperado por `semantic-release` para gerar release direta (não é `master` nem um padrão `x.y.z`), então mudanças nela não devem gerar publicação automática sem seguir o fluxo manual acima.

## Lint

- ESLint com `eslint-config-standard` + `eslint-plugin-html` (lint dentro de blocos `<script>` de `.vue`) + `eslint-plugin-import`/`promise`/`node`.
- Escopo do lint: `src` e `test/unit/specs` (`npm run lint`).
- `test/unit/.eslintrc` define ambiente `mocha` e globals `expect`/`sinon` para os specs.

## Código

- Componentes Vue em **Options API** (sem Composition API, sem TypeScript) — consistente com a versão do Vue (`^2.5.2`).
- Roteamento de tipo de card feito via `v-else-if` encadeado dentro do template de [BlipCard.vue](../../src/components/BlipCard.vue) (ver [architecture.md](./architecture.md)) — não há um registry/factory de componentes por tipo; ao adicionar um novo card, o padrão existente é acrescentar mais um bloco `v-else-if` nessa cadeia (respeitando a ordem, pois o primeiro match vence) e registrar o componente em [src/index.js](../../src/index.js).
- Props compartilhadas entre cards centralizadas no mixin [baseComponent.js](../../src/mixins/baseComponent.js) — novos componentes de card individuais tendem a reusar esse mixin em vez de redeclarar props como `editable`/`deletable`/`onSave`/`onDeleted`.
- Estilos em Sass, um arquivo por componente quando aplicável (ver imports de `.scss` nos `.vue`).
