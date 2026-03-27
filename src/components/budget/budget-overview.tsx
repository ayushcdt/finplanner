"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, getPercentage } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { useAnalytics } from "@/hooks/use-analytics"

export function BudgetOverview() {
  const currentDate = new Date()
  const { data, loading } = useAnalytics(currentDate.getMonth() + 1, currentDate.getFullYear())

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const {
    totalIncome,
    totalExpenses,
    budgetAllocated,
    budgetUsed,
    daysRemaining,
    daysInMonth,
    budgetProgress,
  } = data

  const remaining = budgetAllocated - totalExpenses
  const spentPercentage = getPercentage(totalExpenses, budgetAllocated)
  const dailyAllowance = daysRemaining > 0 && remaining > 0 ? Math.floor(remaining / daysRemaining) : 0

  // Expected spending based on days passed
  const daysPassed = daysInMonth - daysRemaining
  const expectedSpent = (budgetAllocated / daysInMonth) * daysPassed
  const isOnTrack = totalExpenses <= expectedSpent

  // Count categories by status
  const overBudget = budgetProgress.filter((b) => b.percentage >= 100).length
  const onTrack = budgetProgress.filter((b) => b.percentage < 80).length
  const nearLimit = budgetProgress.length - overBudget - onTrack

  // Allocation breakdown by group
  const groupedAllocations = budgetProgress.reduce((acc, item) => {
    // Simple grouping based on category patterns
    let group = "Other"
    const name = item.categoryName.toLowerCase()
    if (["rent", "groceries", "utilities", "transport", "insurance", "mobile"].some(k => name.includes(k))) {
      group = "Essential"
    } else if (["dining", "entertainment", "shopping", "subscription", "travel", "hobby"].some(k => name.includes(k))) {
      group = "Lifestyle"
    } else if (["investment", "saving", "debt", "tax"].some(k => name.includes(k))) {
      group = "Financial"
    } else if (["health", "education", "personal", "fitness", "gift"].some(k => name.includes(k))) {
      group = "Personal"
    }

    if (!acc[group]) acc[group] = { name: group, value: 0 }
    acc[group].value += item.allocated
    return acc
  }, {} as Record<string, { name: string; value: number }>)

  const allocationBreakdown = Object.values(groupedAllocations)
  const groupColors: Record<string, string> = {
    Essential: "#6366f1",
    Lifestyle: "#ec4899",
    Financial: "#22c55e",
    Personal: "#f59e0b",
    Other: "#94a3b8",
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Budget Card */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Budget Overview</span>
            <span className="flex items-center gap-2 text-sm font-normal">
              {isOnTrack ? (
                <>
                  <CheckCircle className="h-4 w-4 text-income" />
                  <span className="text-income">On Track</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-500">Slightly Over Pace</span>
                </>
              )}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Progress */}
          <div>
            <div className="mb-2 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {formatCurrency(totalExpenses)}
                </p>
                <p className="text-sm text-muted-foreground">
                  of {formatCurrency(budgetAllocated)} budget
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${remaining >= 0 ? "text-income" : "text-expense"}`}>
                  {formatCurrency(Math.abs(remaining))}
                </p>
                <p className="text-sm text-muted-foreground">
                  {remaining >= 0 ? "remaining" : "over budget"}
                </p>
              </div>
            </div>
            <Progress
              value={Math.min(spentPercentage, 100)}
              className="h-4"
              indicatorClassName={cn(
                spentPercentage >= 100
                  ? "bg-expense"
                  : spentPercentage >= 80
                  ? "bg-yellow-500"
                  : "bg-primary"
              )}
            />
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>{spentPercentage.toFixed(0)}% spent</span>
              <span>{Math.max(0, 100 - spentPercentage).toFixed(0)}% remaining</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold">{daysRemaining}</p>
              <p className="text-sm text-muted-foreground">Days Left</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold text-income">
                {formatCurrency(dailyAllowance)}
              </p>
              <p className="text-sm text-muted-foreground">Daily Allowance</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold">
                {onTrack}/{budgetProgress.length}
              </p>
              <p className="text-sm text-muted-foreground">On Track</p>
            </div>
          </div>

          {/* Category Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-expense" />
              <span className="text-sm text-muted-foreground">
                {overBudget} over budget
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {nearLimit} near limit
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-income" />
              <span className="text-sm text-muted-foreground">
                {onTrack} on track
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allocation Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {allocationBreakdown.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No allocations yet
            </div>
          ) : (
            <>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {allocationBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={groupColors[entry.name] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {allocationBreakdown.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: groupColors[item.name] || "#94a3b8" }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
