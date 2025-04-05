/*
  # Add user settings table

  1. New Tables
    - `user_settings`
      - `user_id` (uuid, primary key)
      - `language` (text)
      - `currency` (text)
      - `theme` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_settings` table
    - Add policy for authenticated users to manage their own settings
*/

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  language text NOT NULL DEFAULT 'en',
  currency text NOT NULL DEFAULT 'USD',
  theme text NOT NULL DEFAULT 'light',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_settings' 
    AND policyname = 'Users can manage their own settings'
  ) THEN
    CREATE POLICY "Users can manage their own settings"
      ON user_settings
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;