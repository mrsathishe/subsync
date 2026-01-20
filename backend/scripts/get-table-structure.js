const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function getAllTableStructures() {
  try {
    // Get all table names
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 All Tables in Database:');
    console.log('=========================');
    
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      console.log(`\n🗂️  ${tableName.toUpperCase()} TABLE:`);
      console.log('─'.repeat(50));
      
      // Get column information for each table
      const columnsResult = await db.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      columnsResult.rows.forEach(row => {
        const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const length = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
        const defaultVal = row.column_default ? ` DEFAULT ${row.column_default}` : '';
        console.log(`  ${row.column_name}: ${row.data_type}${length} ${nullable}${defaultVal}`);
      });
      
      // Get foreign key relationships
      const fkResult = await db.query(`
        SELECT
          tc.constraint_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = $1
      `, [tableName]);
      
      if (fkResult.rows.length > 0) {
        console.log('  📎 Foreign Keys:');
        fkResult.rows.forEach(fk => {
          console.log(`    ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.end();
  }
}

getAllTableStructures();