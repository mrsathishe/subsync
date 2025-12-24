const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate end date based on plan type
function calculateEndDate(startDate, planType, customDurationValue, customDurationUnit) {
  const start = new Date(startDate);
  let endDate = new Date(start);

  switch (planType) {
    case 'Monthly':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case '3 Months':
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case '6 Months':
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case 'Yearly':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    case 'Custom':
      if (customDurationUnit === 'days') {
        endDate.setDate(endDate.getDate() + customDurationValue);
      } else if (customDurationUnit === 'months') {
        endDate.setMonth(endDate.getMonth() + customDurationValue);
      } else if (customDurationUnit === 'years') {
        endDate.setFullYear(endDate.getFullYear() + customDurationValue);
      }
      break;
  }
  
  return endDate;
}

// Helper function to calculate next purchase date
function calculateNextPurchaseDate(endDate, autoPay) {
  if (!autoPay) return null;
  
  const next = new Date(endDate);
  next.setDate(next.getDate() - 3); // 3 days before end date
  return next;
}

// Get all admin subscriptions with filtering and pagination
router.get('/subscriptions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      status, 
      shared, 
      owner_type,
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let params = [];
    let paramCount = 0;
    
    if (category) {
      paramCount++;
      whereConditions.push(`category = $${paramCount}`);
      params.push(category);
    }
    
    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      params.push(status);
    }
    
    if (shared !== undefined) {
      paramCount++;
      whereConditions.push(`shared = $${paramCount}`);
      params.push(shared === 'true');
    }
    
    if (owner_type) {
      paramCount++;
      whereConditions.push(`owner_type = $${paramCount}`);
      params.push(owner_type);
    }
    
    if (search) {
      paramCount++;
      whereConditions.push(`(service_name ILIKE $${paramCount} OR login_username_phone ILIKE $${paramCount} OR comments ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const query = `
      SELECT * FROM admin_subscription_summary 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    const countQuery = `SELECT COUNT(*) FROM admin_subscription_summary ${whereClause}`;
    const countResult = await db.query(countQuery, params.slice(0, paramCount));
    
    const totalSubscriptions = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalSubscriptions / limit);
    
    res.json({
      subscriptions: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalSubscriptions,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription by ID with sharing details
router.get('/subscriptions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscriptionResult = await db.query(
      'SELECT * FROM admin_subscription_summary WHERE id = $1',
      [id]
    );
    
    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    const subscription = subscriptionResult.rows[0];
    
    // Get sharing details if subscription is shared
    let sharingDetails = [];
    if (subscription.shared) {
      const sharingResult = await db.query(`
        SELECT 
          ss.*,
          u.first_name,
          u.last_name,
          u.email
        FROM subscription_sharing ss
        LEFT JOIN users u ON ss.user_id = u.id
        WHERE ss.subscription_id = $1
        ORDER BY ss.created_at ASC
      `, [id]);
      
      sharingDetails = sharingResult.rows;
    }
    
    res.json({
      subscription,
      sharingDetails
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new admin subscription
router.post('/subscriptions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      serviceName,
      category,
      ownerType,
      ownerName,
      loginUsernamePhone,
      password,
      passwordHint,
      purchasedDate,
      startDate,
      amount,
      planType,
      customDurationValue,
      customDurationUnit,
      purchasedVia,
      autoPay,
      deviceLimit,
      devicesInUse,
      idsUsing,
      comments,
      shared,
      sharingDetails
    } = req.body;
    
    const adminUserId = req.user.userId;
    
    // Calculate end date and next purchase date
    const endDate = calculateEndDate(startDate, planType, customDurationValue, customDurationUnit);
    const nextPurchaseDate = calculateNextPurchaseDate(endDate, autoPay);
    
    // Encrypt password if provided
    let passwordEncrypted = null;
    if (password) {
      passwordEncrypted = await bcrypt.hash(password, 10);
    }
    
    // Create subscription
    const subscriptionResult = await db.query(`
      INSERT INTO admin_subscriptions (
        service_name, category, owner_type, owner_name, login_username_phone,
        password_encrypted, password_hint, purchased_date, start_date, amount,
        plan_type, custom_duration_value, custom_duration_unit, end_date,
        purchased_via, auto_pay, next_purchase_date, device_limit, devices_in_use,
        ids_using, comments, shared, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *
    `, [
      serviceName, category, ownerType, ownerName, loginUsernamePhone,
      passwordEncrypted, passwordHint, purchasedDate, startDate, amount,
      planType, customDurationValue, customDurationUnit, endDate,
      purchasedVia, autoPay, nextPurchaseDate, deviceLimit, devicesInUse,
      idsUsing, comments, shared, adminUserId
    ]);
    
    const subscription = subscriptionResult.rows[0];
    
    // Handle sharing details if subscription is shared
    if (shared && sharingDetails && sharingDetails.length > 0) {
      const totalUsers = sharingDetails.length;
      const sharedAmount = (amount / totalUsers).toFixed(2);
      
      for (const sharing of sharingDetails) {
        await db.query(`
          INSERT INTO subscription_sharing (
            subscription_id, user_id, non_registered_name, non_registered_email,
            shared_amount, payment_status, payment_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          subscription.id,
          sharing.userId || null,
          sharing.nonRegisteredName || null,
          sharing.nonRegisteredEmail || null,
          sharedAmount,
          sharing.paymentStatus || 'not_paid',
          sharing.paymentDate || null
        ]);
      }
    }
    
    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription
router.put('/subscriptions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if subscription exists
    const existingResult = await db.query(
      'SELECT id FROM admin_subscriptions WHERE id = $1',
      [id]
    );
    
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    // Handle password encryption if password is being updated
    if (updateData.password) {
      updateData.passwordEncrypted = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }
    
    // Recalculate dates if relevant fields are updated
    if (updateData.startDate || updateData.planType || updateData.customDurationValue || updateData.customDurationUnit) {
      const current = await db.query('SELECT * FROM admin_subscriptions WHERE id = $1', [id]);
      const currentSub = current.rows[0];
      
      const startDate = updateData.startDate || currentSub.start_date;
      const planType = updateData.planType || currentSub.plan_type;
      const customDurationValue = updateData.customDurationValue || currentSub.custom_duration_value;
      const customDurationUnit = updateData.customDurationUnit || currentSub.custom_duration_unit;
      const autoPay = updateData.autoPay !== undefined ? updateData.autoPay : currentSub.auto_pay;
      
      updateData.endDate = calculateEndDate(startDate, planType, customDurationValue, customDurationUnit);
      updateData.nextPurchaseDate = calculateNextPurchaseDate(updateData.endDate, autoPay);
    }
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 0;
    
    const fieldMapping = {
      serviceName: 'service_name',
      category: 'category',
      ownerType: 'owner_type',
      ownerName: 'owner_name',
      loginUsernamePhone: 'login_username_phone',
      passwordEncrypted: 'password_encrypted',
      passwordHint: 'password_hint',
      purchasedDate: 'purchased_date',
      startDate: 'start_date',
      amount: 'amount',
      planType: 'plan_type',
      customDurationValue: 'custom_duration_value',
      customDurationUnit: 'custom_duration_unit',
      endDate: 'end_date',
      purchasedVia: 'purchased_via',
      autoPay: 'auto_pay',
      nextPurchaseDate: 'next_purchase_date',
      deviceLimit: 'device_limit',
      devicesInUse: 'devices_in_use',
      idsUsing: 'ids_using',
      comments: 'comments',
      shared: 'shared',
      status: 'status'
    };
    
    for (const [key, dbField] of Object.entries(fieldMapping)) {
      if (updateData[key] !== undefined) {
        paramCount++;
        updateFields.push(`${dbField} = $${paramCount}`);
        values.push(updateData[key]);
      }
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    paramCount++;
    values.push(id);
    
    const updateQuery = `
      UPDATE admin_subscriptions 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, values);
    
    res.json({
      message: 'Subscription updated successfully',
      subscription: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete subscription
router.delete('/subscriptions/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM admin_subscriptions WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update sharing details
router.put('/subscriptions/:id/sharing', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { sharingDetails } = req.body;
    
    // Get subscription details
    const subResult = await db.query(
      'SELECT amount, shared FROM admin_subscriptions WHERE id = $1',
      [id]
    );
    
    if (subResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    const { amount, shared } = subResult.rows[0];
    
    if (!shared) {
      return res.status(400).json({ error: 'Subscription is not marked as shared' });
    }
    
    // Delete existing sharing records
    await db.query('DELETE FROM subscription_sharing WHERE subscription_id = $1', [id]);
    
    // Add new sharing records
    if (sharingDetails && sharingDetails.length > 0) {
      const sharedAmount = (amount / sharingDetails.length).toFixed(2);
      
      for (const sharing of sharingDetails) {
        await db.query(`
          INSERT INTO subscription_sharing (
            subscription_id, user_id, non_registered_name, non_registered_email,
            shared_amount, payment_status, payment_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          id,
          sharing.userId || null,
          sharing.nonRegisteredName || null,
          sharing.nonRegisteredEmail || null,
          sharedAmount,
          sharing.paymentStatus || 'not_paid',
          sharing.paymentDate || null
        ]);
      }
    }
    
    res.json({ message: 'Sharing details updated successfully' });
  } catch (error) {
    console.error('Error updating sharing details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_subscriptions,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_subscriptions,
        COUNT(CASE WHEN shared = true THEN 1 END) as shared_subscriptions,
        SUM(amount) as total_amount,
        SUM(CASE WHEN status = 'active' THEN amount ELSE 0 END) as active_amount
      FROM admin_subscriptions
    `);
    
    const categoryStats = await db.query(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM admin_subscriptions
      WHERE status = 'active'
      GROUP BY category
    `);
    
    const upcomingRenewals = await db.query(`
      SELECT 
        service_name,
        end_date,
        amount,
        auto_pay
      FROM admin_subscriptions
      WHERE status = 'active' AND end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      ORDER BY end_date ASC
      LIMIT 10
    `);
    
    res.json({
      stats: stats.rows[0],
      categoryStats: categoryStats.rows,
      upcomingRenewals: upcomingRenewals.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;