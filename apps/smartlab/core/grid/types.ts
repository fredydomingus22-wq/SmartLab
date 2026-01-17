export interface Lot {
  id: string;
  code: string;
  product: string;
  status: 'IN_PRODUCTION' | 'HOLD' | 'APPROVED' | 'REJECTED';
  samples: Sample[];
}

export interface Sample {
  id: string;
  code: string;
  collectedAt: string;
  assays: AssayResult[];
}

export interface AssayResult {
  id: string;
  type: 'PH' | 'MOISTURE' | 'TPC' | 'COLIFORMS';
  value: number;
  unit: string;
  status: 'OK' | 'NOK';
}

export interface AuditEvent {
  entity: 'LOT' | 'SAMPLE' | 'ASSAY';
  entityId: string;
  field: string;
  before: any;
  after: any;
  user: string;
  timestamp: string;
}
