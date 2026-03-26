// Supabase-based storage for FinPlanner

import { supabase } from './supabase'

// Types
export type AccountType = 'SAVINGS' | 'CURRENT' | 'CREDIT_CARD' | 'CASH' | 'WALLET' | 'INVESTMENT'
export type CategoryType = 'INCOME' | 'EXPENSE'
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

export interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  currency: string
  color?: string
  icon?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: CategoryType
  group_name?: string
  is_system: boolean
  is_active: boolean
  sort_order: number
}

export interface Transaction {
  id: string
  account_id: string
  category_id: string
  amount: number
  type: TransactionType
  description?: string
  date: string
  notes?: string
  tags: string[]
  created_at: string
  updated_at: string
  // Populated
  category?: Category
  account?: Account
}

export interface Budget {
  id: string
  month: number
  year: number
  total_income: number
  items: BudgetItem[]
  created_at: string
  updated_at: string
}

export interface BudgetItem {
  id: string
  category_id: string
  allocated: number
  category?: Category
}

// ============ ACCOUNTS ============
export async function getAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createAccount(data: {
  name: string
  type: AccountType
  balance?: number
  currency?: string
  color?: string
  icon?: string
}): Promise<Account> {
  const { data: account, error } = await supabase
    .from('accounts')
    .insert({
      name: data.name,
      type: data.type,
      balance: data.balance || 0,
      currency: data.currency || 'INR',
      color: data.color,
      icon: data.icon,
    })
    .select()
    .single()

  if (error) throw error
  return account
}

export async function updateAccount(id: string, data: Partial<Account>): Promise<void> {
  const { error } = await supabase
    .from('accounts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function deleteAccount(id: string): Promise<void> {
  const { error } = await supabase
    .from('accounts')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

// ============ CATEGORIES ============
export async function getCategories(type?: CategoryType): Promise<Category[]> {
  let query = supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createCategory(data: {
  name: string
  icon: string
  color: string
  type: CategoryType
  group_name?: string
}): Promise<Category> {
  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name: data.name,
      icon: data.icon,
      color: data.color,
      type: data.type,
      group_name: data.group_name || 'Custom',
      is_system: false,
      sort_order: 50,
    })
    .select()
    .single()

  if (error) throw error
  return category
}

// ============ TRANSACTIONS ============
export async function getTransactions(filters?: {
  month?: number
  year?: number
  type?: TransactionType
  limit?: number
}): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      category:categories(*),
      account:accounts(*)
    `)
    .order('date', { ascending: false })

  if (filters?.month && filters?.year) {
    const startDate = new Date(filters.year, filters.month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(filters.year, filters.month, 0).toISOString().split('T')[0]
    query = query.gte('date', startDate).lte('date', endDate)
  }

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createTransaction(data: {
  amount: number
  type: TransactionType
  category_id: string
  account_id: string
  description?: string
  date: string
  notes?: string
}): Promise<Transaction> {
  // Insert transaction
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({
      amount: data.amount,
      type: data.type,
      category_id: data.category_id,
      account_id: data.account_id,
      description: data.description,
      date: data.date,
      notes: data.notes,
    })
    .select()
    .single()

  if (error) throw error

  // Update account balance
  const balanceChange = data.type === 'INCOME' ? data.amount : -data.amount
  const { error: updateError } = await supabase.rpc('update_account_balance', {
    acc_id: data.account_id,
    amount_change: balanceChange,
  })

  // If RPC doesn't exist, do it manually
  if (updateError) {
    const { data: acc } = await supabase.from('accounts').select('balance').eq('id', data.account_id).single()
    if (acc) {
      await supabase.from('accounts').update({ balance: acc.balance + balanceChange }).eq('id', data.account_id)
    }
  }

  return transaction
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>,
  oldTransaction: Transaction
): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error

  // Adjust account balance if amount/type changed
  if (data.amount !== undefined || data.type !== undefined) {
    const oldEffect = oldTransaction.type === 'INCOME' ? oldTransaction.amount : -oldTransaction.amount
    const newAmount = data.amount ?? oldTransaction.amount
    const newType = data.type ?? oldTransaction.type
    const newEffect = newType === 'INCOME' ? newAmount : -newAmount
    const diff = newEffect - oldEffect

    if (diff !== 0) {
      const { data: acc } = await supabase.from('accounts').select('balance').eq('id', oldTransaction.account_id).single()
      if (acc) {
        await supabase.from('accounts').update({ balance: acc.balance + diff }).eq('id', oldTransaction.account_id)
      }
    }
  }
}

export async function deleteTransaction(id: string, transaction: Transaction): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error

  // Reverse balance effect
  const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.amount
  const { data: acc } = await supabase.from('accounts').select('balance').eq('id', transaction.account_id).single()
  if (acc) {
    await supabase.from('accounts').update({ balance: acc.balance + balanceChange }).eq('id', transaction.account_id)
  }
}

// ============ BUDGETS ============
export async function getBudget(month: number, year: number): Promise<Budget | null> {
  const { data: budget, error } = await supabase
    .from('budgets')
    .select(`
      *,
      items:budget_items(
        *,
        category:categories(*)
      )
    `)
    .eq('month', month)
    .eq('year', year)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return budget || null
}

export async function saveBudget(data: {
  month: number
  year: number
  total_income: number
  allocations: Record<string, number>
}): Promise<Budget> {
  // Upsert budget
  const { data: budget, error } = await supabase
    .from('budgets')
    .upsert({
      month: data.month,
      year: data.year,
      total_income: data.total_income,
    }, { onConflict: 'month,year' })
    .select()
    .single()

  if (error) throw error

  // Delete existing items
  await supabase.from('budget_items').delete().eq('budget_id', budget.id)

  // Insert new items
  const items = Object.entries(data.allocations).map(([category_id, allocated]) => ({
    budget_id: budget.id,
    category_id,
    allocated,
  }))

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from('budget_items').insert(items)
    if (itemsError) throw itemsError
  }

  return { ...budget, items: [] }
}
