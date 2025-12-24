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

async function addOttDetailsColumn() {
  try {
    // Check if ott_details column exists
    const checkColumn = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_subscriptions' AND column_name = 'ott_details'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('Adding ott_details column to user_subscriptions...');
      
      // Add ott_details column as JSONB to store flexible OTT-specific data
      await db.query(`
        ALTER TABLE user_subscriptions 
        ADD COLUMN ott_details JSONB
      `);
      
      // Create index for better performance on JSONB queries
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_user_subscriptions_ott_details 
        ON user_subscriptions USING gin (ott_details)
      `);
      
      console.log('OTT details column added successfully!');
    } else {
      console.log('OTT details column already exists.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

addOttDetailsColumn();