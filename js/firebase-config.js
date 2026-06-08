// Configuración de Firebase para Tolosa CF Eskubaloia.
// Rellena estos valores con los de tu consola de Firebase
// (Project settings > General > Your apps > SDK setup).
window.firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Inicializa Firebase solo si la librería está disponible y no se ha
// inicializado ya. Esto evita el error "Firebase: No Firebase App
// '[DEFAULT]' has been created" en páginas que no lo necesitan.
try {
  if (typeof firebase !== "undefined" && !firebase.apps.length) {
    firebase.initializeApp(window.firebaseConfig);
  }
} catch (e) {
  console.warn("[firebase-config] No se pudo inicializar Firebase:", e);
}
