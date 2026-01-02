require('dotenv').config();
const db = require('../src/config/database');

async function updateRolesToLowercase() {
  try {
    console.log('Connecting to database...');
    
    // Check current role values
    console.log('Checking current role values...');
    const currentRoles = await db.query('SELECT DISTINCT role FROM users');
    console.log('Current roles in database:', currentRoles.rows);
    
    // Update any uppercase or mixed case roles to lowercase
    console.log('Updating roles to lowercase...');
    const updateResult = await db.query(`
      UPDATE users 
      SET role = LOWER(role), updated_at = CURRENT_TIMESTAMP 
      WHERE role != LOWER(role) 
      RETURNING id, email, role
    `);
    
    if (updateResult.rows.length > 0) {
      console.log('Updated the following users to have lowercase roles:');
      updateResult.rows.forEach(user => {
        console.log(`- User ${user.id} (${user.email}): role = '${user.role}'`);
      });
    } else {
      console.log('✓ All user roles are already lowercase - no updates needed');
    }
    
    // Verify final state
    const finalRoles = await db.query('SELECT DISTINCT role FROM users ORDER BY role');
    console.log('Final role values:', finalRoles.rows.map(r => r.role));
    
    // Ensure the constraint only allows lowercase values
    console.log('Ensuring database constraint only allows lowercase roles...');
    await db.query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_role_check;
    `);
    
    await db.query(`
      ALTER TABLE users 
      ADD CONSTRAINT users_role_check 
      CHECK (role IN ('user', 'admin'));
    `);
    
    console.log('✓ Database constraint updated to enforce lowercase roles only');
    console.log('✓ Role lowercase update completed successfully');
    
  } catch (error) {
    console.error('Error updating roles:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

updateRolesToLowercase();