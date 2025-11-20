
// types/data-intelligence.ts

export interface Sample {
  sample_id: string;
  sample_type: 'raw_material' | 'water' | 'intermediate' | 'final';
  product_code: string;
  lot_no: string;
  production_line: string;
  collection_point: string;
  collected_by: string;
  collected_at: string; // ISO 8601
  status: 'pending' | 'in_analysis' | 'validated' | 'rejected';
}

export interface Analysis {
  analysis_id: string;
  sample_id: string;
  parameter_id: string;
  method_id: string;
  result_value: number;
  unit: string;
  limit_min: number;
  limit_max: number;
  analyst: string;
  analysis_date: string; // ISO 8601
  validation_status: 'approved' | 'failed' | 'deviation';
  reviewer_id?: string;
}

export interface Parameter {
  parameter_id: string;
  name: string;
  spec_min: number;
  spec_max: number;
  method: string;
  frequency_required: string;
  criticality_level: 'critical' | 'major' | 'minor';
}

export interface Nonconformity {
  nc_id: string;
  sample_id: string;
  parameter_id: string;
  deviation_type: string;
  root_cause: string;
  corrective_action: string;
  closed_by?: string;
  closed_at?: string; // ISO 8601
}

export interface Equipment {
  equipment_id: string;
  name: string;
  calibration_due_date: string; // ISO 8601
  last_calibrated: string; // ISO 8601
  status: 'ok' | 'overdue' | 'out_of_service';
}
