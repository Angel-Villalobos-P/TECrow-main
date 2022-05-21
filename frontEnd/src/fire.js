import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAaqAKUVpW0tt3W_g6LAZGiUh7cWAhh0lg",
    authDomain: "tecrow-c2e6f.firebaseapp.com",
    databaseURL: "https://tecrow-c2e6f-default-rtdb.firebaseio.com",
    projectId: "tecrow-c2e6f",
    storageBucket: "tecrow-c2e6f.appspot.com",
    messagingSenderId: "558237359524",
    appId: "1:558237359524:web:b56339b970393812fa7531",
    measurementId: "G-ZQM0B4SP6Y"
  };

  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack);
    }
  }
  
  const fire = firebase;
  export default fire;