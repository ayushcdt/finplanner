"use client"

import { useState, useEffect, useCallback } from "react"
import { getTransactions, getAccounts, getBudget } from "@/lib/storage"
import { getDaysInMonth, differenceInDays, endOfMonth } from "date-fns"

interface BudgetProgress {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  allocated: number
  spent: number
  remaining: number
  percentage: number
}

interface AnalyticsSummary {
  totalIncome: number
  totalExpenses: number
  totalPending: number
  netSavings: number
  savings: number
  savingsRate: number
  totalBalance: number
  budgetAllocated: number
  budgetUsed: number
  daysRemaining: number
  daysInMonth: number
  budgetProgress: BudgetProgress[]
  categoryBreakdown: Array<{
    categoryId: string
    categoryName: string
    categoryIcon: string
    categoryColor: string
    amount: number
    percentage: number
  }>
  categorySpending: Array<{
    categoryId: string
    categoryName: string
    categoryIcon: string
    categoryColor: string
    amount: number
    percentage: number
  }>
  dailySpending: Array<{
    date: string
    amount: number
  }>
  weeklySpending: Array<{
    label: string
    spent: number
    budget: number
  }>
}

export function useAnalytics(month: number, year: number) {
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [transactions, accounts, budget] = await Promise.all([
        getTransactions({ month, year }),
        getAccounts(),
        getBudget(month, year),
      ])

      let totalIncome = 0
      let totalExpenses = 0
      let totalPending = 0
      const categorySpending = new Map<string, { amount: number; name: string; icon: string; color: string }>()
      const dailyMap = new Map<string, number>()

      transactions.forEach(t => {
        // Check if transaction is pending (not yet paid)
        const isPending = t.notes?.toUpperCase().includes('PENDING') || t.notes?.toUpperCase().includes('DUE')

        if (t.type === 'INCOME') {
          if (!isPending) {
            totalIncome += t.amount
          }
        } else if (t.type === 'EXPENSE') {
          if (isPending) {
            // Track pending/due amounts separately
            totalPending += t.amount
          } else {
            // Only count paid transactions in expenses
            totalExpenses += t.amount

            // Category breakdown (only for paid)
            const cat = t.category
            if (cat) {
              const existing = categorySpending.get(t.category_id) || { amount: 0, name: cat.name, icon: cat.icon, color: cat.color }
              existing.amount += t.amount
              categorySpending.set(t.category_id, existing)
            }

            // Daily spending (only for paid)
            const dateKey = typeof t.date === 'string' ? t.date.split('T')[0] : t.date
            dailyMap.set(String(dateKey), (dailyMap.get(String(dateKey)) || 0) + t.amount)
          }
        }
      })

      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
      const netSavings = totalIncome - totalExpenses
      const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

      // Budget calculations
      const currentDate = new Date()
      const monthEnd = endOfMonth(new Date(year, month - 1))
      const daysInMonthCount = getDaysInMonth(new Date(year, month - 1))
      const daysRemaining = Math.max(0, differenceInDays(monthEnd, currentDate) + 1)

      let budgetAllocated = 0
      const budgetProgress: BudgetProgress[] = []

      if (budget?.items) {
        budget.items.forEach(item => {
          budgetAllocated += item.allocated
          const spent = categorySpending.get(item.category_id)?.amount || 0
          const remaining = item.allocated - spent
          budgetProgress.push({
            categoryId: item.category_id,
            categoryName: item.category?.name || 'Unknown',
            categoryIcon: item.category?.icon || '📦',
            categoryColor: item.category?.color || '#94a3b8',
            allocated: item.allocated,
            spent,
            remaining,
            percentage: item.allocated > 0 ? (spent / item.allocated) * 100 : 0,
          })
        })
      }

      const categoryBreakdown = Array.from(categorySpending.entries()).map(([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        categoryIcon: data.icon,
        categoryColor: data.color,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      })).sort((a, b) => b.amount - a.amount)

      const dailySpending = Array.from(dailyMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date))

      // Calculate weekly spending from daily spending
      const weeklySpending: Array<{ label: string; spent: number; budget: number }> = []
      const weeklyBudget = budgetAllocated / 4

      // Group daily spending into weeks
      const weekMap = new Map<number, number>()
      dailySpending.forEach(({ date, amount }) => {
        const d = new Date(date)
        const weekNum = Math.ceil(d.getDate() / 7)
        weekMap.set(weekNum, (weekMap.get(weekNum) || 0) + amount)
      })

      for (let i = 1; i <= 4; i++) {
        weeklySpending.push({
          label: `Week ${i}`,
          spent: weekMap.get(i) || 0,
          budget: weeklyBudget,
        })
      }

      // Calculate budget used as percentage
      const budgetUsedPercentage = budgetAllocated > 0 ? (totalExpenses / budgetAllocated) * 100 : 0

      setData({
        totalIncome,
        totalExpenses,
        totalPending,
        netSavings,
        savings: netSavings,
        savingsRate,
        totalBalance,
        budgetAllocated,
        budgetUsed: budgetUsedPercentage,
        daysRemaining,
        daysInMonth: daysInMonthCount,
        budgetProgress,
        categoryBreakdown,
        categorySpending: categoryBreakdown,
        dailySpending,
        weeklySpending,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics")
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
