import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
/*import 'code-mirror-wrapper/codemirror-wrapper.js';*/

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
          
        }
      </style>
      
      <paper-card heading="Prueba GFT">
        <div class="card-content">
          <paper-input label="Código de acceso" type="text" value="{{code::input}}"></paper-input>
        </div>
        <div class="card-actions">
          <paper-button on-click="verifyCode">Iniciar evaluación</paper-button>
          <codemirror-wrapper valor-correcto="function myScript(){ 
            return 100;
          }" out-code="{{datos}}"></codemirror-wrapper>
          <pre>[[datos]]</pre>
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
