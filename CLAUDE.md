# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SubSync is a subscription management system designed for OTT and telecom services. The project follows a multi-component architecture with a fully implemented Node.js/Express backend and placeholder directories for frontend and mobile UI applications.

## Frontend Implementation

The frontend is a modern React application built with Vite, featuring:

- **React 19** with hooks and functional components
- **React Router v7** for client-side routing
- **Tailwind CSS v4** with custom design system
- **React Aria Components** for accessible UI primitives
- **Untitled UI** design patterns and utilities
- **Axios** for HTTP client communication with backend API
- **Vite 7.2.4** with HMR and API proxy to backend

### Frontend Architecture

The application follows a modular, feature-based architecture with:

1. **Pages** (`src/pages/`)
   - DashboardPage - User subscription overview
   - LoginPage & RegisterPage - Authentication flows
   - SubscriptionsPage - Subscription management with modular components
   - AdminDashboard - Administrative interface
   - ManageUsers - User management (admin only)

2. **Feature-Based Component Organization**
   - `adminsubscription/` - Modular form sections (BasicInformation, LoginInformation, SubscriptionDetails, DeviceUsage, SharingSection)
   - `subscription/` - Page components (PageHeader, StatsSection, FiltersSection, SubscriptionsTable, CellRenderers)
   - `manageUser/` - User management components (UserTable, PageHeader, Pagination)
   - `ui/` - Base UI components (Button, Input, Modal, etc.)

3. **State Management**
   - AuthContext for global authentication state with localStorage persistence
   - Local component state for UI interactions
   - API state managed through direct axios calls with custom hooks

4. **API Integration** (`src/services/`)
   - Domain-separated API functions (authAPI, subscriptionAPI, adminAPI, userAPI)
   - Centralized axios configuration with 10-second timeout
   - Automatic JWT token injection via request interceptors
   - Global authentication error handling (401/403 redirects)
   - Advanced user search with debouncing

5. **Configuration-Driven Development** (`src/utils/adminHelpers.js`)
   - Helper functions that generate component configurations
   - Data transformation and formatting utilities
   - Reusable patterns for stats cards, filters, and table configurations

6. **Design System** (`src/components/styles.jsx`)
   - Atomic design components with Tailwind CSS v4
   - Consistent spacing and styling patterns (`mb-4`, `gap-2`, `gap-4`)
   - Variant-based component system (primary/secondary/danger)
   - Responsive grid layouts with proper alignment

## Backend Implementation

The backend is a complete Express.js API server with PostgreSQL database integration, featuring:

- JWT-based authentication system
- Subscription management with plans and user subscriptions
- User profile management
- Secure database operations with prepared statements
- Production-ready security middleware (Helmet, CORS, rate limiting)

### Database Configuration

The backend connects to a Supabase PostgreSQL database with advanced features:

**Schema Design:**
- `users` - User authentication and profiles with role-based access
- `subscription_plans` - Available subscription plans with JSONB features
- `user_subscriptions` - Active user subscriptions with lifecycle management
- `payments` - Payment transaction history

**Advanced Features:**
- PostgreSQL indexes for performance optimization
- Automatic `updated_at` timestamp triggers
- Foreign key constraints with CASCADE deletes
- JSONB fields for flexible feature storage

Database connection details are stored in `.env` file in the backend directory.

## Common Development Commands

### Backend Development
```bash
cd backend
npm install                    # Install dependencies
npm run dev                   # Start development server with auto-reload
npm start                     # Start production server
node scripts/setup-db.js     # Initialize database schema and sample data
```

### Frontend Development
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                   # Start Vite development server with HMR
npm run build                 # Build for production
npm run lint                  # Run ESLint for code quality
npm run preview              # Preview production build locally
```

### Database Operations
The database setup script (`scripts/setup-db.js`) will:
- Test database connection
- Create all required tables
- Insert sample subscription plans
- Verify table creation

## Project Structure

```
subsync/
├── backend/                   # Complete Express.js API server
│   ├── server.js             # Main application entry point
│   ├── src/
│   │   ├── config/database.js    # PostgreSQL connection config
│   │   ├── middleware/auth.js    # JWT authentication middleware
│   │   └── routes/               # API route handlers
│   │       ├── auth.js           # Registration/login endpoints
│   │       ├── subscriptions.js # Subscription management
│   │       └── users.js          # User profile operations
│   ├── database/schema.sql   # Complete database schema
│   ├── scripts/setup-db.js  # Database initialization script
│   └── .env                  # Database credentials and JWT config
├── frontend/                 # Modern React web application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   └── ui/               # Base UI components (Button, Input, etc.)
│   │   ├── contexts/             # React Context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Application pages/views
│   │   ├── providers/            # Theme and routing providers
│   │   ├── routes/               # Routing configuration
│   │   ├── services/             # API service layer
│   │   ├── styles/               # Tailwind CSS theme and global styles
│   │   └── utils/                # Utility functions and helpers
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite bundler configuration
├── mobile_ui/               # Mobile interface (placeholder)
└── docs/                    # Business requirements PDFs
```

## API Architecture

The backend implements a RESTful API with three main domains:

1. **Authentication** (`/api/auth/*`)
   - User registration with bcrypt password hashing
   - JWT token-based login system
   - 24-hour token expiration

2. **Subscription Management** (`/api/subscriptions/*`)
   - Public endpoint for viewing available plans
   - Authenticated endpoints for user subscriptions
   - Subscription lifecycle management (create, cancel)

3. **User Management** (`/api/users/*`)
   - User profile retrieval and updates
   - Protected by JWT middleware

4. **Admin Management** (`/api/admin/*`)
   - User management with role updates
   - Subscription plan administration
   - Analytics and reporting

## Development Workflow

### Development Server Configuration
- **Backend**: Express server on port 3000
- **Frontend**: Vite dev server on port 5173 with API proxy
- **API Proxy**: Frontend `/api/*` requests automatically proxied to `http://localhost:3000`

### Vite Configuration
The frontend uses Vite with:
- Path aliasing (`@/` maps to `./src`)
- Tailwind CSS plugin integration
- Source maps enabled for debugging
- Proxy configuration for seamless API development

### Code Quality
- **ESLint**: Modern flat config with React hooks and refresh plugins
- **Target**: ES2020 with JSX support
- **Custom Rules**: Unused variables pattern matching for constants

## Architectural Patterns

### Frontend Patterns
- **Component Decomposition**: Large forms split into focused, reusable sections (e.g., AdminSubscriptionForm → BasicInformation, LoginInformation, etc.)
- **Configuration-Driven Components**: Components behavior defined through config objects from `adminHelpers.js`
- **Composition Over Inheritance**: Complex components built from smaller, focused primitives
- **Feature-Based Organization**: Components grouped by domain rather than by type
- **Consistent Interface Patterns**: Standardized props (`formData`, `errors`, `onChange`) across similar components
- **Service Layer Abstraction**: API calls abstracted through domain-specific service functions
- **Custom Hooks Integration**: Data fetching and state management through reusable hooks

### Component Styling Principles
- **Spacing Consistency**: Use `mb-4` (16px), `mb-6` (24px), `gap-2` (8px), `gap-4` (16px) for consistent vertical and horizontal spacing
- **Grid Layouts**: Default to 2-column grids (`grid-cols-2`) with single column on mobile
- **Alignment**: Use empty labels (`<Label>&nbsp;</Label>`) or proper container structure for field alignment
- **Responsive Design**: Mobile-first approach with `md:` breakpoints for larger screens

### Backend Patterns
- **Middleware-first architecture** with security, logging, and rate limiting
- **Route separation** by domain (auth, subscriptions, users, admin)
- **Database abstraction** through centralized query helpers
- **Global error handling** middleware

## Security Implementation

- JWT tokens for stateless authentication
- bcryptjs for password hashing with salt rounds
- Rate limiting: 100 requests per 15 minutes per IP
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- SQL injection prevention via prepared statements

## Environment Configuration

The backend requires these environment variables in `backend/.env`:
- Database connection details (Supabase PostgreSQL)
- JWT secret key for token signing
- PORT and NODE_ENV settings

## Development Status

- ✅ **Backend**: Fully implemented with database integration
- ✅ **Frontend**: Modern React application with complete UI and functionality
- ⏳ **Mobile UI**: Directory structure only
- ❌ **Testing**: No test framework currently implemented
- ❌ **CI/CD**: No automated deployment pipeline

### Missing Development Infrastructure
- **Testing Framework**: No Jest, Vitest, or other testing setup
- **Code Formatting**: No Prettier configuration
- **Pre-commit Hooks**: No automated code quality checks
- **CI/CD Pipeline**: No GitHub Actions or deployment automation
- **Containerization**: No Docker configuration
- **API Documentation**: No Swagger/OpenAPI documentation

When working on mobile components, consult the business requirements in the `docs/` directory and use the backend API endpoints. The frontend demonstrates proper API integration patterns that can be referenced for mobile development.

## Testing the Backend

The system includes a working test user and sample subscription plans. Use curl commands or API testing tools to interact with endpoints at `http://localhost:3000` when the development server is running.