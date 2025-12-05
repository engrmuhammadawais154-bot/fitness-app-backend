# Release Build Instructions for Aura Flow

## Prerequisites
You need Java JDK installed. Check with: `java -version`

## Step 1: Generate Keystore (ONE-TIME ONLY)

Run this command in PowerShell:

```powershell
cd "d:\2025\fitness app\client\android"

keytool -genkeypair -v -storetype PKCS12 -keystore auraflow-release.keystore -alias auraflow-release-key -keyalg RSA -keysize 2048 -validity 10000
```

**You will be asked:**
1. **Keystore password** - Choose a STRONG password (remember it!)
2. **Re-enter password** - Confirm it
3. **Your name** - Enter your name or company name
4. **Organization unit** - Can skip (press Enter)
5. **Organization** - Can skip or enter company name
6. **City** - Your city
7. **State** - Your state/province
8. **Country code** - 2-letter code (e.g., US, PK, UK)
9. **Key password** - Can use same as keystore password (just press Enter)

## Step 2: Update keystore.properties

Edit: `d:\2025\fitness app\client\android\keystore.properties`

Replace:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=auraflow-release-key
storeFile=auraflow-release.keystore
```

With your actual passwords from Step 1.

## Step 3: Build Release APK

```powershell
cd "d:\2025\fitness app\client"
npm run build
npx cap sync android
cd android
.\gradlew assembleRelease
```

## Step 4: Find Your APK

Release APK location:
```
d:\2025\fitness app\client\android\app\build\outputs\apk\release\app-release.apk
```

This is your **signed, optimized, production-ready APK** for Play Store!

## Step 5: Build App Bundle (AAB) for Play Store

Play Store prefers AAB format:

```powershell
cd "d:\2025\fitness app\client\android"
.\gradlew bundleRelease
```

AAB location:
```
d:\2025\fitness app\client\android\app\build\outputs\bundle\release\app-release.aab
```

Upload this AAB file to Play Store Console.

## CRITICAL: Backup Your Keystore

**IMMEDIATELY backup these files to a safe location:**
- `auraflow-release.keystore`
- `keystore.properties`

**Store in:**
- External hard drive
- Cloud storage (encrypted)
- USB drive in safe place

**⚠️ WARNING:** Lose the keystore = you can NEVER update your app on Play Store!

## What Changed with ProGuard

Your release APK now has:
- ✅ **Obfuscated code** - Class names like `generateDailyMealPlan` become `a`, `b`, `c`
- ✅ **Smaller size** - Unused code removed
- ✅ **Protected Firebase keys** - Harder to extract from APK
- ✅ **Better performance** - Optimized bytecode

## Security Notes

- ProGuard keeps necessary classes (Firebase, Capacitor, WebView)
- Crash reports will still show line numbers
- Your JavaScript code is still readable in the APK (this is normal for web-based apps)
- The important part (Firebase keys, logic) is much harder to reverse engineer

## Verification

Test the release APK on a real device before uploading to Play Store!

```powershell
adb install "d:\2025\fitness app\client\android\app\build\outputs\apk\release\app-release.apk"
```
