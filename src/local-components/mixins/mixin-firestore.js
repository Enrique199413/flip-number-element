/* @polymerMixin */
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

  _getOnlyFirestoreInstance() {
    return this.firebase.default.firestore;
  }

  addDocument(collection, data) {
    this.loadingRequest = true;
    if (!data.hasOwnProperty('createAt')) {
      data.createAt = new Date();
    }
    data.lastModified = this._getOnlyFirestoreInstance().FieldValue.serverTimestamp();
    return new Promise((resolve, reject) => {
      this._getStore().collection(collection).add(data)
        .then(results => resolve(results))
        .catch(error => reject(error))
        .finally(() => {
          this.loadingRequest = false;
        });
    });
  }

  getBasicReferenceData(collectionResult, collectionReference, idReference, newProperty) {
    return collectionResult.map(doc => {
        return new Promise((resolve, reject) => {
          this.getDoc(collectionReference, doc.data[idReference].id)
          .then(results => {
            doc[newProperty] = results;
            resolve(doc);
          }).catch(error => {
            reject(error);
          });
      })
    })
  }

  getAllDataFromCollectionWithReference(searchParams) {
    return new Promise((resolve, reject) => {
      this.simpleQueryWithReference(searchParams.collection, searchParams.queryParamOne, searchParams.queryParamConditional, searchParams.queryReference)
        .then(collectionResults => {
          resolve(this._deferedMultiplePromiseCollection(collectionResults, searchParams.collectionReference, searchParams.referenceOnDoc));
        }).catch(error => {
          reject(error);
      });
    });
  }

  _deferedMultiplePromiseCollection(collectionResult, collectionReference, idReference, newProperty = `${collectionReference}Data`) {
    return new Promise((resolve, reject) => {
      Promise.all(this.getBasicReferenceData(collectionResult, collectionReference, idReference, newProperty)).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });
  }

  deleteDoc(collection, id) {
    return this._getStore().collection(collection).doc(id).delete();
  }

  getReference(collection, reference) {
    return this._getStore().collection(collection).doc(reference);
  }

  getDoc(collection, idDoc) {
    let referenceDoc = this._getStore().collection(collection).doc(idDoc);
    return new Promise((resolve, reject) => {
      referenceDoc.get().then(doc => {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          reject('no existe el documento');
        }
      }).catch(error => reject(error));
    });
  }

  getDocExist(collection, idDoc) {
    let referenceDoc = this._getStore().collection(collection).doc(idDoc);
    return new Promise((resolve, reject) => {
      referenceDoc.get().then(doc => {
        if (doc.exists) {
          resolve(doc.exists);
        } else {
          reject('Verifica el código de referencia');
        }
      }).catch(error => reject(error));
    });
  }

  simpleQueryWithReference(collection, whereOne, whereTwo, reference) {
    let collectionReference = this._getStore().collection(collection);
    let results = [];
    return new Promise((resolve, reject) => {
      collectionReference.where(whereOne, whereTwo, reference).get().then(querySnapshot => {
        querySnapshot.forEach(doc => results.push({
          id: doc.id,
          data: doc.data()
        }));
        resolve(results);
      }).catch(error => reject(error));
    });
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

  updateDocument(collection, reference, data) {
    if (!data.hasOwnProperty('createdAt') || !data.createdAt) {
      data.createdAt = this._getOnlyFirestoreInstance().FieldValue.serverTimestamp();
    }
    data.lastModified = this._getOnlyFirestoreInstance().FieldValue.serverTimestamp();
    return this._getStore().collection(collection).doc(reference).set(data);
  }
};

export const FireStoreMixin = dedupingMixin(firestoreMixin);
