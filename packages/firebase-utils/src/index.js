const { v4: uuidv4 } = require("uuid");
const { getStorage } = require("firebase-admin/storage");
const admin = require("firebase-admin");

const serviceAccount = require("./service-account-key.json");

console.log(serviceAccount);

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const storage = getStorage();

const bucket = storage.bucket("crafter-ecommerce.appspot.com");

class FirebaseUtils {
  static async uploadImage(buffer, type) {
    const uniqueFileName = uuidv4();
    const fileReference = bucket.file(
      `renting/images/products/${uniqueFileName}`
    );

    const writeFilePromise = new Promise((resolve, reject) => {
      const blobStream = fileReference.createWriteStream({
        resumable: false,
        contentType: type,
      });

      console.log("Content Type -->", type);

      blobStream.on("error", (error) => {
        reject(error);
      });

      blobStream.on("finish", async () => {
        await fileReference.makePublic();
        const publicUrl = `https://storage.googleapis.com/crafter-ecommerce.appspot.com/${fileReference.name}`;
        resolve(publicUrl);
      });

      blobStream.end(buffer);
    });

    return writeFilePromise;
  }

  constructor() {}
}

module.exports = { FirebaseUtils };
