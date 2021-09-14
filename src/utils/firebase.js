import firebase from "firebase";

const firebaseConfig = {
  apiKey: "",
  authDomain: "fnsku-label-generator.firebaseapp.com",
  databaseURL: "https://fnsku-label-generator-default-rtdb.firebaseio.com",
  projectId: "fnsku-label-generator",
  storageBucket: "fnsku-label-generator.appspot.com",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

firebase.initializeApp(firebaseConfig);

export default firebase;
