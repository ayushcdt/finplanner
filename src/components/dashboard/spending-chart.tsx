"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"
import { Loader2 } from "lucide-react"

// Custom tooltip for pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl bg-black/90 border border-white/10 px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-lg">{data.categoryIcon}</span>
          <span className="font-medium text-white">{data.categoryName}</span>
        </div>
        <p className="text-xl font-bold text-white mt-1">{formatCurrency(data.amount)}</p>
        <p className="text-xs text-muted-foreground">{data.percentage.toFixed(1)}% of total</p>
      </div>
    )
  }
  return null
}

export function SpendingChart() {
  const { data, loading } = useAnalytics()

  if (loading) {
    return (
      <div className="rounded-3xl bg-card border border-white/[0.06] p-8">
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const categorySpending = data?.categorySpending || []
  const totalSpending = categorySpending.reduce((sum, item) => sum + item.amount, 0)

  if (categorySpending.length === 0) {
    return (
      <div className="rounded-3xl bg-card border border-white/[0.06] p-8">
        <h2 className="text-lg font-semibold text-muted-foreground">Spending Breakdown</h2>
        <div className="flex h-[350px] flex-col items-center justify-center text-center">
          <div className="mb-4 text-5xl">📊</div>
          <p className="font-medium">No expenses yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add transactions to see breakdown</p>
        </div>
      </div>
    )
  }

  // Use all categories for pie chart
  const chartData = categorySpending.map(item => ({
    name: item.categoryName,
    value: item.amount,
    ...item,
  }))

  // Calculate daily forecast
  const daysRemaining = data?.daysRemaining || 1
  const amountLeft = data?.amountLeft || 0
  const dailyBudget = amountLeft / daysRemaining

  return (
    <div className="rounded-3xl bg-card border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-8 py-6">
        <h2 className="text-lg font-semibold">Spending Breakdown</h2>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </div>

      <div className="p-8">
        {/* Chart with tooltip */}
        <div className="relative mx-auto h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.categoryColor}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold">{formatCurrency(totalSpending)}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
        </div>

        {/* Forecast */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily Budget</p>
              <p className="text-2xl font-bold text-amber-400">{formatCurrency(Math.max(0, dailyBudget))}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{daysRemaining} days left</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(amountLeft)} remaining</p>
            </div>
          </div>
        </div>

        {/* Legend - All categories with scroll */}
        <div className="mt-6 max-h-[300px] overflow-y-auto space-y-2 pr-2">
          {categorySpending.map((item) => (
            <div
              key={item.categoryId}
              className="flex items-center justify-between rounded-2xl bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.categoryColor }}
                />
                <span className="text-lg">{item.categoryIcon}</span>
                <span className="font-medium">{item.categoryName}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
