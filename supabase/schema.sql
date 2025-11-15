create extension if not exists "pgcrypto";

-- =============================
-- Roles & Users
-- =============================
create table if not exists roles (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    created_at timestamptz not null default now()
);

insert into roles (name, description)
values
    ('admin_root', 'Full platform access'),
    ('plant_manager', 'Site leadership with production privileges'),
    ('qa_supervisor', 'Quality management and approvals'),
    ('lab_tech', 'Laboratory technician with data entry rights'),
    ('auditor_readonly', 'Auditor with read-only visibility')
on conflict (name) do nothing;

create table if not exists users (
    id uuid primary key references auth.users (id) on delete cascade,
    role_id uuid not null references roles (id),
    display_name text,
    phone text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists users_role_id_idx on users(role_id);

-- helper schema
create schema if not exists smartlab;

create or replace function smartlab.current_app_role()
returns text
language sql
stable
as $$
  select coalesce(current_setting('request.jwt.claim.role', true), 'auditor_readonly');
$$;

create or replace function smartlab.has_role(required_roles text[])
returns boolean
language sql
stable
as $$
  select smartlab.current_app_role() = any(required_roles);
$$;

-- =============================
-- Enumerations
-- =============================
create type quarantine_status as enum ('waiting_analysis', 'approved', 'rejected');
create type production_status as enum ('planned', 'in_progress', 'completed', 'closed');
create type finished_lot_status as enum ('released', 'blocked', 'recalled');
create type product_type as enum ('raw_related', 'intermediate', 'finished');
create type parameter_category as enum ('phys_chem', 'micro', 'sensory', 'packaging', 'other');
create type spec_type as enum ('raw_material', 'intermediate', 'finished');
create type sample_type as enum ('raw_material', 'intermediate', 'finished');
create type lab_test_status as enum ('pending', 'in_spec', 'out_of_spec');
create type lab_result_status as enum ('in_spec', 'out_of_spec');
create type nc_source as enum ('lab_result', 'audit', 'raw_material', 'process', 'prp', 'oprp', 'pcc');
create type nc_severity as enum ('minor', 'major', 'critical');
create type nc_status as enum ('open', 'in_progress', 'closed', 'cancelled');
create type d8_status as enum ('open', 'in_progress', 'completed', 'approved');
create type audit_type as enum ('internal', 'external', 'customer', 'certification');
create type finding_type as enum ('conformity', 'observation', 'minor_nc', 'major_nc');
create type document_type as enum ('procedure', 'work_instruction', 'form_template', 'policy');
create type equipment_status as enum ('active', 'inactive', 'maintenance');
create type calibration_result as enum ('ok', 'adjusted', 'rejected');
create type training_status as enum ('assigned', 'pending', 'completed', 'expired');
create type prp_frequency as enum ('daily', 'weekly', 'monthly', 'quarterly', 'biannual', 'annual');
create type check_result as enum ('ok', 'not_ok');
create type oprp_status as enum ('in_control', 'out_of_control');
create type pcc_status as enum ('in_control', 'deviation', 'critical_failure');

-- =============================
-- Products & Specifications
-- =============================
create table products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    code text not null unique,
    type product_type not null,
    status text not null default 'active',
    created_at timestamptz not null default now()
);

create table parameters (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    unit text,
    category parameter_category not null default 'phys_chem'
);

create table product_specs (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references products(id) on delete cascade,
    parameter_id uuid not null references parameters(id) on delete cascade,
    spec_type spec_type not null,
    min_value numeric,
    target_value numeric,
    max_value numeric,
    tolerance_type text,
    created_at timestamptz not null default now(),
    unique(product_id, parameter_id, spec_type)
);

-- =============================
-- Production
-- =============================
create table production_lots (
    id uuid primary key default gen_random_uuid(),
    production_lot_code text not null unique,
    product_id uuid references products(id),
    line_id uuid,
    shift_id uuid,
    created_by uuid references users(id),
    created_at timestamptz not null default now(),
    status production_status not null default 'planned'
);

create table intermediate_lots (
    id uuid primary key default gen_random_uuid(),
    production_lot_id uuid not null references production_lots(id) on delete cascade,
    product_id uuid references products(id),
    tank_id uuid,
    ingredients_list jsonb,
    lot_number text not null,
    production_date date,
    status text default 'in_process'
);

create table finished_product_lots (
    id uuid primary key default gen_random_uuid(),
    production_lot_id uuid not null references production_lots(id) on delete cascade,
    intermediate_lot_id uuid references intermediate_lots(id),
    product_id uuid references products(id),
    lot_number text not null,
    line_id uuid,
    shift_id uuid,
    production_date date,
    expiry_date date,
    status finished_lot_status not null default 'blocked',
    released_by uuid references users(id),
    released_at timestamptz
);

-- =============================
-- Suppliers & Raw Materials
-- =============================
create table suppliers (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    contact_info text,
    certification text,
    risk_level text,
    status text not null default 'pending',
    created_at timestamptz not null default now(),
    created_by uuid references users(id)
);

create table raw_materials (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    code text not null unique,
    category text,
    default_spec_docs text,
    status text not null default 'active',
    created_at timestamptz not null default now(),
    created_by uuid references users(id)
);

create table raw_material_lots (
    id uuid primary key default gen_random_uuid(),
    raw_material_id uuid not null references raw_materials(id),
    supplier_id uuid references suppliers(id),
    lot_number text not null,
    batch_code text,
    received_by uuid references users(id),
    received_at timestamptz not null default now(),
    quarantine_status quarantine_status not null default 'waiting_analysis',
    approved_by uuid references users(id),
    approved_at timestamptz,
    linked_production_lot_id uuid references production_lots(id),
    created_at timestamptz not null default now()
);

create table raw_material_receipts (
    id uuid primary key default gen_random_uuid(),
    raw_material_lot_id uuid not null references raw_material_lots(id) on delete cascade,
    quantity numeric,
    temperature_at_receipt numeric,
    condition_notes text,
    vehicle_number text,
    attachments jsonb,
    created_at timestamptz not null default now()
);

-- =============================
-- Laboratory
-- =============================
create table lab_tests (
    id uuid primary key default gen_random_uuid(),
    sample_type sample_type not null,
    production_lot_id uuid references production_lots(id),
    raw_material_lot_id uuid references raw_material_lots(id),
    intermediate_lot_id uuid references intermediate_lots(id),
    finished_lot_id uuid references finished_product_lots(id),
    product_id uuid references products(id),
    line_id uuid,
    shift_id uuid,
    analyst_id uuid references users(id),
    verified_by uuid references users(id),
    verified_at timestamptz,
    test_date date not null default current_date,
    overall_status lab_test_status not null default 'pending',
    comments text,
    created_at timestamptz not null default now()
);

create table lab_test_results (
    id uuid primary key default gen_random_uuid(),
    lab_test_id uuid not null references lab_tests(id) on delete cascade,
    parameter_id uuid references parameters(id),
    measured_value numeric,
    unit text,
    spec_min numeric,
    spec_target numeric,
    spec_max numeric,
    status lab_result_status not null default 'in_spec',
    remarks text
);

-- =============================
-- Non-Conformities & 8D
-- =============================
create table non_conformities (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    source_type nc_source not null,
    source_id uuid,
    production_lot_id uuid references production_lots(id),
    product_id uuid references products(id),
    lot_number text,
    severity nc_severity not null,
    description text,
    area text,
    opened_by uuid references users(id),
    opened_at timestamptz not null default now(),
    root_cause text,
    corrective_action text,
    preventive_action text,
    assigned_to uuid references users(id),
    due_date date,
    closure_date date,
    status nc_status not null default 'open'
);

create table nc_8d_reports (
    id uuid primary key default gen_random_uuid(),
    nc_id uuid not null references non_conformities(id) on delete cascade,
    d1_team_members jsonb,
    d2_problem_description text,
    d3_containment_actions text,
    d4_root_cause_analysis text,
    d5_corrective_actions text,
    d6_implementation_plan text,
    d7_preventive_actions text,
    d8_lessons_learned text,
    approved_by uuid references users(id),
    approved_at timestamptz,
    status d8_status not null default 'open',
    attachments jsonb
);

-- =============================
-- Audits
-- =============================
create table audits (
    id uuid primary key default gen_random_uuid(),
    type audit_type not null,
    standard text,
    scope text,
    start_date date,
    end_date date,
    auditor_name text,
    status text,
    created_at timestamptz not null default now()
);

create table audit_findings (
    id uuid primary key default gen_random_uuid(),
    audit_id uuid not null references audits(id) on delete cascade,
    finding_type finding_type not null,
    description text,
    area text,
    linked_nc_id uuid references non_conformities(id),
    evidence_text text,
    created_at timestamptz not null default now()
);

-- =============================
-- Documents & Versions
-- =============================
create table documents (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    title text not null,
    type document_type not null,
    area text,
    status text not null default 'draft',
    created_at timestamptz not null default now()
);

create table document_versions (
    id uuid primary key default gen_random_uuid(),
    document_id uuid not null references documents(id) on delete cascade,
    version text not null,
    file_path text,
    created_at timestamptz not null default now(),
    created_by uuid references users(id),
    approved_by uuid references users(id),
    approved_at timestamptz,
    change_summary text,
    unique(document_id, version)
);

-- =============================
-- Equipment & Calibrations
-- =============================
create table equipment (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    code text not null unique,
    location text,
    status equipment_status not null default 'active'
);

create table calibrations (
    id uuid primary key default gen_random_uuid(),
    equipment_id uuid not null references equipment(id) on delete cascade,
    calibration_date date not null,
    due_date date,
    performed_by text,
    result calibration_result not null,
    certificate_path text,
    created_at timestamptz not null default now()
);

-- =============================
-- Trainings & Competence
-- =============================
create table trainings (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    category text,
    validity_days integer,
    created_by uuid references users(id),
    attachments jsonb,
    status text not null default 'active',
    created_at timestamptz not null default now()
);

create table training_sessions (
    id uuid primary key default gen_random_uuid(),
    training_id uuid not null references trainings(id) on delete cascade,
    date date,
    trainer_name text,
    attachments jsonb
);

create table employee_training_assignments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    training_id uuid not null references trainings(id) on delete cascade,
    assigned_by uuid references users(id),
    assigned_at timestamptz not null default now(),
    due_date date,
    status training_status not null default 'assigned'
);

create table training_records (
    id uuid primary key default gen_random_uuid(),
    training_session_id uuid not null references training_sessions(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    completion_date date,
    score numeric,
    certificate_attachment text,
    validated_by uuid references users(id),
    validated_at timestamptz
);

-- =============================
-- Attachments & Activity Logs
-- =============================
create table attachments (
    id uuid primary key default gen_random_uuid(),
    entity_type text not null,
    entity_id uuid not null,
    file_path text not null,
    uploaded_by uuid references users(id),
    uploaded_at timestamptz not null default now(),
    description text
);

create table activity_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id),
    action text not null,
    entity_type text,
    entity_id uuid,
    timestamp timestamptz not null default now(),
    metadata jsonb
);

-- =============================
-- Food Safety Modules
-- =============================
create table prp_categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text
);

create table prp_records (
    id uuid primary key default gen_random_uuid(),
    prp_category_id uuid not null references prp_categories(id) on delete cascade,
    title text not null,
    description text,
    responsible_role text,
    frequency prp_frequency,
    status text not null default 'active',
    attachments jsonb
);

create table prp_checks (
    id uuid primary key default gen_random_uuid(),
    prp_record_id uuid not null references prp_records(id) on delete cascade,
    checked_by uuid references users(id),
    check_date timestamptz not null default now(),
    result check_result not null,
    notes text,
    attachments jsonb,
    nc_id uuid references non_conformities(id)
);

create table oprp_points (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    hazard_controlled text,
    line_id uuid,
    product_id uuid references products(id),
    frequency text,
    monitoring_method text,
    responsible_role text,
    limits jsonb,
    status text not null default 'active'
);

create table oprp_checks (
    id uuid primary key default gen_random_uuid(),
    oprp_point_id uuid not null references oprp_points(id) on delete cascade,
    measured_value numeric,
    timestamp timestamptz not null default now(),
    checked_by uuid references users(id),
    verified_by uuid references users(id),
    status oprp_status not null default 'in_control',
    notes text,
    nc_id uuid references non_conformities(id),
    production_lot_id uuid references production_lots(id)
);

create table pcc_points (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    hazard_controlled text,
    line_id uuid,
    product_id uuid references products(id),
    critical_limits_min numeric,
    critical_limits_max numeric,
    monitoring_method text,
    corrective_action text,
    frequency text,
    responsible_role text,
    status text not null default 'active'
);

create table pcc_checks (
    id uuid primary key default gen_random_uuid(),
    pcc_point_id uuid not null references pcc_points(id) on delete cascade,
    measured_value numeric,
    timestamp timestamptz not null default now(),
    checked_by uuid references users(id),
    verified_by uuid references users(id),
    status pcc_status not null default 'in_control',
    notes text,
    nc_id uuid references non_conformities(id),
    production_lot_id uuid references production_lots(id)
);

-- =============================
-- RLS Policies
-- =============================
alter table suppliers enable row level security;
alter table raw_materials enable row level security;
alter table raw_material_lots enable row level security;
alter table raw_material_receipts enable row level security;
alter table production_lots enable row level security;
alter table intermediate_lots enable row level security;
alter table finished_product_lots enable row level security;
alter table lab_tests enable row level security;
alter table lab_test_results enable row level security;
alter table non_conformities enable row level security;
alter table nc_8d_reports enable row level security;
alter table documents enable row level security;
alter table document_versions enable row level security;
alter table audits enable row level security;
alter table audit_findings enable row level security;
alter table trainings enable row level security;
alter table training_sessions enable row level security;
alter table employee_training_assignments enable row level security;
alter table training_records enable row level security;
alter table prp_records enable row level security;
alter table prp_checks enable row level security;
alter table oprp_points enable row level security;
alter table oprp_checks enable row level security;
alter table pcc_points enable row level security;
alter table pcc_checks enable row level security;

create policy suppliers_read on suppliers
    for select
    using (auth.role() = 'authenticated');

create policy suppliers_manage on suppliers
    for insert with check (smartlab.has_role(array['admin_root','qa_supervisor','plant_manager']));

create policy raw_material_receipt_insert on raw_material_lots
    for insert with check (smartlab.has_role(array['admin_root','plant_manager','qa_supervisor']));

create policy raw_material_lots_select on raw_material_lots
    for select using (auth.role() = 'authenticated');

create policy production_lots_select on production_lots
    for select using (auth.role() = 'authenticated');

create policy production_lots_insert on production_lots
    for insert with check (smartlab.has_role(array['admin_root','plant_manager','qa_supervisor']));

create policy lab_tests_select on lab_tests
    for select using (auth.role() = 'authenticated');

create policy lab_tests_insert on lab_tests
    for insert with check (smartlab.has_role(array['admin_root','qa_supervisor','lab_tech']));

create policy nc_full_access on non_conformities
    for all using (smartlab.has_role(array['admin_root','qa_supervisor','plant_manager','lab_tech']))
    with check (smartlab.has_role(array['admin_root','qa_supervisor','plant_manager','lab_tech']));

create policy auditor_read_only on non_conformities
    for select using (smartlab.has_role(array['auditor_readonly']));

create policy documents_select on documents
    for select using (auth.role() = 'authenticated');

create policy documents_insert on document_versions
    for insert with check (smartlab.has_role(array['admin_root','qa_supervisor']));

create policy trainings_select on trainings
    for select using (auth.role() = 'authenticated');

create policy prp_checks_insert on prp_checks
    for insert with check (smartlab.has_role(array['admin_root','qa_supervisor','lab_tech']));

create policy oprp_checks_insert on oprp_checks
    for insert with check (smartlab.has_role(array['admin_root','qa_supervisor','lab_tech']));

create policy pcc_checks_insert on pcc_checks
    for insert with check (smartlab.has_role(array['admin_root','qa_supervisor']));
