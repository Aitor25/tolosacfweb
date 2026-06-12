/**
 * TOLOSA CF ESKUBALOIA - Firebase Configuration
 * Inicializa Firebase y expone window.db
 */
(function() {
  const cfg = {
    apiKey: "AIzaSyB2mYl__UKQCc90tSEW2dGQ_6D60bO4xuM",
    authDomain: "tolosa-cf-eskubaloia.firebaseapp.com",
    projectId: "tolosa-cf-eskubaloia",
    storageBucket: "tolosa-cf-eskubaloia.firebasestorage.app",
    messagingSenderId: "243368570014",
    appId: "1:243368570014:web:181d7f5f5990014fbf9f8f"
  };
  try {
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      firebase.initializeApp(cfg);
    }
    if (typeof firebase !== 'undefined' && firebase.apps.length) {
      window.db = firebase.firestore();
    }
  } catch(e) {
    console.warn('Firebase init error:', e);
  }
})();
