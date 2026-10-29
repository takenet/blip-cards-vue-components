# blip-cards

[![Build Status](https://dev.azure.com/curupira/BLiP/_build?definitionId=1295 )

> Reusable BLiP cards using Vue

- No need to render the cards yourself
- One simple blip-card tag


## Usage

### NPM

```
$ npm install blip-cards
```

Just import or require like so:

```
var Vue = require('vue');
var blipCards = require("blip-cards");

var components = blipCards.install(Vue);
```

Then, reference the cards via <blip-card> tag as following

```html
<blip-card :document="document" :position="'left'" :date="13:00 PM" :on-selected="function" :on-save="function" :editable="true" :hide-options="false" :disable-link="false"/>
```

| Attribute   |      Description      |  Type |
|----------|:-------------:|------:|
| document | BLiP JSON envelope (REQUIRED) | Object |
| position |  Card position, possible values are 'left' and 'right'. Default: 'left' | String |
| date |    Date that will be shown below the card (OPTIONAL)   |   String |
| on-selected | callback function that will be called when the user interacts with the card (OPTIONAL) | Function (text, option)|
| on-save | callback function that will be called when the user saves the card after editing (OPTIONAL) | Function (document) |
| on-deleted | callback function that will be called when the user delete the card (OPTIONAL) | Function (document) |
| deletable| make the card deletable (OPTIONAL) | Boolean |
| editable| make the card editable (OPTIONAL) | Boolean |
| readonly | Currently being used only in the quick reply. Could be implemented in other components too. This is used to avoid click actions in the quick reply options. If this attribute is true, than the <em>editable</em> and <em>deletable</em> should be false (OPTIONAL) | Boolean |
| hide-options | Used only only in the quick reply. This is used to hide the quick reply options (OPTIONAL) | Boolean |
| disable-link | Used only in the plain text. This is used to do not render tag 'a' (OPTIONAL) | Boolean |

### Select menu options (`application/vnd.lime.select+json` and `application/vnd.blip.rich-select+json`)

Besides the standard Lime fields, the select content accepts these optional fields:

> **Which type to send:** the platform deserializes `application/vnd.lime.select+json` into Lime's fixed `Select`/`SelectOption` types (options only carry `order`, `text`, `type` and `value`), so every field below is dropped before it reaches the client. To use them, send the same content under `application/vnd.blip.rich-select+json`, which the platform forwards untouched and this library renders exactly like a select menu. Only Blip Chat renders it; other channels (e.g. WhatsApp) do not know this type, so keep a regular select menu for them. What the bot receives when an option is picked is the same as with the regular select.

| Field | Description | Type |
|----------|:-------------:|------:|
| content.optionPreviewSize | Maximum number of characters shown for each option before it is truncated with `...`. Applies to quick replies (`scope: "immediate"`); list menus always show the full text. The component also honors it for `application/vnd.lime.document-select+json`, but the platform drops the field for that type, so it only takes effect where the card is rendered directly. Missing or invalid values (null, 0, negative, non-integer) fall back to the default. Default: 34 | Number |
| content.options[].imageUri | URL of a small image (20x20px) rendered before the option text, in both quick reply and list menus. Options without it, or whose image fails to load, render as text only (or with `emoji`, if provided) | String |
| content.options[].emoji | Emoji (e.g. `"💳"`) rendered as the option icon, in the same 20x20px slot, in both quick reply and list menus. Plain text, never HTML. Used when the option has no `imageUri` or when its image fails to load; if both are set, the image wins | String |
| content.options[].description | Subtitle shown below the option text (plain text, never HTML). Quick replies grow into a small card and lists show a second line | String |
| content.options[].badge | Short label (e.g. "New", "24h") shown as a pill next to the option text. Plain text, never HTML | String |
| content.options[].section | Section name for list menus. A header is shown when the value changes between consecutive options, so options of the same section must be sent together. Ignored in quick replies | String |
| content.visibleOptions | List menus only. Number of options shown before the list is collapsed behind a "Show more (N)" button (label taken from `translations.showMore`). Expanding shows all options. Missing or invalid values (null, 0, negative, non-integer) or values greater than or equal to the number of options show the full list. Ignored in quick replies | Number |

```json
{
  "type": "application/vnd.blip.rich-select+json",
  "content": {
    "text": "Como podemos ajudar?",
    "scope": "immediate",
    "optionPreviewSize": 60,
    "options": [
      { "text": "Segunda via da conta", "description": "Fatura de julho", "badge": "Rapido", "imageUri": "https://example.com/bill.png" },
      { "text": "Falta de energia", "description": "Registrar ocorrencia", "badge": "24h", "emoji": "⚡" }
    ]
  }
}
```

List menu with sections, collapsed after 2 options:

```json
{
  "type": "application/vnd.blip.rich-select+json",
  "content": {
    "text": "Escolha o servico desejado:",
    "visibleOptions": 2,
    "options": [
      { "order": 1, "section": "Mais usados", "text": "Segunda via", "description": "Fatura de julho", "badge": "Rapido" },
      { "order": 2, "section": "Mais usados", "text": "Falta de energia", "badge": "24h" },
      { "order": 3, "section": "Outros", "text": "Falar com atendente" }
    ]
  }
}
```

## Group Card
Is possible to group your cards using any rule you want. For that use the <blip-group-card> tag as following

```html
<blip-group-card :documents="documentList" :compare-messages="function" :on-selected="function" :on-save="function" :editable="true" :hide-options="false" :disable-link="false"/>
```

| Attribute   |      Description      |  Type |
|----------|:-------------:|------:|
| documents | Array of BLiP JSON envelopes with the content, position and date (REQUIRED) | Array |
| compare-messages | callback function to determine if two messages are in the same group | Function (msg1, msg2) |
| on-selected | callback function that will be called when the user interacts with the card (OPTIONAL) | Function (text, option)|
| on-save | callback function that will be called when the user saves the card after editing (OPTIONAL) | Function (document) |
| on-deleted | callback function that will be called when the user delete the card (OPTIONAL) | Function (document) |
| deletable| make the card deletable (OPTIONAL) | Boolean |
| editable| make the card editable (OPTIONAL) | Boolean |
| readonly | Currently being used only in the quick reply. Could be implemented in other components too. This is used to avoid click actions in the quick reply options. If this attribute is true, than the <em>editable</em> and <em>deletable</em> should be false (OPTIONAL) | Boolean |
| hide-options | Used only only in the quick reply. This is used to hide the quick reply options (OPTIONAL) | Boolean |
| disable-link | Used only in the plain text. This is used to do not render tag 'a' (OPTIONAL) | Boolean |

## Native Form Card
A structured form (several fields answered in a single interaction, optionally split in steps) is rendered when the bot sends an `application/vnd.blip.form+json` message.

> **Which type to send:** the platform deserializes `application/vnd.lime.input+json` into Lime's fixed `Input` type, which only keeps `label` and `validation.rule`/`type`/`regex`/`error`, so `fields`, `steps`, `submitLabel` and every other property below are dropped before the message reaches the client (the card then shows only the opening text and a default "Enviar" button). To use the form, send the same content under `application/vnd.blip.form+json`, which the platform forwards untouched. No backend change is needed: the content is authored in the bot flow. The card still also renders an `application/vnd.lime.input+json` whose `validation.type` is `application/vnd.lime.form+json` for hosts that deliver the content without the platform filtering, but flows should use `application/vnd.blip.form+json`. Only Blip Chat renders this type; other channels (e.g. WhatsApp) do not know it. What the bot receives is an `application/json` message, as described below.

```json
{
  "type": "application/vnd.blip.form+json",
  "content": {
    "label": { "type": "text/plain", "value": "Please fill in the fields below:" },
    "validation": {
      "submitLabel": "Send",
      "fields": [
        { "id": "name", "label": "Full name", "type": "text", "required": true, "minLength": 3 },
        { "id": "email", "label": "E-mail", "type": "email", "required": true, "helpText": "We will send the protocol here." },
        { "id": "phone", "label": "Phone", "type": "tel", "mask": "(00) 00000-0000" },
        { "id": "cpf", "label": "CPF", "type": "text", "mask": "000.000.000-00", "required": true },
        { "id": "account", "label": "Account number", "type": "number", "min": 1 },
        { "id": "visit", "label": "Visit date", "type": "date", "min": "2026-01-01" },
        { "id": "reason", "label": "Reason", "type": "select", "required": true, "options": [{ "value": "bill", "label": "Bill copy" }] },
        { "id": "topics", "label": "Topics", "type": "checkbox", "options": [{ "value": "bill", "label": "Bill" }, { "value": "meter", "label": "Meter" }] },
        { "id": "photo", "label": "Meter photo", "type": "file", "accept": "image/*,application/pdf", "maxSizeMb": 5 }
      ]
    }
  }
}
```

**Form properties** (`validation`)

| Property | Description |
| --- | --- |
| `fields` | Fields of a single-step form. |
| `steps` | `[{ "title"?: string, "fields": Field[] }]`. When present and non-empty, `fields` is ignored. Steps left without valid fields are dropped. |
| `submitLabel` / `nextLabel` / `backLabel` | Button labels. Defaults: `Enviar`, `Continuar`, `Voltar`. |
| `messages` | Overrides the default (pt-BR) validation messages by key: `required`, `email`, `tel`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `mask`, `fileType`, `fileSize`, `uploadFailed`, `uploading`. `{min}`, `{max}` and `{mask}` are replaced. |

**Field types** (unknown types are rendered as `text`)

| `type` | Rendered as | Value sent |
| --- | --- | --- |
| `text` | text input | string |
| `number` | number input (`min`/`max`) | string |
| `email` | e-mail input (e-mail keyboard/autocomplete) | string |
| `tel` | phone input; without `mask`, 8 to 15 digits are required | string |
| `date` | date input (`min`/`max` as `YYYY-MM-DD`) | `YYYY-MM-DD` |
| `textarea` | multi-line text | string |
| `select` | dropdown (`options`) | option `value` |
| `radio` | radio group (`options`) | option `value` |
| `checkbox` | checkbox group (`options`) | array of option `value`s (`[]` when none) |
| `file` | file picker (`accept`, `maxSizeMb`, default 20) — requires `on-upload-file` | uploaded media URI |

**Field properties**: `id` and `label` (required; ids must be unique across all steps), `required`, `placeholder`, `helpText`, `minLength`/`maxLength` (text, email, tel, textarea), `min`/`max` (number, date), `pattern` (JS regex source that must match the whole value; invalid expressions are ignored), `mask` (text and tel), `errorMessage` (replaces any validation message of the field, except the "wait for the upload" notice, which can only be changed with `messages.uploading`), `options` (`[{ "value", "label" }]`), `accept` and `maxSizeMb` (file), `value` (pre-fill, see below).

- **Pre-fill** (`value`): fills a field with data the bot already knows, usually a Builder variable such as `{{contact.extras.cpf}}`. Pre-filled values are editable, validated like typed values and sent in the content and summary.
  - `text`, `number`, `email`, `tel`, `date`, `textarea`: a string, trimmed (numbers are converted to strings). With a `mask`, the value is formatted with it (`"12345678909"` → `123.456.789-09`). `number` values must follow the HTML number format (`42`, `-1.5`, `2.5e1`; not `+5`, `0x10` or `1.`) and `date` values must be a valid `YYYY-MM-DD`; anything else is ignored.
  - `select` / `radio`: used only when it matches one option `value`; otherwise the field starts empty.
  - `checkbox`: an array (or a single string) of option values; values that are not options are dropped and the result follows the options order.
  - `file`: not supported, `value` is ignored.
  - A string that still contains an unresolved variable (`{{...}}` anywhere, e.g. `"{{contact.extras.cpf}}"` or `"Rua {{contact.street}}"` when the contact has no such data) is treated as empty. In a `checkbox` array, only those items are dropped.
  - A pre-filled value that is invalid (e.g. `"maria@email"` in an `email` field) is not flagged on load. It shows its error and blocks sending when the user tries to continue.
  - Pre-fills are applied when the card is created. If the same card later receives an updated document, only newly added fields are pre-filled; values of existing fields (including the user's edits) are kept. A field that keeps its `id` but changes `type` keeps its current value only if it is valid for the new type under these same rules (e.g. a text `"abc"` does not survive a change to a `select` without such option); otherwise it gets the pre-fill of its new type. A `select`/`radio` value that is no longer among the `options` counts as empty (required error, or sent as `""`), and `checkbox` values keep only existing options.
  - **Privacy**: pre-fill only the data the user needs to confirm or that the form needs (data minimisation). Pre-filled values are part of the bot message: they remain visible in the conversation history and transcripts, and in older cards that are shown disabled.
- **Valid state**: text inputs, selects and textareas holding a valid, non-empty value get a green border (`$color-positive`) once left (or after the user tries to continue), and pre-filled fields get it right away. Empty fields, radio/checkbox groups and `file` fields (which show ✓ after the upload) keep the neutral style. Error style takes precedence.

```json
{ "id": "cpf", "label": "CPF do titular", "type": "text", "mask": "000.000.000-00", "required": true, "value": "{{contact.extras.cpf}}" }
```

- **Masks**: `0` is a digit, `A` a letter, `*` a letter or digit; any other character is a literal inserted automatically, e.g. `000.000.000-00`, `(00) 00000-0000`, `00000-000`. The value is formatted while typing and is sent as displayed. A masked field is valid only when completely filled.
- **Validation** happens in real time: errors are shown under a field after it is left (or after the user tries to continue) and update while typing. The form cannot be advanced/sent while there are errors in the current step; focus goes to the first invalid field.
- **Steps**: with more than one step, a "Etapa n de N" header with a progress bar is shown; `Voltar` keeps the values and only the current step is validated before moving on. Single-step forms have no header nor back button.
- Fields without an `id`, `select`/`radio`/`checkbox` fields without `options` and `file` fields when the host does not provide `on-upload-file` are ignored. Labels are rendered as plain text.
- **Upload**: hosts enable `file` fields by passing `on-upload-file` to `blip-card`/`blip-group-card`: `(file: File) => Promise<string | { uri: string }>`. The file type (`accept`, MIME type or extension, wildcards such as `image/*`) and size are checked before calling it; the form cannot be sent while an upload is pending, and a rejected promise shows an error so the user can choose another file.
- After the form is sent, the read-only summary shows the file name of each `file` field as a link. It calls `on-media-selected(uri)` when the host provides it (blip-chat renews an expired link before opening it) and otherwise opens the address in a new tab. Only `http(s)` addresses are linked.
- `on-selected` is called with a `"label: value"` summary text (dates formatted with the browser locale, option labels for `select`/`radio`/`checkbox`, the file name as a link (`[name](https://…)`) for `file`, so the file can still be opened from the conversation history) and `{ type: 'application/json', content: { [field.id]: value } }` containing the fields of all steps. Empty optional fields are sent as `""` (`[]` for `checkbox`). Once sent, the card shows a read-only summary.
- When `hide-options` is true, the fields and all buttons are disabled. Hosts such as blip-chat set it on every card that is not the latest message of the conversation.

**Reading the answers in Builder** (no backend change is required; verified against Take.Blip.Builder 0.7.524 and on HMG):

- Save the user input of the state that waits for the form in a variable (e.g. `formulario`). It holds the JSON content, and each field is read with `{{formulario@<field id>}}` (e.g. `{{formulario@cpf}}`).
- Leave the input validation of that state empty or set it to type `application/json`. A type validation of `application/vnd.lime.form+json` or `application/vnd.blip.form+json` rejects the answer, because the reply is `application/json`.
- Use only letters, digits and `_` in field ids (`data_visita`, not `data-visita`): the variable property syntax does not accept `-`, and `.` is read as a nested property.
- `checkbox` values are returned as a JSON array (`{{formulario@topicos}}` → `["conta","medidor"]`); indexes such as `@topicos[0]` are not supported, so use a script to split them.
- `file` values are media links signed for a limited time (30 minutes for blip-chat uploads on HMG). Forward or store the file within that window, or renew the link with the `set /refresh-media-uri` command to `postmaster@media.msging.net`.

## Contributions

Any contribution to the code via pull request would be nice and any idea and/or suggestion are very welcome.

However, please do not feel bad if your pull requests or contributions do not get merged or implemented into `blip-cards`.

### Building #

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run bundle:min
```

<a id="license"></a>
## License
`blip-cards` is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).

### MUST READ TO COMMIT AND TO GENERATE A PULL REQUEST #

We follow some rules to create commits and generate pull request, those rules can be found here: (https://www.conventionalcommits.org/en/v1.0.0-beta.2/) and it is something that **YOU MUST DO**, if you don't, messages
like this one will be show on semantic release pipeline (https://dev.azure.com/curupira/BLiP/, takenet.blip-cards-vue-components pipeline): **There are no relevant changes, so no new version is released**.

e.g.:
<type>[optional scope]: <description>
- feat: blip cards update audio
- feat(blipCards): create a new component
- fix: survey card component is not show correctly
- fix(BlipCards): text component should accept hiphen

### Steps to generate a version manually: #

1 - Create a Branch with the name following the semantic releases pattern (https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#branches) to generate versions from any branch.
e.g.: 2.11.x


2 - Make your changes on the project


3 - Add the semantic releases configurations on the project's package.json file. e.g.:
```json
"release": {
  "branch": "2.11.x"
}
```


4 - Commit then using the semantic release as showed above. e.g:

  ```shell
  git commit "fix(BlipCards): text component should accept hiphen"
  ```


5 - Push your changes.


6 - Run your pipeline manually using your branch as origin


7 - If succeed your build will run correctly and the version will be generated following the version sequence.

  e.g.: Previous Version: 2.11.3. New Version: 2.11.4.


8 - After generate your version, before merge into the master, undo the modification on the **package.json** file, because the semantic release branch configuration can not be send to the master branch.

