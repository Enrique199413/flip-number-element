# \<flip-number-element\>

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/owner/my-element)

Polymer 3 element implement [number-flip](https://github.com/gaoryrt/number-flip) from @gaoryrt

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


 `<flip-number-element>` provides the following custom properties
 for styling:

 Custom property | Description | Default
 ----------------|-------------|----------
 `--flip-number-element-color` | Color of the base text | #000
 `--flip-number-element-style` | Mixin applied to the flip | `{}`

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

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

Thanks to @gaoryrt [number-flip](https://github.com/gaoryrt/number-flip)
