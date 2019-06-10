import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-checkbox/paper-checkbox.js';

import {FireStoreMixin} from '../local-components/mixins/mixin-firestore.js';
import {UtilitiesMixin} from '../local-components/mixins/mixin-utilities';
/**
 * @customElement
 * @polymer
 */
class ApplyExamPage extends UtilitiesMixin(FireStoreMixin(PolymerElement)) {
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
      
      <template is="dom-if" if="[[startExam]]">
        <paper-card>
          <template is="dom-repeat" items="[[questionsExam]]" as="questionExam">
            <div class="card-actions">
              <div>Pregunta [[sumIndex(index)]]</div>
              <div class="layout horizontal">
                <marked-element markdown="[[questionExam.data.question]]">
                  <div slot="markdown-html"></div>
                </marked-element>
              </div>
              <paper-textarea label="Respuesta" rows="5"></paper-textarea>
            </div>
          </template>
        </paper-card>
      </template>
      <template is="dom-if" if="[[!startExam]]">
        <paper-card heading="Términos y condiciones">
          <div class="card-content">
            {{location.params.codeExam}}
            <p>Hola Carlos Loera,</p>
            
            
            </p>En GFT es muy importante la protección de tus Datos Personales, así como el respeto a los Derechos de Autor de terceros, por lo que en caso de que decidas continuar con el proceso de selección y reclutamiento de la vacante Desarrollador Frontend, entenderemos tu aceptación y pleno consentimiento respecto del Aviso de Privacidad y el Release, adjuntos al presente.</p>
            <p>Quedo a la espera de tus noticias.</p>
            <paper-checkbox checked="{{tosAccepted}}">Acepto Términos y condiciones.</paper-checkbox>
          </div>
          <div class="card-actions">
            <paper-button disabled$="[[!tosAccepted]]" on-click="_getQuestions">Iniciar evaluación</paper-button>
          </div>
        </paper-card>
      </template>
    `;
  }
  static get properties() {
    return {
      code: {
        type: String
      },
      tosAccepted: {
        type: Boolean,
        value: false
      },
      startExam: {
        type: Boolean,
        value: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  sumIndex(index) {
    return index + 1;
  }

  _getQuestions() {
    this.loadingPage = true;
    this.getDoc('candidateExam', this.location.params.codeExam).then(exam => {
      console.log(exam);
      let reference = this.getReference('exam', exam.referenceExam.id);
      this.simpleQueryWithReference('questionExam', 'referenceExam', '==', reference)
        .then(results => {
          this.startExam = true;
          this.set('questionsExam', results);
        }).finally(() => {
        this.loadingPage = false;
      });

    }).catch(error => {
      console.log('existExam', error);
      //window.location.href = '/gft-examen';
    });
  }
}

window.customElements.define('apply-exam-page', ApplyExamPage);
