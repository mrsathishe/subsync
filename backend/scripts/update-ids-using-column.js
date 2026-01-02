require('dotenv').config();
const db = require('../src/config/database');

async function updateColumnType() {
  try {
    console.log('Step 1: Getting the view definition...');
    let viewDefinition = null;
    try {
      const viewDef = await db.query(`SELECT definition FROM pg_views WHERE viewname = 'admin_subscription_summary'`);
      if (viewDef.rows.length > 0) {
        viewDefinition = viewDef.rows[0].definition;
        console.log('View definition found');
      }
    } catch (e) {
      console.log('View query error, continuing...');
    }
    
    if (viewDefinition) {
      console.log('Step 2: Dropping the view...');
      await db.query('DROP VIEW IF EXISTS admin_subscription_summary');
    }
    
    console.log('Step 3: Changing column type to JSONB...');
    await db.query(`ALTER TABLE admin_subscriptions ALTER COLUMN ids_using TYPE JSONB USING COALESCE(ids_using::TEXT::JSONB, '[]'::JSONB)`);
    
    if (viewDefinition) {
      console.log('Step 4: Recreating the view...');
      await db.query(`CREATE VIEW admin_subscription_summary AS ${viewDefinition}`);
    }
    
    // Verify the change
    const columnInfo = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'admin_subscriptions' AND column_name = 'ids_using'
    `);
    
    console.log('✅ Updated column info:', columnInfo.rows[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

updateColumnType();