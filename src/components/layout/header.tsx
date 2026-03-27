"use client"

import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { format } from "date-fns"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const today = new Date()

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-2xl">
      <div className="flex h-20 items-center justify-between px-8">
        {/* Left Section */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {format(today, "EEEE, MMMM d")}
          </p>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Quick Add */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-12 gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 font-semibold text-black shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:brightness-110">
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Add New</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-white/[0.08] bg-card p-2">
              <DropdownMenuItem className="gap-3 rounded-xl px-4 py-3 cursor-pointer focus:bg-white/[0.05]">
                <span className="text-xl">💸</span>
                <div>
                  <p className="font-medium">Add Expense</p>
                  <p className="text-xs text-muted-foreground">Record a payment</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 rounded-xl px-4 py-3 cursor-pointer focus:bg-white/[0.05]">
                <span className="text-xl">💰</span>
                <div>
                  <p className="font-medium">Add Income</p>
                  <p className="text-xs text-muted-foreground">Record earnings</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 rounded-xl px-4 py-3 cursor-pointer focus:bg-white/[0.05]">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-medium">Create Budget</p>
                  <p className="text-xs text-muted-foreground">Plan your month</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] transition-all hover:bg-white/[0.08]">
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
          </button>
        </div>
      </div>
    </header>
  )
}
