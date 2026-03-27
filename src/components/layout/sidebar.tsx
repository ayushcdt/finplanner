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
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-white/[0.08] bg-card/30 backdrop-blur-2xl transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/30">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight">FinPlanner</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg opacity-60 hover:opacity-100"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        <p className={cn(
          "mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60",
          collapsed && "sr-only"
        )}>
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-indigo-500/20 text-white shadow-lg"
                  : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                  isActive
                    ? "bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/30"
                    : "bg-white/[0.05] group-hover:bg-white/[0.08]"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
              </div>
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3">
        <div className="mb-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-indigo-500/20 text-white"
                  : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                  isActive
                    ? "bg-gradient-to-br from-violet-600 to-indigo-500 text-white"
                    : "bg-white/[0.05] group-hover:bg-white/[0.08]"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
              </div>
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
