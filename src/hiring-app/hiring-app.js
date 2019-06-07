import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../local-components/shared-styles/base-style.js'

import '@polymer/iron-icons/iron-icons.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '../component-pages/login-page.js';
import '../local-components/app-components/loading-component.js';

/**
 * @customElement
 * @polymer
 */
class HiringApp extends PolymerElement {
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
        
        #animate-container {
          opacity: 0;
        }
      </style>
      <template is="dom-if" if="[[loading]]">
        <loading-component is-still-loading="{{loading}}" class="layout horizontal center-center"></loading-component>
      </template>
      <template is="dom-if" if="[[!loading]]">
        <div id="animate-container">
          <template is="dom-if" if="[[!login]]">
            <login-page class="layout horizontal center-center"></login-page>
          </template>
          <template is="dom-if" if="[[login]]" restamp>
            <app-drawer-layout>
              <app-drawer slot="drawer" swipe-open>
                <app-toolbar>Options</app-toolbar>
                <paper-listbox>
                  <paper-item>Inbox</paper-item>
                  <paper-item>Starred</paper-item>
                  <paper-item>Sent mail</paper-item>
                </paper-listbox>
              </app-drawer>
              <app-header-layout>
                <app-header slot="header" reveals effects="waterfall">
                  <app-toolbar>
                    <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
                    <div main-title>Hiring App</div>
                  </app-toolbar>
                </app-header>
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
        value: true
      },
      loading: {
        type: Boolean,
        value: true,
        observer: '_loadingChange'
      }
    };
  }

  _loadingChange(newlValue, oldValue) {
    if (!newlValue) {
      setTimeout(() => {
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
      }, 0);
    }
  }
}

window.customElements.define('hiring-app', HiringApp);
