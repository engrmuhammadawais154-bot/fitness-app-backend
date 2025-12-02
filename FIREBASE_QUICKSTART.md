# 🚀 Quick Start - Firebase Setup

## ⚡ 5-Minute Setup

Your app has been migrated to Firebase. Follow these steps to get it running:

### 1️⃣ Create Firebase Project (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Create a project"**
3. Name it `fitness-app`
4. Click **"Continue"** → **"Continue"** → **"Create project"**

### 2️⃣ Enable Email Authentication (1 minute)

1. Click **"Authentication"** in sidebar
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle **Enable** → Click **"Save"**

### 3️⃣ Create Firestore Database (1 minute)

1. Click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose location closest to you
5. Click **"Enable"**

### 4️⃣ Get Your Config & Update Code (1 minute)

1. Click ⚙️ **Settings** (gear icon next to "Project Overview")
2. Scroll to **"Your apps"**
3. Click the **web icon** `</>`
4. Register app with nickname "Fitness App"
5. **Copy the firebaseConfig object**
6. Open `client/src/firebase.ts` in your code
7. **Paste your config** (replace the placeholder values)
8. Save the file

### 5️⃣ Update Security Rules (30 seconds)

1. Go to **Firestore Database** → **Rules** tab
2. Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### 6️⃣ Build & Test! (2 minutes)

```bash
cd client
npm run build
npx cap sync
npx cap open android
```

Build the APK in Android Studio and test:
- ✅ Register new account
- ✅ Log out
- ✅ Log back in (should work!)
- ✅ Close app → Reopen → Still logged in!

## ✨ Done!

Your app now has:
- ✅ Persistent authentication (never forgets you)
- ✅ Cloud database (data never lost)
- ✅ Automatic login on app restart
- ✅ Real-time data sync

## 📚 Need More Details?

See `FIREBASE_SETUP_GUIDE.md` for detailed instructions and troubleshooting.

## 🆘 Common Issues

**"Invalid API key" error**
→ Check you copied the entire `firebaseConfig` from Firebase Console

**Can't log in**
→ Make sure Email/Password authentication is enabled in Firebase Console

**Data not saving**
→ Publish the Firestore security rules (step 5)

---

**Questions?** All your user accounts and data now live in Firebase's cloud - server restarts will NEVER delete them again! 🎉
