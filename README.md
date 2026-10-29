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
| content.optionPreviewSize | Maximum number of characters shown for each option before it is truncated with `...`. Applies to quick replies (`scope: "immediate"`) and to `application/vnd.lime.document-select+json` options; list menus always show the full text. Missing or invalid values (null, 0, negative, non-integer) fall back to the default. Default: 34 | Number |
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

