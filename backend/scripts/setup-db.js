const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful!');
    console.log('Current time from database:', result.rows[0].current_time);
    
    // Check if tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    const tablesResult = await client.query(tablesQuery);
    console.log('\nExisting tables:', tablesResult.rows.map(row => row.table_name));
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function createTables() {
  try {
    console.log('\n🔧 Creating database tables...');
    const client = await pool.connect();
    
    // Read and execute schema
    const fs = require('fs');
    const schema = fs.readFileSync('./database/schema.sql', 'utf8');
    
    await client.query(schema);
    console.log('✅ Tables created successfully!');
    
    // Verify tables were created
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    const tablesResult = await client.query(tablesQuery);
    console.log('Created tables:', tablesResult.rows.map(row => row.table_name));
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    return false;
  }
}

async function insertSampleData() {
  try {
    console.log('\n📝 Inserting sample subscription plans...');
    const client = await pool.connect();
    
    const samplePlans = [
      {
        name: 'Basic Plan',
        description: 'Essential features for individual users',
        price: 9.99,
        billing_cycle: 'monthly',
        features: JSON.stringify(['Basic streaming', 'SD quality', '1 device'])
      },
      {
        name: 'Premium Plan',
        description: 'Advanced features for families',
        price: 19.99,
        billing_cycle: 'monthly',
        features: JSON.stringify(['HD streaming', 'Multiple devices', 'Download content'])
      },
      {
        name: 'Annual Basic',
        description: 'Basic plan with annual discount',
        price: 99.99,
        billing_cycle: 'yearly',
        features: JSON.stringify(['Basic streaming', 'SD quality', '1 device', '2 months free'])
      }
    ];
    
    for (const plan of samplePlans) {
      await client.query(
        'INSERT INTO subscription_plans (name, description, price, billing_cycle, features) VALUES ($1, $2, $3, $4, $5)',
        [plan.name, plan.description, plan.price, plan.billing_cycle, plan.features]
      );
    }
    
    console.log('✅ Sample subscription plans inserted!');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
    return false;
  }
}

async function main() {
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }
  
  const tablesCreated = await createTables();
  if (!tablesCreated) {
    process.exit(1);
  }
  
  await insertSampleData();
  
  console.log('\n🎉 Database setup complete!');
  process.exit(0);
}

main();