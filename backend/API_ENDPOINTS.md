# SubSync API Endpoints

Base URL: `http://localhost:3000/api`

## API Endpoints Overview

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/verify-user` - Verify user identity for password reset
- `POST /auth/reset-password` - Reset password after verification

### User Management
- `GET /users/profile` - Get current user's profile
- `PUT /users/profile` - Update current user's profile
- `GET /users` - Get all users (Admin only)
- `PUT /users/:userId/role` - Update user role (Admin only)
- `PUT /users/:userId/status` - Toggle user active status (Admin only)
- `GET /users/search` - Search users by name (Admin only)

### Subscription Plans
- `GET /subscriptions/plans` - Get all active subscription plans
- `GET /subscriptions/plans/categories` - Get plans grouped by category
- `GET /subscriptions/admin/plans` - Get all plans including inactive (Admin only)
- `POST /subscriptions/admin/plans` - Create new subscription plan (Admin only)
- `PUT /subscriptions/admin/plans/:planId` - Update subscription plan (Admin only)

### User Subscriptions
- `GET /subscriptions/my-subscriptions` - Get current user's subscriptions
- `POST /subscriptions/subscribe` - Subscribe to a plan
- `PUT /subscriptions/:subscriptionId/cancel` - Cancel subscription
- `GET /subscriptions/admin/subscriptions` - Get all user subscriptions (Admin only)
- `GET /subscriptions/admin/analytics` - Get subscription analytics (Admin only)

### Admin Subscriptions
- `GET /admin/subscriptions` - Get all admin subscriptions with filtering
- `GET /admin/subscriptions/dashboard` - Get dashboard statistics
- `GET /admin/subscriptions/:id` - Get subscription by ID with sharing details (Admin only)
- `POST /admin/subscriptions` - Create new admin subscription (Admin only)
- `PUT /admin/subscriptions/:id` - Update admin subscription (Admin only)
- `DELETE /admin/subscriptions/:id` - Delete admin subscription (Admin only)
- `PUT /admin/subscriptions/:id/sharing` - Update sharing details (Admin only)

### OTT Details
- `GET /ott/providers` - Get all OTT providers
- `POST /ott/providers` - Create new OTT provider (Admin only)
- `PUT /ott/providers/:id` - Update OTT provider (Admin only)
- `DELETE /ott/providers/:id` - Delete OTT provider (Admin only)
- `GET /ott/subscription-details` - Get OTT subscription details for current user
- `POST /ott/subscription-details` - Create OTT subscription details
- `PUT /ott/subscription-details/:id` - Update OTT subscription details
- `DELETE /ott/subscription-details/:id` - Delete OTT subscription details

### Health Check
- `GET /health` - Check API server status

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Health Check

### GET /health
**Description:** Check API server status  
**Authentication:** None  
**Response:** 
```json
{
  "status": "OK",
  "message": "SubSync API is running"
}
```

---

## Authentication Endpoints

### POST /auth/register
**Description:** Register a new user  
**Authentication:** None  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

### POST /auth/login
**Description:** Login user  
**Authentication:** None  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /auth/verify-user
**Description:** Verify user identity for password reset  
**Authentication:** None  
**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

### POST /auth/reset-password
**Description:** Reset password after verification  
**Authentication:** None  
**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "newPassword": "newpassword123"
}
```

---

## User Management

### GET /users/profile
**Description:** Get current user's profile  
**Authentication:** Required (User/Admin)

### PUT /users/profile
**Description:** Update current user's profile  
**Authentication:** Required (User/Admin)  
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### GET /users
**Description:** Get all users with pagination  
**Authentication:** Required (Admin only)  
**Query Parameters:** `page`, `limit`

### PUT /users/:userId/role
**Description:** Update user role  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "role": "admin"
}
```

### PUT /users/:userId/status
**Description:** Toggle user active status  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "isActive": true
}
```

### GET /users/search
**Description:** Search users by name  
**Authentication:** Required (Admin only)  
**Query Parameters:** `q` (search query)

---

## Subscription Plans

### GET /subscriptions/plans
**Description:** Get all active subscription plans  
**Authentication:** None  
**Query Parameters:** `category` (optional)

### GET /subscriptions/plans/categories
**Description:** Get subscription plans grouped by category  
**Authentication:** None

### GET /subscriptions/admin/plans
**Description:** Get all subscription plans (including inactive)  
**Authentication:** Required (Admin only)

### POST /subscriptions/admin/plans
**Description:** Create new subscription plan  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "name": "Premium Plan",
  "description": "Full access to all features",
  "price": 29.99,
  "billingCycle": "monthly",
  "features": ["feature1", "feature2"],
  "category": "OTT"
}
```

### PUT /subscriptions/admin/plans/:planId
**Description:** Update subscription plan  
**Authentication:** Required (Admin only)

---

## User Subscriptions

### GET /subscriptions/my-subscriptions
**Description:** Get current user's subscriptions  
**Authentication:** Required (User/Admin)

### POST /subscriptions/subscribe
**Description:** Subscribe to a plan  
**Authentication:** Required (User/Admin)  
**Request Body:**
```json
{
  "planId": 1,
  "ottDetails": {
    "username": "user123",
    "password": "pass123"
  }
}
```

### PUT /subscriptions/:subscriptionId/cancel
**Description:** Cancel subscription  
**Authentication:** Required (User/Admin)

### GET /subscriptions/admin/subscriptions
**Description:** Get all user subscriptions  
**Authentication:** Required (Admin only)  
**Query Parameters:** `page`, `limit`

### GET /subscriptions/admin/analytics
**Description:** Get subscription analytics  
**Authentication:** Required (Admin only)

---

## Admin Subscriptions

### GET /admin/subscriptions
**Description:** Get all admin subscriptions with filtering and pagination  
**Authentication:** Required (User/Admin)  
**Query Parameters:** `page`, `limit`, `category`, `status`, `shared`, `owner_type`, `search`

### GET /admin/subscriptions/dashboard
**Description:** Get dashboard statistics  
**Authentication:** Required (User/Admin)

### GET /admin/subscriptions/:id
**Description:** Get subscription by ID with sharing details  
**Authentication:** Required (Admin only)

### POST /admin/subscriptions
**Description:** Create new admin subscription  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "serviceName": "Netflix",
  "category": "OTT",
  "ownerType": "personal",
  "ownerName": "John Doe",
  "loginUsernamePhone": "user@example.com",
  "password": "password123",
  "passwordHint": "birthdate",
  "purchasedDate": "2024-01-01",
  "startDate": "2024-01-01",
  "amount": 15.99,
  "planType": "Monthly",
  "purchasedVia": "website",
  "autoPay": true,
  "deviceLimit": 4,
  "devicesInUse": 2,
  "idsUsing": "user1, user2",
  "comments": "Family plan",
  "shared": true,
  "sharingDetails": []
}
```

### PUT /admin/subscriptions/:id
**Description:** Update admin subscription  
**Authentication:** Required (Admin only)

### DELETE /admin/subscriptions/:id
**Description:** Delete admin subscription  
**Authentication:** Required (Admin only)

### PUT /admin/subscriptions/:id/sharing
**Description:** Update sharing details  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "sharingDetails": [
    {
      "userId": 1,
      "paymentStatus": "paid",
      "paymentDate": "2024-01-01"
    }
  ]
}
```

---

## OTT Details

### GET /ott/providers
**Description:** Get all OTT providers  
**Authentication:** Required (User/Admin)

### POST /ott/providers
**Description:** Create new OTT provider  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "name": "Netflix",
  "description": "Streaming service",
  "category": "Entertainment",
  "website": "https://netflix.com",
  "logoUrl": "https://example.com/logo.png"
}
```

### PUT /ott/providers/:id
**Description:** Update OTT provider  
**Authentication:** Required (Admin only)

### DELETE /ott/providers/:id
**Description:** Delete OTT provider  
**Authentication:** Required (Admin only)

### GET /ott/subscription-details
**Description:** Get OTT subscription details for current user  
**Authentication:** Required (User/Admin)

### POST /ott/subscription-details
**Description:** Create OTT subscription details  
**Authentication:** Required (User/Admin)  
**Request Body:**
```json
{
  "providerId": 1,
  "username": "user123",
  "password": "pass123",
  "planType": "Premium",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "monthlyPrice": 15.99,
  "isShared": false
}
```

### PUT /ott/subscription-details/:id
**Description:** Update OTT subscription details  
**Authentication:** Required (User/Admin)

### DELETE /ott/subscription-details/:id
**Description:** Delete OTT subscription details  
**Authentication:** Required (User/Admin)

---

## Response Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Authentication Roles

- **user** - Regular user with limited access
- **admin** - Administrator with full access

**Note:** Some endpoints marked as "User/Admin" are accessible to both roles, while "Admin only" endpoints require admin role.