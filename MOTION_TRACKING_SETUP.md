# Motion Tracking Setup - Real Device Sensors

This fitness app now uses **real device motion sensors** to track steps instead of simulated data.

## What Changed

### Real Sensor Integration
- ✅ Uses Capacitor Motion API for real accelerometer data
- ✅ Detects actual steps using acceleration magnitude analysis
- ✅ Requests native Android/iOS permissions automatically
- ✅ Persists step count in localStorage across sessions

### Android Permissions Added
The app now requests these permissions on your device:
1. **ACTIVITY_RECOGNITION** - For motion & fitness tracking
2. **ACCESS_FINE_LOCATION** - For location-based activity tracking
3. **ACCESS_BACKGROUND_LOCATION** - For background step tracking
4. **WAKE_LOCK** - To keep sensors active in background

## How to Build & Test

### 1. Build the App
```powershell
cd 'd:\2025\fitness app\client'
npm run build
npx cap sync
```

### 2. Open in Android Studio
```powershell
npx cap open android
```

### 3. Build APK
In Android Studio:
- Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- Wait for build to complete
- Click "locate" in the notification to find the APK

**APK Location:**
```
d:\2025\fitness app\client\android\app\build\outputs\apk\debug\app-debug.apk
```

### 4. Install on Device
Transfer the APK to your Android device and install it.

## Testing Motion Tracking

### First Time Setup
1. Open the app
2. Navigate to the **Home** screen
3. Tap on the **Steps Today** card
4. Android will prompt for permissions:
   - **Allow "Fitness App" to access Physical Activity?** → Tap **Allow**
   - **Allow "Fitness App" to access this device's location?** → Tap **Allow** (if prompted)
5. Start walking!

### How It Works
- The app listens to your device's accelerometer
- When it detects movement patterns above threshold (magnitude > 12), it counts as a step
- Steps are saved in localStorage and persist across app sessions
- Real-time updates as you walk

### Troubleshooting

**Q: Steps aren't counting**
- Make sure you granted all permissions
- Try shaking or walking with your phone
- Check Settings → Apps → Fitness App → Permissions

**Q: Permission dialogs don't appear**
- Go to Android Settings → Apps → Fitness App → Permissions
- Manually enable Physical Activity and Location

**Q: Need to reset step count?**
- Clear app data in device settings, or
- Modify the code to add a reset button

## Technical Details

### Step Detection Algorithm
```javascript
// Calculates acceleration magnitude from x, y, z axes
const magnitude = Math.sqrt(
  event.acceleration.x ** 2 + 
  event.acceleration.y ** 2 + 
  event.acceleration.z ** 2
);

// Peak detection for step counting
if (magnitude > 12 && !stepDetected && lastMagnitude < magnitude) {
  stepCount++;
  setSteps(stepCount);
}
```

### Files Modified
- `src/App.tsx` - Replaced simulated tracking with real Motion API
- `android/app/src/main/AndroidManifest.xml` - Added motion/location permissions

### Plugins Used
- `@capacitor/motion` - Access device accelerometer/gyroscope
- `cordova-plugin-android-permissions` - Handle Android permission requests

## Next Steps

### Improvements You Can Make:
1. **Better Step Detection** - Use more sophisticated algorithms (e.g., peak detection with timing)
2. **Background Tracking** - Keep counting steps when app is closed (requires background service)
3. **Calibration** - Add user-specific threshold calibration
4. **Daily Reset** - Auto-reset step count at midnight
5. **History** - Store daily step history for trends

### Add Background Tracking (Advanced)
To track steps when the app is closed, you'll need:
- Android Foreground Service
- `@capacitor/background-task` or similar plugin
- Persistent notification to keep service alive

## Privacy Notes
- All step data is stored locally on your device
- No data is sent to external servers
- Users must grant explicit permission for motion sensors
- Permissions can be revoked anytime in device settings

---

**Enjoy your real-time step tracking! 🚶‍♂️📱**
