

## Updated Plan: Leads & Meetings Module Cleanup

### Analysis Summary

**Meetings table**: Does NOT exist in the database. No table to drop. Only dead code references in 4 import/export utility files need cleanup.

**Leads table**: EXISTS and is deeply linked — cannot be safely dropped:
- `lead_action_items` table has FK → `leads(id)` with CASCADE
- `email_history.lead_id` references leads
- `notifications.lead_id` references leads  
- 3 DB trigger functions query the leads table: `create_action_item_notification`, `create_lead_notification`, `create_unified_action_item_notification`
- Edge functions (`create-backup`, `restore-backup`, `scheduled-backup`, `user-admin`) all reference leads
- Dropping leads would break triggers, notifications, backups, and user deletion

**Deals "Lead" stage is SAFE**: The Lead stage in the Deals module uses `lead_name` and `lead_owner` as TEXT fields directly on the `deals` table — they are NOT foreign keys to the `leads` table. Zero impact from any leads table changes.

### Changes to Make

#### 1. Remove dead "meetings" code from import/export (4 files)

**`src/hooks/import-export/columnConfig.ts`** — Remove the `meetings` config block (lines 125-148)

**`src/hooks/import-export/duplicateChecker.ts`** — Remove `tableName === 'meetings'` branch (lines 92-93)

**`src/hooks/import-export/valueValidator.ts`** — Remove all `tableName === 'meetings'` conditionals (lines 119-121, 127-128, 134-135, 140-141)

**`src/hooks/import-export/headerMapper.ts`** — Remove `tableName === 'meetings'` ternaries (lines 414, 422), use the non-meetings value directly

#### 2. Keep leads table and all infrastructure — no changes

The `leads` table, `lead_action_items` table, all triggers, edge functions, and notification logic remain untouched. No UI page will be created for leads.

#### 3. No database migrations needed

No tables to drop. No schema changes.

### Impact on Existing Data

| Component | Impact |
|-----------|--------|
| Deals "Lead" stage | **None** — uses text fields on `deals` table, not FK to `leads` |
| Deal pipeline (Lead → Won) | **None** — completely independent |
| Existing deals data | **None** — no fields modified |
| Backup/restore | **None** — leads table stays |
| Notifications | **None** — triggers stay |

