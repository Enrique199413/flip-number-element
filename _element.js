import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `flip-number`
 * Polymer 3 element implement number-flip
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class FlipNumber extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'flip-number',
      },
    };
  }
}

window.customElements.define('flip-number', FlipNumber);
