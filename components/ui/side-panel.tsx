import * as React from "react";

import { cn } from "@/lib/utils";

export interface SidePanelProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  className,
}) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-end bg-black/40 transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "h-full w-full max-w-md transform border-l border-slate-800 bg-slate-950 text-slate-100 shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
          className
        )}
        role="dialog"
        aria-modal
      >
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-800 p-1 text-slate-400 hover:text-white"
              aria-label="Close panel"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="border-t border-slate-800 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};
