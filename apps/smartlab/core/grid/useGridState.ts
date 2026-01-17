import { useGridStore } from '../stores/grid.store';
import { OnChangeFn, TableState } from '@tanstack/react-table';

export function useGridState() {
  const { tableState, setTableState } = useGridStore();

  const onStateChange: OnChangeFn<TableState> = (updater) => {
    if (typeof updater === 'function') {
      const newState = updater(tableState as TableState);
      setTableState(newState);
    } else {
      setTableState(updater);
    }
  };

  return {
    state: tableState,
    onStateChange,
  };
}
