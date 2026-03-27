"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: {
      categoryName: string
      categoryIcon: string
      categoryColor: string
      amount: number
      percentage: number
    }
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-white/[0.08] bg-card/95 p-4 shadow-2xl backdrop-blur-xl">
        <p className="flex items-center gap-2 font-medium">
          <span className="text-lg">{data.categoryIcon}</span>
          {data.categoryName}
        </p>
        <p className="mt-1 text-xl font-bold" style={{ color: data.categoryColor }}>
          {formatCurrency(data.amount)}
        </p>
        <p className="text-sm text-muted-foreground">{data.percentage.toFixed(1)}% of total</p>
      </div>
    )
  }
  return null
}

export function SpendingChart() {
  const { data, loading, error } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[350px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const categorySpending = data?.categorySpending || []
  const totalSpending = categorySpending.reduce((sum, item) => sum + item.amount, 0)

  if (categorySpending.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[350px] flex-col items-center justify-center text-muted-foreground">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <span className="text-3xl">📊</span>
          </div>
          <p className="font-medium">No expenses recorded</p>
          <p className="text-sm">Add transactions to see your spending</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = categorySpending.map(item => ({
    name: item.categoryName,
    value: item.amount,
    ...item,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Spending by Category</span>
          <span className="text-sm font-normal text-muted-foreground">
            {formatCurrency(totalSpending)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.categoryColor}
                    className="transition-all hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {categorySpending.slice(0, 6).map((item) => (
            <div
              key={item.categoryId}
              className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 transition-all hover:bg-white/[0.05]"
            >
              <div
                className="h-3 w-3 rounded-full shadow-lg"
                style={{
                  backgroundColor: item.categoryColor,
                  boxShadow: `0 0 10px ${item.categoryColor}50`
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {item.categoryIcon} {item.categoryName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.percentage.toFixed(0)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
