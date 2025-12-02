# Firebase Setup Guide

## ✅ What We've Done

Your fitness app has been successfully migrated from a Node.js backend to **Firebase**. This solves two critical problems:

1. **Account Persistence**: Users no longer "forget" credentials after logout - Firebase automatically manages authentication sessions
2. **Data Persistence**: User data is stored in Google's cloud (Firestore), so server restarts never delete accounts or progress

## 🔥 Firebase Setup Steps

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Fitness App")
4. Disable Google Analytics (optional, not needed for this app)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on the **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**

### Step 3: Create Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add security rules later)
4. Choose a Firestore location (select closest to your users, e.g., `us-central`)
5. Click **"Enable"**

### Step 4: Get Your Firebase Config

1. In the Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. Register your app:
   - App nickname: "Fitness App Web"
   - Check ☑️ **"Also set up Firebase Hosting"** (optional)
   - Click **"Register app"**
6. **Copy the Firebase configuration object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:XXXXXXXXXXX"
};
```

### Step 5: Update Your App Configuration

1. Open `client/src/firebase.ts` in your code editor
2. **Replace the placeholder values** with your actual Firebase config:

```typescript
// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the necessary services
export const auth = getAuth(app);
export const db = getFirestore(app);
```

3. Save the file

### Step 6: Update Firestore Security Rules

1. In Firebase Console, go to **"Firestore Database"**
2. Click the **"Rules"** tab
3. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click **"Publish"**

## 🚀 Testing Your Setup

1. Build the Android app:
   ```bash
   cd client
   npm run build
   npx cap sync
   npx cap open android
   ```

2. In Android Studio, build and run the APK

3. Test the following:
   - **Register** a new account with email/password
   - **Log out**
   - **Log in** again with the same credentials
   - Close and reopen the app - you should **stay logged in automatically**!
   - Update your weight or target weight
   - Close and reopen the app - your data should **persist**!

## ✨ What Changed

### Before (Node.js Backend):
- ❌ In-memory storage (lost on server restart)
- ❌ Manual token management
- ❌ Data wiped on Render server sleep
- ❌ Users couldn't log back in after server restart

### After (Firebase):
- ✅ Cloud-based Firestore database (never lost)
- ✅ Automatic authentication session management
- ✅ Persistent login across app restarts
- ✅ Real-time data sync
- ✅ No server maintenance needed

## 🔧 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check that you copied the correct `apiKey` from Firebase Console
- Make sure there are no extra spaces or quotes

### "Firebase: Error (auth/app-not-authorized)"
- Go to Firebase Console → Authentication → Settings
- Add your app's package name to authorized domains

### Data not saving
- Check Firestore security rules are published
- Verify you're logged in (check browser console for `auth.currentUser`)

### Can't see data in Firestore
- Go to Firebase Console → Firestore Database
- Check the `users` collection - each document ID is a user's UID
- Click on a document to see their profile data

## 📱 Next Steps

1. ✅ Complete Firebase setup (follow steps above)
2. ✅ Test authentication persistence
3. ✅ Verify data saves to Firestore
4. Build APK and install on your phone
5. Test step tracking with Google Fit integration
6. Share the app with friends!

## 🎉 Benefits of Firebase

- **Free tier**: 50K reads, 20K writes per day
- **Automatic backups**: Your data is never lost
- **Scalable**: Handles thousands of users automatically
- **Real-time**: Changes sync instantly across devices
- **Secure**: Industry-standard authentication
- **No server management**: Focus on building features, not infrastructure

---

**Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs/web/setup) or the Firebase Console for troubleshooting guides.
