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
A structured form (several fields answered in a single interaction, optionally split in steps) is rendered when the bot sends an `application/vnd.lime.input+json` message whose `validation.type` is `application/vnd.lime.form+json`. No backend change is needed: the content is authored in the bot flow.

```json
{
  "type": "application/vnd.lime.input+json",
  "content": {
    "label": { "type": "text/plain", "value": "Please fill in the fields below:" },
    "validation": {
      "rule": "type",
      "type": "application/vnd.lime.form+json",
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
- `on-selected` is called with a `"label: value"` summary text (dates formatted with the browser locale, option labels for `select`/`radio`/`checkbox`, the file name for `file`) and `{ type: 'application/json', content: { [field.id]: value } }` containing the fields of all steps. Empty optional fields are sent as `""` (`[]` for `checkbox`). Once sent, the card shows a read-only summary.
- When `hide-options` is true, the fields and all buttons are disabled. Hosts such as blip-chat set it on every card that is not the latest message of the conversation.

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

