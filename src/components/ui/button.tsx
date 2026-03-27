import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-110",
        destructive:
          "bg-rose-600 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-500",
        outline:
          "border border-white/[0.1] bg-transparent hover:bg-white/[0.05]",
        secondary:
          "bg-white/[0.08] text-foreground hover:bg-white/[0.12]",
        ghost:
          "hover:bg-white/[0.05]",
        link:
          "text-amber-400 underline-offset-4 hover:underline",
        income:
          "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500",
        expense:
          "bg-rose-600 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-500",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
