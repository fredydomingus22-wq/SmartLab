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
    <div className="overflow-hidden rounded-md border">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/60">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground", column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-background">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={getRowId ? getRowId(item, index) : index} className="hover:bg-muted/50">
                {columns.map((column) => {
                  const value = typeof column.accessor === "function"
                    ? column.accessor(item)
                    : (item[column.accessor as keyof T] as React.ReactNode);
                  return (
                    <td key={column.header} className={cn("px-4 py-3 text-sm", column.className)}>
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
