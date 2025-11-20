/**
 * Session History Utilities
 * Clean utility functions for managing HD session history with backend sync
 */

import { SessionHistoryEntry } from '@/hooks/useSessionHistory';
import { createHemodialysisRecord } from '@/services/hemodialysisApi';

/**
 * Interface for session data before saving
 */
export interface SessionDataToPersist {
  patientId: string;
  sessionDate: string;
  prescription: Record<string, any>;
  vascularAccess: Record<string, any>;
  session: Record<string, any>;
  otherNotes?: string;
  filledBy?: string;
}

/**
 * Save session draft to local history
 * @param entry - The session history entry to save
 */
export const saveDraftLocally = (entry: SessionHistoryEntry): void => {
  const STORAGE_KEY = 'hd_session_history';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allHistory: SessionHistoryEntry[] = stored ? JSON.parse(stored) : [];

    // Check if entry already exists and update it
    const existingIndex = allHistory.findIndex((e) => e.id === entry.id);
    if (existingIndex >= 0) {
      allHistory[existingIndex] = entry;
    } else {
      allHistory.push(entry);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
  } catch (error) {
    console.error('Failed to save draft locally:', error);
  }
};

/**
 * Submit session to backend and update status
 * @param entry - The session history entry to submit
 * @param onSuccess - Callback on successful submission
 * @param onError - Callback on error
 */
export const submitSessionToBackend = async (
  entry: SessionHistoryEntry,
  onSuccess: (updatedEntry: SessionHistoryEntry) => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    const payload = {
      ...entry.data,
      patientId: entry.patientId,
      hemoDialysisSessionDate: entry.sessionDate,
    };

    // Send to backend
    const result = await createHemodialysisRecord(entry.patientId, payload);

    if (result) {
      // Mark as synced
      const updatedEntry: SessionHistoryEntry = {
        ...entry,
        status: 'synced',
        savedAt: new Date().toISOString(),
      };
      saveDraftLocally(updatedEntry);
      onSuccess(updatedEntry);
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to submit session');
    onError(err);
  }
};

/**
 * Batch submit multiple sessions
 */
export const batchSubmitSessions = async (
  entries: SessionHistoryEntry[],
  onProgress?: (completed: number, total: number) => void,
  onError?: (error: Error, entryId: string) => void
): Promise<SessionHistoryEntry[]> => {
  const results: SessionHistoryEntry[] = [];

  for (let i = 0; i < entries.length; i++) {
    try {
      await new Promise<void>((resolve, reject) => {
        submitSessionToBackend(
          entries[i],
          (updated) => {
            results.push(updated);
            onProgress?.(i + 1, entries.length);
            resolve();
          },
          (error) => {
            onError?.(error, entries[i].id);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error(`Failed to submit session ${entries[i].id}:`, error);
      continue; // Continue with next entry
    }
  }

  return results;
};

/**
 * Export session history to JSON file (for backup/sharing)
 */
export const exportSessionHistory = (entries: SessionHistoryEntry[], filename?: string): void => {
  const data = JSON.stringify(entries, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `session_history_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Import session history from JSON file
 */
export const importSessionHistory = (file: File): Promise<SessionHistoryEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          resolve(data);
        } else {
          reject(new Error('Invalid session history file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Get summary statistics of session history
 */
export interface HistorySummary {
  total: number;
  drafts: number;
  submitted: number;
  synced: number;
  dateRange?: {
    earliest?: string;
    latest?: string;
  };
  avgDuration?: number;
}

export const getHistorySummary = (entries: SessionHistoryEntry[]): HistorySummary => {
  const drafts = entries.filter((e) => e.status === 'draft').length;
  const submitted = entries.filter((e) => e.status === 'submitted').length;
  const synced = entries.filter((e) => e.status === 'synced').length;

  const dates = entries
    .map((e) => new Date(e.sessionDate).getTime())
    .sort((a, b) => a - b);

  const durations = entries
    .filter((e) => e.data?.session?.durationMinutes)
    .map((e) => e.data.session.durationMinutes);
  const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : undefined;

  return {
    total: entries.length,
    drafts,
    submitted,
    synced,
    dateRange: {
      earliest: dates.length > 0 ? new Date(dates[0]).toISOString() : undefined,
      latest: dates.length > 0 ? new Date(dates[dates.length - 1]).toISOString() : undefined,
    },
    avgDuration: avgDuration ? Math.round(avgDuration * 10) / 10 : undefined,
  };
};

/**
 * Clean old entries (older than N days)
 */
export const cleanOldEntries = (entries: SessionHistoryEntry[], daysToKeep: number = 90): SessionHistoryEntry[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  return entries.filter((e) => new Date(e.savedAt).getTime() > cutoffDate.getTime());
};
