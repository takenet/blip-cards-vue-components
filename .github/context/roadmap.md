# Roadmap de produto vs. estado da arquitetura

## Proveniência (fonte externa, não versionada neste repo)

Este roadmap tem origem no mesmo documento de produto externo usado em
`blip-chat-widget`/`blip-chat` ("Sugestões BlipChat Pedroso", Google Sites,
requer login, `https://sites.google.com/blip.ai/sugestes-blipchat-pedroso/`),
discovery do cliente **Energisa**. Não é versionado neste repositório e não é
acessível para verificação direta a partir deste ambiente. Classificações de
prioridade/esforço do documento de origem não foram re-validadas por este
Context Engineer.

Este repositório é a **fronteira `blip-cards`** citada em
[blip-chat/.github/context/roadmap.md](../../../blip-chat/.github/context/roadmap.md)
(itens E2/E3/E4 daquele repositório apontam para cá). Ou seja: aqui é onde
E2/E3/E4 deixam de ser `BLOCKED_EXTERNAL` e passam a ter estado real de
implementação — este repositório é a fonte de verdade para esses três itens.

O que **foi** validado nesta sessão (SYNC), cruzando com commits reais na
branch `feat/blip-chat-evolution-energisa` (`29cf466`, `89e6d1d`, `0891b30`,
mais os fixes `7f28767`, `7a488e5`, `73a5f91` revisados por Reviewer
independente): E2 e E4 (parcial). Sessão seguinte validou E3 (`07c4d0e`),
agora implementado — ver detalhes abaixo.

**Atualização 2026-09-08**: teste ao vivo via `blip-chat` (que consome este
pacote por symlink em `node_modules/blip-cards`) revelou que "Implementado"/
"Parcialmente implementado" não significava, na prática, "funciona quando
consumido" — E3 crashava sempre que renderizado (bug de colisão de nome com
o VeeValidate) e E2/E4 tinham as props correspondentes nunca repassadas por
`BlipCard.vue` (o componente de roteamento central). Ambos corrigidos nesta
sessão. Ver [decisions.md](./decisions.md) para os dois relatos completos.

## Bloco B — Evolução (E2–E4), relativo a `BlipSelect.vue`/`DocumentSelect.vue`

| Item | Descrição                        | Estado frente à arquitetura                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E2   | Menu de opções mais flexível     | **Parcialmente implementado, e agora funcional de ponta a ponta** — ícone/imagem opcional por opção (`item.imageUri`, commit `89e6d1d`) e truncamento configurável do preview (`optionPreviewSize`, commit `29cf466`) em `BlipSelect.vue`/`DocumentSelect.vue`. **Correção 2026-09-08**: `BlipCard.vue` nunca repassava `optionPreviewSize` para esses componentes — a prop existia mas era sempre ignorada quando consumida via roteamento normal; corrigido. Ver [decisions.md](./decisions.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| E3   | Formulários nativos estruturados | **Implementado, e agora funcional (crash corrigido 2026-09-08)** — componente `NativeForm.vue`, despachado por `BlipCard.vue` quando `document.type === 'application/vnd.lime.input+json'` e `document.content.validation.type === 'application/vnd.lime.form+json'` (mesmo padrão condicional de `RequestLocation.vue`, reaproveitando o MIME type `input+json` já existente — nenhum novo tipo top-level foi criado). Schema: `validation.fields: [{id, label, type: 'text'\|'number'\|'date'\|'select', required, options?}]` + `validation.submitLabel`. Apenas 4 tipos de campo suportados nesta entrega. Resposta via `onSelected(resumo, { type: 'application/json', content: {...valores por id} })`, mesmo contrato de `BlipSelect`/`RequestLocation`/`DocumentSelect`. Commit `07c4d0e` (`feat(form): add structured native form card component`). **Descoberta crítica desta rodada**: investigação em `builder-application` (backend real do Bot Builder, `Takenet.Iris.Application.Builder`) confirmou que o conteúdo de uma ação `SendMessage` é armazenado como JSON opaco (`type: string`, `content: any`) **sem schema/validação server-side** — ou seja, novos tipos de card como este não exigem nenhuma mudança de backend, são convenção 100% client-side entre o autor do fluxo (editor de JSON bruto do Builder) e `blip-cards`. Isso invalida a premissa anterior deste roadmap de que E3 dependia de um contrato de protocolo a ser definido com o backend/Iris. **Bug crítico encontrado e corrigido em 2026-09-08**: `NativeForm.vue` crashava sempre que renderizado (colisão de nome de computed `fields` com injeção global do VeeValidate) — ou seja, E3 nunca funcionou de fato até essa correção, apesar de marcado "Implementado" desde `07c4d0e`. Ver [decisions.md](./decisions.md). |
| E4   | Autocompletar em menus           | **Implementado (modo lista apenas), e agora funcional de ponta a ponta** — prop `filterable` + campo de busca client-side sobre `filteredOptions`, restrito ao modo lista (`document.scope !== 'immediate'`); não se aplica ao carrossel `immediate` (commit `0891b30`, fix de disable pós-seleção em `73a5f91`). **Correção 2026-09-08**: `BlipCard.vue` nunca repassava `filterable` para `BlipSelect.vue` — o campo de busca nunca aparecia quando consumido via roteamento normal; corrigido. Ver [decisions.md](./decisions.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

Escopo deliberadamente fora da entrega de E3: UI de composição/edição do
formulário no Builder (bot author usa o editor de JSON bruto já existente).
Apenas 4 tipos de campo (text/number/date/select) — outros tipos ficam para
entrega futura, se necessário.

## Bugs corrigidos durante a implementação (não fazem parte do escopo de produto)

Dois bugs reais foram encontrados e corrigidos durante a revisão desta rodada,
sem relação direta com E2/E3/E4 em si, mas necessários para que as features
acima funcionassem corretamente:

- `7f28767` — `this` indefinido em callback `.map()` não-arrow dentro de
  `init()`, quebrava a inicialização de toda instância do componente
  `BlipSelect.vue` (regressão introduzida pelas mudanças de E2/E4 desta
  mesma rodada, corrigida antes de merge). Ver
  [decisions.md](./decisions.md#padrão-perigoso-callbacks-de-mapfilter-devem-ser-arrow-functions-em-blipselectvue).
- `7a488e5` — CSS de layout flex (`display: flex; align-items: center;`)
  aplicado a **todo** `<li>` de `.fixed-options`, não só aos que têm
  `imageUri`, quebrando visualmente selects sem ícone. Restrito via classe
  condicional `has-option-image`.

### Sessão 2026-09-08 — bugs de consumo real encontrados via teste ao vivo em `blip-chat`

Dois bugs adicionais, mais graves que os acima por afetarem o **caminho real
de consumo** (não só edge cases): ambos passaram despercebidos pelas revisões
anteriores porque nunca haviam sido testados via `BlipCard.vue` consumido de
fato por um host (`blip-chat`), só isoladamente.

- Crash em E3 por colisão de nome de computed (`fields`) com a injeção
  global do `vee-validate@2.2.15` — `NativeForm.vue` nunca funcionou de fato
  em produção até esta correção. Ver
  [decisions.md](./decisions.md#bug-crítico-crash-em-nativeformvue-por-colisão-de-nome-com-injeção-global-do-veevalidate-fields-2026-09-08).
- `optionPreviewSize`/`filterable` (E2/E4) nunca repassadas por
  `BlipCard.vue` para `BlipSelect.vue`/`DocumentSelect.vue` — as props em si
  estavam corretas nos componentes filhos desde 2026-08-28, mas eram
  descartadas no roteamento central. Ver
  [decisions.md](./decisions.md#bug-blipcardvue-nunca-repassava-optionpreviewsizefilterable-para-blipselectdocumentselect-e2e4-2026-09-08).

Arquivos alterados: `src/components/NativeForm.vue`, `src/components/BlipCard.vue`.
Validado ao vivo (injeção direta de mensagem de teste no array `messages` de
`ThreadMessages` em `blip-chat`, que consome este pacote via symlink em
`node_modules/blip-cards`) e revisado (`CHANGES_REQUIRED` apenas por um
`package-lock.json` alterado incidentalmente, revertido pelo Tech Lead antes
de prosseguir — o diff de código em si foi validado sem regressão). Ainda
**não commitado** no momento deste SYNC.

## Nota sobre versão do `package.json`

O `package.json` local mostra `"version": "3.22.0"`, mas o HEAD real desta
branch está à frente disso — o campo do `package.json` **não é fonte de
verdade** de versão; a versão publicada é gerenciada por `semantic-release`
a partir das tags Git (ver
[manifest.md](./manifest.md) e
[decisions.md](./decisions.md#discrepância-entre-packagejsonversion-e-a-tag-git-real)).
Isso é relevante para este roadmap porque qualquer consumidor (`blip-chat`)
que declare uma versão fixa de `blip-cards` no seu próprio `package.json`
pode estar defasado em relação ao que está de fato implementado aqui.

## Como interpretar

- **Implementado**: cruzado contra o código real desta branch nesta sessão
  (commits citados), não é apenas citação do documento de origem.
- **Parcialmente implementado**: cobre parte do item de produto, mas não a
  funcionalidade completa descrita na fonte externa.
- `ARCHITECTURE_REVIEW_REQUIRED`: existe caminho técnico possível, mas requer
  definição de contrato/protocolo em conjunto com um sistema fora deste
  workspace antes de qualquer implementação Vue.
