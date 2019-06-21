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
      <style include="base-style iron-flex iron-flex-alignment colored-card-active">
        :host {
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
          margin-top: 10rem;
          flex-basis: 100%;
        }
      </style>
      
      <paper-card class="color-card">
        <div class="card-content">
          <paper-input label="Código de acceso" type="text" value="{{code::input}}" always-float-label></paper-input>
        </div>
        <div class="card-actions layout horizontal center-center">
          <paper-button on-click="verifyCode" class="center-button">Iniciar evaluación</paper-button>
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
      window.location.href = '/hacer-examen/' + this.code;
    }).catch(error => {
      this.openToast('El codigo de acceso no existe y no puedes iniciar la evaluacion');
    })
  }
}

window.customElements.define('code-register-page', CodeRegisterPage);
