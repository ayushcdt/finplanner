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
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    title: "Add",
    href: "/dashboard/transactions/new",
    icon: Plus,
    isAction: true,
  },
  {
    title: "Budget",
    href: "/dashboard/budget",
    icon: PiggyBank,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="flex items-center justify-around rounded-2xl border border-white/[0.08] bg-card/80 px-2 py-1 backdrop-blur-2xl shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const isAction = item.isAction

          if (isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/40">
                  <item.icon className="h-6 w-6" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-3 text-xs transition-all",
                isActive
                  ? "text-white"
                  : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "mb-1 flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                  isActive
                    ? "bg-gradient-to-br from-violet-600/30 to-indigo-500/30"
                    : ""
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
