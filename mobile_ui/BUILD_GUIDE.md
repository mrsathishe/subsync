# Building APK for SubSync Mobile

## Prerequisites

1. **Create an Expo account**: Go to https://expo.dev and create an account
2. **Install EAS CLI**: Already installed globally

## Steps to Generate APK

### Method 1: Using EAS Build (Recommended)

1. **Login to Expo**:
   ```bash
   eas login
   ```

2. **Configure your project**:
   ```bash
   eas build:configure
   ```

3. **Build APK for preview/testing**:
   ```bash
   eas build --platform android --profile preview
   ```
   - This generates an APK file that you can install directly
   - No Google Play Store required
   - Good for testing and distribution

4. **Build AAB for Google Play Store**:
   ```bash
   eas build --platform android --profile production
   ```
   - This generates an AAB (Android App Bundle)
   - Required for Google Play Store uploads

### Method 2: Local Build (Alternative)

If you prefer to build locally:

1. **Install Android Studio and set up Android SDK**
2. **Eject from Expo** (This is irreversible!):
   ```bash
   npx expo eject
   ```
3. **Build with Gradle**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Build Profiles Explained

- **development**: For development builds with debugging
- **preview**: Generates APK for testing (recommended for distribution)
- **production**: Generates AAB for Play Store

## Configuration Files

- **eas.json**: EAS build configuration
- **app.json**: Expo app configuration

## After Building

1. **Download APK**: EAS will provide a download link
2. **Install on Android**: Transfer APK to Android device and install
3. **Note**: You may need to enable "Install from Unknown Sources" on Android

## Important Notes

- **API URL**: Update `API_BASE_URL` in `src/services/api.js` for production
- **Icons**: Replace placeholder icons in `assets/` folder with actual icons
- **Permissions**: Review and add any required permissions in app.json
- **Signing**: EAS handles app signing automatically

## Production Checklist

Before building for production:

- [ ] Update API base URL to production server
- [ ] Replace placeholder icons with actual app icons
- [ ] Test all features thoroughly
- [ ] Update app version in app.json
- [ ] Review and set proper permissions
- [ ] Test APK on multiple Android devices

## Troubleshooting

If build fails:
1. Check EAS build logs for errors
2. Ensure all dependencies are compatible
3. Update Expo SDK if needed
4. Check app.json configuration