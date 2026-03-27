"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { useTransactions } from "@/hooks/use-transactions"

export function RecentTransactions() {
  const currentDate = new Date()
  const { data: transactions, loading } = useTransactions({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    limit: 5,
  })

  if (loading) {
    return (
      <div className="rounded-3xl bg-card border border-white/[0.06] p-8">
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-card border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-8 py-6">
        <div>
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <p className="text-sm text-muted-foreground">Your latest activity</p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="flex items-center gap-2 rounded-xl bg-white/[0.05] px-4 py-2 text-sm font-medium transition-all hover:bg-white/[0.08]"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Transactions */}
      {!transactions || transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-5xl">💳</div>
          <p className="font-medium">No transactions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Start tracking your expenses</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06]">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between px-8 py-5 transition-all hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl">
                  {transaction.category?.icon || "📦"}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.description || transaction.category?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category?.name} • {format(new Date(transaction.date), "MMM d")}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`flex items-center gap-1 text-lg font-semibold ${
                    transaction.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {transaction.type === "INCOME" ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(Number(transaction.amount))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
