# \<flip-number-element\>

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/owner/my-element)

Polymer 3 element implement number-flip

## Demo

See: [Demo](https://www.webcomponents.org/element/flip-number-element/flip-number-element/demo/index.html).

### In a Polymer 3 element
```js
import {PolymerElement, html} from '@polymer/polymer';
import 'flip-number-element/flip-number-element';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
      <flip-number-element></flip-number-element>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
