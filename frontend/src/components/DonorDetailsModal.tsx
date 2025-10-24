import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Heart, Activity, TestTube, Stethoscope } from 'lucide-react';
import { DonorAssessmentForm } from '../types/donor';

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
  if (!donorData) return null;

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
    if (donorData.allergyHistory?.p) allergies.push('Penicillin');
    return allergies.length > 0 ? allergies.join(', ') : 'None';
  };

  const getStatusBadge = () => {
    return <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Donor Assessment Details - {donorData.name}
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
                <p className="text-gray-900">{donorData.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-gray-900">{donorData.age || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{donorData.gender || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{donorData.dateOfBirth || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Occupation</label>
                <p className="text-gray-900">{donorData.occupation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">NIC Number</label>
                <p className="text-gray-900">{donorData.nicNo || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Details</label>
                <p className="text-gray-900">{donorData.contactDetails || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-gray-900">{donorData.emailAddress || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900">{donorData.address || 'N/A'}</p>
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
                <p className="text-gray-900">{donorData.relationToRecipient || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Relation Type</label>
                <p className="text-gray-900">{donorData.relationType || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-4 h-4" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Comorbidities</label>
                <p className="text-gray-900">{getComorbiditiesList()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Current Complaints</label>
                <p className="text-gray-900">{donorData.complains || 'None'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Systemic Inquiry</label>
                <p className="text-gray-900">{getSystemicInquiryList()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Drug History</label>
                <p className="text-gray-900">{donorData.drugHistory || 'None'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Allergy History</label>
                <p className="text-gray-900">{getAllergyList()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Family History</label>
                <p className="text-gray-900">{getFamilyHistoryList()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Substance Use</label>
                <p className="text-gray-900">{getSubstanceUseList()}</p>
              </div>
              {donorData.systemicInquiry?.sexualHistory && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Sexual History</label>
                  <p className="text-gray-900">{donorData.systemicInquiry.sexualHistory}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Physical Examination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="w-4 h-4" />
                Physical Examination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Height (cm)</label>
                  <p className="text-gray-900">{donorData.examination?.height || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Weight (kg)</label>
                  <p className="text-gray-900">{donorData.examination?.weight || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">BMI</label>
                  <p className="text-gray-900">{donorData.examination?.bmi || 'N/A'}</p>
                </div>
              </div>

              <Separator />

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

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Blood Pressure</label>
                  <p className="text-gray-900">{donorData.examination?.cvs?.bp || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Pulse Rate</label>
                  <p className="text-gray-900">{donorData.examination?.cvs?.pr || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Respiratory Rate</label>
                  <p className="text-gray-900">{donorData.examination?.respiratory?.rr || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">SpO2</label>
                  <p className="text-gray-900">{donorData.examination?.respiratory?.spo2 || 'N/A'}</p>
                </div>
              </div>

              {donorData.examination?.BrcostExamination && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Breast Examination</label>
                  <p className="text-gray-900">{donorData.examination.BrcostExamination}</p>
                </div>
              )}
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
            <CardContent className="space-y-4">
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
                  <p className="text-gray-900">{donorData.immunologicalDetails?.crossMatch?.tCell || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">B-Cell Cross Match</label>
                  <p className="text-gray-900">{donorData.immunologicalDetails?.crossMatch?.bCell || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Immunological Risk</label>
                  <p className="text-gray-900">{donorData.immunologicalDetails?.immunologicalRisk || 'N/A'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-600">DSA (Donor Specific Antibodies)</label>
                <p className="text-gray-900">{donorData.immunologicalDetails?.dsa || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">PRA Pre-transplant</label>
                  <p className="text-gray-900">{donorData.immunologicalDetails?.pra?.pre || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">PRA Post-transplant</label>
                  <p className="text-gray-900">{donorData.immunologicalDetails?.pra?.post || 'N/A'}</p>
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