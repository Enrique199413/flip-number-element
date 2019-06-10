import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../local-components/shared-styles/base-style.js';

import {Router} from '@vaadin/router';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '../component-pages/exam-page.js';
import '../component-pages/candidate-page.js';
import '../component-pages/create-test-page.js';
import '../component-pages/config-page.js';
import '../component-pages/preview-exam-page.js';
import '../local-components/app-components/loading-component.js';
import {UtilitiesMixin} from '../local-components/mixins/mixin-utilities';

/**
 * @customElement
 * @polymer
 */
class HiringApp extends UtilitiesMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="base-style iron-flex iron-flex-alignment">
        :host {
          margin: 0;
          font-family: sans-serif;
          background-color: #f1f1f1;
        }
        paper-item {
          cursor: pointer;
        }
        app-header {
          background-color: var(--base-color);
          color: #fff;
        }
        paper-icon-button {
          --paper-icon-button-ink-color: white;
        }
        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }
        paper-progress {
          --paper-progress-active-color: var(--base-color);
          --paper-progress-secondary-color: var(--base-color-light);
          width: 100%;
        }
        a {
          text-decoration: none;
          color: black;
          outline: none;
        }
        .main-center {
          height: 100vh;
        }
        
        #main {
          margin-top: 1rem;
          margin-right: 1rem;
          margin-left: 1rem;
        }
      </style>
      <paper-toast id="hiringAppToast"></paper-toast>
      <template is="dom-if" if="[[loading]]">
        <loading-component is-still-loading="{{loading}}" class="layout horizontal center-center main-center"></loading-component>
      </template>
      <template is="dom-if" if="[[!loading]]">
        <div id="animate-container">
          <template is="dom-if" if="[[!login]]">
            <login-page class="layout horizontal center-center"></login-page>
          </template>
          <template is="dom-if" if="[[login]]" restamp>
            <app-drawer-layout>
              <app-drawer slot="drawer" swipe-open>
                <template is="dom-if" if="[[innerLoading]]">
                  <div class="layout horizontal center-center main-center">
                    <paper-spinner active></paper-spinner>
                  </div>
                </template>
                <template is="dom-if" if="[[!innerLoading]]">
                  <app-toolbar>Menu</app-toolbar>
                  <paper-listbox selected="{{selectedItem}}" attr-for-selected="data-name">
                    <template is="dom-repeat" items="[[urls]]" as="url">
                      <template is="dom-if" if="[[validName(url.name)]]">
                        <a href="[[url.path]]" data-name="[[url.name]]" class="paper-item" tabindex="-1">
                          <paper-item>[[url.name]]</paper-item>
                        </a>
                      </template>
                    </template>
                  </paper-listbox>
                </template>
              </app-drawer>
              <app-header-layout>
                <app-header slot="header" reveals effects="waterfall">
                  <app-toolbar>
                    <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
                    <div main-title>{{selectedItem}}</div>
                    <template is="dom-if" if="[[innerLoading]]">
                      <paper-progress indeterminate$="[[innerLoading]]" bottom-item></paper-progress>         
                    </template>
                  </app-toolbar>
                </app-header>
                <div id="main" class="layout horizontal center-center">
                </div>
              </app-header-layout>
            </app-drawer-layout>
          </template>
        </div>
      </template>
    `;
  }

  static get properties() {
    return {
      login: {
        type: Boolean,
        value: true,
      },
      loading: {
        type: Boolean,
        value: true,
        observer: '_loadingChange',
      },
      selectedItem: {
        type: String
      }
    };
  }

  validName(name) {
    return name !== undefined;
  }

  _loadingChange(newlValue, oldValue) {
    if (!newlValue) {
      // TODO solve animations
      /*setTimeout(() => {
        const animation = this.shadowRoot.querySelector('#animate-container').
            animate([
                  {transform: 'translateY(100%)', opacity: 1, easing: 'ease-out'},
                  {transform: 'translateY(0)', opacity: 1, easing: 'ease-in'},
                  {transform: 'translateY(0)', opacity: 1},
                ],
                {
                  duration: 200,
                });
        this.shadowRoot.querySelector('#animate-container').style.opacity = '1';
      }, 0);*/
      this._getValuesFromSecurity().then(urls => {
        this.set('urls', urls);
        this.set('selectedItem', this.urls[0].name);
        window.href = this.urls[0].path;
        const main = this.shadowRoot.querySelector('#main');
        const router = new Router(main);
        router.setRoutes(urls);
      });
    }
  }

  _getValuesFromSecurity() {
    this.innerLoading = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.innerLoading = false;
        resolve([
          {path: '/', redirect: '/exams'},
          {name: 'Examenes', path: '/exams', component: 'exam-page'},
          {name: 'Candidatos', path: '/candidates', component: 'candidate-page'},
          {name: 'Configuracion', path: '/config', component: 'config-page'},
          {path: '/make-exam', component: 'create-test-page'},
          {path: '/preview-exam/:idExam', component: 'preview-exam-page'},
        ]);
      }, 1000);
    });
  }
}

window.customElements.define('hiring-app', HiringApp);
