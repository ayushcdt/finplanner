"use client"

import { formatCurrency, getPercentage } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"
import { Loader2, Plus } from "lucide-react"
import Link from "next/link"

export function BudgetProgress() {
  const { data, loading } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

  if (loading) {
    return (
      <div className="rounded-3xl bg-card border border-white/[0.06] p-8">
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const budgetProgress = data?.budgetProgress || []
  const totalAllocated = data?.budgetAllocated || 0
  const totalSpent = data?.totalExpenses || 0

  if (budgetProgress.length === 0) {
    return (
      <div className="rounded-3xl bg-card border border-white/[0.06] p-8">
        <h2 className="text-lg font-semibold text-muted-foreground">Budget Progress</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-5xl">🎯</div>
          <p className="font-medium">No budget yet</p>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">Create a budget to track spending</p>
          <Link
            href="/dashboard/budget"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-semibold text-black shadow-lg shadow-amber-500/30 transition-all hover:shadow-amber-500/40"
          >
            <Plus className="h-5 w-5" />
            Create Budget
          </Link>
        </div>
      </div>
    )
  }

  const overallPercentage = getPercentage(totalSpent, totalAllocated)

  return (
    <div className="rounded-3xl bg-card border border-white/[0.06] overflow-hidden">
      {/* Header with overall progress */}
      <div className="border-b border-white/[0.06] px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Budget Progress</h2>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(totalSpent)} of {formatCurrency(totalAllocated)}
            </p>
          </div>
          <div className={cn(
            "text-3xl font-bold",
            overallPercentage >= 100 ? "text-rose-400" :
            overallPercentage >= 80 ? "text-amber-400" : "text-emerald-400"
          )}>
            {overallPercentage}%
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              overallPercentage >= 100 ? "bg-rose-500" :
              overallPercentage >= 80 ? "bg-amber-500" : "bg-emerald-500"
            )}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="divide-y divide-white/[0.06]">
        {budgetProgress.slice(0, 5).map((item) => {
          const remaining = item.allocated - item.spent
          const isOver = remaining < 0

          return (
            <div key={item.categoryId} className="px-8 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.categoryIcon}</span>
                  <div>
                    <p className="font-medium">{item.categoryName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.spent)} / {formatCurrency(item.allocated)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-semibold",
                    isOver ? "text-rose-400" : "text-muted-foreground"
                  )}>
                    {isOver ? "-" : ""}{formatCurrency(Math.abs(remaining))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isOver ? "over" : "left"}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    item.percentage >= 100 ? "bg-rose-500" :
                    item.percentage >= 80 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
