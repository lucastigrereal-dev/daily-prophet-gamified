# RLS Quick Start Guide

**5-Minute Setup for Row-Level Security**

---

## What Was Implemented

✅ **Secure RLS Policies** - No more public access (USING true)
✅ **Collaborative Model** - Everyone sees all content, but can only edit their own
✅ **User Tracking** - Automatic `created_by` for all records
✅ **Workflow Approvals** - Approvers can update workflows in Phase 2
✅ **Performance Indexes** - Fast queries on ownership checks

---

## Apply Migration (Choose One Method)

### Method 1: Supabase Dashboard (Easiest)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor**
3. Copy `migrations/002_rls_policies.sql`
4. Paste and click **Run**
5. ✅ Done!

### Method 2: Supabase CLI

```bash
cd daily-prophet-gamified
supabase db push
```

### Method 3: Direct SQL

```bash
psql -h <host>.supabase.co -U postgres -d postgres -f supabase/migrations/002_rls_policies.sql
```

---

## Quick Verification (30 seconds)

Run this in SQL Editor:

```sql
-- Should return TRUE for both tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('postpacks', 'postpack_workflow');

-- Should return 8 policies
SELECT COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('postpacks', 'postpack_workflow');
```

**Expected:**
- Both tables: `rowsecurity = true`
- Policy count: `8`

✅ If you see these results, RLS is active!

---

## How It Works

### For POSTPACKS:

| Action | Who Can Do It | Example |
|--------|---------------|---------|
| **View** | ✅ Everyone (authenticated) | See all team's postpacks |
| **Create** | ✅ Everyone (authenticated) | Add new postpack |
| **Update** | ⚠️ Owner only | Edit your own postpack |
| **Delete** | ⚠️ Owner only | Delete your own postpack |

### For WORKFLOWS:

| Action | Who Can Do It | Example |
|--------|---------------|---------|
| **View** | ✅ Everyone (authenticated) | See all workflows |
| **Create** | ✅ Everyone (authenticated) | Start new workflow |
| **Update** | ⚠️ Owner OR Approver | Creator & approver can both update |
| **Delete** | ⚠️ Owner only | Only creator can delete |

---

## Test It Works (2 minutes)

```sql
-- 1. Check you're authenticated
SELECT auth.uid(), auth.email();
-- Should return your UUID and email

-- 2. Create test postpack
INSERT INTO postpacks (title, objective, format, status)
VALUES ('RLS Test', 'Testing', 'Carrossel', 'draft')
RETURNING id, title, created_by;
-- Should succeed, created_by auto-set

-- 3. See all postpacks
SELECT id, title, created_by FROM postpacks;
-- Should see ALL postpacks (yours + others')

-- 4. Update your postpack
UPDATE postpacks
SET title = 'RLS Test - Updated'
WHERE created_by = auth.uid()
LIMIT 1;
-- Should succeed (1 row updated)
```

✅ If all 4 tests pass, RLS is working!

---

## Frontend Code Changes Needed

### Before (Insecure)
```javascript
// No auth required, public access
const { data } = await supabase.from('postpacks').select('*');
```

### After (Secure)
```javascript
// Requires authenticated user
const { data, error } = await supabase
  .from('postpacks')
  .select('*');

if (error) {
  console.error('RLS Error:', error.message);
  // Handle: user not authenticated
}
```

### Handling Updates
```javascript
// Update will silently fail if user doesn't own record
const { data, error } = await supabase
  .from('postpacks')
  .update({ title: 'New Title' })
  .eq('id', postpackId)
  .select();

if (!data || data.length === 0) {
  // User doesn't own this postpack
  alert('You can only edit your own postpacks');
}
```

---

## Common Issues & Fixes

### Issue: "No rows returned" on SELECT

**Cause:** User not authenticated

**Fix:**
```javascript
// Ensure user is logged in
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // Redirect to login
}
```

---

### Issue: UPDATE silently fails (0 rows)

**Cause:** User doesn't own the record

**Fix:**
```javascript
// Check ownership before updating
const { data } = await supabase
  .from('postpacks')
  .select('created_by')
  .eq('id', postpackId)
  .single();

if (data.created_by === (await supabase.auth.getUser()).data.user.id) {
  // User owns it, safe to update
} else {
  // Show error: "You can only edit your own content"
}
```

---

### Issue: "auth.uid() returns NULL"

**Cause:** Not authenticated or session expired

**Fix:**
```javascript
// Refresh session
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  await supabase.auth.refreshSession();
}
```

---

## What Changed in Database

### postpacks table:
- ✅ Added `created_by UUID` (foreign key to auth.users)
- ✅ Trigger auto-sets `created_by = auth.uid()` on INSERT

### postpack_workflow table:
- ✅ Changed `created_by` from TEXT to UUID
- ✅ Changed `approved_by` from TEXT to UUID
- ✅ Trigger auto-sets `created_by = auth.uid()` on INSERT

### Policies:
- ❌ Removed: `"Allow all postpacks"` (insecure)
- ❌ Removed: `"Allow all workflows"` (insecure)
- ✅ Added: 8 secure policies (4 per table)

---

## File Overview

| File | Purpose |
|------|---------|
| `migrations/002_rls_policies.sql` | ⭐ **Apply this to Supabase** |
| `RLS_POLICIES.md` | Complete documentation (read if issues) |
| `TEST_RLS.sql` | SQL tests to verify RLS works |
| `VALIDATION_CHECKLIST.md` | Step-by-step validation guide |
| `README.md` | Full setup instructions |
| `QUICK_START.md` | This file (5-min overview) |

---

## Next Steps

1. ✅ Apply migration (`002_rls_policies.sql`)
2. ✅ Run quick verification queries
3. ✅ Test with 2 user accounts
4. ✅ Update frontend to handle RLS errors
5. ✅ Read `RLS_POLICIES.md` for details

---

## Need Help?

- **Full Documentation:** `RLS_POLICIES.md`
- **Testing Guide:** `TEST_RLS.sql`
- **Validation Checklist:** `VALIDATION_CHECKLIST.md`
- **Troubleshooting:** See "Common Issues" in `RLS_POLICIES.md`

---

## Summary

**Before:**
🔓 Database was public (anyone could read/write/delete)

**After:**
🔒 Database is secure (only authenticated users, owner-only edits)

**Model:**
👥 Collaborative (everyone sees all, but edits only own)

**Ready to apply?**
→ Go to Supabase Dashboard → SQL Editor → Paste `002_rls_policies.sql` → Run

**That's it! 🎉**

---

**Last Updated:** 2026-01-09
