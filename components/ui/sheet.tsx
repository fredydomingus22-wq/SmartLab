"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? (controlledOpen as boolean) : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const value = React.useMemo(
    () => ({ open, setOpen }),
    [open, setOpen]
  );

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

function useSheetContext() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within <Sheet>");
  }
  return context;
}

interface SheetTriggerProps {
  children: React.ReactElement;
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  const { setOpen } = useSheetContext();

  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent) => {
      if (typeof children.props?.onClick === "function") {
        children.props.onClick(event);
      }
      if (!event.defaultPrevented) {
        setOpen(true);
      }
    },
  });
}

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right";
}

export function SheetContent({ children, className, side = "right" }: SheetContentProps) {
  const { open, setOpen } = useSheetContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!mounted) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mounted, setOpen]);

  if (!mounted || !open) {
    return null;
  }

  const content = (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "relative z-10 h-full w-[90vw] max-w-[320px] overflow-y-auto border-slate-900 bg-slate-950 shadow-2xl transition-transform duration-300 ease-out",
          side === "left" ? "border-r" : "ml-auto border-l",
          className
        )}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

interface SheetCloseProps {
  children: React.ReactElement;
}

export function SheetClose({ children }: SheetCloseProps) {
  const { setOpen } = useSheetContext();

  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent) => {
      if (typeof children.props?.onClick === "function") {
        children.props.onClick(event);
      }
      if (!event.defaultPrevented) {
        setOpen(false);
      }
    },
  });
}
