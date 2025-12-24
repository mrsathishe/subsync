-- Add category column to subscription_plans table
ALTER TABLE subscription_plans ADD COLUMN category VARCHAR(50) CHECK (category IN ('OTT', 'Mobile', 'Broadband'));

-- Update existing plans with default categories (if any exist)
-- This would be customized based on actual data
UPDATE subscription_plans SET category = 'OTT' WHERE category IS NULL;

-- Create index for better performance
CREATE INDEX idx_subscription_plans_category ON subscription_plans(category);