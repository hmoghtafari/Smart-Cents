/*
  # Fix RLS Policies for User Settings and Transactions

  1. Changes
    - Update RLS policies to properly handle user authentication
    - Fix single row selection for user settings
    - Ensure proper access control for transactions and categories

  2. Security
    - Maintain strict user data isolation
    - Enable proper authentication checks
*/

-- Drop existing policies safely
DO $$ 
BEGIN
  -- Drop user_settings policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own settings'
    AND tablename = 'user_settings'
  ) THEN
    DROP POLICY "Users can manage their own settings" ON user_settings;
  END IF;

  -- Drop transactions policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own transactions'
    AND tablename = 'transactions'
  ) THEN
    DROP POLICY "Users can manage their own transactions" ON transactions;
  END IF;

  -- Drop categories policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own categories'
    AND tablename = 'categories'
  ) THEN
    DROP POLICY "Users can manage their own categories" ON categories;
  END IF;

  -- Drop individual categories policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read their own categories'
    AND tablename = 'categories'
  ) THEN
    DROP POLICY "Users can read their own categories" ON categories;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own categories'
    AND tablename = 'categories'
  ) THEN
    DROP POLICY "Users can insert their own categories" ON categories;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own categories'
    AND tablename = 'categories'
  ) THEN
    DROP POLICY "Users can update their own categories" ON categories;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own categories'
    AND tablename = 'categories'
  ) THEN
    DROP POLICY "Users can delete their own categories" ON categories;
  END IF;
END $$;

-- Create user_settings policies
CREATE POLICY "Users can read their own settings"
ON user_settings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON user_settings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON user_settings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create transactions policies
CREATE POLICY "Users can read their own transactions"
ON transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON transactions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON transactions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create categories policies
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