"use client"

import { TrendingUp, TrendingDown, Wallet, Target, Clock, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"

export function QuickStats() {
  const { data, loading, error } = useAnalytics(new Date().getMonth() + 1, new Date().getFullYear())

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-3xl bg-card border border-white/[0.06] p-8">
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return null
  }

  const { totalIncome, totalExpenses, totalPending, amountLeft, weeklyBudget, weeklyBudgetSpent, weeklyBudgetRemaining } = data

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {/* Total Income */}
      <div className="group relative overflow-hidden rounded-3xl bg-card border border-white/[0.06] p-8 transition-all hover:border-emerald-500/30">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl transition-all group-hover:bg-emerald-500/20" />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Income</p>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-4xl font-bold tracking-tight text-emerald-400">
            {formatCurrency(totalIncome)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">This month</p>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="group relative overflow-hidden rounded-3xl bg-card border border-white/[0.06] p-8 transition-all hover:border-rose-500/30">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl transition-all group-hover:bg-rose-500/20" />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Expenses</p>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10">
              <TrendingDown className="h-6 w-6 text-rose-400" />
            </div>
          </div>
          <p className="text-4xl font-bold tracking-tight text-rose-400">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">This month</p>
        </div>
      </div>

      {/* Due/Pending */}
      <div className="group relative overflow-hidden rounded-3xl bg-card border border-white/[0.06] p-8 transition-all hover:border-orange-500/30">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl transition-all group-hover:bg-orange-500/20" />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Due</p>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10">
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
          </div>
          <p className="text-4xl font-bold tracking-tight text-orange-400">
            {formatCurrency(totalPending)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Pending payments</p>
        </div>
      </div>

      {/* Amount Left */}
      <div className="group relative overflow-hidden rounded-3xl bg-card border border-white/[0.06] p-8 transition-all hover:border-amber-500/30">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl transition-all group-hover:bg-amber-500/20" />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Amount Left</p>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
              <Wallet className="h-6 w-6 text-amber-400" />
            </div>
          </div>
          <p className={`text-4xl font-bold tracking-tight ${amountLeft >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            {amountLeft < 0 && '-'}{formatCurrency(Math.abs(amountLeft))}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Account balance
          </p>
        </div>
      </div>

      {/* Weekly Budget */}
      <div className="group relative overflow-hidden rounded-3xl bg-card border border-white/[0.06] p-8 transition-all hover:border-violet-500/30">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl transition-all group-hover:bg-violet-500/20" />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Weekly Budget</p>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
              <Target className="h-6 w-6 text-violet-400" />
            </div>
          </div>
          <p className={`text-4xl font-bold tracking-tight ${weeklyBudgetRemaining >= 0 ? 'text-violet-400' : 'text-rose-400'}`}>
            {formatCurrency(weeklyBudget)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            per week • {formatCurrency(weeklyBudgetSpent)} spent
          </p>
          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className={`h-full rounded-full transition-all ${
                  weeklyBudgetSpent >= weeklyBudget * 4 ? 'bg-rose-500' : weeklyBudgetSpent >= weeklyBudget * 3 ? 'bg-amber-500' : 'bg-violet-500'
                }`}
                style={{ width: `${Math.min((weeklyBudgetSpent / (weeklyBudget * 4)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
