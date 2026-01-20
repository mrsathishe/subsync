const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify JWT token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists in database
    const userResult = await db.query(
      'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1',
      [user.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    
    const dbUser = userResult.rows[0];
    
    // Check if user is still active
    if (!dbUser.is_active) {
      return res.status(401).json({ error: 'User account is deactivated' });
    }
    
    // Update req.user with fresh data from database
    req.user = {
      userId: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      role: dbUser.role
    };
    
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    } else {
      console.error('Authentication error:', err);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  }
};

// Middleware to check if user has admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role.toLowerCase() !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

module.exports = { 
  authenticateToken, 
  requireAdmin 
};