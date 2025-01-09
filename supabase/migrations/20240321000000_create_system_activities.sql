CREATE TABLE IF NOT EXISTS public.system_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.system_activities ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to authenticated users"
    ON public.system_activities FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert access to authenticated users
CREATE POLICY "Allow insert access to authenticated users"
    ON public.system_activities FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_system_activities_created_at ON public.system_activities(created_at DESC);