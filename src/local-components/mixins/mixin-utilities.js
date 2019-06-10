/* @polymerMixin */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js'
let toastElement;
let utilitiesMixin = (superClass) => class extends superClass {
  static get properties() {
    return {
      toast: {
        type: Object
      },
      toastMessage: String
    }
  }
  connectedCallback () {
    super.connectedCallback();
    this._initToast();
  }

  _initToast() {
    if (this.$.hiringAppToast) {
      toastElement = this.$.hiringAppToast;
    }
  }

  openToast(message) {
    toastElement.show(message);
  }
};

export const UtilitiesMixin = dedupingMixin(utilitiesMixin);