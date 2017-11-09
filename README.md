# blip-cards

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
<blip-card :document="document" :position="'left'" :date="13:00 PM" :on-selected="function" :hide-options="false" />
```

| Attribute   |      Description      |  Type |
|----------|:-------------:|------:|
| document | BLiP JSON envelope (REQUIRED) | Object |
| position |  Card position, possible values are 'left' and 'right'. Default: 'left' | String |
| date |    Date that will be shown below the card (OPTIONAL)   |   String |
| on-selected | callback function that will be called when the user interacts with the card (OPTIONAL) | Function |
| hide-options | Used only in the select with scope immediate. This is used to hide the quick reply options (OPTIONAL) | Boolean |

