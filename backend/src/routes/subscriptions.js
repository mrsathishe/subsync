const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all subscription plans
router.get('/plans', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT id, name, description, price, billing_cycle, features, category FROM subscription_plans WHERE is_active = true';
    let params = [];
    
    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY category, price ASC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription plans by category
router.get('/plans/categories', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT category, 
             COUNT(*) as plan_count,
             JSON_AGG(
               JSON_BUILD_OBJECT(
                 'id', id,
                 'name', name,
                 'description', description,
                 'price', price,
                 'billing_cycle', billing_cycle,
                 'features', features
               )
             ) as plans
      FROM subscription_plans 
      WHERE is_active = true 
      GROUP BY category 
      ORDER BY category
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching plans by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's subscriptions
router.get('/my-subscriptions', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT us.id, us.status, us.start_date, us.end_date, us.auto_renew, us.ott_details,
             sp.name as plan_name, sp.description, sp.price, sp.billing_cycle, sp.category
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = $1
      ORDER BY us.created_at DESC
    `, [req.user.userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Subscribe to a plan
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { planId, ottDetails } = req.body;
    const userId = req.user.userId;

    // Check if plan exists and is active
    const planResult = await db.query(
      'SELECT id, name, price, billing_cycle, category FROM subscription_plans WHERE id = $1 AND is_active = true',
      [planId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found or inactive' });
    }

    const plan = planResult.rows[0];

    // Calculate end date based on billing cycle
    let endDate = new Date();
    if (plan.billing_cycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.billing_cycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Prepare OTT details if provided and plan is OTT category
    const ottDetailsJson = (plan.category === 'OTT' && ottDetails) ? JSON.stringify(ottDetails) : null;

    // Create subscription
    const subscriptionResult = await db.query(
      'INSERT INTO user_subscriptions (user_id, plan_id, end_date, ott_details) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, planId, endDate, ottDetailsJson]
    );

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: subscriptionResult.rows[0]
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel subscription
router.put('/:subscriptionId/cancel', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;

    // Update subscription status
    const result = await db.query(
      'UPDATE user_subscriptions SET status = $1, auto_renew = false WHERE id = $2 AND user_id = $3 RETURNING *',
      ['cancelled', subscriptionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: result.rows[0]
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin-only routes

// Get all subscription plans (Admin only - includes inactive plans)
router.get('/admin/plans', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, description, price, billing_cycle, features, category, is_active, created_at FROM subscription_plans ORDER BY category, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new subscription plan (Admin only)
router.post('/admin/plans', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, billingCycle, features, category } = req.body;

    const result = await db.query(
      'INSERT INTO subscription_plans (name, description, price, billing_cycle, features, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, billingCycle, JSON.stringify(features), category]
    );

    res.status(201).json({
      message: 'Subscription plan created successfully',
      plan: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription plan (Admin only)
router.put('/admin/plans/:planId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { planId } = req.params;
    const { name, description, price, billingCycle, features, category, isActive } = req.body;

    const result = await db.query(
      'UPDATE subscription_plans SET name = $1, description = $2, price = $3, billing_cycle = $4, features = $5, category = $6, is_active = $7 WHERE id = $8 RETURNING *',
      [name, description, price, billingCycle, JSON.stringify(features), category, isActive, planId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({
      message: 'Subscription plan updated successfully',
      plan: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all subscriptions (Admin only)
router.get('/admin/subscriptions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await db.query(`
      SELECT us.id, us.status, us.start_date, us.end_date, us.auto_renew, us.created_at,
             u.email, u.first_name, u.last_name,
             sp.name as plan_name, sp.price, sp.billing_cycle
      FROM user_subscriptions us
      JOIN users u ON us.user_id = u.id
      JOIN subscription_plans sp ON us.plan_id = sp.id
      ORDER BY us.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await db.query('SELECT COUNT(*) FROM user_subscriptions');
    const totalSubscriptions = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalSubscriptions / limit);

    res.json({
      subscriptions: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalSubscriptions,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching admin subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription analytics (Admin only)
router.get('/admin/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get subscription statistics
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_subscriptions,
        COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_subscriptions
      FROM user_subscriptions
    `);

    // Get revenue by plan
    const revenueResult = await db.query(`
      SELECT 
        sp.name as plan_name,
        sp.price,
        sp.billing_cycle,
        COUNT(us.id) as subscriber_count,
        SUM(sp.price) as total_revenue
      FROM subscription_plans sp
      LEFT JOIN user_subscriptions us ON sp.id = us.plan_id AND us.status = 'active'
      WHERE sp.is_active = true
      GROUP BY sp.id, sp.name, sp.price, sp.billing_cycle
      ORDER BY total_revenue DESC
    `);

    res.json({
      stats: statsResult.rows[0],
      revenueByPlan: revenueResult.rows
    });
  } catch (error) {
    console.error('Error fetching subscription analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;