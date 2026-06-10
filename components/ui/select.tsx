import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-ink/10 bg-cream px-3 text-sm text-ink shadow-sm outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/15",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export { Select };
