import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-sky-500 text-slate-950 border-sky-500 hover:bg-sky-400 hover:border-sky-400",
        secondary:
          "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700",
        outline:
          "bg-transparent text-slate-100 border-slate-700 hover:bg-slate-900 hover:border-slate-600",
        ghost:
          "border-transparent bg-transparent text-slate-300 hover:bg-slate-900 hover:text-white",
        destructive:
          "bg-red-600 text-white border-red-500 hover:bg-red-500",
        icon:
          "border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    compoundVariants: [
      {
        variant: "icon",
        className: "rounded-full",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn((children as any).props?.className, classes),
        ref,
        ...props,
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
