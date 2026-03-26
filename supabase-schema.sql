-- FinPlanner Database Schema for Supabase
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/tfgcjhthwbronycbpmrt/sql)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ACCOUNTS
-- ============================================
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SAVINGS', 'CURRENT', 'CREDIT_CARD', 'CASH', 'WALLET', 'INVESTMENT')),
  balance DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  color TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  group_name TEXT,
  is_system BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'TRANSFER')),
  description TEXT,
  date DATE NOT NULL,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUDGETS
-- ============================================
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  total_income DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month, year)
);

CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  allocated DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(budget_id, category_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_budgets_month_year ON budgets(month, year);

-- ============================================
-- DEFAULT CATEGORIES (Seed Data)
-- ============================================
INSERT INTO categories (name, icon, color, type, group_name, is_system, sort_order) VALUES
-- Expense Categories
('Rent / EMI', '🏠', '#6366f1', 'EXPENSE', 'Essential', true, 1),
('Groceries', '🛒', '#22c55e', 'EXPENSE', 'Essential', true, 2),
('Utilities', '💡', '#f59e0b', 'EXPENSE', 'Essential', true, 3),
('Transport', '🚗', '#3b82f6', 'EXPENSE', 'Essential', true, 4),
('Insurance', '🛡️', '#8b5cf6', 'EXPENSE', 'Essential', true, 5),
('Mobile & Internet', '📱', '#06b6d4', 'EXPENSE', 'Essential', true, 6),
('Dining Out', '🍽️', '#ef4444', 'EXPENSE', 'Lifestyle', true, 10),
('Entertainment', '🎬', '#ec4899', 'EXPENSE', 'Lifestyle', true, 11),
('Shopping', '🛍️', '#f97316', 'EXPENSE', 'Lifestyle', true, 12),
('Subscriptions', '📺', '#a855f7', 'EXPENSE', 'Lifestyle', true, 13),
('Travel', '✈️', '#14b8a6', 'EXPENSE', 'Lifestyle', true, 14),
('Hobbies', '🎮', '#84cc16', 'EXPENSE', 'Lifestyle', true, 15),
('Investments', '📈', '#10b981', 'EXPENSE', 'Financial', true, 20),
('Savings', '🏦', '#0ea5e9', 'EXPENSE', 'Financial', true, 21),
('Debt Payment', '💳', '#dc2626', 'EXPENSE', 'Financial', true, 22),
('Health & Medical', '🏥', '#f43f5e', 'EXPENSE', 'Personal', true, 30),
('Education', '📚', '#8b5cf6', 'EXPENSE', 'Personal', true, 31),
('Personal Care', '💇', '#d946ef', 'EXPENSE', 'Personal', true, 32),
('Gifts & Donations', '🎁', '#f472b6', 'EXPENSE', 'Personal', true, 33),
('Other Expenses', '📦', '#94a3b8', 'EXPENSE', 'Miscellaneous', true, 99),
-- Income Categories
('Salary', '💼', '#22c55e', 'INCOME', 'Income', true, 1),
('Freelance', '💻', '#3b82f6', 'INCOME', 'Income', true, 2),
('Business', '🏢', '#8b5cf6', 'INCOME', 'Income', true, 3),
('Investments', '📈', '#10b981', 'INCOME', 'Income', true, 4),
('Rental Income', '🏠', '#f59e0b', 'INCOME', 'Income', true, 5),
('Interest', '🏦', '#06b6d4', 'INCOME', 'Income', true, 6),
('Other Income', '💵', '#94a3b8', 'INCOME', 'Income', true, 99);

-- ============================================
-- ROW LEVEL SECURITY (Allow all for now)
-- ============================================
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no auth for simplicity)
CREATE POLICY "Allow all on accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on budgets" ON budgets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on budget_items" ON budget_items FOR ALL USING (true) WITH CHECK (true);
