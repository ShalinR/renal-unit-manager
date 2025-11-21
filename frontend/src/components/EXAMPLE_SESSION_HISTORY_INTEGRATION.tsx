/**
 * EXAMPLE: How to integrate Session History into HDSessionForm
 * 
 * This is a reference implementation showing how to use the session history system.
 * Copy the relevant parts into your HDSessionForm component.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { submitSessionToBackend } from '@/lib/sessionHistoryUtils';
import SessionHistoryView from '@/components/SessionHistoryView';
import { usePatientContext } from '@/context/PatientContext';
import { useToast } from '@/hooks/use-toast';

// ==============================================================================
// PART 1: Add hooks to your component
// ==============================================================================

export const ExampleHDSessionFormIntegration = () => {
  const { patient } = usePatientContext();
  const { toast } = useToast();
  
  // Initialize session history hook
  const { 
    history, 
    saveDraft, 
    markAsSubmitted,
    markAsSynced, 
    deleteEntry,
    getLatestDraft 
  } = useSessionHistory(patient?.phn || '');

  // Your existing form state
  const [formData, setFormData] = useState<any>(null);
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ==============================================================================
  // PART 2: Auto-save draft on form changes (with debounce)
  // ==============================================================================

  useEffect(() => {
    if (!formData || !patient?.phn) return;

    // Debounce auto-save: wait 2 seconds after last change
    const autoSaveTimer = setTimeout(() => {
      setIsSaving(true);
      const entry = saveDraft(formData, sessionDate);
      if (entry) {
        setLastSavedTime(new Date());
        console.log('Draft auto-saved:', entry.id);
      }
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [formData, sessionDate, patient?.phn, saveDraft]);

  // ==============================================================================
  // PART 8: Optional - Load latest draft on component mount
  // ==============================================================================

  // Use this effect to restore the latest draft when user returns to the form
  useEffect(() => {
    if (!patient?.phn || formData) return; // Skip if already has data

    const latestDraft = getLatestDraft(sessionDate);
    if (latestDraft) {
      setFormData(latestDraft.data);
      setSessionDate(latestDraft.sessionDate);
      toast({
        title: 'Draft Restored',
        description: 'Previous draft has been loaded',
      });
    }
  }, [patient?.phn, sessionDate, getLatestDraft, toast]); // Only run when patient or date changes

  // ==============================================================================
  // PART 3: Handle form changes
  // ==============================================================================

  const handleFormChange = useCallback((updates: any) => {
    setFormData((prev: any) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // ==============================================================================
  // PART 4: Submit to backend
  // ==============================================================================

  const handleSubmit = async () => {
    if (!formData || !patient?.phn) {
      toast({ 
        title: 'Error', 
        description: 'Please complete the form and select a patient',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSaving(true);

      // First, save to local history
      const draftEntry = saveDraft(formData, sessionDate);
      if (!draftEntry) {
        throw new Error('Failed to save draft locally');
      }

      // Mark as submitted before sending to backend
      markAsSubmitted(draftEntry.id);

      // Then submit to backend
      await submitSessionToBackend(
        draftEntry,
        (updatedEntry) => {
          // Backend confirmed the save
          markAsSynced(updatedEntry.id);
          
          toast({
            title: 'Success',
            description: 'Session saved successfully',
          });

          // Clear form and redirect
          setFormData(null);
          setSessionDate(new Date().toISOString().split('T')[0]);
          // Navigate to dashboard or next page
        },
        (error) => {
          toast({
            title: 'Error',
            description: `Failed to save: ${error.message}`,
            variant: 'destructive',
          });
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ==============================================================================
  // PART 5: Restore from draft
  // ==============================================================================

  const handleRestoreDraft = (entry: any) => {
    setFormData(entry.data);
    setSessionDate(entry.sessionDate);
    
    toast({
      title: 'Draft Restored',
      description: 'Session data has been restored from draft',
    });
  };

  // ==============================================================================
  // PART 6: View full form data and history
  // ==============================================================================

  const handleViewSessionDetails = (entry: any) => {
    // Open a modal or preview page showing the entry's data
    console.log('View details for:', entry);
    // You can show a modal here with the entry.data
  };

  // ==============================================================================
  // PART 7: Render the component
  // ==============================================================================

  return (
    <div className="space-y-6">
      {/* Your existing form UI */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">HD Session Form</h2>

        {/* Patient info */}
        {patient && (
          <div className="text-sm text-gray-600">
            <p><strong>Patient:</strong> {patient.name} (PHN: {patient.phn})</p>
          </div>
        )}

        {/* Session date */}
        <div>
          <label className="text-sm font-semibold">Session Date</label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Show draft saved indicator */}
        {lastSavedTime && !isSaving && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
            Draft saved at {lastSavedTime.toLocaleTimeString()}
          </div>
        )}
        {isSaving && (
          <div className="text-xs text-blue-600 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Saving draft...
          </div>
        )}

        {/* Your form fields here */}
        {/* <PrescriptionSection onChange={handleFormChange} /> */}
        {/* <SessionSection onChange={handleFormChange} /> */}
        {/* etc. */}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isSaving || !formData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Submit Session'}
        </button>
      </div>

      {/* Session History View - Shows all saved sessions */}
      <SessionHistoryView
        entries={history}
        onRestore={handleRestoreDraft}
        onDelete={deleteEntry}
        onViewDetails={handleViewSessionDetails}
      />
    </div>
  );
};

// ==============================================================================
// BENEFITS OF THIS APPROACH:
// ==============================================================================

/*
1. ✅ AUTO-SAVE
   - Saves every 2 seconds while user types
   - Prevents data loss on accidental navigation
   - Shows visual indicator

2. ✅ DRAFT RECOVERY
   - Restore incomplete sessions
   - View history of all attempts
   - Keep up to 50 drafts per patient

3. ✅ BACKEND SYNC
   - Seamless integration with API
   - Automatic status tracking (draft → synced)
   - Error handling with user feedback

4. ✅ CLEAN STATE MANAGEMENT
   - Single hook manages all persistence
   - No manual localStorage calls
   - Type-safe interface

5. ✅ USER EXPERIENCE
   - Visual feedback (saving indicator)
   - One-click restore from history
   - Session preview/details view
   - Timestamp tracking

6. ✅ SCALABILITY
   - Handles 50+ sessions per patient
   - Efficient localStorage usage
   - Ready for cloud backup
*/
