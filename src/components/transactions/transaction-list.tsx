"use client"

import { useState, useEffect } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { useTransactions, deleteTransaction, cacheTransaction } from "@/hooks/use-transactions"
import { useToast } from "@/hooks/use-toast"

interface TransactionListProps {
  onEdit?: (transaction: any) => void
}

export function TransactionList({ onEdit }: TransactionListProps) {
  const currentDate = new Date()
  const { data: transactions, loading, error, refetch } = useTransactions({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  })
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Cache transactions for delete/update operations
  useEffect(() => {
    if (transactions) {
      transactions.forEach(t => cacheTransaction(t))
    }
  }, [transactions])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await deleteTransaction(id)

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed",
      })
      refetch()
    }
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          Failed to load transactions. Please try again.
        </CardContent>
      </Card>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
          <p className="mb-2">No transactions this month</p>
          <p className="text-sm">Click "Add Transaction" to get started</p>
        </CardContent>
      </Card>
    )
  }

  // Helper to check if transaction is pending
  const isPending = (t: any) => t.notes?.toUpperCase().includes('PENDING') || t.notes?.toUpperCase().includes('DUE')

  // Calculate summary (only paid transactions)
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME" && !isPending(t))
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE" && !isPending(t))
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const totalPending = transactions
    .filter((t) => isPending(t))
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Group by date
  const grouped = groupByDate(transactions)

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-xl font-bold text-income">
              +{formatCurrency(totalIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-xl font-bold text-expense">
              -{formatCurrency(totalExpense)}
            </p>
          </div>
          {totalPending > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Pending/Due</p>
              <p className="text-xl font-bold text-amber-400">
                {formatCurrency(totalPending)}
              </p>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Net</p>
          <p
            className={`text-xl font-bold ${
              totalIncome - totalExpense >= 0 ? "text-income" : "text-expense"
            }`}
          >
            {totalIncome - totalExpense >= 0 ? "+" : ""}
            {formatCurrency(totalIncome - totalExpense)}
          </p>
        </div>
      </div>

      {/* Transaction Groups */}
      {grouped.map((group) => (
        <div key={format(group.date, "yyyy-MM-dd")} className="space-y-2">
          {/* Date Header */}
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {format(group.date, "EEEE, MMMM d, yyyy")}
            </h3>
            <span
              className={`text-sm font-medium ${
                group.total >= 0 ? "text-income" : "text-expense"
              }`}
            >
              {group.total >= 0 ? "+" : ""}
              {formatCurrency(group.total)}
            </span>
          </div>

          {/* Transactions for this date */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {group.transactions.map((transaction) => {
                  const txPending = isPending(transaction)
                  return (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/50 ${txPending ? 'bg-amber-500/5' : ''}`}
                  >
                    {/* Left: Icon + Details */}
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${txPending ? 'bg-amber-500/20 ring-1 ring-amber-500/30' : 'bg-muted'}`}>
                        {transaction.category.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {transaction.description || transaction.category.name}
                          </p>
                          {txPending && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                              DUE
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category.name} • {transaction.account.name}
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount + Actions */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`flex items-center justify-end gap-1 font-semibold ${
                            txPending ? "text-amber-400" :
                            transaction.type === "INCOME" ? "text-income" : "text-expense"
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
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            {deletingId === transaction.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit?.(transaction)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

// Helper to group transactions by date
function groupByDate(transactions: any[]) {
  const groups: Record<string, any[]> = {}

  transactions.forEach((transaction) => {
    const dateKey = format(new Date(transaction.date), "yyyy-MM-dd")
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(transaction)
  })

  // Helper to check pending status
  const checkPending = (t: any) => t.notes?.toUpperCase().includes('PENDING') || t.notes?.toUpperCase().includes('DUE')

  return Object.entries(groups)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([date, items]) => ({
      date: new Date(date),
      transactions: items,
      // Only count paid transactions in total
      total: items
        .filter(t => !checkPending(t))
        .reduce(
          (sum, t) => sum + (t.type === "INCOME" ? Number(t.amount) : -Number(t.amount)),
          0
        ),
    }))
}
