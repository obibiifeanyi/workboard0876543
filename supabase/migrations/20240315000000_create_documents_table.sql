-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    department_id UUID REFERENCES departments(id),
    is_private BOOLEAN DEFAULT false NOT NULL,
    access_roles TEXT[] DEFAULT '{}'::TEXT[] NOT NULL
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Documents are viewable by staff if not private"
    ON documents FOR SELECT
    TO authenticated
    USING (
        (is_private = false) OR
        (auth.uid() = created_by) OR
        (EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        ))
    );

CREATE POLICY "Documents are insertable by managers and admins"
    ON documents FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

CREATE POLICY "Documents are updatable by managers and admins"
    ON documents FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

CREATE POLICY "Documents are deletable by managers and admins"
    ON documents FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

-- Create indexes
CREATE INDEX documents_created_by_idx ON documents(created_by);
CREATE INDEX documents_department_id_idx ON documents(department_id);
CREATE INDEX documents_is_private_idx ON documents(is_private); 