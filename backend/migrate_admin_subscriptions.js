const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function createAdminSubscriptionSchema() {
  try {
    // Create admin_subscriptions table with all required attributes
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_subscriptions (
        id SERIAL PRIMARY KEY,
        service_name VARCHAR(255) NOT NULL,
        category VARCHAR(20) CHECK (category IN ('OTT', 'Mobile', 'Broadband')),
        owner_type VARCHAR(20) CHECK (owner_type IN ('Me', 'Friend', 'Mom', 'Dad', 'Wife', 'Sister', 'Other')),
        owner_name VARCHAR(100),
        login_username_phone VARCHAR(255),
        password_encrypted TEXT,
        password_hint VARCHAR(255),
        purchased_date DATE NOT NULL,
        start_date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        plan_type VARCHAR(20) CHECK (plan_type IN ('Monthly', '3 Months', '6 Months', 'Yearly', 'Custom')),
        custom_duration_value INTEGER,
        custom_duration_unit VARCHAR(10) CHECK (custom_duration_unit IN ('days', 'months', 'years')),
        end_date DATE NOT NULL,
        purchased_via VARCHAR(50) CHECK (purchased_via IN ('GPay', 'Redeem Points', 'Credit Card', 'UPI', 'Net Banking', 'Cash', 'Other')),
        auto_pay BOOLEAN DEFAULT false,
        next_purchase_date DATE,
        device_limit INTEGER DEFAULT 1,
        devices_in_use INTEGER DEFAULT 0,
        ids_using TEXT[],
        comments TEXT,
        shared BOOLEAN DEFAULT false,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'paused'))
      )
    `);

    // Create subscription_sharing table for shared subscriptions
    await db.query(`
      CREATE TABLE IF NOT EXISTS subscription_sharing (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER REFERENCES admin_subscriptions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        non_registered_name VARCHAR(100),
        non_registered_email VARCHAR(255),
        shared_amount DECIMAL(10,2) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'not_paid' CHECK (payment_status IN ('paid', 'not_paid', 'pending')),
        payment_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_subscriptions_category ON admin_subscriptions(category);
      CREATE INDEX IF NOT EXISTS idx_admin_subscriptions_status ON admin_subscriptions(status);
      CREATE INDEX IF NOT EXISTS idx_admin_subscriptions_created_by ON admin_subscriptions(created_by);
      CREATE INDEX IF NOT EXISTS idx_admin_subscriptions_end_date ON admin_subscriptions(end_date);
      CREATE INDEX IF NOT EXISTS idx_admin_subscriptions_next_purchase ON admin_subscriptions(next_purchase_date);
      
      CREATE INDEX IF NOT EXISTS idx_subscription_sharing_subscription_id ON subscription_sharing(subscription_id);
      CREATE INDEX IF NOT EXISTS idx_subscription_sharing_user_id ON subscription_sharing(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscription_sharing_payment_status ON subscription_sharing(payment_status);
    `);

    // Create trigger for updating updated_at timestamp
    await db.query(`
      CREATE OR REPLACE FUNCTION update_admin_subscription_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_admin_subscriptions_updated_at ON admin_subscriptions;
      CREATE TRIGGER update_admin_subscriptions_updated_at 
        BEFORE UPDATE ON admin_subscriptions 
        FOR EACH ROW EXECUTE FUNCTION update_admin_subscription_updated_at();

      DROP TRIGGER IF EXISTS update_subscription_sharing_updated_at ON subscription_sharing;
      CREATE TRIGGER update_subscription_sharing_updated_at 
        BEFORE UPDATE ON subscription_sharing 
        FOR EACH ROW EXECUTE FUNCTION update_admin_subscription_updated_at();
    `);

    // Create a view for easy subscription management with sharing info
    await db.query(`
      CREATE OR REPLACE VIEW admin_subscription_summary AS
      SELECT 
        ads.*,
        CASE 
          WHEN ads.shared = true THEN 
            (SELECT COUNT(*) FROM subscription_sharing WHERE subscription_id = ads.id)
          ELSE 0 
        END as total_shared_users,
        CASE 
          WHEN ads.shared = true THEN 
            (SELECT COUNT(*) FROM subscription_sharing 
             WHERE subscription_id = ads.id AND payment_status = 'paid')
          ELSE 0 
        END as paid_shared_users,
        u.email as created_by_email,
        u.first_name || ' ' || u.last_name as created_by_name
      FROM admin_subscriptions ads
      LEFT JOIN users u ON ads.created_by = u.id
    `);

    console.log('Admin subscription schema created successfully!');
    console.log('Created tables: admin_subscriptions, subscription_sharing');
    console.log('Created view: admin_subscription_summary');
    console.log('Created indexes and triggers');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

createAdminSubscriptionSchema();