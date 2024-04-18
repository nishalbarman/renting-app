require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { getStorage } = require("firebase-admin/storage");
const admin = require("firebase-admin");

const { decryptToString } = require("./secure-file.js");

// const serviceAccount = require("./service-account-key.json");
const secureServiceAccountKeyFileContent = `{"iv":"c833b006bcdf7d060548fa752428c50e","auth_tag":"8b37d31b02dbc6e271a1e755314bf1c6","data":"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"}`; // replace with your file content

const jsonStr = decryptToString(secureServiceAccountKeyFileContent);

const serviceAccount = JSON.parse(jsonStr);

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
