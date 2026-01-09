# RLS Migration Validation Checklist

Use this checklist to ensure the RLS migration was applied successfully and is working correctly.

**Project:** Daily Prophet Gamified
**Migration:** 002_rls_policies.sql
**Date:** 2026-01-09

---

## Pre-Migration Checklist

- [ ] Backup database before applying migration
- [ ] Verify Supabase project is accessible
- [ ] Confirm you have database admin access
- [ ] Review migration file: `migrations/002_rls_policies.sql`
- [ ] Read documentation: `RLS_POLICIES.md`

---

## Migration Application

### Step 1: Apply Migration

**Method Used:** (check one)
- [ ] Supabase Dashboard SQL Editor
- [ ] Supabase CLI (`supabase db push`)
- [ ] Direct psql connection

**Result:**
- [ ] Migration executed without errors
- [ ] No error messages in output
- [ ] Received success confirmation

---

### Step 2: Verify Database Changes

Run these queries and check results:

#### 2.1: RLS Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('postpacks', 'postpack_workflow');
```

**Expected Result:**
```
 tablename           | rowsecurity
---------------------+-------------
 postpacks           | t
 postpack_workflow   | t
```

- [ ] ✅ Both tables show `rowsecurity = true`

---

#### 2.2: Policies Created
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('postpacks', 'postpack_workflow')
ORDER BY tablename, policyname;
```

**Expected Result:** 8 policies total

**POSTPACKS Policies:**
- [ ] ✅ `postpacks_select_authenticated` (SELECT)
- [ ] ✅ `postpacks_insert_authenticated` (INSERT)
- [ ] ✅ `postpacks_update_owner` (UPDATE)
- [ ] ✅ `postpacks_delete_owner` (DELETE)

**POSTPACK_WORKFLOW Policies:**
- [ ] ✅ `workflow_select_authenticated` (SELECT)
- [ ] ✅ `workflow_insert_authenticated` (INSERT)
- [ ] ✅ `workflow_update_owner_or_approver` (UPDATE)
- [ ] ✅ `workflow_delete_owner` (DELETE)

---

#### 2.3: Columns Added/Modified
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'postpacks' AND column_name = 'created_by';
```

**Expected Result:**
```
 column_name | data_type | is_nullable
-------------+-----------+-------------
 created_by  | uuid      | YES
```

- [ ] ✅ `postpacks.created_by` exists and is UUID type

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'postpack_workflow'
  AND column_name IN ('created_by', 'approved_by')
ORDER BY column_name;
```

**Expected Result:**
```
 column_name  | data_type | is_nullable
--------------+-----------+-------------
 approved_by  | uuid      | YES
 created_by   | uuid      | YES
```

- [ ] ✅ `postpack_workflow.created_by` is UUID type (not TEXT)
- [ ] ✅ `postpack_workflow.approved_by` is UUID type (not TEXT)

---

#### 2.4: Triggers Created
```sql
SELECT tgname, tgrelid::regclass AS table_name, tgtype
FROM pg_trigger
WHERE tgname LIKE '%created_by%';
```

**Expected Result:**
```
 tgname                     | table_name         | tgtype
----------------------------+--------------------+--------
 set_postpacks_created_by   | postpacks          | ...
 set_workflow_created_by    | postpack_workflow  | ...
```

- [ ] ✅ Trigger exists on `postpacks`
- [ ] ✅ Trigger exists on `postpack_workflow`

---

#### 2.5: Functions Created
```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%workflow%' OR routine_name LIKE '%postpack%'
ORDER BY routine_name;
```

**Expected Functions:**
- [ ] ✅ `set_created_by` (function)
- [ ] ✅ `is_workflow_owner` (function)
- [ ] ✅ `is_workflow_approver` (function)
- [ ] ✅ `is_postpack_owner` (function)

---

#### 2.6: Indexes Created
```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE '%created_by%' OR indexname LIKE '%approved_by%'
ORDER BY tablename, indexname;
```

**Expected Indexes:**
- [ ] ✅ `idx_postpacks_created_by`
- [ ] ✅ `idx_workflow_created_by`
- [ ] ✅ `idx_workflow_approved_by`

---

## Functional Testing

### Step 3: Test RLS Policies

#### 3.1: Verify Authentication
```sql
SELECT
  auth.uid() as user_id,
  auth.role() as user_role,
  auth.email() as user_email;
```

**Expected Result:**
- [ ] ✅ `user_id` is a valid UUID (not NULL)
- [ ] ✅ `user_role` is `'authenticated'` (not 'anon')
- [ ] ✅ `user_email` matches your logged-in email

---

#### 3.2: Test SELECT (Read Access)
```sql
SELECT id, title, created_by FROM postpacks LIMIT 5;
```

**Expected Result:**
- [ ] ✅ Query returns results (no RLS error)
- [ ] ✅ Can see records from multiple users (if they exist)
- [ ] ✅ Both own and others' records are visible

---

#### 3.3: Test INSERT (Create Access)
```sql
INSERT INTO postpacks (title, objective, format, status)
VALUES ('RLS Test Post', 'Testing RLS', 'Carrossel', 'draft')
RETURNING id, title, created_by;
```

**Expected Result:**
- [ ] ✅ Insert succeeds
- [ ] ✅ `created_by` is automatically set to `auth.uid()`
- [ ] ✅ Record ID is returned

**Record the test postpack ID:** `_______________________`

---

#### 3.4: Test UPDATE (Modify Own Record)
```sql
UPDATE postpacks
SET title = 'RLS Test Post - Updated'
WHERE id = '<test_postpack_id_from_above>'
RETURNING id, title;
```

**Expected Result:**
- [ ] ✅ Update succeeds (1 row updated)
- [ ] ✅ Title is changed

---

#### 3.5: Test DELETE (Delete Own Record)
```sql
DELETE FROM postpacks
WHERE id = '<test_postpack_id_from_above>'
RETURNING id;
```

**Expected Result:**
- [ ] ✅ Delete succeeds (1 row deleted)
- [ ] ✅ Record is removed

---

#### 3.6: Test Workflow Approver Access

**Create test workflow:**
```sql
INSERT INTO postpack_workflow (postpack_id, status)
VALUES (
  (SELECT id FROM postpacks ORDER BY created_at DESC LIMIT 1),
  'fase_1'
)
RETURNING id, created_by;
```

- [ ] ✅ Workflow created successfully
- [ ] ✅ `created_by` is set to `auth.uid()`

**Record the test workflow ID:** `_______________________`

**Set yourself as approver:**
```sql
UPDATE postpack_workflow
SET approved_by = auth.uid()
WHERE id = '<test_workflow_id_from_above>'
RETURNING id, created_by, approved_by;
```

- [ ] ✅ Update succeeds
- [ ] ✅ Both `created_by` AND `approved_by` equal `auth.uid()`

**Update as approver:**
```sql
UPDATE postpack_workflow
SET fase_2_status = 'concluido',
    fase_2_feedback = 'Approver test successful'
WHERE id = '<test_workflow_id_from_above>'
RETURNING id, fase_2_status;
```

- [ ] ✅ Update succeeds (approver can modify workflow)

---

### Step 4: Test RLS Restrictions (Multi-User)

**Note:** This section requires 2 different user accounts

#### 4.1: Create Test Data as User A

**Login as User A**

```sql
-- Verify identity
SELECT auth.email() as current_user;
```

Current User A Email: `_______________________`

```sql
-- Create postpack as User A
INSERT INTO postpacks (title, objective, format, status)
VALUES ('User A Postpack', 'User A Test', 'Carrossel', 'draft')
RETURNING id, title, created_by;
```

**Record User A's Postpack ID:** `_______________________`

- [ ] ✅ Created successfully
- [ ] ✅ `created_by` is User A's UUID

---

#### 4.2: Test Cross-User Access as User B

**Login as User B**

```sql
-- Verify identity
SELECT auth.email() as current_user;
```

Current User B Email: `_______________________`

**Test SELECT (should succeed):**
```sql
SELECT id, title, created_by
FROM postpacks
WHERE id = '<user_a_postpack_id>';
```

- [ ] ✅ User B can SEE User A's postpack
- [ ] ✅ Query returns the record

**Test UPDATE (should fail):**
```sql
UPDATE postpacks
SET title = 'Hacked by User B'
WHERE id = '<user_a_postpack_id>';
```

**Expected Result:**
- [ ] ✅ Update returns **0 rows updated** (RLS blocked it)
- [ ] ✅ No error, just silent prevention
- [ ] ✅ Record unchanged when queried

**Test DELETE (should fail):**
```sql
DELETE FROM postpacks
WHERE id = '<user_a_postpack_id>';
```

**Expected Result:**
- [ ] ✅ Delete returns **0 rows deleted** (RLS blocked it)
- [ ] ✅ Record still exists when queried

---

### Step 5: Test Helper Functions

```sql
-- Test with a postpack you own
SELECT
  id,
  title,
  created_by,
  is_postpack_owner(id) as i_own_this
FROM postpacks
WHERE created_by = auth.uid()
LIMIT 1;
```

- [ ] ✅ `i_own_this` returns `true`

```sql
-- Test with a postpack you DON'T own
SELECT
  id,
  title,
  created_by,
  is_postpack_owner(id) as i_own_this
FROM postpacks
WHERE created_by != auth.uid()
LIMIT 1;
```

- [ ] ✅ `i_own_this` returns `false`

---

## Performance Testing

### Step 6: Verify Indexes

```sql
EXPLAIN ANALYZE
SELECT * FROM postpacks WHERE created_by = auth.uid();
```

**Check Output:**
- [ ] ✅ Query uses index scan (not seq scan)
- [ ] ✅ Query execution time is fast (< 50ms for < 10k rows)

```sql
EXPLAIN ANALYZE
SELECT * FROM postpack_workflow WHERE created_by = auth.uid();
```

- [ ] ✅ Query uses index scan
- [ ] ✅ Query execution time is acceptable

---

## Integration Testing

### Step 7: Test from Frontend Application

#### 7.1: Read Operations
- [ ] ✅ Can fetch all postpacks via Supabase client
- [ ] ✅ Can fetch all workflows via Supabase client
- [ ] ✅ No RLS errors in browser console

**Sample Code:**
```javascript
const { data, error } = await supabase
  .from('postpacks')
  .select('*');

console.log('Data:', data);
console.log('Error:', error); // Should be null
```

---

#### 7.2: Create Operations
- [ ] ✅ Can create new postpack from frontend
- [ ] ✅ `created_by` is automatically set
- [ ] ✅ New postpack appears in list immediately

**Sample Code:**
```javascript
const { data, error } = await supabase
  .from('postpacks')
  .insert({
    title: 'Frontend Test',
    objective: 'Testing',
    format: 'Carrossel',
    status: 'draft'
  })
  .select();

console.log('Created:', data);
console.log('Error:', error); // Should be null
```

---

#### 7.3: Update Operations
- [ ] ✅ Can update own postpack from frontend
- [ ] ✅ Cannot update others' postpacks (silent failure or error)
- [ ] ✅ UI handles permission errors gracefully

**Sample Code:**
```javascript
// Update own postpack (should succeed)
const { data, error } = await supabase
  .from('postpacks')
  .update({ title: 'Updated Title' })
  .eq('id', myPostpackId)
  .select();

console.log('Updated:', data);
console.log('Error:', error); // Should be null

// Try to update someone else's postpack (should fail)
const { data: data2, error: error2 } = await supabase
  .from('postpacks')
  .update({ title: 'Hack!' })
  .eq('id', someoneElsesPostpackId)
  .select();

console.log('Updated:', data2); // Should be null or empty
console.log('Error:', error2); // May have error or just return empty
```

---

#### 7.4: Delete Operations
- [ ] ✅ Can delete own postpack from frontend
- [ ] ✅ Cannot delete others' postpacks
- [ ] ✅ UI shows appropriate feedback

---

## Final Verification

### Step 8: Security Audit

- [ ] ✅ No public policies exist (USING true)
- [ ] ✅ RLS is enabled on both tables
- [ ] ✅ All policies require authentication
- [ ] ✅ No anonymous access to data
- [ ] ✅ Users cannot escalate privileges
- [ ] ✅ `created_by` cannot be manually set/changed

---

### Step 9: Documentation Review

- [ ] ✅ Read `RLS_POLICIES.md` completely
- [ ] ✅ Understand all 8 policies
- [ ] ✅ Know how to test RLS
- [ ] ✅ Know how to troubleshoot issues
- [ ] ✅ Understand collaborative vs private mode

---

### Step 10: Team Communication

- [ ] ✅ Informed team about RLS changes
- [ ] ✅ Updated authentication requirements documented
- [ ] ✅ Explained multi-user behavior
- [ ] ✅ Provided troubleshooting guide

---

## Rollback Plan (If Needed)

If critical issues are found:

- [ ] Run rollback SQL from `RLS_POLICIES.md`
- [ ] Test that app works with public policies
- [ ] Document the issue
- [ ] Schedule retry after fixes

---

## Sign-Off

**Migration Applied By:** _______________________

**Date Applied:** _______________________

**Environment:** (check one)
- [ ] Development
- [ ] Staging
- [ ] Production

**Overall Status:**
- [ ] ✅ All checks passed - RLS is working correctly
- [ ] ⚠️ Some issues found - see notes below
- [ ] ❌ Critical issues - rollback performed

**Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

---

## Next Steps After Validation

- [ ] Update frontend error handling for RLS errors
- [ ] Add user feedback for permission denied actions
- [ ] Monitor Supabase logs for RLS policy violations
- [ ] Set up alerts for authentication failures
- [ ] Plan transition to Phase 2 (private mode) if needed

---

**Validation Complete! 🎉**

If all checkboxes are marked, your RLS implementation is secure and working correctly.

---

**End of Validation Checklist**
