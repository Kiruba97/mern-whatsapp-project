import {initializeApp} from "firebase/app"
import {getAuth, GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyCCSez700CthJ8s47mdVLL4W6_sqkGKIOE",
    authDomain: "mern-whatsapp-76524.firebaseapp.com",
    projectId: "mern-whatsapp-76524",
    storageBucket: "mern-whatsapp-76524.appspot.com",
    messagingSenderId: "461142629570",
    appId: "1:461142629570:web:daa8f9f6d7dc4241aaef5b"
  };


  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  export {app, auth, provider};

  