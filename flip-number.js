import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'number-flip';

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
        .flip {
          color: var(--primary-text-color, #000);
        }
      </style>
      <div class="flip"></div>
    `;
  }
  static get properties() {
    return {
      from: {
        type: Number,
        value: 100
      },
      to: {
        type: Number,
        value: 2
      },
      duration: {
        type: Number,
        value: 1
      },
      currentFlip: Object
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.currentFlip = new Flip({
      node: this.shadowRoot.querySelector('.flip'),
      from: this.from,
      to: this.to,
      duration: this.duration
    })
  }

  static get observers() {
    return ['__seeChanges(from, to, duration)'];
  }

  __seeChanges(from, to, duration) {
    if (this.currentFlip) {
      this.currentFlip.flipTo({
        from: from || this.from,
        to: to || this.to,
        duration: duration || this.duration
      });
    }
  }
}

window.customElements.define('flip-number', FlipNumber);
