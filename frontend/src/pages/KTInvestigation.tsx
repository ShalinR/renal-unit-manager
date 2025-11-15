import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowLeft, Loader2 } from "lucide-react";
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

const KTInvestigation = () => {
  const navigate = useNavigate();
  const { patient, globalPatient } = usePatientContext();
  const [mode, setMode] = useState<'standard' | 'annual'>('standard');
  const [submitting, setSubmitting] = useState(false);
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
    }
  }, [globalPatient, patient]);

  const handleChange = (field: keyof StandardInvestigationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      navigate('/investigation');
    } catch (error) {
      console.error('Error saving investigation:', error);
      alert('Failed to save investigation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/investigation')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Kidney Transplant Investigation</h1>
          </div>
        </div>
        {(globalPatient || patient)?.phn && (
          <div className="text-sm text-green-700 bg-green-100 px-4 py-2 rounded">
            <strong>Patient:</strong> {(globalPatient || patient)?.name} (PHN: {(globalPatient || patient)?.phn})
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant={mode === 'standard' ? 'default' : 'ghost'} onClick={() => setMode('standard')}>Standard Investigation</Button>
        <Button variant={mode === 'annual' ? 'default' : 'ghost'} onClick={() => setMode('annual')}>Annual Investigation</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{mode === 'standard' ? 'Standard Investigation' : 'Annual Investigation'}</CardTitle>
          <CardDescription>
            {mode === 'standard'
              ? 'Enter the standard panel of tests for routine follow-up'
              : 'Enter annual comprehensive investigation results'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Patient ID</Label>
                <Input id="patient" value={formData.patientId} onChange={(e) => handleChange('patientId', e.target.value)} placeholder="Patient ID" required />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} required />
              </div>
            </div>

            {/* Standard - divided into logical sections */}
            {mode === 'standard' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">1. Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                  </div>
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

            {/* Annual - full panel as requested by user */}
            {mode === 'annual' && (
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
    </div>
  );
};

export default KTInvestigation;

