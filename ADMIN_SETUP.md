# Administración, reglas de seguridad y despliegue

## Quién es administrador

El panel (`admin.html`) usa Firebase Authentication. El **único administrador** es la cuenta de Google
`agarciah10@gmail.com`: ese correo está escrito en `firestore.rules` y `storage.rules` (función `isAdmin()`).

Para cambiar de administrador, edita el correo en **ambos** ficheros y despliega las reglas:

```bash
firebase deploy --only firestore:rules,storage --project tolosa-cf-eskubaloia
```

Mantén activada la **verificación en dos pasos** en esa cuenta de Google: es la llave de toda la escritura de la web.

## Qué permiten las reglas

| Recurso | Lectura | Escritura |
|---|---|---|
| `news`, `teams`, `players`, `staff`, `sponsors`, `baseTeams`, `competitions`, `settings` | pública | solo administrador |
| `messages` (formulario de contacto) | solo administrador | cualquiera puede **crear** un mensaje con forma y tamaño válidos; nadie más puede leer, editar ni borrar |
| cualquier otra colección | nadie | nadie |
| Storage (imágenes) | pública | solo administrador; solo PNG/JPEG/WebP/GIF de menos de 5 MB; borrar solo administrador |

Importante: **lectura pública significa que cualquiera puede consultar esos datos** directamente por la API de Firebase,
aunque la web no los muestre (por ejemplo, las noticias marcadas como "ocultas" siguen siendo legibles). No guardes ahí
nada que no deba ser público.

## Pruebas de las reglas

`test/rules.test.js` prueba las reglas contra los emuladores de Firebase (necesita Java 17 o superior):

```bash
npm install
npm run test:rules
```

## Al cambiar de dominio

1. **GitHub Pages**: Settings → Pages → Custom domain, y marcar *Enforce HTTPS*. Debe existir el fichero `CNAME` en la raíz.
2. **Firebase Authentication**: Authentication → Settings → *Authorized domains* → añadir el dominio nuevo (si no, el
   inicio de sesión del panel falla en el dominio nuevo).
3. **EmailJS**: si en su panel hay restricción de dominios permitidos, añadir el dominio nuevo (si no, el formulario de contacto deja de enviar correos).
4. **Clave de API de Firebase** (Google Cloud Console → APIs y servicios → Credenciales): si tiene restricción por referente HTTP, añadir el dominio nuevo.
5. **LightWidget** (Instagram): si el widget tiene restricción de dominios, añadir el dominio nuevo.
6. El dominio actual es `tolosacfeskubaloia.es`. Si algún día cambia, hay que sustituirlo en `CNAME`, `robots.txt`, `sitemap.xml`, el JSON-LD de `index.html` y las etiquetas `canonical`, `og:url`, `og:image` y `twitter:image` de todas las páginas.

## Recomendaciones opcionales

- **Firebase App Check** (reCAPTCHA v3) para que solo la web real pueda llamar a Firestore, y **alertas de presupuesto** en
  Google Cloud, para que un abuso del formulario de contacto no pueda generar gasto ni llenar la bandeja de entrada.
- Si el administrador entra siempre con Google, se puede endurecer `isAdmin()` exigiendo además
  `request.auth.token.email_verified == true`.
