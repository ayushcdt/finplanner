"use client"

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"

export function QuickStats() {
  const { data, loading, error } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="flex h-[140px] items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No data</p>
              <p className="text-2xl font-bold">--</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const { totalIncome, totalExpenses, savings, savingsRate, budgetUsed } = data

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      gradient: "from-emerald-600 to-green-500",
      shadowColor: "shadow-emerald-500/20",
      bgGlow: "bg-emerald-500/10",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      gradient: "from-rose-600 to-red-500",
      shadowColor: "shadow-rose-500/20",
      bgGlow: "bg-rose-500/10",
    },
    {
      title: "Savings",
      value: formatCurrency(Math.abs(savings)),
      subtitle: savings < 0 ? "deficit" : `${savingsRate.toFixed(1)}% rate`,
      icon: PiggyBank,
      gradient: savings >= 0 ? "from-blue-600 to-cyan-500" : "from-rose-600 to-red-500",
      shadowColor: savings >= 0 ? "shadow-blue-500/20" : "shadow-rose-500/20",
      bgGlow: savings >= 0 ? "bg-blue-500/10" : "bg-rose-500/10",
    },
    {
      title: "Budget Used",
      value: `${budgetUsed.toFixed(0)}%`,
      icon: Wallet,
      gradient: budgetUsed >= 100 ? "from-rose-600 to-red-500" : budgetUsed >= 80 ? "from-amber-500 to-yellow-400" : "from-violet-600 to-indigo-500",
      shadowColor: budgetUsed >= 100 ? "shadow-rose-500/20" : budgetUsed >= 80 ? "shadow-amber-500/20" : "shadow-violet-500/20",
      bgGlow: budgetUsed >= 100 ? "bg-rose-500/10" : budgetUsed >= 80 ? "bg-amber-500/10" : "bg-violet-500/10",
      showProgress: true,
      progress: budgetUsed,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="group overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                )}
              </div>
              <div className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-3 shadow-lg ${stat.shadowColor}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            {stat.showProgress && (
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all`}
                    style={{ width: `${Math.min(stat.progress || 0, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
