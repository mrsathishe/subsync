const db = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function runPaymentDetailsMigration() {
  try {
    console.log('Starting payment_details table migration...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, '..', 'database', 'add_payment_details_table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Execute the SQL
    await db.query(sql);
    
    console.log('✅ payment_details table created successfully!');
    console.log('✅ Indexes created successfully!');
    console.log('✅ Triggers created successfully!');
    console.log('✅ Automatic payment_details creation is now active!');
    
    // Test the connection and verify table creation
    const result = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'payment_details' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 payment_details table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    // Verify triggers
    const triggerResult = await db.query(`
      SELECT trigger_name, event_manipulation, event_object_table
      FROM information_schema.triggers 
      WHERE event_object_table = 'payment_details' OR event_object_table = 'subscription_sharing'
      AND trigger_name LIKE '%payment_details%'
    `);
    
    console.log('\n🔧 Active triggers:');
    triggerResult.rows.forEach(row => {
      console.log(`  - ${row.trigger_name} on ${row.event_object_table} (${row.event_manipulation})`);
    });
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n💡 How it works:');
    console.log('   - When subscription_sharing.payment_date is set, a payment_details record is automatically created');
    console.log('   - The payment_details table tracks all payment information with proper foreign key relationships');
    console.log('   - Automatic timestamps and audit trail with created_by/updated_by fields');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runPaymentDetailsMigration()
    .then(() => {
      console.log('Migration script completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runPaymentDetailsMigration };