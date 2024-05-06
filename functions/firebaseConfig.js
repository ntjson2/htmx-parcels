// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const admin = require("firebase-admin");

const firebaseConfig = {
    apiKey: "AIzaSyCPNjyq9AqRaLIgBIUHHRjrhFWV8mzDVw8",
    authDomain: "njflutter-01.firebaseapp.com",
    projectId: "njflutter-01",
    storageBucket: "njflutter-01.appspot.com",
    messagingSenderId: "1008004124285",
    appId: "1:1008004124285:web:8d44bc72804cd4c0e92b14",
    measurementId: "G-WJL5557660"
  };

/*   admin.initializeApp(firebaseConfig);
  const db = admin.firestore();  */ 
  module.exports = { firebaseConfig };  