
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * NEURAL LINK CALIBRATION
 * Configured with User-Provided Citadel Credentials
 */
const firebaseConfig = {
  apiKey: "AIzaSyDpeTin3Im2yXlNAhKnb1QFB_DkgGLo1nk",
  authDomain: "lifequest-rpg-d5d36.firebaseapp.com",
  projectId: "lifequest-rpg-d5d36",
  storageBucket: "lifequest-rpg-d5d36.firebasestorage.app",
  messagingSenderId: "26843424154",
  appId: "1:26843424154:web:97dfe3ad7116d5abd0c623",
  measurementId: "G-RQLNQM8ERE"
};

// Shield Validation
const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

let app;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

if (isConfigValid) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    
    console.debug("NEURAL LINK: Citadel Link Established.");
  } catch (error) {
    console.error("NEURAL LINK: Calibration failed.", error);
  }
}

export { auth, db, googleProvider, isConfigValid };
