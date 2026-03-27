"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, getPercentage } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

function getStatusColor(percentage: number): string {
  if (percentage >= 100) return "from-rose-600 to-red-500"
  if (percentage >= 80) return "from-amber-500 to-yellow-400"
  return "from-emerald-600 to-green-500"
}

function getStatusGlow(percentage: number): string {
  if (percentage >= 100) return "shadow-rose-500/30"
  if (percentage >= 80) return "shadow-amber-500/30"
  return "shadow-emerald-500/30"
}

export function BudgetProgress() {
  const { data, loading } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const budgetProgress = data?.budgetProgress || []
  const totalAllocated = data?.budgetAllocated || 0
  const totalSpent = data?.totalExpenses || 0

  if (budgetProgress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <span className="text-3xl">🎯</span>
          </div>
          <p className="mb-1 font-medium text-muted-foreground">No budget set</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Create a budget to track spending
          </p>
          <Button asChild className="rounded-full">
            <Link href="/dashboard/budget" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Budget
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const overallPercentage = getPercentage(totalSpent, totalAllocated)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Budget Progress</span>
          <div className="flex items-center gap-3 text-sm font-normal">
            <span className="text-muted-foreground">
              {formatCurrency(totalSpent)} / {formatCurrency(totalAllocated)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Progress */}
        <div className="mb-6 rounded-xl bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall</span>
            <span className={cn(
              "text-sm font-semibold",
              overallPercentage >= 100 ? "text-rose-400" :
              overallPercentage >= 80 ? "text-amber-400" : "text-emerald-400"
            )}>
              {overallPercentage}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-all shadow-lg",
                getStatusColor(overallPercentage),
                getStatusGlow(overallPercentage)
              )}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          {budgetProgress.slice(0, 5).map((item) => {
            const remaining = item.allocated - item.spent

            return (
              <div
                key={item.categoryId}
                className="group rounded-xl p-3 transition-all hover:bg-white/[0.03]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.categoryIcon}</span>
                    <span className="font-medium">{item.categoryName}</span>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    remaining < 0 ? "text-rose-400" : "text-muted-foreground"
                  )}>
                    {remaining < 0 ? "-" : ""}
                    {formatCurrency(Math.abs(remaining))} {remaining < 0 ? "over" : "left"}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all",
                      getStatusColor(item.percentage)
                    )}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>

                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(item.spent)} / {formatCurrency(item.allocated)}</span>
                  <span>{item.percentage.toFixed(0)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
