"use client"

import { useState, useEffect, useCallback } from "react"
import { getCategories as fetchCategories, createCategory as createCat, Category, CategoryType } from "@/lib/storage"

export function useCategories(type?: "INCOME" | "EXPENSE") {
  const [data, setData] = useState<Category[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const categories = await fetchCategories(type)
      setData(categories)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export async function createCategory(data: {
  name: string
  icon: string
  color: string
  type: "INCOME" | "EXPENSE"
  group?: string
}): Promise<{ data: Category | null; error: string | null }> {
  try {
    const category = await createCat({
      name: data.name,
      icon: data.icon,
      color: data.color,
      type: data.type,
      group_name: data.group,
    })
    return { data: category, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Failed to create category" }
  }
}
