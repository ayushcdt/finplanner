"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { useTransactions } from "@/hooks/use-transactions"

export function RecentTransactions() {
  const currentDate = new Date()
  const { data: transactions, loading } = useTransactions({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    limit: 7,
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/transactions" className="gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <p className="mb-2 text-muted-foreground">No transactions yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first transaction to start tracking
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/transactions" className="gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              {/* Left: Icon + Details */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
                  {transaction.category?.icon || "📦"}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.description || transaction.category?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category?.name || "Unknown"} • {transaction.account?.name || "Unknown"}
                  </p>
                </div>
              </div>

              {/* Right: Amount + Date */}
              <div className="text-right">
                <p
                  className={`flex items-center justify-end gap-1 font-semibold ${
                    transaction.type === "INCOME"
                      ? "text-income"
                      : "text-expense"
                  }`}
                >
                  {transaction.type === "INCOME" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(Number(transaction.amount))}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
