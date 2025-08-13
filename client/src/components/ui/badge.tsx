import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn.util";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        free: "border bg-neutral-900 text-free-foreground shadow hover:bg-free/80",
        pro: "border border-teal/40 bg-teal/30 text-pro-foreground shadow hover:bg-pro/80",
        enterprise:
          "border border-cyan/40 bg-cyan/30 text-enterprise-foreground shadow hover:bg-enterprise/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
