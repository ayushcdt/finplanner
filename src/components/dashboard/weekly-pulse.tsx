"use client"

import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"
import { Loader2 } from "lucide-react"

// Custom tooltip for weekly spending
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const spent = payload[0].value
    const budget = payload[0].payload.budget
    const isOver = spent > budget
    return (
      <div className="rounded-xl bg-black/90 border border-white/10 px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className={`text-lg font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
          {formatCurrency(spent)}
        </p>
        <p className="text-xs text-muted-foreground">
          Budget: {formatCurrency(budget)}
        </p>
      </div>
    )
  }
  return null
}

export function WeeklyPulse() {
  const { data, loading } = useAnalytics()

  if (loading) {
    return (
      <div className="rounded-3xl bg-card border border-white/[0.06] p-8">
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  // Use weeklyBudgetByWeek for budget category spending only
  const weeklyBudgetSpending = data?.weeklyBudgetByWeek || []
  const weeklyBudget = data?.weeklyBudget || 5000
  const weeklyBudgetSpent = data?.weeklyBudgetSpent || 0
  const weeklyBudgetRemaining = data?.weeklyBudgetRemaining || 0
  const daysRemaining = data?.daysRemaining || 0

  // Calculate current week spending
  const currentWeekSpent = weeklyBudgetSpending[0]?.spent || 0

  if (weeklyBudgetSpending.length === 0) {
    return (
      <div className="rounded-3xl bg-card border border-white/[0.06] p-8">
        <h2 className="text-lg font-semibold text-muted-foreground">Weekly Budget</h2>
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
          <h2 className="text-lg font-semibold">Weekly Budget</h2>
          <p className="text-sm text-muted-foreground">{daysRemaining} days remaining in cycle</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${weeklyBudgetRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(Math.abs(weeklyBudgetRemaining))}
          </p>
          <p className="text-xs text-muted-foreground">
            {weeklyBudgetRemaining >= 0 ? 'left this month' : 'over budget'}
          </p>
        </div>
      </div>

      <div className="p-8">
        {/* Chart with tooltip */}
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyBudgetSpending} barSize={40}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="spent" radius={[8, 8, 0, 0]}>
                {weeklyBudgetSpending.map((entry, index) => (
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
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className={`mt-1 text-2xl font-bold ${currentWeekSpent > weeklyBudget ? 'text-rose-400' : 'text-white'}`}>
              {formatCurrency(currentWeekSpent)}
            </p>
            <p className="text-xs text-muted-foreground">of {formatCurrency(weeklyBudget)}/week</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] p-5">
            <p className="text-sm text-muted-foreground">Month Total</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(weeklyBudgetSpent)}
            </p>
            <p className="text-xs text-muted-foreground">of {formatCurrency(weeklyBudget * 4)}/month</p>
          </div>
        </div>
      </div>
    </div>
  )
}
