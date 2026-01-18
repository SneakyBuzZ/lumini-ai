import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn.util";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-800 hover:bg-midnight-100/80 border border-white/20 text-white shadow hover:bg-neutral-700",
        destructive:
          "bg-rose-600/40 border border-rose-700 text-white shadow-sm hover:bg-rose-600/50",
        outline:
          "text-neutral-200 border border-neutral-700 bg-midnight-300 hover:bg-midnight-200/70 shadow-sm",
        primary:
          "bg-teal/70 border border-teal text-white shadow-sm hover:bg-teal/50",
        secondary:
          "bg-cyan/50  border border-white/10 text-white shadow-sm hover:bg-cyan/50",
        ghost:
          "hover:bg-teal/40 text-white border border-midnight-300 hover:border-white/10",
        link: "text-white underline-offset-4 hover:underline",
        bright:
          "bg-white text-black border border-white/10 shadow-sm hover:bg-white/80",
      },
      size: {
        default: "h-8 px-4 py-2",
        sm: "h-7 rounded-md px-1 text-xs",
        lg: "h-9 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
