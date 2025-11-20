# Session History - Quick Reference Card

## Setup (One-Time)

```typescript
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { submitSessionToBackend } from '@/lib/sessionHistoryUtils';
import SessionHistoryView from '@/components/SessionHistoryView';

const { patient } = usePatientContext();
const { history, saveDraft, markAsSynced, deleteEntry } = 
  useSessionHistory(patient.phn);
```

## Auto-Save on Form Change

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    saveDraft(formData, sessionDate);
  }, 2000); // Wait 2 seconds after typing stops
  return () => clearTimeout(timer);
}, [formData, sessionDate, saveDraft]);
```

## Submit to Backend

```typescript
const handleSubmit = async () => {
  const draft = saveDraft(formData, sessionDate);
  
  submitSessionToBackend(
    draft,
    (updated) => {
      markAsSynced(updated.id);
      toast({ title: 'Success', description: 'Session saved' });
    },
    (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  );
};
```

## Show History UI

```typescript
<SessionHistoryView 
  entries={history}
  onRestore={(entry) => setFormData(entry.data)}
  onDelete={deleteEntry}
  onViewDetails={(entry) => showModal(entry.data)}
/>
```

## Restore Latest Draft on Load

```typescript
useEffect(() => {
  if (formData || !patient?.phn) return;
  const latest = getLatestDraft(sessionDate);
  if (latest) setFormData(latest.data);
}, [patient?.phn]);
```

## Status Indicators

| Status | Color | Meaning |
|--------|-------|---------|
| **Draft** | 🟡 Yellow | Saved locally only |
| **Submitted** | 🔵 Blue | Sent to API |
| **Synced** | 🟢 Green | Confirmed in database |

## Common Operations

```typescript
// Get all drafts (unsaved)
const drafts = getDrafts();

// Get all synced sessions (in database)
const synced = getSynced();

// Get specific session
const session = getEntry(entryId);

// Get latest draft for a date
const latest = getLatestDraft('2025-11-20');

// Delete a session
deleteEntry(entryId);

// Clear all history for patient
clearHistory();

// Export for backup
exportSessionHistory(history, 'backup.json');

// Import from file
const imported = await importSessionHistory(file);

// Get statistics
const stats = getHistorySummary(history);
// → { total: 25, drafts: 3, submitted: 5, synced: 17, avgDuration: 240 }

// Clean old entries (>90 days)
const cleaned = cleanOldEntries(history, 90);
```

## Storage Limits

- **Max per patient**: 50 entries (auto-cleanup)
- **Entry size**: 2-5 KB (with hourly records)
- **Total per patient**: 100-250 KB
- **localStorage limit**: ~5-10 MB per domain
- **Safe**: ✅ Well within limits

## File Locations

- `src/hooks/useSessionHistory.ts` - Main hook
- `src/components/SessionHistoryView.tsx` - UI component
- `src/lib/sessionHistoryUtils.ts` - Utilities
- `src/components/EXAMPLE_SESSION_HISTORY_INTEGRATION.tsx` - Reference

## Debugging

```typescript
// View all stored sessions
const stored = localStorage.getItem('hd_session_history');
console.log(JSON.parse(stored));

// Clear all history
localStorage.removeItem('hd_session_history');

// Check what's in a specific entry
console.log('Entry data:', history[0].data);
```

## Best Practices

✅ **DO:**
- Auto-save with debounce (1-2 second delay)
- Show visual feedback while saving
- Let users restore from drafts
- Clean old entries regularly
- Export important sessions as backup

❌ **DON'T:**
- Save on every keystroke (use debounce)
- Ignore backend sync errors
- Keep unlimited history (set max limit)
- Store sensitive data in local storage
- Forget to mark entries as synced

## Error Handling

```typescript
const draft = saveDraft(formData, sessionDate);
if (!draft) {
  console.error('Failed to save draft');
  // Handle localStorage error
}

try {
  await submitSessionToBackend(...);
} catch (error) {
  console.error('Submission failed:', error.message);
  // Draft still in history, user can retry
}
```

## Performance Tips

1. **Debounce saves**: Wait 2 seconds after typing
2. **Lazy load history**: Only load for current patient
3. **Batch operations**: Use batchSubmitSessions for multiple
4. **Clean old entries**: Remove entries >90 days old
5. **Limit max entries**: Keep 50 per patient max

## Integration Checklist

- [ ] Import hook in form component
- [ ] Add auto-save effect with debounce
- [ ] Wire up submit handler
- [ ] Add error handling
- [ ] Render SessionHistoryView component
- [ ] Test save/restore locally
- [ ] Test backend submission
- [ ] Verify status updates correctly
- [ ] Add user feedback (toasts)
- [ ] Test on slow network (DevTools throttling)

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| History empty | Check patientId matches exactly |
| Not saving | Check localStorage enabled, not full |
| Draft not restoring | Verify sessionDate matches |
| Backend not syncing | Check API endpoint, network errors |
| Storage warning | Run cleanOldEntries(), reduce max entries |

## Example: Complete Integration

```typescript
// 1. Initialize
const { history, saveDraft, markAsSynced, deleteEntry } = 
  useSessionHistory(patient.phn);

// 2. Auto-save
useEffect(() => {
  const timer = setTimeout(() => saveDraft(formData, sessionDate), 2000);
  return () => clearTimeout(timer);
}, [formData]);

// 3. Submit
const handleSubmit = async () => {
  const draft = saveDraft(formData, sessionDate);
  await submitSessionToBackend(draft, 
    () => markAsSynced(draft.id), 
    (err) => showError(err)
  );
};

// 4. Display
<SessionHistoryView 
  entries={history}
  onRestore={(e) => setFormData(e.data)}
  onDelete={deleteEntry}
  onViewDetails={showDetails}
/>
```

---

**Need more help?** See `SESSION_HISTORY_GUIDE.md` for detailed documentation.
