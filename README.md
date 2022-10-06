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

### MUST READ TO COMMIT AND TO GENERATE A PULL REQUEST#

We follow some rules to create commits and generate pull request, those rules can be found here: (https://www.conventionalcommits.org/en/v1.0.0-beta.2/) and it is something that **YOU MUST DO**, if you don't, messages
like this one will be show on semantic release pipeline (https://dev.azure.com/curupira/BLiP/, takenet.blip-cards-vue-components pipeline): **There are no relevant changes, so no new version is released**.

e.g.:
<type>[optional scope]: <description>
- feat: blip cards update audio
- feat(blipCards): create a new component
- fix: survey card component is not show correctly
- fix(BlipCards): text component should accept hiphen
