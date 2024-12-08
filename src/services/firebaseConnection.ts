import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { initializeApp } from "firebase/app";



const firebaseConfig = {
  apiKey: "AIzaSyB1XFPVmOWkxWQoNOX6DMXtnzyAq1oPifM",
  authDomain: "rolotech-cffe6.firebaseapp.com",
  projectId: "rolotech-cffe6",
  storageBucket: "rolotech-cffe6.firebasestorage.app",
  messagingSenderId: "163071565066",
  appId: "1:163071565066:web:700465454f956d6e636ef3"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { db, auth, storage }