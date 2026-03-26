import Link from "next/link"
import { ArrowRight, PieChart, Target, Wallet, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">FinPlanner</span>
          </div>
          <Link
            href="/dashboard"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Open App
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Take Control of Your
          <span className="text-primary block">Financial Future</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Track expenses, create budgets, and watch your savings grow.
          Your data stays in your browser - no account needed.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Get Started <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Manage Your Money
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<PieChart className="h-10 w-10" />}
            title="Smart Budgeting"
            description="Zero-based budgeting that ensures every rupee has a purpose. Visual allocation makes planning effortless."
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10" />}
            title="Expense Tracking"
            description="Quick transaction entry with smart categorization. See where your money goes in real-time."
          />
          <FeatureCard
            icon={<Target className="h-10 w-10" />}
            title="Privacy First"
            description="All data stored locally in your browser. No accounts, no cloud, no tracking."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary rounded-2xl p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Finances?</h2>
          <p className="text-lg opacity-90 mb-8">
            Start tracking your expenses right now - no signup required.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-background/90 transition-colors"
          >
            Open Dashboard <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span className="font-semibold">FinPlanner</span>
          </div>
          <p className="text-sm">Built with care for your financial wellness</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card rounded-xl p-8 border shadow-sm hover:shadow-md transition-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
