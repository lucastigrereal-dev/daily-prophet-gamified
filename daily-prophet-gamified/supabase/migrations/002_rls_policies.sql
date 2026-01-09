-- Migration 002: Row-Level Security (RLS) Policies
-- Strategy: Collaborative (Fase 1)
-- Description: Authenticated users can view all records but only modify their own
-- Created: 2026-01-09

-- ============================================================================
-- STEP 1: Add/Modify User Tracking Columns
-- ============================================================================

-- Add created_by to postpacks table
ALTER TABLE postpacks
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Alter postpack_workflow columns from TEXT to UUID with proper foreign keys
-- Note: This migration assumes existing data has NULL or invalid values in these columns
-- In production, you'd need to migrate existing data first

-- Drop and recreate created_by column as UUID
ALTER TABLE postpack_workflow
DROP COLUMN IF EXISTS created_by;

ALTER TABLE postpack_workflow
ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop and recreate approved_by column as UUID
ALTER TABLE postpack_workflow
DROP COLUMN IF EXISTS approved_by;

ALTER TABLE postpack_workflow
ADD COLUMN approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Set default value for created_by on INSERT
CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to postpacks
DROP TRIGGER IF EXISTS set_postpacks_created_by ON postpacks;
CREATE TRIGGER set_postpacks_created_by
  BEFORE INSERT ON postpacks
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

-- Apply trigger to postpack_workflow
DROP TRIGGER IF EXISTS set_workflow_created_by ON postpack_workflow;
CREATE TRIGGER set_workflow_created_by
  BEFORE INSERT ON postpack_workflow
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

-- ============================================================================
-- STEP 2: Create Helper Functions
-- ============================================================================

-- Function to check if user is the workflow owner
CREATE OR REPLACE FUNCTION is_workflow_owner(workflow_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM postpack_workflow
    WHERE id = workflow_id
    AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is the workflow approver
CREATE OR REPLACE FUNCTION is_workflow_approver(workflow_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM postpack_workflow
    WHERE id = workflow_id
    AND approved_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is postpack owner
CREATE OR REPLACE FUNCTION is_postpack_owner(postpack_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM postpacks
    WHERE id = postpack_id
    AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 3: Remove Old Insecure Policies
-- ============================================================================

DROP POLICY IF EXISTS "Allow all postpacks" ON postpacks;
DROP POLICY IF EXISTS "Allow all workflows" ON postpack_workflow;

-- ============================================================================
-- STEP 4: Create RLS Policies for POSTPACKS Table
-- ============================================================================

-- Policy: SELECT - All authenticated users can view all postpacks
CREATE POLICY "postpacks_select_authenticated"
  ON postpacks
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: INSERT - Authenticated users can create postpacks
CREATE POLICY "postpacks_insert_authenticated"
  ON postpacks
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: UPDATE - Only the creator can update their postpacks
CREATE POLICY "postpacks_update_owner"
  ON postpacks
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Policy: DELETE - Only the creator can delete their postpacks
CREATE POLICY "postpacks_delete_owner"
  ON postpacks
  FOR DELETE
  USING (created_by = auth.uid());

-- ============================================================================
-- STEP 5: Create RLS Policies for POSTPACK_WORKFLOW Table
-- ============================================================================

-- Policy: SELECT - All authenticated users can view all workflows
CREATE POLICY "workflow_select_authenticated"
  ON postpack_workflow
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: INSERT - Authenticated users can create workflows
CREATE POLICY "workflow_insert_authenticated"
  ON postpack_workflow
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: UPDATE - Creator OR approver can update workflow
-- This allows both the content creator and the approver to update workflow status
CREATE POLICY "workflow_update_owner_or_approver"
  ON postpack_workflow
  FOR UPDATE
  USING (
    created_by = auth.uid()
    OR approved_by = auth.uid()
  )
  WITH CHECK (
    created_by = auth.uid()
    OR approved_by = auth.uid()
  );

-- Policy: DELETE - Only the creator can delete workflows
CREATE POLICY "workflow_delete_owner"
  ON postpack_workflow
  FOR DELETE
  USING (created_by = auth.uid());

-- ============================================================================
-- STEP 6: Grant Necessary Permissions
-- ============================================================================

-- Grant usage on auth schema for RLS policies
GRANT USAGE ON SCHEMA auth TO authenticated;

-- ============================================================================
-- STEP 7: Create Indexes for Performance
-- ============================================================================

-- Index on created_by for faster ownership checks
CREATE INDEX IF NOT EXISTS idx_postpacks_created_by
  ON postpacks(created_by);

CREATE INDEX IF NOT EXISTS idx_workflow_created_by
  ON postpack_workflow(created_by);

CREATE INDEX IF NOT EXISTS idx_workflow_approved_by
  ON postpack_workflow(approved_by);

-- ============================================================================
-- VERIFICATION QUERIES (Comment out in production)
-- ============================================================================

-- Verify RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('postpacks', 'postpack_workflow');

-- View all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('postpacks', 'postpack_workflow')
-- ORDER BY tablename, policyname;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
