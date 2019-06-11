import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';

import {FireStoreMixin} from '../local-components/mixins/mixin-firestore.js';
import {UtilitiesMixin} from '../local-components/mixins/mixin-utilities';
/**
 * @customElement
 * @polymer
 */
class ConfigPage extends UtilitiesMixin(FireStoreMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="base-style iron-flex iron-flex-alignment">
        :host {
          width: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
      </style>
      
      <paper-card heading="Configuracion">
        
      </paper-card>
    `;
  }
  static get properties() {
    return {
      emptyExams: {
        type: Boolean,
        value: false
      },
      descriptionExam: String,
      nameExam: String
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

window.customElements.define('config-page', ConfigPage);
