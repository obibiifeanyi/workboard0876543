-- Create system_activities table
CREATE TABLE IF NOT EXISTS system_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    details TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    target_id UUID,
    target_type TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_system_activities_type ON system_activities(type);
CREATE INDEX IF NOT EXISTS idx_system_activities_actor_id ON system_activities(actor_id);
CREATE INDEX IF NOT EXISTS idx_system_activities_created_at ON system_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_activities_target ON system_activities(target_type, target_id);

-- Enable Row Level Security
ALTER TABLE system_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "System activities are viewable by authenticated users"
    ON system_activities
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "System activities can be created by authenticated users"
    ON system_activities
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create function to automatically set created_at
CREATE OR REPLACE FUNCTION set_created_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set created_at
CREATE TRIGGER set_system_activities_created_at
    BEFORE INSERT ON system_activities
    FOR EACH ROW
    EXECUTE FUNCTION set_created_at();

-- Add comment to table
COMMENT ON TABLE system_activities IS 'Stores system-wide activity logs for auditing and tracking purposes';

-- Add comments to columns
COMMENT ON COLUMN system_activities.id IS 'Unique identifier for the activity log entry';
COMMENT ON COLUMN system_activities.type IS 'Type of activity (e.g., user.created, document.uploaded)';
COMMENT ON COLUMN system_activities.actor_id IS 'ID of the user who performed the action';
COMMENT ON COLUMN system_activities.details IS 'Human-readable description of the activity';
COMMENT ON COLUMN system_activities.metadata IS 'Additional JSON data related to the activity';
COMMENT ON COLUMN system_activities.created_at IS 'Timestamp when the activity occurred';
COMMENT ON COLUMN system_activities.target_id IS 'ID of the entity affected by the activity (if applicable)';
COMMENT ON COLUMN system_activities.target_type IS 'Type of the entity affected by the activity (if applicable)'; 