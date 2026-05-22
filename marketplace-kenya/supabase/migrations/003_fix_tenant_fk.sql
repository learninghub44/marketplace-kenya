-- ============================================================
-- MIGRATION 003: Remove bad tenant_id foreign key constraints
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- Drop the FK that makes tenant_id reference a non-existent tenants table
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tenant_id_fkey;

-- Make sure tenant_id always gets a default
ALTER TABLE users ALTER COLUMN tenant_id SET DEFAULT uuid_generate_v4();

-- Drop FK constraints on child tables that reference users(tenant_id)
-- (they will still work via the users table values)
ALTER TABLE buyers      DROP CONSTRAINT IF EXISTS buyers_tenant_id_fkey;
ALTER TABLE sellers     DROP CONSTRAINT IF EXISTS sellers_tenant_id_fkey;
ALTER TABLE listings    DROP CONSTRAINT IF EXISTS listings_tenant_id_fkey;
ALTER TABLE messages    DROP CONSTRAINT IF EXISTS messages_tenant_id_fkey;
ALTER TABLE favorites   DROP CONSTRAINT IF EXISTS favorites_tenant_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_tenant_id_fkey;
ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_tenant_id_fkey;
ALTER TABLE reports     DROP CONSTRAINT IF EXISTS reports_tenant_id_fkey;
ALTER TABLE payments    DROP CONSTRAINT IF EXISTS payments_tenant_id_fkey;
ALTER TABLE audit_logs  DROP CONSTRAINT IF EXISTS audit_logs_tenant_id_fkey;

SELECT 'Migration 003 complete - tenant_id FK constraints removed' as status;
