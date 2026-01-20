const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ==================== ADMIN ONLY ROUTES ====================

// Get all users (Admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT 
        id,
        email,
        first_name,
        last_name,
        phone,
        role,
        is_active,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const countQuery = 'SELECT COUNT(*) FROM users';
    
    const [result, countResult] = await Promise.all([
      db.query(query, [limit, offset]),
      db.query(countQuery)
    ]);
    
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);
    
    res.json({
      users: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role (Admin only)
router.put('/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const query = 'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, role';
    const result = await db.query(query, [role, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User role updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user status (Admin only)
router.put('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const query = 'UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, is_active';
    const result = await db.query(query, [isActive, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User status updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription plans (Admin only)
router.get('/plans', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT 
        category,
        plan_type,
        COUNT(*) as usage_count,
        AVG(amount) as avg_amount
      FROM subscriptions 
      WHERE category IS NOT NULL AND plan_type IS NOT NULL
      GROUP BY category, plan_type
      ORDER BY category, plan_type
    `;
    
    const result = await db.query(query);
    res.json({ plans: result.rows });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard analytics (Admin only)
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const queries = {
      totalUsers: 'SELECT COUNT(*) as count FROM users',
      activeUsers: 'SELECT COUNT(*) as count FROM users WHERE is_active = true',
      totalSubscriptions: 'SELECT COUNT(*) as count FROM subscriptions',
      activeSubscriptions: 'SELECT COUNT(*) as count FROM subscriptions WHERE status = \'active\'',
      totalRevenue: 'SELECT COALESCE(SUM(amount), 0) as total FROM subscriptions WHERE status = \'active\'',
      categoryCounts: `
        SELECT category, COUNT(*) as count 
        FROM subscriptions 
        WHERE category IS NOT NULL 
        GROUP BY category 
        ORDER BY count DESC
      `,
      recentSignups: `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      `,
      paymentStats: `
        SELECT 
          payment_status,
          COUNT(*) as count,
          COALESCE(SUM(s.amount), 0) as total_amount
        FROM subscription_sharing ss
        JOIN subscriptions s ON ss.subscription_id = s.id
        GROUP BY payment_status
      `
    };
    
    const results = await Promise.all([
      db.query(queries.totalUsers),
      db.query(queries.activeUsers),
      db.query(queries.totalSubscriptions),
      db.query(queries.activeSubscriptions),
      db.query(queries.totalRevenue),
      db.query(queries.categoryCounts),
      db.query(queries.recentSignups),
      db.query(queries.paymentStats)
    ]);
    
    const analytics = {
      totalUsers: parseInt(results[0].rows[0].count),
      activeUsers: parseInt(results[1].rows[0].count),
      totalSubscriptions: parseInt(results[2].rows[0].count),
      activeSubscriptions: parseInt(results[3].rows[0].count),
      totalRevenue: parseFloat(results[4].rows[0].total),
      categoryBreakdown: results[5].rows,
      recentSignups: parseInt(results[6].rows[0].count),
      paymentStatistics: results[7].rows
    };
    
    res.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system health (Admin only)
router.get('/system/health', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const dbHealthQuery = 'SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\'';
    const dbHealth = await db.query(dbHealthQuery);
    
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    res.json({
      system: {
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
        },
        database: {
          tables: parseInt(dbHealth.rows[0].table_count),
          status: 'connected'
        },
        environment: process.env.NODE_ENV || 'development',
        version: process.version
      }
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export logs (Admin only)
router.get('/logs/export', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const type = req.query.type || 'all'; // 'users', 'subscriptions', or 'all'
    
    let queries = [];
    
    if (type === 'users' || type === 'all') {
      queries.push(`
        SELECT 'user_created' as event_type, 
               first_name || ' ' || last_name as details,
               email,
               created_at as timestamp
        FROM users 
        ORDER BY created_at DESC
        LIMIT ${limit}
      `);
    }
    
    if (type === 'subscriptions' || type === 'all') {
      queries.push(`
        SELECT 'subscription_created' as event_type,
               service_name as details,
               created_by::text as email,
               created_at as timestamp
        FROM subscriptions 
        ORDER BY created_at DESC
        LIMIT ${limit}
      `);
    }
    
    const query = queries.join(' UNION ALL ') + ' ORDER BY timestamp DESC';
    const result = await db.query(query);
    
    res.json({
      logs: result.rows,
      exported_at: new Date().toISOString(),
      type: type
    });
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;