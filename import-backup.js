const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Connect through SSH tunnel to new database
const pool = new Pool({
  user: 'sathish',
  host: 'localhost',
  database: 'subsync',
  password: 'Sathish@09',
  port: 5432,
});

async function importBackup() {
  try {
    console.log('🔄 Starting backup import to new database...');
    
    // Step 1: Check if schema exists, create if needed
    console.log('📋 Checking database schema...');
    
    const tableCheck = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tableCheck.rows[0].count === 0) {
      console.log('Creating database schema...');
      const schemaPath = path.join(__dirname, 'backend', 'database', 'schema.sql');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSQL);
      console.log('✅ Database schema created successfully');
    } else {
      console.log('✅ Database schema already exists');
    }
    
    // Step 1.5: Create additional tables from backup that aren't in basic schema
    console.log('📋 Creating additional tables...');
    
    const additionalTables = `
      -- Admin subscriptions table (from backup data)
      CREATE TABLE IF NOT EXISTS admin_subscriptions (
        id SERIAL PRIMARY KEY,
        service_name VARCHAR(255),
        category VARCHAR(100),
        owner_type VARCHAR(50),
        owner_name VARCHAR(255),
        login_username_phone VARCHAR(255),
        password_encrypted TEXT,
        password_hint VARCHAR(255),
        purchased_date TIMESTAMP,
        start_date TIMESTAMP,
        amount DECIMAL(10,2),
        plan_type VARCHAR(100),
        custom_duration_value INTEGER,
        custom_duration_unit VARCHAR(50),
        end_date TIMESTAMP,
        purchased_via VARCHAR(100),
        auto_pay BOOLEAN,
        next_purchase_date TIMESTAMP,
        device_limit INTEGER,
        devices_in_use INTEGER,
        comments TEXT,
        shared BOOLEAN,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS admin_subscription_users (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER,
        user_id INTEGER,
        custom_name VARCHAR(255),
        custom_email VARCHAR(255),
        is_registered BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS providers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ott_subscription_details (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subscription_sharing (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER,
        shared_with VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(additionalTables);
    console.log('✅ Additional tables created');
    
    // Step 2: Get the backup file
    const backupFiles = fs.readdirSync(__dirname).filter(f => f.startsWith('subsync_backup_') && f.endsWith('.sql'));
    if (backupFiles.length === 0) {
      throw new Error('No backup file found');
    }
    
    // Use the backup file with actual data (not empty)
    const backupFile = backupFiles.find(f => fs.statSync(path.join(__dirname, f)).size > 100) || backupFiles.sort().pop();
    console.log(`📂 Using backup file: ${backupFile}`);
    
    const backupSQL = fs.readFileSync(path.join(__dirname, backupFile), 'utf8');
    
    // Step 3: Parse and execute backup data (INSERT statements only)
    const lines = backupSQL.split('\n');
    const insertStatements = lines.filter(line => 
      line.trim().startsWith('INSERT INTO') && 
      !line.includes('-- Table:')
    );
    
    console.log(`📊 Found ${insertStatements.length} INSERT statements`);
    
    // Step 4: Execute each INSERT statement
    for (let i = 0; i < insertStatements.length; i++) {
      const statement = insertStatements[i];
      try {
        await pool.query(statement);
        if ((i + 1) % 10 === 0 || i === insertStatements.length - 1) {
          console.log(`✅ Imported ${i + 1}/${insertStatements.length} records`);
        }
      } catch (err) {
        console.warn(`⚠️ Skipping statement due to error: ${err.message}`);
        console.warn(`Statement: ${statement.substring(0, 100)}...`);
      }
    }
    
    // Step 5: Verify import
    console.log('\n🔍 Verifying import...');
    
    const tableQueries = [
      'SELECT COUNT(*) as count FROM users',
      'SELECT COUNT(*) as count FROM subscription_plans', 
      'SELECT COUNT(*) as count FROM user_subscriptions',
      'SELECT COUNT(*) as count FROM admin_subscriptions',
      'SELECT COUNT(*) as count FROM providers'
    ];
    
    for (const query of tableQueries) {
      try {
        const result = await pool.query(query);
        const tableName = query.match(/FROM (\w+)/)[1];
        console.log(`📊 ${tableName}: ${result.rows[0].count} records`);
      } catch (err) {
        // Table might not exist in new schema, skip
        const tableName = query.match(/FROM (\w+)/)[1];
        console.log(`📊 ${tableName}: table not found (expected for some tables)`);
      }
    }
    
    console.log('\n✅ Backup import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

importBackup();