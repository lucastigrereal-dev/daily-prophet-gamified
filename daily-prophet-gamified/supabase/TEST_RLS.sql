-- RLS TESTING SCRIPT
-- Run these queries to verify RLS policies are working correctly
-- Project: Daily Prophet Gamified
-- Date: 2026-01-09

-- ============================================================================
-- PRE-TEST: Verification Queries
-- ============================================================================

-- 1. Verify RLS is enabled on both tables
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('postpacks', 'postpack_workflow');
-- Expected: rowsecurity = true for both tables


-- 2. List all active policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('postpacks', 'postpack_workflow')
ORDER BY tablename, policyname;
-- Expected: 8 policies total (4 per table)


-- 3. Check current authenticated user
SELECT
  auth.uid() as user_id,
  auth.role() as user_role,
  auth.email() as user_email;
-- Expected: Should return your current user ID and 'authenticated' role


-- 4. Verify columns exist
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'postpacks'
  AND column_name IN ('id', 'title', 'created_by')
ORDER BY ordinal_position;
-- Expected: created_by column exists with type UUID


SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'postpack_workflow'
  AND column_name IN ('id', 'created_by', 'approved_by')
ORDER BY ordinal_position;
-- Expected: created_by and approved_by are UUID type


-- ============================================================================
-- TEST 1: SELECT Access (Public Read)
-- ============================================================================

-- Test 1A: Current user can see all postpacks
SELECT
  id,
  title,
  created_by,
  CASE
    WHEN created_by = auth.uid() THEN 'MY_POSTPACK'
    ELSE 'OTHER_USER_POSTPACK'
  END as ownership
FROM postpacks
ORDER BY created_at DESC;
-- Expected: Returns ALL postpacks (both yours and others')


-- Test 1B: Current user can see all workflows
SELECT
  id,
  postpack_id,
  status,
  created_by,
  approved_by,
  CASE
    WHEN created_by = auth.uid() THEN 'MY_WORKFLOW'
    WHEN approved_by = auth.uid() THEN 'APPROVED_BY_ME'
    ELSE 'OTHER_USER_WORKFLOW'
  END as ownership
FROM postpack_workflow
ORDER BY created_at DESC;
-- Expected: Returns ALL workflows (regardless of creator)


-- ============================================================================
-- TEST 2: INSERT Access (Authenticated Write)
-- ============================================================================

-- Test 2A: Insert new postpack (should succeed)
INSERT INTO postpacks (title, objective, format, status)
VALUES ('RLS Test Postpack', 'Testing', 'Carrossel', 'draft')
RETURNING id, title, created_by;
-- Expected: Success, created_by is automatically set to auth.uid()


-- Test 2B: Insert new workflow (should succeed)
INSERT INTO postpack_workflow (postpack_id, status)
VALUES (
  (SELECT id FROM postpacks ORDER BY created_at DESC LIMIT 1),
  'fase_1'
)
RETURNING id, postpack_id, created_by;
-- Expected: Success, created_by is automatically set to auth.uid()


-- Test 2C: Try to insert with different created_by (should be overridden)
-- Note: This tests the trigger, not RLS directly
INSERT INTO postpacks (title, created_by)
VALUES ('Trigger Test', '00000000-0000-0000-0000-000000000000'::UUID)
RETURNING id, title, created_by;
-- Expected: created_by should be auth.uid(), NOT the zero UUID


-- ============================================================================
-- TEST 3: UPDATE Access (Owner Only)
-- ============================================================================

-- Test 3A: Update your own postpack (should succeed)
UPDATE postpacks
SET title = 'Updated by Owner'
WHERE created_by = auth.uid()
  AND id = (
    SELECT id FROM postpacks
    WHERE created_by = auth.uid()
    ORDER BY created_at DESC
    LIMIT 1
  )
RETURNING id, title, created_by;
-- Expected: Success, 1 row updated


-- Test 3B: Try to update another user's postpack (should fail)
-- First, find a postpack NOT owned by you
SELECT id, title, created_by
FROM postpacks
WHERE created_by != auth.uid()
LIMIT 1;

-- Then try to update it (replace <other_user_postpack_id> with actual ID)
-- UPDATE postpacks
-- SET title = 'Attempted Hack!'
-- WHERE id = '<other_user_postpack_id>';
-- Expected: 0 rows updated (RLS prevents it)


-- Test 3C: Update workflow as creator (should succeed)
UPDATE postpack_workflow
SET fase_1_status = 'concluido'
WHERE created_by = auth.uid()
  AND id = (
    SELECT id FROM postpack_workflow
    WHERE created_by = auth.uid()
    ORDER BY created_at DESC
    LIMIT 1
  )
RETURNING id, fase_1_status, created_by;
-- Expected: Success, 1 row updated


-- Test 3D: Update workflow as approver (should succeed)
-- First, set yourself as approver on a workflow
UPDATE postpack_workflow
SET approved_by = auth.uid()
WHERE created_by = auth.uid()
  AND id = (
    SELECT id FROM postpack_workflow
    WHERE created_by = auth.uid()
    ORDER BY created_at DESC
    LIMIT 1
  )
RETURNING id, created_by, approved_by;

-- Now update it as approver
UPDATE postpack_workflow
SET fase_2_status = 'concluido',
    fase_2_feedback = 'Approved as approver!'
WHERE approved_by = auth.uid()
  AND id = (
    SELECT id FROM postpack_workflow
    WHERE approved_by = auth.uid()
    ORDER BY created_at DESC
    LIMIT 1
  )
RETURNING id, fase_2_status, created_by, approved_by;
-- Expected: Success (you are the approver)


-- ============================================================================
-- TEST 4: DELETE Access (Owner Only)
-- ============================================================================

-- Test 4A: Delete your own postpack (should succeed)
DELETE FROM postpacks
WHERE created_by = auth.uid()
  AND title = 'RLS Test Postpack'
RETURNING id, title;
-- Expected: Success, 1 row deleted


-- Test 4B: Try to delete another user's postpack (should fail)
-- DELETE FROM postpacks
-- WHERE id = '<other_user_postpack_id>';
-- Expected: 0 rows deleted (RLS prevents it)


-- Test 4C: Delete your own workflow (should succeed)
DELETE FROM postpack_workflow
WHERE created_by = auth.uid()
  AND id = (
    SELECT id FROM postpack_workflow
    WHERE created_by = auth.uid()
    ORDER BY created_at DESC
    LIMIT 1
  )
RETURNING id;
-- Expected: Success, 1 row deleted


-- ============================================================================
-- TEST 5: Helper Functions
-- ============================================================================

-- Test 5A: is_postpack_owner function
SELECT
  id,
  title,
  is_postpack_owner(id) as i_am_owner
FROM postpacks
ORDER BY created_at DESC
LIMIT 5;
-- Expected: TRUE for your postpacks, FALSE for others


-- Test 5B: is_workflow_owner function
SELECT
  id,
  postpack_id,
  is_workflow_owner(id) as i_am_owner
FROM postpack_workflow
ORDER BY created_at DESC
LIMIT 5;
-- Expected: TRUE for your workflows, FALSE for others


-- Test 5C: is_workflow_approver function
SELECT
  id,
  postpack_id,
  is_workflow_approver(id) as i_am_approver
FROM postpack_workflow
ORDER BY created_at DESC
LIMIT 5;
-- Expected: TRUE where approved_by = auth.uid(), FALSE otherwise


-- ============================================================================
-- TEST 6: Cross-User Testing (Requires 2 Users)
-- ============================================================================

-- Instructions for multi-user testing:
-- 1. Run this script as User A (create some records)
-- 2. Run this script as User B (create different records)
-- 3. As User A, try to see User B's records (should see them)
-- 4. As User A, try to update User B's records (should fail)
-- 5. As User A, try to delete User B's records (should fail)

-- Test 6A: See all users' postpacks (as User A or B)
SELECT
  id,
  title,
  created_by,
  CASE
    WHEN created_by = auth.uid() THEN 'MINE'
    ELSE 'OTHER_USER'
  END as ownership
FROM postpacks
ORDER BY created_at DESC;
-- Expected: Should see BOTH your records and other users' records


-- Test 6B: Count postpacks by ownership
SELECT
  CASE
    WHEN created_by = auth.uid() THEN 'My Postpacks'
    ELSE 'Other Users Postpacks'
  END as category,
  COUNT(*) as count
FROM postpacks
GROUP BY (created_by = auth.uid());
-- Expected: Shows breakdown of your vs others' postpacks


-- ============================================================================
-- POST-TEST: Cleanup (Optional)
-- ============================================================================

-- Clean up test records created by this script
-- DELETE FROM postpacks WHERE title LIKE '%Test%' AND created_by = auth.uid();
-- DELETE FROM postpack_workflow WHERE created_by = auth.uid() AND id NOT IN (SELECT id FROM postpack_workflow ORDER BY created_at ASC LIMIT 3);


-- ============================================================================
-- EXPECTED RESULTS SUMMARY
-- ============================================================================

-- ✅ SELECT: Can see ALL records (yours + others)
-- ✅ INSERT: Can create new records (created_by auto-set)
-- ✅ UPDATE: Can only update YOUR OWN records (or as approver for workflows)
-- ❌ UPDATE: Cannot update OTHER users' records
-- ✅ DELETE: Can only delete YOUR OWN records
-- ❌ DELETE: Cannot delete OTHER users' records

-- If all tests pass, RLS is working correctly! 🎉

-- ============================================================================
-- END OF TEST SCRIPT
-- ============================================================================
