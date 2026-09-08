import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-11 px-4 py-2 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(79,70,229,0.2)] hover:-translate-y-0.5 hover:bg-primary/90',
        secondary:
          'bg-surface border border-border text-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted',
        outline:
          'border border-primary/30 text-primary bg-transparent hover:border-primary hover:bg-primary/5',
        ghost: 'hover:bg-surface-muted text-foreground',
        destructive: 'bg-critical text-white shadow-[0_8px_20px_rgba(220,61,90,0.18)] hover:bg-critical/90',
        link: 'text-primary underline-offset-4 hover:underline min-h-0 min-w-0 px-0',
      },
      size: {
        default: 'h-11 px-4',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
