# 🔥 Firebase Security Rules - Quick Deploy Guide

## COPY THIS TO FIREBASE CONSOLE

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Select project: **myfitnessapp-6b3ef**
3. Click **Firestore Database** in left menu
4. Click **Rules** tab at the top

### Step 2: Replace ALL existing rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read: if isSignedIn() && isOwner(userId);
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isSignedIn() && isOwner(userId);
      allow delete: if isSignedIn() && isOwner(userId);
    }
    
    match /workoutHistory/{workoutId} {
      allow read: if isSignedIn() && request.auth.uid == resource.data.userId;
      allow create: if isSignedIn() && request.auth.uid == request.resource.data.userId;
      allow update: if isSignedIn() && request.auth.uid == resource.data.userId;
      allow delete: if isSignedIn() && request.auth.uid == resource.data.userId;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 3: Click "Publish" button

### Step 4: Test Security (Important!)

Open your app and try:
1. ✅ Login → Should work
2. ✅ View your profile → Should work  
3. ✅ Save workout → Should work
4. ❌ Access another user's data → Should FAIL (this proves security works!)

---

## What This Protects:

✅ Users can ONLY access their own data
✅ Anonymous users cannot read/write anything
✅ Users cannot modify other users' workouts
✅ All database operations require authentication
✅ Prevents data breaches and unauthorized access

---

## Troubleshooting

**Error: "permission-denied"**
- This is GOOD! It means security is working.
- Only affects unauthorized access attempts.
- Your own app access should work fine.

**Can't save workouts?**
- Make sure user is logged in
- Check Firebase Authentication tab for active users
- Verify userId matches in workout data

---

## Done! 🎉

Your database is now secure. No one can access user data without proper authentication!

