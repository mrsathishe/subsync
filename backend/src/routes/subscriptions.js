const express = require('express');
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

// ==================== PUBLIC ROUTES (Role-based access) ====================

// Get subscriptions based on user role
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      status, 
      idsUsing, 
      isSharing,
      owner_type,
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    let whereConditions = [];
    let params = [];
    let paramCount = 0;
    
    // Role-based filtering
    if (userRole !== 'admin') {
      // For regular users, only show subscriptions they have access to
      paramCount++;
      const param1 = paramCount;
      paramCount++;
      const param2 = paramCount;
      
      whereConditions.push(`(
        s.id IN (
          SELECT ids_sharing_id FROM ids_sharing_users WHERE user_id = $${param1}
        ) OR 
        s.id IN (
          SELECT subscription_id FROM subscription_sharing WHERE user_id = $${param2}
        )
      )`);
      params.push(userId, userId); // Add userId twice for both subqueries
    }
    
    // Additional filters
    if (category) {
      paramCount++;
      whereConditions.push(`s.category = $${paramCount}`);
      params.push(category);
    }
    
    if (status) {
      paramCount++;
      whereConditions.push(`s.status = $${paramCount}`);
      params.push(status);
    }
    
    if (idsUsing !== undefined) {
      paramCount++;
      whereConditions.push(`s.ids_using = $${paramCount}`);
      params.push(idsUsing === 'true');
    }
    
    if (isSharing !== undefined) {
      paramCount++;
      whereConditions.push(`s."isSharing" = $${paramCount}`);
      params.push(isSharing === 'true');
    }
    
    if (owner_type) {
      paramCount++;
      whereConditions.push(`s.owner_type = $${paramCount}`);
      params.push(owner_type);
    }
    
    if (search) {
      paramCount++;
      whereConditions.push(`(
        s.service_name ILIKE $${paramCount} OR 
        s.login_username_phone ILIKE $${paramCount} OR 
        s.comments ILIKE $${paramCount}
      )`);
      params.push(`%${search}%`);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const query = `
      SELECT s.* FROM subscriptions s
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    // Get sharing data for all subscriptions
    const subscriptionIds = result.rows.map(sub => sub.id);
    let idsUsingMap = {};
    let sharingMap = {};
    
    if (subscriptionIds.length > 0) {
      // Get IDs sharing data
      const idsUsingResult = await db.query(`
        SELECT 
          asu.ids_sharing_id,
          asu.user_id,
          asu.name,
          asu.email,
          asu."isCustom" as is_custom,
          u.first_name,
          u.last_name,
          u.email as user_email
        FROM ids_sharing_users asu
        LEFT JOIN users u ON asu.user_id = u.id
        WHERE asu.ids_sharing_id = ANY($1)
        ORDER BY asu.ids_sharing_id, asu.id
      `, [subscriptionIds]);
      
      // Group IDs using by subscription_id
      idsUsingResult.rows.forEach(row => {
        if (!idsUsingMap[row.ids_sharing_id]) {
          idsUsingMap[row.ids_sharing_id] = [];
        }
        idsUsingMap[row.ids_sharing_id].push({
          userId: row.user_id,
          name: !row.is_custom 
            ? `${row.first_name} ${row.last_name}` 
            : row.name,
          email: !row.is_custom ? row.user_email : row.email,
          isCustom: row.is_custom
        });
      });

      // Get subscription sharing data
      const sharingResult = await db.query(`
        SELECT 
          ss.subscription_id,
          ss.user_id,
          ss.name,
          ss.email,
          ss.payment_status,
          ss.payment_date,
          u.first_name,
          u.last_name,
          u.email as user_email
        FROM subscription_sharing ss
        LEFT JOIN users u ON ss.user_id = u.id
        WHERE ss.subscription_id = ANY($1)
        ORDER BY ss.subscription_id, ss.id
      `, [subscriptionIds]);
      
      // Group sharing by subscription_id
      sharingResult.rows.forEach(row => {
        if (!sharingMap[row.subscription_id]) {
          sharingMap[row.subscription_id] = [];
        }
        sharingMap[row.subscription_id].push({
          userId: row.user_id,
          name: row.user_id 
            ? `${row.first_name} ${row.last_name}` 
            : row.name,
          email: row.user_id ? row.user_email : row.email,
          paymentStatus: row.payment_status,
          paymentDate: row.payment_date,
          isRegistered: !!row.user_id
        });
      });
    }
    
    // Process subscriptions based on user role
    const processedSubscriptions = result.rows.map(subscription => {
      if (userRole === 'admin') {
        // Admin gets full response structure
        return {
          ...subscription,
          idsUsingDetails: idsUsingMap[subscription.id] || [],
          sharingDetails: sharingMap[subscription.id] || []
        };
      } else {
        // Regular users get simplified response
        const idsUsingUsers = idsUsingMap[subscription.id] || [];
        const isUserInIdsUsing = idsUsingUsers.some(user => 
          user.userId === userId || user.userId === null // null for custom users
        );
        
        return {
          id: subscription.id,
          service_name: subscription.service_name,
          category: subscription.category,
          login_username_phone: subscription.login_username_phone,
          password_hint: subscription.password_hint,
          purchased_date: subscription.purchased_date,
          start_date: subscription.start_date,
          end_date: subscription.end_date,
          amount: subscription.amount,
          plan_type: subscription.plan_type,
          custom_duration_value: subscription.custom_duration_value,
          custom_duration_unit: subscription.custom_duration_unit,
          purchased_via: subscription.purchased_via,
          next_purchase_date: subscription.next_purchase_date,
          comments: subscription.comments,
          status: subscription.status,
          created_at: subscription.created_at,
          updated_at: subscription.updated_at,
          ids_using: isUserInIdsUsing,
          isSharing: subscription.isSharing
        };
      }
    });
    
    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM subscriptions s ${whereClause}`;
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
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription by ID (role-based access)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    let query = 'SELECT * FROM subscriptions WHERE id = $1';
    let params = [id];
    
    // For non-admin users, verify they have access to this subscription
    if (userRole !== 'admin') {
      query = `
        SELECT s.* FROM subscriptions s
        WHERE s.id = $1 AND (
          s.id IN (
            SELECT ids_sharing_id FROM ids_sharing_users WHERE user_id = $2
          ) OR 
          s.id IN (
            SELECT subscription_id FROM subscription_sharing WHERE user_id = $3
          )
        )
      `;
      params = [id, userId, userId];
    }
    
    const result = await db.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found or access denied' });
    }
    
    const subscription = result.rows[0];
    
    // Get IDs sharing details
    const idsUsingResult = await db.query(`
      SELECT 
        asu.user_id,
        asu.name,
        asu.email,
        asu."isCustom" as is_custom,
        u.first_name,
        u.last_name,
        u.email as user_email
      FROM ids_sharing_users asu
      LEFT JOIN users u ON asu.user_id = u.id
      WHERE asu.ids_sharing_id = $1
      ORDER BY asu.id
    `, [id]);
    
    const idsUsingDetails = idsUsingResult.rows.map(row => ({
      userId: row.user_id,
      name: !row.is_custom 
        ? `${row.first_name} ${row.last_name}` 
        : row.name,
      email: !row.is_custom ? row.user_email : row.email,
      isCustom: row.is_custom
    }));
    
    // Get sharing details
    const sharingResult = await db.query(`
      SELECT 
        ss.user_id,
        ss.name,
        ss.email,
        ss.payment_status,
        ss.payment_date,
        u.first_name,
        u.last_name,
        u.email as user_email
      FROM subscription_sharing ss
      LEFT JOIN users u ON ss.user_id = u.id
      WHERE ss.subscription_id = $1
      ORDER BY ss.id
    `, [id]);
    
    const sharingDetails = sharingResult.rows.map(row => ({
      userId: row.user_id,
      name: row.user_id 
        ? `${row.first_name} ${row.last_name}` 
        : row.name,
      email: row.user_id ? row.user_email : row.email,
      paymentStatus: row.payment_status,
      paymentDate: row.payment_date,
      isRegistered: !!row.user_id
    }));
    
    // Get user payment info if subscription is being shared
    let userPaymentInfo = null;
    
    if (subscription.isSharing && sharingDetails.length > 0) {
      // Find current user's payment info
      const currentUserSharing = sharingDetails.find(user => user.userId === userId);
      if (currentUserSharing) {
        userPaymentInfo = {
          isPaid: currentUserSharing.paymentStatus === 'paid',
          paymentStatus: currentUserSharing.paymentStatus,
          paymentDate: currentUserSharing.paymentDate
        };
      }
    }
    
    // Return response based on user role
    if (userRole === 'admin') {
      // Admin gets full response structure
      res.json({
        ...subscription,
        password: subscription.password_encrypted,
        idsUsingDetails,
        sharingDetails,
        userPaymentInfo: userPaymentInfo
      });
    } else {
      // Regular users get simplified response
      const isUserInIdsUsing = idsUsingDetails.some(user => 
        user.userId === userId || user.userId === null // null for custom users
      );
      
      res.json({
        id: subscription.id,
        service_name: subscription.service_name,
        category: subscription.category,
        login_username_phone: subscription.login_username_phone,
        password: subscription.password_encrypted,
        password_hint: subscription.password_hint,
        purchased_date: subscription.purchased_date,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        amount: subscription.amount, // Always send full amount
        plan_type: subscription.plan_type,
        custom_duration_value: subscription.custom_duration_value,
        custom_duration_unit: subscription.custom_duration_unit,
        purchased_via: subscription.purchased_via,
        next_purchase_date: subscription.next_purchase_date,
        comments: subscription.comments,
        status: subscription.status,
        created_at: subscription.created_at,
        updated_at: subscription.updated_at,
        ids_using: isUserInIdsUsing,
        isSharing: subscription.isSharing,
        userPaymentInfo: userPaymentInfo
      });
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Create or Update subscription (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
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
      idsUsingDetails,
      isSharing,
      sharingDetails
    } = req.body;
    
    const adminUserId = req.user.userId;
    
    // Calculate end date and next purchase date
    let endDate, nextPurchaseDate;
    const finalStartDate = startDate || new Date();
    endDate = calculateEndDate(finalStartDate, planType, customDurationValue, customDurationUnit);
    nextPurchaseDate = calculateNextPurchaseDate(endDate, autoPay);
    
    // Store password directly without encryption
    let passwordEncrypted = password || null;
    
    // Process idsUsingDetails array
    let processedIdsUsing = [];
    if (idsUsingDetails && Array.isArray(idsUsingDetails)) {
      processedIdsUsing = idsUsingDetails.map(user => ({
        userId: user.isCustom ? null : user.userId,
        name: user.name,
        email: user.email,
        isCustom: user.isCustom
      }));
    }

    // Process sharingDetails array
    let processedSharingDetails = [];
    if (sharingDetails && Array.isArray(sharingDetails)) {
      processedSharingDetails = sharingDetails.map(detail => ({
        userId: (detail.userId && detail.userId !== '') ? detail.userId : null,
        name: detail.nonRegisteredName || null,
        email: detail.nonRegisteredEmail || null,
        paymentStatus: detail.paymentStatus || 'not_paid',
        paymentDate: detail.paymentDate || null
      }));
    }
    
    // Create new subscription
    const subscriptionResult = await db.query(`
      INSERT INTO subscriptions (
        service_name, category, owner_type, owner_name, login_username_phone,
        password_encrypted, password_hint, purchased_date, start_date, amount,
        plan_type, custom_duration_value, custom_duration_unit, end_date,
        purchased_via, auto_pay, next_purchase_date, device_limit, devices_in_use,
        comments, ids_using, "isSharing", created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *
    `, [
      serviceName, category, ownerType, ownerName, loginUsernamePhone,
      passwordEncrypted, passwordHint, purchasedDate, finalStartDate, amount,
      planType, customDurationValue, customDurationUnit, endDate,
      purchasedVia, autoPay, nextPurchaseDate, deviceLimit, devicesInUse,
      comments, idsUsing, isSharing, adminUserId
    ]);
    
    const subscription = subscriptionResult.rows[0];
    
    // Insert idsUsing data into the separate table
    if (idsUsing && processedIdsUsing.length > 0) {
      for (const user of processedIdsUsing) {
        await db.query(`
          INSERT INTO ids_sharing_users 
          (ids_sharing_id, user_id, name, email, "isCustom")
          VALUES ($1, $2, $3, $4, $5)
        `, [
          subscription.id,
          user.userId || null,
          user.name || null,
          user.email || null,
          user.isCustom || false
        ]);
      }
    }

    // Insert sharing details if subscription is being shared
    if (isSharing && processedSharingDetails.length > 0) {
      for (const sharing of processedSharingDetails) {
        await db.query(`
          INSERT INTO subscription_sharing (
            subscription_id, user_id, name, email, payment_status, payment_date
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          subscription.id,
          sharing.userId || null,
          sharing.name || null,
          sharing.email || null,
          sharing.paymentStatus || 'not_paid',
          sharing.paymentDate || null
        ]);
      }
    }
    
    // Get the idsUsing data for the response
    const idsUsingResult = await db.query(`
      SELECT 
        asu.user_id,
        asu.name,
        asu.email,
        asu."isCustom" as is_custom,
        u.first_name,
        u.last_name,
        u.email as user_email
      FROM ids_sharing_users asu
      LEFT JOIN users u ON asu.user_id = u.id
      WHERE asu.ids_sharing_id = $1
      ORDER BY asu.id
    `, [subscription.id]);
    
    const formattedIdsUsing = idsUsingResult.rows.map(row => ({
      userId: row.user_id,
      name: !row.is_custom 
        ? `${row.first_name} ${row.last_name}` 
        : row.name,
      email: !row.is_custom ? row.user_email : row.email,
      isCustom: row.is_custom
    }));
    
    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: {
        ...subscription,
        idsUsingDetails: formattedIdsUsing,
        sharingDetails: processedSharingDetails
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
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
      idsUsingDetails,
      isSharing,
      sharingDetails
    } = req.body;
    
    // If updating, check if subscription exists
    const existingResult = await db.query(
      'SELECT id FROM subscriptions WHERE id = $1',
      [id]
    );
    
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    // Calculate end date and next purchase date if needed
    let endDate, nextPurchaseDate;
    if (startDate || planType || customDurationValue || customDurationUnit) {
      const current = await db.query('SELECT * FROM subscriptions WHERE id = $1', [id]);
      const currentSub = current.rows[0];
      const finalStartDate = startDate || currentSub.start_date;
      endDate = calculateEndDate(finalStartDate, planType || currentSub.plan_type, 
        customDurationValue || currentSub.custom_duration_value, 
        customDurationUnit || currentSub.custom_duration_unit);
      nextPurchaseDate = calculateNextPurchaseDate(endDate, autoPay !== undefined ? autoPay : currentSub.auto_pay);
    }
    
    // Store password directly without encryption
    let passwordEncrypted = password || null;
    
    // Process idsUsingDetails array
    let processedIdsUsing = [];
    if (idsUsingDetails && Array.isArray(idsUsingDetails)) {
      processedIdsUsing = idsUsingDetails.map(user => ({
        userId: user.isCustom ? null : user.userId,
        name: user.name,
        email: user.email,
        isCustom: user.isCustom
      }));
    }

    // Process sharingDetails array
    let processedSharingDetails = [];
    if (sharingDetails && Array.isArray(sharingDetails)) {
      processedSharingDetails = sharingDetails.map(detail => ({
        userId: (detail.userId && detail.userId !== '') ? detail.userId : null,
        name: detail.nonRegisteredName || null,
        email: detail.nonRegisteredEmail || null,
        paymentStatus: detail.paymentStatus || 'not_paid',
        paymentDate: detail.paymentDate || null
      }));
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
      idsUsing: 'ids_using',
      isSharing: '"isSharing"'
    };
    
    // Add fields that have values
    for (const [key, dbField] of Object.entries(fieldMapping)) {
      if (req.body[key] !== undefined) {
        paramCount++;
        updateFields.push(`${dbField} = $${paramCount}`);
        values.push(req.body[key]);
      }
    }
    
    // Add computed fields
    if (passwordEncrypted) {
      paramCount++;
      updateFields.push(`password_encrypted = $${paramCount}`);
      values.push(passwordEncrypted);
    }
    
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
    
    // Add updated_at
    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add ID for WHERE clause
    paramCount++;
    values.push(id);
    
    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE subscriptions 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await db.query(updateQuery, values);
      
      // Update idsUsing in separate table if provided
      if (idsUsing !== undefined) {
        // First delete all existing entries for this subscription
        await db.query('DELETE FROM ids_sharing_users WHERE ids_sharing_id = $1', [id]);
        
        // Insert new entries if idsUsing is enabled and we have details
        if (idsUsing && processedIdsUsing.length > 0) {
          for (const user of processedIdsUsing) {
            await db.query(`
              INSERT INTO ids_sharing_users 
              (ids_sharing_id, user_id, name, email, "isCustom")
              VALUES ($1, $2, $3, $4, $5)
            `, [
              id,
              user.userId || null,
              user.name || null,
              user.email || null,
              user.isCustom || false
            ]);
          }
        }
      }

      // Update sharing details if provided
      if (isSharing !== undefined) {
        // First delete all existing sharing entries for this subscription
        await db.query('DELETE FROM subscription_sharing WHERE subscription_id = $1', [id]);
        
        // Insert new sharing entries if isSharing is true and we have details
        if (isSharing && processedSharingDetails.length > 0) {
          for (const sharing of processedSharingDetails) {
            await db.query(`
              INSERT INTO subscription_sharing 
              (subscription_id, user_id, name, email, payment_status, payment_date)
              VALUES ($1, $2, $3, $4, $5, $6)
            `, [
              id,
              sharing.userId || null,
              sharing.name || null,
              sharing.email || null,
              sharing.paymentStatus || 'not_paid',
              sharing.paymentDate || null
            ]);
          }
        }
      }
    }
    
    // Get the updated subscription with sharing details
    const subscriptionResult = await db.query('SELECT * FROM subscriptions WHERE id = $1', [id]);
    const subscription = subscriptionResult.rows[0];
    
    // Get ids_using data from the separate table
    const idsUsingResult = await db.query(`
      SELECT 
        asu.user_id,
        asu.name,
        asu.email,
        asu."isCustom" as is_custom,
        u.first_name,
        u.last_name,
        u.email as user_email
      FROM ids_sharing_users asu
      LEFT JOIN users u ON asu.user_id = u.id
      WHERE asu.ids_sharing_id = $1
      ORDER BY asu.id
    `, [id]);
    
    const parsedIdsUsing = idsUsingResult.rows.map(row => ({
      userId: row.user_id,
      name: !row.is_custom 
        ? `${row.first_name} ${row.last_name}` 
        : row.name,
      email: !row.is_custom ? row.user_email : row.email,
      isCustom: row.is_custom
    }));
    
    // Get sharing details
    const sharingResult = await db.query(`
      SELECT 
        ss.user_id,
        ss.name,
        ss.email,
        ss.payment_status,
        ss.payment_date,
        u.first_name,
        u.last_name,
        u.email as user_email
      FROM subscription_sharing ss
      LEFT JOIN users u ON ss.user_id = u.id
      WHERE ss.subscription_id = $1
      ORDER BY ss.id
    `, [id]);
    
    const formattedSharingDetails = sharingResult.rows.map(row => ({
      userId: row.user_id,
      name: row.user_id 
        ? `${row.first_name} ${row.last_name}` 
        : row.name,
      email: row.user_id ? row.user_email : row.email,
      paymentStatus: row.payment_status,
      paymentDate: row.payment_date,
      isRegistered: !!row.user_id
    }));
    
    res.json({
      message: 'Subscription updated successfully',
      subscription: {
        ...subscription,
        idsUsingDetails: parsedIdsUsing,
        sharingDetails: formattedSharingDetails
      }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete subscription (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if subscription exists and get some info for logging
    const checkResult = await db.query(
      'SELECT id, service_name FROM subscriptions WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    const subscription = checkResult.rows[0];
    
    // Get count of related records for logging
    const idsUsingCount = await db.query(
      'SELECT COUNT(*) FROM ids_sharing_users WHERE ids_sharing_id = $1',
      [id]
    );
    
    const sharingCount = await db.query(
      'SELECT COUNT(*) FROM subscription_sharing WHERE subscription_id = $1', 
      [id]
    );
    
    // Delete from subscriptions (CASCADE will automatically delete related records)
    const result = await db.query(
      'DELETE FROM subscriptions WHERE id = $1 RETURNING id',
      [id]
    );
    
    console.log(`Subscription deleted: ${subscription.service_name} (ID: ${id})`);
    console.log(`- Cascaded deletion of ${idsUsingCount.rows[0].count} IDs sharing records`);
    console.log(`- Cascaded deletion of ${sharingCount.rows[0].count} subscription sharing records`);
    
    res.json({ 
      message: 'Subscription and all related sharing records deleted successfully',
      deletedSubscriptionId: id,
      cascadedDeletions: {
        idsUsingRecords: parseInt(idsUsingCount.rows[0].count),
        sharingRecords: parseInt(sharingCount.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;