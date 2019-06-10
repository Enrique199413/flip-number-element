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
class CodeRegisterPage extends UtilitiesMixin(FireStoreMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="base-style iron-flex iron-flex-alignment">
        :host {
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
          margin-top: 10rem;
          width: 50%;
        }
      </style>
      
      <paper-card heading="Prueba GFT">
        <div class="card-content">
          <paper-input label="Código de acceso" type="text" value="{{code::input}}"></paper-input>
        </div>
        <div class="card-actions">
          <paper-button on-click="verifyCode">Iniciar evaluación</paper-button>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      code: {
        type: String
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  verifyCode() {
    this.getDocExist('candidateExam', this.code).then(existExam => {
      console.log(existExam);
      window.location.href = '/hacer-examen/' + this.code;
    }).catch(error => {
      console.log('existExam', error);
    })
  }
}

window.customElements.define('code-register-page', CodeRegisterPage);
