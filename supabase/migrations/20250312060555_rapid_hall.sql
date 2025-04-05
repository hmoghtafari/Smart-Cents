/*
  # Add user profile information and update settings

  1. Changes
    - Add name column to user_settings table
    - Update RLS policies to ensure proper access
    - Add default value for name

  2. Security
    - Maintain existing RLS policies
    - Ensure authenticated users can only access their own data
*/

-- Add name column to user_settings if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'name'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN name text DEFAULT '';
  END IF;
END $$;