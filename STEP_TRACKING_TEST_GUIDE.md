# 🚶‍♂️ Step Tracking Testing Guide

## ✅ What I Fixed:

### Improved Step Detection Algorithm:
- **Better peak detection** - Now detects when acceleration crosses threshold
- **Anti-double-counting** - 250ms minimum between steps
- **Optimized threshold** - Set to 13 m/s² (better for walking detection)
- **Console logging** - Shows each step detected for debugging
- **Auto-restart** - Tracking resumes automatically when app reopens

### Changes Made:
1. **Algorithm improvements** in `App.tsx`
2. **Threshold tuning** for accurate step counting
3. **Time-based filtering** to prevent false positives

---

## 📱 How to Test Step Tracking:

### Step 1: Build New APK
```powershell
cd "d:\2025\fitness app\client"
npm run build
npx cap sync
npx cap open android
```

In Android Studio:
- **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- Find APK: `client\android\app\build\outputs\apk\debug\app-debug.apk`

### Step 2: Install on Phone
- Transfer APK to your phone
- Install (uninstall old version first if needed)
- Open the app

### Step 3: Enable Step Tracking
1. **Login** to your account
2. On **Home screen**, tap the **"Steps Today"** card
3. Android will ask for **"Physical Activity"** permission
4. Tap **"Allow"**
5. The card should unlock and show current steps

### Step 4: Test Walking Detection
1. **Hold your phone** (in hand or pocket)
2. **Walk around** for 30 seconds
3. **Check the step count** - it should increase!
4. Each step triggers a console log (visible in Android Studio Logcat)

---

## 🔍 Debugging (If Steps Don't Count):

### Check Android Logcat:
In Android Studio:
1. Bottom panel → **Logcat**
2. Filter by: `chromium`
3. Walk around and look for:
   ```
   Starting motion tracking...
   Step detected! Total: 1, Magnitude: 14.23
   Step detected! Total: 2, Magnitude: 13.87
   ```

### Common Issues:

**Issue: "Locked" card won't unlock**
- Make sure you granted **Physical Activity** permission
- Try: Settings → Apps → Fitness App → Permissions → Physical activity (ON)

**Issue: Step count stuck at 0**
- Check console for errors
- Try shaking phone vigorously to test accelerometer
- Restart app and try again

**Issue: Steps counting too many/too few**
- **Too many**: Increase `STEP_THRESHOLD` from 13 to 15 in App.tsx
- **Too few**: Decrease `STEP_THRESHOLD` from 13 to 11
- Rebuild after changes

**Issue: Permission denied error**
- Go to Settings → Apps → Fitness App
- Clear app data
- Reopen app and grant permission again

---

## 🎯 How It Works:

### Step Detection Algorithm:
```typescript
1. Phone accelerometer measures movement (x, y, z axes)
2. Calculate total acceleration magnitude = √(x² + y² + z²)
3. When magnitude crosses threshold (13 m/s²) = STEP!
4. Wait 250ms before counting next step (prevents double-counting)
5. Save step count to localStorage and backend
```

### Typical Acceleration Values:
- **Standing still**: 9.8 m/s² (gravity)
- **Walking**: 11-15 m/s² (peaks when foot hits ground)
- **Running**: 15-20 m/s²
- **Jumping**: 20+ m/s²

---

## 📊 Testing Checklist:

- [ ] Installed new APK
- [ ] Logged in successfully
- [ ] Tapped "Steps Today" card
- [ ] Granted Physical Activity permission
- [ ] Card unlocked (shows number instead of "Locked")
- [ ] Walked 10 steps while holding phone
- [ ] Step count increased
- [ ] Closed app and reopened - steps persisted
- [ ] Steps sync to backend server

---

## 🔧 Advanced: Calibration

If step counting isn't accurate, you can tune it:

### Option 1: Adjust Threshold (Easy)
In `App.tsx` line ~73, change:
```typescript
const STEP_THRESHOLD = 13;  // Try 11, 12, 14, or 15
```

### Option 2: Adjust Timing (For runners)
```typescript
const MIN_STEP_INTERVAL = 250;  // Try 200 for running, 300 for slow walking
```

### Option 3: Add Sensitivity Modes
Add different thresholds for walking vs running:
```typescript
const walkingThreshold = 12;
const runningThreshold = 16;
```

After any changes:
```powershell
npm run build
npx cap sync
# Rebuild APK in Android Studio
```

---

## ✅ Expected Behavior:

✅ First time: Card shows "Locked" with lock icon  
✅ After tapping: Android permission dialog appears  
✅ After granting: Card unlocks, shows "0" or saved steps  
✅ While walking: Number increases in real-time  
✅ After closing app: Steps persist when reopened  
✅ Console logs: "Step detected!" messages appear  

---

## 🎉 Success Indicators:

When working correctly:
- Steps increase as you walk (roughly matches actual steps)
- No steps counted when standing still
- Steps persist across app restarts
- Console shows "Step detected!" messages
- Permission only asked once (then remembered)

---

**Ready to test! Build the APK and try it on your phone!** 📱

If steps still don't count, let me know what you see in Logcat.
