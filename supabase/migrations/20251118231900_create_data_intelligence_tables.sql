
-- supabase/migrations/20251118231900_create_data_intelligence_tables.sql

-- Tabela de Amostras (Samples)
CREATE TABLE IF NOT EXISTS samples (
    sample_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_type TEXT NOT NULL CHECK (sample_type IN ('raw_material', 'water', 'intermediate', 'final')),
    product_code TEXT NOT NULL,
    lot_no TEXT NOT NULL,
    production_line TEXT,
    collection_point TEXT,
    collected_by TEXT,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_analysis', 'validated', 'rejected'))
);

-- Tabela de Parâmetros (Parameters)
CREATE TABLE IF NOT EXISTS parameters (
    parameter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    spec_min NUMERIC,
    spec_max NUMERIC,
    method TEXT,
    frequency_required TEXT,
    criticality_level TEXT NOT NULL CHECK (criticality_level IN ('critical', 'major', 'minor'))
);

-- Tabela de Equipamentos (Equipment)
CREATE TABLE IF NOT EXISTS equipment (
    equipment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    calibration_due_date TIMESTAMPTZ,
    last_calibrated TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('ok', 'overdue', 'out_of_service'))
);

-- Tabela de Análises (Analyses)
CREATE TABLE IF NOT EXISTS analyses (
    analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID REFERENCES samples(sample_id),
    parameter_id UUID REFERENCES parameters(parameter_id),
    method_id UUID,
    result_value NUMERIC NOT NULL,
    unit TEXT,
    limit_min NUMERIC,
    limit_max NUMERIC,
    analyst TEXT,
    analysis_date TIMESTAMPTZ DEFAULT NOW(),
    validation_status TEXT NOT NULL CHECK (validation_status IN ('approved', 'failed', 'deviation')),
    reviewer_id UUID
);

-- Tabela de Não Conformidades (Nonconformities)
CREATE TABLE IF NOT EXISTS nonconformities (
    nc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID REFERENCES samples(sample_id),
    parameter_id UUID REFERENCES parameters(parameter_id),
    deviation_type TEXT,
    root_cause TEXT,
    corrective_action TEXT,
    closed_by UUID,
    closed_at TIMESTAMPTZ
);

COMMENT ON TABLE samples IS 'Stores sample collection data for quality analysis.';
COMMENT ON TABLE parameters IS 'Defines the quality specifications for products.';
COMMENT ON TABLE equipment IS 'Manages equipment calibration status and history.';
COMMENT ON TABLE analyses IS 'Contains the results of laboratory tests performed on samples.';
COMMENT ON TABLE nonconformities IS 'Tracks deviations and non-conformities found during analysis.';
