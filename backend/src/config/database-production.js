const { Pool } = require('pg');

// Production-optimized database pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 0,
  statement_timeout: 30000,
  query_timeout: 30000,
  application_name: 'subsync_app'
});

// Connection event handlers
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});

// Test database connection with retry logic
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      console.log('✅ Database connection test successful');
      return true;
    } catch (error) {
      console.error(`❌ Database connection test failed (attempt ${i + 1}):`, error.message);
      if (i === retries - 1) {
        console.error('❌ All database connection attempts failed');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// Enhanced query method with error handling
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query executed:', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('❌ Database query error:', {
      error: error.message,
      query: text,
      params: params,
      duration
    });
    throw error;
  }
};

// Initialize connection test
testConnection();

module.exports = {
  query,
  pool,
  testConnection,
  end: () => pool.end()
};