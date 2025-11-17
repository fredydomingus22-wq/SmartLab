"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within <Sheet>.");
  }
  return context;
}

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet = ({ children, open, defaultOpen = false, onOpenChange }: SheetProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? Boolean(open) : internalOpen;

  const setOpen = React.useCallback(
    (nextState: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextState);
      }
      onOpenChange?.(nextState);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};
Sheet.displayName = "Sheet";

type SheetToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: React.ReactNode;
};

function createToggle(nextOpenState: boolean, displayName: string) {
  const Toggle = React.forwardRef<HTMLButtonElement, SheetToggleProps>(
    ({ asChild = false, children, ...props }, ref) => {
      const { setOpen } = useSheetContext();

      const handleClick = (event: React.MouseEvent<any>) => {
        props.onClick?.(event as React.MouseEvent<HTMLButtonElement>);
        if (!event.defaultPrevented) {
          setOpen(nextOpenState);
        }
      };

      if (asChild && React.isValidElement(children)) {
        const childElement = children as React.ReactElement<{ onClick?: React.MouseEventHandler<any> }>;

        return React.cloneElement(childElement, {
          onClick: (event: React.MouseEvent<any>) => {
            childElement.props?.onClick?.(event);
            handleClick(event);
          },
        });
      }

      return (
        <button type="button" ref={ref} {...props} onClick={handleClick}>
          {children}
        </button>
      );
    }
  );

  Toggle.displayName = displayName;

  return Toggle;
}

const SheetTrigger = createToggle(true, "SheetTrigger");

const SheetClose = createToggle(false, "SheetClose");

const SheetPortal = ({ children }: { children: React.ReactNode }) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setContainer(document.body);
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
};

const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
);
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-slate-950/95 p-6 text-slate-100 shadow-xl transition ease-in-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-slate-900 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t border-slate-900 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left:
          "inset-y-0 left-0 h-full w-3/4 border-r border-slate-900 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l border-slate-900 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => {
    const { open, setOpen } = useSheetContext();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    React.useEffect(() => {
      if (!open) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, setOpen]);

    React.useEffect(() => {
      if (!open) return;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [open]);

    if (!mounted || !open) {
      return null;
    }

    return (
      <SheetPortal>
        <SheetOverlay data-state={open ? "open" : "closed"} onClick={() => setOpen(false)} />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          data-state={open ? "open" : "closed"}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          {children}
        </div>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-1.5 text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold text-slate-100", className)} {...props} />
  )
);
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-slate-400", className)} {...props} />
  )
);
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}; 
