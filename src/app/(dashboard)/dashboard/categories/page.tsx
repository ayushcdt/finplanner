"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Plus, Pencil, Loader2 } from "lucide-react"
import { useCategories, createCategory } from "@/hooks/use-categories"
import { useToast } from "@/hooks/use-toast"

const categoryColors = [
  "#6366f1", "#22c55e", "#ef4444", "#f97316", "#8b5cf6",
  "#ec4899", "#3b82f6", "#14b8a6", "#f59e0b", "#84cc16",
]

const commonIcons = [
  "🏠", "🛒", "💡", "🚗", "🛡️", "📱", "🍽️", "🎬", "🛍️", "📺",
  "✈️", "🎮", "📈", "🏦", "💳", "📋", "🏥", "📚", "💇", "🎁",
  "🏋️", "📦", "💼", "💻", "🏢", "💰", "🎉", "💵"
]

export default function CategoriesPage() {
  const { data: expenseCategories, loading: expenseLoading, refetch: refetchExpense } = useCategories("EXPENSE")
  const { data: incomeCategories, loading: incomeLoading, refetch: refetchIncome } = useCategories("INCOME")
  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryType, setCategoryType] = useState<"EXPENSE" | "INCOME">("EXPENSE")

  // Form state
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("📦")
  const [color, setColor] = useState(categoryColors[0])
  const [group, setGroup] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "Missing name",
        description: "Please enter a category name",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const { error } = await createCategory({
      name,
      icon,
      color,
      type: categoryType,
      group: group || "Custom",
    })
    setIsSubmitting(false)

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
    } else {
      toast({ title: "Category created", description: "Your category has been added" })
      setIsDialogOpen(false)
      setName("")
      setIcon("📦")
      setGroup("")
      if (categoryType === "EXPENSE") {
        refetchExpense()
      } else {
        refetchIncome()
      }
    }
  }

  const openDialog = (type: "EXPENSE" | "INCOME") => {
    setCategoryType(type)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Categories"
        subtitle="Organize your transactions with custom categories"
      />

      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="expense">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="expense">Expense Categories</TabsTrigger>
              <TabsTrigger value="income">Income Categories</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="expense" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button size="sm" className="gap-2" onClick={() => openDialog("EXPENSE")}>
                <Plus className="h-4 w-4" />
                Add Expense Category
              </Button>
            </div>
            <CategoryGrid categories={expenseCategories} loading={expenseLoading} />
          </TabsContent>

          <TabsContent value="income" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button size="sm" className="gap-2" onClick={() => openDialog("INCOME")}>
                <Plus className="h-4 w-4" />
                Add Income Category
              </Button>
            </div>
            <CategoryGrid categories={incomeCategories} loading={incomeLoading} />
          </TabsContent>
        </Tabs>

        {/* Add Category Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add {categoryType === "EXPENSE" ? "Expense" : "Income"} Category
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Gym Membership"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl ${
                        icon === i ? "border-primary bg-primary/10" : "border-transparent hover:bg-muted"
                      }`}
                      onClick={() => setIcon(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {categoryColors.map((c) => (
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

              <div className="space-y-2">
                <Label htmlFor="group">Group (optional)</Label>
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Essential">Essential</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
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
                  Add Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function CategoryGrid({
  categories,
  loading,
}: {
  categories: any[] | null
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          No categories found
        </CardContent>
      </Card>
    )
  }

  // Group by group
  const grouped = categories.reduce((acc, cat) => {
    const group = cat.group || "Other"
    if (!acc[group]) acc[group] = []
    acc[group].push(cat)
    return acc
  }, {} as Record<string, any[]>)

  const entries = Object.entries(grouped) as [string, any[]][]

  return (
    <div className="space-y-6">
      {entries.map(([group, cats]) => (
        <div key={group}>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {group}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((category: any) => (
              <Card
                key={category.id}
                className="group transition-colors hover:bg-muted/50"
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.isSystem ? "System" : "Custom"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
