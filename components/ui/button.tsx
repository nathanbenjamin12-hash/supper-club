import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/25 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-olive text-cream shadow-subtle hover:bg-[#556149]",
        secondary: "bg-stone text-ink shadow-sm hover:bg-clay",
        outline: "border border-olive/30 bg-cream/70 text-olive hover:bg-olive/8",
        ghost: "text-ink/70 hover:bg-stone/70 hover:text-ink",
        clay: "bg-terracotta text-cream shadow-subtle hover:bg-[#9f5a43]",
        sage: "bg-sage text-ink shadow-subtle hover:bg-[#7d956f]"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button };
