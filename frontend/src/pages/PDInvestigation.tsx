import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Droplets, ArrowLeft, Plus, Trash2, Save, Eye, FileText, Loader2 } from "lucide-react";
import { formatDateToDDMMYYYY, formatDateTimeDisplay } from '@/lib/dateUtils';
import { usePatientContext } from "@/context/PatientContext";
import { useToast } from "@/hooks/use-toast";

interface InvestigationParameter {
  id: string;
  name: string;
  unit: string;
  dataType: 'number' | 'text';
}

interface InvestigationData {
  patientId: string;
  patientName: string;
  dates: string[]; // Array of dates for columns
  values: Record<string, Record<string, string>>; // [parameterId][date] = value
  filledBy?: string;
}

interface SavedInvestigationSummary {
  id: number;
  patientId: string;
  patientName: string;
  dates: string[];
  values: Record<string, Record<string, string>>;
  filledBy?: string;
  createdAt: string;
  updatedAt: string;
}

const INVESTIGATION_PARAMETERS: InvestigationParameter[] = [
  { id: 'sCreatinine', name: 'S. Creatinine', unit: 'µmol/L', dataType: 'number' },
  { id: 'bu', name: 'BU', unit: '', dataType: 'number' },
  { id: 'hemoglobin', name: 'Hemoglobin', unit: 'g/dL', dataType: 'number' },
  { id: 'seSodium', name: 'SE-sodium', unit: 'mmol/L', dataType: 'number' },
  { id: 'potassium', name: 'Potassium', unit: 'mmol/L', dataType: 'number' },
  { id: 'calcium', name: 'Calcium', unit: 'mmol/L', dataType: 'number' },
  { id: 'phosphate', name: 'Phosphate', unit: 'mmol/L', dataType: 'number' },
  { id: 'uricAcid', name: 'Uric acid', unit: 'mg/dL', dataType: 'number' },
  { id: 'bicarbonate', name: 'Bicarbonate', unit: 'mmol/L', dataType: 'number' },
  { id: 'albumin', name: 'Albumin', unit: 'g/L', dataType: 'number' },
  { id: 'hba1c', name: 'HbA1c', unit: '%', dataType: 'number' },
  { id: 'sChloride', name: 'S. Chloride', unit: '', dataType: 'number' },
  { id: 'fbs', name: 'FBS', unit: '', dataType: 'number' },
  { id: 'ppbs', name: 'PPBS', unit: '', dataType: 'number' },
  { id: 'sFerritin', name: 'S. Ferritin', unit: '', dataType: 'number' },
  { id: 'tsat', name: 'TSAT', unit: '', dataType: 'number' },
  { id: 'plt', name: 'PLT', unit: '', dataType: 'number' },
  { id: 'pth', name: 'PTH', unit: '', dataType: 'number' },
  { id: 'lipidProfile', name: 'Lipid Profile', unit: '', dataType: 'text' },
  { id: 'aptt', name: 'APTT', unit: '', dataType: 'number' },
  { id: 'capdCulture', name: 'CAPD culture', unit: '', dataType: 'text' },
  { id: 'bloodCulture', name: 'Blood Culture', unit: '', dataType: 'text' },
  { id: 'crp', name: 'CRP', unit: '', dataType: 'number' },
  { id: 'abd', name: 'Abd', unit: '', dataType: 'text' },
];

const PDInvestigation = () => {
  const navigate = useNavigate();
  const { patient, globalPatient } = usePatientContext();
  const { toast } = useToast();
  
  const patientId = patient?.phn || globalPatient?.phn || "";
  const patientName = patient?.name || globalPatient?.name || "";
  
  const [dates, setDates] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [filledBy, setFilledBy] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedSummaries, setSavedSummaries] = useState<SavedInvestigationSummary[]>([]);
  const [viewMode, setViewMode] = useState<"form" | "list" | "view">("list");
  const [selectedSummary, setSelectedSummary] = useState<SavedInvestigationSummary | null>(null);

  const addDateColumn = () => {
    const newDate = new Date().toISOString().split('T')[0];
    setDates([...dates, newDate]);
  };

  const removeDateColumn = (index: number) => {
    const newDates = dates.filter((_, i) => i !== index);
    setDates(newDates);
    
    // Remove values for this date
    const newValues = { ...values };
    Object.keys(newValues).forEach(paramId => {
      const dateKey = dates[index];
      if (newValues[paramId][dateKey]) {
        delete newValues[paramId][dateKey];
      }
    });
    setValues(newValues);
  };

  const updateDate = (index: number, newDate: string) => {
    const oldDate = dates[index];
    const newDates = [...dates];
    newDates[index] = newDate;
    setDates(newDates);

    // Update values with new date key
    const newValues = { ...values };
    Object.keys(newValues).forEach(paramId => {
      if (newValues[paramId][oldDate]) {
        newValues[paramId] = {
          ...newValues[paramId],
          [newDate]: newValues[paramId][oldDate],
        };
        delete newValues[paramId][oldDate];
      }
    });
    setValues(newValues);
  };

  const updateValue = (paramId: string, date: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [paramId]: {
        ...prev[paramId],
        [date]: value,
      },
    }));
  };

  const getValue = (paramId: string, date: string): string => {
    return values[paramId]?.[date] || '';
  };

  const fetchSavedSummaries = async () => {
    if (!patientId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/pd-investigation/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setSavedSummaries(data);
      } else {
        console.error("Failed to fetch investigation summaries");
      }
    } catch (error) {
      console.error("Error fetching investigation summaries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch saved summaries
  useEffect(() => {
    if (patientId) {
      fetchSavedSummaries();
    } else {
      setSavedSummaries([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId) {
      toast({
        title: 'Patient Not Selected',
        description: 'Please search for a patient by PHN first before saving investigation summary.',
        variant: 'destructive',
      });
      return;
    }

    if (dates.length === 0) {
      toast({
        title: 'No Data',
        description: 'Please add at least one date column before saving.',
        variant: 'destructive',
      });
      return;
    }

    if (!filledBy.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter who filled out this form.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const formData: InvestigationData = {
        patientId,
        patientName,
        dates,
        values,
        filledBy,
      };

      const response = await fetch(`http://localhost:8081/api/pd-investigation/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Investigation summary saved successfully.',
        });
        // Reset form
        setDates([]);
        setValues({});
        setFilledBy("");
        // Refresh saved summaries
        await fetchSavedSummaries();
        setViewMode("list");
      } else {
        throw new Error('Failed to save investigation summary');
      }
    } catch (error) {
      console.error("Error saving investigation summary:", error);
      toast({
        title: 'Error',
        description: 'Failed to save investigation summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewSummary = (summary: SavedInvestigationSummary) => {
    setSelectedSummary(summary);
    setViewMode("view");
  };

  const handleLoadSummary = (summary: SavedInvestigationSummary) => {
    setDates(summary.dates);
    setValues(summary.values);
    setFilledBy(summary.filledBy || "");
    setViewMode("form");
    toast({
      title: 'Loaded',
      description: 'Investigation summary loaded. You can edit and save as a new record.',
    });
  };

  const handleDeleteSummary = async (summary: SavedInvestigationSummary) => {
    if (!window.confirm(`Are you sure you want to delete Investigation Summary #${summary.id}?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/pd-investigation/record/${summary.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Investigation summary deleted successfully.',
        });
        // Refresh the list
        await fetchSavedSummaries();
        // If we're viewing the deleted summary, go back to list
        if (selectedSummary?.id === summary.id) {
          setViewMode("list");
          setSelectedSummary(null);
        }
      } else {
        throw new Error('Failed to delete investigation summary');
      }
    } catch (error) {
      console.error("Error deleting investigation summary:", error);
      toast({
        title: 'Error',
        description: 'Failed to delete investigation summary. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Render saved summaries list
  const renderSavedSummariesList = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading saved summaries...</span>
        </div>
      );
    }

    if (savedSummaries.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No saved investigation summaries found for this patient.</p>
          <p className="text-sm mt-2">Click "New Investigation Summary" to create one.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {savedSummaries.map((summary) => (
          <Card key={summary.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">Investigation Summary #{summary.id}</h3>
                    <span className="text-sm text-muted-foreground">
                      ({summary.dates.length} date{summary.dates.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Patient: {summary.patientName} (PHN: {summary.patientId})</p>
                    <p>Created: {formatDateTimeDisplay(summary.createdAt)}</p>
                    {summary.filledBy && <p>Filled by: {summary.filledBy}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSummary(summary)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadSummary(summary)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSummary(summary)}
                    className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render view mode for selected summary
  const renderViewSummary = () => {
    if (!selectedSummary) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Investigation Summary #{selectedSummary.id}</h2>
            <p className="text-muted-foreground">
              Patient: {selectedSummary.patientName} (PHN: {selectedSummary.patientId})
            </p>
            <p className="text-sm text-muted-foreground">Created: {formatDateTimeDisplay(selectedSummary.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleDeleteSummary(selectedSummary)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode("list")}
            >
              Back to List
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[200px] font-semibold">
                  Investigation
                </TableHead>
                <TableHead className="min-w-[100px] font-semibold">Unit</TableHead>
                {selectedSummary.dates.map((date) => (
                  <TableHead key={date} className="min-w-[150px]">
                      {formatDateToDDMMYYYY(date)}
                    </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVESTIGATION_PARAMETERS.map((param) => (
                <TableRow key={param.id}>
                  <TableCell className="sticky left-0 bg-background z-10 font-medium">
                    {param.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {param.unit || '-'}
                  </TableCell>
                  {selectedSummary.dates.map((date) => (
                    <TableCell key={date}>
                      {selectedSummary.values[param.id]?.[date] || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // Render form mode
  const renderForm = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enter Investigation Results</CardTitle>
          <CardDescription>
            Fill in the monthly investigation summary for Peritoneal Dialysis patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Info Display */}
            {patientId ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <span className="font-semibold">Patient:</span>
                  <span>{patientName} (PHN: {patientId})</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-amber-700 dark:text-amber-300">
                  ⚠️ Please search for a patient by PHN using the global search bar to begin.
                </p>
              </div>
            )}

            {/* Filled By Input */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="filledBy">Filled By</Label>
              <Input
                id="filledBy"
                value={filledBy}
                onChange={(e) => setFilledBy(e.target.value)}
                placeholder="Enter name of person who filled this form"
                required
              />
            </div>

            {/* Date Columns Management */}
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={addDateColumn}
                className="flex items-center gap-2"
                disabled={!patientId}
              >
                <Plus className="h-4 w-4" />
                Add Date Column
              </Button>
              {dates.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {dates.length} date column{dates.length !== 1 ? 's' : ''} added
                </span>
              )}
            </div>

            {/* Investigation Summary Table */}
            {dates.length > 0 && (
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 min-w-[200px] font-semibold">
                        Investigation
                      </TableHead>
                      <TableHead className="min-w-[100px] font-semibold">Unit</TableHead>
                      {dates.map((date, index) => (
                        <TableHead key={index} className="min-w-[180px]">
                          <div className="flex flex-col gap-2">
                            <Input
                              type="date"
                              value={date}
                              onChange={(e) => updateDate(index, e.target.value)}
                              className="h-8 text-xs"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDateColumn(index)}
                              className="h-6 text-xs text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {INVESTIGATION_PARAMETERS.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell className="sticky left-0 bg-background z-10 font-medium">
                          {param.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {param.unit || '-'}
                        </TableCell>
                        {dates.map((date) => (
                          <TableCell key={date}>
                            <Input
                              type={param.dataType === 'number' ? 'number' : 'text'}
                              value={getValue(param.id, date)}
                              onChange={(e) => updateValue(param.id, date, e.target.value)}
                              placeholder={param.unit ? `Enter ${param.unit}` : 'Enter value'}
                              className="h-9 w-full"
                              step={param.dataType === 'number' ? 'any' : undefined}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {dates.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Click "Add Date Column" to start entering investigation results</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setViewMode("list");
                  setDates([]);
                  setValues({});
                  setFilledBy("");
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 flex items-center gap-2"
                disabled={dates.length === 0 || !patientId || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Investigation Summary
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-[95vw] mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/investigation")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Monthly Investigation Summary - Peritoneal Dialysis</h1>
        </div>
      </div>

      {/* Mode Toggle */}
      {viewMode !== "view" && (
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Saved Summaries
          </Button>
          <Button
            variant={viewMode === "form" ? "default" : "outline"}
            onClick={() => {
              setViewMode("form");
              setDates([]);
              setValues({});
              setFilledBy("");
            }}
            disabled={!patientId}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Investigation Summary
          </Button>
        </div>
      )}

      {/* Content based on mode */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Investigation Summaries</CardTitle>
            <CardDescription>
              {patientId 
                ? `View and manage investigation summaries for ${patientName} (PHN: ${patientId})`
                : "Please search for a patient by PHN to view their investigation summaries"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderSavedSummariesList()}
          </CardContent>
        </Card>
      )}

      {viewMode === "view" && renderViewSummary()}
      {viewMode === "form" && renderForm()}
    </div>
  );
};

export default PDInvestigation;
