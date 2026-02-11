# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SubSync is a subscription management system designed for OTT and telecom services. The project follows a multi-component architecture with a fully implemented Node.js/Express backend, React frontend, and React Native mobile application.

## Frontend Implementation

The frontend is a modern React application built with Vite, featuring:

- **React 19** with hooks and functional components
- **React Router v7** for client-side routing
- **Tailwind CSS v4** with custom design system
- **React Aria Components** for accessible UI primitives
- **Axios** for HTTP client communication with backend API
- **Vite 7.2.4** with HMR and API proxy to backend

### Frontend Architecture

The application follows a modular, feature-based architecture with:

1. **Pages** (`src/pages/`)
   - LoginPage & RegisterPage - Authentication flows with Logo component integration
   - SubscriptionsPage - Subscription management with modular components
   - ManageUsers - User management (admin only)
   - ProfilePage - User profile management

2. **Feature-Based Component Organization**
   - `adminsubscription/` - Modular form sections (BasicInformation, LoginInformation, SubscriptionDetails, DeviceUsage, SharingSection)
   - `subscription/` - Page components (PageHeader, StatsSection, FiltersSection, SubscriptionsTable, CellRenderers)
   - `manageUser/` - User management components (UserTable, PageHeader, Pagination)
   - Shared Logo component used across authentication pages

3. **State Management**
   - AuthContext for global authentication state with localStorage persistence
   - UsersContext for admin user data with refetch functionality
   - Local component state for UI interactions
   - API state managed through direct axios calls

4. **API Integration** (`src/services/api.js`)
   - Domain-separated API functions (authAPI, subscriptionAPI, adminAPI, userAPI)
   - Centralized axios configuration with 10-second timeout
   - Automatic JWT token injection via request interceptors
   - Global authentication error handling (401/403 redirects)

5. **Design System** (`src/components/styles.jsx`)
   - Atomic design components with Tailwind CSS v4
   - Consistent spacing and styling patterns (`mb-4`, `gap-2`, `gap-4`)
   - Variant-based component system (primary/secondary/danger)
   - Responsive grid layouts with proper alignment
   - **Auth-specific components**: Specialized UI components for authentication flows (AuthCard, AuthInput, AuthButton, etc.)

## Backend Implementation

The backend is a complete Express.js API server with PostgreSQL database integration, featuring:

- JWT-based authentication system
- Subscription management with plans and user subscriptions
- User profile management with role-based access control
- Secure database operations with prepared statements
- Production-ready security middleware (Helmet, CORS, rate limiting)

### Database Configuration

The backend connects to a PostgreSQL database with schema defined in `database/schema.sql`. Key features:

- Users table with role-based access (email, password, name, role)
- Subscriptions and subscription plans
- Subscription sharing and payment tracking capabilities
- Automatic `updated_at` timestamp triggers
- Foreign key constraints with CASCADE deletes

Database connection details are stored in `.env` for development and `.env.prod` for production.

## Mobile Implementation

The mobile_ui directory contains a React Native application built with Expo:

- **React Native 0.73.4** with **Expo 50.0**
- **React Navigation** for stack and tab navigation
- **Expo SecureStore** for secure token storage
- **Same API integration** as React frontend
- Cross-platform support for iOS and Android

## Common Development Commands

### Backend Development
```bash
cd backend
npm install                           # Install dependencies
npm run dev                          # Start development server with auto-reload (uses .env)
npm run start:prod                   # Start with production config (.env.prod)
node scripts/setup-db.js            # Initialize database schema and sample data
node scripts/fix-schema.js          # Fix database schema issues and add constraints
node scripts/add-payment-details.js # Add payment_details table and triggers
```

### Frontend Development
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                   # Start Vite development server with HMR on port 5000
npm run build                 # Build for production
npm run lint                  # Run ESLint for code quality
npm run preview              # Preview production build locally
```

### Mobile Development
```bash
cd mobile_ui
npm install                    # Install dependencies
npm start                     # Start Expo development server
npm run build:android:preview # Build APK for testing
eas login                     # Login to Expo for builds
eas build --platform android --profile preview # Build APK with EAS
```

### Production Deployment
```bash
./deploy.sh                   # Full production deployment with PM2
pm2 start ecosystem.config.js # Start with PM2 process manager
pm2 logs subsync             # View application logs
pm2 monit                    # Monitor application performance
```

## Project Structure

```
subsync/
├── backend/                   # Complete Express.js API server
│   ├── server.js             # Main application entry point with environment file selection
│   ├── src/
│   │   ├── config/database.js    # PostgreSQL connection config with SSL
│   │   ├── middleware/auth.js    # JWT authentication middleware
│   │   └── routes/               # API route handlers
│   │       ├── auth.js           # Registration/login endpoints
│   │       ├── subscriptions.js # Subscription and sharing management
│   │       └── users.js          # User profile operations
│   ├── database/             # Database schema and migrations
│   ├── scripts/              # Database management scripts
│   ├── .env                  # Development database credentials
│   └── .env.prod             # Production database configuration
├── frontend/                 # Modern React web application
│   ├── src/
│   │   ├── components/           # Reusable UI components including Logo
│   │   ├── contexts/             # React Context providers (AuthContext, UsersContext)
│   │   ├── pages/                # Application pages/views
│   │   ├── services/api.js       # Centralized API integration layer
│   │   └── utils/                # Utility functions and helpers
│   ├── vite.config.js        # Vite configuration with proxy to backend:5001
│   └── package.json          # Frontend dependencies
├── mobile_ui/               # React Native mobile application
│   ├── src/
│   │   ├── screens/              # Mobile screens (auth, home, subscriptions, profile)
│   │   ├── contexts/AuthContext.js # Mobile auth context with SecureStore
│   │   └── services/api.js       # Mobile API client matching frontend patterns
│   ├── package.json          # Mobile dependencies
│   ├── eas.json              # EAS Build configuration
│   └── COMPLETE_DOCUMENTATION.md # Comprehensive mobile documentation
├── deploy.sh                # Production deployment script
├── ecosystem.config.js      # PM2 process management configuration
└── nginx.conf              # Web server configuration
```

## API Architecture

The backend implements a RESTful API with role-based access control:

1. **Authentication** (`/api/auth/*`)
   - User registration with bcrypt password hashing
   - JWT token-based login system
   - 24-hour token expiration

2. **Subscription Management** (`/api/subscriptions/*`)
   - Role-based data filtering (admin sees all, users see shared only)
   - Subscription sharing with payment tracking
   - Full subscription amount always returned (not divided)

3. **User Management** (`/api/users/*`)
   - User profile retrieval and updates
   - Admin user management with role updates
   - Protected by JWT middleware

### Key API Features
- **Automatic Payment Tracking**: payment_details records created when subscription_sharing.payment_date is set
- **Subscription Sharing**: Cost sharing between multiple users with payment status tracking  
- **Role-based Access**: Different data views for admin vs regular users

## Environment Configuration

The backend supports multiple environment configurations through the `ENV_FILE` environment variable:

**Development** (`backend/.env`):
- Local database connection
- Development JWT secret
- Port 5001 for backend server

**Production** (`backend/.env.prod`):
- Production database configuration
- Secure JWT secret
- Production optimizations

Required environment variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database connection
- `JWT_SECRET` - Token signing key
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default 3000, development uses 5001)

## Component Patterns & Architecture

### Frontend Component Patterns
- **Component Decomposition**: Large forms split into focused, reusable sections
- **Logo Component Integration**: Centralized Logo component with size and variant props used across authentication pages
- **Configuration-Driven Components**: Components behavior defined through config objects
- **Feature-Based Organization**: Components grouped by domain rather than by type
- **Service Layer Abstraction**: API calls abstracted through domain-specific service functions

### Authentication Flow
- Email or phone number login support in AuthContext
- Automatic token injection via axios interceptors
- Global 401 error handling with automatic logout and redirect
- Persistent authentication state with localStorage

### Mobile Architecture
- **Cross-platform**: Single codebase for iOS and Android using Expo
- **Secure Storage**: Expo SecureStore for JWT tokens (replaces localStorage)
- **Navigation**: React Navigation with tab and stack navigators
- **API Compatibility**: Same API endpoints as React frontend

## Development Workflow

### Development Server Configuration
- **Backend**: Express server on port 5001 (development) / configurable via .env
- **Frontend**: Vite dev server on port 5000 with API proxy to backend:5001
- **Mobile**: Expo dev server with Metro bundler

### Vite Configuration
The frontend uses Vite with:
- Path aliasing (`@/` maps to `./src`)
- Tailwind CSS plugin integration
- API proxy configuration for seamless development
- Source maps enabled for debugging

### Production Deployment
- **PM2 Process Manager**: Cluster mode with automatic scaling and restart
- **Build Pipeline**: Automated frontend build, dependency installation, database setup
- **Health Monitoring**: Automatic health checks with rollback on failure
- **Nginx Configuration**: Reverse proxy setup with SSL, caching, and security headers

## Security Implementation

- JWT tokens for stateless authentication
- bcryptjs for password hashing with salt rounds
- Rate limiting: 100 requests per 15 minutes per IP (production only)
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- SQL injection prevention via prepared statements
- Secure database connection with SSL

## Testing the System

The system includes a working backend with comprehensive API endpoints. To test:

1. **Start the backend**: `npm run dev` (uses .env) or `npm run start:prod` (uses .env.prod)
2. **Start the frontend**: `npm run dev` (runs on port 5000 with API proxy)
3. **Start mobile app**: `npm start` in mobile_ui directory
4. **Test endpoints**: API available at `http://localhost:5001` for development
5. **Production deployment**: Use `./deploy.sh` for full production setup with PM2