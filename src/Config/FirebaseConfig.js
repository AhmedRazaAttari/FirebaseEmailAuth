import firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB16LJnFIBqUOc6gwvyCxAmcP0ioaw7nlA",
    authDomain: "vidoe-51f03.firebaseapp.com",
    projectId: "vidoe-51f03",
    databaseURL: "https://vidoe-51f03-default-rtdb.firebaseio.com/",
    storageBucket: "vidoe-51f03.appspot.com",
    messagingSenderId: "274948567042",
    appId: "1:274948567042:web:4fd2ca39783e3f7163b71b"
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export default fire;