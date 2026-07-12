# Configuración Administrativa y Seguridad Avanzada

## 1. Custom Claims para Administradores
Las reglas de Firebase están preparadas para validar si un usuario es administrador mediante `request.auth.token.admin == true`.
**NUNCA ejecutes el siguiente script en el navegador del cliente.**
Debes ejecutarlo en un entorno seguro (Node.js en tu equipo o Cloud Functions) usando el SDK de Firebase Admin y una clave de servicio.

### Script Seguro (Node.js)
Crea un archivo local `setAdmin.js` (fuera del repositorio público):
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./ruta/a/tu/clave/privada.json'); // NO SUBIR A GITHUB

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'AQUI_EL_UID_DE_TU_USUARIO';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Claim de administrador asignado a', uid);
  })
  .catch((error) => console.error(error));
```
**Para forzar la renovación del Token:**
Una vez ejecutado, el usuario debe cerrar sesión en la web y volver a entrar para que el token JWT se renueve e incluya el rol `admin: true`.
**Plan de recuperación:** Si pierdes acceso, simplemente vuelve a generar una clave de servicio desde tu consola y ejecuta el script con el UID del nuevo administrador.

## 2. Configuración de Firebase App Check
App Check protege tus bases de datos bloqueando el tráfico que no provenga de tu aplicación real.
**No lo actives en modo "Obligatorio" (Enforcement) todavía.**

**Fases de Implantación:**
1. Ve a la consola de Firebase > App Check.
2. Registra tu aplicación usando **reCAPTCHA v3** (Enterprise si aplica) para la web.
3. El código HTML ya está preparado para integrarlo, pero debes añadir la clave del sitio en tu `firebase-config.js` cuando vayas a habilitarlo:
   `const appCheck = firebase.appCheck();`
   `appCheck.activate('TU_RECAPTCHA_SITE_KEY', true);`
4. Revisa las métricas en la consola. Solo cuando el tráfico "No verificado" sea nulo o sospechoso, pulsa "Enforce" para bloquear.

## 3. Despliegue de Reglas de Seguridad
Se han generado dos archivos locales: `firestore.rules` y `storage.rules`.
Antes de publicarlas mediante Firebase CLI o la consola:
1. Revisa las reglas actuales en Firebase Console.
2. Compara el uso de tus colecciones.
3. Usa el simulador (Rules Playground) para garantizar que puedes seguir leyendo y escribiendo como administrador.
