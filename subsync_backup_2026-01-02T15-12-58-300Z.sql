-- SubSync Database Backup
-- Generated on: 2026-01-02T15:12:56.463Z
-- Database: postgres


-- Table: admin_subscription_users
INSERT INTO admin_subscription_users ("id", "subscription_id", "user_id", "custom_name", "custom_email", "is_registered", "created_at") VALUES (3, 9, NULL, 'sathish', NULL, false, '2025-12-25T03:51:55.661Z');
INSERT INTO admin_subscription_users ("id", "subscription_id", "user_id", "custom_name", "custom_email", "is_registered", "created_at") VALUES (4, 9, 8, 'user user', 'user1@gmail.com', true, '2025-12-25T03:51:55.731Z');
INSERT INTO admin_subscription_users ("id", "subscription_id", "user_id", "custom_name", "custom_email", "is_registered", "created_at") VALUES (5, 9, 5, 'user user', 'user@gmail.com', true, '2025-12-25T03:51:55.787Z');


-- Table: admin_subscriptions
INSERT INTO admin_subscriptions ("id", "service_name", "category", "owner_type", "owner_name", "login_username_phone", "password_encrypted", "password_hint", "purchased_date", "start_date", "amount", "plan_type", "custom_duration_value", "custom_duration_unit", "end_date", "purchased_via", "auto_pay", "next_purchase_date", "device_limit", "devices_in_use", "comments", "shared", "created_by", "created_at", "updated_at", "status") VALUES (9, 'Netflix', 'OTT', 'Me', 'test', 'stes', '$2b$10$fUbaOoqN1KNGD4lUEYEakOmTHnzAAxzqlKo3VLl5Q6ABgvjwFnpNu', 'ste', '2025-12-24T18:30:00.000Z', '2025-12-24T18:30:00.000Z', '2.96', 'Monthly', NULL, 'months', '2026-01-24T18:30:00.000Z', 'GPay', true, '2026-01-21T18:30:00.000Z', 1, 0, '', false, 6, '2025-12-25T03:51:55.595Z', '2025-12-25T03:51:55.595Z', 'active');
INSERT INTO admin_subscriptions ("id", "service_name", "category", "owner_type", "owner_name", "login_username_phone", "password_encrypted", "password_hint", "purchased_date", "start_date", "amount", "plan_type", "custom_duration_value", "custom_duration_unit", "end_date", "purchased_via", "auto_pay", "next_purchase_date", "device_limit", "devices_in_use", "comments", "shared", "created_by", "created_at", "updated_at", "status") VALUES (10, 'Amazn=on', 'OTT', 'Me', '', 'rte', '$2b$10$EvzdJpHxB7vKAU/wh/w4Gu5mYKvvxzR/6QJO0zW49rKhUk7el0cHS', 'sdf', '2025-12-24T18:30:00.000Z', '2025-12-24T18:30:00.000Z', '12.00', 'Monthly', NULL, 'months', '2026-01-24T18:30:00.000Z', 'Credit Card', true, '2026-01-21T18:30:00.000Z', 1, 0, '', true, 6, '2025-12-25T03:57:50.765Z', '2025-12-25T03:57:50.765Z', 'active');


-- Table: ott_subscription_details

-- Table: payments

-- Table: providers
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (1, 'Netflix', 'OTT', 'ACTIVE', 'https://logo.netflix.com', 'https://netflix.com', '2025-12-23T08:24:07.135Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (2, 'Disney+', 'OTT', 'ACTIVE', 'https://logo.disneyplus.com', 'https://disneyplus.com', '2025-12-23T08:24:07.227Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (3, 'Amazon Prime Video', 'OTT', 'ACTIVE', 'https://logo.primevideo.com', 'https://primevideo.com', '2025-12-23T08:24:07.318Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (4, 'Hulu', 'OTT', 'ACTIVE', 'https://logo.hulu.com', 'https://hulu.com', '2025-12-23T08:24:07.410Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (5, 'HBO Max', 'OTT', 'ACTIVE', 'https://logo.hbomax.com', 'https://hbomax.com', '2025-12-23T08:24:07.502Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (6, 'Apple TV+', 'OTT', 'ACTIVE', 'https://logo.appletv.com', 'https://tv.apple.com', '2025-12-23T08:24:07.593Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (7, 'Verizon', 'MOBILE', 'ACTIVE', 'https://logo.verizon.com', 'https://verizon.com', '2025-12-23T08:24:07.685Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (8, 'AT&T', 'MOBILE', 'ACTIVE', 'https://logo.att.com', 'https://att.com', '2025-12-23T08:24:07.776Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (9, 'Comcast Xfinity', 'BROADBAND', 'ACTIVE', 'https://logo.xfinity.com', 'https://xfinity.com', '2025-12-23T08:24:07.867Z');
INSERT INTO providers ("id", "name", "type", "status", "logo_url", "website_url", "created_at") VALUES (10, 'Spectrum', 'BROADBAND', 'ACTIVE', 'https://logo.spectrum.com', 'https://spectrum.com', '2025-12-23T08:24:07.959Z');


-- Table: subscription_plans
INSERT INTO subscription_plans ("id", "name", "description", "price", "billing_cycle", "features", "is_active", "created_at", "updated_at", "category", "provider_id", "plan_metadata") VALUES (1, 'Basic Plan', 'Essential features for individual users', '9.99', 'monthly', '["Basic streaming","SD quality","1 device"]', true, '2025-12-23T05:14:10.417Z', '2025-12-23T08:24:08.321Z', 'OTT', 1, NULL);
INSERT INTO subscription_plans ("id", "name", "description", "price", "billing_cycle", "features", "is_active", "created_at", "updated_at", "category", "provider_id", "plan_metadata") VALUES (2, 'Premium Plan', 'Advanced features for families', '19.99', 'monthly', '["HD streaming","Multiple devices","Download content"]', true, '2025-12-23T05:14:10.511Z', '2025-12-23T08:24:08.321Z', 'OTT', 1, NULL);
INSERT INTO subscription_plans ("id", "name", "description", "price", "billing_cycle", "features", "is_active", "created_at", "updated_at", "category", "provider_id", "plan_metadata") VALUES (3, 'Annual Basic', 'Basic plan with annual discount', '99.99', 'yearly', '["Basic streaming","SD quality","1 device","2 months free"]', true, '2025-12-23T05:14:10.604Z', '2025-12-23T08:24:08.321Z', 'OTT', 1, NULL);


-- Table: subscription_sharing
INSERT INTO subscription_sharing ("id", "subscription_id", "user_id", "non_registered_name", "non_registered_email", "shared_amount", "payment_status", "payment_date", "created_at", "updated_at") VALUES (3, 10, 5, NULL, NULL, '12.00', 'paid', '2025-12-23T18:30:00.000Z', '2025-12-25T03:57:50.809Z', '2025-12-25T03:57:50.809Z');


-- Table: user_subscriptions
INSERT INTO user_subscriptions ("id", "user_id", "plan_id", "status", "start_date", "end_date", "auto_renew", "created_at", "updated_at", "ott_details") VALUES (1, 6, 1, 'active', '2025-12-23T10:22:03.501Z', '2026-01-23T15:52:02.803Z', true, '2025-12-23T10:22:03.501Z', '2025-12-23T10:22:03.501Z', NULL);
INSERT INTO user_subscriptions ("id", "user_id", "plan_id", "status", "start_date", "end_date", "auto_renew", "created_at", "updated_at", "ott_details") VALUES (2, 6, 1, 'active', '2025-12-23T10:23:58.793Z', '2026-01-23T15:53:58.092Z', true, '2025-12-23T10:23:58.793Z', '2025-12-23T10:23:58.793Z', NULL);


-- Table: users
INSERT INTO users ("id", "email", "password_hash", "first_name", "last_name", "phone", "is_active", "created_at", "updated_at", "role", "date_of_birth", "gender") VALUES (3, 'admin@subsync.com', '$2b$10$iabURutkirG0fCaI9YAwiOvc0OnBMVTYgdKu6/15oYDhNvoJfoOFq', 'Admin', 'User', '+1234567891', true, '2025-12-23T07:43:09.166Z', '2025-12-23T07:43:27.107Z', 'admin', NULL, NULL);
INSERT INTO users ("id", "email", "password_hash", "first_name", "last_name", "phone", "is_active", "created_at", "updated_at", "role", "date_of_birth", "gender") VALUES (7, 'admin@test.com', '$2b$10$QWzObTEhV7Y0ssNaTVaALeikZt1iSg6gZ.OA1r4h8YYObvQbpp6Iy', 'Admin', 'User', '1234567890', true, '2025-12-24T09:33:36.718Z', '2025-12-24T09:37:15.993Z', 'admin', NULL, NULL);
INSERT INTO users ("id", "email", "password_hash", "first_name", "last_name", "phone", "is_active", "created_at", "updated_at", "role", "date_of_birth", "gender") VALUES (1, 'test@example.com', '$2b$10$afDAHn6iRbrmQdGE9T30sOC/iNPOnrh2kkGeV.qTaLGIClXpqQpuO', 'John', 'Doe', '+1234567890', false, '2025-12-23T05:17:33.442Z', '2025-12-24T14:16:15.780Z', 'user', NULL, NULL);
INSERT INTO users ("id", "email", "password_hash", "first_name", "last_name", "phone", "is_active", "created_at", "updated_at", "role", "date_of_birth", "gender") VALUES (9, '123@gmail.com', '$2b$10$WmLeaomq1h29rBQlM4RuyOf1s3BZIaqEuR7qqy6kExL8LJ76Z.TuG', 'new', 'admin', '322132', true, '2025-12-24T15:49:35.663Z', '2025-12-24T15:49:58.670Z', 'admin', '2025-12-10T18:30:00.000Z', 'female');
INSERT INTO users ("id", "email", "password_hash", "first_name", "last_name", "phone", "is_active", "created_at", "updated_at", "role", "date_of_birth", "gender") VALUES (5, 'user@gmail.com', '$2b$10$XBDxMu2BvJLLQ7vjbKa.lOG81fTz923oxxBVYW4OqiNCzdM/OP6jC', 'user', 'user', '12345', true, '2025-12-23T08:46:30.153Z', '2025-12-24T22:33:57.145Z', 'user', '1993-07-08T18:30:00.000Z', 'male');
INSERT INTO users ("id", "email", "password_hash", "first_name", "last_name", "phone", "is_active", "created_at", "updated_at", "role", "date_of_birth", "gender") VALUES (6, 'admin@gmail.com', '$2b$10$o1NJcR1alm.k8yAyU/pZ4ufLwSJLrTQJg6IsKawF06ivdChYNWRZi', 'admin', 'admin', '123344', true, '2025-12-23T08:47:39.511Z', '2025-12-24T23:02:17.804Z', 'admin', '1993-07-08T18:30:00.000Z', 'male');
INSERT INTO users ("id", "email", "password_hash", "first_name", "last_name", "phone", "is_active", "created_at", "updated_at", "role", "date_of_birth", "gender") VALUES (8, 'user1@gmail.com', '$2b$10$Y2YIKlLSAMuFVz5wSHdQW.Ma77gd1HQl1qqFeCqA6q4VFPI1DahPO', 'user', 'user', '21121', true, '2025-12-24T15:41:04.370Z', '2025-12-24T23:02:22.068Z', 'user', '2025-12-10T18:30:00.000Z', 'male');

