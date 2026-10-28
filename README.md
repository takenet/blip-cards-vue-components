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
A structured form (several fields answered in a single interaction) is rendered when the bot sends an `application/vnd.lime.input+json` message whose `validation.type` is `application/vnd.lime.form+json`. No backend change is needed: the content is authored in the bot flow.

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
        { "id": "name", "label": "Full name", "type": "text", "required": true },
        { "id": "account", "label": "Account number", "type": "number", "required": true },
        { "id": "birthDate", "label": "Birth date", "type": "date", "required": false },
        { "id": "reason", "label": "Reason", "type": "select", "required": true, "options": [{ "value": "bill", "label": "Bill copy" }] }
      ]
    }
  }
}
```

- Supported field types: `text`, `number`, `date` and `select` (`options` is used only by `select`). Unknown types are rendered as `text`. `submitLabel` is optional (defaults to `Enviar`). Labels are rendered as plain text.
- Fields without an `id`, and `select` fields without `options`, are ignored. Field `id`s must be unique.
- Required fields are validated by the browser before sending; once sent, the card shows a read-only summary.
- `on-selected` is called with a `"label: value"` summary text (dates formatted with the browser locale) and `{ type: 'application/json', content: { [field.id]: value } }`. Values are always strings (dates as `YYYY-MM-DD`, `select` as the option `value`); empty optional fields are sent as `""`.
- When `hide-options` is true, the fields and the submit button are disabled. Hosts such as blip-chat set it on every card that is not the latest message of the conversation.

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

