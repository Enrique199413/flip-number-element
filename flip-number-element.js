import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'number-flip';

/**
 * `<flip-number-element>`
 * ## Implements number flip
 * In typical use, just slap some `<flip-number-element>` at the top of your body:
 * ```
 * <body>
 *   <flip-number-element></flip-number-element>
 * </body>
 * ```
 * Wham! It's all awesome now!
 *
 * ### Styling
 *
 * `<flip-number-element>` provides the following custom properties
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--flip-number-element-color` | Color of the base text | #000
 * `--flip-number-element-style` | Mixin applied to the flip | `{}`
 *
 * @customElement
 * @polymer
 * @demo https://www.webcomponents.org/element/flip-number-element/demo/demo/index.html
 */
class FlipNumberElement extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .flip {
          color: var(--flip-number-element-color, #000);
          @apply --flip-number-element-style;
        }
      </style>
      <div class="flip"></div>
    `;
  }
  static get properties() {
    return {
      /**
       * The number that animation starts from.
       *
       * If the property doesn't specify a type, or that type is not
       * primitive, be sure to annotate the type properly.
       *
       */
      from: {
        type: Number,
        value: 100
      },
      /**
       * The number that animation rolls to.
       *
       * If the property doesn't specify a type, or that type is not
       * primitive, be sure to annotate the type properly.
       *
       */
      to: {
        type: Number,
        value: 2
      },
      /**
       * The animation duration in seconds. If not specified, duration defaults to 1 second.
       *
       * If the property doesn't specify a type, or that type is not
       * primitive, be sure to annotate the type properly.
       *
       */
      duration: {
        type: Number,
        value: 1
      },
      /**
       * The current Flip `<HTMLElement>`
       *
       * If the property doesn't specify a type, or that type is not
       * primitive, be sure to annotate the type properly.
       *
       */
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
  /**s
   * Observer into properties of element `flip-number-element` and change on `currentFlip`.
   *
   * @param {number} from change value.
   * @param {number} to change value
   * @param {number} duration change value
   * @return {HTMLElements} `the currentFlip`.
   */
  __seeChanges(from, to, duration) {
    if (this.currentFlip) {
      this.currentFlip.flipTo({
        from: from || this.from,
        to: to || this.to,
        duration: duration || this.duration
      });
      return this.currentFlip;
    }
  }
}

window.customElements.define('flip-number-element', FlipNumberElement);
