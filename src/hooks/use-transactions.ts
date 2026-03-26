"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getTransactions as fetchTransactions,
  createTransaction as createTx,
  updateTransaction as updateTx,
  deleteTransaction as deleteTx,
  Transaction,
} from "@/lib/storage"

interface UseTransactionsOptions {
  month?: number
  year?: number
  type?: "INCOME" | "EXPENSE"
  limit?: number
}

// Cache for delete/update operations
let transactionCache: Map<string, Transaction> = new Map()

export function cacheTransaction(transaction: Transaction) {
  transactionCache.set(transaction.id, transaction)
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const [data, setData] = useState<Transaction[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const transactions = await fetchTransactions({
        month: options.month,
        year: options.year,
        type: options.type,
        limit: options.limit,
      })
      setData(transactions)
      transactions.forEach(t => cacheTransaction(t))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }, [options.month, options.year, options.type, options.limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export async function createTransaction(data: {
  amount: number
  type: "INCOME" | "EXPENSE"
  categoryId: string
  accountId: string
  description?: string
  date: string
  notes?: string
}): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    const transaction = await createTx({
      amount: data.amount,
      type: data.type,
      category_id: data.categoryId,
      account_id: data.accountId,
      description: data.description,
      date: data.date,
      notes: data.notes,
    })
    cacheTransaction(transaction)
    return { data: transaction, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to create transaction" }
  }
}

export async function updateTransaction(
  id: string,
  data: {
    amount: number
    type: "INCOME" | "EXPENSE"
    categoryId: string
    accountId: string
    description?: string
    date: string
    notes?: string
  }
): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    const oldTransaction = transactionCache.get(id)
    if (!oldTransaction) throw new Error("Transaction not found")
    await updateTx(id, {
      amount: data.amount,
      type: data.type,
      category_id: data.categoryId,
      account_id: data.accountId,
      description: data.description,
      date: data.date,
      notes: data.notes,
    }, oldTransaction)
    const updated = { ...oldTransaction, ...data }
    cacheTransaction(updated)
    return { data: updated, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to update transaction" }
  }
}

export async function deleteTransaction(id: string): Promise<{ error: string | null }> {
  try {
    const transaction = transactionCache.get(id)
    if (!transaction) throw new Error("Transaction not found")
    await deleteTx(id, transaction)
    transactionCache.delete(id)
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete transaction" }
  }
}
