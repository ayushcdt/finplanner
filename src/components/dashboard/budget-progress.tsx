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
  if (percentage >= 100) return "bg-expense"
  if (percentage >= 80) return "bg-yellow-500"
  return "bg-income"
}

function getStatusText(percentage: number): string {
  if (percentage >= 100) return "Over budget"
  if (percentage >= 80) return "Almost there"
  return "On track"
}

export function BudgetProgress() {
  const { data, loading } = useAnalytics()

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
          <p className="mb-2 text-muted-foreground">No budget set for this month</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Create a budget to track your spending against allocations
          </p>
          <Button asChild>
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
          <div className="flex items-center gap-4 text-sm font-normal">
            <span className="text-muted-foreground">
              Spent: <span className="font-medium text-foreground">{formatCurrency(totalSpent)}</span>
            </span>
            <span className="text-muted-foreground">
              of <span className="font-medium text-foreground">{formatCurrency(totalAllocated)}</span>
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Budget</span>
            <span className={cn(
              "font-medium",
              overallPercentage >= 100 ? "text-expense" :
              overallPercentage >= 80 ? "text-yellow-500" : "text-income"
            )}>
              {overallPercentage}%
            </span>
          </div>
          <Progress
            value={Math.min(overallPercentage, 100)}
            className="h-3"
            indicatorClassName={getStatusColor(overallPercentage)}
          />
        </div>

        {/* Category Breakdown */}
        <div className="grid gap-4 sm:grid-cols-2">
          {budgetProgress.slice(0, 8).map((item) => {
            const remaining = item.allocated - item.spent

            return (
              <div
                key={item.categoryId}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.categoryIcon}</span>
                    <span className="font-medium">{item.categoryName}</span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      item.percentage >= 100
                        ? "bg-expense/10 text-expense"
                        : item.percentage >= 80
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-income/10 text-income"
                    )}
                  >
                    {getStatusText(item.percentage)}
                  </span>
                </div>

                <Progress
                  value={Math.min(item.percentage, 100)}
                  className="mb-2 h-2"
                  indicatorClassName={getStatusColor(item.percentage)}
                />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatCurrency(item.spent)} / {formatCurrency(item.allocated)}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      remaining < 0 ? "text-expense" : "text-muted-foreground"
                    )}
                  >
                    {remaining < 0 ? "-" : ""}
                    {formatCurrency(Math.abs(remaining))}
                    {remaining < 0 ? " over" : " left"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
