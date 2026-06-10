import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-ink/10 bg-cream px-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/40 focus:border-olive focus:ring-2 focus:ring-olive/15",
        type === "date" &&
          "min-w-0 max-w-full appearance-none text-left [&::-webkit-date-and-time-value]:block [&::-webkit-date-and-time-value]:min-w-0 [&::-webkit-date-and-time-value]:text-left",
        className
      )}
      type={type}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
