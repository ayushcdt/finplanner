"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getBudget as fetchBudget,
  saveBudget as saveBudgetFn,
  getTransactions,
  Budget,
} from "@/lib/storage"

export function useBudget(month: number, year: number) {
  const [data, setData] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const budget = await fetchBudget(month, year)
      setData(budget)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch budget")
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useBudgetWithSpending(month: number, year: number) {
  const [data, setData] = useState<{
    budget: Budget | null
    spending: Map<string, number>
    totalSpent: number
    totalIncome: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const budget = await fetchBudget(month, year)
      const transactions = await getTransactions({ month, year })

      const spending = new Map<string, number>()
      let totalSpent = 0
      let totalIncome = 0

      transactions.forEach(t => {
        if (t.type === 'EXPENSE') {
          const current = spending.get(t.category_id) || 0
          spending.set(t.category_id, current + t.amount)
          totalSpent += t.amount
        } else if (t.type === 'INCOME') {
          totalIncome += t.amount
        }
      })

      setData({ budget, spending, totalSpent, totalIncome })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch budget")
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export async function saveBudget(data: {
  month: number
  year: number
  totalIncome: number
  allocations: Record<string, number>
}): Promise<{ data: Budget | null; error: string | null }> {
  try {
    const budget = await saveBudgetFn({
      month: data.month,
      year: data.year,
      total_income: data.totalIncome,
      allocations: data.allocations,
    })
    return { data: budget, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to save budget" }
  }
}
