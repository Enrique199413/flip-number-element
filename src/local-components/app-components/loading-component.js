import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import '@polymer/paper-spinner/paper-spinner.js';

/**
 * @customElement
 * @polymer
 */
class LoadingComponent extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        
        paper-spinner {
          --paper-spinner-layer-1-color: var(--base-color);
          --paper-spinner-layer-2-color: var(--base-color);
          --paper-spinner-layer-3-color: var(--base-color);
          --paper-spinner-layer-4-color: var(--base-color);
        }
      </style>
      <paper-spinner active></paper-spinner>
    `;
  }
  static get properties() {
    return {
      isStillLoading: {
        type: Boolean,
        notify: true
      }
    };
  }

  constructor() {
    super();
    afterNextRender(this, () => {
      setTimeout(() => {
        this.set('isStillLoading', false);
      }, 3000);
    });
  }

}

window.customElements.define('loading-component', LoadingComponent);