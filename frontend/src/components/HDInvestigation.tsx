import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, RefreshCw, Beaker } from 'lucide-react';
import { usePatientContext } from '@/context/PatientContext';
import { useToast } from '@/hooks/use-toast';
import {
  getHemodialysisInvestigations,
  createHemodialysisInvestigation,
  updateHemodialysisInvestigation,
  deleteHemodialysisInvestigation,
} from '@/services/hdInvestigationApi';
import {
  getInvestigationsByMonthlyReview,
  createInvestigationForMonthlyReview,
  updateInvestigationByMonthlyReview,
  deleteInvestigationByMonthlyReview,
} from '@/services/hdMonthlyReviewInvestigationApi';
import { hdMonthlyReviewApi } from '@/services/hdMonthlyReviewApi';

interface HDInvestigationProps {
  onBack: () => void;
  monthlyReviewId?: number;
}

const HDInvestigation: React.FC<HDInvestigationProps> = ({ onBack, monthlyReviewId: propMonthlyReviewId }) => {
  const { patient, globalPatient } = usePatientContext();
  const [searchParams] = useSearchParams();
  const { monthlyReviewId: routeMonthlyReviewId } = useParams<{ monthlyReviewId?: string }>();
  const currentPatient = globalPatient || patient;
  const phn = currentPatient?.phn;
  
  // Get monthlyReviewId from props, route params, or URL params (in priority order)
  const monthlyReviewId = propMonthlyReviewId || (routeMonthlyReviewId ? parseInt(routeMonthlyReviewId) : null) || (searchParams.get('monthlyReviewId') ? parseInt(searchParams.get('monthlyReviewId')!) : null);
  const isMonthlyReviewMode = !!monthlyReviewId;
  
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [monthlyReviewDetails, setMonthlyReviewDetails] = useState<any>(null);
  const { toast } = useToast();

  // Form state for blood tests
  const [investigationDate, setInvestigationDate] = useState<string>('');
  const [hemoglobin, setHemoglobin] = useState('');
  const [hematocrit, setHematocrit] = useState('');
  const [whiteBloodCells, setWhiteBloodCells] = useState('');
  const [platelets, setPlatelets] = useState('');
  const [urea, setUrea] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [sodium, setSodium] = useState('');
  const [potassium, setPotassium] = useState('');
  const [chloride, setChloride] = useState('');
  const [bicarbonate, setBicarbonate] = useState('');
  const [calcium, setCalcium] = useState('');
  const [phosphate, setPhosphate] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [totalProtein, setTotalProtein] = useState('');
  const [alkalinePhosphatase, setAlkalinePhosphatase] = useState('');
  const [alanineAminotransferase, setAlanineAminotransferase] = useState('');
  const [aspartateAminotransferase, setAspartateAminotransferase] = useState('');

  // Blood gas analysis
  const [pH, setPH] = useState('');
  const [pco2, setPco2] = useState('');
  const [po2, setPo2] = useState('');
  const [bicarbonateBloodGas, setBicarbonateBloodGas] = useState('');

  // Urine tests
  const [urineAppearance, setUrineAppearance] = useState('');
  const [urinePH, setUrinePH] = useState('');
  const [urineSpecificGravity, setUrineSpecificGravity] = useState('');
  const [urineProtein, setUrineProtein] = useState(false);
  const [urineGlucose, setUrineGlucose] = useState(false);
  const [urineKetones, setUrineKetones] = useState(false);
  const [urineBilirubin, setUrineBilirubin] = useState(false);
  const [urineBlood, setUrineBlood] = useState(false);
  const [urineNitrites, setUrineNitrites] = useState(false);
  const [whiteBloodCellsUrine, setWhiteBloodCellsUrine] = useState('');
  const [redBloodCellsUrine, setRedBloodCellsUrine] = useState('');

  // Imaging and other tests
  const [abdominalUltrasound, setAbdominalUltrasound] = useState('');
  const [chestXray, setChestXray] = useState('');
  const [ecg, setEcg] = useState('');
  const [otherTests, setOtherTests] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [performedBy, setPerformedBy] = useState('');

  // Initialize investigation date based on mode
  useEffect(() => {
    if (!investigationDate) {
      const defaultDate = new Date().toISOString().split('T')[0];
      setInvestigationDate(defaultDate);
    }
  }, [investigationDate]);

  useEffect(() => {
    if (isMonthlyReviewMode && monthlyReviewId && phn) {
      // Load monthly review details to get the review date
      const loadMonthlyReviewDetails = async () => {
        try {
          const details = await hdMonthlyReviewApi.get(phn, monthlyReviewId);
          console.log('Monthly review details loaded:', details);
          setMonthlyReviewDetails(details);
          // Auto-set investigation date to the monthly review date
          if (details?.reviewDate) {
            console.log('Setting investigation date to:', details.reviewDate);
            setInvestigationDate(details.reviewDate);
          }
        } catch (e) {
          console.error('Error loading monthly review details', e);
        }
      };
      loadMonthlyReviewDetails();
      loadInvestigations();
    } else if (phn) {
      loadInvestigations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phn, monthlyReviewId, isMonthlyReviewMode]);

  // Additional effect to ensure date is set when monthlyReviewDetails changes
  useEffect(() => {
    if (isMonthlyReviewMode && monthlyReviewDetails?.reviewDate && !editingId) {
      console.log('Syncing investigation date to monthly review date:', monthlyReviewDetails.reviewDate);
      setInvestigationDate(monthlyReviewDetails.reviewDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyReviewDetails]);

  const loadInvestigations = async () => {
    setLoading(true);
    try {
      let data;
      if (isMonthlyReviewMode && monthlyReviewId) {
        data = await getInvestigationsByMonthlyReview(monthlyReviewId);
      } else if (phn) {
        data = await getHemodialysisInvestigations(phn);
      } else {
        return;
      }
      setSaved(data || []);
    } catch (e) {
      console.error('Error loading HD investigations', e);
      toast({ title: 'Load failed', description: 'Could not load investigations', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    // If in monthly review mode, use the review date; otherwise use today
    const defaultDate = isMonthlyReviewMode && monthlyReviewDetails?.reviewDate 
      ? monthlyReviewDetails.reviewDate 
      : new Date().toISOString().split('T')[0];
    setInvestigationDate(defaultDate);
    setHemoglobin('');
    setHematocrit('');
    setWhiteBloodCells('');
    setPlatelets('');
    setUrea('');
    setCreatinine('');
    setSodium('');
    setPotassium('');
    setChloride('');
    setBicarbonate('');
    setCalcium('');
    setPhosphate('');
    setAlbumin('');
    setTotalProtein('');
    setAlkalinePhosphatase('');
    setAlanineAminotransferase('');
    setAspartateAminotransferase('');
    setPH('');
    setPco2('');
    setPo2('');
    setBicarbonateBloodGas('');
    setUrineAppearance('');
    setUrinePH('');
    setUrineSpecificGravity('');
    setUrineProtein(false);
    setUrineGlucose(false);
    setUrineKetones(false);
    setUrineBilirubin(false);
    setUrineBlood(false);
    setUrineNitrites(false);
    setWhiteBloodCellsUrine('');
    setRedBloodCellsUrine('');
    setAbdominalUltrasound('');
    setChestXray('');
    setEcg('');
    setOtherTests('');
    setClinicalNotes('');
    setPerformedBy('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phn) {
      toast({ title: 'No patient selected', description: 'Please select a patient first', variant: 'destructive' });
      return;
    }
    if (!investigationDate) {
      toast({ title: 'Date required', description: 'Please select an investigation date', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const dto: any = {
        patientId: phn,
        investigationDate,
        monthlyReviewId: isMonthlyReviewMode ? monthlyReviewId : null,
        hemoglobin: hemoglobin ? parseFloat(hemoglobin) : null,
        hematocrit: hematocrit ? parseFloat(hematocrit) : null,
        whiteBloodCells: whiteBloodCells ? parseFloat(whiteBloodCells) : null,
        platelets: platelets ? parseFloat(platelets) : null,
        urea: urea ? parseFloat(urea) : null,
        creatinine: creatinine ? parseFloat(creatinine) : null,
        sodium: sodium ? parseFloat(sodium) : null,
        potassium: potassium ? parseFloat(potassium) : null,
        chloride: chloride ? parseFloat(chloride) : null,
        bicarbonate: bicarbonate ? parseFloat(bicarbonate) : null,
        calcium: calcium ? parseFloat(calcium) : null,
        phosphate: phosphate ? parseFloat(phosphate) : null,
        albumin: albumin ? parseFloat(albumin) : null,
        totalProtein: totalProtein ? parseFloat(totalProtein) : null,
        alkalinePhosphatase: alkalinePhosphatase ? parseFloat(alkalinePhosphatase) : null,
        alanineAminotransferase: alanineAminotransferase ? parseFloat(alanineAminotransferase) : null,
        aspartateAminotransferase: aspartateAminotransferase ? parseFloat(aspartateAminotransferase) : null,
        pH: pH ? parseFloat(pH) : null,
        pco2: pco2 ? parseFloat(pco2) : null,
        po2: po2 ? parseFloat(po2) : null,
        bicarbonateBloodGas: bicarbonateBloodGas ? parseFloat(bicarbonateBloodGas) : null,
        urineAppearance,
        urinePH: urinePH ? parseFloat(urinePH) : null,
        urineSpecificGravity: urineSpecificGravity ? parseFloat(urineSpecificGravity) : null,
        urineProtein,
        urineGlucose,
        urineKetones,
        urineBilirubin,
        urineBlood,
        urineNitrites,
        whiteBloodCellsUrine: whiteBloodCellsUrine ? parseInt(whiteBloodCellsUrine) : null,
        redBloodCellsUrine: redBloodCellsUrine ? parseInt(redBloodCellsUrine) : null,
        abdominalUltrasound,
        chestXray,
        ecg,
        otherTests,
        clinicalNotes,
        performedBy,
      };

      if (isMonthlyReviewMode && monthlyReviewId) {
        if (editingId) {
          await updateInvestigationByMonthlyReview(monthlyReviewId, editingId, dto);
          toast({ title: 'Updated', description: 'Investigation updated', variant: 'default' });
        } else {
          await createInvestigationForMonthlyReview(monthlyReviewId, dto);
          toast({ title: 'Saved', description: 'Investigation saved', variant: 'default' });
        }
      } else {
        if (editingId) {
          await updateHemodialysisInvestigation(phn, editingId, dto);
          toast({ title: 'Updated', description: 'Investigation updated', variant: 'default' });
        } else {
          await createHemodialysisInvestigation(phn, dto);
          toast({ title: 'Saved', description: 'Investigation saved', variant: 'default' });
        }
      }

      await loadInvestigations();
      clearForm();
    } catch (e) {
      console.error('Save failed', e);
      toast({ title: 'Save failed', description: 'Could not save investigation', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this investigation?')) return;
    try {
      if (isMonthlyReviewMode && monthlyReviewId) {
        await deleteInvestigationByMonthlyReview(monthlyReviewId, id);
      } else {
        await deleteHemodialysisInvestigation(phn!, id);
      }
      await loadInvestigations();
      toast({ title: 'Deleted', description: 'Investigation deleted', variant: 'default' });
    } catch (e) {
      console.error('Delete failed', e);
      toast({ title: 'Delete failed', description: 'Could not delete investigation', variant: 'destructive' });
    }
  };

  const handleEdit = (id: number) => {
    const item = saved.find((s: any) => s.id === id);
    if (item) {
      setEditingId(id);
      setInvestigationDate(item.investigationDate || new Date().toISOString().split('T')[0]);
      setHemoglobin(item.hemoglobin || '');
      setHematocrit(item.hematocrit || '');
      setWhiteBloodCells(item.whiteBloodCells || '');
      setPlatelets(item.platelets || '');
      setUrea(item.urea || '');
      setCreatinine(item.creatinine || '');
      setSodium(item.sodium || '');
      setPotassium(item.potassium || '');
      setChloride(item.chloride || '');
      setBicarbonate(item.bicarbonate || '');
      setCalcium(item.calcium || '');
      setPhosphate(item.phosphate || '');
      setAlbumin(item.albumin || '');
      setTotalProtein(item.totalProtein || '');
      setAlkalinePhosphatase(item.alkalinePhosphatase || '');
      setAlanineAminotransferase(item.alanineAminotransferase || '');
      setAspartateAminotransferase(item.aspartateAminotransferase || '');
      setPH(item.pH || '');
      setPco2(item.pco2 || '');
      setPo2(item.po2 || '');
      setBicarbonateBloodGas(item.bicarbonateBloodGas || '');
      setUrineAppearance(item.urineAppearance || '');
      setUrinePH(item.urinePH || '');
      setUrineSpecificGravity(item.urineSpecificGravity || '');
      setUrineProtein(item.urineProtein || false);
      setUrineGlucose(item.urineGlucose || false);
      setUrineKetones(item.urineKetones || false);
      setUrineBilirubin(item.urineBilirubin || false);
      setUrineBlood(item.urineBlood || false);
      setUrineNitrites(item.urineNitrites || false);
      setWhiteBloodCellsUrine(item.whiteBloodCellsUrine || '');
      setRedBloodCellsUrine(item.redBloodCellsUrine || '');
      setAbdominalUltrasound(item.abdominalUltrasound || '');
      setChestXray(item.chestXray || '');
      setEcg(item.ecg || '');
      setOtherTests(item.otherTests || '');
      setClinicalNotes(item.clinicalNotes || '');
      setPerformedBy(item.performedBy || '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filtered = saved.filter((s: any) => {
    const matchesDate = filterDate ? (s.investigationDate || '').startsWith(filterDate) : true;
    const matchesTerm = searchTerm ? (s.clinicalNotes || '').toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesDate && matchesTerm;
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isMonthlyReviewMode ? 'Monthly Review Investigations' : 'Hemodialysis Investigations'}</h1>
          <p className="text-sm text-muted-foreground">{isMonthlyReviewMode ? 'Record investigations for this monthly review' : 'Record lab tests, imaging studies, and clinical investigation results'}</p>
          {isMonthlyReviewMode && (
            <div className="text-xs text-gray-600 mt-1 space-y-1">
              <p>Review ID: {monthlyReviewId}</p>
              {monthlyReviewDetails && <p>Review Date: <strong>{monthlyReviewDetails.reviewDate}</strong></p>}
            </div>
          )}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-5 h-5" />
              {editingId ? 'Edit Investigation' : 'New Investigation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label>Investigation Date {isMonthlyReviewMode && monthlyReviewDetails && `(Review: ${monthlyReviewDetails.reviewDate})`}</Label>
                <Input 
                  type="date" 
                  value={investigationDate} 
                  onChange={(e) => setInvestigationDate(e.target.value)}
                  disabled={isMonthlyReviewMode}
                  title={isMonthlyReviewMode ? 'Date is automatically set to the monthly review date' : ''}
                />
                {isMonthlyReviewMode && <p className="text-xs text-gray-500">Automatically synced to monthly review date</p>}
              </div>

              <div className="space-y-2">
                <Label>Performed By</Label>
                <Input placeholder="Name of person" value={performedBy} onChange={(e) => setPerformedBy(e.target.value)} />
              </div>

              <Tabs defaultValue="blood-tests" className="w-full">
                <TabsList className="grid w-full grid-cols-3 text-xs">
                  <TabsTrigger value="blood-tests">Blood</TabsTrigger>
                  <TabsTrigger value="urine">Urine</TabsTrigger>
                  <TabsTrigger value="imaging">Imaging</TabsTrigger>
                </TabsList>

                <TabsContent value="blood-tests" className="space-y-3 mt-3">
                  <div className="text-xs font-semibold text-gray-600">Blood Tests</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Hemoglobin (g/dL)</Label>
                      <Input type="number" step="0.1" value={hemoglobin} onChange={(e) => setHemoglobin(e.target.value)} placeholder="12.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Hematocrit (%)</Label>
                      <Input type="number" step="0.1" value={hematocrit} onChange={(e) => setHematocrit(e.target.value)} placeholder="38" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">WBC (x10⁹/L)</Label>
                      <Input type="number" step="0.1" value={whiteBloodCells} onChange={(e) => setWhiteBloodCells(e.target.value)} placeholder="7" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Platelets (x10⁹/L)</Label>
                      <Input type="number" step="0.1" value={platelets} onChange={(e) => setPlatelets(e.target.value)} placeholder="200" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Urea (mg/dL)</Label>
                      <Input type="number" step="0.1" value={urea} onChange={(e) => setUrea(e.target.value)} placeholder="45" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Creatinine (mg/dL)</Label>
                      <Input type="number" step="0.1" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} placeholder="8.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Sodium (mEq/L)</Label>
                      <Input type="number" step="0.1" value={sodium} onChange={(e) => setSodium(e.target.value)} placeholder="138" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Potassium (mEq/L)</Label>
                      <Input type="number" step="0.1" value={potassium} onChange={(e) => setPotassium(e.target.value)} placeholder="5.2" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Chloride (mEq/L)</Label>
                      <Input type="number" step="0.1" value={chloride} onChange={(e) => setChloride(e.target.value)} placeholder="102" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">HCO3 (mEq/L)</Label>
                      <Input type="number" step="0.1" value={bicarbonate} onChange={(e) => setBicarbonate(e.target.value)} placeholder="24" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Calcium (mg/dL)</Label>
                      <Input type="number" step="0.1" value={calcium} onChange={(e) => setCalcium(e.target.value)} placeholder="9.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Phosphate (mg/dL)</Label>
                      <Input type="number" step="0.1" value={phosphate} onChange={(e) => setPhosphate(e.target.value)} placeholder="5.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Albumin (g/dL)</Label>
                      <Input type="number" step="0.1" value={albumin} onChange={(e) => setAlbumin(e.target.value)} placeholder="4.0" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Total Protein (g/dL)</Label>
                      <Input type="number" step="0.1" value={totalProtein} onChange={(e) => setTotalProtein(e.target.value)} placeholder="7.0" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Alk Phos (U/L)</Label>
                      <Input type="number" step="0.1" value={alkalinePhosphatase} onChange={(e) => setAlkalinePhosphatase(e.target.value)} placeholder="75" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">ALT (U/L)</Label>
                      <Input type="number" step="0.1" value={alanineAminotransferase} onChange={(e) => setAlanineAminotransferase(e.target.value)} placeholder="30" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">AST (U/L)</Label>
                      <Input type="number" step="0.1" value={aspartateAminotransferase} onChange={(e) => setAspartateAminotransferase(e.target.value)} placeholder="30" />
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-gray-600 mt-4">Blood Gas</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">pH</Label>
                      <Input type="number" step="0.01" value={pH} onChange={(e) => setPH(e.target.value)} placeholder="7.35" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">PCO₂ (mmHg)</Label>
                      <Input type="number" step="0.1" value={pco2} onChange={(e) => setPco2(e.target.value)} placeholder="40" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">PO₂ (mmHg)</Label>
                      <Input type="number" step="0.1" value={po2} onChange={(e) => setPo2(e.target.value)} placeholder="95" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">HCO₃ (mEq/L)</Label>
                      <Input type="number" step="0.1" value={bicarbonateBloodGas} onChange={(e) => setBicarbonateBloodGas(e.target.value)} placeholder="24" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="urine" className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Appearance</Label>
                    <Input placeholder="Clear, yellow, etc." value={urineAppearance} onChange={(e) => setUrineAppearance(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">pH</Label>
                      <Input type="number" step="0.1" value={urinePH} onChange={(e) => setUrinePH(e.target.value)} placeholder="6.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Specific Gravity</Label>
                      <Input type="number" step="0.001" value={urineSpecificGravity} onChange={(e) => setUrineSpecificGravity(e.target.value)} placeholder="1.020" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Urine Dipstick</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="urineProtein" checked={urineProtein} onChange={(e) => setUrineProtein(e.target.checked)} />
                        <label htmlFor="urineProtein" className="text-xs">Protein</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="urineGlucose" checked={urineGlucose} onChange={(e) => setUrineGlucose(e.target.checked)} />
                        <label htmlFor="urineGlucose" className="text-xs">Glucose</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="urineKetones" checked={urineKetones} onChange={(e) => setUrineKetones(e.target.checked)} />
                        <label htmlFor="urineKetones" className="text-xs">Ketones</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="urineBilirubin" checked={urineBilirubin} onChange={(e) => setUrineBilirubin(e.target.checked)} />
                        <label htmlFor="urineBilirubin" className="text-xs">Bilirubin</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="urineBlood" checked={urineBlood} onChange={(e) => setUrineBlood(e.target.checked)} />
                        <label htmlFor="urineBlood" className="text-xs">Blood</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="urineNitrites" checked={urineNitrites} onChange={(e) => setUrineNitrites(e.target.checked)} />
                        <label htmlFor="urineNitrites" className="text-xs">Nitrites</label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">WBC/urine</Label>
                      <Input type="number" value={whiteBloodCellsUrine} onChange={(e) => setWhiteBloodCellsUrine(e.target.value)} placeholder="0" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">RBC/urine</Label>
                      <Input type="number" value={redBloodCellsUrine} onChange={(e) => setRedBloodCellsUrine(e.target.value)} placeholder="0" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="imaging" className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Abdominal Ultrasound</Label>
                    <Textarea placeholder="Findings..." value={abdominalUltrasound} onChange={(e) => setAbdominalUltrasound(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Chest X-Ray</Label>
                    <Textarea placeholder="Findings..." value={chestXray} onChange={(e) => setChestXray(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">ECG</Label>
                    <Textarea placeholder="Findings..." value={ecg} onChange={(e) => setEcg(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Other Tests</Label>
                    <Textarea placeholder="Other imaging or tests..." value={otherTests} onChange={(e) => setOtherTests(e.target.value)} rows={2} />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label>Clinical Notes</Label>
                <Textarea placeholder="Overall findings and clinical assessment..." value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} rows={3} />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1" disabled={saving}>{editingId ? 'Update' : 'Save'}</Button>
                <Button type="button" variant="outline" onClick={clearForm} className="flex-1">Clear</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="flex items-center gap-2"><Beaker className="w-5 h-5" />Saved Investigations</CardTitle>
                <div className="text-sm text-muted-foreground">View and filter investigation records</div>
              </div>
              <div className="flex items-center gap-2">
                <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="h-8 w-40" />
                <Input placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8 flex-1" />
                <Button variant="outline" size="sm" onClick={() => { setShowSaved((s) => { const next = !s; if (next && phn) loadInvestigations(); return next; }); }}>
                  {showSaved ? 'Hide' : 'Show'}
                </Button>
                {showSaved && (
                  <Button variant="outline" size="sm" onClick={loadInvestigations}><RefreshCw className="w-4 h-4 mr-1"/>Refresh</Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!showSaved ? (
              <div className="text-sm text-muted-foreground">Investigations are hidden. Click <strong>Show</strong> to view saved records.</div>
            ) : (
              (loading ? (
                <p>Loading...</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">{saved.length === 0 ? 'No investigations saved yet.' : 'No investigations match your filters.'}</p>
              ) : (
                <div className="space-y-3 max-h-[80vh] overflow-y-auto">
                  {filtered.map((inv: any) => (
                    <div key={inv.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold text-slate-800">{inv.investigationDate}</div>
                            {inv.performedBy && <div className="text-xs text-slate-500">By: {inv.performedBy}</div>}
                          </div>
                          {(inv.hemoglobin || inv.creatinine || inv.urea) && (
                            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                              {inv.hemoglobin && <div>Hb: {inv.hemoglobin} g/dL</div>}
                              {inv.creatinine && <div>Cr: {inv.creatinine} mg/dL</div>}
                              {inv.urea && <div>Urea: {inv.urea} mg/dL</div>}
                            </div>
                          )}
                          {inv.clinicalNotes && <div className="mt-2 text-sm text-slate-600">{inv.clinicalNotes}</div>}
                        </div>
                        <div className="flex flex-col gap-2 text-right">
                          <div className="text-xs text-slate-500">ID: {inv.id}</div>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(inv.id)}>Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(inv.id)}>Delete</Button>
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

export default HDInvestigation;
