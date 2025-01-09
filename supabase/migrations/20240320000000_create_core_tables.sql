-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create project_assignments table
CREATE TABLE IF NOT EXISTS public.project_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_name TEXT NOT NULL,
    description TEXT,
    assigned_to UUID NOT NULL REFERENCES public.profiles(id),
    department_id UUID NOT NULL REFERENCES public.departments(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create document_archive table
CREATE TABLE IF NOT EXISTS public.document_archive (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
    department_id UUID REFERENCES public.departments(id),
    tags TEXT[],
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_archive ENABLE ROW LEVEL SECURITY;

-- Departments policies
CREATE POLICY "Allow read access to all authenticated users"
    ON public.departments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow write access to managers and admins"
    ON public.departments FOR INSERT
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM public.profiles 
        WHERE role IN ('manager', 'admin')
    ));

CREATE POLICY "Allow update access to managers and admins"
    ON public.departments FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM public.profiles 
        WHERE role IN ('manager', 'admin')
    ));

-- Project assignments policies
CREATE POLICY "Allow read access to assigned users and department managers"
    ON public.project_assignments FOR SELECT
    TO authenticated
    USING (
        auth.uid() = assigned_to
        OR auth.uid() IN (
            SELECT manager_id FROM public.departments 
            WHERE id = department_id
        )
        OR auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role = 'admin'
        )
    );

CREATE POLICY "Allow write access to managers and admins"
    ON public.project_assignments FOR INSERT
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM public.profiles 
        WHERE role IN ('manager', 'admin')
    ));

-- Document archive policies
CREATE POLICY "Allow read access to department members"
    ON public.document_archive FOR SELECT
    TO authenticated
    USING (
        auth.uid() = uploaded_by
        OR department_id IN (
            SELECT id FROM public.departments 
            WHERE manager_id = auth.uid()
        )
        OR auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role = 'admin'
        )
    );

CREATE POLICY "Allow upload access to authenticated users"
    ON public.document_archive FOR INSERT
    TO authenticated
    USING (auth.uid() = uploaded_by);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON public.departments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_assignments_updated_at
    BEFORE UPDATE ON public.project_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_archive_updated_at
    BEFORE UPDATE ON public.document_archive
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();