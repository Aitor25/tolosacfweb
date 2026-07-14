const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "tolosa-cf-eskubaloia-test",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
    storage: {
      rules: fs.readFileSync("storage.rules", "utf8"),
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.clearStorage();
});

describe("Firestore Security Rules", () => {
  it("allows anonymous users to read public collections (news, teams)", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertSucceeds(unauthed.firestore().collection("news").get());
    await assertSucceeds(unauthed.firestore().collection("teams").doc("senior").get());
  });

  it("denies anonymous users from writing to public collections", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(unauthed.firestore().collection("news").add({ title: "Hack" }));
  });

  it("denies authenticated users WITHOUT claim from writing", async () => {
    const authed = testEnv.authenticatedContext("user123");
    await assertFails(authed.firestore().collection("news").add({ title: "Hack" }));
  });

  it("allows Admin to write to public collections", async () => {
    const admin = testEnv.authenticatedContext("admin123", { admin: true });
    await assertSucceeds(admin.firestore().collection("news").add({ title: "Valid Title" }));
  });

  it("denies Admin from writing invalid types/missing fields", async () => {
    const admin = testEnv.authenticatedContext("admin123", { admin: true });
    // Title is required to be a string
    await assertFails(admin.firestore().collection("news").add({ title: 123 }));
    // Unrecognized fields
    await assertFails(admin.firestore().collection("news").add({ title: "Title", malicious_field: "yes" }));
  });
});

describe("Storage Security Rules", () => {
  it("allows anonymous read", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    const ref = unauthed.storage().ref("news/image.jpg");
    // Actually getDownloadURL fails in emulator if object doesn't exist, but it doesn't fail due to PERMISSION_DENIED.
    // Instead of getDownloadURL, we can just assert it doesn't fail with PERMISSION_DENIED.
    // However, storage rules test syntax requires reading metadata or putting.
    await assertSucceeds(ref.getMetadata().catch(e => {
        if(e.code === 'storage/object-not-found') return true;
        throw e;
    }));
  });

  it("denies anonymous write", async () => {
    const unauthed = testEnv.unauthenticatedContext();
    const ref = unauthed.storage().ref("news/image.jpg");
    await assertFails(ref.put(Buffer.from('test')));
  });

  it("allows Admin to write valid image", async () => {
    const admin = testEnv.authenticatedContext("admin123", { admin: true });
    const ref = admin.storage().ref("news/image.jpg");
    await assertSucceeds(ref.put(Buffer.from('test'), { contentType: 'image/jpeg' }));
  });

  it("denies Admin from writing non-image files (MIME restriction)", async () => {
    const admin = testEnv.authenticatedContext("admin123", { admin: true });
    const ref = admin.storage().ref("news/malicious.exe");
    await assertFails(ref.put(Buffer.from('test'), { contentType: 'application/x-msdownload' }));
  });
});
