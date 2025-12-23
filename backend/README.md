# SubSync Backend API

Express.js backend API for the SubSync subscription management system with PostgreSQL database.

## Features

- User authentication (register/login) with JWT
- Subscription management
- User profile management
- PostgreSQL database integration
- Security middleware (helmet, rate limiting, CORS)
- Environment-based configuration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database configuration
```

3. Set up PostgreSQL database:
```bash
# Create database
createdb subsync_db

# Run schema
psql -d subsync_db -f database/schema.sql
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Subscriptions
- `GET /api/subscriptions/plans` - Get all subscription plans
- `GET /api/subscriptions/my-subscriptions` - Get user's subscriptions (auth required)
- `POST /api/subscriptions/subscribe` - Subscribe to a plan (auth required)
- `PUT /api/subscriptions/:id/cancel` - Cancel subscription (auth required)

### Users
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update user profile (auth required)

### Health Check
- `GET /health` - API health check

## Project Structure

```
backend/
├── server.js                 # Main server file
├── database/
│   └── schema.sql            # Database schema
├── src/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   └── routes/
│       ├── auth.js          # Authentication routes
│       ├── subscriptions.js # Subscription routes
│       └── users.js         # User management routes
├── .env.example             # Environment variables template
└── package.json
```