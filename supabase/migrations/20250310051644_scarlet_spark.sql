/*
  # Fix Categories RLS Policies

  1. Security Changes
    - Enable RLS on categories table
    - Add policies for:
      - Authenticated users can read their own categories
      - Authenticated users can insert their own categories
      - Authenticated users can update their own categories
      - Authenticated users can delete their own categories
*/

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can manage their own categories" ON categories;

-- Create specific policies for each operation
CREATE POLICY "Users can read their own categories"
ON categories FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
ON categories FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
ON categories FOR DELETE
TO authenticated
USING (auth.uid() = user_id);