## Database Architecture (Single-Database Strategy)

### Confirmed Decision

**Only PostgreSQL will be used for the entire system** (users, subscriptions, plans, payments, and notifications).

### Rationale for PostgreSQL

* Strong ACID compliance (critical for subscriptions and payments)
* Excellent relational modeling for users, plans, and billing
* Native JSONB support for flexible plan attributes
* Mature ecosystem and free-tier hosting availability
* Simplified operations compared to multi-database setups

---

## High-Level Database Architecture

PostgreSQL will act as a **centralized relational datastore** with strict schema design and foreign key constraints.

Core domains:

* User & Authentication
* Providers & Plans
* Subscriptions
* Payments & Billing
* Notifications & Audit Logs

---

## Core Tables & Relationships

### 1. Users

```
users
-----
id (UUID, PK)
email (UNIQUE)
phone (UNIQUE, nullable)
password_hash
name
status (ACTIVE | BLOCKED | DELETED)
email_verified
phone_verified
created_at
updated_at
last_login_at
```

---

### 2. Providers

```
providers
---------
id (UUID, PK)
name
type (OTT | MOBILE | BROADBAND)
status
created_at
```

---

### 3. Plans

```
plans
-----
id (UUID, PK)
provider_id (FK -> providers.id)
name
category (OTT | MOBILE | BROADBAND)
price
billing_cycle (MONTHLY | QUARTERLY | YEARLY)
validity_days
plan_metadata (JSONB)
status
created_at
```

---

### 4. Subscriptions

```
subscriptions
-------------
id (UUID, PK)
user_id (FK -> users.id)
plan_id (FK -> plans.id)
provider_id (FK -> providers.id)
status (ACTIVE | EXPIRED | CANCELLED)
start_date
end_date
renewal_date
auto_renew
created_at
```

---

### 5. Subscription Members (Shared Subscriptions)

```
subscription_members
--------------------
id (UUID, PK)
subscription_id (FK -> subscriptions.id)
user_id (FK -> users.id)
role (OWNER | MEMBER)
created_at
```

---

### 6. Payments

```
payments
--------
id (UUID, PK)
subscription_id (FK -> subscriptions.id)
paid_by_user_id (FK -> users.id)
amount
currency
payment_date
due_date
status (PAID | PENDING | FAILED)
method
created_at
```

---

### 7. Notifications

```
notifications
-------------
id (UUID, PK)
user_id (FK -> users.id)
type (RENEWAL | PAYMENT | INFO)
message
read_status
created_at
```

---

## Indexing Strategy

Mandatory indexes:

* users(email)
* users(phone)
* subscriptions(user_id)
* subscriptions(renewal_date)
* payments(subscription_id)
* notifications(user_id, read_status)

---

## Transaction Management

PostgreSQL transactions will be used for:

* Subscription creation
* Renewal processing
* Payment confirmation
* Member assignment in shared subscriptions

---

## Background Jobs & Notifications

### Job Processing

* Tool: BullMQ with Redis
* Jobs:

  * Renewal reminders
  * Expiry detection
  * Failed payment retries

### Push Notifications

* Android: Firebase Cloud Messaging (FCM)

---

## Development & Deployment Strategy

### Development

* Local PostgreSQL (Docker or local install)
* Prisma ORM for schema migrations and type safety

### First Deployment (Free Tier)

* PostgreSQL: Supabase / Neon / Render
* Backend: Node.js on Render / Railway

---

## Technology Stack Summary

| Layer         | Technology               |
| ------------- | ------------------------ |
| Web Frontend  | React.js + TypeScript    |
| Mobile App    | React Native (Android)   |
| Backend       | Node.js + NestJS         |
| Database      | PostgreSQL               |
| ORM           | Prisma                   |
| Jobs / Queue  | Redis + BullMQ           |
| Notifications | Firebase Cloud Messaging |

---

## Key Technology Decisions

* Single-database architecture using PostgreSQL
* Strong relational modeling for subscriptions and billing
* JSONB used only for flexible plan attributes
* API-first backend serving web and mobile
* Free-tier friendly and production-scalable

---

## Next Steps

* Convert this document into PDF-ready architecture documentation
* Finalize Prisma schema
* Define API contracts
* Design UX wireframes for web and mobile
* Set up CI/CD and environment configuration
