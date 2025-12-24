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

async function createProviderBasedSchema() {
  try {
    // Create providers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) CHECK (type IN ('OTT', 'MOBILE', 'BROADBAND')),
        status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
        logo_url TEXT,
        website_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for providers
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_providers_type ON providers(type);
      CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);
    `);

    // Update subscription_plans to include provider_id
    const checkProviderColumn = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'subscription_plans' AND column_name = 'provider_id'
    `);
    
    if (checkProviderColumn.rows.length === 0) {
      await db.query(`
        ALTER TABLE subscription_plans 
        ADD COLUMN provider_id INTEGER REFERENCES providers(id);
      `);
      
      await db.query(`
        ALTER TABLE subscription_plans 
        ADD COLUMN plan_metadata JSONB;
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_subscription_plans_provider_id ON subscription_plans(provider_id);
        CREATE INDEX IF NOT EXISTS idx_subscription_plans_metadata ON subscription_plans USING gin (plan_metadata);
      `);
    }

    // Insert sample OTT providers
    const providersData = [
      { name: 'Netflix', type: 'OTT', logo_url: 'https://logo.netflix.com', website_url: 'https://netflix.com' },
      { name: 'Disney+', type: 'OTT', logo_url: 'https://logo.disneyplus.com', website_url: 'https://disneyplus.com' },
      { name: 'Amazon Prime Video', type: 'OTT', logo_url: 'https://logo.primevideo.com', website_url: 'https://primevideo.com' },
      { name: 'Hulu', type: 'OTT', logo_url: 'https://logo.hulu.com', website_url: 'https://hulu.com' },
      { name: 'HBO Max', type: 'OTT', logo_url: 'https://logo.hbomax.com', website_url: 'https://hbomax.com' },
      { name: 'Apple TV+', type: 'OTT', logo_url: 'https://logo.appletv.com', website_url: 'https://tv.apple.com' },
      { name: 'Verizon', type: 'MOBILE', logo_url: 'https://logo.verizon.com', website_url: 'https://verizon.com' },
      { name: 'AT&T', type: 'MOBILE', logo_url: 'https://logo.att.com', website_url: 'https://att.com' },
      { name: 'Comcast Xfinity', type: 'BROADBAND', logo_url: 'https://logo.xfinity.com', website_url: 'https://xfinity.com' },
      { name: 'Spectrum', type: 'BROADBAND', logo_url: 'https://logo.spectrum.com', website_url: 'https://spectrum.com' }
    ];

    for (const provider of providersData) {
      await db.query(`
        INSERT INTO providers (name, type, logo_url, website_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [provider.name, provider.type, provider.logo_url, provider.website_url]);
    }

    // Update existing plans to have provider_id
    const ottProviders = await db.query(`
      SELECT id, name FROM providers WHERE type = 'OTT'
    `);
    
    const mobileProviders = await db.query(`
      SELECT id, name FROM providers WHERE type = 'MOBILE'
    `);
    
    const broadbandProviders = await db.query(`
      SELECT id, name FROM providers WHERE type = 'BROADBAND'
    `);

    // Update existing plans with provider relationships
    if (ottProviders.rows.length > 0) {
      await db.query(`
        UPDATE subscription_plans 
        SET provider_id = $1
        WHERE category = 'OTT' AND provider_id IS NULL
      `, [ottProviders.rows[0].id]);
    }

    if (mobileProviders.rows.length > 0) {
      await db.query(`
        UPDATE subscription_plans 
        SET provider_id = $1
        WHERE category = 'Mobile' AND provider_id IS NULL
      `, [mobileProviders.rows[0].id]);
    }

    if (broadbandProviders.rows.length > 0) {
      await db.query(`
        UPDATE subscription_plans 
        SET provider_id = $1
        WHERE category = 'Broadband' AND provider_id IS NULL
      `, [broadbandProviders.rows[0].id]);
    }

    // Create OTT subscription details table for storing user-specific OTT data
    await db.query(`
      CREATE TABLE IF NOT EXISTS ott_subscription_details (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER REFERENCES user_subscriptions(id) ON DELETE CASCADE,
        account_email VARCHAR(255),
        account_password_hint VARCHAR(100),
        profile_name VARCHAR(100),
        simultaneous_streams INTEGER DEFAULT 1,
        video_quality VARCHAR(20) DEFAULT 'HD' CHECK (video_quality IN ('SD', 'HD', 'FHD', '4K')),
        download_enabled BOOLEAN DEFAULT false,
        shared_with JSONB,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_ott_details_subscription_id ON ott_subscription_details(subscription_id);
    `);

    console.log('Provider-based schema created successfully!');
    console.log(`Inserted ${providersData.length} providers`);
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

createProviderBasedSchema();