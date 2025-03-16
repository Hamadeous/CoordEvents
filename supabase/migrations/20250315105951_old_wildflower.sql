/*
  # Add RLS policies for events table

  1. Security Changes
    - Enable RLS on events table
    - Add policies for:
      - Authenticated users can insert events
      - Anyone can view events
      - Event creators can view their own events
*/

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

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