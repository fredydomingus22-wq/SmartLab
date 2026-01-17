import { create } from 'zustand';
import { TableState } from '@tanstack/react-table';

interface GridState {
  tableState: Partial<TableState>;
  setTableState: (newState: Partial<TableState>) => void;
}

export const useGridStore = create<GridState>((set) => ({
  tableState: {},
  setTableState: (newState) => set((state) => ({
    tableState: { ...state.tableState, ...newState }
  })),
}));
