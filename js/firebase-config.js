/**
 * TOLOSA CF ESKUBALOIA - Firebase Configuration
 * Claves reales inline para que funcione en GitHub Pages sin archivos externos.
 */
const _fbConfig = {
  apiKey: "AIzaSyB2mYl__UKQCc90tSEW2dGQ_6D60bO4xuM",
  authDomain: "tolosa-cf-eskubaloia.firebaseapp.com",
  projectId: "tolosa-cf-eskubaloia",
  storageBucket: "tolosa-cf-eskubaloia.firebasestorage.app",
  messagingSenderId: "243368570014",
  appId: "1:243368570014:web:181d7f5f5990014fbf9f8f"
};

try {
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(_fbConfig);
    window.db = firebase.firestore();
    if (typeof firebase.auth !== 'undefined') window.auth = firebase.auth();
    console.log('Firebase inicializado correctamente.');
  }
} catch(e) {
  console.warn('Firebase init error:', e);
}
