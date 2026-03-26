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
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-medium">{data.label}</p>
        <p className={`text-lg font-bold ${overBudget ? "text-expense" : "text-income"}`}>
          {formatCurrency(data.spent)}
        </p>
        <p className="text-sm text-muted-foreground">
          Budget: {formatCurrency(data.budget)}
        </p>
        {overBudget && (
          <p className="text-sm text-expense">
            Over by {formatCurrency(data.spent - data.budget)}
          </p>
        )}
      </div>
    )
  }
  return null
}

export function WeeklyPulse() {
  const { data, loading } = useAnalytics()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Spending Pulse</CardTitle>
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

  if (weeklySpending.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Spending Pulse</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[320px] flex-col items-center justify-center text-muted-foreground">
          <p>No spending data this month</p>
          <p className="text-sm">Start adding transactions to track weekly spending</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Spending Pulse</span>
          <span className="text-sm font-normal text-muted-foreground">
            {daysRemaining} days remaining
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklySpending} barSize={40}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              {weeklyBudget > 0 && (
                <ReferenceLine
                  y={weeklyBudget}
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                />
              )}
              <Bar dataKey="spent" radius={[4, 4, 0, 0]}>
                {weeklySpending.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.spent > weeklyBudget ? "#ef4444" : "#22c55e"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-muted p-3">
          <div>
            <p className="text-sm text-muted-foreground">Remaining Budget</p>
            <p className={`text-lg font-bold ${remainingBudget < 0 ? "text-expense" : "text-income"}`}>
              {formatCurrency(Math.abs(remainingBudget))}
              {remainingBudget < 0 && " over"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Daily Allowance</p>
            <p className="text-lg font-bold">
              {formatCurrency(daysRemaining > 0 ? Math.max(0, remainingBudget / daysRemaining) : 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
