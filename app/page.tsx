'use client'
import React from 'react';
import { IndustrialGrid } from 'apps/smartlab/components/grid/IndustrialGrid';
import { mockData } from 'apps/smartlab/mock-api/data';
import { Lot } from 'apps/smartlab/core/grid/types';
import { createColumnHelper } from '@tanstack/react-table';
import { GridCell } from 'apps/smartlab/components/grid/GridCell';

const columnHelper = createColumnHelper<Lot>();

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.display({
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
        >
          {row.getIsExpanded() ? '👇' : '👉'}
        </button>
      ) : (
        '🔵'
      );
    },
  }),
  columnHelper.accessor('code', {
    header: 'Lot Code',
    cell: ({ cell, table }) => <GridCell cell={cell} table={table} />,
  }),
  columnHelper.accessor('product', {
    header: 'Product',
    cell: ({ cell, table }) => <GridCell cell={cell} table={table} />,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    aggregationFn: 'unique',
    getGroupingValue: row => row.status,
  }),
];

export default function GridPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SmartLab Industrial Data Grid</h1>
      <IndustrialGrid data={mockData} columns={columns} />
    </div>
  );
}
