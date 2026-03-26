"use client"

import { useApi } from "./use-api"

interface CategorySpending {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  amount: number
  percentage: number
  transactionCount: number
}

interface WeeklySpending {
  week: number
  label: string
  spent: number
  budget: number
}

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

interface MonthlySummary {
  month: number
  year: number
  totalIncome: number
  totalExpenses: number
  savings: number
  savingsRate: number
  budgetAllocated: number
  budgetUsed: number
  daysRemaining: number
  daysInMonth: number
  categorySpending: CategorySpending[]
  weeklySpending: WeeklySpending[]
  budgetProgress: BudgetProgress[]
  transactionCount: number
}

export function useAnalytics(month?: number, year?: number) {
  const currentDate = new Date()
  const m = month || currentDate.getMonth() + 1
  const y = year || currentDate.getFullYear()

  return useApi<MonthlySummary>(`/api/analytics/summary?month=${m}&year=${y}`)
}
