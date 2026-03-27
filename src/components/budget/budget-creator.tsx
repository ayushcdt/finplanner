"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, getPercentage } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, Loader2 } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { saveBudget } from "@/hooks/use-budget"
import { useToast } from "@/hooks/use-toast"

interface BudgetCreatorProps {
  onCancel: () => void
  existingBudget?: any
  onSuccess?: () => void
}

export function BudgetCreator({ onCancel, existingBudget, onSuccess }: BudgetCreatorProps) {
  const currentDate = new Date()
  const [totalIncome, setTotalIncome] = useState(existingBudget?.totalIncome || 0)
  const [allocations, setAllocations] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: categories, loading } = useCategories("EXPENSE")
  const { toast } = useToast()

  // Initialize allocations from existing budget or categories
  useEffect(() => {
    if (existingBudget?.items) {
      const existing: Record<string, number> = {}
      existingBudget.items.forEach((item: any) => {
        existing[item.category_id] = Number(item.allocated)
      })
      setAllocations(existing)
    } else if (categories) {
      // Initialize with zeros
      const initial: Record<string, number> = {}
      categories.forEach((cat) => {
        initial[cat.id] = 0
      })
      setAllocations(initial)
    }
  }, [categories, existingBudget])

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + (val || 0), 0)
  const remaining = totalIncome - totalAllocated
  const allocationPercent = getPercentage(totalAllocated, totalIncome)
  const isBalanced = remaining === 0
  const isOverAllocated = remaining < 0

  const handleAllocationChange = (categoryId: string, value: string) => {
    const amount = parseInt(value) || 0
    setAllocations((prev) => ({
      ...prev,
      [categoryId]: amount,
    }))
  }

  const handleAutoBalance = () => {
    if (remaining <= 0 || !categories) return
    // Find or create savings category allocation
    const savingsCategory = categories.find((c) => c.name.toLowerCase().includes("saving"))
    if (savingsCategory) {
      setAllocations((prev) => ({
        ...prev,
        [savingsCategory.id]: (prev[savingsCategory.id] || 0) + remaining,
      }))
    }
  }

  const handleSave = async () => {
    if (totalIncome <= 0) {
      toast({
        title: "Invalid income",
        description: "Please enter your monthly income",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const { error } = await saveBudget({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      totalIncome,
      allocations,
    })
    setIsSubmitting(false)

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
    } else {
      toast({ title: "Budget saved", description: "Your budget has been created" })
      onSuccess?.()
      onCancel()
    }
  }

  // Group categories by group
  const groupedCategories = (categories || []).reduce((acc, cat) => {
    const group = cat.group_name || "Other"
    if (!acc[group]) acc[group] = []
    acc[group].push(cat)
    return acc
  }, {} as Record<string, typeof categories>)

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Income Card */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="income">Total Monthly Income</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="income"
                  type="number"
                  value={totalIncome || ""}
                  onChange={(e) => setTotalIncome(parseInt(e.target.value) || 0)}
                  className="pl-8 text-xl font-bold"
                  placeholder="Enter your income"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Unallocated</p>
              <p
                className={cn(
                  "text-2xl font-bold",
                  isOverAllocated ? "text-expense" : isBalanced ? "text-income" : "text-yellow-500"
                )}
              >
                {formatCurrency(Math.abs(remaining))}
                {isOverAllocated && " over"}
              </p>
            </div>
          </div>

          {/* Allocation Progress */}
          {totalIncome > 0 && (
            <>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatCurrency(totalAllocated)} allocated
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      isOverAllocated ? "text-expense" : isBalanced ? "text-income" : ""
                    )}
                  >
                    {allocationPercent}%
                  </span>
                </div>
                <Progress
                  value={Math.min(allocationPercent, 100)}
                  className="h-3"
                  indicatorClassName={cn(
                    isOverAllocated ? "bg-expense" : isBalanced ? "bg-income" : "bg-yellow-500"
                  )}
                />
              </div>

              {/* Status Message */}
              <div
                className={cn(
                  "mt-4 flex items-center gap-2 rounded-lg p-3",
                  isOverAllocated
                    ? "bg-expense/10 text-expense"
                    : isBalanced
                    ? "bg-income/10 text-income"
                    : "bg-yellow-500/10 text-yellow-600"
                )}
              >
                {isOverAllocated ? (
                  <>
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>
                      You've allocated {formatCurrency(Math.abs(remaining))} more than your income.
                    </span>
                  </>
                ) : isBalanced ? (
                  <>
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span>
                      Perfect! Every rupee has a purpose.
                    </span>
                  </>
                ) : (
                  <>
                    <Info className="h-5 w-5 shrink-0" />
                    <span>
                      {formatCurrency(remaining)} unallocated.{" "}
                      <button
                        onClick={handleAutoBalance}
                        className="font-medium underline"
                      >
                        Add to savings
                      </button>
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Category Allocations */}
      {Object.entries(groupedCategories).map(([group, cats]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle className="text-lg">{group}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {cats?.map((cat) => {
                const allocated = allocations[cat.id] || 0
                const percent = totalIncome > 0 ? getPercentage(allocated, totalIncome) : 0
                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        {cat.name}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {percent}%
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        ₹
                      </span>
                      <Input
                        type="number"
                        value={allocated || ""}
                        onChange={(e) => handleAllocationChange(cat.id, e.target.value)}
                        className="pl-8"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSubmitting || totalIncome <= 0}
          className="gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          <CheckCircle className="h-4 w-4" />
          Save Budget
        </Button>
      </div>
    </div>
  )
}
