const { v4: uuidv4 } = require('uuid');
const { initializeApp, credential } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require('./service-account-key.json');

initializeApp({
  credential: credential.cert(serviceAccount),
});

const storage = getStorage();

const bucket = storage.bucket('crafter-ecommerce.appspot.com');

async function uploadImage(buffer, file) {
  const uniqueFileName = uuidv4();
  const fileReference = bucket.file(`images/products/${uniqueFileName}`);

  const writeFilePromise = new Promise((resolve, reject) => {
    const blobStream = fileReference.createWriteStream({
      resumable: false,
      contentType: file.type,
    });

    blobStream.on('error', (error) => {
      reject(error);
    });

    blobStream.on('finish', async () => {
      await fileReference.makePublic();
      const publicUrl = `https://storage.googleapis.com/crafter-ecommerce.appspot.com/${fileReference.name}`;
      resolve(publicUrl);
    });

    blobStream.end(buffer);
  });

  return writeFilePromise;
}

module.exports = { uploadImage };
