import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/marked-element/marked-element.js';


import {FireStoreMixin} from '../local-components/mixins/mixin-firestore.js';
import {UtilitiesMixin} from '../local-components/mixins/mixin-utilities';
/**
 * @customElement
 * @polymer
 */
class CreateTestPage extends UtilitiesMixin(FireStoreMixin(PolymerElement)) {
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
        
        [slot="markdown-html"] p {
          color: red;
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
      </style>
      <paper-dialog id="newExamModal" no-overlap>
        <template is="dom-if" if="[[loadingRequest]]">
          <paper-spinner active></paper-spinner>
        </template>
        <h2>Nuevo Examen</h2>
        <paper-dialog-scrollable>
          <paper-input label="Nombre del examen" value="{{nameExam::input}}"></paper-input>
          <paper-input label="Descripcion del examen" value="{{descriptionExam::input}}"></paper-input>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss>Cancelar</paper-button>
          <paper-button autofocus on-click="addNewExam">Crear Examen</paper-button>
        </div>
      </paper-dialog>
      <paper-card heading="Paso 1 - crea tu examen">
        <div class="card-actions">
          <paper-input label="Nombre del examen" value="{{nameExam::input}}"></paper-input>
          <paper-input label="Descripcion del examen" value="{{descriptionExam::input}}"></paper-input>
          <paper-button on-click="addNewExam">Siguiente</paper-button>
        </div>
      </paper-card>
      <paper-card heading="Paso 2 - Elige un examen">
        <div class="card-actions layout vertical">
          <paper-dropdown-menu label="Examen" horizontal-align="left">
            <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{referenceExam}}" attr-for-selected="data-exam">
              <template is="dom-repeat" items="[[exams]]" as="exam">
                <paper-item data-exam="[[exam.id]]">[[exam.data.name]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
          <div class="layout horizontal">
            <paper-button>Siguiente</paper-button>
          </div>
        </div>
      </paper-card>
      <paper-card heading="Paso 3 - Crea tus preguntas">
        <div class="card-actions layout vertical">
          <div class="layout horizontal">
            <paper-button on-click="addQuestionToExam">Agregar Pregunta</paper-button>
          </div>
          <template is="dom-repeat" items="[[questions]]" as="question">
            <paper-radio-group selected="{{question.referenceType}}">
              <template is="dom-repeat" items="[[questionTypes]]" as="questionType">
                <paper-radio-button name="[[questionType.id]]">[[questionType.data.questionType]]</paper-radio-button>
              </template>
            </paper-radio-group>
            <paper-textarea label="Pregunta" value="{{question.question::input}}"></paper-textarea>
            <div class="layout horizontal">
              <marked-element markdown="{{question.question}}">
                <div slot="markdown-html"></div>
              </marked-element>
            </div>
          </template>
          <div class="layout horizontal">
            <paper-button on-click="sendQuestions">Finalizar preguntas del examen</paper-button>
          </div>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      exams: {
        type: Array,
        value: () => {
          return [];
        },
        observer: '_examsObserver'
      },
      questionTypes: {
        type: Array,
        value: () => {
          return [];
        },
        observer: '_questionTypesObserver'
      },
      questions: {
        type: Array,
        value: () => {
          return [];
        }
      },
      emptyExams: {
        type: Boolean,
        value: false
      },
      descriptionExam: String,
      nameExam: String
    };
  }

  _examsObserver(newValue) {
    this.set('emptyExams', !(newValue.length > 0));
  }
  _questionTypesObserver(newValue) {
    this.set('emptyTypes', !(newValue.length > 0));
  }

  static get observers() {
    return ['_observedQuestions(questions.*)'];
  }

  connectedCallback() {
    super.connectedCallback();
    this._getExams();
    this._getQuestionType();
  }

  _observedQuestions(questions) {
    console.log(questions);
  }

  _getExams() {
    this.readCollection('exam').then(results => {
      this.set('exams', results);
    }).catch(error => {
      console.log(error);
    });
  }

  _getQuestionType() {
    this.readCollection('questionType').then(results => {
      this.set('questionTypes', results);
    }).catch(error => {
      console.log(error);
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
  }

  sendQuestions() {
    this.questions.map(question => {
      question.referenceType = this.getReference('questionType', question.referenceType);
        this.addDocument('questionExam', question).then(results => {
          this.openToast(`Pregunta agregada con exito`);
          this.set('questions', []);
        }).catch(error => {
          console.log(error);
        });
    });
  }

  addQuestionToExam() {
    this.push('questions', {
      referenceExam: this.getReference('exam', this.referenceExam),
      referenceType: this.referenceType,
      question: this.question
    });
  }

}

window.customElements.define('create-test-page', CreateTestPage);
