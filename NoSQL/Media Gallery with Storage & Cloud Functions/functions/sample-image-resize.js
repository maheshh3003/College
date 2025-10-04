/**
 * Sample Cloud Function (Node.js) to resize uploaded images and write metadata to Firestore.
 * Place in functions/index.js and deploy with Firebase Functions.
 * Requires: sharp, firebase-admin
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();

exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  const bucketName = object.bucket;
  const filePath = object.name; // e.g. em-profile/filename.jpg
  const contentType = object.contentType;

  if (!contentType.startsWith('image/')) return null;

  const fileName = filePath.split('/').pop();
  const bucket = storage.bucket(bucketName);
  const tempFilePath = `/tmp/${fileName}`;
  const tempThumbPath = `/tmp/thumb_${fileName}`;

  // download
  await bucket.file(filePath).download({destination: tempFilePath});

  // resize
  await sharp(tempFilePath).resize(320).toFile(tempThumbPath);

  // upload thumbnail
  const thumbPath = filePath.replace(/(.*)\/([^/]+)/, '$1/thumb_$2');
  await bucket.upload(tempThumbPath, { destination: thumbPath, metadata: { contentType } });

  // write metadata to Firestore
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
  await db.collection('media').add({
    name: fileName,
    path: filePath,
    thumb: `https://storage.googleapis.com/${bucketName}/${thumbPath}`,
    contentType,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return null;
});
