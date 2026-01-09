# Row-Level Security (RLS) Policies Documentation

**Project:** Daily Prophet Gamified
**Migration:** 002_rls_policies.sql
**Strategy:** Collaborative (Phase 1)
**Date:** 2026-01-09

---

## Overview

This document describes the Row-Level Security (RLS) policies implemented for the Daily Prophet Gamified project. The strategy follows a **collaborative model** where all authenticated users can view all content but only modify their own records.

---

## Security Model: Collaborative (Phase 1)

### Core Principles
- **Read Access:** All authenticated users can view all postpacks and workflows
- **Write Access:** Only authenticated users can create records
- **Modify Access:** Only the creator can update or delete their own records
- **Special Rule:** Workflows can be updated by EITHER the creator OR the approver

### Why This Model?
This model is ideal for:
- Small collaborative teams working together
- Content approval workflows where multiple roles interact
- Transparency across team members
- Shared visibility of project status

---

## Database Schema Changes

### 1. POSTPACKS Table

**New Column Added:**
```sql
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
```

**Purpose:** Tracks which user created each postpack

### 2. POSTPACK_WORKFLOW Table

**Columns Modified:**
```sql
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL  -- Changed from TEXT
approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL -- Changed from TEXT
```

**Purpose:**
- `created_by`: Tracks the content creator
- `approved_by`: Tracks who approved the workflow (for multi-role updates)

---

## Helper Functions

### 1. `set_created_by()`
**Type:** Trigger Function
**Purpose:** Automatically sets `created_by` to current user's UUID on INSERT

**Behavior:**
- Runs BEFORE INSERT on both tables
- Only sets value if `created_by` is NULL
- Uses `auth.uid()` to get current authenticated user

**Usage:** Automatic (trigger-based)

---

### 2. `is_workflow_owner(workflow_id UUID)`
**Returns:** BOOLEAN
**Purpose:** Checks if current user owns a specific workflow

**Logic:**
```sql
SELECT 1 FROM postpack_workflow
WHERE id = workflow_id AND created_by = auth.uid()
```

**Usage:** Can be called in custom queries or additional policies

---

### 3. `is_workflow_approver(workflow_id UUID)`
**Returns:** BOOLEAN
**Purpose:** Checks if current user is the approver of a workflow

**Logic:**
```sql
SELECT 1 FROM postpack_workflow
WHERE id = workflow_id AND approved_by = auth.uid()
```

**Usage:** Used in UPDATE policy to allow approvers to modify workflows

---

### 4. `is_postpack_owner(postpack_id UUID)`
**Returns:** BOOLEAN
**Purpose:** Checks if current user owns a specific postpack

**Logic:**
```sql
SELECT 1 FROM postpacks
WHERE id = postpack_id AND created_by = auth.uid()
```

**Usage:** Can be called in custom queries or additional policies

---

## RLS Policies

### POSTPACKS Table Policies

#### 1. `postpacks_select_authenticated`
**Operation:** SELECT
**Access Level:** Public Read (authenticated only)

**Rule:**
```sql
USING (auth.role() = 'authenticated')
```

**What it means:** Any logged-in user can view all postpacks

**Example:**
```javascript
// User A can see postpacks created by User B, C, D...
const { data } = await supabase.from('postpacks').select('*')
```

---

#### 2. `postpacks_insert_authenticated`
**Operation:** INSERT
**Access Level:** Authenticated Write

**Rule:**
```sql
WITH CHECK (auth.role() = 'authenticated')
```

**What it means:** Any logged-in user can create new postpacks

**Example:**
```javascript
// Any authenticated user can insert
const { data } = await supabase.from('postpacks').insert({
  title: 'New Postpack',
  objective: 'Engagement'
})
// created_by is set automatically via trigger
```

---

#### 3. `postpacks_update_owner`
**Operation:** UPDATE
**Access Level:** Owner Only

**Rule:**
```sql
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid())
```

**What it means:** Only the creator can update their postpack

**Example:**
```javascript
// User A can update only their own postpacks
const { data } = await supabase
  .from('postpacks')
  .update({ title: 'Updated Title' })
  .eq('id', postpackId)
// Will fail if current user is not the creator
```

---

#### 4. `postpacks_delete_owner`
**Operation:** DELETE
**Access Level:** Owner Only

**Rule:**
```sql
USING (created_by = auth.uid())
```

**What it means:** Only the creator can delete their postpack

**Example:**
```javascript
// User A can delete only their own postpacks
const { data } = await supabase
  .from('postpacks')
  .delete()
  .eq('id', postpackId)
// Will fail if current user is not the creator
```

---

### POSTPACK_WORKFLOW Table Policies

#### 1. `workflow_select_authenticated`
**Operation:** SELECT
**Access Level:** Public Read (authenticated only)

**Rule:**
```sql
USING (auth.role() = 'authenticated')
```

**What it means:** Any logged-in user can view all workflows

**Example:**
```javascript
// User A can see workflows created by User B, C, D...
const { data } = await supabase.from('postpack_workflow').select('*')
```

---

#### 2. `workflow_insert_authenticated`
**Operation:** INSERT
**Access Level:** Authenticated Write

**Rule:**
```sql
WITH CHECK (auth.role() = 'authenticated')
```

**What it means:** Any logged-in user can create new workflows

**Example:**
```javascript
// Any authenticated user can insert
const { data } = await supabase.from('postpack_workflow').insert({
  postpack_id: postpackId,
  status: 'fase_1'
})
// created_by is set automatically via trigger
```

---

#### 3. `workflow_update_owner_or_approver`
**Operation:** UPDATE
**Access Level:** Owner OR Approver

**Rule:**
```sql
USING (created_by = auth.uid() OR approved_by = auth.uid())
WITH CHECK (created_by = auth.uid() OR approved_by = auth.uid())
```

**What it means:** Either the creator OR the approver can update the workflow

**Example:**
```javascript
// User A (creator) can update their workflow
// User B (approver) can also update if they are set as approved_by
const { data } = await supabase
  .from('postpack_workflow')
  .update({
    fase_2_status: 'concluido',
    fase_2_feedback: 'Approved!'
  })
  .eq('id', workflowId)
// Succeeds if current user is creator OR approver
```

**Use Case:** This allows a two-role workflow:
1. Content Creator (created_by) manages phases 1, 3, 4, 5
2. Content Approver (approved_by) manages phase 2 (approval)

---

#### 4. `workflow_delete_owner`
**Operation:** DELETE
**Access Level:** Owner Only

**Rule:**
```sql
USING (created_by = auth.uid())
```

**What it means:** Only the creator can delete workflows (not the approver)

**Example:**
```javascript
// Only the creator can delete
const { data } = await supabase
  .from('postpack_workflow')
  .delete()
  .eq('id', workflowId)
// Fails for approver, succeeds for creator
```

---

## Testing Guide

### Test Scenario 1: Two Users, Read Access

**Setup:**
1. Create User A (authenticated)
2. Create User B (authenticated)
3. User A creates postpack_1
4. User B creates postpack_2

**Test:**
```javascript
// As User A
const { data } = await supabase.from('postpacks').select('*')
// Expected: Returns both postpack_1 AND postpack_2
```

**Result:** ✅ Both users can see all postpacks

---

### Test Scenario 2: Update Permission

**Setup:**
1. User A creates postpack_1
2. User B tries to update postpack_1

**Test:**
```javascript
// As User B
const { data, error } = await supabase
  .from('postpacks')
  .update({ title: 'Hacked!' })
  .eq('id', postpack_1_id)
// Expected: error with RLS violation
```

**Result:** ✅ User B cannot update User A's postpack

---

### Test Scenario 3: Workflow Approver Access

**Setup:**
1. User A creates workflow_1 (created_by = User A)
2. Set approved_by = User B in workflow_1
3. User B tries to update workflow_1

**Test:**
```javascript
// As User B
const { data, error } = await supabase
  .from('postpack_workflow')
  .update({ fase_2_status: 'concluido' })
  .eq('id', workflow_1_id)
// Expected: Success (User B is approver)
```

**Result:** ✅ Approver can update workflow even though they didn't create it

---

### Test Scenario 4: Delete Permission

**Setup:**
1. User A creates postpack_1
2. User B tries to delete postpack_1

**Test:**
```javascript
// As User B
const { data, error } = await supabase
  .from('postpacks')
  .delete()
  .eq('id', postpack_1_id)
// Expected: error with RLS violation
```

**Result:** ✅ User B cannot delete User A's postpack

---

## SQL Verification Queries

### Check RLS is Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('postpacks', 'postpack_workflow');
```

**Expected Output:**
| tablename | rowsecurity |
|-----------|-------------|
| postpacks | true |
| postpack_workflow | true |

---

### View All Policies
```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('postpacks', 'postpack_workflow')
ORDER BY tablename, policyname;
```

**Expected Output:** 8 policies total (4 per table)

---

### Test Current User Can See All Records
```sql
-- Run as authenticated user
SELECT id, title, created_by FROM postpacks;
-- Should return all postpacks regardless of creator
```

---

### Test Current User Can Only Update Own Records
```sql
-- Run as authenticated user
UPDATE postpacks SET title = 'Test' WHERE id = '<some_other_users_postpack_id>';
-- Should return 0 rows updated (policy prevents it)
```

---

## Migration Application

### Method 1: Supabase Dashboard
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Copy contents of `002_rls_policies.sql`
4. Execute the script
5. Verify no errors

### Method 2: Supabase CLI
```bash
cd daily-prophet-gamified
supabase db push
```

### Method 3: Direct psql
```bash
psql -h <your-host> -U postgres -d postgres -f supabase/migrations/002_rls_policies.sql
```

---

## Rollback Plan

If you need to revert to public access:

```sql
-- Remove all policies
DROP POLICY IF EXISTS "postpacks_select_authenticated" ON postpacks;
DROP POLICY IF EXISTS "postpacks_insert_authenticated" ON postpacks;
DROP POLICY IF EXISTS "postpacks_update_owner" ON postpacks;
DROP POLICY IF EXISTS "postpacks_delete_owner" ON postpacks;

DROP POLICY IF EXISTS "workflow_select_authenticated" ON postpack_workflow;
DROP POLICY IF EXISTS "workflow_insert_authenticated" ON postpack_workflow;
DROP POLICY IF EXISTS "workflow_update_owner_or_approver" ON postpack_workflow;
DROP POLICY IF EXISTS "workflow_delete_owner" ON postpack_workflow;

-- Revert to public access (NOT RECOMMENDED)
CREATE POLICY "Allow all postpacks" ON postpacks FOR ALL USING (true);
CREATE POLICY "Allow all workflows" ON postpack_workflow FOR ALL USING (true);
```

---

## Future Enhancements (Phase 2)

If you want to move to **Private/Isolated** mode:

### Change SELECT Policies
```sql
-- Postpacks: User sees only their own
DROP POLICY "postpacks_select_authenticated" ON postpacks;
CREATE POLICY "postpacks_select_owner"
  ON postpacks FOR SELECT
  USING (created_by = auth.uid());

-- Workflows: User sees only their own
DROP POLICY "workflow_select_authenticated" ON postpack_workflow;
CREATE POLICY "workflow_select_owner"
  ON postpack_workflow FOR SELECT
  USING (created_by = auth.uid() OR approved_by = auth.uid());
```

This would completely isolate users from each other's content.

---

## Security Best Practices

### ✅ DO:
- Always use `auth.uid()` for user identification
- Test policies with multiple user accounts
- Use indexes on `created_by` columns for performance
- Set `created_by` via triggers to prevent tampering
- Use `SECURITY DEFINER` on helper functions carefully

### ❌ DON'T:
- Don't trust client-side user IDs
- Don't use TEXT fields for user references (use UUID with FK)
- Don't disable RLS in production
- Don't create overly permissive policies (USING true)
- Don't forget to test with non-owner users

---

## Troubleshooting

### Problem: "new row violates row-level security policy"

**Cause:** User trying to insert/update without proper permissions

**Solution:**
1. Verify user is authenticated: `SELECT auth.uid();`
2. Check if `created_by` matches: `SELECT created_by FROM postpacks WHERE id = '<id>';`
3. Verify policy exists: `SELECT * FROM pg_policies WHERE tablename = 'postpacks';`

---

### Problem: User can't see any records

**Cause:** User not authenticated or RLS policy too restrictive

**Solution:**
1. Verify authentication: `SELECT auth.role();` (should return 'authenticated')
2. Check SELECT policy allows authenticated users
3. Test query: `SELECT * FROM postpacks;` (should return all records for Phase 1)

---

### Problem: Trigger not setting created_by

**Cause:** Trigger not created or function error

**Solution:**
1. Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname LIKE '%created_by%';`
2. Test function: `SELECT set_created_by();`
3. Check if `auth.uid()` returns value: `SELECT auth.uid();`

---

## Summary

This RLS implementation provides:

- ✅ **Security:** No anonymous access, authenticated users only
- ✅ **Collaboration:** Everyone can see everyone's work
- ✅ **Ownership:** Only creators can modify/delete their content
- ✅ **Flexibility:** Approvers can update workflows in approval phase
- ✅ **Performance:** Indexed columns for fast ownership checks
- ✅ **Maintainability:** Clear policies with descriptive names

The system is ready for a collaborative team environment while maintaining data integrity and preventing unauthorized modifications.

---

**End of Documentation**
