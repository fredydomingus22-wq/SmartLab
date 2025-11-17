import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  value?: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = ({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = React.useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue: handleChange }}>
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within <Tabs>");
  }
  return context;
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = ({ className, ...props }: TabsListProps) => (
  <div
    className={cn(
      "flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-1",
      className
    )}
    {...props}
  />
);

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = ({ className, value, children, ...props }: TabsTriggerProps) => {
  const { value: currentValue, setValue } = useTabs();
  const isActive = currentValue === value;

  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-slate-800 text-slate-100 shadow-inner"
          : "text-slate-400 hover:text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = ({ className, value, ...props }: TabsContentProps) => {
  const { value: currentValue } = useTabs();
  if (currentValue !== value) return null;

  return (
    <div className={cn("rounded-lg border border-slate-800 bg-slate-900 p-4", className)} {...props} />
  );
};
