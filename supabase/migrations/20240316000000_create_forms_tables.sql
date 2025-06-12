-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    department_id UUID REFERENCES departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- Create form fields table
CREATE TABLE IF NOT EXISTS form_fields (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID REFERENCES forms(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    required BOOLEAN DEFAULT false NOT NULL,
    options TEXT[] DEFAULT '{}'::TEXT[],
    order INTEGER NOT NULL
);

-- Create form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID REFERENCES forms(id) ON DELETE CASCADE NOT NULL,
    submitted_by UUID REFERENCES auth.users(id) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    data JSONB NOT NULL
);

-- Enable Row Level Security
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for forms
CREATE POLICY "Forms are viewable by department members"
    ON forms FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND (
                profiles.department_id = forms.department_id
                OR profiles.role IN ('admin', 'manager', 'office_admin')
            )
        )
    );

CREATE POLICY "Forms are insertable by managers and admins"
    ON forms FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

CREATE POLICY "Forms are updatable by managers and admins"
    ON forms FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

CREATE POLICY "Forms are deletable by managers and admins"
    ON forms FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

-- Create policies for form fields
CREATE POLICY "Form fields are viewable by department members"
    ON form_fields FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM forms
            JOIN profiles ON profiles.department_id = forms.department_id
            WHERE forms.id = form_fields.form_id
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Form fields are insertable by managers and admins"
    ON form_fields FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM forms
            JOIN profiles ON profiles.id = auth.uid()
            WHERE forms.id = form_fields.form_id
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

CREATE POLICY "Form fields are updatable by managers and admins"
    ON form_fields FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM forms
            JOIN profiles ON profiles.id = auth.uid()
            WHERE forms.id = form_fields.form_id
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

CREATE POLICY "Form fields are deletable by managers and admins"
    ON form_fields FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM forms
            JOIN profiles ON profiles.id = auth.uid()
            WHERE forms.id = form_fields.form_id
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

-- Create policies for form submissions
CREATE POLICY "Form submissions are viewable by department managers and admins"
    ON form_submissions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM forms
            JOIN profiles ON profiles.department_id = forms.department_id
            WHERE forms.id = form_submissions.form_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager', 'office_admin')
        )
    );

CREATE POLICY "Form submissions are insertable by department members"
    ON form_submissions FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM forms
            JOIN profiles ON profiles.department_id = forms.department_id
            WHERE forms.id = form_submissions.form_id
            AND profiles.id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX forms_department_id_idx ON forms(department_id);
CREATE INDEX forms_created_by_idx ON forms(created_by);
CREATE INDEX form_fields_form_id_idx ON form_fields(form_id);
CREATE INDEX form_submissions_form_id_idx ON form_submissions(form_id);
CREATE INDEX form_submissions_submitted_by_idx ON form_submissions(submitted_by); 