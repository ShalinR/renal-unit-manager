# Hemodialysis Session History - Implementation Guide

## Overview

A clean, type-safe session history storage system for HD session forms with automatic draft persistence, backend sync, and recovery capabilities.

## Architecture

### Components

1. **`useSessionHistory` Hook** (`src/hooks/useSessionHistory.ts`)
   - React hook for managing session history state
   - Handles localStorage persistence
   - Provides clean API for CRUD operations

2. **`SessionHistoryView` Component** (`src/components/SessionHistoryView.tsx`)
   - Displays saved sessions with status badges
   - Actions: view, restore (drafts), delete
   - Color-coded by status (draft/submitted/synced)

3. **`sessionHistoryUtils` Utilities** (`src/lib/sessionHistoryUtils.ts`)
   - Backend sync functions
   - Export/import for backup
   - Statistics and cleanup utilities

## Data Model

```typescript
interface SessionHistoryEntry {
  id: string;                    // Unique identifier (patientId_timestamp)
  patientId: string;             // Patient PHN or ID
  sessionDate: string;           // ISO date (YYYY-MM-DD)
  data: Record<string, any>;     // Full session form data
  savedAt: string;               // ISO timestamp when saved
  status: 'draft' | 'submitted' | 'synced';
}
```

## Usage Examples

### In HDSessionForm Component

```typescript
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { submitSessionToBackend } from '@/lib/sessionHistoryUtils';
import SessionHistoryView from '@/components/SessionHistoryView';

const HDSessionForm = () => {
  const { patient } = usePatientContext();
  const { history, saveDraft, markAsSynced, deleteEntry, getLatestDraft } = 
    useSessionHistory(patient.phn);

  // Auto-save draft when form changes
  const handleFormChange = (formData) => {
    saveDraft(formData, new Date().toISOString().split('T')[0]);
  };

  // Submit to backend
  const handleSubmit = async (formData) => {
    const draft = saveDraft(formData, sessionDate);
    
    submitSessionToBackend(
      draft,
      (updated) => {
        markAsSynced(updated.id);
        toast({ title: 'Session saved successfully' });
      },
      (error) => {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    );
  };

  // Restore from draft
  const handleRestore = (entry) => {
    setFormData(entry.data);
  };

  return (
    <div>
      {/* Session form fields... */}
      <SessionHistoryView 
        entries={history}
        onRestore={handleRestore}
        onDelete={deleteEntry}
        onViewDetails={(entry) => showModal(entry.data)}
      />
    </div>
  );
};
```

## Features

### 1. Auto-Save Drafts
- Saves session form data to localStorage
- Triggered on form changes
- Preserves all session fields (prescription, access, vitals, etc.)

### 2. Session Status Tracking
- **Draft**: Local save only
- **Submitted**: Sent to backend
- **Synced**: Confirmed in database

### 3. Recovery & Restore
- Restore incomplete sessions from drafts
- View previous session details
- Prevent data loss on accidental navigation

### 4. Backend Integration
- `submitSessionToBackend()` - Send draft to API
- Automatic status update to 'synced'
- Error handling and retry logic

### 5. Data Export/Import
- Export session history to JSON
- Import for backup/migration
- Useful for data portability

### 6. History Cleanup
- Automatic limit: 50 entries per patient
- Manual cleanup utility for old entries (>90 days)
- Prevents localStorage bloat

## API Methods

### useSessionHistory Hook

```typescript
const {
  history,           // SessionHistoryEntry[]
  isLoaded,          // boolean
  saveDraft,         // (data, sessionDate) => SessionHistoryEntry | null
  markAsSubmitted,   // (entryId) => void
  markAsSynced,      // (entryId) => void
  getEntry,          // (entryId) => SessionHistoryEntry | undefined
  getLatestDraft,    // (sessionDate) => SessionHistoryEntry | undefined
  getDrafts,         // () => SessionHistoryEntry[]
  getSynced,         // () => SessionHistoryEntry[]
  deleteEntry,       // (entryId) => void
  clearHistory,      // () => void
} = useSessionHistory(patientId);
```

### Utility Functions

```typescript
// Submit session to backend
await submitSessionToBackend(entry, onSuccess, onError);

// Batch submit multiple sessions
const results = await batchSubmitSessions(entries, onProgress, onError);

// Export history
exportSessionHistory(entries, 'my_sessions.json');

// Import history
const imported = await importSessionHistory(file);

// Get summary stats
const summary = getHistorySummary(entries);
// Returns: { total, drafts, submitted, synced, dateRange, avgDuration }

// Clean old entries
const cleaned = cleanOldEntries(entries, 90); // Keep last 90 days
```

## Storage Details

- **Storage Key**: `hd_session_history`
- **Location**: Browser localStorage
- **Max Size**: ~50 entries per patient (configurable)
- **Format**: JSON

### Entry Size
- Typical session entry: ~2-5 KB (depending on hourly records)
- 50 entries per patient: ~100-250 KB (well within localStorage limits)

## Integration Steps

### Step 1: Add to HDSessionForm

```typescript
import { useSessionHistory } from '@/hooks/useSessionHistory';
import SessionHistoryView from '@/components/SessionHistoryView';

// In component
const { history, saveDraft, markAsSynced, deleteEntry } = 
  useSessionHistory(patient.phn);

// On form change
useEffect(() => {
  const timer = setTimeout(() => {
    saveDraft(formData, sessionDate);
  }, 1000); // Auto-save after 1s delay
  return () => clearTimeout(timer);
}, [formData, sessionDate, saveDraft]);
```

### Step 2: Add Submit Handler

```typescript
import { submitSessionToBackend } from '@/lib/sessionHistoryUtils';

const handleSubmit = async (formData) => {
  const draft = saveDraft(formData, sessionDate);
  
  submitSessionToBackend(
    draft,
    (updated) => {
      markAsSynced(updated.id);
      toast({ title: 'Success', description: 'Session saved' });
      navigateToDashboard();
    },
    (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  );
};
```

### Step 3: Add History View

```typescript
<SessionHistoryView 
  entries={history}
  onRestore={(entry) => setFormData(entry.data)}
  onDelete={deleteEntry}
  onViewDetails={(entry) => showDetailsModal(entry)}
/>
```

## Best Practices

1. **Auto-save with Debounce**: Avoid saving on every keystroke
   ```typescript
   const timer = setTimeout(() => saveDraft(...), 1000);
   ```

2. **Show Draft Status**: Indicate to user when draft is saved
   ```typescript
   <span className="text-sm text-gray-500">
     {lastSaved && `Draft saved at ${format(lastSaved, 'HH:mm')}`}
   </span>
   ```

3. **Batch Backend Calls**: For multiple drafts
   ```typescript
   const drafts = getDrafts();
   const results = await batchSubmitSessions(drafts);
   ```

4. **Regular Cleanup**: Keep storage lean
   ```typescript
   useEffect(() => {
     const cleaned = cleanOldEntries(history, 90);
     // Update history...
   }, []);
   ```

5. **Error Recovery**: Always have fallback
   ```typescript
   const latest = getLatestDraft(sessionDate) || defaultFormData;
   ```

## Storage Limits

- localStorage max: ~5-10 MB per domain
- Recommended: Keep <50 entries per patient
- Each entry: 2-5 KB (with hourly records)
- Total: 100-250 KB per patient (safe)

## Troubleshooting

### Entries Not Saving
- Check browser's localStorage quota
- Verify patientId matches exactly
- Check browser console for errors

### History Not Loading
- Wait for `isLoaded` to be true
- Verify localStorage format (must be valid JSON)
- Clear corrupted entries: `localStorage.removeItem('hd_session_history')`

### Storage Full
- Run `cleanOldEntries()` to remove old entries
- Reduce `MAX_HISTORY_ENTRIES` constant
- Export important sessions before cleanup

## Future Enhancements

1. **Cloud Backup**: Sync history to backend database
2. **Offline Support**: Service worker for offline persistence
3. **Search/Filter**: Find sessions by date, access type, etc.
4. **Comparison**: Compare two session records side-by-side
5. **Versioning**: Track changes within a session draft
