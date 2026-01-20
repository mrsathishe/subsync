# Production Database Setup Guide

This document provides step-by-step instructions for setting up the SubSync production database with all required tables and constraints.

## Prerequisites

- PostgreSQL 12+ server access
- Database administrator privileges
- Connection details for your production database

## Database Schema Overview

The SubSync application requires the following core tables:
- `users` - User authentication and profiles
- `subscriptions` - Main subscription records
- `subscription_sharing` - Cost sharing between users
- `ids_sharing_users` - Login credential sharing

## Step 1: Create Database Sequences

Before creating tables, ensure the required sequences exist:

```sql
-- Create sequences for auto-incrementing IDs
CREATE SEQUENCE IF NOT EXISTS users_id_seq;
CREATE SEQUENCE IF NOT EXISTS subscriptions_id_seq;
CREATE SEQUENCE IF NOT EXISTS subscription_sharing_id_seq;
CREATE SEQUENCE IF NOT EXISTS ids_sharing_users_id_seq;
```

## Step 2: Create Core Tables

### Users Table
```sql
CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    date_of_birth date,
    gender character varying(20) COLLATE pg_catalog."default",
    role character varying(20) COLLATE pg_catalog."default" DEFAULT 'user'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_phone_key UNIQUE (phone),
    CONSTRAINT users_gender_check CHECK (gender::text = ANY (ARRAY['male'::character varying::text, 'female'::character varying::text, 'other'::character varying::text, 'prefer_not_to_say'::character varying::text])),
    CONSTRAINT users_role_check CHECK (role::text = ANY (ARRAY['user'::character varying::text, 'admin'::character varying::text]))
);
```

### Subscriptions Table
```sql
CREATE TABLE IF NOT EXISTS public.subscriptions
(
    id integer NOT NULL DEFAULT nextval('subscriptions_id_seq'::regclass),
    service_name character varying(255) COLLATE pg_catalog."default",
    category character varying(100) COLLATE pg_catalog."default",
    owner_type character varying(50) COLLATE pg_catalog."default",
    owner_name character varying(255) COLLATE pg_catalog."default",
    login_username_phone character varying(255) COLLATE pg_catalog."default",
    password_encrypted text COLLATE pg_catalog."default",
    password_hint character varying(255) COLLATE pg_catalog."default",
    purchased_date timestamp without time zone,
    start_date timestamp without time zone,
    amount numeric(10,2),
    plan_type character varying(100) COLLATE pg_catalog."default",
    custom_duration_value integer,
    custom_duration_unit character varying(50) COLLATE pg_catalog."default",
    end_date timestamp without time zone,
    purchased_via character varying(100) COLLATE pg_catalog."default",
    auto_pay boolean,
    next_purchase_date timestamp without time zone,
    device_limit integer,
    devices_in_use integer,
    comments text COLLATE pg_catalog."default",
    ids_using boolean,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) COLLATE pg_catalog."default",
    "isSharing" boolean DEFAULT false,
    CONSTRAINT admin_subscriptions_pkey PRIMARY KEY (id)
);
```

### Subscription Sharing Table
```sql
CREATE TABLE IF NOT EXISTS public.subscription_sharing
(
    id integer NOT NULL DEFAULT nextval('subscription_sharing_id_seq'::regclass),
    subscription_id integer,
    user_id integer,
    name character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    payment_status character varying(50) COLLATE pg_catalog."default" DEFAULT 'not_paid'::character varying,
    payment_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT subscription_sharing_pkey PRIMARY KEY (id),
    CONSTRAINT subscription_sharing_subscription_id_fkey FOREIGN KEY (subscription_id)
        REFERENCES public.subscriptions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT subscription_sharing_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT subscription_sharing_payment_status_check CHECK (payment_status::text = ANY (ARRAY['paid'::character varying::text, 'not_paid'::character varying::text, 'pending'::character varying::text]))
);
```

### IDs Sharing Users Table
```sql
CREATE TABLE IF NOT EXISTS public.ids_sharing_users
(
    id integer NOT NULL DEFAULT nextval('ids_sharing_users_id_seq'::regclass),
    ids_sharing_id integer,
    user_id integer,
    name character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    "isCustom" boolean,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admin_subscription_users_pkey PRIMARY KEY (id),
    CONSTRAINT ids_sharing_users_ids_sharing_id_fkey FOREIGN KEY (ids_sharing_id)
        REFERENCES public.subscriptions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);
```

## Step 3: Create Indexes for Performance

```sql
-- Index for email lookups (users table)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Index for subscription queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_by ON public.subscriptions(created_by);
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON public.subscriptions(category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Index for subscription sharing queries
CREATE INDEX IF NOT EXISTS idx_subscription_sharing_subscription_id ON public.subscription_sharing(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_sharing_user_id ON public.subscription_sharing(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_sharing_payment_status ON public.subscription_sharing(payment_status);

-- Index for IDs sharing queries
CREATE INDEX IF NOT EXISTS idx_ids_sharing_users_ids_sharing_id ON public.ids_sharing_users(ids_sharing_id);
CREATE INDEX IF NOT EXISTS idx_ids_sharing_users_user_id ON public.ids_sharing_users(user_id);
```

## Step 4: Create Updated At Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for subscriptions table
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Set Up Payment Details Table (Optional)

If you want automatic payment tracking, create the payment details table:

```sql
CREATE TABLE IF NOT EXISTS public.payment_details
(
    id integer NOT NULL DEFAULT nextval('payment_details_id_seq'::regclass),
    subscription_sharing_id integer NOT NULL,
    payment_date date NOT NULL,
    amount numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_details_pkey PRIMARY KEY (id),
    CONSTRAINT payment_details_subscription_sharing_id_fkey FOREIGN KEY (subscription_sharing_id)
        REFERENCES public.subscription_sharing (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Create sequence for payment_details
CREATE SEQUENCE IF NOT EXISTS payment_details_id_seq;

-- Trigger function to create payment details automatically
CREATE OR REPLACE FUNCTION create_payment_detail()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create payment detail if payment_date is being set and payment_status is 'paid'
    IF NEW.payment_date IS NOT NULL AND NEW.payment_status = 'paid' THEN
        INSERT INTO public.payment_details (subscription_sharing_id, payment_date)
        VALUES (NEW.id, NEW.payment_date);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create payment details
CREATE TRIGGER subscription_sharing_payment_trigger
    AFTER INSERT OR UPDATE OF payment_date, payment_status ON public.subscription_sharing
    FOR EACH ROW
    EXECUTE FUNCTION create_payment_detail();
```

## Step 6: Create Sample Data (Optional)

### Sample Admin User
```sql
-- Create sample admin user (password: 'admin123' - change in production!)
INSERT INTO public.users (email, password_hash, first_name, last_name, role) 
VALUES (
    'admin@subsync.com',
    '$2b$10$8K1p/a0dLN73K2tF6QAOt.Vr4kXXvYKq4xXK6PQOEWOz1QTZl8JLa', -- admin123
    'System',
    'Administrator',
    'admin'
) ON CONFLICT (email) DO NOTHING;
```

### Sample Subscription Categories
```sql
-- Insert sample subscription categories if needed
INSERT INTO public.subscriptions (service_name, category, owner_type, amount, status) 
VALUES 
    ('Netflix', 'OTT', 'subscription', 199.00, 'active'),
    ('Jio Prepaid', 'Mobile', 'prepaid', 399.00, 'active'),
    ('Airtel Broadband', 'Broadband', 'postpaid', 999.00, 'active')
ON CONFLICT DO NOTHING;
```

## Step 7: Verify Setup

Run these queries to verify your setup:

```sql
-- Check table creation
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'subscriptions', 'subscription_sharing', 'ids_sharing_users');

-- Check constraints
SELECT constraint_name, table_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'subscriptions', 'subscription_sharing', 'ids_sharing_users');

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'subscriptions', 'subscription_sharing', 'ids_sharing_users');
```

## Environment Configuration

Update your production environment variables in `backend/.env.prod`:

```env
# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=subsync_production
DB_USER=your-db-user
DB_PASSWORD=your-secure-password

# SSL Configuration for Production
DB_SSL=true

# Application Configuration
NODE_ENV=production
JWT_SECRET=your-very-secure-jwt-secret-key
PORT=3000
```

## Security Recommendations

1. **Change Default Passwords**: Update any sample admin passwords immediately
2. **Database User Permissions**: Create a dedicated database user with minimal required permissions
3. **SSL/TLS**: Enable SSL connections for all database communications
4. **Backup Strategy**: Set up automated backups for your production database
5. **Monitor Performance**: Set up monitoring for slow queries and connection pooling

## Migration from Development

If migrating from development:

1. **Export Development Data**: Use `pg_dump` to export your development data
2. **Test Migration**: Run migration on a staging environment first
3. **Data Validation**: Verify all foreign key relationships and constraints
4. **Performance Testing**: Test query performance with production data volume

## Troubleshooting

### Common Issues

1. **Foreign Key Violations**: Ensure parent records exist before creating child records
2. **Sequence Issues**: Reset sequences if importing data: `SELECT setval('table_id_seq', (SELECT MAX(id) FROM table));`
3. **Permission Errors**: Grant appropriate permissions to your application database user
4. **Connection Limits**: Configure connection pooling to avoid connection limit issues

### Useful Commands

```sql
-- Reset sequence after data import
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('subscriptions_id_seq', (SELECT MAX(id) FROM subscriptions));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    most_common_vals
FROM pg_stats 
WHERE schemaname = 'public';

-- Monitor active connections
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';
```

---

**Note**: This setup guide is based on the current SubSync application requirements. Always test the setup in a staging environment before deploying to production.