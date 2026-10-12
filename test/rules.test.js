// Reglas de seguridad de Firestore y Storage: se prueban contra los emuladores de Firebase.
// Ejecutar con:  npm run test:rules   (necesita Java 17+ y los emuladores de firebase-tools)
const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { doc, getDoc, getDocs, collection, addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } = require('firebase/firestore');
const { ref, uploadBytes, getBytes, deleteObject } = require('firebase/storage');
const fs = require('fs');

const ADMIN_EMAIL = 'agarciah10@gmail.com';
let env;
beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'tolosa-rules-test',
    firestore: { rules: fs.readFileSync('firestore.rules', 'utf8') },
    storage:   { rules: fs.readFileSync('storage.rules', 'utf8') },
  });
});
afterAll(async () => { await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); await env.clearStorage(); });

const anon   = () => env.unauthenticatedContext();
const user   = () => env.authenticatedContext('u1', { email: 'otra@persona.com', email_verified: true });
const admin  = () => env.authenticatedContext('a1', { email: ADMIN_EMAIL, email_verified: true });
const adminUnverified = () => env.authenticatedContext('a2', { email: ADMIN_EMAIL, email_verified: false });
const validMsg = () => ({ name:'Ana', email:'ana@x.com', subject:'Hola', message:'Mensaje', timestamp: serverTimestamp() });

describe('Firestore: colecciones públicas', () => {
  const PUBLIC = ['news','teams','players','staff','sponsors','baseTeams','competitions','settings'];
  test.each(PUBLIC)('lectura anónima OK en %s', async (c) => {
    await assertSucceeds(getDocs(collection(anon().firestore(), c)));
  });
  test.each(PUBLIC)('escritura anónima DENEGADA en %s', async (c) => {
    await assertFails(addDoc(collection(anon().firestore(), c), { x: 1 }));
  });
  test.each(PUBLIC)('escritura de usuario no admin DENEGADA en %s', async (c) => {
    await assertFails(addDoc(collection(user().firestore(), c), { x: 1 }));
  });
  test.each(PUBLIC)('escritura del admin OK en %s', async (c) => {
    await assertSucceeds(addDoc(collection(admin().firestore(), c), { x: 1 }));
  });
  test('borrado anónimo denegado / admin OK', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => { await setDoc(doc(ctx.firestore(), 'news/n1'), { title: 't' }); });
    await assertFails(deleteDoc(doc(anon().firestore(), 'news/n1')));
    await assertSucceeds(deleteDoc(doc(admin().firestore(), 'news/n1')));
  });
});

describe('Firestore: mensajes de contacto', () => {
  test('anónimo puede crear un mensaje válido', async () => {
    await assertSucceeds(addDoc(collection(anon().firestore(), 'messages'), validMsg()));
  });
  test('anónimo NO puede leer mensajes', async () => {
    await assertFails(getDocs(collection(anon().firestore(), 'messages')));
  });
  test('usuario cualquiera NO puede leer mensajes', async () => {
    await assertFails(getDocs(collection(user().firestore(), 'messages')));
  });
  test('admin SÍ puede leer y borrar mensajes', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => { await setDoc(doc(ctx.firestore(), 'messages/m1'), { name:'a', email:'b', subject:'', message:'x' }); });
    await assertSucceeds(getDocs(collection(admin().firestore(), 'messages')));
    await assertSucceeds(deleteDoc(doc(admin().firestore(), 'messages/m1')));
  });
  test('anónimo NO puede modificar/borrar mensajes', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => { await setDoc(doc(ctx.firestore(), 'messages/m1'), { name:'a', email:'b', subject:'', message:'x' }); });
    await assertFails(updateDoc(doc(anon().firestore(), 'messages/m1'), { message: 'hack' }));
    await assertFails(deleteDoc(doc(anon().firestore(), 'messages/m1')));
  });
  test('campo extra DENEGADO', async () => {
    await assertFails(addDoc(collection(anon().firestore(), 'messages'), { ...validMsg(), isAdmin: true }));
  });
  test('falta un campo obligatorio DENEGADO', async () => {
    const m = validMsg(); delete m.email;
    await assertFails(addDoc(collection(anon().firestore(), 'messages'), m));
  });
  test('nombre vacío / mensaje vacío DENEGADO', async () => {
    await assertFails(addDoc(collection(anon().firestore(), 'messages'), { ...validMsg(), name: '' }));
    await assertFails(addDoc(collection(anon().firestore(), 'messages'), { ...validMsg(), message: '' }));
  });
  test('mensaje de 5001 caracteres DENEGADO / 5000 OK', async () => {
    await assertFails(addDoc(collection(anon().firestore(), 'messages'), { ...validMsg(), message: 'a'.repeat(5001) }));
    await assertSucceeds(addDoc(collection(anon().firestore(), 'messages'), { ...validMsg(), message: 'a'.repeat(5000) }));
  });
  test('tipos incorrectos DENEGADOS', async () => {
    await assertFails(addDoc(collection(anon().firestore(), 'messages'), { ...validMsg(), name: 123 }));
  });
  test('timestamp falsificado (no es request.time) DENEGADO', async () => {
    await assertFails(addDoc(collection(anon().firestore(), 'messages'), { ...validMsg(), timestamp: new Date('2020-01-01') }));
  });
});

describe('Firestore: cualquier otra colección', () => {
  test.each(['users','admins','foo'])('%s: lectura/escritura denegada incluso al admin', async (c) => {
    await assertFails(getDocs(collection(anon().firestore(), c)));
    await assertFails(getDocs(collection(admin().firestore(), c)));
    await assertFails(addDoc(collection(admin().firestore(), c), { x: 1 }));
  });
});

describe('Endurecimiento: email no verificado', () => {
  test('INFO: ¿admin con email NO verificado puede escribir?', async () => {
    let allowed = true;
    try { await assertSucceeds(addDoc(collection(adminUnverified().firestore(), 'news'), { x: 1 })); } catch (e) { allowed = false; }
    console.log('Admin con email_verified=false puede escribir:', allowed);
  });
});

const png = () => new Uint8Array([137,80,78,71,13,10,26,10]);
describe('Storage', () => {
  test('lectura pública OK', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => { await uploadBytes(ref(ctx.storage(), 'news/a.png'), png(), { contentType: 'image/png' }); });
    await assertSucceeds(getBytes(ref(anon().storage(), 'news/a.png')));
  });
  test('escritura anónima DENEGADA', async () => {
    await assertFails(uploadBytes(ref(anon().storage(), 'news/x.png'), png(), { contentType: 'image/png' }));
    await assertFails(uploadBytes(ref(anon().storage(), 'sponsors/x.png'), png(), { contentType: 'image/png' }));
  });
  test('usuario no admin DENEGADO', async () => {
    await assertFails(uploadBytes(ref(user().storage(), 'news/x.png'), png(), { contentType: 'image/png' }));
  });
  test('admin puede subir PNG/JPEG/WEBP', async () => {
    await assertSucceeds(uploadBytes(ref(admin().storage(), 'news/x.png'), png(), { contentType: 'image/png' }));
    await assertSucceeds(uploadBytes(ref(admin().storage(), 'players/y.jpg'), png(), { contentType: 'image/jpeg' }));
  });
  test('admin NO puede subir SVG/HTML/exe', async () => {
    await assertFails(uploadBytes(ref(admin().storage(), 'news/x.svg'), png(), { contentType: 'image/svg+xml' }));
    await assertFails(uploadBytes(ref(admin().storage(), 'news/x.html'), png(), { contentType: 'text/html' }));
    await assertFails(uploadBytes(ref(admin().storage(), 'news/x.exe'), png(), { contentType: 'application/x-msdownload' }));
  });
  test('borrado: anónimo y usuario normal DENEGADO / admin OK', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => { await uploadBytes(ref(ctx.storage(), 'players/a.png'), png(), { contentType: 'image/png' }); });
    await assertFails(deleteObject(ref(anon().storage(), 'players/a.png')));
    await assertFails(deleteObject(ref(user().storage(), 'players/a.png')));
    await assertSucceeds(deleteObject(ref(admin().storage(), 'players/a.png')));
  });
  test('sobrescribir (update) con un archivo no imagen DENEGADO', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => { await uploadBytes(ref(ctx.storage(), 'news/b.png'), png(), { contentType: 'image/png' }); });
    await assertFails(uploadBytes(ref(admin().storage(), 'news/b.png'), png(), { contentType: 'text/html' }));
  });
  test('admin NO puede subir >5MB', async () => {
    await assertFails(uploadBytes(ref(admin().storage(), 'news/big.png'), new Uint8Array(5*1024*1024+10), { contentType: 'image/png' }));
  });
});
