# SubSync Mobile - React Native Application Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Features & Functionality](#features--functionality)
5. [Installation & Setup](#installation--setup)
6. [Development Guide](#development-guide)
7. [API Integration](#api-integration)
8. [Building & Deployment](#building--deployment)
9. [APK Generation](#apk-generation)
10. [Security Features](#security-features)
11. [Troubleshooting](#troubleshooting)
12. [Future Enhancements](#future-enhancements)

---

## Project Overview

SubSync Mobile is a React Native application built with Expo that provides a mobile interface for subscription management. It's designed to work seamlessly with the existing SubSync backend API, offering the same functionality as the React web frontend but optimized for mobile devices.

### Key Highlights
- **Cross-platform**: Works on both iOS and Android
- **Native Performance**: Built with React Native for optimal performance
- **Secure Authentication**: JWT-based authentication with secure token storage
- **API Compatible**: Uses the same backend APIs as the React frontend
- **Modern UI**: Clean, responsive design following Material Design principles
- **Offline Capability**: Secure local storage for authentication state

---

## Architecture & Technology Stack

### Core Technologies
- **React Native**: 0.73.4
- **Expo**: 50.0.0 (Managed workflow)
- **React**: 18.2.0
- **React Navigation**: 6.x (Stack & Tab navigation)
- **Axios**: HTTP client for API calls
- **Expo SecureStore**: Secure storage for sensitive data

### Key Libraries
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.10",
  "@react-navigation/bottom-tabs": "^6.5.3",
  "axios": "^1.6.0",
  "expo-secure-store": "^12.8.1",
  "react-native-vector-icons": "^10.0.3",
  "react-native-safe-area-context": "^4.8.2"
}
```

### Architecture Pattern
- **Context-based State Management**: AuthContext for global authentication state
- **Service Layer Architecture**: Centralized API calls in services directory
- **Component-based UI**: Reusable, modular components
- **Screen-based Navigation**: Logical separation of app sections

---

## Project Structure

```
mobile_ui/
├── package.json              # Project dependencies and scripts
├── app.json                  # Expo configuration
├── eas.json                  # EAS Build configuration
├── babel.config.js           # Babel configuration
├── index.js                  # Application entry point
├── BUILD_GUIDE.md            # APK generation guide
├── README.md                 # Project documentation
├── .gitignore               # Git ignore rules
├── assets/                   # Application assets
│   ├── icon.png             # App icon
│   ├── splash.png           # Splash screen
│   ├── adaptive-icon.png    # Android adaptive icon
│   └── favicon.png          # Web favicon
└── src/                     # Source code
    ├── App.js               # Main application component
    ├── components/          # Reusable UI components
    │   └── LoadingScreen.js # Loading indicator
    ├── contexts/            # React Context providers
    │   └── AuthContext.js   # Authentication state management
    ├── screens/             # Application screens
    │   ├── auth/            # Authentication screens
    │   │   ├── LoginScreen.js
    │   │   └── RegisterScreen.js
    │   ├── HomeScreen.js        # Dashboard/overview
    │   ├── SubscriptionsScreen.js # Subscription management
    │   └── ProfileScreen.js     # User profile management
    └── services/            # API integration layer
        └── api.js           # HTTP client and API functions
```

---

## Features & Functionality

### 1. Authentication System
- **Login/Register**: Email or phone number authentication
- **Secure Storage**: JWT tokens stored in Expo SecureStore
- **Auto-login**: Persistent authentication state
- **Error Handling**: Comprehensive error messages and validation
- **Logout**: Secure token cleanup

### 2. Dashboard (Home Screen)
- **Subscription Overview**: Visual statistics and metrics
- **Quick Stats**: Total subscriptions, active count, total amount
- **Recent Subscriptions**: Latest subscription entries
- **Pull-to-Refresh**: Manual data refresh capability
- **Navigation**: Quick access to detailed views

### 3. Subscription Management
- **Complete List**: View all user subscriptions
- **Search & Filter**: Find subscriptions by name or plan
- **Status Management**: Active, cancelled, expired subscriptions
- **Cancellation**: Cancel active subscriptions with confirmation
- **Real-time Updates**: Automatic refresh after changes
- **Detailed View**: Comprehensive subscription information

### 4. Profile Management
- **View Profile**: Display user information and role
- **Edit Profile**: Update personal information
- **Form Validation**: Client-side validation before submission
- **Optional Fields**: Smart handling of optional profile data
- **Admin Badge**: Special indication for admin users
- **Account Actions**: Secure logout functionality

### 5. Navigation & UX
- **Tab Navigation**: Easy access to main sections
- **Stack Navigation**: Hierarchical screen navigation
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Adapts to different screen sizes
- **Native Feel**: Platform-specific UI elements

---

## Installation & Setup

### Prerequisites
- Node.js 20.18.3 or higher
- npm or yarn package manager
- Expo Go app (for testing on device)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

### Development Setup

1. **Navigate to mobile_ui directory**:
   ```bash
   cd mobile_ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on device/simulator**:
   - **Physical Device**: Scan QR code with Expo Go app
   - **Android Emulator**: Press 'a' in terminal
   - **iOS Simulator**: Press 'i' in terminal
   - **Web Browser**: Press 'w' in terminal

### Configuration

#### API Configuration
Update the API base URL in `src/services/api.js`:
```javascript
// For development (local backend)
const API_BASE_URL = 'http://localhost:5001/api';

// For production
const API_BASE_URL = 'https://your-production-api.com/api';
```

#### App Configuration
Modify `app.json` for app-specific settings:
```json
{
  "expo": {
    "name": "SubSync Mobile",
    "slug": "subsync-mobile",
    "version": "1.0.0",
    "android": {
      "package": "com.subsync.mobile"
    },
    "ios": {
      "bundleIdentifier": "com.subsync.mobile"
    }
  }
}
```

---

## Development Guide

### Available Scripts

```json
{
  "start": "npx expo start",
  "android": "npx expo start --android",
  "ios": "npx expo start --ios",
  "web": "npx expo start --web",
  "build:android:preview": "eas build --platform android --profile preview",
  "build:android:production": "eas build --platform android --profile production",
  "build:ios": "eas build --platform ios",
  "build:configure": "eas build:configure"
}
```

### Development Workflow

1. **Start Development Server**:
   ```bash
   npm start
   ```

2. **Live Reload**: Changes are automatically reflected in the app

3. **Debugging**:
   - Use React Native Debugger
   - Enable remote debugging in Expo
   - Use console.log for debugging (visible in terminal)

4. **Testing**:
   - Test on multiple devices/simulators
   - Test different screen sizes
   - Verify API integration with backend

### Code Structure Guidelines

#### Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#1F2937',
  },
});

export default ComponentName;
```

#### API Service Pattern
```javascript
export const apiName = {
  getResource: async (params) => {
    const response = await apiClient.get('/endpoint', { params });
    return response.data;
  },
  
  createResource: async (data) => {
    const response = await apiClient.post('/endpoint', data);
    return response.data;
  },
};
```

---

## API Integration

### Backend Compatibility
The mobile app uses the same API endpoints as the React frontend:

- **Base URL**: `http://localhost:5001/api`
- **Authentication**: JWT Bearer tokens
- **Content-Type**: `application/json`
- **Timeout**: 10 seconds

### API Endpoints

#### Authentication
```javascript
// POST /api/auth/login
authAPI.login({ email: 'user@example.com', password: 'password' })

// POST /api/auth/register
authAPI.register({ 
  name: 'User Name',
  email: 'user@example.com',
  password: 'password',
  phone: '+1234567890'
})
```

#### Subscriptions
```javascript
// GET /api/subscriptions/my-subscriptions
subscriptionAPI.getMySubscriptions()

// POST /api/subscriptions/subscribe
subscriptionAPI.subscribe(planId)

// PUT /api/subscriptions/{id}/cancel
subscriptionAPI.cancelSubscription(subscriptionId)
```

#### User Profile
```javascript
// GET /api/users/profile
userAPI.getProfile()

// PUT /api/users/profile
userAPI.updateProfile(profileData)
```

### Error Handling
```javascript
// Global error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth tokens and redirect to login
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  }
);
```

### Request Interceptor
```javascript
// Automatic token injection
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Building & Deployment

### Development Build
For testing and internal distribution:
```bash
npm run build:android:preview
```

### Production Build
For app store distribution:
```bash
npm run build:android:production  # Creates AAB for Google Play
npm run build:ios               # Creates IPA for App Store
```

### EAS Build Configuration
The `eas.json` file defines build profiles:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

---

## APK Generation

### Method 1: EAS Build (Recommended)

#### Step 1: Setup
```bash
# Install EAS CLI globally
npm install -g @expo/cli eas-cli

# Login to Expo account
eas login
```

#### Step 2: Configure Project
```bash
# Configure EAS for your project
npm run build:configure
# or
eas build:configure
```

#### Step 3: Build APK
```bash
# Build APK for testing/distribution
npm run build:android:preview
# or
eas build --platform android --profile preview
```

#### Step 4: Download & Install
1. Wait for build completion (10-20 minutes)
2. Download APK from provided link
3. Transfer to Android device
4. Enable "Install from Unknown Sources"
5. Install APK

### Method 2: Legacy Expo Build

For simpler builds (deprecated but still functional):
```bash
npx expo build:android
```

### Build Profiles Explained

- **development**: Development build with debugging enabled
- **preview**: APK for testing and internal distribution
- **production**: AAB for Google Play Store submission

### Pre-build Checklist

- [ ] Update API base URL for production environment
- [ ] Replace placeholder icons with actual app icons (1024x1024 for icon.png)
- [ ] Update app version in `app.json`
- [ ] Test all features thoroughly
- [ ] Review permissions in `app.json`
- [ ] Verify signing configuration

---

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Expo SecureStore**: Hardware-backed secure storage
- **Token Expiration**: Automatic token refresh handling
- **Secure Logout**: Complete token cleanup on logout

### Data Protection
- **HTTPS Communication**: All API calls over secure connections
- **Input Validation**: Client-side form validation
- **Error Handling**: Secure error messages without sensitive data exposure
- **Local Storage**: No sensitive data in AsyncStorage

### API Security
- **Authorization Headers**: Automatic token injection
- **Request Timeout**: 10-second timeout to prevent hanging requests
- **Error Interceptor**: Automatic handling of authentication errors

### Best Practices Implemented
- No hardcoded secrets in code
- Secure storage for authentication tokens
- Proper error boundaries
- Input sanitization
- Secure API communication

---

## Troubleshooting

### Common Installation Issues

#### Dependency Conflicts
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start -c
# or
npx react-native start --reset-cache
```

#### Version Compatibility
- Ensure Node.js version 20.18.3 or higher
- Use compatible Expo SDK version (50.0.0)
- Check React Native version compatibility

### Runtime Issues

#### API Connection Problems
1. Verify backend server is running on correct port (5001)
2. Check API base URL in `src/services/api.js`
3. Ensure device/emulator can reach the server
4. For physical devices, use your computer's IP address instead of localhost

#### Authentication Issues
1. Clear SecureStore data
2. Check JWT token format
3. Verify API endpoints match backend
4. Check network connectivity

#### Navigation Issues
1. Verify React Navigation dependencies are installed
2. Check navigation structure in App.js
3. Ensure all screens are properly imported

### Build Issues

#### EAS Build Failures
1. Check build logs in Expo dashboard
2. Verify app.json configuration
3. Ensure all dependencies are compatible
4. Check bundle identifier/package name uniqueness

#### Local Build Issues
1. Verify Android SDK installation
2. Check Java version compatibility
3. Ensure environment variables are set correctly

### Performance Issues

#### Slow App Startup
1. Optimize image sizes
2. Use lazy loading for screens
3. Minimize initial bundle size
4. Use React Native performance profiler

#### Memory Issues
1. Check for memory leaks in useEffect hooks
2. Optimize image usage
3. Use FlatList for long lists
4. Profile with React Native performance tools

---

## Future Enhancements

### Planned Features

#### Push Notifications
- Subscription renewal reminders
- Payment failure notifications
- New plan availability alerts
- Implementation with Expo Notifications API

#### Offline Support
- Local data caching with AsyncStorage
- Offline-first architecture
- Data synchronization when online
- Offline indicators and messaging

#### Enhanced UI/UX
- Dark mode support
- Animated transitions
- Pull-to-refresh improvements
- Better loading states
- Skeleton screens

#### Advanced Features
- Biometric authentication (Face ID/Fingerprint)
- Widget support for subscription overview
- Share functionality for subscriptions
- Export data to PDF/CSV
- Subscription analytics and insights

#### Performance Optimizations
- Image caching and optimization
- Code splitting and lazy loading
- Memory optimization
- Bundle size reduction
- Faster startup times

### Technical Improvements

#### Testing
- Unit tests with Jest
- Integration tests with React Native Testing Library
- E2E tests with Detox
- Performance testing

#### Development Tools
- TypeScript migration for better type safety
- ESLint and Prettier configuration
- Automated testing in CI/CD
- Code coverage reporting

#### Architecture Enhancements
- State management with Redux Toolkit (if needed)
- Better error boundaries
- Improved logging and monitoring
- Performance monitoring with Flipper

---

## Conclusion

SubSync Mobile provides a comprehensive mobile solution for subscription management, built with modern React Native technologies and following industry best practices. The app offers a seamless experience that mirrors the web application functionality while taking advantage of mobile-specific features.

The architecture is designed for scalability and maintainability, with clear separation of concerns and reusable components. The integration with the existing backend API ensures consistency across platforms while the secure authentication system protects user data.

For support and contributions, refer to the project documentation and follow the established development guidelines.

---

## Contact & Support

For technical support or questions about SubSync Mobile:
- Review the troubleshooting section
- Check the GitHub issues (if available)
- Follow the development guidelines for contributions
- Ensure backend server is compatible and running

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Compatible with**: SubSync Backend API v1.0