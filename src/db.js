import firebase from 'firebase/app'
import 'firebase/database'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyByfWM6E2oA1d--vxflTPvptpTbrexTFtQ",
    authDomain: "vue-firebase-chat-c88d1.firebaseapp.com",
    projectId: "vue-firebase-chat-c88d1",
    storageBucket: "vue-firebase-chat-c88d1.appspot.com",
    messagingSenderId: "50127681988",
    appId: "1:50127681988:web:abe999fd6491cdf182cc91",
    measurementId: "G-WJ9LB8NK1C"
};
// Initialize Firebase
const db = firebase.initializeApp(firebaseConfig);

export default db;