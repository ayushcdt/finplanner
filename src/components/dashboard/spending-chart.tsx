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
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="flex items-center gap-2 font-medium">
          <span>{data.categoryIcon}</span>
          {data.categoryName}
        </p>
        <p className="text-lg font-bold" style={{ color: data.categoryColor }}>
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
          <p>No expenses recorded this month</p>
          <p className="text-sm">Add transactions to see your spending breakdown</p>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for chart (map to expected format)
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
            Total: {formatCurrency(totalSpending)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.categoryColor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categorySpending.slice(0, 6).map((item) => (
            <div key={item.categoryId} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.categoryColor }}
              />
              <span className="truncate text-muted-foreground">
                {item.categoryIcon} {item.categoryName}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
