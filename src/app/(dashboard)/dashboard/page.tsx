import { Header } from "@/components/layout/header"
import { MonthlyOverview } from "@/components/dashboard/monthly-overview"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { BudgetProgress } from "@/components/dashboard/budget-progress"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { WeeklyPulse } from "@/components/dashboard/weekly-pulse"
import { QuickStats } from "@/components/dashboard/quick-stats"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        subtitle="Your financial overview for this month"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Quick Stats Cards */}
        <QuickStats />

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spending by Category Chart */}
          <SpendingChart />

          {/* Weekly Spending Pulse */}
          <WeeklyPulse />
        </div>

        {/* Budget Progress */}
        <BudgetProgress />

        {/* Recent Transactions */}
        <RecentTransactions />
      </div>
    </div>
  )
}
