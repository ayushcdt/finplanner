// ============================================
// DATABASE TYPES (matching Prisma schema)
// ============================================

export type AccountType =
  | "SAVINGS"
  | "CURRENT"
  | "CREDIT_CARD"
  | "CASH"
  | "WALLET"
  | "INVESTMENT"

export type CategoryType = "INCOME" | "EXPENSE"

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER"

export type Frequency =
  | "DAILY"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "ONE_TIME"

// ============================================
// APPLICATION TYPES
// ============================================

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  userId: string
  name: string
  type: AccountType
  balance: number
  currency: string
  color: string | null
  icon: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  userId: string | null
  name: string
  icon: string
  color: string
  type: CategoryType
  group: string | null
  isSystem: boolean
  isActive: boolean
  parentId: string | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  categoryId: string
  amount: number
  type: TransactionType
  description: string | null
  date: Date
  notes: string | null
  tags: string[]
  isRecurring: boolean
  recurringId: string | null
  createdAt: Date
  updatedAt: Date
  // Relations
  account?: Account
  category?: Category
}

export interface Income {
  id: string
  userId: string
  name: string
  amount: number
  frequency: Frequency
  dayOfMonth: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  id: string
  userId: string
  month: number
  year: number
  totalIncome: number
  notes: string | null
  createdAt: Date
  updatedAt: Date
  items?: BudgetItem[]
}

export interface BudgetItem {
  id: string
  budgetId: string
  categoryId: string
  allocated: number
  notes: string | null
  createdAt: Date
  updatedAt: Date
  category?: Category
}

// ============================================
// UI/FORM TYPES
// ============================================

export interface TransactionFormData {
  type: TransactionType
  amount: number
  categoryId: string
  accountId: string
  description?: string
  date: Date
  notes?: string
  tags?: string[]
}

export interface BudgetFormData {
  month: number
  year: number
  totalIncome: number
  allocations: Record<string, number>
}

export interface CategoryFormData {
  name: string
  icon: string
  color: string
  type: CategoryType
  group?: string
}

export interface AccountFormData {
  name: string
  type: AccountType
  balance: number
  currency: string
  color?: string
  icon?: string
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface MonthlySummary {
  month: number
  year: number
  totalIncome: number
  totalExpenses: number
  savings: number
  savingsRate: number
  budgetAllocated: number
  budgetUsed: number
}

export interface CategorySpending {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  amount: number
  percentage: number
  transactionCount: number
}

export interface WeeklySpending {
  week: number
  startDate: Date
  endDate: Date
  spent: number
  budget: number
}

export interface DailyBalance {
  date: Date
  income: number
  expense: number
  balance: number
}
