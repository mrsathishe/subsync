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
router.get('/', authenticateToken, async (req, res) => {
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
    
    // Get ids_using data for all subscriptions
    const subscriptionIds = result.rows.map(sub => sub.id);
    let idsUsingMap = {};
    
    if (subscriptionIds.length > 0) {
      const idsUsingResult = await db.query(`
        SELECT 
          asu.subscription_id,
          asu.user_id,
          asu.custom_name,
          asu.custom_email,
          asu.is_registered,
          u.first_name,
          u.last_name,
          u.email
        FROM admin_subscription_users asu
        LEFT JOIN users u ON asu.user_id = u.id
        WHERE asu.subscription_id = ANY($1)
        ORDER BY asu.subscription_id, asu.id
      `, [subscriptionIds]);
      
      // Group by subscription_id
      idsUsingResult.rows.forEach(row => {
        if (!idsUsingMap[row.subscription_id]) {
          idsUsingMap[row.subscription_id] = [];
        }
        idsUsingMap[row.subscription_id].push({
          userId: row.user_id,
          name: row.is_registered 
            ? `${row.first_name} ${row.last_name}` 
            : row.custom_name,
          email: row.is_registered ? row.email : row.custom_email,
          isRegistered: row.is_registered
        });
      });
    }
    
    // Add ids_using to each subscription
    const processedSubscriptions = result.rows.map(subscription => ({
      ...subscription,
      ids_using: idsUsingMap[subscription.id] || []
    }));
    
    const countQuery = `SELECT COUNT(*) FROM admin_subscription_summary ${whereClause}`;
    const countResult = await db.query(countQuery, params.slice(0, paramCount));
    
    const totalSubscriptions = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalSubscriptions / limit);
    
    res.json({
      subscriptions: processedSubscriptions,
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
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
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
    
    // Get ids_using data from the separate table
    const idsUsingResult = await db.query(`
      SELECT 
        asu.user_id,
        asu.custom_name,
        asu.custom_email,
        asu.is_registered,
        u.first_name,
        u.last_name,
        u.email
      FROM admin_subscription_users asu
      LEFT JOIN users u ON asu.user_id = u.id
      WHERE asu.subscription_id = $1
      ORDER BY asu.id
    `, [id]);
    
    const parsedIdsUsing = idsUsingResult.rows.map(row => ({
      userId: row.user_id,
      name: row.is_registered 
        ? `${row.first_name} ${row.last_name}` 
        : row.custom_name,
      email: row.is_registered ? row.email : row.custom_email,
      isRegistered: row.is_registered
    }));
    
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
      subscription: {
        ...subscription,
        ids_using: parsedIdsUsing
      },
      sharingDetails
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new admin subscription or update existing one
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      id, // If provided, this is an update operation
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
      sharingDetails,
      selectedUsers
    } = req.body;
    
    const adminUserId = req.user.userId;
    const isUpdate = !!id;
    
    // If updating, check if subscription exists
    if (isUpdate) {
      const existingResult = await db.query(
        'SELECT id FROM admin_subscriptions WHERE id = $1',
        [id]
      );
      
      if (existingResult.rows.length === 0) {
        return res.status(404).json({ error: 'Subscription not found' });
      }
    }
    
    // Calculate end date and next purchase date
    let endDate, nextPurchaseDate;
    if (!isUpdate || startDate || planType || customDurationValue || customDurationUnit) {
      // For creates or updates that affect dates
      const finalStartDate = startDate || new Date();
      endDate = calculateEndDate(finalStartDate, planType, customDurationValue, customDurationUnit);
      nextPurchaseDate = calculateNextPurchaseDate(endDate, autoPay);
    } else if (isUpdate) {
      // For updates that don't affect dates, get current values and recalculate if autoPay changed
      const current = await db.query('SELECT * FROM admin_subscriptions WHERE id = $1', [id]);
      const currentSub = current.rows[0];
      endDate = currentSub.end_date;
      nextPurchaseDate = autoPay !== undefined 
        ? calculateNextPurchaseDate(endDate, autoPay)
        : currentSub.next_purchase_date;
    }
    
    // Encrypt password if provided
    let passwordEncrypted = null;
    if (password) {
      passwordEncrypted = await bcrypt.hash(password, 10);
    }
    
    // Process idsUsing array to store user information
    let processedIdsUsing = [];
    if (idsUsing && Array.isArray(idsUsing)) {
      for (const user of idsUsing) {
        if (user.id && typeof user.id === 'number') {
          // User exists in system - verify user exists and store user ID with details
          try {
            const userResult = await db.query('SELECT id, email, first_name, last_name FROM users WHERE id = $1', [user.id]);
            if (userResult.rows.length > 0) {
              const foundUser = userResult.rows[0];
              processedIdsUsing.push({
                userId: user.id,
                name: user.name || `${foundUser.first_name} ${foundUser.last_name}`,
                email: user.email || foundUser.email,
                isRegistered: true
              });
            } else {
              // User ID provided but not found - store as custom user
              processedIdsUsing.push({
                userId: null,
                name: user.name || 'Unknown User',
                email: user.email || '',
                isRegistered: false
              });
            }
          } catch (error) {
            console.error('Error verifying user:', error);
            // Store as custom user if verification fails
            processedIdsUsing.push({
              userId: null,
              name: user.name || 'Unknown User',
              email: user.email || '',
              isRegistered: false
            });
          }
        } else {
          // Custom user (no valid user ID)
          processedIdsUsing.push({
            userId: null,
            name: user.name || 'Custom User',
            email: user.email || '',
            isRegistered: false
          });
        }
      }
    }
    
    let subscription;
    
    if (isUpdate) {
      // Update existing subscription
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
        passwordHint: 'password_hint',
        purchasedDate: 'purchased_date',
        startDate: 'start_date',
        amount: 'amount',
        planType: 'plan_type',
        customDurationValue: 'custom_duration_value',
        customDurationUnit: 'custom_duration_unit',
        purchasedVia: 'purchased_via',
        autoPay: 'auto_pay',
        deviceLimit: 'device_limit',
        devicesInUse: 'devices_in_use',
        comments: 'comments',
        shared: 'shared'
      };
      
      // Add fields that have values
      for (const [key, dbField] of Object.entries(fieldMapping)) {
        if (req.body[key] !== undefined) {
          paramCount++;
          updateFields.push(`${dbField} = $${paramCount}`);
          values.push(req.body[key]);
        }
      }
      
      // Add password if provided
      if (passwordEncrypted) {
        paramCount++;
        updateFields.push(`password_encrypted = $${paramCount}`);
        values.push(passwordEncrypted);
      }
      
      // Add calculated dates
      if (endDate) {
        paramCount++;
        updateFields.push(`end_date = $${paramCount}`);
        values.push(endDate);
      }
      
      if (nextPurchaseDate !== undefined) {
        paramCount++;
        updateFields.push(`next_purchase_date = $${paramCount}`);
        values.push(nextPurchaseDate);
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
      subscription = result.rows[0];
      
      // Update idsUsing in separate table if provided
      if (processedIdsUsing.length >= 0) { // Check for >= 0 to allow clearing all users
        // First delete all existing entries for this subscription
        await db.query('DELETE FROM admin_subscription_users WHERE subscription_id = $1', [id]);
        
        // Insert new entries
        if (processedIdsUsing.length > 0) {
          for (const user of processedIdsUsing) {
            await db.query(`
              INSERT INTO admin_subscription_users 
              (subscription_id, user_id, custom_name, custom_email, is_registered)
              VALUES ($1, $2, $3, $4, $5)
            `, [
              id,
              user.userId || null,
              user.name || null,
              user.email || null,
              user.isRegistered || false
            ]);
          }
        }
      }
      
    } else {
      // Create new subscription
      const subscriptionResult = await db.query(`
        INSERT INTO admin_subscriptions (
          service_name, category, owner_type, owner_name, login_username_phone,
          password_encrypted, password_hint, purchased_date, start_date, amount,
          plan_type, custom_duration_value, custom_duration_unit, end_date,
          purchased_via, auto_pay, next_purchase_date, device_limit, devices_in_use,
          comments, shared, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING *
      `, [
        serviceName, category, ownerType, ownerName, loginUsernamePhone,
        passwordEncrypted, passwordHint, purchasedDate, startDate, amount,
        planType, customDurationValue, customDurationUnit, endDate,
        purchasedVia, autoPay, nextPurchaseDate, deviceLimit, devicesInUse,
        comments, shared, adminUserId
      ]);
      
      subscription = subscriptionResult.rows[0];
      
      // Insert idsUsing data into the separate table
      if (processedIdsUsing.length > 0) {
        for (const user of processedIdsUsing) {
          await db.query(`
            INSERT INTO admin_subscription_users 
            (subscription_id, user_id, custom_name, custom_email, is_registered)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            subscription.id,
            user.userId || null,
            user.name || null,
            user.email || null,
            user.isRegistered || false
          ]);
        }
      }
      
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
    }
    
    // Get the idsUsing data for the response
    const idsUsingResult = await db.query(`
      SELECT 
        asu.user_id,
        asu.custom_name,
        asu.custom_email,
        asu.is_registered,
        u.first_name,
        u.last_name,
        u.email
      FROM admin_subscription_users asu
      LEFT JOIN users u ON asu.user_id = u.id
      WHERE asu.subscription_id = $1
      ORDER BY asu.id
    `, [subscription.id]);
    
    const formattedIdsUsing = idsUsingResult.rows.map(row => ({
      userId: row.user_id,
      name: row.is_registered 
        ? `${row.first_name} ${row.last_name}` 
        : row.custom_name,
      email: row.is_registered ? row.email : row.custom_email,
      isRegistered: row.is_registered
    }));
    
    res.status(isUpdate ? 200 : 201).json({
      message: `Subscription ${isUpdate ? 'updated' : 'created'} successfully`,
      subscription: {
        ...subscription,
        ids_using: formattedIdsUsing
      }
    });
  } catch (error) {
    console.error(`Error ${req.body.id ? 'updating' : 'creating'} subscription:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete subscription
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
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
router.put('/:id/sharing', authenticateToken, requireAdmin, async (req, res) => {
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


module.exports = router;