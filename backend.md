Backend Architecture Document 
Version: 1.0 
Prepared By: Sathish E 
Date: December 2025 
 
1. Introduction 
1.1 Purpose 
This document describes the backend architecture, services, APIs, and security mechanisms 
used in the SubSync platform. 
 
2. Technology Stack 
Layer  Technology 
Runtime  Node.js 
Framework  Express.js / NestJS 
Authentication  JWT 
Database  PostgreSQL, MongoDB 
Deployment  Docker 
 
3. Architecture Overview 
The backend follows a modular layered architecture: 
●  API Layer 
●  Authentication & Authorization Layer 
●  Business Logic Layer 
●  Data Access Layer 
 
4. Core Backend Modules 
4.1 Authentication Module 
●  User registration 
●  Login via email or phone 
●  Password encryption (bcrypt) 
●  Token generation and validation 
 
4.2 User Management Module 
●  Profile management 
●  Role assignment 
●  Account status management 
 
4.3 Subscription Module 
●  Create, update, delete subscriptions 
●  Fetch active and expired subscriptions 
●  Renewal date calculations 
 
4.4 Service Management Module (Admin) 
●  Manage OTT, Mobile, Broadband services 
●  Configure default plans 
●  Category mapping 
 
4.5 Notification Module 
●  Subscription renewal reminders 
●  Expiry alerts 
●  System announcements 
 
5. API Endpoint Overview 
Authentication 
●  POST /api/auth/register 
●  POST /api/auth/login 
User 
●  GET /api/users/profile 
●  PUT /api/users/profile 
Subscriptions 
●  POST /api/subscriptions 
●  GET /api/subscriptions 
●  PUT /api/subscriptions/{id} 
●  DELETE /api/subscriptions/{id} 
Admin 
●  POST /api/admin/services 
●  GET /api/admin/users 
 
6. Security 
●  JWT-based authorization 
●  Role-based access control 
●  Rate limiting 
●  Request validation 
 
