import { useState, useCallback, useEffect } from 'react';

/**
 * Session History Storage Hook
 * Provides clean, type-safe session history management for hemodialysis records
 * Persists to browser localStorage with JSON serialization
 */

export interface SessionHistoryEntry {
  id: string; // UUID or timestamp-based ID
  patientId: string;
  sessionDate: string; // ISO date string
  data: Record<string, any>; // Session form data
  savedAt: string; // ISO timestamp
  status: 'draft' | 'submitted' | 'synced'; // Draft/submitted/synced to backend
}

const STORAGE_KEY = 'hd_session_history';
const MAX_HISTORY_ENTRIES = 50; // Keep last 50 drafts per patient

export const useSessionHistory = (patientId: string) => {
  const [history, setHistory] = useState<SessionHistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    loadHistory();
  }, [patientId]);

  /**
   * Load all history entries for the current patient
   */
  const loadHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allHistory: SessionHistoryEntry[] = JSON.parse(stored);
        const patientHistory = allHistory.filter((entry) => entry.patientId === patientId);
        setHistory(patientHistory);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load session history:', error);
      setIsLoaded(true);
    }
  }, [patientId]);

  /**
   * Save a new session entry (draft)
   */
  const saveDraft = useCallback((sessionData: Record<string, any>, sessionDate: string) => {
    const newEntry: SessionHistoryEntry = {
      id: `${patientId}_${Date.now()}`,
      patientId,
      sessionDate,
      data: sessionData,
      savedAt: new Date().toISOString(),
      status: 'draft',
    };

    try {
      // Get all stored history
      const stored = localStorage.getItem(STORAGE_KEY);
      let allHistory: SessionHistoryEntry[] = stored ? JSON.parse(stored) : [];

      // Add new entry
      allHistory.push(newEntry);

      // Remove old entries for this patient (keep only MAX_HISTORY_ENTRIES)
      const patientHistory = allHistory.filter((e) => e.patientId === patientId);
      if (patientHistory.length > MAX_HISTORY_ENTRIES) {
        const toRemove = patientHistory
          .sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime())
          .slice(0, patientHistory.length - MAX_HISTORY_ENTRIES)
          .map((e) => e.id);
        allHistory = allHistory.filter((e) => !toRemove.includes(e.id));
      }

      // Save back to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
      setHistory(allHistory.filter((e) => e.patientId === patientId));

      return newEntry;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return null;
    }
  }, [patientId]);

  /**
   * Mark an entry as submitted (backend confirmed)
   */
  const markAsSubmitted = useCallback((entryId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const allHistory: SessionHistoryEntry[] = JSON.parse(stored);
      const entry = allHistory.find((e) => e.id === entryId);
      if (entry) {
        entry.status = 'submitted';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
        setHistory(allHistory.filter((e) => e.patientId === patientId));
      }
    } catch (error) {
      console.error('Failed to mark as submitted:', error);
    }
  }, [patientId]);

  /**
   * Mark an entry as synced (backend persisted)
   */
  const markAsSynced = useCallback((entryId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const allHistory: SessionHistoryEntry[] = JSON.parse(stored);
      const entry = allHistory.find((e) => e.id === entryId);
      if (entry) {
        entry.status = 'synced';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
        setHistory(allHistory.filter((e) => e.patientId === patientId));
      }
    } catch (error) {
      console.error('Failed to mark as synced:', error);
    }
  }, [patientId]);

  /**
   * Get a specific session entry
   */
  const getEntry = useCallback((entryId: string) => {
    return history.find((e) => e.id === entryId);
  }, [history]);

  /**
   * Get the latest draft for a session date
   */
  const getLatestDraft = useCallback((sessionDate: string) => {
    return history
      .filter((e) => e.sessionDate === sessionDate && e.status === 'draft')
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())[0];
  }, [history]);

  /**
   * Get all drafts (not submitted)
   */
  const getDrafts = useCallback(() => {
    return history.filter((e) => e.status === 'draft');
  }, [history]);

  /**
   * Get all synced entries (submitted to backend)
   */
  const getSynced = useCallback(() => {
    return history.filter((e) => e.status === 'synced');
  }, [history]);

  /**
   * Delete a specific entry
   */
  const deleteEntry = useCallback((entryId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const allHistory: SessionHistoryEntry[] = JSON.parse(stored);
      const filtered = allHistory.filter((e) => e.id !== entryId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setHistory(filtered.filter((e) => e.patientId === patientId));
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  }, [patientId]);

  /**
   * Clear all history for the current patient
   */
  const clearHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const allHistory: SessionHistoryEntry[] = JSON.parse(stored);
      const filtered = allHistory.filter((e) => e.patientId !== patientId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, [patientId]);

  return {
    history,
    isLoaded,
    saveDraft,
    markAsSubmitted,
    markAsSynced,
    getEntry,
    getLatestDraft,
    getDrafts,
    getSynced,
    deleteEntry,
    clearHistory,
  };
};
