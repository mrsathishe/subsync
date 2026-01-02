require('dotenv').config();
const db = require('../src/config/database');

async function createIdsUsingTable() {
  try {
    console.log('Creating admin_subscription_users table...');
    
    // Create a proper table for ids_using relationships
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_subscription_users (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER REFERENCES admin_subscriptions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        custom_name VARCHAR(255),
        custom_email VARCHAR(255),
        is_registered BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(subscription_id, user_id, custom_name, custom_email)
      )
    `);
    
    console.log('✅ admin_subscription_users table created');
    
    // Create indexes for better performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_subscription_users_subscription_id ON admin_subscription_users(subscription_id);
      CREATE INDEX IF NOT EXISTS idx_admin_subscription_users_user_id ON admin_subscription_users(user_id);
    `);
    
    console.log('✅ Indexes created');
    
    // Migrate existing JSON data to the new table
    console.log('Migrating existing ids_using data...');
    
    const existingData = await db.query(`
      SELECT id, ids_using 
      FROM admin_subscriptions 
      WHERE ids_using IS NOT NULL AND ids_using != '[]'::jsonb
    `);
    
    for (const row of existingData.rows) {
      const subscriptionId = row.id;
      let idsUsingData = [];
      
      try {
        idsUsingData = typeof row.ids_using === 'string' 
          ? JSON.parse(row.ids_using) 
          : row.ids_using;
      } catch (error) {
        console.error(`Error parsing ids_using for subscription ${subscriptionId}:`, error);
        continue;
      }
      
      if (Array.isArray(idsUsingData)) {
        for (const user of idsUsingData) {
          await db.query(`
            INSERT INTO admin_subscription_users 
            (subscription_id, user_id, custom_name, custom_email, is_registered)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING
          `, [
            subscriptionId,
            user.userId || null,
            user.name || null,
            user.email || null,
            user.isRegistered || false
          ]);
        }
      }
    }
    
    console.log(`✅ Migrated data for ${existingData.rows.length} subscriptions`);
    
    // Now we can drop the ids_using column from admin_subscriptions
    console.log('Dropping ids_using column...');
    await db.query('ALTER TABLE admin_subscriptions DROP COLUMN IF EXISTS ids_using');
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

createIdsUsingTable();