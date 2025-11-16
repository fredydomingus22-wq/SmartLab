import * as React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface SimpleTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId?: (item: T, index: number) => string | number;
  emptyMessage?: string;
}

export function SimpleTable<T extends Record<string, any>>({
  columns,
  data,
  getRowId,
  emptyMessage = "No data available",
}: SimpleTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-white/[0.04] text-slate-300">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={cn(
                  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em]",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm text-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-xs text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={getRowId ? getRowId(item, index) : index}
                className="transition hover:bg-white/5"
              >
                {columns.map((column) => {
                  const value =
                    typeof column.accessor === "function"
                      ? column.accessor(item)
                      : (item[column.accessor as keyof T] as React.ReactNode);
                  return (
                    <td key={column.header} className={cn("px-4 py-3", column.className)}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
