const firebase = require('firebase')
require('firebase/firestore')
require('firebase/auth')

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER,
    appId: process.env.FIREBASE_API_KEY,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export default firebase;