"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"
import { Loader2 } from "lucide-react"

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      label: string
      spent: number
      budget: number
    }
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const overBudget = data.spent > data.budget
    return (
      <div className="rounded-xl border border-white/[0.08] bg-card/95 p-4 shadow-2xl backdrop-blur-xl">
        <p className="font-medium">{data.label}</p>
        <p className={`text-xl font-bold ${overBudget ? "text-rose-400" : "text-emerald-400"}`}>
          {formatCurrency(data.spent)}
        </p>
        <p className="text-sm text-muted-foreground">
          Budget: {formatCurrency(data.budget)}
        </p>
        {overBudget && (
          <p className="mt-1 text-sm text-rose-400">
            Over by {formatCurrency(data.spent - data.budget)}
          </p>
        )}
      </div>
    )
  }
  return null
}

export function WeeklyPulse() {
  const { data, loading } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Spending</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[320px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const weeklySpending = data?.weeklySpending || []
  const totalSpent = weeklySpending.reduce((sum, week) => sum + week.spent, 0)
  const budgetAllocated = data?.budgetAllocated || 0
  const weeklyBudget = budgetAllocated / 4
  const remainingBudget = budgetAllocated - totalSpent
  const daysRemaining = data?.daysRemaining || 0

  if (weeklySpending.length === 0 || totalSpent === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Spending</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[320px] flex-col items-center justify-center text-muted-foreground">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <span className="text-3xl">📈</span>
          </div>
          <p className="font-medium">No spending data</p>
          <p className="text-sm">Add transactions to track weekly spending</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Spending</span>
          <span className="rounded-full bg-white/[0.05] px-3 py-1 text-sm font-normal text-muted-foreground">
            {daysRemaining} days left
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklySpending} barSize={36}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              {weeklyBudget > 0 && (
                <ReferenceLine
                  y={weeklyBudget}
                  stroke="rgba(148, 163, 184, 0.5)"
                  strokeDasharray="5 5"
                />
              )}
              <Bar dataKey="spent" radius={[8, 8, 0, 0]}>
                {weeklySpending.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.spent > weeklyBudget ? "url(#redGradient)" : "url(#greenGradient)"}
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/[0.03] p-4">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className={`text-xl font-bold ${remainingBudget < 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {remainingBudget < 0 && "-"}
              {formatCurrency(Math.abs(remainingBudget))}
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-4">
            <p className="text-sm text-muted-foreground">Daily Budget</p>
            <p className="text-xl font-bold">
              {formatCurrency(daysRemaining > 0 ? Math.max(0, remainingBudget / daysRemaining) : 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
