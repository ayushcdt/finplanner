"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/use-categories"
import { useAccounts } from "@/hooks/use-accounts"
import { createTransaction, updateTransaction } from "@/hooks/use-transactions"
import { useToast } from "@/hooks/use-toast"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: any
  onSuccess?: () => void
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: TransactionDialogProps) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE")
  const [amount, setAmount] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [accountId, setAccountId] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: categories, loading: categoriesLoading } = useCategories(type)
  const { data: accounts, loading: accountsLoading } = useAccounts()
  const { toast } = useToast()

  const isEditing = !!transaction

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setAmount(String(transaction.amount))
      setCategoryId(transaction.category_id || transaction.categoryId)
      setAccountId(transaction.account_id || transaction.accountId)
      setDescription(transaction.description || "")
      setDate(format(new Date(transaction.date), "yyyy-MM-dd"))
      setNotes(transaction.notes || "")
    } else {
      // Reset form
      setType("EXPENSE")
      setAmount("")
      setCategoryId("")
      setAccountId("")
      setDescription("")
      setDate(format(new Date(), "yyyy-MM-dd"))
      setNotes("")
    }
  }, [transaction, open])

  // Reset category when type changes
  useEffect(() => {
    if (!transaction) {
      setCategoryId("")
    }
  }, [type, transaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !categoryId || !accountId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const data = {
      amount: parseFloat(amount),
      type,
      categoryId,
      accountId,
      description: description || undefined,
      date,
      notes: notes || undefined,
    }

    const { error } = isEditing
      ? await updateTransaction(transaction.id, data)
      : await createTransaction(data)

    setIsSubmitting(false)

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    } else {
      toast({
        title: isEditing ? "Transaction updated" : "Transaction added",
        description: isEditing
          ? "Your transaction has been updated"
          : "Your transaction has been recorded",
      })
      onOpenChange(false)
      onSuccess?.()
    }
  }

  const isLoading = categoriesLoading || accountsLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <Tabs value={type} onValueChange={(v) => setType(v as "INCOME" | "EXPENSE")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="EXPENSE"
                  className="data-[state=active]:bg-expense data-[state=active]:text-white"
                >
                  Expense
                </TabsTrigger>
                <TabsTrigger
                  value="INCOME"
                  className="data-[state=active]:bg-income data-[state=active]:text-white"
                >
                  Income
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-2xl font-bold"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Category and Account Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">Account *</Label>
                <Select value={accountId} onValueChange={setAccountId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                    {(!accounts || accounts.length === 0) && (
                      <SelectItem value="none" disabled>
                        No accounts - add one first
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !accounts || accounts.length === 0}
                className={cn(
                  type === "INCOME"
                    ? "bg-income hover:bg-income/90"
                    : "bg-expense hover:bg-expense/90"
                )}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
