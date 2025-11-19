import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, RefreshCw, Notebook } from 'lucide-react';
import { usePatientContext } from '@/context/PatientContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { hdMonthlyReviewApi } from '@/services/hdMonthlyReviewApi';

interface HDMonthlyReviewProps {
  onBack: () => void;
}

const HDMonthlyReview: React.FC<HDMonthlyReviewProps> = ({ onBack }) => {
  const { patient, globalPatient } = usePatientContext();
  const currentPatient = globalPatient || patient;
  const phn = currentPatient?.phn;
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (phn) loadAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phn]);

  const loadAssessments = async () => {
    if (!phn) return;
    setLoading(true);
    try {
      const data: any = await hdMonthlyReviewApi.list(phn);
      setSaved(data || []);
    } catch (e) {
      console.error('Error loading HD monthly reviews', e);
      toast({ title: 'Load failed', description: 'Could not load monthly reviews', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phn) {
      toast({ title: 'No patient selected', description: 'Please select a patient first', variant: 'destructive' });
      return;
    }
    if (!date) {
      toast({ title: 'Date required', description: 'Please select a date for this note', variant: 'destructive' });
      return;
    }
    if (!notes.trim()) {
      toast({ title: 'Note required', description: 'Please enter a note', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      // Map form fields to HemodialysisMonthlyReviewDto
      const dto = {
        reviewDate: date,
        doctorNotes: notes,
        exitSiteCondition: '',
        residualUrineOutput: '',
        clinicalAssessment: notes,
      };
      if (editingId) {
        await hdMonthlyReviewApi.update(phn, editingId, dto);
        toast({ title: 'Updated', description: 'Monthly review updated', variant: 'default' });
      } else {
        await hdMonthlyReviewApi.create(phn, dto);
        toast({ title: 'Saved', description: 'Monthly review saved', variant: 'default' });
      }
      await loadAssessments();
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      setEditingId(null);
    } catch (e) {
      console.error('Save failed', e);
      toast({ title: 'Save failed', description: 'Could not save review', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    try {
      await hdMonthlyReviewApi.remove(phn!, id);
      await loadAssessments();
      toast({ title: 'Deleted', description: 'Review deleted', variant: 'default' });
    } catch (e) {
      console.error('Delete failed', e);
      toast({ title: 'Delete failed', description: 'Could not delete review', variant: 'destructive' });
    }
  };

  const handleEdit = async (id: number) => {
    try {
      // monthly assessment doesn't have a single-get endpoint; find in saved list
      const item = (saved || []).find((s: any) => String(s.id) === String(id) || s.id === id);
      if (item) {
        setEditingId(id);
        setDate(item.reviewDate || item.date || new Date().toISOString().split('T')[0]);
        setNotes(item.doctorNotes || item.notes || '');
        if (!showSaved) setShowSaved(true);
      } else {
        // fallback: reload list and try again
        await loadAssessments();
        const it = (saved || []).find((s: any) => String(s.id) === String(id) || s.id === id);
        if (it) {
          setEditingId(id);
          setDate(it.reviewDate || it.date || new Date().toISOString().split('T')[0]);
          setNotes(it.doctorNotes || it.notes || '');
          if (!showSaved) setShowSaved(true);
        } else {
          toast({ title: 'Not found', description: 'Could not locate review for editing', variant: 'destructive' });
        }
      }
    } catch (e) {
      console.error('Failed to load item for edit', e);
      toast({ title: 'Load failed', description: 'Could not load note for editing', variant: 'destructive' });
    }
  };

  const filtered = saved.filter((s: any) => {
    const matchesDate = filterDate ? (s.reviewDate || '').startsWith(filterDate) : true;
    const matchesTerm = searchTerm ? (s.doctorNotes || '').toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesDate && matchesTerm;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Doctor's Notes</h1>
          <p className="text-sm text-muted-foreground">Manage clinical notes and observations for hemodialysis patients</p>
        </div>
        <div className="flex items-center gap-3">
          {currentPatient?.phn && (
            <div className="text-sm text-blue-700 bg-blue-50 px-4 py-2 rounded border border-blue-200">
              <strong>Patient:</strong> {currentPatient.name} (PHN: {currentPatient.phn})
            </div>
          )}
          <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">Back</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Note
            </CardTitle>
            <div className="text-sm text-muted-foreground">Create a new follow-up note for the patient</div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Doctor's Note</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} placeholder="Enter clinical findings, assessment, and plan..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>Save Note</Button>
                <Button variant="outline" onClick={() => { setNotes(''); setDate(new Date().toISOString().split('T')[0]); }} className="flex-1">Clear</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="flex items-center gap-2"><Notebook className="w-5 h-5" />Saved Notes</CardTitle>
                <div className="text-sm text-muted-foreground">View and filter saved follow-up notes</div>
              </div>
            <div className="flex items-center gap-2">
              <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="h-8" />
              <Input placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8" />
              <Button variant="outline" size="sm" onClick={() => { setShowSaved((s) => { const next = !s; if (next && phn) loadAssessments(); return next; }); }}>
                {showSaved ? 'Hide' : 'Show'}
              </Button>
              {showSaved && (
                <Button variant="outline" size="sm" onClick={loadAssessments}><RefreshCw className="w-4 h-4 mr-2"/>Refresh</Button>
              )}
            </div>
            </div>
          </CardHeader>
          <CardContent>
            {!showSaved ? (
              <div className="text-sm text-muted-foreground">Saved notes are hidden. Click <strong>Show</strong> to view saved follow-up notes for this patient.</div>
            ) : (
              (loading ? (
                <p>Loading...</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">{saved.length === 0 ? 'No follow-up notes saved yet.' : 'No notes match your filters.'}</p>
              ) : (
                <div className="space-y-3">
                  {filtered.map((fu: any) => (
                    <div key={fu.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="text-sm text-slate-600 font-medium">{fu.reviewDate || fu.date}</div>
                          <div className="mt-2 text-slate-800 whitespace-pre-wrap">{fu.doctorNotes || fu.notes}</div>
                        </div>
                        <div className="flex flex-col gap-2 text-right">
                          <div className="text-xs text-slate-500">ID: {fu.id}</div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/investigation/monthly-review/${fu.id}?patient=${phn}`)}>Review Investigations</Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(fu.id)}>Edit</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(fu.id)}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HDMonthlyReview;
