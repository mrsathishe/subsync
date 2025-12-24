const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all providers
router.get('/providers', async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT id, name, type, logo_url, website_url FROM providers WHERE status = $1';
    let params = ['ACTIVE'];
    
    if (type) {
      query += ' AND type = $2';
      params.push(type);
    }
    
    query += ' ORDER BY name ASC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get OTT subscription details
router.get('/ott-details/:subscriptionId', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;
    
    // Verify subscription belongs to user
    const subscriptionCheck = await db.query(
      'SELECT id FROM user_subscriptions WHERE id = $1 AND user_id = $2',
      [subscriptionId, userId]
    );
    
    if (subscriptionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    const result = await db.query(`
      SELECT osd.*, us.id as subscription_id, sp.name as plan_name, p.name as provider_name
      FROM ott_subscription_details osd
      JOIN user_subscriptions us ON osd.subscription_id = us.id
      JOIN subscription_plans sp ON us.plan_id = sp.id
      JOIN providers p ON sp.provider_id = p.id
      WHERE osd.subscription_id = $1
    `, [subscriptionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'OTT details not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching OTT details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update OTT subscription details
router.post('/ott-details', authenticateToken, async (req, res) => {
  try {
    const {
      subscriptionId,
      accountEmail,
      accountPasswordHint,
      profileName,
      simultaneousStreams,
      videoQuality,
      downloadEnabled,
      sharedWith,
      notes
    } = req.body;
    
    const userId = req.user.userId;
    
    // Verify subscription belongs to user and is OTT
    const subscriptionCheck = await db.query(`
      SELECT us.id 
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      JOIN providers p ON sp.provider_id = p.id
      WHERE us.id = $1 AND us.user_id = $2 AND p.type = 'OTT'
    `, [subscriptionId, userId]);
    
    if (subscriptionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'OTT subscription not found' });
    }
    
    // Check if details already exist
    const existingDetails = await db.query(
      'SELECT id FROM ott_subscription_details WHERE subscription_id = $1',
      [subscriptionId]
    );
    
    let result;
    
    if (existingDetails.rows.length > 0) {
      // Update existing details
      result = await db.query(`
        UPDATE ott_subscription_details 
        SET account_email = $1, account_password_hint = $2, profile_name = $3, 
            simultaneous_streams = $4, video_quality = $5, download_enabled = $6,
            shared_with = $7, notes = $8, updated_at = CURRENT_TIMESTAMP
        WHERE subscription_id = $9
        RETURNING *
      `, [
        accountEmail, accountPasswordHint, profileName, simultaneousStreams,
        videoQuality, downloadEnabled, JSON.stringify(sharedWith), notes, subscriptionId
      ]);
    } else {
      // Create new details
      result = await db.query(`
        INSERT INTO ott_subscription_details 
        (subscription_id, account_email, account_password_hint, profile_name, 
         simultaneous_streams, video_quality, download_enabled, shared_with, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        subscriptionId, accountEmail, accountPasswordHint, profileName,
        simultaneousStreams, videoQuality, downloadEnabled, JSON.stringify(sharedWith), notes
      ]);
    }
    
    res.status(201).json({
      message: 'OTT details saved successfully',
      details: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving OTT details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete OTT subscription details
router.delete('/ott-details/:subscriptionId', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;
    
    // Verify subscription belongs to user
    const subscriptionCheck = await db.query(
      'SELECT id FROM user_subscriptions WHERE id = $1 AND user_id = $2',
      [subscriptionId, userId]
    );
    
    if (subscriptionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    const result = await db.query(
      'DELETE FROM ott_subscription_details WHERE subscription_id = $1 RETURNING id',
      [subscriptionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'OTT details not found' });
    }
    
    res.json({ message: 'OTT details deleted successfully' });
  } catch (error) {
    console.error('Error deleting OTT details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;