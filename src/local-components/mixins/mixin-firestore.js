import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js'
import { FirebaseMixin } from './mixin-firebase.js';

import "@firebase/firestore";

let firestoreMixin = (superClass) => class extends FirebaseMixin(superClass) {
  static get properties() {
    return {
      results: {
        type: Array,
        value: () => {
          return [];
        }
      }
    };
  }

  constructor () {
    super();
  }

  _getStore() {
    return this.firebase.default.firestore();
  }

  addDocument(collection, data) {
    this.loadingRequest = true;
    return new Promise((resolve, reject) => {
      this._getStore().collection(collection).add(data)
        .then(results => resolve(results))
        .catch(error => reject(error))
        .finally(() => {
          this.loadingRequest = false;
        });
    });
  }

  deleteDoc(collection, id) {
    return this._getStore().collection(collection).doc(id).delete();
  }

  readCollection(collection) {
    let results = [];
    return new Promise((resolve, reject) => {
      this._getStore().collection(collection).get().then(querySnapshot => {
        querySnapshot.forEach(doc => results.push({
          id: doc.id,
          data: doc.data()
        }));
        resolve(results);
      }).catch(error => reject(error));
    });
  }
};

export const FireStoreMixin = dedupingMixin(firestoreMixin);