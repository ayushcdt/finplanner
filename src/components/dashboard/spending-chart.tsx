"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"
import { Loader2 } from "lucide-react"

export function SpendingChart() {
  const { data, loading } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

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

  const chartData = categorySpending.slice(0, 6).map(item => ({
    name: item.categoryName,
    value: item.amount,
    ...item,
  }))

  return (
    <div className="rounded-3xl bg-card border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-8 py-6">
        <h2 className="text-lg font-semibold">Spending Breakdown</h2>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </div>

      <div className="p-8">
        {/* Chart */}
        <div className="relative mx-auto h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.categoryColor}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold">{formatCurrency(totalSpending)}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 space-y-3">
          {categorySpending.slice(0, 5).map((item) => (
            <div
              key={item.categoryId}
              className="flex items-center justify-between rounded-2xl bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.categoryColor }}
                />
                <span className="text-lg">{item.categoryIcon}</span>
                <span className="font-medium">{item.categoryName}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-muted-foreground">{item.percentage.toFixed(0)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
