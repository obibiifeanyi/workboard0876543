
-- Create a storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Create RLS policies for the documents bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Create a table to store document analysis results
CREATE TABLE IF NOT EXISTS public.document_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    analysis_status TEXT DEFAULT 'pending',
    analysis_result JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.document_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_analysis
CREATE POLICY "Users can view their own documents"
ON public.document_analysis FOR SELECT
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "Users can insert their own documents"
ON public.document_analysis FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Add updated_at trigger
CREATE TRIGGER set_timestamp_document_analysis
    BEFORE UPDATE ON public.document_analysis
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
