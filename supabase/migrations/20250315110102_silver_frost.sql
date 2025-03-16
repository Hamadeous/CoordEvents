/*
  # Add RLS policies for events table

  1. Security Changes
    - Enable RLS on events table if not already enabled
    - Add policies for:
      - Authenticated users can insert events
      - Anyone can view events
      - Event creators can view their own events
    
  Note: Added checks to prevent duplicate policy creation
*/

-- Enable RLS (idempotent operation)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can create events" ON events;
    DROP POLICY IF EXISTS "Anyone can view events" ON events;
    DROP POLICY IF EXISTS "Users can view their own events" ON events;
END $$;

-- Allow authenticated users to insert events
CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Allow anyone to view events (for participation)
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to view their own events
CREATE POLICY "Users can view their own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());