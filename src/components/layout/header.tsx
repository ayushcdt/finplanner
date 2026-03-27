"use client"

import { Bell, Search, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Title */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Date Display */}
          <div className="hidden items-center gap-2 rounded-full bg-white/[0.05] px-4 py-2 text-sm text-muted-foreground md:flex">
            <Calendar className="h-4 w-4" />
            <span>{format(today, "EEE, MMM d")}</span>
          </div>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-[200px] rounded-full border-white/[0.08] bg-white/[0.05] pl-9 backdrop-blur-xl placeholder:text-muted-foreground/60 focus:bg-white/[0.08] lg:w-[280px]"
            />
          </div>

          {/* Quick Add */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5 rounded-full px-4">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-strong rounded-xl">
              <DropdownMenuLabel className="text-muted-foreground">Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.08]" />
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                <span>💸</span>
                Add Expense
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                <span>💰</span>
                Add Income
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                <span>🔄</span>
                Add Transfer
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.08]" />
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                <span>📊</span>
                Create Budget
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-white/[0.05] hover:bg-white/[0.08]">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-rose-500 to-red-400 shadow-lg shadow-rose-500/50" />
          </Button>
        </div>
      </div>
    </header>
  )
}
