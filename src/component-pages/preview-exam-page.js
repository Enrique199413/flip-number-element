import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/marked-element/marked-element.js';

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
      </style>
      
      <paper-card heading="[[location.params.idExam]]">
        <div class="card-actions">
          <template is="dom-repeat" items="[[questionsExam]]" as="questionExam">
            <div>Pregunta [[sumIndex(index)]] - [[questionExam.id]] <paper-button on-click="eraseQuestionData">Borrar</paper-button></div>
            <div class="layout horizontal">
              <marked-element markdown="[[questionExam.data.question]]">
                <div slot="markdown-html"></div>
              </marked-element>
            </div>
          </template>
          <template is="dom-if" if="[[emptyQuestionExams]]">
            No hay preguntas para este examen
          </template>
        </div>
      </paper-card>
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
      emptyQuestionExams: {
        type: Boolean,
        value: false
      },
      descriptionExam: String,
      nameExam: String
    };
  }

  sumIndex(index) {
    return index + 1;
  }

  _questionsExamObserver(newValue) {
    this.set('emptyQuestionExams', !(newValue.length > 0));
  }

  connectedCallback() {
    super.connectedCallback();
    this._getQuestionsForExam();
  }

  _getQuestionsForExam() {
    let reference = this.getReference('exam', this.location.params.idExam);
    this.simpleQueryWithReference('questionExam', 'referenceExam', '==', reference)
      .then(results => {
        this.set('questionsExam', results);
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
    console.log('Voy a borrar el examen', e.model.exam);
    this.deleteDoc('exam', e.model.exam.id).then(() => {
      this.openToast(`Se borro correctamente el examen ${e.model.exam.data.name}`);
      this._getExams();
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

}

window.customElements.define('preview-exam-page', PreviewExamPage);
