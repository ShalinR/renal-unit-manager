import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft, Stethoscope, User, Calendar, Heart, Microscope, Activity, FileText } from "lucide-react";

// Mock data for demonstration
const mockRecipientData = {
  name: "Sarath Wijenayake",
  age: "45",
  gender: "Male",
  dateOfBirth: "1978-05-15",
  occupation: "Accountant",
  address: "123 Main St, Colombo",
  nicNo: "781234567V",
  contactDetails: "0771234567",
  emailAddress: "saarath@email.com",
  relationToRecipient: "Self",
  relationType: "Self",
  comorbidities: {
    dm: true,
    duration: "5 years",
    psychiatricIllness: false,
    htn: true,
    ihd: false,
  },
  complains: "Fatigue, decreased urine output",
  drugHistory: "Metformin, Lisinopril",
  allergyHistory: {
    foods: false,
    drugs: true,
    p: false,
  },
  familyHistory: {
    dm: "Father",
    htn: "Both parents",
    ihd: "None",
    stroke: "Maternal grandfather",
    renal: "None",
  },
  substanceUse: {
    smoking: false,
    alcohol: "Occasionally",
    other: "None",
  },
  immunologicalDetails: {
    bloodGroup: {
      d: "A",
      r: "+",
    },
    crossMatch: {
      tCell: "Negative",
      bCell: "Negative",
    },
    pra: {
      pre: "5%",
      post: "2%",
    },
    dsa: "Negative",
    immunologicalRisk: "Low",
  },
};

const mockKTSurgeryData = {
  name: "Sarath Wijenayake",
  dob: "1978-05-15",
  age: "45",
  gender: "Male",
  address: "123 Main St, Colombo",
  contact: "0771234567",
  diabetes: "Yes",
  hypertension: "Yes",
  ihd: "No",
  dyslipidaemia: "No",
  other: "No",
  primaryDiagnosis: "Diabetic nephropathy",
  modeOfRRT: "HD",
  durationRRT: "2 years",
  ktDate: "2023-10-15",
  numberOfKT: "1",
  ktUnit: "NHK",
  ktSurgeon: "Dr. Rajitha Abeysekara",
  ktType: "Live related",
  donorRelationship: "Brother",
  peritonealPosition: "Extraperitoneal",
  sideOfKT: "Right",
  preKT: "None",
  inductionTherapy: "Basiliximab",
  maintenance: "Tac",
  cotrimoxazole: "Yes",
  cotriDuration: "6 months",
  valganciclovir: "Yes",
  valganDuration: "3 months",
  vaccination: "COVID, Influenza",
  preKTCreatinine: "5.2",
  postKTCreatinine: "1.4",
  delayedGraft: "No",
  postKTDialysis: "No",
  acuteRejection: "No",
  currentMeds: "Tacrolimus, MMF, Prednisolone",
  recommendations: "Regular follow-up, medication adherence",
};

const mockFollowUpData = {
  date: "2023-11-15",
  postKTDuration: "1 month",
  examination: {
    bw: "70 kg",
    height: "175 cm",
    bmi: "22.9",
    bp: "120/80 mmHg",
  },
  doctorsNotes: "Patient doing well, no complaints",
  investigations: {
    tacrolimus: "8.2 ng/mL",
    sCreatinine: "1.3 mg/dL",
    eGFR: "65 mL/min",
    seNa: "140 mmol/L",
    seK: "4.2 mmol/L",
    seHb: "12.5 g/dL",
    urinePCR: "0.15 g/g",
    hba1c: "6.2%",
  },
  treatment: {
    prednisolone: "10 mg daily",
    tacrolimus: "3 mg twice daily",
    mmf: "500 mg twice daily",
    cotrimoxazole: "480 mg daily",
    valganciclovir: "450 mg daily",
    caCo3: "1000 mg twice daily",
    vitD: "1000 IU daily",
  },
};

const mockDonorData = {
  name: "Nimal Wijenayake",
  age: "40",
  gender: "Male",
  dateOfBirth: "1983-02-20",
  occupation: "Engineer",
  address: "456 Oak St, Colombo",
  nicNo: "832345678V",
  contactDetails: "0777654321",
  relationToRecipient: "Brother",
  immunologicalDetails: {
    bloodGroup: {
      d: "A",
      r: "+",
    },
    crossMatch: {
      tCell: "Negative",
      bCell: "Negative",
    },
  },
};

const KidneyTransplantSummary = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const data = {
      donor: mockDonorData,
      recipient: mockRecipientData,
      ktSurgery: mockKTSurgeryData,
      followUp: mockFollowUpData
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `kidney-transplant-summary-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatComorbidities = (comorbidities) => {
    if (!comorbidities) return "None";
    
    const activeComorbidities = Object.entries(comorbidities)
      .filter(([key, value]) => value === true && key !== 'duration')
      .map(([key]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        return formattedKey;
      });
    
    return activeComorbidities.length > 0 ? activeComorbidities.join(", ") : "None";
  };

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-blue-900 text-lg font-medium">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );

  const DataRow = ({ label, value, className = "" }) => (
    <div className={`flex justify-between items-start py-2 border-b border-gray-50 last:border-0 ${className}`}>
      <span className="text-gray-600 text-sm font-medium min-w-0 flex-1">{label}</span>
      <span className="text-gray-900 text-sm ml-4 text-right">{value || "—"}</span>
    </div>
  );

  const KeyMetric = ({ label, value, unit = "", status = "normal" }) => {
    const statusColors = {
      normal: "text-blue-600 bg-blue-50",
      warning: "text-amber-600 bg-amber-50",
      critical: "text-red-600 bg-red-50"
    };

    return (
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="text-gray-600 text-xs font-medium mb-1">{label}</div>
        <div className={`text-lg font-semibold px-2 py-1 rounded-lg ${statusColors[status]}`}>
          {value} {unit}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-1">Kidney Transplant Summary</h1>
                <p className="text-gray-500">Patient: {mockRecipientData.name} • ID: {mockRecipientData.nicNo}</p>
              </div>
            </div>

            {/* Back to Dashboard Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.location.href = "/dashboard"} 
        className="border-blue-200 text-blue-600 hover:bg-blue-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleExport} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Patient Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InfoCard icon={User} title="Patient Information">
            <div className="space-y-3">
              <DataRow label="Full Name" value={mockRecipientData.name} />
              <DataRow label="Age" value={`${mockRecipientData.age} years`} />
              <DataRow label="Gender" value={mockRecipientData.gender} />
              <DataRow label="Date of Birth" value={mockRecipientData.dateOfBirth} />
              <DataRow label="NIC Number" value={mockRecipientData.nicNo} />
              <DataRow label="Contact" value={mockRecipientData.contactDetails} />
              <DataRow label="Email" value={mockRecipientData.emailAddress} />
            </div>
          </InfoCard>

          <InfoCard icon={Heart} title="Medical Background">
            <div className="space-y-3">
              <DataRow label="Primary Complaint" value={mockRecipientData.complains} />
              <DataRow label="Comorbidities" value={formatComorbidities(mockRecipientData.comorbidities)} />
              <DataRow label="Occupation" value={mockRecipientData.occupation} />
              <DataRow label="Drug History" value={mockRecipientData.drugHistory} />
              <DataRow label="Known Allergies" value={
                mockRecipientData.allergyHistory ? 
                  Object.entries(mockRecipientData.allergyHistory)
                    .filter(([key, value]) => value === true)
                    .map(([key]) => key)
                    .join(", ") || "None" 
                  : "None"
              } />
            </div>
          </InfoCard>

          <InfoCard icon={Activity} title="Key Metrics">
            <div className="grid grid-cols-2 gap-3">
              <KeyMetric 
                label="Current Creatinine" 
                value={mockFollowUpData.investigations.sCreatinine} 
                unit="mg/dL"
                status="normal"
              />
              <KeyMetric 
                label="eGFR" 
                value={mockFollowUpData.investigations.eGFR} 
                unit="mL/min"
                status="normal"
              />
              <KeyMetric 
                label="Tacrolimus Level" 
                value={mockFollowUpData.investigations.tacrolimus} 
                unit="ng/mL"
                status="normal"
              />
              <KeyMetric 
                label="HbA1c" 
                value={mockFollowUpData.investigations.hba1c}
                status="normal"
              />
            </div>
          </InfoCard>
        </div>

        {/* Transplantation Details */}
        <InfoCard icon={Calendar} title="Transplantation Overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Surgery Details</h4>
              <div className="space-y-2">
                <DataRow label="Date" value={mockKTSurgeryData.ktDate} />
                <DataRow label="Type" value={mockKTSurgeryData.ktType} />
                <DataRow label="Unit" value={mockKTSurgeryData.ktUnit} />
                <DataRow label="Surgeon" value={mockKTSurgeryData.ktSurgeon} />
                <DataRow label="Side" value={mockKTSurgeryData.sideOfKT} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Pre-Transplant</h4>
              <div className="space-y-2">
                <DataRow label="Primary Diagnosis" value={mockKTSurgeryData.primaryDiagnosis} />
                <DataRow label="RRT Mode" value={mockKTSurgeryData.modeOfRRT} />
                <DataRow label="RRT Duration" value={mockKTSurgeryData.durationRRT} />
                <DataRow label="Pre-KT Creatinine" value={`${mockKTSurgeryData.preKTCreatinine} mg/dL`} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Outcomes</h4>
              <div className="space-y-2">
                <DataRow label="Post-KT Creatinine" value={`${mockKTSurgeryData.postKTCreatinine} mg/dL`} />
                <DataRow label="Delayed Graft Function" value={mockKTSurgeryData.delayedGraft} />
                <DataRow label="Post-KT Dialysis" value={mockKTSurgeryData.postKTDialysis} />
                <DataRow label="Acute Rejection" value={mockKTSurgeryData.acuteRejection} />
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Immunosuppression & Prophylaxis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard icon={Microscope} title="Immunosuppression Protocol">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Induction & Maintenance</h4>
                <div className="space-y-2">
                  <DataRow label="Pre-KT" value={mockKTSurgeryData.preKT} />
                  <DataRow label="Induction Therapy" value={mockKTSurgeryData.inductionTherapy} />
                  <DataRow label="Maintenance" value={mockKTSurgeryData.maintenance} />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Current Medications</h4>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-900">{mockKTSurgeryData.currentMeds}</p>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={FileText} title="Prophylaxis & Vaccination">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Prophylactic Medications</h4>
                <div className="space-y-2">
                  <DataRow label="Cotrimoxazole" value={`${mockKTSurgeryData.cotrimoxazole} (${mockKTSurgeryData.cotriDuration})`} />
                  <DataRow label="Valganciclovir" value={`${mockKTSurgeryData.valganciclovir} (${mockKTSurgeryData.valganDuration})`} />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Vaccinations</h4>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800">{mockKTSurgeryData.vaccination}</p>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Latest Follow-up */}
        <InfoCard icon={Activity} title="Latest Follow-up Assessment">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Physical Examination</h4>
              <div className="space-y-2">
                <DataRow label="Date" value={mockFollowUpData.date} />
                <DataRow label="Post-KT Duration" value={mockFollowUpData.postKTDuration} />
                <DataRow label="Weight" value={mockFollowUpData.examination.bw} />
                <DataRow label="BMI" value={mockFollowUpData.examination.bmi} />
                <DataRow label="Blood Pressure" value={mockFollowUpData.examination.bp} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Laboratory Results</h4>
              <div className="grid grid-cols-2 gap-2">
                <KeyMetric 
                  label="Na+" 
                  value={mockFollowUpData.investigations.seNa} 
                  unit="mmol/L"
                  status="normal"
                />
                <KeyMetric 
                  label="K+" 
                  value={mockFollowUpData.investigations.seK} 
                  unit="mmol/L"
                  status="normal"
                />
                <KeyMetric 
                  label="Hemoglobin" 
                  value={mockFollowUpData.investigations.seHb} 
                  unit="g/dL"
                  status="normal"
                />
                <KeyMetric 
                  label="Proteinuria" 
                  value={mockFollowUpData.investigations.urinePCR} 
                  unit="g/g"
                  status="normal"
                />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Clinical Notes</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900 leading-relaxed">{mockFollowUpData.doctorsNotes}</p>
              </div>
              <div className="mt-3">
                <h5 className="font-medium text-gray-700 mb-2">Current Treatment</h5>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Prednisolone: {mockFollowUpData.treatment.prednisolone}</div>
                  <div>• Tacrolimus: {mockFollowUpData.treatment.tacrolimus}</div>
                  <div>• MMF: {mockFollowUpData.treatment.mmf}</div>
                </div>
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Donor & Immunological Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard icon={User} title="Donor Information">
            <div className="space-y-3">
              <DataRow label="Name" value={mockDonorData.name} />
              <DataRow label="Age" value={`${mockDonorData.age} years`} />
              <DataRow label="Relation" value={mockDonorData.relationToRecipient} />
              <DataRow label="Contact" value={mockDonorData.contactDetails} />
              <DataRow label="Blood Group" value={`${mockDonorData.immunologicalDetails.bloodGroup.d}${mockDonorData.immunologicalDetails.bloodGroup.r}`} />
            </div>
          </InfoCard>

          <InfoCard icon={Microscope} title="Immunological Compatibility">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Recipient</h5>
                  <div className="space-y-1 text-sm">
                    <DataRow label="Blood Group" value={`${mockRecipientData.immunologicalDetails.bloodGroup.d}${mockRecipientData.immunologicalDetails.bloodGroup.r}`} />
                    <DataRow label="PRA (Pre)" value={mockRecipientData.immunologicalDetails.pra.pre} />
                    <DataRow label="DSA" value={mockRecipientData.immunologicalDetails.dsa} />
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Compatibility</h5>
                  <div className="space-y-1 text-sm">
                    <DataRow label="T Cell Match" value={mockDonorData.immunologicalDetails.crossMatch.tCell} />
                    <DataRow label="B Cell Match" value={mockDonorData.immunologicalDetails.crossMatch.bCell} />
                    <DataRow label="Risk Level" value={mockRecipientData.immunologicalDetails.immunologicalRisk} />
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default KidneyTransplantSummary;