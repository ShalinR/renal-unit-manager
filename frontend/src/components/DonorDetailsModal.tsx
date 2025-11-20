import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Heart, Activity, TestTube, Stethoscope, ClipboardList, Pill, Users } from 'lucide-react';
import { DonorAssessmentForm } from '../types/donor';
import { formatDateToDDMMYYYY } from '@/lib/dateUtils';
// ERROR: These imports are missing
interface DonorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorData: DonorAssessmentForm | null;
  showAssignmentInfo?: boolean;
}

export const DonorDetailsModal: React.FC<DonorDetailsModalProps> = ({
  isOpen,
  onClose,
  donorData,
  showAssignmentInfo = false,
}) => {
  
  React.useEffect(() => {
    if (isOpen && donorData) {
      console.log('🔍 DonorDetailsModal received data:', donorData);
      console.log('📋 Name:', donorData.name);
      console.log('📋 Age:', donorData.age);
      console.log('📋 Examination data:', donorData.examination);
      console.log('📋 Immunological details:', donorData.immunologicalDetails);
    }
  }, [isOpen, donorData]);
  
    if (!donorData) {
    console.log('❌ DonorDetailsModal: No donorData provided');
    return null;
  }


  // Safe accessor functions with null checks
  const getComorbiditiesList = () => {
    const comorbidities = [];
    if (donorData.comorbidities?.dl) comorbidities.push('Dyslipidemia');
    if (donorData.comorbidities?.dm) comorbidities.push('Diabetes Mellitus');
    if (donorData.comorbidities?.htn) comorbidities.push('Hypertension');
    if (donorData.comorbidities?.ihd) comorbidities.push('Ischemic Heart Disease');
    if (donorData.comorbidities?.psychiatricIllness) comorbidities.push('Psychiatric Illness');
    return comorbidities.length > 0 ? comorbidities.join(', ') : 'None';
  };

  const getSystemicInquiryList = () => {
    const symptoms = [];
    
    // Constitutional
    if (donorData.systemicInquiry?.constitutional?.loa) symptoms.push('Loss of Appetite');
    if (donorData.systemicInquiry?.constitutional?.low) symptoms.push('Loss of Weight');
    
    // CVS
    if (donorData.systemicInquiry?.cvs?.chestPain) symptoms.push('Chest Pain');
    if (donorData.systemicInquiry?.cvs?.odema) symptoms.push('Edema');
    if (donorData.systemicInquiry?.cvs?.sob) symptoms.push('Shortness of Breath');
    
    // Respiratory
    if (donorData.systemicInquiry?.respiratory?.cough) symptoms.push('Cough');
    if (donorData.systemicInquiry?.respiratory?.hemoptysis) symptoms.push('Hemoptysis');
    if (donorData.systemicInquiry?.respiratory?.wheezing) symptoms.push('Wheezing');
    
    // GIT
    if (donorData.systemicInquiry?.git?.constipation) symptoms.push('Constipation');
    if (donorData.systemicInquiry?.git?.diarrhea) symptoms.push('Diarrhea');
    if (donorData.systemicInquiry?.git?.melena) symptoms.push('Melena');
    if (donorData.systemicInquiry?.git?.prBleeding) symptoms.push('Per Rectal Bleeding');
    
    // Renal
    if (donorData.systemicInquiry?.renal?.hematuria) symptoms.push('Hematuria');
    if (donorData.systemicInquiry?.renal?.frothyUrine) symptoms.push('Frothy Urine');
    
    // Neurological
    if (donorData.systemicInquiry?.neuro?.seizures) symptoms.push('Seizures');
    if (donorData.systemicInquiry?.neuro?.visualDisturbance) symptoms.push('Visual Disturbance');
    if (donorData.systemicInquiry?.neuro?.headache) symptoms.push('Headache');
    if (donorData.systemicInquiry?.neuro?.limbWeakness) symptoms.push('Limb Weakness');
    
    // Gynecology
    if (donorData.systemicInquiry?.gynecology?.pvBleeding) symptoms.push('PV Bleeding');
    if (donorData.systemicInquiry?.gynecology?.menopause) symptoms.push('Menopause');
    if (donorData.systemicInquiry?.gynecology?.menorrhagia) symptoms.push('Menorrhagia');
    if (donorData.systemicInquiry?.gynecology?.lrmp) symptoms.push('Last Regular Menstrual Period');
    
    return symptoms.length > 0 ? symptoms.join(', ') : 'None';
  };

  const getFamilyHistoryList = () => {
    const history = [];
    if (donorData.familyHistory?.dm) history.push(`DM: ${donorData.familyHistory.dm}`);
    if (donorData.familyHistory?.htn) history.push(`HTN: ${donorData.familyHistory.htn}`);
    if (donorData.familyHistory?.ihd) history.push(`IHD: ${donorData.familyHistory.ihd}`);
    if (donorData.familyHistory?.stroke) history.push(`Stroke: ${donorData.familyHistory.stroke}`);
    if (donorData.familyHistory?.renal) history.push(`Renal: ${donorData.familyHistory.renal}`);
    return history.length > 0 ? history.join(', ') : 'None';
  };

  const getSubstanceUseList = () => {
    const substances = [];
    if (donorData.substanceUse?.smoking) substances.push('Smoking');
    if (donorData.substanceUse?.alcohol) substances.push('Alcohol');
    if (donorData.substanceUse?.other) substances.push(donorData.substanceUse.other);
    return substances.length > 0 ? substances.join(', ') : 'None';
  };

  const getAllergyList = () => {
    const allergies = [];
    if (donorData.allergyHistory?.foods) allergies.push('Foods');
    if (donorData.allergyHistory?.drugs) allergies.push('Drugs');
    if (donorData.allergyHistory?.p) allergies.push('Environmental');
    return allergies.length > 0 ? allergies.join(', ') : 'None';
  };

  const getOralExaminationList = () => {
    const oralFindings = [];
    if (donorData.examination?.oral?.dentalCaries) oralFindings.push('Dental Caries');
    if (donorData.examination?.oral?.oralHygiene) oralFindings.push('Oral Hygiene Issues');
    if (donorData.examination?.oral?.satisfactory) oralFindings.push('Satisfactory');
    if (donorData.examination?.oral?.unsatisfactory) oralFindings.push('Unsatisfactory');
    return oralFindings.length > 0 ? oralFindings.join(', ') : 'Normal';
  };

  const getLymphNodesList = () => {
    const nodes = [];
    if (donorData.examination?.lymphNodes?.cervical) nodes.push('Cervical');
    if (donorData.examination?.lymphNodes?.axillary) nodes.push('Axillary');
    if (donorData.examination?.lymphNodes?.inguinal) nodes.push('Inguinal');
    return nodes.length > 0 ? `Enlarged: ${nodes.join(', ')}` : 'Normal';
  };

  const getRespiratoryFindings = () => {
    const findings = [];
    if (donorData.examination?.respiratory?.auscultation) findings.push('Abnormal Auscultation');
    if (donorData.examination?.respiratory?.crepts) findings.push('Crepts');
    if (donorData.examination?.respiratory?.ranchi) findings.push('Ronchi');
    if (donorData.examination?.respiratory?.effusion) findings.push('Effusion');
    return findings.length > 0 ? findings.join(', ') : 'Normal';
  };

  const getAbdominalFindings = () => {
    const findings = [];
    if (donorData.examination?.abdomen?.hepatomegaly) findings.push('Hepatomegaly');
    if (donorData.examination?.abdomen?.splenomegaly) findings.push('Splenomegaly');
    if (donorData.examination?.abdomen?.renalMasses) findings.push('Renal Masses');
    if (donorData.examination?.abdomen?.freeFluid) findings.push('Free Fluid');
    return findings.length > 0 ? findings.join(', ') : 'Normal';
  };

  const getNeurologicalFindings = () => {
    const findings = [];
    if (donorData.examination?.neurologicalExam?.cranialNerves) findings.push('Cranial Nerves Abnormal');
    if (donorData.examination?.neurologicalExam?.upperLimb) findings.push('Upper Limb Abnormal');
    if (donorData.examination?.neurologicalExam?.lowerLimb) findings.push('Lower Limb Abnormal');
    if (donorData.examination?.neurologicalExam?.coordination) findings.push('Coordination Abnormal');
    return findings.length > 0 ? findings.join(', ') : 'Normal';
  };

  const getHlaTyping = (type: 'donor' | 'recipient' | 'conclusion') => {
    const hla = donorData.immunologicalDetails?.hlaTyping?.[type];
    if (!hla) return 'N/A';
    
    return `A: ${hla.hlaA || '-'}, B: ${hla.hlaB || '-'}, C: ${hla.hlaC || '-'}, DR: ${hla.hlaDR || '-'}, DP: ${hla.hlaDP || '-'}, DQ: ${hla.hlaDQ || '-'}`;
  };

  const getStatusBadge = () => {
    const status = donorData.status || 'available';
    if (status === 'assigned') {
      return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
    }
    if (status === 'evaluating') {
      return <Badge className="bg-yellow-100 text-yellow-800">Evaluating</Badge>;
    }
    if (status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Available</Badge>;
  };

  // Helper to check if value exists and return it, otherwise return 'N/A'
  const getValue = (value: any) => {
    return value || 'N/A';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Donor Assessment Details - {getValue(donorData.name)}
            </div>
            {showAssignmentInfo && getStatusBadge()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-900">{getValue(donorData.name)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-gray-900">{getValue(donorData.age)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{getValue(donorData.gender)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{donorData.dateOfBirth ? formatDateToDDMMYYYY(donorData.dateOfBirth) : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Occupation</label>
                <p className="text-gray-900">{getValue(donorData.occupation)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">NIC Number</label>
                <p className="text-gray-900">{getValue(donorData.nicNo)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Details</label>
                <p className="text-gray-900">{getValue(donorData.contactDetails)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-gray-900">{getValue(donorData.emailAddress)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900">{getValue(donorData.address)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Relationship Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-4 h-4" />
                Relationship Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Relation to Recipient</label>
                  <p className="text-gray-900">{getValue(donorData.relationToRecipient)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Relation Type</label>
                  <p className="text-gray-900">{getValue(donorData.relationType)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Assignment</label>
                  {donorData.status === 'assigned' ? (
                    <p className="text-gray-900">Assigned to: {donorData.assignedRecipientName || donorData.assignedRecipientPhn || 'N/A'}</p>
                  ) : (
                    <p className="text-gray-900">Not assigned</p>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-4 h-4" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Chief Complaints</label>
                <p className="text-gray-900">{getValue(donorData.complains)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Comorbidities</label>
                <p className="text-gray-900">{getComorbiditiesList()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Systemic Inquiry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="w-4 h-4" />
                Systemic Inquiry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Symptoms</label>
                <p className="text-gray-900">{getSystemicInquiryList()}</p>
              </div>
              {donorData.systemicInquiry?.sexualHistory && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Sexual History</label>
                  <p className="text-gray-900">{donorData.systemicInquiry.sexualHistory}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drug & Allergy History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill className="w-4 h-4" />
                Drug & Allergy History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Current Medications</label>
                <p className="text-gray-900">{getValue(donorData.drugHistory)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Allergy History</label>
                <p className="text-gray-900">{getAllergyList()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Family History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-4 h-4" />
                Family History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Family Medical History</label>
                <p className="text-gray-900">{getFamilyHistoryList()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Substance Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-4 h-4" />
                Substance Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Substance Use History</label>
                <p className="text-gray-900">{getSubstanceUseList()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Social History */}
          {donorData.socialHistory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-4 h-4" />
                  Social History
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donorData.socialHistory.spouseDetails && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Spouse Details</label>
                    <p className="text-gray-900">{donorData.socialHistory.spouseDetails}</p>
                  </div>
                )}
                {donorData.socialHistory.childrenDetails && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Children Details</label>
                    <p className="text-gray-900">{donorData.socialHistory.childrenDetails}</p>
                  </div>
                )}
                {donorData.socialHistory.income && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                    <p className="text-gray-900">{donorData.socialHistory.income}</p>
                  </div>
                )}
                {donorData.socialHistory.other && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Other Social Information</label>
                    <p className="text-gray-900">{donorData.socialHistory.other}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Physical Examination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="w-4 h-4" />
                Physical Examination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Anthropometric Measurements */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Anthropometric Measurements</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Height (cm)</label>
                    <p className="text-gray-900">{getValue(donorData.examination?.height)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Weight (kg)</label>
                    <p className="text-gray-900">{getValue(donorData.examination?.weight)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">BMI</label>
                    <p className="text-gray-900">{getValue(donorData.examination?.bmi)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* General Examination */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">General Examination</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pallor</label>
                    <Badge variant={donorData.examination?.pallor ? 'destructive' : 'secondary'}>
                      {donorData.examination?.pallor ? 'Present' : 'Absent'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Icterus</label>
                    <Badge variant={donorData.examination?.icterus ? 'destructive' : 'secondary'}>
                      {donorData.examination?.icterus ? 'Present' : 'Absent'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Clubbing</label>
                    <Badge variant={donorData.examination?.clubbing ? 'destructive' : 'secondary'}>
                      {donorData.examination?.clubbing ? 'Present' : 'Absent'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ankle Edema</label>
                    <Badge variant={donorData.examination?.ankleOedema ? 'destructive' : 'secondary'}>
                      {donorData.examination?.ankleOedema ? 'Present' : 'Absent'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Oral Examination */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Oral Examination</h4>
                <p className="text-gray-900">{getOralExaminationList()}</p>
              </div>

              <Separator />

              {/* Lymph Nodes */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Lymph Nodes</h4>
                <p className="text-gray-900">{getLymphNodesList()}</p>
              </div>

              <Separator />

              {/* Cardiovascular System */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Cardiovascular System (CVS)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Blood Pressure</label>
                    <p className="text-gray-900">{getValue(donorData.examination?.cvs?.bp)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pulse Rate</label>
                    <p className="text-gray-900">{getValue(donorData.examination?.cvs?.pr)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Murmurs</label>
                    <Badge variant={donorData.examination?.cvs?.murmurs ? 'destructive' : 'secondary'}>
                      {donorData.examination?.cvs?.murmurs ? 'Present' : 'Absent'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Respiratory System */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Respiratory System</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Respiratory Rate</label>
                    <p className="text-gray-900">{getValue(donorData.examination?.respiratory?.rr)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">SpO2</label>
                    <p className="text-gray-900">{getValue(donorData.examination?.respiratory?.spo2)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Findings</label>
                    <p className="text-gray-900">{getRespiratoryFindings()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Abdominal Examination */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Abdominal Examination</h4>
                <p className="text-gray-900">{getAbdominalFindings()}</p>
              </div>

              <Separator />

              {/* Breast Examination */}
              {donorData.examination?.BrcostExamination && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Breast Examination</h4>
                  <p className="text-gray-900">{donorData.examination.BrcostExamination}</p>
                </div>
              )}

              <Separator />

              {/* Neurological Examination */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Neurological Examination</h4>
                <p className="text-gray-900">{getNeurologicalFindings()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Immunological Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TestTube className="w-4 h-4" />
                Immunological Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Blood Group & Cross Match */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Blood Group</label>
                  <p className="text-gray-900">
                    {donorData.immunologicalDetails?.bloodGroup?.d && donorData.immunologicalDetails?.bloodGroup?.r
                      ? `${donorData.immunologicalDetails.bloodGroup.d}${donorData.immunologicalDetails.bloodGroup.r}`
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">T-Cell Cross Match</label>
                  <p className="text-gray-900">{getValue(donorData.immunologicalDetails?.crossMatch?.tCell)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">B-Cell Cross Match</label>
                  <p className="text-gray-900">{getValue(donorData.immunologicalDetails?.crossMatch?.bCell)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Immunological Risk</label>
                  <p className="text-gray-900">{getValue(donorData.immunologicalDetails?.immunologicalRisk)}</p>
                </div>
              </div>

              <Separator />

              {/* HLA Typing */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">HLA Typing</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Donor HLA</label>
                    <p className="text-gray-900">{getHlaTyping('donor')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Recipient HLA</label>
                    <p className="text-gray-900">{getHlaTyping('recipient')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Conclusion</label>
                    <p className="text-gray-900">{getHlaTyping('conclusion')}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* PRA & DSA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">PRA Pre-transplant</label>
                  <p className="text-gray-900">{getValue(donorData.immunologicalDetails?.pra?.pre)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">PRA Post-transplant</label>
                  <p className="text-gray-900">{getValue(donorData.immunologicalDetails?.pra?.post)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">DSA (Donor Specific Antibodies)</label>
                  <p className="text-gray-900">{getValue(donorData.immunologicalDetails?.dsa)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};