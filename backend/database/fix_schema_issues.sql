-- Fix database schema issues and inconsistencies

-- 1. Add missing foreign key constraints
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.users(id) 
ON DELETE SET NULL;

ALTER TABLE public.ids_sharing_users 
ADD CONSTRAINT ids_sharing_users_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) 
ON DELETE SET NULL;

-- 2. Add missing updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Add missing updated_at triggers
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_sharing_updated_at ON public.subscription_sharing;
CREATE TRIGGER update_subscription_sharing_updated_at 
    BEFORE UPDATE ON public.subscription_sharing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Add updated_at column to subscription_sharing if missing
ALTER TABLE public.subscription_sharing 
ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;

-- 5. Create missing sequences (if they don't exist)
CREATE SEQUENCE IF NOT EXISTS public.subscriptions_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;

CREATE SEQUENCE IF NOT EXISTS public.subscription_sharing_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.subscription_sharing_id_seq OWNED BY public.subscription_sharing.id;

CREATE SEQUENCE IF NOT EXISTS public.ids_sharing_users_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.ids_sharing_users_id_seq OWNED BY public.ids_sharing_users.id;

-- 6. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_by ON public.subscriptions(created_by);
CREATE INDEX IF NOT EXISTS idx_subscriptions_service_name ON public.subscriptions(service_name);
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON public.subscriptions(category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON public.subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_sharing ON public.subscriptions("isSharing");

CREATE INDEX IF NOT EXISTS idx_subscription_sharing_user_id ON public.subscription_sharing(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_sharing_payment_status ON public.subscription_sharing(payment_status);
CREATE INDEX IF NOT EXISTS idx_subscription_sharing_payment_date ON public.subscription_sharing(payment_date);

CREATE INDEX IF NOT EXISTS idx_ids_sharing_users_user_id ON public.ids_sharing_users(user_id);
CREATE INDEX IF NOT EXISTS idx_ids_sharing_users_ids_sharing_id ON public.ids_sharing_users(ids_sharing_id);

-- 7. Add missing constraint checks
ALTER TABLE public.subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_status_check 
CHECK (status IN ('active', 'cancelled', 'expired', 'suspended'));

ALTER TABLE public.subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_owner_type_check;
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_owner_type_check 
CHECK (owner_type IN ('personal', 'family', 'business'));

ALTER TABLE public.subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('Monthly', '3 Months', '6 Months', 'Yearly', 'Custom'));

-- 8. Add table comments for documentation
COMMENT ON TABLE public.subscriptions IS 'Main subscriptions table storing all subscription details';
COMMENT ON TABLE public.subscription_sharing IS 'Tracks users sharing subscription costs and their payment status';
COMMENT ON TABLE public.ids_sharing_users IS 'Tracks users sharing subscription login credentials';

-- 9. Add column comments
COMMENT ON COLUMN public.subscriptions.created_by IS 'ID of admin user who created this subscription';
COMMENT ON COLUMN public.subscription_sharing.payment_date IS 'Date when payment was made by the sharing user';
COMMENT ON COLUMN public.subscription_sharing.payment_status IS 'Payment status: paid, not_paid, or pending';