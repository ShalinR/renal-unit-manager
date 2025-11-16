import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Heart, ArrowLeft, Loader2, Calendar, Eye, FileText, X } from "lucide-react";
import { formatDateToDDMMYYYY, formatDateTimeDisplay } from "@/lib/dateUtils";
import { usePatientContext } from "@/context/PatientContext";
import { ktInvestigationApi } from "@/services/ktInvestigationApi";

interface StandardInvestigationData {
  patientId: string;
  date: string;
  // Basic KT info
  dateOfKT: string;
  typeOfKT: string;
  postKTDuration: string;
  bw: string;
  height: string;
  bmi: string;
  bp: string;
  tacrolimus: string;
  creatinine: string;
  eGFR: string;
  seNa: string;
  seK: string;
  hb: string;
  pcv: string;
  wbcTotal: string;
  wbcN: string;
  wbcL: string;
  platelet: string;
  urineProtein: string;
  urinePusCells: string;
  urineRBC: string;
  urinePCR: string;
  sCalcium: string;
  sPhosphate: string;
  fbs: string;
  ppbs: string;
  hba1c: string;
  cholesterolTotal: string;
  triglycerides: string;
  hdl: string;
  ldl: string;
  sAlbumin: string;
  alp: string;
  uricAcid: string;
  alt: string;
  ast: string;
  sBilirubin: string;
  // Annual-specific fields
  annualScreening: string;
  cmvPCR: string;
  bkvPCR: string;
  ebvPCR: string;
  hepBsAg: string;
  hepCAb: string;
  hivAb: string;
  urineCytology: string;
  pth: string;
  vitD: string;
  // Imaging
  imagingUS_KUB_Pelvis_RenalDoppler: string;
  imagingCXR: string;
  imagingECG: string;
  imaging2DEcho: string;
  // Hematology & Oncology Screening
  hematologyBloodPicture: string;
  breastScreen: string;
  psa: string;
  papSmear: string;
  stoolOccultBlood: string;
  // Procedures
  proceduresEndoscopy: string;
  // Specialist reviews
  specialistDental: string;
  specialistOphthalmology: string;
  notes: string;
}

interface KTInvestigationRecord {
  id: number;
  date: string;
  type: 'standard' | 'annual';
  payload: string;
  createdAt?: string;
  updatedAt?: string;
}

const KTInvestigation = () => {
  const navigate = useNavigate();
  const { patient, globalPatient } = usePatientContext();
  const [viewMode, setViewMode] = useState<'create' | 'view'>('create');
  const [mode, setMode] = useState<'standard' | 'annual'>('standard');
  const [submitting, setSubmitting] = useState(false);
  const [investigations, setInvestigations] = useState<KTInvestigationRecord[]>([]);
  const [loadingInvestigations, setLoadingInvestigations] = useState(false);
  const [filterDate, setFilterDate] = useState<string>('');
  const [selectedInvestigation, setSelectedInvestigation] = useState<KTInvestigationRecord | null>(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [formData, setFormData] = useState<StandardInvestigationData>({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    dateOfKT: '',
    typeOfKT: '',
    postKTDuration: '',
    bw: '',
    height: '',
    bmi: '',
    bp: '',
    tacrolimus: '',
    creatinine: '',
    eGFR: '',
    seNa: '',
    seK: '',
    hb: '',
    pcv: '',
    wbcTotal: '',
    wbcN: '',
    wbcL: '',
    platelet: '',
    urineProtein: '',
    urinePusCells: '',
    urineRBC: '',
    urinePCR: '',
    sCalcium: '',
    sPhosphate: '',
    fbs: '',
    ppbs: '',
    hba1c: '',
    cholesterolTotal: '',
    triglycerides: '',
    hdl: '',
    ldl: '',
    sAlbumin: '',
    alp: '',
    uricAcid: '',
    alt: '',
    ast: '',
    sBilirubin: '',
    annualScreening: '',
    cmvPCR: '',
    bkvPCR: '',
    ebvPCR: '',
    hepBsAg: '',
    hepCAb: '',
    hivAb: '',
    urineCytology: '',
    pth: '',
    vitD: '',
    imagingUS_KUB_Pelvis_RenalDoppler: '',
    imagingCXR: '',
    imagingECG: '',
    imaging2DEcho: '',
    hematologyBloodPicture: '',
    breastScreen: '',
    psa: '',
    papSmear: '',
    stoolOccultBlood: '',
    proceduresEndoscopy: '',
    specialistDental: '',
    specialistOphthalmology: '',
    notes: '',
  });

  useEffect(() => {
    const currentPatient = globalPatient || patient;
    if (currentPatient?.phn) {
      setFormData(prev => ({ ...prev, patientId: currentPatient.phn || '' }));
      if (viewMode === 'view') {
        loadInvestigations(currentPatient.phn);
      }
    }
  }, [globalPatient, patient, viewMode]);

  const handleChange = (field: keyof StandardInvestigationData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      // Auto-calculate BMI when weight (bw) or height changes
      try {
        const bwStr = field === 'bw' ? value : prev.bw;
        const heightStr = field === 'height' ? value : prev.height;
        const bwNum = parseFloat(String(bwStr || '').replace(/[^0-9.\-]/g, ''));
        const heightNum = parseFloat(String(heightStr || '').replace(/[^0-9.\-]/g, ''));
        if (!Number.isNaN(bwNum) && !Number.isNaN(heightNum) && heightNum > 0) {
          const heightM = heightNum / 100; // convert cm to meters
          const bmi = bwNum / (heightM * heightM);
          next.bmi = Number.isFinite(bmi) ? String(parseFloat(bmi.toFixed(1))) : '';
        } else {
          // clear BMI if inputs invalid
          next.bmi = '';
        }
      } catch (e) {
        next.bmi = '';
      }

      return next;
    });
  };

  const loadInvestigations = async (phn: string) => {
    setLoadingInvestigations(true);
    try {
      const data = await ktInvestigationApi.list(phn);
      setInvestigations((data as any[]) || []);
    } catch (error) {
      console.error('Error loading investigations:', error);
    } finally {
      setLoadingInvestigations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPatient = globalPatient || patient;
    if (!currentPatient?.phn) {
      alert('Please search for a patient first');
      return;
    }
    setSubmitting(true);
    try {
      await ktInvestigationApi.create(currentPatient.phn, {
        date: formData.date,
        type: mode,
        payload: JSON.stringify(formData),
      });
      alert('Investigation saved successfully!');
      // Reload investigations if in view mode
      if (viewMode === 'view') {
        await loadInvestigations(currentPatient.phn);
      } else {
        navigate('/investigation');
      }
    } catch (error) {
      console.error('Error saving investigation:', error);
      alert('Failed to save investigation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = async (investigation: KTInvestigationRecord) => {
    try {
      const details = await ktInvestigationApi.getById(investigation.id);
      setSelectedInvestigation(details as any);
      setViewDetails(true);
    } catch (error) {
      console.error('Error loading investigation details:', error);
      alert('Failed to load investigation details');
    }
  };

  const renderPayload = (payloadStr?: string) => {
    if (!payloadStr) return null;
    let data: any = null;
    try {
      data = JSON.parse(payloadStr);
    } catch (err) {
      return (
        <div className="mt-2 p-3 sm:p-4 bg-muted rounded-lg max-h-[60vh] overflow-auto">
          <pre className="text-xs sm:text-sm whitespace-pre-wrap break-words">{payloadStr}</pre>
        </div>
      );
    }

    const Field = ({ label, value, abnormal }: { label: string; value: any; abnormal?: { severity: 'high' | 'low' | 'warn'; message?: string } }) => (
      <div>
        <Label className="text-muted-foreground text-xs">{label}</Label>
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm text-black dark:text-white break-words">{value === '' || value === null || value === undefined ? '—' : String(value)}</p>
          {abnormal && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`${abnormal.severity === 'high' ? 'bg-red-600 text-white' : abnormal.severity === 'low' ? 'bg-yellow-500 text-black' : 'bg-amber-500 text-black'} px-2 py-0.5 text-xs`}>{abnormal.severity === 'high' ? 'High' : abnormal.severity === 'low' ? 'Low' : 'Warn'}</Badge>
              </TooltipTrigger>
              <TooltipContent>{abnormal.message || `${label} is ${abnormal.severity}`}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    );

    const parseNumber = (v: any) => {
      const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
      return Number.isFinite(n) ? n : NaN;
    };

    const abnormalFor = (key: string, val: any) => {
      const n = parseNumber(val);
      if (isNaN(n)) return undefined;
      switch (key) {
        case 'creatinine':
          if (n > 120) return { severity: 'high' as const, message: 'Raised creatinine — consider review' };
          return undefined;
        case 'eGFR':
          if (n < 60) return { severity: 'low' as const, message: 'Reduced eGFR — CKD stage possible' };
          return undefined;
        case 'tacrolimus':
          if (n < 5) return { severity: 'low' as const, message: 'Low tacrolimus level — risk of rejection' };
          if (n > 15) return { severity: 'high' as const, message: 'High tacrolimus level — toxicity risk' };
          return undefined;
        case 'seNa':
          if (n < 135) return { severity: 'low' as const, message: 'Hyponatraemia' };
          if (n > 145) return { severity: 'high' as const, message: 'Hypernatraemia' };
          return undefined;
        case 'seK':
          if (n < 3.5) return { severity: 'low' as const, message: 'Hypokalaemia' };
          if (n > 5.5) return { severity: 'high' as const, message: 'Hyperkalaemia' };
          return undefined;
        default:
          return undefined;
      }
    };

    return (
      <div className="space-y-4 mt-2">
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={() => {
            // Copy as report (plain text)
            const reportLines: string[] = [];
            reportLines.push(`Investigation Report — ${data.patientId || ''} ${data.date || ''}`);
            reportLines.push('');
            Object.entries(data).forEach(([k, v]) => {
              if (k === 'notes' || typeof v === 'object') return;
              reportLines.push(`${k}: ${v}`);
            });
            reportLines.push('');
            reportLines.push(`Notes: ${data.notes || ''}`);
            navigator.clipboard?.writeText(reportLines.join('\n'));
            alert('Report copied to clipboard');
          }}>Copy as report</Button>

          <Button size="sm" onClick={() => {
            // Open printable view
            const html = `<!doctype html><html><head><meta charset="utf-8"><title>Investigation Report</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111} h1{font-size:18px} .section{margin-bottom:12px;} .label{font-weight:600;margin-bottom:4px;} .value{margin-bottom:6px}</style></head><body><h1>Investigation Report</h1><p><strong>Patient:</strong> ${data.patientId || ''} ${data.date || ''}</p>${Object.entries(data).map(([k,v])=>{ if(k==='notes') return `<div class="section"><div class="label">Notes</div><div class="value">${String(v||'—')}</div></div>`; if(typeof v === 'object') return ''; return `<div class="section"><div class="label">${k}</div><div class="value">${String(v||'—')}</div></div>`}).join('')}<script>window.onload=()=>{window.print();}</script></body></html>`;
            const w = window.open('', '_blank');
            if (w) {
              w.document.open();
              w.document.write(html);
              w.document.close();
            } else {
              alert('Unable to open print window — please allow popups');
            }
          }}>Export / Print</Button>
        </div>

        <Accordion type="multiple" defaultValue={[] as string[]}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AccordionItem value="basic">
            <AccordionTrigger>Basic Information</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date" value={data.date || data?.dateOfKT || '—'} />
                <Field label="Type" value={data.typeOfKT || data?.type || '—'} />
                <Field label="Post KT duration" value={data.postKTDuration} />
                <Field label="Body Weight (kg)" value={data.bw} />
                <Field label="Height (cm)" value={data.height} />
                <Field label="BMI" value={data.bmi} />
                <Field label="Blood Pressure" value={data.bp} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>

        <AccordionItem value="immuno">
          <AccordionTrigger>Immunosuppression & Renal Function</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Tacrolimus" value={data.tacrolimus} abnormal={abnormalFor('tacrolimus', data.tacrolimus)} />
              <Field label="S. Creatinine" value={data.creatinine} abnormal={abnormalFor('creatinine', data.creatinine)} />
              <Field label="eGFR" value={data.eGFR} abnormal={abnormalFor('eGFR', data.eGFR)} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="electrolytes">
          <AccordionTrigger>Electrolytes</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Na+" value={data.seNa} abnormal={abnormalFor('seNa', data.seNa)} />
              <Field label="K+" value={data.seK} abnormal={abnormalFor('seK', data.seK)} />
              <Field label="Calcium" value={data.sCalcium} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fbc">
          <AccordionTrigger>Full Blood Count (FBC)</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Field label="Hb" value={data.hb} />
              <Field label="PCV" value={data.pcv} />
              <Field label="WBC Total" value={data.wbcTotal} />
              <Field label="Neutrophils" value={data.wbcN} />
              <Field label="Lymphocytes" value={data.wbcL} />
              <Field label="Platelets" value={data.platelet} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="urine">
          <AccordionTrigger>Urine / Protein</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Protein" value={data.urineProtein} />
              <Field label="Pus cells" value={data.urinePusCells} />
              <Field label="RBC" value={data.urineRBC} />
              <Field label="Urine PCR" value={data.urinePCR} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="diabetes">
          <AccordionTrigger>Metabolic / Diabetes</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="FBS" value={data.fbs} />
              <Field label="PPBS" value={data.ppbs} />
              <Field label="HbA1c" value={data.hba1c} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lipids">
          <AccordionTrigger>Lipid Profile</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Field label="Total Cholesterol" value={data.cholesterolTotal} />
              <Field label="Triglycerides" value={data.triglycerides} />
              <Field label="HDL" value={data.hdl} />
              <Field label="LDL" value={data.ldl} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lfts">
          <AccordionTrigger>LFTs & Others</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Field label="S. Albumin" value={data.sAlbumin} />
              <Field label="ALP" value={data.alp} />
              <Field label="ALT" value={data.alt} />
              <Field label="AST" value={data.ast} />
              <Field label="S. Bilirubin" value={data.sBilirubin} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="infectious">
          <AccordionTrigger>Infectious Screening / Annual</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="CMV PCR" value={data.cmvPCR} />
              <Field label="BKV PCR" value={data.bkvPCR} />
              <Field label="EBV PCR" value={data.ebvPCR} />
              <Field label="Hep BsAg" value={data.hepBsAg} />
              <Field label="Hep C Ab" value={data.hepCAb} />
              <Field label="HIV Ab" value={data.hivAb} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="imaging">
          <AccordionTrigger>Imaging</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="US KUB / Renal Doppler" value={data.imagingUS_KUB_Pelvis_RenalDoppler} />
              <Field label="CXR" value={data.imagingCXR} />
              <Field label="ECG" value={data.imagingECG} />
              <Field label="2D Echo" value={data.imaging2DEcho} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="specialist">
          <AccordionTrigger>Specialist Reviews & Procedures</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Dental review" value={data.specialistDental} />
              <Field label="Ophthalmology review" value={data.specialistOphthalmology} />
              <Field label="Endoscopy / Procedures" value={data.proceduresEndoscopy} />
            </div>
          </AccordionContent>
        </AccordionItem>
        </Accordion>

        <div>
          <h4 className="text-sm font-semibold mb-2">Notes</h4>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-black dark:text-white whitespace-pre-wrap">{data.notes || '—'}</p>
          </div>
        </div>
      </div>
    );
  };

  const filteredInvestigations = investigations.filter(inv => {
    if (!filterDate) return true;
    return inv.date === filterDate;
  });

  // Group investigations by date
  const groupedByDate = filteredInvestigations.reduce((acc, inv) => {
    const date = inv.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(inv);
    return acc;
  }, {} as Record<string, KTInvestigationRecord[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Kidney Transplant Investigation</h1>
        </div>

        <div className="flex items-center gap-4">
          {(globalPatient || patient)?.phn && (
            <div className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded border border-green-200 dark:border-green-800">
              <strong>Patient:</strong> {(globalPatient || patient)?.name} (PHN: {(globalPatient || patient)?.phn})
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/investigation')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back To Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                console.log("KTInvestigation: Follow Ups clicked", { patient: (globalPatient || patient)?.phn });
                navigate('/kidney-transplant', { state: { open: 'follow-up' } });
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Follow Ups
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={mode} onValueChange={(value) => {
        setMode(value as 'standard' | 'annual');
        setViewDetails(false);
        setSelectedInvestigation(null);
      }} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="standard" className="flex items-center gap-2">
            Standard Investigation
          </TabsTrigger>
          <TabsTrigger value="annual" className="flex items-center gap-2">
            Annual Investigation
          </TabsTrigger>
        </TabsList>

        {/* Standard Investigation Tab */}
        <TabsContent value="standard" className="space-y-4">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'create' | 'view')} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create New
              </TabsTrigger>
              <TabsTrigger value="view" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Investigations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Standard Investigation Records
                  </CardTitle>
                  <CardDescription>
                    View and filter standard investigations by date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Date Filter */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label htmlFor="filterDateStandard">Filter by Date</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="filterDateStandard"
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="flex-1"
                          />
                          {filterDate && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setFilterDate('')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="pt-6">
                        <Badge variant="outline" className="text-sm">
                          {filteredInvestigations.filter(inv => inv.type === 'standard').length} record{filteredInvestigations.filter(inv => inv.type === 'standard').length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>

                    {/* Loading State */}
                    {loadingInvestigations ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : sortedDates.filter(date => groupedByDate[date].some(inv => inv.type === 'standard')).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No standard investigations found</p>
                        {filterDate && (
                          <p className="text-sm mt-2">Try selecting a different date</p>
                        )}
                      </div>
                    ) : (
                      /* Grouped Standard Investigations by Date */
                      <div className="space-y-6">
                        {sortedDates
                          .filter(date => groupedByDate[date].some(inv => inv.type === 'standard'))
                          .map((date) => (
                            <div key={date} className="space-y-3">
                              <div className="flex items-center gap-2 pb-2 border-b">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold text-lg">{formatDateToDDMMYYYY(date)}</h3>
                                <Badge variant="outline" className="ml-auto">
                                  {groupedByDate[date].filter(inv => inv.type === 'standard').length} {groupedByDate[date].filter(inv => inv.type === 'standard').length === 1 ? 'record' : 'records'}
                                </Badge>
                              </div>
                              <div className="grid gap-3">
                                {groupedByDate[date]
                                  .filter(inv => inv.type === 'standard')
                                  .map((inv) => (
                                    <Card key={inv.id} className="hover:shadow-md transition-shadow">
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <Badge
                                              variant="outline"
                                              className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                            >
                                              Standard
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">Created: {inv.createdAt ? formatDateTimeDisplay(inv.createdAt) : 'N/A'}</span>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(inv)}
                                            className="flex items-center gap-2"
                                          >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Investigation Details Modal */}
              {viewDetails && selectedInvestigation && selectedInvestigation.type === 'standard' && (
                <Dialog open={viewDetails} onOpenChange={(open) => {
                  if (!open) {
                    setViewDetails(false);
                    setSelectedInvestigation(null);
                  }
                }}>
                  <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">Standard Investigation Details</DialogTitle>
                      <DialogDescription className="text-sm">{formatDateToDDMMYYYY(selectedInvestigation.date)} - Standard</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground text-xs sm:text-sm">Date</Label>
                          <p className="font-medium text-sm sm:text-base">{formatDateToDDMMYYYY(selectedInvestigation.date)}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs sm:text-sm">Type</Label>
                          <p className="font-medium text-sm sm:text-base capitalize">{selectedInvestigation.type}</p>
                        </div>
                        {selectedInvestigation.createdAt && (
                          <div>
                            <Label className="text-muted-foreground text-xs sm:text-sm">Created At</Label>
                            <p className="font-medium text-sm sm:text-base break-words">{formatDateTimeDisplay(selectedInvestigation.createdAt)}</p>
                          </div>
                        )}
                        {selectedInvestigation.updatedAt && (
                          <div>
                            <Label className="text-muted-foreground text-xs sm:text-sm">Updated At</Label>
                            <p className="font-medium text-sm sm:text-base break-words">{formatDateTimeDisplay(selectedInvestigation.updatedAt)}</p>
                          </div>
                        )}
                      </div>
                      {selectedInvestigation.payload && (
                        <div>
                          <Label className="text-muted-foreground text-xs sm:text-sm">Investigation Data</Label>
                          {renderPayload(selectedInvestigation.payload)}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Investigation</CardTitle>
                  <CardDescription>
                    Enter the standard panel of tests for routine follow-up
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientStandard">Patient ID</Label>
                        <Input id="patientStandard" value={formData.patientId} onChange={(e) => handleChange('patientId', e.target.value)} placeholder="Patient ID" required />
                      </div>
                      <div>
                        <Label htmlFor="dateStandard">Date</Label>
                        <Input id="dateStandard" type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} required />
                      </div>
                    </div>

            {/* Standard Investigation Form */}
            {(
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">1. Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div>
                    <Label>Date of KT</Label>
                    <Input type="date" value={formData.dateOfKT} onChange={(e) => handleChange('dateOfKT', e.target.value)} />
                  </div>
                  <div>
                    <Label>Type of KT</Label>
                    <Input value={formData.typeOfKT} onChange={(e) => handleChange('typeOfKT', e.target.value)} placeholder="LDKT / DDKT" />
                  </div>
                  <div>
                    <Label>Post KT duration</Label>
                    <Input value={formData.postKTDuration} onChange={(e) => handleChange('postKTDuration', e.target.value)} placeholder="e.g. 6 months" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">2. Examination</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>BW (kg)</Label>
                    <Input value={formData.bw} onChange={(e) => handleChange('bw', e.target.value)} />
                  </div>
                  <div>
                    <Label>Height (cm)</Label>
                    <Input value={formData.height} onChange={(e) => handleChange('height', e.target.value)} />
                  </div>
                  <div>
                    <Label>BMI</Label>
                    <Input value={formData.bmi} onChange={(e) => handleChange('bmi', e.target.value)} />
                  </div>
                  <div>
                    <Label>BP</Label>
                    <Input value={formData.bp} onChange={(e) => handleChange('bp', e.target.value)} placeholder="e.g. 120/80" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">3. Immunosuppression</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tacrolimus Level (ng/mL)</Label>
                    <Input value={formData.tacrolimus} onChange={(e) => handleChange('tacrolimus', e.target.value)} />
                  </div>
                  <div>
                    <Label>S. Creatinine (µmol/L or mg/dL)</Label>
                    <Input value={formData.creatinine} onChange={(e) => handleChange('creatinine', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">4. Electrolytes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>eGFR</Label>
                    <Input value={formData.eGFR} onChange={(e) => handleChange('eGFR', e.target.value)} />
                  </div>
                  <div>
                    <Label>Serum Na+</Label>
                    <Input value={formData.seNa} onChange={(e) => handleChange('seNa', e.target.value)} />
                  </div>
                  <div>
                    <Label>Serum K+</Label>
                    <Input value={formData.seK} onChange={(e) => handleChange('seK', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">5. Full Blood Count (FBC)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Hb</Label>
                    <Input value={formData.hb} onChange={(e) => handleChange('hb', e.target.value)} />
                  </div>
                  <div>
                    <Label>PCV</Label>
                    <Input value={formData.pcv} onChange={(e) => handleChange('pcv', e.target.value)} />
                  </div>
                  <div>
                    <Label>WBC - Total</Label>
                    <Input value={formData.wbcTotal} onChange={(e) => handleChange('wbcTotal', e.target.value)} />
                  </div>
                  <div>
                    <Label>Neutrophils (N)</Label>
                    <Input value={formData.wbcN} onChange={(e) => handleChange('wbcN', e.target.value)} />
                  </div>
                  <div>
                    <Label>Lymphocytes (L)</Label>
                    <Input value={formData.wbcL} onChange={(e) => handleChange('wbcL', e.target.value)} />
                  </div>
                  <div>
                    <Label>Platelet count</Label>
                    <Input value={formData.platelet} onChange={(e) => handleChange('platelet', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">6. UFR</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Protein</Label>
                    <Input value={formData.urineProtein} onChange={(e) => handleChange('urineProtein', e.target.value)} />
                  </div>
                  <div>
                    <Label>Pus cells</Label>
                    <Input value={formData.urinePusCells} onChange={(e) => handleChange('urinePusCells', e.target.value)} />
                  </div>
                  <div>
                    <Label>RBC</Label>
                    <Input value={formData.urineRBC} onChange={(e) => handleChange('urineRBC', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">7. Urine PCR & Metabolic</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Urine PCR</Label>
                    <Input value={formData.urinePCR} onChange={(e) => handleChange('urinePCR', e.target.value)} />
                  </div>
                  <div>
                    <Label>S. Calcium (Ca2+)</Label>
                    <Input value={formData.sCalcium} onChange={(e) => handleChange('sCalcium', e.target.value)} />
                  </div>
                  <div>
                    <Label>S. Phosphate (PO4)</Label>
                    <Input value={formData.sPhosphate} onChange={(e) => handleChange('sPhosphate', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>FBS</Label>
                    <Input value={formData.fbs} onChange={(e) => handleChange('fbs', e.target.value)} />
                  </div>
                  <div>
                    <Label>PPBS</Label>
                    <Input value={formData.ppbs} onChange={(e) => handleChange('ppbs', e.target.value)} />
                  </div>
                  <div>
                    <Label>HbA1c</Label>
                    <Input value={formData.hba1c} onChange={(e) => handleChange('hba1c', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">8. Lipid Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Total Cholesterol</Label>
                    <Input value={formData.cholesterolTotal} onChange={(e) => handleChange('cholesterolTotal', e.target.value)} />
                  </div>
                  <div>
                    <Label>Triglycerides (TG)</Label>
                    <Input value={formData.triglycerides} onChange={(e) => handleChange('triglycerides', e.target.value)} />
                  </div>
                  <div>
                    <Label>HDL</Label>
                    <Input value={formData.hdl} onChange={(e) => handleChange('hdl', e.target.value)} />
                  </div>
                  <div>
                    <Label>LDL</Label>
                    <Input value={formData.ldl} onChange={(e) => handleChange('ldl', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">9. LFTs / Other</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>S. Albumin</Label>
                    <Input value={formData.sAlbumin} onChange={(e) => handleChange('sAlbumin', e.target.value)} />
                  </div>
                  <div>
                    <Label>ALP</Label>
                    <Input value={formData.alp} onChange={(e) => handleChange('alp', e.target.value)} />
                  </div>
                  <div>
                    <Label>Uric Acid</Label>
                    <Input value={formData.uricAcid} onChange={(e) => handleChange('uricAcid', e.target.value)} />
                  </div>
                  <div>
                    <Label>ALT</Label>
                    <Input value={formData.alt} onChange={(e) => handleChange('alt', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>AST</Label>
                    <Input value={formData.ast} onChange={(e) => handleChange('ast', e.target.value)} />
                  </div>
                  <div>
                    <Label>S. Bilirubin (Total)</Label>
                    <Input value={formData.sBilirubin} onChange={(e) => handleChange('sBilirubin', e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label>Additional Notes</Label>
                  <Textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
                </div>
              </div>
            )}

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/investigation')} disabled={submitting}>Cancel</Button>
                      <Button type="submit" className="flex-1" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Submit Investigation'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Annual Investigation Tab */}
        <TabsContent value="annual" className="space-y-4">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'create' | 'view')} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create New
              </TabsTrigger>
              <TabsTrigger value="view" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Investigations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Annual Investigation Records
                  </CardTitle>
                  <CardDescription>
                    View and filter annual investigations by date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Date Filter */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label htmlFor="filterDateAnnual">Filter by Date</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="filterDateAnnual"
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="flex-1"
                          />
                          {filterDate && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setFilterDate('')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="pt-6">
                        <Badge variant="outline" className="text-sm">
                          {filteredInvestigations.filter(inv => inv.type === 'annual').length} record{filteredInvestigations.filter(inv => inv.type === 'annual').length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>

                    {/* Loading State */}
                    {loadingInvestigations ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : sortedDates.filter(date => groupedByDate[date].some(inv => inv.type === 'annual')).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No annual investigations found</p>
                        {filterDate && (
                          <p className="text-sm mt-2">Try selecting a different date</p>
                        )}
                      </div>
                    ) : (
                      /* Grouped Annual Investigations by Date */
                      <div className="space-y-6">
                        {sortedDates
                          .filter(date => groupedByDate[date].some(inv => inv.type === 'annual'))
                          .map((date) => (
                            <div key={date} className="space-y-3">
                              <div className="flex items-center gap-2 pb-2 border-b">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold text-lg">{formatDateToDDMMYYYY(date)}</h3>
                                <Badge variant="outline" className="ml-auto">
                                  {groupedByDate[date].filter(inv => inv.type === 'annual').length} {groupedByDate[date].filter(inv => inv.type === 'annual').length === 1 ? 'record' : 'records'}
                                </Badge>
                              </div>
                              <div className="grid gap-3">
                                {groupedByDate[date]
                                  .filter(inv => inv.type === 'annual')
                                  .map((inv) => (
                                    <Card key={inv.id} className="hover:shadow-md transition-shadow">
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <Badge
                                              variant="outline"
                                              className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                            >
                                              Annual
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">Created: {inv.createdAt ? formatDateTimeDisplay(inv.createdAt) : 'N/A'}</span>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(inv)}
                                            className="flex items-center gap-2"
                                          >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Investigation Details Modal */}
              {viewDetails && selectedInvestigation && selectedInvestigation.type === 'annual' && (
                <Dialog open={viewDetails} onOpenChange={(open) => {
                  if (!open) {
                    setViewDetails(false);
                    setSelectedInvestigation(null);
                  }
                }}>
                  <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">Annual Investigation Details</DialogTitle>
                      <DialogDescription className="text-sm">{formatDateToDDMMYYYY(selectedInvestigation.date)} - Annual</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground text-xs sm:text-sm">Date</Label>
                          <p className="font-medium text-sm sm:text-base">{formatDateToDDMMYYYY(selectedInvestigation.date)}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs sm:text-sm">Type</Label>
                          <p className="font-medium text-sm sm:text-base capitalize">{selectedInvestigation.type}</p>
                        </div>
                        {selectedInvestigation.createdAt && (
                          <div>
                            <Label className="text-muted-foreground text-xs sm:text-sm">Created At</Label>
                            <p className="font-medium text-sm sm:text-base break-words">{formatDateTimeDisplay(selectedInvestigation.createdAt)}</p>
                          </div>
                        )}
                        {selectedInvestigation.updatedAt && (
                          <div>
                            <Label className="text-muted-foreground text-xs sm:text-sm">Updated At</Label>
                            <p className="font-medium text-sm sm:text-base break-words">{formatDateTimeDisplay(selectedInvestigation.updatedAt)}</p>
                          </div>
                        )}
                      </div>
                      {selectedInvestigation.payload && (
                        <div>
                          <Label className="text-muted-foreground text-xs sm:text-sm">Investigation Data</Label>
                          {renderPayload(selectedInvestigation.payload)}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Investigation</CardTitle>
                  <CardDescription>
                    Enter annual comprehensive investigation results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientAnnual">Patient ID</Label>
                        <Input id="patientAnnual" value={formData.patientId} onChange={(e) => handleChange('patientId', e.target.value)} placeholder="Patient ID" required />
                      </div>
                      <div>
                        <Label htmlFor="dateAnnual">Date</Label>
                        <Input id="dateAnnual" type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} required />
                      </div>
                    </div>

            {/* Annual Investigation Form */}
            {(
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">1. Annual Screening Tests</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Annual Screening (summary)</Label>
                    <Input value={formData.annualScreening} onChange={(e) => handleChange('annualScreening', e.target.value)} />
                  </div>
                  <div>
                    <Label>CMV PCR</Label>
                    <Input value={formData.cmvPCR} onChange={(e) => handleChange('cmvPCR', e.target.value)} />
                  </div>
                  <div>
                    <Label>BKV PCR</Label>
                    <Input value={formData.bkvPCR} onChange={(e) => handleChange('bkvPCR', e.target.value)} />
                  </div>
                  <div>
                    <Label>EBV PCR</Label>
                    <Input value={formData.ebvPCR} onChange={(e) => handleChange('ebvPCR', e.target.value)} />
                  </div>
                  <div>
                    <Label>Hep B Surface Antigen (Hep BsAg)</Label>
                    <Input value={formData.hepBsAg} onChange={(e) => handleChange('hepBsAg', e.target.value)} />
                  </div>
                  <div>
                    <Label>Hep C Antibody (Hep C Ab)</Label>
                    <Input value={formData.hepCAb} onChange={(e) => handleChange('hepCAb', e.target.value)} />
                  </div>
                  <div>
                    <Label>HIV Antibody (HIV Ab)</Label>
                    <Input value={formData.hivAb} onChange={(e) => handleChange('hivAb', e.target.value)} />
                  </div>
                  <div>
                    <Label>Urine for Cytology</Label>
                    <Input value={formData.urineCytology} onChange={(e) => handleChange('urineCytology', e.target.value)} />
                  </div>
                  <div>
                    <Label>PTH</Label>
                    <Input value={formData.pth} onChange={(e) => handleChange('pth', e.target.value)} />
                  </div>
                  <div>
                    <Label>Vitamin D level</Label>
                    <Input value={formData.vitD} onChange={(e) => handleChange('vitD', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">2. Imaging</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>USS abdomen KUB & Pelvis / Renal Doppler</Label>
                    <Input value={formData.imagingUS_KUB_Pelvis_RenalDoppler} onChange={(e) => handleChange('imagingUS_KUB_Pelvis_RenalDoppler', e.target.value)} />
                  </div>
                  <div>
                    <Label>CXR</Label>
                    <Input value={formData.imagingCXR} onChange={(e) => handleChange('imagingCXR', e.target.value)} />
                  </div>
                  <div>
                    <Label>ECG</Label>
                    <Input value={formData.imagingECG} onChange={(e) => handleChange('imagingECG', e.target.value)} />
                  </div>
                  <div>
                    <Label>2D Echo</Label>
                    <Input value={formData.imaging2DEcho} onChange={(e) => handleChange('imaging2DEcho', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">3. Hematological and Oncology Screening</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Blood picture</Label>
                    <Input value={formData.hematologyBloodPicture} onChange={(e) => handleChange('hematologyBloodPicture', e.target.value)} />
                  </div>
                  <div>
                    <Label>Breast screen</Label>
                    <Input value={formData.breastScreen} onChange={(e) => handleChange('breastScreen', e.target.value)} />
                  </div>
                  <div>
                    <Label>PSA</Label>
                    <Input value={formData.psa} onChange={(e) => handleChange('psa', e.target.value)} />
                  </div>
                  <div>
                    <Label>Pap smear</Label>
                    <Input value={formData.papSmear} onChange={(e) => handleChange('papSmear', e.target.value)} />
                  </div>
                  <div>
                    <Label>Stools occult blood</Label>
                    <Input value={formData.stoolOccultBlood} onChange={(e) => handleChange('stoolOccultBlood', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">4. Procedures</h3>
                <div>
                  <Label>Endoscopy</Label>
                  <Input value={formData.proceduresEndoscopy} onChange={(e) => handleChange('proceduresEndoscopy', e.target.value)} />
                </div>

                <h3 className="text-lg font-semibold">5. Lipid Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Total Cholesterol (TC)</Label>
                    <Input value={formData.cholesterolTotal} onChange={(e) => handleChange('cholesterolTotal', e.target.value)} />
                  </div>
                  <div>
                    <Label>LDL</Label>
                    <Input value={formData.ldl} onChange={(e) => handleChange('ldl', e.target.value)} />
                  </div>
                  <div>
                    <Label>HDL</Label>
                    <Input value={formData.hdl} onChange={(e) => handleChange('hdl', e.target.value)} />
                  </div>
                  <div>
                    <Label>Triglycerides (TG)</Label>
                    <Input value={formData.triglycerides} onChange={(e) => handleChange('triglycerides', e.target.value)} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">6. Specialist Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Dental review</Label>
                    <Input value={formData.specialistDental} onChange={(e) => handleChange('specialistDental', e.target.value)} />
                  </div>
                  <div>
                    <Label>Ophthalmology review</Label>
                    <Input value={formData.specialistOphthalmology} onChange={(e) => handleChange('specialistOphthalmology', e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label>Additional Notes</Label>
                  <Textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
                </div>
              </div>
            )}

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/investigation')} disabled={submitting}>Cancel</Button>
                      <Button type="submit" className="flex-1" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Submit Investigation'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KTInvestigation;

