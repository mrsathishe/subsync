# Database Configuration

## Local PostgreSQL Database Details

**Connection Information:**
- **Host:** 103.154.233.148
- **Port:** 5432
- **Database Name:** subsync
- **Username:** sathish
- **Password:** Sathish@09

**Environment Configuration:**
```bash
DB_HOST=103.154.233.148
DB_PORT=5432
DB_NAME=subsync
DB_USER=sathish
DB_PASSWORD=Sathish@09
```

**Usage Notes:**
- This configuration is for local development and testing
- Ensure the database server is accessible from your network
- Update the backend `.env` file with these credentials for local development
- For production deployment, use the production database configuration from `.env.prod`

**Testing Connection:**
You can test the database connection using the backend setup script:
```bash
cd ../backend
node scripts/setup-db.js
```

## Database Schema

### Tables Overview
The subsync database contains 4 main tables:
- `users` - User authentication and profiles
- `subscriptions` - Main subscription records
- `subscription_sharing` - Cost sharing between users
- `ids_sharing_users` - Login credential sharing

### Table Structures

#### 1. users
User authentication and profile management table.

**Columns:**
- `id` (integer, PRIMARY KEY, auto-increment)
- `email` (varchar(255), NOT NULL, UNIQUE)
- `password_hash` (varchar(255), NOT NULL)
- `first_name` (varchar(100), NOT NULL)
- `last_name` (varchar(100), NOT NULL)
- `phone` (varchar(20), UNIQUE)
- `date_of_birth` (date)
- `gender` (varchar(20))
- `role` (varchar(20), DEFAULT 'user')
- `is_active` (boolean, DEFAULT true)
- `created_at` (timestamp, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (timestamp, DEFAULT CURRENT_TIMESTAMP)

**Constraints:**
- PRIMARY KEY: `users_pkey` (id)
- UNIQUE: `users_email_key` (email)
- UNIQUE: `users_phone_key` (phone)

**Indexes:**
- `idx_users_email` (email)
- `idx_users_phone` (phone)
- `idx_users_role` (role)

#### 2. subscriptions
Main subscription records with comprehensive service details.

**Columns:**
- `id` (integer, PRIMARY KEY, auto-increment)
- `service_name` (varchar(255))
- `category` (varchar(100))
- `owner_type` (varchar(50))
- `owner_name` (varchar(255))
- `login_username_phone` (varchar(255))
- `password_encrypted` (text)
- `password_hint` (varchar(255))
- `purchased_date` (timestamp)
- `start_date` (timestamp)
- `amount` (numeric)
- `plan_type` (varchar(100))
- `custom_duration_value` (integer)
- `custom_duration_unit` (varchar(50))
- `end_date` (timestamp)
- `purchased_via` (varchar(100))
- `auto_pay` (boolean)
- `next_purchase_date` (timestamp)
- `device_limit` (integer)
- `devices_in_use` (integer)
- `comments` (text)
- `ids_using` (boolean)
- `created_by` (integer)
- `created_at` (timestamp, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (timestamp, DEFAULT CURRENT_TIMESTAMP)
- `status` (varchar(50))
- `isSharing` (boolean, DEFAULT false)

**Constraints:**
- PRIMARY KEY: `admin_subscriptions_pkey` (id)

#### 3. subscription_sharing
Cost sharing management between users for subscriptions.

**Columns:**
- `id` (integer, PRIMARY KEY, auto-increment)
- `subscription_id` (integer, FOREIGN KEY → subscriptions.id)
- `user_id` (integer, FOREIGN KEY → users.id)
- `name` (varchar(255))
- `email` (varchar(255))
- `payment_status` (varchar(50), DEFAULT 'not_paid')
- `payment_date` (date)
- `created_at` (timestamp, DEFAULT CURRENT_TIMESTAMP)

**Constraints:**
- PRIMARY KEY: `subscription_sharing_pkey` (id)
- FOREIGN KEY: `subscription_sharing_subscription_id_fkey` (subscription_id → subscriptions.id)
- FOREIGN KEY: `subscription_sharing_user_id_fkey` (user_id → users.id)

#### 4. ids_sharing_users
Login credential sharing management for subscriptions.

**Columns:**
- `id` (integer, PRIMARY KEY, auto-increment)
- `ids_sharing_id` (integer, FOREIGN KEY → subscriptions.id)
- `user_id` (integer)
- `name` (varchar(255))
- `email` (varchar(255))
- `isCustom` (boolean)
- `created_at` (timestamp, DEFAULT CURRENT_TIMESTAMP)

**Constraints:**
- PRIMARY KEY: `admin_subscription_users_pkey` (id)
- FOREIGN KEY: `ids_sharing_users_ids_sharing_id_fkey` (ids_sharing_id → subscriptions.id)

### Relationships
- `subscription_sharing.subscription_id` → `subscriptions.id`
- `subscription_sharing.user_id` → `users.id`  
- `ids_sharing_users.ids_sharing_id` → `subscriptions.id`

### Database Inspection Script
Run the database inspection script to get current table structures:
```bash
cd db_dev
node inspect-db.js
```