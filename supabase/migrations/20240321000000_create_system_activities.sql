
-- Create the system_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.system_activities ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users (since this is activity log)
CREATE POLICY "Enable read access for all authenticated users" ON public.system_activities
    FOR SELECT TO authenticated
    USING (true);

-- Allow insert for authenticated users (they can only insert their own activities)
CREATE POLICY "Enable insert for authenticated users" ON public.system_activities
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create index for better query performance
CREATE INDEX idx_system_activities_created_at ON public.system_activities(created_at DESC);
