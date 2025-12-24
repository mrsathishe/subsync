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

async function migrateCategoriesColumn() {
  try {
    // Check if category column exists
    const checkColumn = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscription_plans' AND column_name = 'category'
    `);
    
    if (checkColumn.rows.length === 0) {
      // Add category column
      console.log('Adding category column to subscription_plans...');
      await db.query(`
        ALTER TABLE subscription_plans 
        ADD COLUMN category VARCHAR(50) CHECK (category IN ('OTT', 'Mobile', 'Broadband'))
      `);
      
      // Set default category for existing plans
      await db.query(`
        UPDATE subscription_plans 
        SET category = 'OTT' 
        WHERE category IS NULL
      `);
      
      // Create index
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_subscription_plans_category 
        ON subscription_plans(category)
      `);
      
      console.log('Category column added successfully!');
    } else {
      console.log('Category column already exists.');
    }
    
    // Insert sample data with categories if no plans exist
    const plansCount = await db.query('SELECT COUNT(*) FROM subscription_plans');
    if (parseInt(plansCount.rows[0].count) === 0) {
      console.log('Adding sample subscription plans...');
      
      const samplePlans = [
        // OTT Plans
        {
          name: 'Netflix Basic',
          description: 'Stream on one device in standard definition',
          price: 8.99,
          billing_cycle: 'monthly',
          category: 'OTT',
          features: ['1 Screen', 'HD Quality', 'Unlimited Movies & TV Shows']
        },
        {
          name: 'Netflix Premium',
          description: 'Stream on four devices with Ultra HD quality',
          price: 17.99,
          billing_cycle: 'monthly',
          category: 'OTT',
          features: ['4 Screens', 'Ultra HD', 'Download Available', 'Unlimited Movies & TV Shows']
        },
        {
          name: 'Disney+ Annual',
          description: 'Disney, Pixar, Marvel, Star Wars, and National Geographic',
          price: 79.99,
          billing_cycle: 'yearly',
          category: 'OTT',
          features: ['Multiple Devices', 'HD Quality', 'Download Available', 'Disney Content']
        },
        
        // Mobile Plans
        {
          name: 'Mobile Basic',
          description: '2GB data with unlimited calls and texts',
          price: 25.00,
          billing_cycle: 'monthly',
          category: 'Mobile',
          features: ['2GB Data', 'Unlimited Calls', 'Unlimited SMS', '4G Network']
        },
        {
          name: 'Mobile Premium',
          description: 'Unlimited data with 5G access',
          price: 45.00,
          billing_cycle: 'monthly',
          category: 'Mobile',
          features: ['Unlimited Data', 'Unlimited Calls', 'Unlimited SMS', '5G Network', 'Hotspot']
        },
        
        // Broadband Plans
        {
          name: 'Home Internet Basic',
          description: '50 Mbps download speed for light usage',
          price: 39.99,
          billing_cycle: 'monthly',
          category: 'Broadband',
          features: ['50 Mbps Download', '10 Mbps Upload', 'No Data Cap', 'WiFi Router Included']
        },
        {
          name: 'Home Internet Pro',
          description: '200 Mbps download speed for heavy usage',
          price: 69.99,
          billing_cycle: 'monthly',
          category: 'Broadband',
          features: ['200 Mbps Download', '20 Mbps Upload', 'No Data Cap', 'WiFi Router Included', 'Priority Support']
        }
      ];
      
      for (const plan of samplePlans) {
        await db.query(`
          INSERT INTO subscription_plans (name, description, price, billing_cycle, category, features)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [plan.name, plan.description, plan.price, plan.billing_cycle, plan.category, JSON.stringify(plan.features)]);
      }
      
      console.log(`Added ${samplePlans.length} sample plans`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateCategoriesColumn();