"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, CreditCard, Wallet, Building, Banknote, Loader2, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAccounts, createAccount, deleteAccount } from "@/hooks/use-accounts"
import { useToast } from "@/hooks/use-toast"

const accountTypes = [
  { value: "SAVINGS", label: "Savings Account", icon: Building },
  { value: "CURRENT", label: "Current Account", icon: Building },
  { value: "CREDIT_CARD", label: "Credit Card", icon: CreditCard },
  { value: "WALLET", label: "Digital Wallet", icon: Wallet },
  { value: "CASH", label: "Cash", icon: Banknote },
]

const accountColors = [
  "#3b82f6", "#22c55e", "#ef4444", "#f97316", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f59e0b", "#6366f1",
]

export default function AccountsPage() {
  const { data: accounts, loading, refetch } = useAccounts()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [balance, setBalance] = useState("")
  const [color, setColor] = useState(accountColors[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !type) {
      toast({
        title: "Missing fields",
        description: "Please fill in name and account type",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const { error } = await createAccount({
      name,
      type,
      balance: parseFloat(balance) || 0,
      color,
    })
    setIsSubmitting(false)

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
    } else {
      toast({ title: "Account created", description: "Your account has been added" })
      setIsDialogOpen(false)
      setName("")
      setType("")
      setBalance("")
      refetch()
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await deleteAccount(id)
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
    } else {
      toast({ title: "Account deleted" })
      refetch()
    }
  }

  const totalAssets = (accounts || [])
    .filter((a) => Number(a.balance) > 0)
    .reduce((sum, a) => sum + Number(a.balance), 0)
  const totalLiabilities = Math.abs(
    (accounts || [])
      .filter((a) => Number(a.balance) < 0)
      .reduce((sum, a) => sum + Number(a.balance), 0)
  )
  const netWorth = totalAssets - totalLiabilities

  return (
    <div className="flex flex-col">
      <Header title="Accounts" subtitle="Manage your bank accounts and wallets" />

      <div className="flex-1 space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-2xl font-bold text-income">
                {formatCurrency(totalAssets)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Liabilities</p>
              <p className="text-2xl font-bold text-expense">
                {formatCurrency(totalLiabilities)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Net Worth</p>
              <p className={`text-2xl font-bold ${netWorth >= 0 ? "" : "text-expense"}`}>
                {formatCurrency(netWorth)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Accounts List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Accounts</CardTitle>
            <Button size="sm" className="gap-2" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !accounts || accounts.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                <p className="mb-2">No accounts yet</p>
                <p className="text-sm">Add your first account to start tracking</p>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => {
                  const typeInfo = accountTypes.find((t) => t.value === account.type)
                  const Icon = typeInfo?.icon || Building
                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${account.color || "#3b82f6"}20` }}
                        >
                          <Icon
                            className="h-6 w-6"
                            style={{ color: account.color || "#3b82f6" }}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {typeInfo?.label || account.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p
                          className={`text-xl font-bold ${
                            Number(account.balance) < 0 ? "text-expense" : ""
                          }`}
                        >
                          {formatCurrency(Number(account.balance))}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(account.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Account Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., HDFC Savings"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Account Type *</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use negative value for credit card outstanding
                </p>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {accountColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`h-8 w-8 rounded-full border-2 ${
                        color === c ? "border-foreground" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Account
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
