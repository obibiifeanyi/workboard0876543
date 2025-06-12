-- Add 'staff_admin' to the role enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        -- This block will only be executed if the enum type does not exist
        CREATE TYPE public.user_role_enum AS ENUM ('user', 'manager', 'admin', 'staff', 'accountant', 'hr', 'staff_admin');
    ELSE
        -- If the enum exists, add 'staff_admin' if it's not already there
        ALTER TYPE public.user_role_enum ADD VALUE 'staff_admin' AFTER 'hr';
    END IF;
END
$$;

-- Update existing 'super_admin' roles to 'staff_admin'
UPDATE public.profiles
SET role = 'staff_admin'
WHERE role = 'super_admin';

-- Add RLS policies for staff_admin role if not already handled by a generic admin policy
-- Assuming a generic policy for 'admin' roles, adjust if more specific RLS is needed.
-- For example, if you have a policy that grants full access to 'admin' roles,
-- and 'staff_admin' should also have full access, no new policy might be needed here.
-- If specific policies are needed, uncomment and define them:

-- ALTER TABLE public.some_table ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow staff_admin access to some_table" ON public.some_table FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'staff_admin'));

-- Example: Granting staff_admin full access to all tables (if a blanket policy doesn't exist)
-- This should be done carefully and only if it aligns with your security model
-- For a more granular approach, define specific policies per table for 'staff_admin'

-- Re-grant full access to authenticated users based on their role
-- This ensures 'staff_admin' gets appropriate permissions if existing policies rely on role checks
-- For tables with existing policies, ensure 'staff_admin' is included where appropriate.

-- Example of a generic policy that includes 'staff_admin' (if you don't have one):
-- DROP POLICY IF EXISTS "Enable read access for all users" ON public.some_table;
-- CREATE POLICY "Enable read access for all users" ON public.some_table FOR SELECT
-- USING (auth.role() = 'authenticated' OR auth.role() = 'staff_admin');

-- Ensure the profiles table is updated to reflect the new role type
ALTER TABLE public.profiles
ALTER COLUMN role TYPE public.user_role_enum USING role::text::public.user_role_enum; 