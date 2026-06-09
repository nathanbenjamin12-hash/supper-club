import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-ink/10 bg-white px-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/40 focus:border-clay focus:ring-2 focus:ring-clay/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
