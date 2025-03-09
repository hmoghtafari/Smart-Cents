/*
  # Initial Schema for SmartCents Finance App

  1. New Tables
    - categories
      - id (uuid, primary key)
      - name (text)
      - type (text: 'income' or 'expense')
      - color (text)
      - parent_id (uuid, self-referential foreign key)
      - created_at (timestamptz)
    
    - transactions
      - id (uuid, primary key)
      - amount (numeric)
      - category_id (uuid, foreign key)
      - description (text)
      - date (date)
      - type (text: 'income' or 'expense')
      - created_at (timestamptz)
    
    - budgets
      - id (uuid, primary key)
      - category_id (uuid, foreign key)
      - amount (numeric)
      - period (text: 'monthly' or 'yearly')
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  color text NOT NULL,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL,
  category_id uuid REFERENCES categories(id),
  description text,
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Create budgets table
CREATE TABLE budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  amount numeric NOT NULL,
  period text NOT NULL CHECK (period IN ('monthly', 'yearly')),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own budgets"
  ON budgets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);