# Arquitetura

## Ponto de entrada e instalação

[src/index.js](../../src/index.js) exporta `install(Vue)`, que:

1. Registra dezenas de componentes Vue globais via `Vue.component(...)` (lista completa abaixo).
2. Registra filtros globais: `sizeInBytesFilter`, `limitContentFilter`, `fileIconFilter`.
3. Registra diretivas globais: `autoExpand`, `chat-scroll`.
4. Adiciona um mixin global (`Vue.mixin`) expondo o método `sanitize` ([mixins/sanitizeHtml.js](../../src/mixins/sanitizeHtml.js)) em **todos** os componentes Vue da aplicação host — efeito colateral relevante para quem consome a lib (`blip-chat`).
5. Configura `vee-validate` (validators customizados `json`/`mime`, locale `en`/`pt_BR` detectado por `navigator.language`).
6. Registra `vue2-touch-events`.

> **Risco arquitetural conhecido (`vee-validate@2.2.15`, confirmado 2026-09-08)**: por ser registrado globalmente via `Vue.use(VeeValidate, {...})`, o `beforeCreate` interno do VeeValidate injeta incondicionalmente as computed properties `fields` e `errors` em **todo** componente Vue da árvore do host — sobrescrevendo qualquer `computed.fields`/`computed.errors` que um componente já declare com o mesmo nome, a menos que o componente declare `$__veeInject: false` no options object (mecanismo usado internamente por `ValidationProvider`, não documentado publicamente na API pública da lib). Isso já causou um crash real em produção (`NativeForm.vue`, ver [decisions.md](./decisions.md)). **Regra permanente**: nenhum componente deste repositório deve declarar uma computed chamada `fields` ou `errors` sem `$__veeInject: false`.

Consumidores chamam isso como `blipCards.install(Vue)` ou `Vue.use(blipCards)` (README).

## Roteamento de card: `BlipCard.vue`

[components/BlipCard.vue](../../src/components/BlipCard.vue) é o componente central. Recebe um prop `document` (envelope BLiP/LIME: `{ type, content, metadata? }`) e escolhe **qual componente filho renderizar** via uma cadeia longa de `v-if`/`v-else-if` no template, comparando `document.type` (e em alguns casos `document.content.type` ou `document.content.validation.type`) contra MIME types. Não há uma tabela de lookup centralizada — o roteamento **é** o template do componente (ordem de `v-else-if` importa: o primeiro match vence).

Principais mapeamentos `type` → componente (não exaustivo, ver arquivo para lista completa):

| `document.type` / condição                                                      | Componente renderizado                                     |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `application/vnd.lime.deleted-content+json`                                     | `DeletedContent`                                           |
| `document.metadata['#blip.payload.text']` presente                              | `PlainText` (via metadata, tem precedência sobre o `type`) |
| `text/plain`                                                                    | `PlainText`                                                |
| `application/vnd.lime.media-link+json`                                          | `MediaLink`                                                |
| `application/vnd.lime.document-select+json`                                     | `DocumentSelect`                                           |
| `application/vnd.lime.collection+json`                                          | `Collection`                                               |
| `application/vnd.lime.select+json`                                              | `BlipSelect` (menu/quick-reply)                            |
| `application/vnd.lime.web-link+json`                                            | `WebLink`                                                  |
| `application/vnd.lime.satisfaction-survey+json`                                 | `Survey`                                                   |
| `application/vnd.lime.location+json`                                            | `Location`                                                 |
| `application/vnd.lime.input+json` + `content.validation.type === lime.location` | `RequestLocation`                                          |  | `application/vnd.lime.input+json` + `content.validation.type === lime.form` | `NativeForm` (formulário nativo estruturado, discovery Energisa E3) |  | `application/vnd.lime.input+json` (demais) | `LimeInput` (formulário) |
| `application/vnd.lime.chatstate+json`                                           | `ChatState`                                                |
| `application/vnd.lime.redirect+json`                                            | `Redirect` (tag `blip-redirect`)                           |
| `application/vnd.iris.ticket+json`                                              | `Ticket`                                                   |
| `application/vnd.iris.desk.flow-session+json`                                   | `ActionFlow`                                               |
| `application/vnd.iris.calls.media+json`                                         | `BlipCalls`                                                |
| `application/vnd.iris.calls.customer-permission+json`                           | `BlipCallsPermissionReply`                                 |
| `content.type === 'template-content'` + `isTemplateWithOrderDetails`            | `TemplateOrder` (pedido com Pix/boleto)                    |
| `content.type === 'template-content'` (demais)                                  | `TemplateContent` (template WhatsApp)                      |
| `content.type === 'template'`                                                   | `UnsuportedContent` (template não suportado no card)       |
| `application/vnd.lime.contact+json`                                             | `Contact`                                                  |
| `application/json`                                                              | `ApplicationJSon`                                          |
| `MessageTypesConstants.REPLY_MESSAGE` (`application/vnd.lime.reply+json`)       | `ReplyCard`                                                |
| `application/vnd.lime.reaction+json`                                            | `ReactionCard`                                             |
| `application/vnd.lime.copy-and-paste+json`                                      | `CopyAndPaste` (tag `copy-and-paste-card`)                 |
| `MessageTypesConstants.THREAD_SUMMARY`                                          | `ThreadSummary`                                            |
| (nenhum match)                                                                  | `UnsuportedContent` (fallback, ver final do template)      |

Constantes de tipo centralizadas (parcialmente) em [utils/MessageTypesConstants.js](../../src/utils/MessageTypesConstants.js) — mas nem todos os `v-else-if` usam a constante; muitos comparam a string MIME diretamente inline no template. Ao adicionar um novo tipo de card, checar se vale a pena usar/estender `MessageTypesConstants` por consistência, mas isso não é hoje uma regra seguida uniformemente no código existente.

### `NativeForm.vue` — formulário nativo estruturado (discovery Energisa E3)

[components/NativeForm.vue](../../src/components/NativeForm.vue) renderiza
formulários com campos tipados (`text`/`number`/`date`/`select`) a partir de
`document.content.validation.fields`, seguindo o mesmo padrão de despacho
condicional de `RequestLocation.vue` (reaproveita o envelope
`application/vnd.lime.input+json`, diferenciado pelo `validation.type`
aninhado — não é um MIME type top-level novo). Ao submeter, envia
`onSelected(resumoTexto, { type: 'application/json', content: {...} })`,
mesmo contrato de `BlipSelect`/`RequestLocation`/`DocumentSelect`. O
`v-else-if` correspondente em `BlipCard.vue` precisa vir **antes** do
fallback genérico `lime-input` (ordem de `v-else-if` importa, ver acima).
Não requer nenhum schema/validação no backend do Bot Builder
(`builder-application`): o conteúdo de `SendMessage` é armazenado como JSON
opaco sem validação server-side — ver [decisions.md](./decisions.md) para
detalhes e para o schema completo do payload. A computed com a lista de
campos do formulário chama-se **`formFields`** (não `fields`) e o componente
declara `$__veeInject: false` no options object — nome `fields` colide com
a injeção global do VeeValidate descrita acima e já causou um crash real em
produção (corrigido 2026-09-08, ver [decisions.md](./decisions.md)).

### `BlipSelect.vue` / `DocumentSelect.vue` — props opcionais adicionadas (discovery Energisa)

Além das props originais, `BlipSelect.vue` (menu/quick-reply,
`application/vnd.lime.select+json`) e `DocumentSelect.vue`
(`application/vnd.lime.document-select+json`) ganharam três pontos de
extensão opcionais, todos com comportamento anterior preservado por default
(ver [decisions.md](./decisions.md) para motivação e commits):

- **`optionPreviewSize`** (Number, default `34`): tamanho máximo do preview
  truncado de cada opção. **Só se aplica ao modo carrossel**
  (`document.scope === 'immediate'`, via `item.previewText`) — no modo lista
  (`scope !== 'immediate'`) o template usa `item.text` diretamente, sem
  truncamento, por design (mais espaço horizontal disponível em lista
  vertical). Não é um bug a corrigir se um consumidor esperar truncamento em
  modo lista.
- **`item.imageUri`** (campo opcional dentro de cada item de
  `document.options`, não uma prop do componente): quando presente, renderiza
  um ícone/imagem antes do texto da opção. O CSS de layout correspondente é
  escopado à classe `has-option-image` — não afeta opções sem imagem.
- **`filterable`** (Boolean, default `false`, apenas em `BlipSelect.vue`):
  habilita um campo de busca client-side sobre as opções, restrito ao modo
  lista (`document.scope !== 'immediate'`); não existe no carrossel
  `immediate`.

> **Ponto de atenção (corrigido 2026-09-08)**: essas duas props só têm
> efeito se `BlipCard.vue` de fato as repassar nos blocos `<blip-select>`/
> `<document-select>` do seu template (`:option-preview-size="document.content.optionPreviewSize"`,
> `:filterable="document.content.filterable"` — este último só em
> `<blip-select>`, `DocumentSelect.vue` não declara `filterable`). Já houve
> uma regressão real em que `BlipCard.vue` declarava esses bindings
> incompletos/ausentes, fazendo com que a configuração fosse sempre
> ignorada no caminho de consumo real (ver [decisions.md](./decisions.md)).
> Ao adicionar props novas em `BlipSelect.vue`/`DocumentSelect.vue`,
> confirmar sempre que `BlipCard.vue` também as propaga — a prop existir no
> componente filho não é suficiente.

## Agrupamento: `BlipGroupCard.vue`

[components/BlipGroupCard.vue](../../src/components/BlipGroupCard.vue) recebe `documents` (array de envelopes com `content`/`position`/`date`) e uma prop `compare-messages` (função fornecida pelo consumidor para decidir se duas mensagens pertencem ao mesmo grupo visual). Para cada grupo (`groupedDocuments`), renderiza `BlipCardMember` (nome/telefone do remetente) + um `BlipCard` por mensagem do grupo + `BlipCardDate`/ícone de falha. Repassa uma quantidade grande de props/callbacks (`on-selected`, `on-save`, `on-deleted`, `on-media-selected`, `on-open-link`, `translations`, etc.) por baixo para cada `BlipCard`.

## Componentes de suporte

- **`BlipCardMember` / `BlipCardDate`**: cabeçalho (nome do remetente) e rodapé (timestamp/status de entrega) de cada card/grupo.
- **`Editable`** ([components/Editable.js](../../src/components/Editable.js)): não é `.vue`, é um mixin/render function JS reaproveitado por vários cards editáveis.
- **`ReplyCard/` e `ReactionCard/`**: subárvores de componentes para renderizar "responder a" (`InReplyTo*`, `Replied*`) e "reagir a" (`InReactionTo*`, `Reaction*`) mensagens anteriores — cada subtipo de conteúdo original (texto, mídia, localização, documento, mensagem deletada) tem seu próprio componente de preview dentro dessas pastas.
- **`TemplateContent/`**: renderização de templates de mensagem (WhatsApp Business): `TemplateContent.vue`, `TemplateOrder.vue` (pedido com detalhes de pagamento), botões (`WebsiteButton`, `PhoneNumberButton`) e `MediaContent/` (cabeçalho de mídia do template).
- **`BlipCalls/`**: cards relacionados a chamadas de voz/vídeo (início, fim, permissão, solicitação).
- **`ApplicationJSon/`**: renderização de `application/json` customizado, incluindo `MenuList`/`MenuListPrompt` (menus dinâmicos).
- **`BlipExternal`**: envelope `application/vnd.lime.external+json` (`MessageTypesConstants.BLIP_EXTERNAL`) — conteúdo originado de integração externa.

## Mixins e utilitários transversais

- [mixins/baseComponent.js](../../src/mixins/baseComponent.js): mixin usado pela maioria dos cards individuais. Centraliza props comuns (`document`, `fullDocument`, `position`, `date`, `editable`, `deletable`, `editing`, callbacks `onSave`/`onDeleted`/`onCancel`/`onMetadataEdit`), estado de edição (`isEditing`) e ícones SVG compartilhados (edit/approve/close/trash/check/clock/etc. — importados como assets e expostos em `data()`).
- [mixins/sanitizeHtml.js](../../src/mixins/sanitizeHtml.js): sanitização de HTML (via `sanitize-html`), injetado globalmente em todo componente Vue do host pelo `install()`.
- [utils/](../../src/utils/): `FormatTextUtils`, `MediaLinkTypesConstants`, `MessageTypesConstants`, `TemplateContent` (helpers de parsing de template), `externalMessages`, `media`, `memberUtils`, `metadataService`, `misc`.
- [enums/](../../src/enums/): `componentOrder.enum.js` (tipos/ícones de pedido: Pix, boleto, payment link), `templateOrder.enum.js`, `blipCallsType.enum.js`, `blipCallsStatus.enum.js`.
- [validators/](../../src/validators/): `jsonValidator`, `mimeValidator` — estendem `vee-validate` para os formulários editáveis (`lime.input`, etc.).
- [directives/](../../src/directives/): `AutoExpandDirective` (auto-expandir textarea), `vChatScroll` (scroll de chat).
