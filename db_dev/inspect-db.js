const { Pool } = require('pg');

const pool = new Pool({
  host: '103.154.233.148',
  port: 5432,
  database: 'subsync',
  user: 'sathish',
  password: 'Sathish@09',
  ssl: false
});

async function inspectDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful\n');

    // Get list of tables
    console.log('=== TABLES ===');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('Available tables:', tables.join(', '));
    console.log('\n');

    // Get detailed structure for each table
    for (const tableName of tables) {
      console.log(`=== TABLE: ${tableName.toUpperCase()} ===`);
      
      // Get column information
      const columnsResult = await pool.query(`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);

      console.log('Columns:');
      columnsResult.rows.forEach(col => {
        const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultVal}`);
      });

      // Get constraints
      const constraintsResult = await pool.query(`
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.table_schema = 'public' AND tc.table_name = $1;
      `, [tableName]);

      if (constraintsResult.rows.length > 0) {
        console.log('Constraints:');
        constraintsResult.rows.forEach(constraint => {
          if (constraint.constraint_type === 'FOREIGN KEY') {
            console.log(`  ${constraint.constraint_name}: FOREIGN KEY (${constraint.column_name}) -> ${constraint.foreign_table_name}(${constraint.foreign_column_name})`);
          } else {
            console.log(`  ${constraint.constraint_name}: ${constraint.constraint_type} (${constraint.column_name})`);
          }
        });
      }

      // Get indexes
      const indexesResult = await pool.query(`
        SELECT 
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE tablename = $1 AND schemaname = 'public';
      `, [tableName]);

      if (indexesResult.rows.length > 0) {
        console.log('Indexes:');
        indexesResult.rows.forEach(index => {
          console.log(`  ${index.indexname}: ${index.indexdef}`);
        });
      }

      console.log('\n');
    }

    console.log('Database inspection completed successfully');
    
  } catch (error) {
    console.error('Error inspecting database:', error.message);
  } finally {
    await pool.end();
  }
}

inspectDatabase();