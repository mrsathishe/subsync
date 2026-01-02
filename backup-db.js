const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables from backend/.env
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function backupDatabase() {
  try {
    console.log('🔄 Starting database backup...');
    
    // Get all table names
    const tablesResult = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    const tables = tablesResult.rows.map(row => row.tablename);
    console.log(`📋 Found ${tables.length} tables:`, tables.join(', '));
    
    let backupSql = '';
    
    // Add header
    backupSql += `-- SubSync Database Backup\n`;
    backupSql += `-- Generated on: ${new Date().toISOString()}\n`;
    backupSql += `-- Database: ${process.env.DB_NAME}\n\n`;
    
    // Export table schemas and data
    for (const table of tables) {
      console.log(`📤 Backing up table: ${table}`);
      
      // Get table data first (simpler approach)
      const dataResult = await pool.query(`SELECT * FROM ${table}`);
      
      // Add table comment
      backupSql += `\n-- Table: ${table}\n`;
      
      if (dataResult.rows.length > 0) {
        const columns = Object.keys(dataResult.rows[0]);
        
        for (const row of dataResult.rows) {
          const values = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
            return val;
          });
          
          backupSql += `INSERT INTO ${table} (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
        }
        backupSql += '\n';
      }
    }
    
    // Save backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `subsync_backup_${timestamp}.sql`;
    const filepath = path.join(__dirname, filename);
    
    fs.writeFileSync(filepath, backupSql);
    console.log(`✅ Database backup completed successfully!`);
    console.log(`📁 Backup saved to: ${filepath}`);
    console.log(`📊 Backup size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

backupDatabase();