# Decisões

## Bug crítico: crash em `NativeForm.vue` por colisão de nome com injeção global do VeeValidate (`fields`) (2026-09-08)

- **Decisão/conhecimento permanente**: `vee-validate@2.2.15` (configurado globalmente em `src/index.js`, ver [architecture.md](./architecture.md)) injeta, via seu `beforeCreate` global, as computed properties `fields` e `errors` em **todo** componente Vue da árvore do host (a menos que o componente declare explicitamente `$__veeInject: false` no options object) — sobrescrevendo incondicionalmente qualquer `computed.fields`/`computed.errors` que o componente já declare com o mesmo nome. `NativeForm.vue` declarava uma computed própria chamada `fields` (a lista de campos do formulário) sem essa flag, então `this.fields` resolvia para o `FieldBag` do VeeValidate (`this.$validator.fields.items.reduce(...)`) em vez do array esperado, causando `TypeError: this.fields.reduce is not a function` sempre que uma mensagem `application/vnd.lime.input+json` com `validation.type === 'application/vnd.lime.form+json'` era renderizada — ou seja, **E3 crashava sempre que consumido**, apesar de estar marcado como "Implementado" no roadmap desde `07c4d0e`.
- **Motivação/evidência**: descoberto por teste ao vivo nesta sessão (injeção direta de mensagem de teste no array `messages` de `ThreadMessages` em `blip-chat`, que consome este pacote via symlink em `node_modules/blip-cards`), com inspeção via runtime Vue até isolar a causa na injeção global do VeeValidate.
- **Fix**: computed renomeada para `formFields` em todas as 4 referências (2× `v-for` no template, `init()`, `submit()`); adicionado `$__veeInject: false` no nível raiz do options object de `NativeForm.vue` como hardening — mecanismo suportado pela própria lib VeeValidate (usado internamente por `ValidationProvider`), evita a injeção global neste componente independentemente do nome de computed usado no futuro.
- **Débito técnico registrado**: `$__veeInject: false` depende de comportamento interno **não documentado publicamente** do `vee-validate` (hoje pinado em `2.2.15`, ver `package.json`). Seguro enquanto a versão não mudar; se `vee-validate` for atualizado no futuro, validar explicitamente que essa flag ainda é respeitada antes de confiar nela.
- **Conhecimento permanente para qualquer componente novo**: **nunca** declarar uma computed property chamada `fields` ou `errors` em nenhum componente deste repositório sem `$__veeInject: false`, dado que `vee-validate@2.2.15` está registrado globalmente via `Vue.use(VeeValidate, {...})` em `src/index.js` e afeta toda a árvore de componentes do host consumidor, não só os que usam validação explicitamente.
- **Fonte**: sessão ao vivo de 2026-09-08, arquivo `src/components/NativeForm.vue`. Reviewer avaliou o restante do diff (excluindo `package-lock.json`, revertido pelo Tech Lead) como correto, sem regressão.
- **Impacto**: `src/components/NativeForm.vue`. Ver [architecture.md](./architecture.md) para nota arquitetural sobre a injeção global do VeeValidate. Atualiza o estado de E3 em [roadmap.md](./roadmap.md).

## Bug: `BlipCard.vue` nunca repassava `optionPreviewSize`/`filterable` para `BlipSelect`/`DocumentSelect` (E2/E4) (2026-09-08)

- **Decisão**: `BlipSelect.vue` e `DocumentSelect.vue` já suportavam as props `optionPreviewSize` (commit `29cf466`) e `filterable` (commit `0891b30`, só em `BlipSelect.vue`) desde 2026-08-28, mas `BlipCard.vue` — o componente central de roteamento — nunca declarava esses bindings nos blocos `<blip-select>`/`<document-select>` do seu template. Resultado: qualquer consumidor que configurasse `content.optionPreviewSize`/`content.filterable` no documento via `BlipCard` (o caminho real usado por `blip-chat`) tinha essas configurações **ignoradas silenciosamente** — o truncamento sempre usava o default (`34`) e o campo de busca nunca aparecia, independente do que o bot/fluxo configurasse. O ícone por opção (`item.imageUri`) não foi afetado, por não depender de uma prop separada (lido diretamente de cada item de `document.options`).
- **Fix**: adicionado `:option-preview-size="document.content.optionPreviewSize"` e `:filterable="document.content.filterable"` no bloco `<blip-select>` de `BlipCard.vue`; adicionado apenas `:option-preview-size` no bloco `<document-select>` (esse componente não declara prop `filterable`).
- **Descoberta sobre o comportamento de `optionPreviewSize`**: o truncamento só se aplica ao modo carrossel (`document.scope === 'immediate'`, via `item.previewText`); no modo lista (`scope !== 'immediate'`) o template usa `item.text` diretamente, sem truncamento — **por design**, dado o espaço horizontal maior disponível em listas verticais, não uma limitação a corrigir. Não reabrir como bug em sessões futuras.
- **Motivação/evidência**: confirmado por teste ao vivo nesta sessão (mesma técnica de injeção de mensagem em `blip-chat` usada para o bug de `NativeForm.vue` acima): campo de busca "Search" passou a aparecer corretamente com `filterable: true` após o fix; truncamento confirmado funcionando em modo `immediate` (texto truncado para o tamanho configurado + "...").
- **Fonte**: sessão ao vivo de 2026-09-08, arquivo `src/components/BlipCard.vue`.
- **Impacto**: `src/components/BlipCard.vue`. Atualiza o estado de E2/E4 em [roadmap.md](./roadmap.md) — "Implementado"/"Parcialmente implementado" desde 2026-08-28 estava incorreto na prática por essa lacuna de propagação de props; corrigido nesta sessão.

## Formulários nativos estruturados (`NativeForm.vue`) e ausência de schema server-side em `builder-application` (2026-09-01)

- **Decisão**: E3 (discovery Energisa, "Formulários nativos estruturados") foi
  implementado como um novo componente `NativeForm.vue`, despachado por
  `BlipCard.vue` quando `document.type === 'application/vnd.lime.input+json'`
  **e** `document.content.validation.type === 'application/vnd.lime.form+json'`
  — exatamente o mesmo padrão condicional já usado por `RequestLocation.vue`
  para `validation.type === 'application/vnd.lime.location+json'`. **Não**
  foi criado um novo MIME type top-level; o card reaproveita o envelope
  `input+json` já existente, diferenciando-se apenas pelo `validation.type`
  aninhado.
- **Schema do payload** (`document.content.validation`):
  ```json
  {
    "type": "application/vnd.lime.form+json",
    "fields": [
      {
        "id": "string",
        "label": "string",
        "type": "text|number|date|select",
        "required": true,
        "options": [{ "value": "string", "label": "string" }]
      }
    ],
    "submitLabel": "string (opcional, fallback para submitLabelMsg prop)"
  }
  ```
  Apenas 4 tipos de campo suportados nesta entrega: `text`, `number`, `date`,
  `select` (`options` só é relevante para `select`). Nenhum outro tipo
  (checkbox, radio, textarea, etc.) foi implementado — deliberadamente fora
  do escopo, para entrega futura se necessário.
- **Contrato de resposta**: idêntico ao já usado por
  `BlipSelect`/`RequestLocation`/`DocumentSelect` —
  `onSelected(resumoTexto, { type: 'application/json', content: {...valores por id} })`,
  onde `resumoTexto` é a concatenação `"label: valor"` de cada campo e
  `content` é um objeto plano `{ [field.id]: valor }`.
- **Descoberta crítica desta sessão**: investigação em `builder-application`
  (repositório do backend real do Bot Builder,
  `Takenet.Iris.Application.Builder`, fora deste workspace até esta sessão)
  confirmou que o conteúdo de uma ação `SendMessage` no fluxo do bot é
  armazenado como JSON **totalmente opaco** (`type: string`, `content: any`),
  **sem nenhum schema/validação server-side**. Isso significa que **qualquer**
  novo tipo de card (não só este) não requer nenhuma mudança de backend — é
  100% uma convenção client-side entre o autor do fluxo (que escreve o JSON
  manualmente no editor de conteúdo bruto do Builder) e o componente Vue que
  renderiza (`blip-cards`). Esta descoberta invalida a premissa anterior deste
  contexto (ver histórico de [roadmap.md](./roadmap.md)) de que E3 dependia de
  um contrato de protocolo a ser definido em conjunto com backend/Iris —
  **não depende**. Tratar como conhecimento permanente ao avaliar qualquer
  item futuro de roadmap que hoje esteja marcado como
  `ARCHITECTURE_REVIEW_REQUIRED` por suposta necessidade de mudança de
  backend: reavaliar se essa suposição realmente se sustenta, dado que o
  `SendMessage` não valida conteúdo.
- **Escopo deliberadamente fora desta entrega**: UI de composição/edição do
  formulário no Builder (o autor do bot usa o editor de JSON bruto já
  existente, sem necessidade de UI dedicada nesta rodada).
- **Débito conhecido (notas do Reviewer, não bloqueantes)**:
  - `submitLabelMsg` (prop com default `'Enviar'`) não é alimentado pelo
    objeto `translations` do host — só é sobrescrito via
    `document.validation.submitLabel`. Diferente de outros textos do
    componente (`failedToSendMsg`, etc.), que já seguem o padrão
    `translations.*`.
  - Ausência de validação de forma (`Array.isArray`) para
    `validation.fields` antes de iterar — mesmo nível de rigor de outros
    componentes do repo (não é uma regressão introduzida por esta feature).
- **Fonte**: commit `07c4d0e` (`feat(form): add structured native form card component`), branch `feat/blip-chat-evolution-energisa`. Arquivos: `src/components/NativeForm.vue` (novo), `src/components/BlipCard.vue` (dispatch), `src/index.js` (registro global).
- **Impacto**: `BlipCard.vue` ganha mais um ramo de `v-else-if` antes do
  fallback genérico `lime-input` (ordem importa: o `v-else-if` de
  `native-form` precisa vir antes do `lime-input` genérico, assim como
  `request-location` já fazia). Ver [architecture.md](./architecture.md).

## Truncamento configurável do preview de opção em `BlipSelect`/`DocumentSelect` (2026-08-28)

- **Decisão**: prop `optionPreviewSize` (Number, default `34`) controla o
  tamanho máximo do `previewText` truncado exibido no carrossel de opções
  (`document.scope === 'immediate'`). Default `34` preserva o comportamento
  anterior à mudança (nenhum consumidor existente é afetado sem passar a
  prop explicitamente).
- **Motivação**: discovery Energisa — necessidade de opções com texto mais
  longo em determinados fluxos, sem forçar truncamento agressivo para todos
  os consumidores.
- **Fonte**: commit `29cf466` (`feat(select): support configurable option preview truncation length`), branch `feat/blip-chat-evolution-energisa`.
- **Impacto**: `BlipSelect.vue` (`init()`) e `DocumentSelect.vue`
  (`getOptionContent`, usado em três pontos: montagem inicial, edição de
  opção e seleção). Revisado sem blockers.

## Ícone/imagem opcional por opção em `BlipSelect` (2026-08-28)

- **Decisão**: prop opcional `item.imageUri` por opção (não é uma prop do
  componente, é um campo opcional dentro de cada item de
  `document.options`). Quando presente, renderiza `<img class="option-image">`
  antes do texto da opção, tanto no carrossel (`immediate`) quanto no modo
  lista.
- **Motivação**: discovery Energisa — menu de opções mais flexível (E2),
  suporte a ícone visual por opção.
- **Fonte**: commit `89e6d1d` (`feat(select): support optional icon/image per option`).
- **Impacto**: exigiu dois fixes de acompanhamento nesta mesma rodada —
  CSS não escopado (`7a488e5`, ver abaixo) e a regressão de `this` binding
  descrita em
  [Padrão perigoso: callbacks de `.map()`/`.filter()`](#padrão-perigoso-callbacks-de-mapfilter-devem-ser-arrow-functions-em-blipselectvue),
  ambos corrigidos antes do merge.

## Filtro client-side inline para menus em modo lista (`filterable`) (2026-08-28)

- **Decisão**: prop `filterable` (Boolean, default `false`) habilita um
  campo de busca (`input.blip-select-filter-input`) que filtra
  `document.options` via computed `filteredOptions`, comparando
  `filterQuery` (lowercase) contra `item.text`/`item.previewText`. Aplicável
  **apenas** ao modo lista (`document.scope !== 'immediate'`); o carrossel
  não ganhou busca.
- **Motivação**: discovery Energisa — autocompletar em menus (E4), limitado
  ao modo lista por ser onde o padrão de "muitas opções" ocorre na prática.
- **Fonte**: commit `0891b30` (`feat(select): support inline search filter for list-mode menus`).
- **Impacto**: `BlipSelect.vue` — novo estado `filterQuery`, computed
  `filteredOptions`. Fix de acompanhamento `73a5f91` (abaixo) corrige
  desalinhamento visual quando uma opção já foi selecionada.

## Padrão perigoso: callbacks de `.map()`/`.filter()` devem ser arrow functions em `BlipSelect.vue` (2026-08-28)

- **Decisão/conhecimento permanente**: em `BlipSelect.vue`, callbacks passados
  para `.map()`/`.filter()` dentro de métodos do componente (que precisam
  acessar `this.optionPreviewSize`, `this.document`, etc.) **devem** ser
  arrow functions. Uma `function` tradicional perde o binding de `this` do
  componente Vue, e o erro só se manifesta em runtime (não é pego por lint
  neste projeto).
- **Motivação/evidência**: as mudanças de E2/E4 desta mesma rodada
  introduziram uma regressão real — `this.options = this.document.options.map(function (x) { ... this.optionPreviewSize ... })`
  quebrava a inicialização (`init()`) de toda instância do componente,
  porque `this` dentro da `function` não-arrow não apontava para a instância
  Vue. Corrigido trocando para arrow function.
- **Fonte**: commit `7f28767` (`fix(select): bind this correctly in options map callback`), identificado e corrigido por Reviewer independente como
  blocker antes do merge.
- **Impacto**: regra de convenção local a observar em qualquer edição futura
  de `BlipSelect.vue` (e, por extensão, ao copiar esse padrão para
  `DocumentSelect.vue`, que já usa uma função nomeada auxiliar
  `getOptionContent` fora do escopo do componente para o mesmo cálculo,
  evitando esse risco por não depender de `this`).

## CSS de layout de opção com imagem escopado via classe condicional (2026-08-28)

- **Decisão**: o CSS `display: flex; align-items: center;` para opções com
  ícone é aplicado apenas a `.fixed-options li.has-option-image`, não a todo
  `<li>` de `.fixed-options`. A classe `has-option-image` é adicionada
  condicionalmente via `:class="[..., { 'has-option-image': item.imageUri }]"`.
- **Motivação/evidência**: a primeira versão da feature de ícone (`89e6d1d`)
  aplicava o layout flex a todas as opções, mudando visualmente selects sem
  imagem que não pediram essa mudança — regressão visual não solicitada.
- **Fonte**: commit `7a488e5` (`fix(select): scope image layout CSS to options with an icon only`), nota de Reviewer corrigida antes do merge.
- **Impacto**: `BlipSelect.vue`, template e `<style>` do componente.

## Discrepância entre `package.json.version` e a tag Git real (2026-08-28)

- **Decisão/conhecimento permanente**: não confiar no campo `"version"` do
  `package.json` deste repositório como fonte de verdade. Neste checkout
  (branch `feat/blip-chat-evolution-energisa`), o `package.json` mostra
  `"version": "3.22.0"`, mas o HEAD real está na tag `v3.52.0` — à frente da
  versão `3.51.2` hoje consumida por `blip-chat`. A versão publicada é
  gerenciada por `semantic-release` a partir das tags Git na pipeline CI, não
  pelo valor literal do arquivo.
- **Motivação**: evitar que agentes futuros usem o campo `package.json` para
  inferir "o que já foi publicado" ou "o que o `blip-chat` já pode consumir".
- **Fonte**: observação direta do discovery Energisa nesta sessão (`git describe`/tags vs. `package.json` no HEAD da branch).
- **Impacto**: ao avaliar se uma feature já está disponível para consumo em
  `blip-chat`, verificar a tag Git/changelog publicado, não o `package.json`
  local.

---

Formato sugerido para futuras entradas:

```md
## <título curto> (YYYY-MM-DD)

- **Decisão**: ...
- **Motivação**: ...
- **Fonte**: <commit/PR/discussão>
- **Impacto**: ...
```
