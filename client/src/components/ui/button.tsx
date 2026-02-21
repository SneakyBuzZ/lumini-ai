import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn.util";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-3 [&_svg]:h-3 [&_svg]:shrink-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-800 hover:bg-neutral-800 border border-neutral-700 text-white shadow",
        destructive:
          "bg-rose-600/40 border border-rose-700 text-white shadow-sm hover:bg-rose-600/50",
        outline:
          "text-neutral-200 border border-neutral-800 bg-midnight-300 hover:bg-midnight-100/60 shadow-sm",
        primary:
          "bg-teal/70 border border-teal text-white shadow-sm hover:bg-teal/50",
        secondary:
          "bg-cyan/40  border border-cyan/50 text-white shadow-sm hover:bg-cyan/50",
        ghost: "hover:bg-midnight-100 text-white",
        link: "text-white underline-offset-4 hover:underline",
        bright:
          "bg-neutral-200/80 text-black border border-white shadow-sm hover:bg-neutral-300",
      },
      size: {
        default: "h-8 px-4 py-2",
        sm: "h-6 rounded-md px-1 text-xs",
        lg: "h-8 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
