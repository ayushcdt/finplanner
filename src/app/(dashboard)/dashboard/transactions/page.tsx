"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/layout/header"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddNew = () => {
    setEditingTransaction(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className="flex flex-col">
      <Header
        title="Transactions"
        subtitle="Track and manage your income and expenses"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Filters and Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TransactionFilters />
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        {/* Transaction List */}
        <TransactionList key={refreshKey} onEdit={handleEdit} />

        {/* Add/Edit Transaction Dialog */}
        <TransactionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          transaction={editingTransaction}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}
