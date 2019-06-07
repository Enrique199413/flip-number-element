import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
/**
 * @customElement
 * @polymer
 */
class LoginPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <paper-card>
        <div class="card-content">
          <paper-input label="Usuario" type="text" value="{{username::value}}"></paper-input>
          <paper-input label="Constrasena" type="password" value="{{password::value}}"></paper-input>
        </div>
        <div class="card-actions">
        <paper-button>Iniciar sesion</paper-button>
        <paper-button>Restaurar contrasena</paper-button>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      username: String,
      password: String
    };
  }
}

window.customElements.define('login-page', LoginPage);
