const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth, gender } = req.body;

    // Check if user already exists (by email or phone)
    const existingUserCheck = await db.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2', 
      [email, phone]
    );
    if (existingUserCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or phone already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, date_of_birth, gender) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, first_name, last_name, phone, date_of_birth, gender, role',
      [email, passwordHash, firstName, lastName, phone, dateOfBirth, gender]
    );

    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const identifier = email || phone;

    if (!identifier) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    // Find user by email or phone
    const result = await db.query(
      'SELECT id, email, phone, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1 OR phone = $1',
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify user identity for password reset
router.post('/verify-user', async (req, res) => {
  try {
    const { email, phone, dateOfBirth } = req.body;

    if (!email || !phone || !dateOfBirth) {
      return res.status(400).json({ error: 'Email, phone, and date of birth are required' });
    }

    // Find user with matching email, phone, and date of birth
    const result = await db.query(
      'SELECT id FROM users WHERE email = $1 AND phone = $2 AND date_of_birth = $3 AND is_active = true',
      [email, phone, dateOfBirth]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No user found with the provided details' });
    }

    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error('User verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password after verification
router.post('/reset-password', async (req, res) => {
  try {
    const { email, phone, dateOfBirth, newPassword } = req.body;

    if (!email || !phone || !dateOfBirth || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Verify user again
    const userResult = await db.query(
      'SELECT id FROM users WHERE email = $1 AND phone = $2 AND date_of_birth = $3 AND is_active = true',
      [email, phone, dateOfBirth]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User verification failed' });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 AND phone = $3 AND date_of_birth = $4',
      [passwordHash, email, phone, dateOfBirth]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;