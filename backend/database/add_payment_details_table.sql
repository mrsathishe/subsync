-- Add payment_details table for tracking payments when subscription_sharing.payment_date is set

CREATE TABLE IF NOT EXISTS public.payment_details
(
    id integer NOT NULL DEFAULT nextval('payment_details_id_seq'::regclass),
    subscription_id integer NOT NULL,
    subscription_sharing_id integer NOT NULL,
    payment_via character varying(100) COLLATE pg_catalog."default",
    actual_amount numeric(10,2),
    paid_amount numeric(10,2),
    paid_date timestamp without time zone,
    paid_via character varying(100) COLLATE pg_catalog."default",
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    CONSTRAINT payment_details_pkey PRIMARY KEY (id),
    CONSTRAINT payment_details_subscription_id_fkey FOREIGN KEY (subscription_id)
        REFERENCES public.subscriptions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT payment_details_subscription_sharing_id_fkey FOREIGN KEY (subscription_sharing_id)
        REFERENCES public.subscription_sharing (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT payment_details_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT payment_details_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Create sequence for payment_details if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS payment_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE payment_details_id_seq OWNED BY public.payment_details.id;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_details_subscription_id ON public.payment_details(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_details_subscription_sharing_id ON public.payment_details(subscription_sharing_id);
CREATE INDEX IF NOT EXISTS idx_payment_details_paid_date ON public.payment_details(paid_date);
CREATE INDEX IF NOT EXISTS idx_payment_details_created_date ON public.payment_details(created_date);

-- Create trigger function for updating updated_date automatically
CREATE OR REPLACE FUNCTION update_payment_details_updated_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatically updating updated_date
CREATE TRIGGER update_payment_details_updated_date_trigger
    BEFORE UPDATE ON public.payment_details
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_details_updated_date();

-- Create trigger function to automatically create payment_details when subscription_sharing.payment_date is set
CREATE OR REPLACE FUNCTION create_payment_details_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create payment_details record if payment_date is not null and wasn't null before
    IF NEW.payment_date IS NOT NULL AND (OLD.payment_date IS NULL OR OLD.payment_date != NEW.payment_date) THEN
        INSERT INTO public.payment_details (
            subscription_id,
            subscription_sharing_id,
            actual_amount,
            paid_amount,
            paid_date,
            created_date,
            updated_date
        ) VALUES (
            NEW.subscription_id,
            NEW.id,
            (SELECT amount FROM public.subscriptions WHERE id = NEW.subscription_id),
            (SELECT amount FROM public.subscriptions WHERE id = NEW.subscription_id),
            NEW.payment_date,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger on subscription_sharing to automatically create payment_details
CREATE TRIGGER create_payment_details_trigger
    AFTER INSERT OR UPDATE ON public.subscription_sharing
    FOR EACH ROW
    EXECUTE FUNCTION create_payment_details_on_payment();

-- Add comments for documentation
COMMENT ON TABLE public.payment_details IS 'Stores payment details for subscription sharing. Records are automatically created when subscription_sharing.payment_date is set.';
COMMENT ON COLUMN public.payment_details.subscription_id IS 'Reference to the main subscription';
COMMENT ON COLUMN public.payment_details.subscription_sharing_id IS 'Reference to the subscription sharing record that triggered this payment';
COMMENT ON COLUMN public.payment_details.payment_via IS 'Method used to make the payment (e.g., UPI, Credit Card, Bank Transfer)';
COMMENT ON COLUMN public.payment_details.actual_amount IS 'The actual amount that should be paid';
COMMENT ON COLUMN public.payment_details.paid_amount IS 'The amount actually paid';
COMMENT ON COLUMN public.payment_details.paid_date IS 'Date when payment was made';
COMMENT ON COLUMN public.payment_details.paid_via IS 'Specific payment method used (e.g., PayPal, Stripe, etc.)';