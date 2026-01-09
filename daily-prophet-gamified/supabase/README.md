# Supabase Database Configuration

This directory contains all Supabase database configuration, migrations, and documentation for the Daily Prophet Gamified project.

---

## Directory Structure

```
supabase/
├── migrations/
│   └── 002_rls_policies.sql    # Row-Level Security policies
├── RLS_POLICIES.md              # Complete RLS documentation
├── TEST_RLS.sql                 # SQL test script for validating RLS
└── README.md                    # This file
```

---

## Quick Start

### 1. Apply Migration to Supabase

**Option A: Supabase Dashboard (Recommended)**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: Daily Prophet Gamified
3. Navigate to **SQL Editor**
4. Copy the contents of `migrations/002_rls_policies.sql`
5. Paste and click **Run**
6. Verify success (should show "Success. No rows returned")

**Option B: Supabase CLI**
```bash
cd daily-prophet-gamified
supabase db push
```

**Option C: psql Command Line**
```bash
psql -h <your-db-host>.supabase.co -U postgres -d postgres -f supabase/migrations/002_rls_policies.sql
```

---

### 2. Verify Migration Success

Run these verification queries in SQL Editor:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('postpacks', 'postpack_workflow');
-- Both should show rowsecurity = true

-- Check policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('postpacks', 'postpack_workflow')
ORDER BY tablename, policyname;
-- Should show 8 policies (4 per table)
```

---

### 3. Run Tests

Copy the contents of `TEST_RLS.sql` into SQL Editor and run each section to verify RLS is working correctly.

**Key Tests:**
- ✅ Can see all records (SELECT)
- ✅ Can create new records (INSERT)
- ✅ Can only update own records (UPDATE)
- ❌ Cannot update others' records
- ✅ Can only delete own records (DELETE)
- ❌ Cannot delete others' records

---

## What This Migration Does

### Security Changes
- **Removes** insecure public policies (`USING (true)`)
- **Implements** collaborative RLS (authenticated users see all, edit only own)
- **Adds** user tracking columns (`created_by`, `approved_by`)
- **Creates** helper functions for ownership checks

### Database Changes
- Adds `created_by` column to `postpacks` table
- Converts `created_by` and `approved_by` in `postpack_workflow` from TEXT to UUID
- Creates automatic triggers to set `created_by` on INSERT
- Adds performance indexes on user tracking columns

### Policies Created

**For POSTPACKS:**
1. `postpacks_select_authenticated` - All can view
2. `postpacks_insert_authenticated` - All can create
3. `postpacks_update_owner` - Only creator can update
4. `postpacks_delete_owner` - Only creator can delete

**For POSTPACK_WORKFLOW:**
1. `workflow_select_authenticated` - All can view
2. `workflow_insert_authenticated` - All can create
3. `workflow_update_owner_or_approver` - Creator OR approver can update
4. `workflow_delete_owner` - Only creator can delete

---

## Security Model

### Collaborative (Phase 1) - Currently Implemented

**Read Access:** Public (all authenticated users)
**Write Access:** Owner only (except approvers for workflows)

**Ideal For:**
- Small teams working together
- Transparent workflow management
- Shared visibility of content status

### Private (Phase 2) - Future Option

If you need to switch to private/isolated mode where users only see their own records, see the "Future Enhancements" section in `RLS_POLICIES.md`.

---

## Helper Functions

### `set_created_by()`
Trigger function that automatically sets `created_by = auth.uid()` on INSERT.

### `is_postpack_owner(postpack_id UUID)`
Returns TRUE if current user owns the postpack.

### `is_workflow_owner(workflow_id UUID)`
Returns TRUE if current user created the workflow.

### `is_workflow_approver(workflow_id UUID)`
Returns TRUE if current user is the workflow approver.

---

## Common Issues & Solutions

### Issue: "new row violates row-level security policy"

**Cause:** User not authenticated or trying to modify someone else's record.

**Solution:**
```sql
-- Check authentication
SELECT auth.uid(), auth.role();
-- Should return your user ID and 'authenticated'

-- Check record ownership
SELECT id, created_by FROM postpacks WHERE id = '<record_id>';
-- created_by should match auth.uid() for updates
```

---

### Issue: Can't see any records after migration

**Cause:** User not authenticated or SELECT policy error.

**Solution:**
```sql
-- Verify authentication
SELECT auth.role();
-- Should return 'authenticated', not 'anon'

-- Check if policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'postpacks';
-- Should show 4 policies
```

---

### Issue: created_by is NULL on new records

**Cause:** Trigger not working or user not authenticated.

**Solution:**
```sql
-- Check if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname LIKE '%created_by%';
-- Should show 2 triggers

-- Test trigger function
SELECT set_created_by();
-- Should not error

-- Verify authentication
SELECT auth.uid();
-- Should return your user UUID, not NULL
```

---

## Rollback Instructions

If you need to revert to the old insecure public policies:

```sql
-- Remove new policies
DROP POLICY IF EXISTS "postpacks_select_authenticated" ON postpacks;
DROP POLICY IF EXISTS "postpacks_insert_authenticated" ON postpacks;
DROP POLICY IF EXISTS "postpacks_update_owner" ON postpacks;
DROP POLICY IF EXISTS "postpacks_delete_owner" ON postpacks;

DROP POLICY IF EXISTS "workflow_select_authenticated" ON postpack_workflow;
DROP POLICY IF EXISTS "workflow_insert_authenticated" ON postpack_workflow;
DROP POLICY IF EXISTS "workflow_update_owner_or_approver" ON postpack_workflow;
DROP POLICY IF EXISTS "workflow_delete_owner" ON postpack_workflow;

-- Restore old public policies (NOT RECOMMENDED)
CREATE POLICY "Allow all postpacks" ON postpacks FOR ALL USING (true);
CREATE POLICY "Allow all workflows" ON postpack_workflow FOR ALL USING (true);
```

**⚠️ WARNING:** This makes your database completely public again!

---

## Next Steps

After applying this migration:

1. ✅ Test with multiple user accounts
2. ✅ Update frontend code to handle RLS errors gracefully
3. ✅ Verify authentication is working (`auth.uid()` returns valid UUID)
4. ✅ Test workflow approval flow (creator + approver roles)
5. ✅ Monitor query performance with indexes

---

## Documentation

For complete details on:
- Policy behavior and examples
- Testing procedures
- Multi-user scenarios
- Security best practices

See `RLS_POLICIES.md` for comprehensive documentation.

---

## Support

If you encounter issues:
1. Check `RLS_POLICIES.md` troubleshooting section
2. Run `TEST_RLS.sql` to identify the problem
3. Verify authentication is working: `SELECT auth.uid();`
4. Check Supabase logs in dashboard for error details

---

**Last Updated:** 2026-01-09
**Migration Version:** 002
**Strategy:** Collaborative (Phase 1)
