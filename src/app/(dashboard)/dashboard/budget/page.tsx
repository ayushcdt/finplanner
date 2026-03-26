"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/layout/header"
import { BudgetCreator } from "@/components/budget/budget-creator"
import { BudgetOverview } from "@/components/budget/budget-overview"
import { CategoryBudgetList } from "@/components/budget/category-budget-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings, Loader2 } from "lucide-react"
import { useBudget } from "@/hooks/use-budget"

export default function BudgetPage() {
  const currentDate = new Date()
  const { data: budget, loading, refetch } = useBudget(
    currentDate.getMonth() + 1,
    currentDate.getFullYear()
  )
  const [showCreator, setShowCreator] = useState(false)

  const handleSuccess = useCallback(() => {
    refetch()
  }, [refetch])

  const hasBudget = budget && budget.items && budget.items.length > 0

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Budget" subtitle="Plan and track your monthly spending" />
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Budget"
        subtitle="Plan and track your monthly spending"
      />

      <div className="flex-1 space-y-6 p-6">
        {!hasBudget || showCreator ? (
          <BudgetCreator
            onCancel={() => setShowCreator(false)}
            existingBudget={budget}
            onSuccess={handleSuccess}
          />
        ) : (
          <>
            {/* Budget Overview */}
            <BudgetOverview />

            {/* Category Budget Details */}
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Categories</TabsTrigger>
                  <TabsTrigger value="over">Over Budget</TabsTrigger>
                  <TabsTrigger value="under">Under Budget</TabsTrigger>
                </TabsList>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreator(true)}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Edit Budget
                </Button>
              </div>

              <TabsContent value="all">
                <CategoryBudgetList filter="all" />
              </TabsContent>
              <TabsContent value="over">
                <CategoryBudgetList filter="over" />
              </TabsContent>
              <TabsContent value="under">
                <CategoryBudgetList filter="under" />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
