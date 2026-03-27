"use client"

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"

export function QuickStats() {
  const { data, loading, error } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex h-[120px] items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No data</p>
              <p className="text-2xl font-bold">--</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const { totalIncome, totalExpenses, savings, savingsRate, budgetUsed } = data

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Income */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Income
              </p>
              <p className="text-2xl font-bold text-income">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="rounded-full bg-income-light p-3">
              <TrendingUp className="h-5 w-5 text-income" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">This month</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-expense">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="rounded-full bg-expense-light p-3">
              <TrendingDown className="h-5 w-5 text-expense" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">This month</span>
          </div>
        </CardContent>
      </Card>

      {/* Savings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Savings
              </p>
              <p className={`text-2xl font-bold ${savings >= 0 ? "text-savings" : "text-expense"}`}>
                {formatCurrency(Math.abs(savings))}
                {savings < 0 && " deficit"}
              </p>
            </div>
            <div className="rounded-full bg-savings-light p-3">
              <PiggyBank className="h-5 w-5 text-savings" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="font-medium text-savings">
              {savingsRate.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">savings rate</span>
          </div>
        </CardContent>
      </Card>

      {/* Budget Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Budget Used
              </p>
              <p className="text-2xl font-bold">
                {budgetUsed.toFixed(0)}%
              </p>
            </div>
            <div className="rounded-full bg-muted p-3">
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full bg-muted">
              <div
                className={`h-2 rounded-full transition-all ${
                  budgetUsed >= 100
                    ? "bg-expense"
                    : budgetUsed >= 80
                    ? "bg-yellow-500"
                    : "bg-income"
                }`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
