"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"

interface CategoryBudgetListProps {
  filter: "all" | "over" | "under"
}

export function CategoryBudgetList({ filter }: CategoryBudgetListProps) {
  const { data, loading } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const budgetProgress = data?.budgetProgress || []

  const filteredBudgets = budgetProgress.filter((budget) => {
    if (filter === "over") return budget.percentage >= 100
    if (filter === "under") return budget.percentage < 80
    return true
  })

  if (filteredBudgets.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
          {budgetProgress.length === 0
            ? "No budget categories. Create a budget first."
            : "No categories match this filter"}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredBudgets.map((budget) => (
        <CategoryBudgetCard key={budget.categoryId} budget={budget} />
      ))}
    </div>
  )
}

function CategoryBudgetCard({
  budget,
}: {
  budget: {
    categoryId: string
    categoryName: string
    categoryIcon: string
    categoryColor: string
    allocated: number
    spent: number
    remaining: number
    percentage: number
  }
}) {
  const { percentage, remaining } = budget
  const isOverBudget = percentage >= 100
  const isNearLimit = percentage >= 80 && percentage < 100
  const isUnderSpent = percentage < 50

  const getStatusColor = (pct: number) => {
    if (pct >= 100) return "bg-expense"
    if (pct >= 80) return "bg-yellow-500"
    return "bg-income"
  }

  return (
    <Card className="overflow-hidden">
      <div
        className="h-1"
        style={{ backgroundColor: budget.categoryColor }}
      />
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{budget.categoryIcon}</span>
            <span className="font-medium">{budget.categoryName}</span>
          </div>
          {isOverBudget ? (
            <TrendingUp className="h-4 w-4 text-expense" />
          ) : isUnderSpent ? (
            <TrendingDown className="h-4 w-4 text-income" />
          ) : (
            <Minus className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="mb-2 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold">{formatCurrency(budget.spent)}</p>
            <p className="text-xs text-muted-foreground">
              of {formatCurrency(budget.allocated)}
            </p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "font-semibold",
                remaining < 0 ? "text-expense" : "text-income"
              )}
            >
              {remaining < 0 ? "-" : ""}
              {formatCurrency(Math.abs(remaining))}
            </p>
            <p className="text-xs text-muted-foreground">
              {remaining < 0 ? "over" : "left"}
            </p>
          </div>
        </div>

        <Progress
          value={Math.min(percentage, 100)}
          className="h-2"
          indicatorClassName={getStatusColor(percentage)}
        />

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{percentage.toFixed(0)}% used</span>
        </div>
      </CardContent>
    </Card>
  )
}
