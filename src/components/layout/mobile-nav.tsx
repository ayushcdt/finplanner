"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Plus,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { title: "Add", href: "/dashboard/transactions/new", icon: Plus, isAction: true },
  { title: "Budget", href: "/dashboard/budget", icon: PiggyBank },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
      <div className="flex items-center justify-around rounded-3xl border border-white/[0.08] bg-black/90 px-4 py-3 backdrop-blur-2xl shadow-2xl shadow-black/50">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const isAction = item.isAction

          if (isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="-mt-10"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 blur-xl opacity-50" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 shadow-lg shadow-amber-500/40">
                    <Plus className="h-7 w-7 text-black" strokeWidth={2.5} />
                  </div>
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1"
            >
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl transition-all",
                  isActive
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "text-amber-400" : "text-muted-foreground"
              )}>
                {item.title}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
