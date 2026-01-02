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

### Subscriptions (Role-based access)
- `GET /subscriptions` - List subscriptions (Admin sees all, users see shared ones)
- `GET /subscriptions/:id` - Get single subscription by ID
- `POST /subscriptions` - Create new subscription (Admin only)
- `PUT /subscriptions/:id` - Update subscription (Admin only)
- `DELETE /subscriptions/:id` - Delete subscription (Admin only)

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

## Subscriptions

### GET /subscriptions
**Description:** List subscriptions with role-based filtering  
**Authentication:** Required (User/Admin)  
**Query Parameters:** `page`, `limit`, `category`, `status`, `idsUsing`, `isSharing`, `owner_type`, `search`
**Response:**
```json
{
  "subscriptions": [
    {
      "id": 1,
      "service_name": "Netflix",
      "category": "OTT",
      "owner_type": "Me",
      "owner_name": "John Doe",
      "amount": 15.99,
      "plan_type": "Monthly",
      "ids_using": true,
      "isSharing": false,
      "idsUsingDetails": [
        {
          "userId": 5,
          "name": "Jane Doe",
          "email": "jane@example.com",
          "isCustom": false
        }
      ],
      "sharingDetails": []
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalSubscriptions": 100,
    "limit": 20
  }
}
```

### GET /subscriptions/:id
**Description:** Get single subscription by ID with sharing details  
**Authentication:** Required (User/Admin)  
**Access Control:** Admin sees all, users only see subscriptions they're shared on

### POST /subscriptions
**Description:** Create new subscription  
**Authentication:** Required (Admin only)  
**Request Body:**
```json
{
  "serviceName": "Netflix",
  "category": "OTT",
  "ownerType": "Me",
  "ownerName": "John Doe",
  "loginUsernamePhone": "user@example.com",
  "password": "password123",
  "passwordHint": "birthdate",
  "purchasedDate": "2024-01-01",
  "startDate": "2024-01-01",
  "amount": 15.99,
  "planType": "Monthly",
  "purchasedVia": "Credit Card",
  "autoPay": true,
  "deviceLimit": 4,
  "devicesInUse": 2,
  "idsUsing": true,
  "isSharing": false,
  "comments": "Family plan",
  "idsUsingDetails": [
    {
      "userId": 5,
      "name": "Jane Doe",
      "email": "jane@example.com", 
      "isCustom": false
    }
  ],
  "sharingDetails": [
    {
      "userId": "8",
      "nonRegisteredName": "",
      "nonRegisteredEmail": "",
      "paymentStatus": "paid",
      "paymentDate": "2024-01-01"
    }
  ]
}
```

### PUT /subscriptions/:id
**Description:** Update subscription  
**Authentication:** Required (Admin only)

### DELETE /subscriptions/:id
**Description:** Delete subscription and all related sharing records  
**Authentication:** Required (Admin only)  
**Response:**
```json
{
  "message": "Subscription and all related sharing records deleted successfully",
  "deletedSubscriptionId": 1,
  "cascadedDeletions": {
    "idsUsingRecords": 3,
    "sharingRecords": 2
  }
}
```

---

## Database Tables

### Main Tables
- **subscriptions** - Main subscription data
- **users** - User accounts
- **ids_sharing_users** - IDs sharing system (who uses subscription IDs)
- **subscription_sharing** - Cost sharing system (who pays for subscriptions)

### Two Sharing Systems
1. **IDs Using** (`idsUsing` + `idsUsingDetails`):
   - Share subscription login credentials
   - Stored in `ids_sharing_users` table

2. **Cost Sharing** (`isSharing` + `sharingDetails`):
   - Share subscription costs/payments
   - Stored in `subscription_sharing` table

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

**Access Control:**
- Admin users can see and manage all subscriptions
- Regular users can only see subscriptions they have access to via sharing systems