import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-toolbar/paper-toolbar.js';

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
          width: 100%;
        }
        
        paper-card.tos {
          margin-top: 10rem;
          width: 50%;
        }
        @media screen and (max-width: 992px) {
          paper-card.tos {
            margin-top: 1rem;
            width: 100%;
          }
        }
        
        app-header {
          background-color: var(--base-color);
          color: #fff;
          width: 100%;
        }
        
        paper-card {
          margin-left: 1rem;
          margin-right: 1rem;
          margin-top: 1rem;
          width: 90%;
        }
      </style>
      <template is="dom-if" if="[[startExam]]">
        <app-header-layout fullbleed>
          <app-header slot="header" fixed effects="waterfall">
            <app-toolbar>
              <div main-title>Examen de {{candidateData.name}} {{candidateData.lastName}} {{candidateData.middleName}}</div>
            </app-toolbar>
          </app-header>
          <div class="layout vertical center-center">
            <template is="dom-if" if="[[location.params.reviewer]]">
              <div class="layout horizontal start-justified">
                <p>Examen de {{candidateData.name}} {{candidateData.lastName}} {{candidateData.middleName}}</p>
              </div>
            </template>
            <template is="dom-repeat" items="[[questionsExam]]" as="questionExam">
              <paper-card>
                <div class="card-content">
                  <div>Pregunta [[sumIndex(index)]]</div>
                  <div class="layout horizontal">
                    <marked-element markdown="[[questionExam.data.question]]">
                      <div slot="markdown-html"></div>
                    </marked-element>
                  </div>
                  <template is="dom-if" if="[[currentExam.readOnly]]">
                    <div class="layout vertical">
                      <div>
                        Respuesta:
                      </div>
                      <marked-element markdown="[[questionExam.answer]]">
                        <div slot="markdown-html"></div>
                      </marked-element>
                    </div>
                  </template>
                  <template is="dom-if" if="[[!currentExam.readOnly]]">
                    <paper-textarea label="Respuesta" rows="3" value="{{questionExam.answer::input}}"></paper-textarea>
                    <paper-button on-click="saveAnswer">Guardar Respuesta</paper-button>
                  </template>
                  <template is="dom-if" if="[[checkReviewer()]]">
                    <paper-radio-group selected="{{questionExam.correctAnswer}}">
                      <paper-radio-button name="true">Correcta</paper-radio-button>
                      <paper-radio-button name="false">Incorrecta</paper-radio-button>
                    </paper-radio-group>
                    <paper-button on-click="saveAnswer">Guardar Respuesta</paper-button>
                  </template>
                </div>
              </paper-card>
            </template>
            <template is="dom-if" if="[[!currentExam.readOnly]]">
              <paper-button on-click="finishExam">Finalizar Examen</paper-button>
            </template>
            <template is="dom-if" if="[[checkReviewer()]]">
              <paper-card heading="Calificacion del examen final">
                <div class="card-content">
                  <paper-input label="Calificacion" type="number" value="{{currentExam.evaluation::input}}"></paper-input>
                  <paper-textarea label="Feedback" rows="3" value="{{currentExam.feedback::input}}"></paper-textarea>
                </div>
                <div class="card-actions">
                  <paper-button on-click="finishExam">Calificar Examen</paper-button>
                </div>
              </paper-card>
            </template>
          </div>
        </app-header-layout>
      </template>
      <template is="dom-if" if="[[!startExam]]">
        <paper-card heading="Términos y condiciones" class="tos">
          <template is="dom-if" if="[[loadingPage]]">
            <div class="layout vertical center-center loading-container">
              <paper-spinner active></paper-spinner>
            </div>
          </template>
          <template is="dom-if" if="[[!loadingPage]]">
            <div class="card-content">
              {{location.params.codeExam}}
              <p>Hola {{candidateData.name}} {{candidateData.lastName}} {{candidateData.middleName}},</p>
              </p>En GFT es muy importante la protección de tus Datos Personales, así como el respeto a los Derechos de Autor de terceros, por lo que en caso de que decidas continuar con el proceso de selección y reclutamiento de la vacante Desarrollador Frontend, entenderemos tu aceptación y pleno consentimiento respecto del Aviso de Privacidad y el Release, adjuntos al presente.</p>
              <p>Quedo a la espera de tus noticias.</p>
              <paper-checkbox checked="{{tosAccepted}}">Acepto Términos y condiciones.</paper-checkbox>
            </div>
            <div class="card-actions">
              <paper-button disabled$="[[!tosAccepted]]" on-click="_getQuestionsAndAnswers">Iniciar evaluación</paper-button>
            </div>
          </template>
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
      },
      questionsExam: {
        type: Array,
        value: () => []
      },
      loadingPage: {
        type: Boolean,
        value: false
      },
      seeResult: {
        type: Boolean,
        value: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._getInfoCandidate(this.checkReviewer());
  }

  checkReviewer() {
    if(this.location.params.reviewer) {
      this.tosAccepted = true;
      return true;
    }
  }

  sumIndex(index) {
    return index + 1;
  }

  finishExam() {
    let data = {
      readOnly: true,
      tos: this.tosAccepted,
      chances: this.checkReviewer() ? this.currentExam.chances : this.currentExam.chances + 1,
      evaluation: parseInt(this.currentExam.evaluation, 10),
      feedback: this.currentExam.feedback,
      referenceCandidate: this.getReference('candidate', this.currentExam.referenceCandidate.id),
      referenceExam: this.getReference('exam', this.currentExam.referenceExam.id)
    };
    this.updateDocument('candidateExam', this.location.params.codeExam, data);
  }

  saveAnswer(e) {
    let data = {
      answer: e.model.questionExam.answer,
      correctAnswer: e.model.questionExam.correctAnswer === 'true' ? true : false,
      questionExamReference: this.getReference('questionExam', e.model.questionExam.id),
      candidateReference: this.getReference('candidate', e.model.questionExam.id)
    };
    this.updateDocument('answerExamCandidate', e.model.questionExam.id, data);
  }

  _getInfoCandidate(getAnswers = false) {
    this.loadingPage = true;
    this.getDoc('candidateExam', this.location.params.codeExam)
      .then(exam => {
        this.set('currentExam', exam);
        if (getAnswers) {
          this._getQuestionsAndAnswers();
        }
        return this.getDoc('candidate', exam.referenceCandidate.id);
      })
      .then(candidate => {
        this.set('candidateData', candidate);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.loadingPage = false;
      });

  }

  _getQuestionsAndAnswers() {
    this.loadingPage = true;
    let reference = this.getReference('exam', this.currentExam.referenceExam.id);
    this.simpleQueryWithReference('questionExam', 'referenceExam', '==', reference).then(questionsExam => {
      this.startExam = true;
      Promise.all(this._getInfoAboutAnswer(questionsExam)).then(finalQuestionsWithAnswers => {
        this.set('questionsExam', questionsExam);
      })
    }).finally(() => {
      this.loadingPage = false;
    });
  }

  _getInfoAboutAnswer(questions) {
    return questions.map(questionExam => {
      return new Promise((resolve, reject) => {
        this.simpleQueryWithReference('answerExamCandidate', 'questionExamReference', '==', this.getReference('questionExam', questionExam.id)).then(answersExamCandidate => {
          if (answersExamCandidate.length > 0) {
            questionExam.answer = answersExamCandidate[0].data.answer;
            questionExam.correctAnswer = answersExamCandidate[0].data.correctAnswer;
            questionExam.answerId = answersExamCandidate[0].id;
          }
          resolve(questionExam);
        }).catch((error) => {
          reject(error);
        });
      });
    })
  }
}

window.customElements.define('apply-exam-page', ApplyExamPage);
