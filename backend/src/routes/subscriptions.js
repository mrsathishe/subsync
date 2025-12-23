const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all subscription plans
router.get('/plans', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, description, price, billing_cycle, features FROM subscription_plans WHERE is_active = true ORDER BY price ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's subscriptions
router.get('/my-subscriptions', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT us.id, us.status, us.start_date, us.end_date, us.auto_renew,
             sp.name as plan_name, sp.description, sp.price, sp.billing_cycle
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
    const { planId } = req.body;
    const userId = req.user.userId;

    // Check if plan exists and is active
    const planResult = await db.query(
      'SELECT id, name, price, billing_cycle FROM subscription_plans WHERE id = $1 AND is_active = true',
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

    // Create subscription
    const subscriptionResult = await db.query(
      'INSERT INTO user_subscriptions (user_id, plan_id, end_date) VALUES ($1, $2, $3) RETURNING *',
      [userId, planId, endDate]
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

module.exports = router;