/* @polymerMixin */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js'
import * as firebase from "@firebase/app";

let initializedApp = firebase.default.initializeApp({
  apiKey: "AIzaSyCcsFAxipbxNQ14un3vB6JvMZkZi2gSj3I",
  authDomain: "hiring-app-enriquelc.firebaseapp.com",
  databaseURL: "https://hiring-app-enriquelc.firebaseio.com",
  projectId: "hiring-app-enriquelc",
  storageBucket: "hiring-app-enriquelc.appspot.com",
  messagingSenderId: "770555104907",
  appId: "1:770555104907:web:8793cbd1f08c5f15"
});


let firebaseMixin = (superClass) => class extends superClass {
  constructor () {
    super();
    this._initFirebase()
  }

  _initFirebase () {
    this.set('initializeApp', initializedApp);
    this.set('firebase', firebase);
  }

  initializeApp () {
    return this.initializeApp
  }
};

export const FirebaseMixin = dedupingMixin(firebaseMixin);