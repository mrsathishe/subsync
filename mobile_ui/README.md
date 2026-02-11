# SubSync Mobile

A React Native mobile application for subscription management, built with Expo.

## Features

- **Authentication**: Secure login and registration with JWT tokens
- **Subscription Management**: View, filter, and manage your subscriptions
- **Profile Management**: Update user profile information
- **Secure Storage**: Uses Expo SecureStore for sensitive data
- **Cross-platform**: Works on both iOS and Android

## Architecture

The mobile app follows the same architecture patterns as the React frontend:

### Key Components
- **Navigation**: React Navigation with stack and tab navigators
- **Authentication**: Context-based auth with SecureStore integration
- **API Integration**: Axios-based API client matching frontend patterns
- **UI Components**: React Native Elements with custom styling

### File Structure
```
src/
├── App.js                    # Main app component with navigation
├── components/               # Reusable UI components
│   └── LoadingScreen.js     # Loading indicator component
├── contexts/                # React Context providers
│   └── AuthContext.js       # Authentication state management
├── screens/                 # Application screens
│   ├── auth/                # Authentication screens
│   │   ├── LoginScreen.js
│   │   └── RegisterScreen.js
│   ├── HomeScreen.js        # Dashboard with subscription overview
│   ├── ProfileScreen.js     # User profile management
│   └── SubscriptionsScreen.js # Subscription list and management
└── services/                # API service layer
    └── api.js               # HTTP client and API functions
```

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   cd mobile_ui
   npm install
   ```

2. **Configure API Base URL**:
   Update `API_BASE_URL` in `src/services/api.js` to point to your backend server.

3. **Start Development Server**:
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on Device**:
   - Install Expo Go app on your device
   - Scan the QR code from the terminal
   - Or run `npm run ios` / `npm run android` for simulator

## API Integration

The mobile app uses the same API endpoints as the React frontend:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Subscriptions**: `/api/subscriptions/*`
- **User Profile**: `/api/users/profile`
- **Admin APIs**: `/api/admin/*` (for admin users)

## Security

- JWT tokens stored securely using Expo SecureStore
- Automatic token injection in API requests
- Global error handling for authentication failures
- Secure credential management

## Build & Deployment

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build with EAS
```bash
eas build --platform android
eas build --platform ios
```

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **HTTP Client**: Axios
- **Secure Storage**: Expo SecureStore
- **Icons**: React Native Vector Icons
- **UI Components**: React Native Elements + React Native Paper

## Features by Screen

### Login Screen
- Email or phone number authentication
- Password validation
- Error handling and loading states
- Navigation to registration

### Registration Screen
- Multi-field user registration
- Form validation
- Optional field handling (date of birth, gender)
- Password confirmation

### Home Screen
- Subscription statistics overview
- Recent subscriptions list
- Pull-to-refresh functionality
- Navigation to detailed views

### Subscriptions Screen
- Complete subscription list
- Search and filter functionality
- Subscription status management
- Cancel subscription capability

### Profile Screen
- User profile display and editing
- Secure profile updates
- Account management actions
- Admin badge for admin users

## Development Notes

- Uses same backend APIs as React frontend
- Matches frontend authentication patterns
- Implements mobile-specific UX patterns
- Responsive design for various screen sizes
- Follows React Native best practices