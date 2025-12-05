# Aura Flow v1.2.0 Release Notes

**Release Date:** December 5, 2025  
**Version Code:** 12  
**Version Name:** 1.2.0

## What's New in This Release

### 🎨 UI/UX Enhancements

#### Bottom Navigation Improvements
- **Enhanced Device Compatibility**: Fixed bottom navigation bar collision with device navigation bars
- **Safe Area Support**: Added proper safe area insets for devices with notches and gesture navigation
- **Improved Spacing**: Increased padding to prevent UI elements from overlapping with system navigation
- **Better Responsiveness**: Navigation bar now adapts properly to different device screen sizes

#### Sticky Header Implementation
- **Sticky Headers**: All Exercise Finder screens now have sticky headers that stay visible while scrolling
- **Improved Navigation**: Header with back button remains accessible during scrolling
- **Better Context**: Users always know which screen they're on with persistent headers
- **Modern Design**: Semi-transparent backdrop blur effect for a polished look

### 🔐 Security & Session Management

#### Single Device Login Enforcement
- **Enhanced Security**: Implemented single-device login to protect user accounts
- **Seamless Device Switching**: When logging in on a new device, the previous session is automatically terminated
- **Real-time Detection**: Uses Firestore real-time listeners to detect and handle multi-device logins
- **Clear User Feedback**: Users are notified when their session is transferred to another device
- **Improved Session Control**: Only the most recently logged-in device stays active

### 🐛 Bug Fixes
- Fixed bottom navigation bar appearing behind device navigation on some Android devices
- Resolved header scrolling issues in Exercise Finder screens
- Improved session persistence and device tracking

### 🔧 Technical Improvements
- Optimized CSS for better cross-device compatibility
- Enhanced Firestore security with device-based session management
- Improved auth state management with real-time synchronization
- Better error handling for multi-device scenarios

---

## File Information

### For Play Console Upload:
- **File:** `AuraFlow-v1.2.0-release.aab` (10.65 MB)
- **Format:** Android App Bundle (AAB) - Required for Play Console

### For Direct Installation/Testing:
- **File:** `AuraFlow-v1.2.0-release.apk` (9.94 MB)
- **Format:** APK - Can be installed directly on devices for testing

---

## Installation Instructions

### For Play Console:
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Navigate to: **Production** > **Create new release**
4. Upload `AuraFlow-v1.2.0-release.aab`
5. Fill in release notes
6. Review and rollout

### For Testing (APK):
1. Enable "Unknown Sources" on your Android device
2. Transfer `AuraFlow-v1.2.0-release.apk` to your device
3. Install the APK
4. Test the new features

---

## Known Issues
None reported for this version.

---

## Next Steps
1. Upload AAB to Play Console
2. Complete Play Console release notes
3. Submit for review
4. Monitor crash reports and user feedback

---

## Build Information
- **Build Date:** December 5, 2025
- **Build Tool:** Gradle 8.x
- **Min SDK:** 22 (Android 5.1)
- **Target SDK:** 34 (Android 14)
- **Signing:** Release keystore
- **Obfuscation:** Enabled (ProGuard)
- **Shrinking:** Enabled
