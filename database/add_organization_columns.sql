-- ============================================
-- Migration: Add missing columns to organizations table
-- ============================================
-- Adds: federal_tax_id, phone, address, responsible_name
-- Date: 2025-01-27
-- ============================================

-- Add new columns to organizations table
ALTER TABLE public.organizations
ADD COLUMN federal_tax_id text,
ADD COLUMN phone text,
ADD COLUMN address text,
ADD COLUMN responsible_name text;

-- Add unique constraint to federal_tax_id (optional but recommended)
ALTER TABLE public.organizations
ADD CONSTRAINT organizations_federal_tax_id_unique UNIQUE (federal_tax_id);

-- Create index for better query performance (optional)
CREATE INDEX idx_organizations_federal_tax_id ON public.organizations(federal_tax_id);

-- Add comments for documentation
COMMENT ON COLUMN public.organizations.federal_tax_id IS 'Federal tax identification number (e.g., CNPJ in Brazil, EIN in USA)';
COMMENT ON COLUMN public.organizations.phone IS 'Organization contact phone number';
COMMENT ON COLUMN public.organizations.address IS 'Organization full address';
COMMENT ON COLUMN public.organizations.responsible_name IS 'Name of the person responsible for the organization';
