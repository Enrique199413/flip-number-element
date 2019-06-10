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
class CandidatePage extends UtilitiesMixin(FireStoreMixin(PolymerElement)) {
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
      <paper-dialog id="newExamModal" no-overlap>
        <template is="dom-if" if="[[loadingRequest]]">
          <paper-spinner active></paper-spinner>
        </template>
        <h2>Nuevo Candidato</h2>
        <paper-dialog-scrollable>
          <paper-input label="Nombre del candidato" value="{{name::input}}"></paper-input>
          <paper-input label="Apellido Paterno" value="{{lastName::input}}"></paper-input>
          <paper-input label="Apellido Materno" value="{{middleName::input}}"></paper-input>
          <paper-input label="description" value="{{description::input}}"></paper-input>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss>Cancelar</paper-button>
          <paper-button autofocus on-click="addNewCandidate">Agregar Candidato</paper-button>
        </div>
      </paper-dialog>
      <paper-card heading="Lista de candidatos">
        <div class="card-actions horizontal flex-end-justified">
          <paper-button on-click="openNewExam" class="color">Nuevo Candidato</paper-button>
        </div>
        <div class="card-actions">
          <template is="dom-repeat" items="[[candidates]]" as="candidate">
            <div>[[candidate.data.name]] [[candidate.data.lastName]] [[candidate.data.middleName]] [[candidate.data.description]]- [[candidate.id]] <paper-button on-click="eraseExam">Borrar</paper-button></div>
          </template>
          <template is="dom-if" if="[[emptyCandidates]]">
            VACAIS
          </template>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      candidates: {
        type: Array,
        value: () => {
          return [];
        },
        observer: '_candidatesObserver'
      },
      emptyCandidates: {
        type: Boolean,
        value: false
      },
      descriptionExam: String,
      nameExam: String
    };
  }

  _candidatesObserver(newValue) {
    this.set('emptyCandidates', !(newValue.length > 0));
  }

  connectedCallback() {
    super.connectedCallback();
    this._getCandidates();
  }

  _getCandidates() {
    this.readCollection('candidate').then(results => {
      this.set('candidates', results);
    }).catch(error => {
      console.log(error);
    });
  }

  addNewCandidate() {
    this.addDocument('candidate', {
      name: this.name,
      lastName: this.lastName,
      middleName: this.middleName,
      description: this.description,
    }).then(results => {
      this.nameExam = '';
      this.descriptionExam = '';
      this.openToast(`Nuevo candidato agregado con exito`);
      this._getCandidates();
    }).catch(error => {
      console.log(error);
    });
    this.$.newExamModal.close();
  }

  eraseExam(e) {
    this.deleteDoc('exam', e.model.candidate.id).then(() => {
      this.openToast(`Se borro correctamente el candidato ${e.model.exam.data.name}`);
      this._getCandidates();
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  openNewExam() {
    this.$.newExamModal.open();
  }

}

window.customElements.define('candidate-page', CandidatePage);
