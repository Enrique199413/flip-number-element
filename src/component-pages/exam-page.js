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
class ExamPage extends UtilitiesMixin(FireStoreMixin(PolymerElement)) {
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

        a {
          text-decoration: none;
        }
      </style>
      <paper-dialog id="newExamModal" no-overlap>
        <template is="dom-if" if="[[loadingRequest]]">
          <paper-spinner active></paper-spinner>
        </template>
        <h2>Nuevo Examen</h2>
        
        <div class="buttons">
          <paper-button dialog-dismiss>Cancelar</paper-button>
          <paper-button autofocus on-click="addNewExam">Crear Examen</paper-button>
        </div>
      </paper-dialog>
      <paper-card heading="Lista de examenes">
        <div class="card-actions horizontal flex-end-justified">
        <a href="/make-exam" class="paper-item" tabindex="-1">
          <paper-button class="blue-button">Nuevo examen</paper-button>
        </a>
        </div>
        <div class="card-actions">
          <template is="dom-repeat" items="[[exams]]" as="exam">
            <div>
              [[exam.data.name]] [[exam.data.description]]- [[exam.id]]
              <a href="/preview-exam/[[exam.id]]" class="paper-item" tabindex="-1">
                <paper-button on-click="seeExam">Ver Examen</paper-button>
              </a>
              <paper-button on-click="eraseExam">Borrar</paper-button>
            </div>
          </template>
          <template is="dom-if" if="[[emptyExams]]">
            VACAIS
          </template>
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
      emptyExams: {
        type: Boolean,
        value: false
      },
      loadingPage: {
        type: Boolean,
        value: true,
        notify: true
      },
      descriptionExam: String,
      nameExam: String
    };
  }

  _examsObserver(newValue) {
    this.set('emptyExams', !(newValue.length > 0));
  }

  connectedCallback() {
    super.connectedCallback();
    this._getExams();
  }

  _getExams() {
    this.loadingPage = true;
    this.readCollection('exam').then(results => {
      this.set('exams', results);
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      this.loadingPage = false;
    });
  }

  eraseExam(e) {
    console.log('Voy a borrar el examen', e.model.exam);
    this.deleteDoc('exam', e.model.exam.id).then(() => {
      this.openToast(`Se borro correctamente el examen ${e.model.exam.data.name}`);
      this._getExams();
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    }).finally(() => {
      this.loadingPage = false;
    });
  }

}

window.customElements.define('exam-page', ExamPage);
