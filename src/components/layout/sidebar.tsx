"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  CreditCard,
  Tags,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { title: "Budget", href: "/dashboard/budget", icon: PiggyBank },
  { title: "Accounts", href: "/dashboard/accounts", icon: CreditCard },
  { title: "Categories", href: "/dashboard/categories", icon: Tags },
]

const bottomNavItems = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) {
      setCollapsed(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  // Save state to localStorage
  const toggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState))
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <aside className={cn("flex w-72 flex-col border-r border-white/[0.06] bg-black/40", className)} />
    )
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-white/[0.06] bg-black/40 transition-all duration-300",
        collapsed ? "w-20" : "w-72",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-24 items-center justify-between px-4">
        <Link href="/dashboard" className={cn("flex items-center gap-4", collapsed && "justify-center")}>
          <div className="relative flex h-12 w-12 items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 blur-lg opacity-60" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500">
              <span className="text-2xl font-black text-black">₹</span>
            </div>
          </div>
          {!collapsed && (
            <div>
              <span className="text-xl font-bold tracking-tight">FinPlanner</span>
              <p className="text-xs text-muted-foreground">Premium Finance</p>
            </div>
          )}
        </Link>
        <button
          onClick={toggleCollapsed}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-white/[0.05] hover:text-white",
            collapsed && "absolute right-2 top-8"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 rounded-2xl px-4 py-4 text-sm font-medium transition-all duration-300",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-transparent text-white"
                  : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
              )}
              title={collapsed ? item.title : undefined}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 shrink-0",
                  isActive
                    ? "bg-gradient-to-br from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/30"
                    : "bg-white/[0.05] text-muted-foreground group-hover:bg-white/[0.08] group-hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              {!collapsed && (
                <>
                  <span className="font-medium">{item.title}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/[0.06] p-3">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 rounded-2xl px-4 py-4 text-sm font-medium transition-all duration-300",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-transparent text-white"
                  : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
              )}
              title={collapsed ? item.title : undefined}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all shrink-0",
                  isActive
                    ? "bg-gradient-to-br from-amber-400 to-amber-500 text-black"
                    : "bg-white/[0.05] group-hover:bg-white/[0.08]"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
