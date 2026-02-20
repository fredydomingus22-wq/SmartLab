'use client'
import React from 'react';
import { Cell, Table } from '@tanstack/react-table';
import { Lot } from 'apps/smartlab/core/grid/types';
import { appendAudit } from 'apps/smartlab/core/grid/audit';

// Placeholder for permission logic
const useCanEdit = (row: Lot) => {
  return row.status !== 'APPROVED';
};

interface GridCellProps {
  cell: Cell<Lot, any>;
  table: Table<Lot>;
}

export function GridCell({ cell, table }: GridCellProps) {
  const editable = useCanEdit(cell.row.original);
  const initialValue = cell.getValue();

  const [value, setValue] = React.useState(initialValue);

  const onBlur = () => {
    if (initialValue !== value) {
      table.options.meta?.updateData(cell.row.index, cell.column.id, value);
      appendAudit({
        entity: 'LOT', // This would be dynamic in a real implementation
        entityId: cell.row.original.id,
        field: cell.column.id,
        before: initialValue,
        after: value,
      });
    }
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      disabled={!editable}
      className="h-8 w-full bg-transparent p-1"
    />
  );
}
