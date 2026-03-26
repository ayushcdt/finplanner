"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getAccounts as fetchAccounts,
  createAccount as createAcc,
  updateAccount as updateAcc,
  deleteAccount as deleteAcc,
  Account,
  AccountType,
} from "@/lib/storage"

export function useAccounts() {
  const [data, setData] = useState<Account[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const accounts = await fetchAccounts()
      setData(accounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accounts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export async function createAccount(data: {
  name: string
  type: string
  balance?: number
  currency?: string
  color?: string
  icon?: string
}): Promise<{ data: Account | null; error: string | null }> {
  try {
    const account = await createAcc({
      name: data.name,
      type: data.type as AccountType,
      balance: data.balance,
      currency: data.currency,
      color: data.color,
      icon: data.icon,
    })
    return { data: account, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to create account" }
  }
}

export async function updateAccount(
  id: string,
  data: Partial<Account>
): Promise<{ data: Account | null; error: string | null }> {
  try {
    await updateAcc(id, data)
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to update account" }
  }
}

export async function deleteAccount(id: string): Promise<{ error: string | null }> {
  try {
    await deleteAcc(id)
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete account" }
  }
}
