import { v4 as uuidv4 } from "uuid";
import { getStorage } from "firebase-admin/storage";
import admin from "firebase-admin";

import { decryptToString } from "./secure-file.js";

// const serviceAccount = require("./service-account-key.json");
const secureServiceAccountKeyFile = "./service-account-key.json.secure";
const jsonStr = decryptToString(secureServiceAccountKeyFile);
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

export { FirebaseUtils };
