import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/marked-element/marked-element.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/iron-pages/iron-pages.js';

import {FireStoreMixin} from '../local-components/mixins/mixin-firestore.js';
import {UtilitiesMixin} from '../local-components/mixins/mixin-utilities';
/**
 * @customElement
 * @polymer
 */
class PreviewExamPage extends UtilitiesMixin(FireStoreMixin(PolymerElement)) {
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
        paper-card {
          width: 100%;
        }
        @media screen and (max-width: 992px) {
          paper-card {
            width: auto;
          }
        }
        
        paper-button.color {
          background: var(--base-color);
          color: var(--white);
        }

        .paper-tabs-style {
          width: 100%;
        }

        iron-pages {
          width: 100%;
        }
      </style>
      <div class="layout horizontal start-justified paper-tabs-style">
        <paper-tabs selected="{{selectedPage}}">
          <paper-tab>Examen</paper-tab>
          <paper-tab on-click="loadCandidates">Candidatos</paper-tab>
        </paper-tabs>
      </div>
      <iron-pages selected="{{selectedPage}}">
        <div>
          <paper-card heading="[[location.params.idExam]]">
            <div class="card-actions">
              <template is="dom-if" if="[[loadingPage]]">
                <div class="layout vertical center-center loading-container">
                  <paper-spinner active></paper-spinner>
                </div>
              </template>
              <template is="dom-if" if="[[!loadingPage]]">
                <template is="dom-repeat" items="[[questionsExam]]" as="questionExam">
                  <div>Pregunta [[sumIndex(index)]] - [[questionExam.id]] <paper-button on-click="eraseQuestionData">Borrar</paper-button></div>
                  <div class="layout horizontal">
                    <marked-element markdown="[[questionExam.data.question]]">
                      <div slot="markdown-html"></div>
                    </marked-element>
                  </div>
                </template>
                <template is="dom-if" if="[[emptyQuestionExams]]">
                  <div class="layout vertical center-center info-message">
                    No hay preguntas para este examen
                    <paper-button class="blue-button">Asigna una pregunta</paper-button>
                  </div>
                </template>
              </template>
            </div>
          </paper-card>
        </div>
        <div>
          <paper-card heading="Candidatos del examen [[location.params.idExam]]">
            <div class="card-actions">
              <template is="dom-if" if="[[loadingPage]]">
                <div class="layout vertical center-center loading-container">
                  <paper-spinner active></paper-spinner>
                </div>
              </template>
              <template is="dom-if" if="[[!loadingPage]]">
                <template is="dom-repeat" items="[[candidatesExam]]" as="candidateExam">
                  <div>
                    <p>Candidato [[sumIndex(index)]]</p>
                    <p>[[candidateExam.candidateData.name]]</p>
                    <p>Id Unico de asignacion: [[candidateExam.id]]</p>
                    <p>Oportunidades presentadas: [[candidateExam.data.chances]]</p>
                    <paper-button on-click="showExamResults">Ver Resultado</paper-button>
                    <paper-button on-click="eraseApply">Borrar</paper-button>
                  </div>
                  <div class="layout horizontal">
                    <marked-element markdown="[[candidatesExam.data.question]]">
                      <div slot="markdown-html"></div>
                    </marked-element>
                  </div>
                </template>
                <template is="dom-if" if="[[emptycandidatesExams]]">
                  <div class="layout vertical center-center info-message">
                    No hay candidatos para este examen
                    <paper-button class="blue-button">Asigna una candidato</paper-button>
                  </div>
                </template>
              </template>
            </div>
          </paper-card>
        </div>
      </iron-pages>
    `;
  }
  static get properties() {
    return {
      questionsExam: {
        type: Array,
        value: () => {
          return [];
        },
        observer: '_questionsExamObserver'
      },
      candidatesExam: {
        type: Array,
        value: () => {
          return [];
        },
        observer: '_candidatesExamObserver'
      },
      emptyQuestionExams: {
        type: Boolean,
        value: false
      },
      descriptionExam: String,
      nameExam: String,
      selectedPage: {
        type: Number,
        value: 0
      },
      loadingPage: {
        type: Boolean,
        value: true,
        notify: true
      }
    };
  }

  sumIndex(index) {
    return index + 1;
  }

  _questionsExamObserver(newValue) {
    this.set('emptyQuestionExams', !(newValue.length > 0));
  }

  _candidatesExamObserver(newValue) {
    this.set('emptycandidatesExams', !(newValue.length > 0));
  }

  connectedCallback() {
    super.connectedCallback();
    this._getQuestionsForExam();
  }

  loadCandidates() {
    this.loadingPage = true;
    let reference = this.getReference('exam', this.location.params.idExam);
    let searchParams = {
      collection: 'candidateExam',
      queryParamOne: 'referenceExam',
      queryParamConditional: '==',
      queryReference: reference,
      collectionReference: 'candidate',
      referenceOnDoc: 'referenceCandidate'
    };
    this.getAllDataFromCollectionWithReference(searchParams).then(results => {
      this.set('candidatesExam' , results);
    }).finally(() => {
      this.loadingPage = false;
    });
  }

  _getQuestionsForExam() {
    this.loadingPage = true;
    let reference = this.getReference('exam', this.location.params.idExam);
    this.simpleQueryWithReference('questionExam', 'referenceExam', '==', reference)
      .then(results => {
        this.set('questionsExam', results);
      }).finally(() => {
        this.loadingPage = false;
      });
  }

  addNewExam() {
    this.addDocument('exam', {
      name: this.nameExam,
      description: this.descriptionExam
    }).then(results => {
      this.nameExam = '';
      this.descriptionExam = '';
      this.openToast(`Nuevo examen agregado con exito`);
      this._getExams();
    }).catch(error => {
      console.log(error);
    });
    this.$.newExamModal.close();
  }

  eraseExam(e) {
    this.deleteDoc('exam', e.model.exam.id).then(() => {
      this.openToast(`Se borro correctamente el examen ${e.model.exam.data.name}`);
      this._getExams();
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  eraseQuestionData(e) {
    this.deleteDoc('questionExam', e.model.questionExam.id).then(() => {
      this.openToast(`Se borro correctamente la pregunta del examen`);
      this._getQuestionsForExam();
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }
}

window.customElements.define('preview-exam-page', PreviewExamPage);
