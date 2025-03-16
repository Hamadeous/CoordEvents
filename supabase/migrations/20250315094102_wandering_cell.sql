/*
  # Initial Schema Setup for Scheduling App

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
    
    - `participants`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `availability`
      - `id` (uuid, primary key)
      - `participant_id` (uuid, references participants)
      - `date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their events
    - Add policies for public access to view and participate in events
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO anon
  USING (true);

-- Policies for participants
CREATE POLICY "Anyone can add participants"
  ON participants FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view participants"
  ON participants FOR SELECT
  TO anon
  USING (true);

-- Policies for availability
CREATE POLICY "Anyone can add availability"
  ON availability FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view availability"
  ON availability FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);
CREATE INDEX IF NOT EXISTS idx_availability_participant_id ON availability(participant_id);