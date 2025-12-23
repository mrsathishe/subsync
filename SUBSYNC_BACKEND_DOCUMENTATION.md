# SubSync Backend API Documentation

## Overview
SubSync is a subscription management system backend built with Node.js, Express.js, and PostgreSQL. The system provides comprehensive APIs for user authentication, subscription management, and user profile operations.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS, Rate Limiting

## Database Schema

### Tables Implemented

#### 1. Users Table
```sql
users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### 2. Subscription Plans Table
```sql
subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(50) NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### 3. User Subscriptions Table
```sql
user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_id INTEGER REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### 4. Payments Table
```sql
payments (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER REFERENCES user_subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Subscription Management Endpoints

#### GET /api/subscriptions/plans
Get all available subscription plans (public endpoint).

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Basic Plan",
    "description": "Essential features for individual users",
    "price": "9.99",
    "billing_cycle": "monthly",
    "features": ["Basic streaming", "SD quality", "1 device"]
  },
  {
    "id": 2,
    "name": "Premium Plan",
    "description": "Advanced features for families",
    "price": "19.99",
    "billing_cycle": "monthly",
    "features": ["HD streaming", "Multiple devices", "Download content"]
  }
]
```

#### GET /api/subscriptions/my-subscriptions
Get current user's subscriptions (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "status": "active",
    "start_date": "2023-12-23T10:00:00.000Z",
    "end_date": "2024-01-23T10:00:00.000Z",
    "auto_renew": true,
    "plan_name": "Premium Plan",
    "description": "Advanced features for families",
    "price": "19.99",
    "billing_cycle": "monthly"
  }
]
```

#### POST /api/subscriptions/subscribe
Subscribe to a plan (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "planId": 2
}
```

**Response (201):**
```json
{
  "message": "Subscription created successfully",
  "subscription": {
    "id": 1,
    "user_id": 1,
    "plan_id": 2,
    "status": "active",
    "start_date": "2023-12-23T10:00:00.000Z",
    "end_date": "2024-01-23T10:00:00.000Z",
    "auto_renew": true
  }
}
```

#### PUT /api/subscriptions/:subscriptionId/cancel
Cancel a subscription (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Subscription cancelled successfully",
  "subscription": {
    "id": 1,
    "status": "cancelled",
    "auto_renew": false
  }
}
```

### User Management Endpoints

#### GET /api/users/profile
Get current user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "created_at": "2023-12-23T10:00:00.000Z"
}
```

#### PUT /api/users/profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Smith",
    "phone": "+1987654321"
  }
}
```

### System Endpoints

#### GET /health
Health check endpoint to verify API status.

**Response (200):**
```json
{
  "status": "OK",
  "message": "SubSync API is running"
}
```

## Security Features Implemented

### 1. Authentication & Authorization
- JWT token-based authentication
- Protected routes requiring valid tokens
- Password hashing using bcryptjs with salt rounds
- Token expiration (24 hours)

### 2. Security Middleware
- **Helmet**: Sets various HTTP headers for security
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: JSON payload size limits (10MB)

### 3. Database Security
- Prepared statements to prevent SQL injection
- SSL connection to database in production
- User input sanitization

## Sample Data

### Subscription Plans
The system comes with pre-configured subscription plans:

1. **Basic Plan** - $9.99/month
   - Basic streaming
   - SD quality
   - 1 device

2. **Premium Plan** - $19.99/month
   - HD streaming
   - Multiple devices
   - Download content

3. **Annual Basic** - $99.99/year
   - Basic streaming
   - SD quality
   - 1 device
   - 2 months free

## Database Configuration

**Connection Details:**
- Host: `db.rnnesfwdgvdapiwobzex.supabase.co`
- Port: `5432`
- Database: `postgres`
- SSL: Required for production

## Environment Variables

```env
PORT=3000
NODE_ENV=development
DB_HOST=db.rnnesfwdgvdapiwobzex.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Theheros@09
JWT_SECRET=your_super_secret_jwt_key_here
API_VERSION=v1
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "User already exists"
}
```

#### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

#### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

#### 404 Not Found
```json
{
  "error": "Route not found"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Setup database and create tables
node scripts/setup-db.js
```

## Project Structure

```
backend/
├── server.js                    # Main application entry point
├── package.json                 # Dependencies and scripts
├── .env                        # Environment variables
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── database/
│   └── schema.sql              # Database schema definition
├── scripts/
│   └── setup-db.js             # Database setup script
└── src/
    ├── config/
    │   └── database.js         # Database connection configuration
    ├── middleware/
    │   └── auth.js             # JWT authentication middleware
    └── routes/
        ├── auth.js             # Authentication routes
        ├── subscriptions.js    # Subscription management routes
        └── users.js            # User management routes
```

## Testing Status

✅ **Database Connection**: Successfully connected to Supabase PostgreSQL  
✅ **Table Creation**: All tables created with proper relationships  
✅ **User Registration**: Working with JWT token generation  
✅ **User Login**: Working with JWT token validation  
✅ **Subscription Plans**: Successfully retrieving plans from database  
✅ **Health Check**: API status endpoint functional  
✅ **Security**: Rate limiting and CORS protection active  

## Next Steps for Enhancement

1. **Payment Integration**: Implement Stripe/PayPal payment processing
2. **Email Notifications**: Add email service for registration/subscription updates
3. **API Documentation**: Integrate Swagger/OpenAPI documentation
4. **Testing Suite**: Add unit and integration tests
5. **Logging**: Implement structured logging with Winston
6. **Monitoring**: Add health monitoring and metrics
7. **Admin Panel**: Create admin endpoints for managing users/subscriptions
8. **Webhooks**: Add webhook support for external integrations