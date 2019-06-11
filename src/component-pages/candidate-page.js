import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import 'paper-collapse-item/paper-collapse-item.js'

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
      <paper-dialog id="newAssingExamModal" no-overlap>
        <template is="dom-if" if="[[loadingRequest]]">
          <paper-spinner active></paper-spinner>
        </template>
        <h2>Asignar Examen a [[currentCandidate.data.name]]</h2>
        <paper-dialog-scrollable>
          <paper-dropdown-menu label="Selecciona Examen" horizontal-align="left">
            <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{referenceExam}}" attr-for-selected="data-exam">
              <template is="dom-repeat" items="[[exams]]" as="exam">
                <paper-item data-exam="[[exam.id]]">[[exam.data.name]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
          {{referenceExam}}
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss>Cancelar</paper-button>
          <paper-button autofocus on-click="assingExamToCandidate">Asignar Examen</paper-button>
        </div>
      </paper-dialog>
      
      <paper-dialog id="newCandidate" no-overlap>
        <template is="dom-if" if="[[loadingRequest]]">
          <paper-spinner active></paper-spinner>
        </template>
        <h2>Nuevo Candidato</h2>
        <paper-dialog-scrollable>
            <paper-input value="{{name::input}}" label="Nombre"></paper-input>
            <paper-input value="{{lastName::input}}" label="Apellido Paterno"></paper-input>
            <paper-input value="{{middleName::input}}" label="Apellido Materno"></paper-input>
            <paper-input value="{{description::input}}" label="Descripción"></paper-input>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss>Cancelar</paper-button>
          <paper-button autofocus on-click="addNewCandidate">Guardar Candidato</paper-button>
        </div>
      </paper-dialog>
      
      <paper-card heading="Lista de candidatos">
        <div class="card-actions horizontal flex-end-justified">
          <paper-button on-click="createNewCandidate" class="color">Nuevo Candidato</paper-button>
        </div>
        <div class="card-actions">
          <template is="dom-repeat" items="[[candidates]]" as="candidate">
            <paper-collapse-item header="[[candidate.data.name]] [[candidate.data.lastName]] [[candidate.data.middleName]]">
              <div>
                <paper-input disabled value="[[candidate.id]]"></paper-input>
                <paper-input value="{{candidate.data.name::input}}" label="Nombre"></paper-input>
                <paper-input value="{{candidate.data.lastName::input}}" label="Apellido Paterno"></paper-input>
                <paper-input value="{{candidate.data.middleName::input}}" label="Apellido Materno"></paper-input>
                <paper-input value="{{candidate.data.description::input}}" label="Descripción"></paper-input>
                
              </div>
              <div class="layout horizontal end-justified">
                <paper-button on-click="assingExam">Asignar Examen</paper-button>
                <paper-button on-click="updateProfile">Actualizar</paper-button>
                <paper-button on-click="eraseCandidate">Borrar</paper-button>
              </div>
            </paper-collapse-item>
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
      nameExam: String,
      loadingPage: {
        type: Boolean,
        value: true
      }
    };
  }

  _candidatesObserver(newValue) {
    this.set('emptyCandidates', !(newValue.length > 0));
  }

  connectedCallback() {
    super.connectedCallback();
    this._getCandidates();
    this._getExams();
  }

  _getExams() {
    this.readCollection('exam').then(results => {
      this.set('exams', results);
    }).catch(error => {
      console.log(error);
    });
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
    this.$.newCandidate.close();
  }

  eraseExam(e) {
    this.deleteDoc('exam', e.model.candidate.id).then(() => {
      this.openToast(`Se borro correctamente el candidato ${e.model.exam.data.name}`);
      this._getCandidates();
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  assingExam(e) {
    this.currentCandidate = e.model.candidate;
    this.$.newAssingExamModal.open();
  }

  assingExamToCandidate() {
    let candidateExam = {
      chances: 0,
      evaluation: 0,
      feedback: '',
      tos: false,
      readOnly: false,
      referenceExam: this.getReference('exam', this.referenceExam),
      referenceCandidate: this.getReference('candidate', this.currentCandidate.id)
    };
    // TODO restrict one assignation per exam
    this.addDocument('candidateExam', candidateExam).then(results => {
      this.openToast(`Candidato asignado correctamente al examen seleccionado`);
      this.currentCandidate = undefined;
    }).catch(error => {
      console.log(error);
    });
  }

  createNewCandidate() {
    this.$.newCandidate.open();
  }
}

window.customElements.define('candidate-page', CandidatePage);
