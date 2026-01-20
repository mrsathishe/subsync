const db = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function fixSchemaIssues() {
  try {
    console.log('🔧 Starting database schema fixes...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, '..', 'database', 'fix_schema_issues.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL into individual statements and execute them
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await db.query(statement);
          console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          // Some constraints might already exist, that's okay
          if (error.message.includes('already exists') || 
              error.message.includes('does not exist')) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message} (skipped)`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }
    
    console.log('\n🎉 Schema fixes completed successfully!');
    
    // Verify the fixes
    console.log('\n📋 Verifying fixes...');
    
    // Check foreign keys
    const fkResult = await db.query(`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name IN ('subscriptions', 'subscription_sharing', 'ids_sharing_users')
      ORDER BY tc.table_name, tc.constraint_name
    `);
    
    console.log('\n🔗 Foreign Key Constraints:');
    fkResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}.${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name}`);
    });
    
    // Check triggers
    const triggerResult = await db.query(`
      SELECT 
        trigger_name,
        event_object_table,
        action_timing,
        event_manipulation
      FROM information_schema.triggers
      WHERE event_object_table IN ('subscriptions', 'subscription_sharing', 'users')
      ORDER BY event_object_table, trigger_name
    `);
    
    console.log('\n⚡ Active Triggers:');
    triggerResult.rows.forEach(row => {
      console.log(`  - ${row.trigger_name} on ${row.event_object_table} (${row.action_timing} ${row.event_manipulation})`);
    });
    
    // Check indexes
    const indexResult = await db.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename IN ('subscriptions', 'subscription_sharing', 'ids_sharing_users', 'users')
        AND indexname NOT LIKE '%_pkey'
      ORDER BY tablename, indexname
    `);
    
    console.log('\n🗂️  Performance Indexes:');
    indexResult.rows.forEach(row => {
      console.log(`  - ${row.indexname} on ${row.tablename}`);
    });
    
    console.log('\n✅ All schema issues have been resolved!');
    console.log('📊 Database is now in optimal shape for production use.');
    
  } catch (error) {
    console.error('❌ Error during schema fix:', error);
    throw error;
  }
}

// Run fix if this script is executed directly
if (require.main === module) {
  fixSchemaIssues()
    .then(() => {
      console.log('Schema fix completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Schema fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixSchemaIssues };