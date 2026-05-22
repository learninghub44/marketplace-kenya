-- Fix tenant_id to be self-generated without foreign key constraints
-- This migration makes tenant_id work properly with our backend

-- Make tenant_id have a proper default that always works
ALTER TABLE users ALTER COLUMN tenant_id SET DEFAULT uuid_generate_v4();

-- Remove foreign key from buyers and sellers that references users(tenant_id)
-- since we want tenant_id to be independent per-user
ALTER TABLE buyers DROP CONSTRAINT IF EXISTS buyers_tenant_id_fkey;
ALTER TABLE sellers DROP CONSTRAINT IF EXISTS sellers_tenant_id_fkey;
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_tenant_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_tenant_id_fkey;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_tenant_id_fkey;
ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_tenant_id_fkey;
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_tenant_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_tenant_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_tenant_id_fkey;

-- Drop any FK to a tenants table if it exists  
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tenant_id_fkey;
