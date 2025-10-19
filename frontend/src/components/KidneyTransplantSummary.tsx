import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Printer,
  ArrowLeft,
  Stethoscope,
  User,
  Calendar,
  Heart,
  Microscope,
  Activity,
  FileText
} from "lucide-react";

// Mock data for demonstration (your existing mocks)
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
    ihd: false
  },
  complains: "Fatigue, decreased urine output",
  drugHistory: "Metformin, Lisinopril",
  allergyHistory: {
    foods: false,
    drugs: true,
    p: false
  },
  familyHistory: {
    dm: "Father",
    htn: "Both parents",
    ihd: "None",
    stroke: "Maternal grandfather",
    renal: "None"
  },
  substanceUse: {
    smoking: false,
    alcohol: "Occasionally",
    other: "None"
  },
  immunologicalDetails: {
    bloodGroup: {
      d: "A",
      r: "+"
    },
    crossMatch: {
      tCell: "Negative",
      bCell: "Negative"
    },
    pra: {
      pre: "5%",
      post: "2%"
    },
    dsa: "Negative",
    immunologicalRisk: "Low"
  }
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
  recommendations: "Regular follow-up, medication adherence"
};

const mockFollowUpData = {
  date: "2023-11-15",
  postKTDuration: "1 month",
  examination: {
    bw: "70 kg",
    height: "175 cm",
    bmi: "22.9",
    bp: "120/80 mmHg"
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
    hba1c: "6.2%"
  },
  treatment: {
    prednisolone: "10 mg daily",
    tacrolimus: "3 mg twice daily",
    mmf: "500 mg twice daily",
    cotrimoxazole: "480 mg daily",
    valganciclovir: "450 mg daily",
    caCo3: "1000 mg twice daily",
    vitD: "1000 IU daily"
  }
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
      r: "+"
    },
    crossMatch: {
      tCell: "Negative",
      bCell: "Negative"
    }
  }
};

// small mockMedicalData derived from follow-up so references exist
const mockMedicalData = {
  bloodPressure: mockFollowUpData.examination.bp,
  creatinine: mockFollowUpData.investigations.sCreatinine,
  weight: mockFollowUpData.examination.bw,
  notes: mockFollowUpData.doctorsNotes
};

const KidneyTransplantSummary = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Kidney Transplant Summary - ${mockRecipientData.name}</title>
        <style>
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 25mm 20mm;
            background: white;
            -webkit-print-color-adjust: exact;
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 15px;
            margin-bottom: 35px;
          }

          .header h1 {
            color: #2c3e50;
            font-size: 28px;
            margin: 0 0 8px 0;
            font-weight: bold;
          }

          .header .patient-info {
            color: #555;
            font-size: 14px;
          }

          .section {
            margin-bottom: 40px;
            page-break-before: always;
            page-break-inside: avoid;
          }

          .section:first-of-type {
            page-break-before: auto;
          }

          .section-title {
            background-color: #2c3e50;
            color: white;
            padding: 10px 15px;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
            border-radius: 4px;
          }

          .subsection-title {
            color: #2c3e50;
            font-size: 14px;
            font-weight: bold;
            margin: 20px 0 10px 0;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }

          td {
            padding: 8px 12px;
            border-bottom: 1px solid #e0e0e0;
            vertical-align: top;
          }

          td:first-child {
            font-weight: 600;
            color: #555;
            width: 40%;
          }

          td:last-child {
            color: #333;
          }

          .grid-2, .grid-3 {
            display: grid;
            gap: 25px;
            margin-bottom: 20px;
          }

          .grid-2 {
            grid-template-columns: 1fr 1fr;
          }

          .grid-3 {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .metric-box {
            border: 2px solid #e0e0e0;
            padding: 18px;
            text-align: center;
            background-color: #f9f9f9;
            border-radius: 6px;
          }

          .metric-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 6px;
          }

          .metric-value {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
          }

          .note-box {
            background-color: #f5f5f5;
            border-left: 4px solid #2c3e50;
            padding: 15px 18px;
            margin: 15px 0 20px 0;
            line-height: 1.5;
            white-space: pre-wrap;
          }

          .footer {
            margin-top: 60px;
            padding-top: 25px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }

          @media print {
            body { margin: 0; padding: 20mm; }
            .section { margin-bottom: 30px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>KIDNEY TRANSPLANT SUMMARY</h1>
          <div class="patient-info">
            <strong>${mockRecipientData.name}</strong> |
            NIC: ${mockRecipientData.nicNo} |
            Date: ${mockFollowUpData.date}
          </div>
        </div>

        <!-- SECTION 1 -->
        <div class="section">
          <div class="section-title">Patient Information</div>
          <table>
            <tr><td>Full Name</td><td>${mockRecipientData.name}</td></tr>
            <tr><td>NIC Number</td><td>${mockRecipientData.nicNo}</td></tr>
            <tr><td>Gender</td><td>${mockRecipientData.gender}</td></tr>
            <tr><td>Age</td><td>${mockRecipientData.age}</td></tr>
            <tr><td>Address</td><td>${mockRecipientData.address}</td></tr>
            <tr><td>Phone</td><td>${mockRecipientData.contactDetails}</td></tr>
          </table>
        </div>

        <!-- SECTION 2 -->
        <div class="section">
          <div class="section-title">Donor Information</div>
          <table>
            <tr><td>Donor Name</td><td>${mockDonorData.name}</td></tr>
            <tr><td>Relationship</td><td>${mockDonorData.relationToRecipient}</td></tr>
            <tr><td>Blood Type</td><td>${mockDonorData.immunologicalDetails.bloodGroup.d}${mockDonorData.immunologicalDetails.bloodGroup.r}</td></tr>
            <tr><td>T cell cross match</td><td>${mockDonorData.immunologicalDetails.crossMatch.tCell}</td></tr>
            <tr><td>B cell cross match</td><td>${mockDonorData.immunologicalDetails.crossMatch.bCell}</td></tr>
            <tr><td>Contact</td><td>${mockDonorData.contactDetails}</td></tr>
          </table>
        </div>

        <!-- SECTION 3 -->
        <div class="section">
          <div class="section-title">Transplant Details</div>
          <table>
            <tr><td>Transplant Date</td><td>${mockKTSurgeryData.ktDate}</td></tr>
            <tr><td>Transplant Type</td><td>${mockKTSurgeryData.ktType}</td></tr>
            <tr><td>Surgeon</td><td>${mockKTSurgeryData.ktSurgeon}</td></tr>
            <tr><td>Unit</td><td>${mockKTSurgeryData.ktUnit}</td></tr>
            <tr><td>Side</td><td>${mockKTSurgeryData.sideOfKT}</td></tr>
            <tr><td>Donor Relationship</td><td>${mockKTSurgeryData.donorRelationship}</td></tr>
          </table>
        </div>

        <!-- SECTION 4 -->
        <div class="section">
          <div class="section-title">Medical Information</div>
          <div class="grid-3">
            <div class="metric-box">
              <div class="metric-label">Blood Pressure</div>
              <div class="metric-value">${mockMedicalData.bloodPressure}</div>
            </div>
            <div class="metric-box">
              <div class="metric-label">Creatinine</div>
              <div class="metric-value">${mockMedicalData.creatinine}</div>
            </div>
            <div class="metric-box">
              <div class="metric-label">Weight</div>
              <div class="metric-value">${mockMedicalData.weight}</div>
            </div>
          </div>
          <div class="note-box">${mockMedicalData.notes}</div>
        </div>

        <!-- SECTION 5 -->
        <div class="section">
          <div class="section-title">Follow-up Summary</div>
          <table>
            <tr><td>Last Follow-up</td><td>${mockFollowUpData.date}</td></tr>
            <tr><td>Post-KT Duration</td><td>${mockFollowUpData.postKTDuration}</td></tr>
            <tr><td>Medications</td><td>${mockFollowUpData.treatment.prednisolone}, ${mockFollowUpData.treatment.tacrolimus}, ${mockFollowUpData.treatment.mmf}</td></tr>
            <tr><td>Doctor's Notes</td><td>${mockFollowUpData.doctorsNotes}</td></tr>
          </table>
        </div>

        <div class="footer">
          <p><strong>Kidney Transplant Summary Report</strong></p>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>This is a confidential medical document</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeName = String(mockRecipientData.name || "recipient").replace(/\s+/g, "-");
    link.download = `Kidney-Transplant-Summary-${safeName}-${new Date().toISOString().split("T")[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const formatComorbidities = (comorbidities) => {
    if (!comorbidities) return "None";

    const activeComorbidities = Object.entries(comorbidities)
      .filter(([key, value]) => value === true && key !== "duration")
      .map(([key]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        return formattedKey;
      });

    return activeComorbidities.length > 0 ? activeComorbidities.join(", ") : "None";
  };

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <Card className={`border border-gray-200 bg-white ${className}`}>
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-gray-900 text-base font-semibold">
          <Icon className="w-5 h-5 text-gray-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );

  const DataRow = ({ label, value, className = "" }) => (
    <div className={`flex justify-between items-start py-2.5 ${className}`}>
      <span className="text-gray-600 text-sm min-w-0 flex-1">{label}</span>
      <span className="text-gray-900 text-sm font-medium ml-4 text-right">{value || "—"}</span>
    </div>
  );

  const KeyMetric = ({ label, value, unit = "", status = "normal" }) => {
    const statusColors = {
      normal: "bg-gray-50 border-gray-200",
      warning: "bg-amber-50 border-amber-200",
      critical: "bg-red-50 border-red-200"
    };

    return (
      <div className={`rounded-lg p-4 border ${statusColors[status]}`}>
        <div className="text-gray-600 text-xs font-medium mb-2">{label}</div>
        <div className="text-gray-900 text-lg font-semibold">
          {value} <span className="text-sm font-normal text-gray-600">{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 -mx-8 px-8 py-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Stethoscope className="w-6 h-6 text-gray-700" />
                <h1 className="text-2xl font-semibold text-gray-900">Kidney Transplant Summary</h1>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{mockRecipientData.name}</span>
                <span className="mx-2">•</span>
                <span>NIC: {mockRecipientData.nicNo}</span>
                <span className="mx-2">•</span>
                <span>Last Updated: {mockFollowUpData.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/dashboard")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" size="sm" onClick={handlePrint} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Patient Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InfoCard icon={User} title="Patient Information">
              <div className="space-y-1">
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
              <div className="space-y-1">
                <DataRow label="Primary Complaint" value={mockRecipientData.complains} />
                <DataRow label="Comorbidities" value={formatComorbidities(mockRecipientData.comorbidities)} />
                <DataRow label="Occupation" value={mockRecipientData.occupation} />
                <DataRow label="Drug History" value={mockRecipientData.drugHistory} />
                <DataRow
                  label="Known Allergies"
                  value={
                    mockRecipientData.allergyHistory
                      ? Object.entries(mockRecipientData.allergyHistory)
                          .filter(([key, value]) => value === true)
                          .map(([key]) => key)
                          .join(", ") || "None"
                      : "None"
                  }
                />
              </div>
            </InfoCard>

            <InfoCard icon={Activity} title="Key Metrics">
              <div className="grid grid-cols-2 gap-3">
                <KeyMetric label="Current Creatinine" value={mockFollowUpData.investigations.sCreatinine} unit="mg/dL" status="normal" />
                <KeyMetric label="eGFR" value={mockFollowUpData.investigations.eGFR} unit="mL/min" status="normal" />
                <KeyMetric label="Tacrolimus Level" value={mockFollowUpData.investigations.tacrolimus} unit="ng/mL" status="normal" />
                <KeyMetric label="HbA1c" value={mockFollowUpData.investigations.hba1c} status="normal" />
              </div>
            </InfoCard>
          </div>

          {/* Transplantation Details */}
          <InfoCard icon={Calendar} title="Transplantation Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Surgery Details</h4>
                <div className="space-y-1">
                  <DataRow label="Date" value={mockKTSurgeryData.ktDate} />
                  <DataRow label="Type" value={mockKTSurgeryData.ktType} />
                  <DataRow label="Unit" value={mockKTSurgeryData.ktUnit} />
                  <DataRow label="Surgeon" value={mockKTSurgeryData.ktSurgeon} />
                  <DataRow label="Side" value={mockKTSurgeryData.sideOfKT} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Pre-Transplant</h4>
                <div className="space-y-1">
                  <DataRow label="Primary Diagnosis" value={mockKTSurgeryData.primaryDiagnosis} />
                  <DataRow label="RRT Mode" value={mockKTSurgeryData.modeOfRRT} />
                  <DataRow label="RRT Duration" value={mockKTSurgeryData.durationRRT} />
                  <DataRow label="Pre-KT Creatinine" value={`${mockKTSurgeryData.preKTCreatinine} mg/dL`} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Outcomes</h4>
                <div className="space-y-1">
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
              <div className="space-y-5">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Induction & Maintenance</h4>
                  <div className="space-y-1">
                    <DataRow label="Pre-KT" value={mockKTSurgeryData.preKT} />
                    <DataRow label="Induction Therapy" value={mockKTSurgeryData.inductionTherapy} />
                    <DataRow label="Maintenance" value={mockKTSurgeryData.maintenance} />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Current Medications</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-900">{mockKTSurgeryData.currentMeds}</p>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard icon={FileText} title="Prophylaxis & Vaccination">
              <div className="space-y-5">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Prophylactic Medications</h4>
                  <div className="space-y-1">
                    <DataRow label="Cotrimoxazole" value={`${mockKTSurgeryData.cotrimoxazole} (${mockKTSurgeryData.cotriDuration})`} />
                    <DataRow label="Valganciclovir" value={`${mockKTSurgeryData.valganciclovir} (${mockKTSurgeryData.valganDuration})`} />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Vaccinations</h4>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-900">{mockKTSurgeryData.vaccination}</p>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Latest Follow-up */}
          <InfoCard icon={Activity} title="Latest Follow-up Assessment">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Physical Examination</h4>
                <div className="space-y-1">
                  <DataRow label="Date" value={mockFollowUpData.date} />
                  <DataRow label="Post-KT Duration" value={mockFollowUpData.postKTDuration} />
                  <DataRow label="Weight" value={mockFollowUpData.examination.bw} />
                  <DataRow label="BMI" value={mockFollowUpData.examination.bmi} />
                  <DataRow label="Blood Pressure" value={mockFollowUpData.examination.bp} />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Laboratory Results</h4>
                <div className="grid grid-cols-2 gap-3">
                  <KeyMetric label="Na+" value={mockFollowUpData.investigations.seNa} unit="mmol/L" status="normal" />
                  <KeyMetric label="K+" value={mockFollowUpData.investigations.seK} unit="mmol/L" status="normal" />
                  <KeyMetric label="Hemoglobin" value={mockFollowUpData.investigations.seHb} unit="g/dL" status="normal" />
                  <KeyMetric label="Proteinuria" value={mockFollowUpData.investigations.urinePCR} unit="g/g" status="normal" />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Clinical Notes</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{mockFollowUpData.doctorsNotes}</p>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2 text-sm">Current Treatment</h5>
                  <div className="text-xs text-gray-600 space-y-1.5">
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
              <div className="space-y-1">
                <DataRow label="Name" value={mockDonorData.name} />
                <DataRow label="Age" value={`${mockDonorData.age} years`} />
                <DataRow label="Relation" value={mockDonorData.relationToRecipient} />
                <DataRow label="Contact" value={mockDonorData.contactDetails} />
                <DataRow label="Blood Group" value={`${mockDonorData.immunologicalDetails.bloodGroup.d}${mockDonorData.immunologicalDetails.bloodGroup.r}`} />
              </div>
            </InfoCard>

            <InfoCard icon={Microscope} title="Immunological Compatibility">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 text-sm">Recipient</h5>
                  <div className="space-y-1">
                    <DataRow label="Blood Group" value={`${mockRecipientData.immunologicalDetails.bloodGroup.d}${mockRecipientData.immunologicalDetails.bloodGroup.r}`} />
                    <DataRow label="PRA (Pre)" value={mockRecipientData.immunologicalDetails.pra.pre} />
                    <DataRow label="DSA" value={mockRecipientData.immunologicalDetails.dsa} />
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 text-sm">Compatibility</h5>
                  <div className="space-y-1">
                    <DataRow label="T Cell Match" value={mockDonorData.immunologicalDetails.crossMatch.tCell} />
                    <DataRow label="B Cell Match" value={mockDonorData.immunologicalDetails.crossMatch.bCell} />
                    <DataRow label="Risk Level" value={mockRecipientData.immunologicalDetails.immunologicalRisk} />
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidneyTransplantSummary;
