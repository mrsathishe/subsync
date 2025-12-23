# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SubSync is a subscription management system designed for OTT and telecom services. The project follows a multi-component architecture with a fully implemented Node.js/Express backend and placeholder directories for frontend and mobile UI applications.

## Backend Implementation

The backend is a complete Express.js API server with PostgreSQL database integration, featuring:

- JWT-based authentication system
- Subscription management with plans and user subscriptions
- User profile management
- Secure database operations with prepared statements
- Production-ready security middleware (Helmet, CORS, rate limiting)

### Database Configuration

The backend connects to a Supabase PostgreSQL database with the following schema:
- `users` - User authentication and profiles
- `subscription_plans` - Available subscription plans
- `user_subscriptions` - Active user subscriptions
- `payments` - Payment transaction history

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
├── frontend/                 # Web frontend (placeholder)
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
- ⏳ **Frontend**: Directory structure only
- ⏳ **Mobile UI**: Directory structure only

When working on frontend/mobile components, consult the business requirements in the `docs/` directory and use the backend API endpoints documented in `SUBSYNC_BACKEND_DOCUMENTATION.md`.

## Testing the Backend

The system includes a working test user and sample subscription plans. Use curl commands or API testing tools to interact with endpoints at `http://localhost:3000` when the development server is running.