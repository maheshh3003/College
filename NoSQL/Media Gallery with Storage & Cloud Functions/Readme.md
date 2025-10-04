# MediaChat — Firebase Media Gallery

This folder contains a small media gallery page that uses Firebase Storage and Firestore. It includes client-side upload, listing, and delete (owner-restricted) operations and writes basic metadata to Firestore.

Files changed/created:
- `index.html` — main page with inline CSS and JS (upload, list, delete, auth).
- `functions/sample-image-resize.js` — example Cloud Function to auto-resize images and write metadata (not deployed).
- `firestore.rules` — example Firestore rules to protect `media` collection.

Quick setup:
1. **Firebase Project Setup**:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication > Sign-in method > Google
   - Enable Firestore Database (start in test mode)
   - Enable Storage (start in test mode)

2. **Get Config**: Go to Project Settings > General > Your apps > Web app config and copy the config values into `index.html` firebaseConfig object.

3. **Deploy Rules**:
   ```bash
   # Install Firebase CLI if needed
   npm install -g firebase-tools
   
   # Login and init in this folder
   firebase login
   firebase init
   # Select Firestore, Storage, and Functions if you want the sample function
   
   # Copy rules files
   cp firestore.rules ./firestore.rules
   cp storage.rules ./storage.rules
   
   # Deploy rules
   firebase deploy --only firestore:rules,storage:rules
   ```

4. **Test Locally**:
   ```bash
   python3 -m http.server 8000
   # Open http://localhost:8000 and sign in to test upload/delete
   ```

Deploy notes:
- To allow client listing/delete, configure Storage rules carefully. Prefer using Cloud Functions to mediate deletions if security is strict.
- The `functions/sample-image-resize.js` demonstrates how to generate thumbnails and write metadata to Firestore. Deploy it to your Firebase Functions environment if you want server-side processing.

Client upload note (metadata.owner)
----------------------------------
When using the Storage rules above, the client must set `metadata.owner` to the user's uid at upload time. Example (compat SDK):

```js
const user = firebase.auth().currentUser;
const ref = firebase.storage().ref().child(`em-profile/${file.name}`);
const metadata = { contentType: file.type, customMetadata: { owner: user.uid } };
ref.put(file, metadata)
	.then(snapshot => snapshot.ref.getDownloadURL())
	.then(url => console.log('uploaded', url));
```

If your client can't set metadata reliably (some mobile SDKs differ), prefer using a Cloud Function or use Firestore to store ownership metadata and perform deletes via a Callable Function.

Security note: This example makes some operations client-side (listAll, delete). In production, prefer server-side validations and stricter security rules.
