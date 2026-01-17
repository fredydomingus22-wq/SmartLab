import { Lot } from '../core/grid/types';

export const mockData: Lot[] = [
  {
    id: 'lot-1',
    code: 'LOTE-2024-001',
    product: 'Produto A',
    status: 'IN_PRODUCTION',
    samples: [
      {
        id: 'sample-1-1',
        code: 'AMOSTRA-A-01',
        collectedAt: new Date().toISOString(),
        assays: [
          { id: 'assay-1-1-1', type: 'PH', value: 7.1, unit: 'pH', status: 'OK' },
          { id: 'assay-1-1-2', type: 'MOISTURE', value: 12.5, unit: '%', status: 'OK' },
        ],
      },
      {
        id: 'sample-1-2',
        code: 'AMOSTRA-A-02',
        collectedAt: new Date().toISOString(),
        assays: [
          { id: 'assay-1-2-1', type: 'PH', value: 7.2, unit: 'pH', status: 'OK' },
          { id: 'assay-1-2-2', type: 'TPC', value: 1500, unit: 'UFC/g', status: 'NOK' },
        ],
      },
    ],
  },
  {
    id: 'lot-2',
    code: 'LOTE-2024-002',
    product: 'Produto B',
    status: 'APPROVED',
    samples: [
      {
        id: 'sample-2-1',
        code: 'AMOSTRA-B-01',
        collectedAt: new Date().toISOString(),
        assays: [{ id: 'assay-2-1-1', type: 'PH', value: 6.8, unit: 'pH', status: 'OK' }],
      },
    ],
  },
  {
    id: 'lot-3',
    code: 'LOTE-2024-003',
    product: 'Produto C',
    status: 'HOLD',
    samples: [],
  },
];
