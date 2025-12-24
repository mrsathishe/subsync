-- Add date_of_birth and gender columns to existing users table
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Make phone number unique to support phone login
ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);

-- Create index on phone column for performance
CREATE INDEX idx_users_phone ON users(phone);