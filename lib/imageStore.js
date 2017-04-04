const s3Store = require('./imageStoreS3');

function saveImage(name, base64String, callback) {
  const imageData = base64String.split('data:image/png;base64,')[1];
  s3Store.save(name, imageData, callback);
}

module.exports.saveImage = saveImage;
