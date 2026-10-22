# Firebase Storage Configuration

To use Firebase Storage in this application, you need a Firebase project with Cloud Storage enabled.

## Environment Variables

Add the following to your `.env` file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
# Path to the service-account-file.json
FIREBASE_CREDENTIALS=storage/app/firebase-auth.json
```

## Setup Instructions

1. **Firebase Console**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or select an existing one.
   - Go to **Build** -> **Storage** and click **Get Started**.
   - Choose your storage location and start in **Production Mode**.

2. **Service Account**:
   - Go to **Project Settings** (gear icon) -> **Service accounts**.
   - Click **Generate new private key**.
   - Download the `.json` file.
   - Place this file in `storage/app/firebase-auth.json` (Ensure this path is NOT committed to Git).

3. **Storage Rules**:
   - To allow public access to product images but restricted access to user uploads, use rules like:
     ```
     service firebase.storage {
       match /b/{bucket}/o {
         match /products/{allPaths=**} {
           allow read: if true;
           allow write: if request.auth != null; // Only authenticated admin (via SDK)
         }
         match /studio-photos/{allPaths=**} {
           allow read: if request.auth != null;
           allow write: if request.auth != null;
         }
       }
     }
     ```
     *Note: Since we use the Admin SDK on the server, the server bypasses these rules, but these rules protect direct browser access if ever enabled.*

4. **CORS Configuration**:
   - If you implement direct browser uploads in the future, you must configure CORS using the `gsutil` tool.
