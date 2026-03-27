"use client"

import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"
import { Loader2 } from "lucide-react"

export function WeeklyPulse() {
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

  const weeklySpending = data?.weeklySpending || []
  const budgetAllocated = data?.budgetAllocated || 0
  const weeklyBudget = budgetAllocated / 4
  const totalSpent = weeklySpending.reduce((sum, week) => sum + week.spent, 0)
  const remainingBudget = budgetAllocated - totalSpent
  const daysRemaining = data?.daysRemaining || 0

  if (weeklySpending.length === 0 || totalSpent === 0) {
    return (
      <div className="rounded-3xl bg-card border border-white/[0.06] p-8">
        <h2 className="text-lg font-semibold text-muted-foreground">Weekly Spending</h2>
        <div className="flex h-[250px] flex-col items-center justify-center text-center">
          <div className="mb-4 text-5xl">📈</div>
          <p className="font-medium">No data yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add transactions to track weekly spending</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-card border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-8 py-6">
        <div>
          <h2 className="text-lg font-semibold">Weekly Spending</h2>
          <p className="text-sm text-muted-foreground">{daysRemaining} days remaining</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(remainingBudget)}</p>
          <p className="text-xs text-muted-foreground">Budget left</p>
        </div>
      </div>

      <div className="p-8">
        {/* Chart */}
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklySpending} barSize={40}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Bar dataKey="spent" radius={[8, 8, 0, 0]}>
                {weeklySpending.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.spent > weeklyBudget ? "#f43f5e" : "#22c55e"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/[0.03] p-5">
            <p className="text-sm text-muted-foreground">Daily Budget</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(daysRemaining > 0 ? Math.max(0, remainingBudget / daysRemaining) : 0)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] p-5">
            <p className="text-sm text-muted-foreground">Weekly Avg</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(totalSpent / Math.max(weeklySpending.filter(w => w.spent > 0).length, 1))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
