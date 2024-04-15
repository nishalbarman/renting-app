const { FirebaseUtils } = require("firebase-utils");
const { Base64Decode } = require("base64-stream");

const bufferStreamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

class ImageUploadHelper {
  static async uploadBulkImages(filesArray) {
    const promises = filesArray.map(async (imageData) => {
      const bufferStream = new Base64Decode();
      bufferStream.write(
        imageData.base64String.replace(/^data:image\/\w+;base64,/, "")
      );
      bufferStream.end();

      const buffer = await bufferStreamToBuffer(bufferStream);
      return FirebaseUtils.uploadImage(buffer, imageData.type);
    });

    return Promise.all(promises);
  }

  constructor() {}
}

module.exports = { ImageUploadHelper };
