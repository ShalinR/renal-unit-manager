import React, { useEffect, useState } from "react";
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
  FileText,
} from "lucide-react";
import { formatDateToDDMMYYYY, formatTimeDisplay } from "@/lib/dateUtils";
import { getPatientProfile } from "../services/patientProfileApi";
import { usePatientContext } from "../context/PatientContext";

import type { ActiveView } from "../pages/KidneyTransplant";

/**
 * Local (narrow) type for RecipientAssessmentForm to satisfy usage in this component.
 * The component only accesses `comorbidities`, so keep the type minimal and safe.
 */
type RecipientAssessmentForm = {
  comorbidities?: Record<string, boolean | undefined | any>;
};

interface KidneyTransplantSummaryProps {
  setActiveView: (view: ActiveView) => void;
}

const KidneyTransplantSummary: React.FC<KidneyTransplantSummaryProps> = ({
  setActiveView,
}) => {
  const { patient } = usePatientContext();
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatientProfile = async () => {
      if (!patient?.phn) {
        console.error("❌ No patient PHN found in context:", patient);
        setError("No patient selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`📋 KidneyTransplantSummary: Loading complete profile for PHN: ${patient.phn}`);
        const profile = await getPatientProfile(patient.phn);

        if (profile) {
          console.log("✅ KidneyTransplantSummary: Profile loaded successfully", profile);
          console.log("Profile structure:", {
            name: profile.name,
            phn: profile.phn,
            hasRecipientAssessment: !!profile.recipientAssessment,
            hasDonorAssessment: !!profile.donorAssessment,
            hasKtSurgery: !!profile.ktSurgery,
            followUpCount: profile.followUps?.length || 0,
          });
          setPatientProfile(profile);
          setError(null);
        } else {
          console.error("❌ Profile is null");
          setError("Patient profile not found");
        }
      } catch (err) {
        console.error("❌ KidneyTransplantSummary: Error loading profile:", err);
        setError(`Failed to load patient profile: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    loadPatientProfile();
  }, [patient?.phn]);

  const handlePrint = () => {
    window.print();
  };

  // If data is not yet loaded, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading Patient Summary...
        </div>
      </div>
    );
  }

  // If error occurred, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-700 mb-4">{error}</div>
          <Button
            onClick={() => setActiveView("dashboard")}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // If data is not yet loaded, show a loading state
  if (!patientProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading Patient Summary...
        </div>
      </div>
    );
  }

  // Destructure the data from the patientProfile prop
  const {
    patient: recipientData = patientProfile,
    donor: donorData = patientProfile.donorAssessment,
    ktSurgery: ktSurgeryData = patientProfile.ktSurgery,
    followUps = patientProfile.followUps || [],
    recipientAssessment = {},
    name,
    nic: nicNo = patientProfile.nicNo,
  } = patientProfile || {};

  // Safely extract and merge all patient data
  const finalRecipientData = {
    id: patientProfile.patientId,
    phn: patientProfile.phn || patient?.phn,
    name: patientProfile.name,
    age: patientProfile.age,
    gender: patientProfile.gender,
    dateOfBirth: patientProfile.dateOfBirth,
    occupation: patientProfile.occupation,
    address: patientProfile.address,
    nicNo: patientProfile.nicNo,
    contactDetails: patientProfile.contactDetails,
    emailAddress: patientProfile.emailAddress,
  };

  const finalDonorData = patientProfile.donorAssessment || {};
  const finalKTSurgeryData = patientProfile.ktSurgery || {};
  const finalFollowUps = patientProfile.followUps || [];

  // Use the latest follow-up for summary details
  const latestFollowUp =
    finalFollowUps && finalFollowUps.length > 0 ? finalFollowUps[finalFollowUps.length - 1] : {};

  const handleExport = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Kidney Transplant Summary - ${finalRecipientData.name}</title>
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
            <strong>${safeGet(finalRecipientData.name)}</strong> |
            NIC: ${safeGet(finalRecipientData.nicNo)} |
            Date: ${safeGet(formatDateToDDMMYYYY(latestFollowUp?.date))}
          </div>
        </div>

        <!-- SECTION 1 -->
        <div class="section">
          <div class="section-title">Patient Information</div>
          <table>
            <tr><td>Full Name</td><td>${safeGet(finalRecipientData.name)}</td></tr>
            <tr><td>NIC Number</td><td>${safeGet(finalRecipientData.nicNo)}</td></tr>
            <tr><td>Gender</td><td>${safeGet(finalRecipientData.gender)}</td></tr>
            <tr><td>Age</td><td>${safeGet(finalRecipientData.age)}</td></tr>
            <tr><td>Address</td><td>${safeGet(finalRecipientData.address)}</td></tr>
            <tr><td>Phone</td><td>${safeGet(finalRecipientData.contactDetails)}</td></tr>
          </table>
        </div>

        <!-- SECTION 2 -->
        <div class="section">
          <div class="section-title">Donor Information</div>
          <table>
            <tr><td>Donor Name</td><td>${safeGet(finalDonorData?.name)}</td></tr>
            <tr><td>Relationship</td><td>${safeGet(finalDonorData?.relationToRecipient)}</td></tr>
            <tr><td>Blood Type</td><td>${safeGet(`${finalDonorData?.immunologicalDetails?.bloodGroup?.d || ""}${finalDonorData?.immunologicalDetails?.bloodGroup?.r || ""}`)}</td></tr>
            <tr><td>T cell cross match</td><td>${safeGet(finalDonorData?.immunologicalDetails?.crossMatch?.tCell)}</td></tr>
            <tr><td>B cell cross match</td><td>${safeGet(finalDonorData?.immunologicalDetails?.crossMatch?.bCell)}</td></tr>
            <tr><td>Contact</td><td>${safeGet(finalDonorData?.contactDetails)}</td></tr>
          </table>
        </div>

        <!-- SECTION 3 -->
        <div class="section">
          <div class="section-title">Transplant Details</div>
          <table>
            <tr><td>Transplant Date</td><td>${safeGet(formatDateToDDMMYYYY(finalKTSurgeryData?.ktDate))}</td></tr>
            <tr><td>Transplant Type</td><td>${safeGet(finalKTSurgeryData?.ktType)}</td></tr>
            <tr><td>Surgeon</td><td>${safeGet(finalKTSurgeryData?.ktSurgeon)}</td></tr>
            <tr><td>Unit</td><td>${safeGet(finalKTSurgeryData?.ktUnit)}</td></tr>
            <tr><td>Side</td><td>${safeGet(finalKTSurgeryData?.sideOfKT)}</td></tr>
            <tr><td>Donor Relationship</td><td>${safeGet(finalKTSurgeryData?.donorRelationship)}</td></tr>
          </table>
        </div>

        <!-- SECTION 4 -->
        <div class="section">
          <div class="section-title">Medical Information</div>
          <div class="grid-3">
            <div class="metric-box">
              <div class="metric-label">Blood Pressure</div>
              <div class="metric-value">${safeGet(latestFollowUp?.examination?.bp)}</div>
            </div>
            <div class="metric-box">
              <div class="metric-label">Creatinine</div>
              <div class="metric-value">${safeGet(latestFollowUp?.investigations?.sCreatinine)}</div>
            </div>
            <div class="metric-box">
              <div class="metric-label">Weight</div>
              <div class="metric-value">${safeGet(latestFollowUp?.examination?.bw)}</div>
            </div>
          </div>
          <div class="note-box">${safeGet(latestFollowUp?.doctorNote || latestFollowUp?.doctorsNotes, "No notes available.")}</div>
        </div>

        <!-- SECTION 5 -->
        <div class="section">
          <div class="section-title">Follow-up Summary</div>
          <table>
            <tr><td>Last Follow-up</td><td>${safeGet(formatDateToDDMMYYYY(latestFollowUp?.date))}</td></tr>
            <tr><td>Post-KT Duration</td><td>${safeGet(latestFollowUp?.postKTDuration)}</td></tr>
            <tr><td>Medications</td><td>${safeGet(finalKTSurgeryData?.currentMeds)}</td></tr>
            <tr><td>Doctor's Notes</td><td>${safeGet(latestFollowUp?.doctorNote || latestFollowUp?.doctorsNotes)}</td></tr>
          </table>
        </div>

        <div class="footer">
          <p><strong>Kidney Transplant Summary Report</strong></p>
          <p>Generated on ${formatDateToDDMMYYYY(new Date().toISOString())} at ${formatTimeDisplay(new Date().toISOString())}</p>
          <p>This is a confidential medical document</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeName = String(finalRecipientData.name || "recipient").replace(
      /\s+/g,
      "-"
    );
    link.download = `Kidney-Transplant-Summary-${safeName}-${new Date().toISOString().split("T")[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const formatComorbidities = (
    comorbidities: RecipientAssessmentForm["comorbidities"]
  ) => {
    if (!comorbidities) return "None";

    const activeComorbidities = Object.entries(comorbidities)
      .filter(([key, value]) => value === true && key !== "duration")
      .map(([key]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        return formattedKey;
      });

    return activeComorbidities.length > 0
      ? activeComorbidities.join(", ")
      : "None";
  };

  // Safe value getter with fallback
  const safeGet = (value: any, fallback: string = "N/A"): string => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    return String(value);
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
      <span className="text-gray-900 text-sm font-medium ml-4 text-right">
        {safeGet(value)}
      </span>
    </div>
  );

  const KeyMetric = ({ label, value, unit = "", status = "normal" }) => {
    const statusColors = {
      normal: "bg-gray-50 border-gray-200",
      warning: "bg-amber-50 border-amber-200",
      critical: "bg-red-50 border-red-200",
    };

    return (
      <div className={`rounded-lg p-4 border ${statusColors[status]}`}>
        <div className="text-gray-600 text-xs font-medium mb-2">{label}</div>
        <div className="text-gray-900 text-lg font-semibold">
          {value}{" "}
          <span className="text-sm font-normal text-gray-600">{unit}</span>
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
                <h1 className="text-2xl font-semibold text-gray-900">
                  Kidney Transplant Summary
                </h1>
              </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{finalRecipientData.name}</span>
                    <span className="mx-2">•</span>
                    <span>NIC: {finalRecipientData.nicNo}</span>
                    <span className="mx-2">•</span>
                    <span>Last Updated: {formatDateToDDMMYYYY(latestFollowUp?.date) || "N/A"}</span>
                  </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView("dashboard")}
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

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
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
                <DataRow label="Full Name" value={safeGet(finalRecipientData?.name)} />
                <DataRow label="Age" value={finalRecipientData?.age ? `${finalRecipientData.age} years` : "N/A"} />
                <DataRow label="Gender" value={safeGet(finalRecipientData?.gender)} />
                <DataRow
                  label="Date of Birth"
                  value={safeGet(formatDateToDDMMYYYY(finalRecipientData?.dateOfBirth))}
                />
                <DataRow label="NIC Number" value={safeGet(finalRecipientData?.nicNo)} />
                <DataRow label="Contact" value={safeGet(finalRecipientData?.contactDetails)} />
                <DataRow label="Email" value={safeGet(finalRecipientData?.emailAddress)} />
              </div>
            </InfoCard>

            <InfoCard icon={Heart} title="Medical Background">
              <div className="space-y-1">
                <DataRow
                  label="Primary Complaint"
                  value={patientProfile.recipientAssessment?.complains}
                />
                <DataRow
                  label="Comorbidities"
                  value={formatComorbidities(
                    patientProfile.recipientAssessment?.comorbidities
                  )}
                />
                <DataRow label="Occupation" value={finalRecipientData.occupation} />
                <DataRow
                  label="Drug History"
                  value={patientProfile.recipientAssessment?.drugHistory}
                />
                <DataRow
                  label="Known Allergies"
                  value={
                    patientProfile.recipientAssessment?.allergyHistory
                      ? Object.entries(
                          patientProfile.recipientAssessment.allergyHistory
                        )
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
                <KeyMetric
                  label="Current Creatinine"
                  value={latestFollowUp?.investigations?.sCreatinine}
                  unit="mg/dL"
                  status="normal"
                />
                <KeyMetric
                  label="eGFR"
                  value={latestFollowUp?.investigations?.eGFR}
                  unit="mL/min"
                  status="normal"
                />
                <KeyMetric
                  label="Tacrolimus Level"
                  value={latestFollowUp?.investigations?.tacrolimus}
                  unit="ng/mL"
                  status="normal"
                />
                <KeyMetric
                  label="HbA1c"
                  value={latestFollowUp?.investigations?.hba1c}
                  status="normal"
                />
              </div>
            </InfoCard>
          </div>

          {/* Transplantation Details */}
          <InfoCard icon={Calendar} title="Transplantation Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                  Surgery Details
                </h4>
                <div className="space-y-1">
                  <DataRow label="Date" value={safeGet(formatDateToDDMMYYYY(finalKTSurgeryData?.ktDate))} />
                  <DataRow label="Type" value={safeGet(finalKTSurgeryData?.ktType)} />
                  <DataRow label="Unit" value={safeGet(finalKTSurgeryData?.ktUnit)} />
                  <DataRow label="Surgeon" value={safeGet(finalKTSurgeryData?.ktSurgeon)} />
                  <DataRow label="Side" value={safeGet(finalKTSurgeryData?.sideOfKT)} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                  Pre-Transplant
                </h4>
                <div className="space-y-1">
                  <DataRow
                    label="Primary Diagnosis"
                    value={safeGet(finalKTSurgeryData?.primaryDiagnosis)}
                  />
                  <DataRow label="RRT Mode" value={safeGet(finalKTSurgeryData?.modeOfRRT)} />
                  <DataRow
                    label="RRT Duration"
                    value={safeGet(finalKTSurgeryData?.durationRRT)}
                  />
                  <DataRow
                    label="Pre-KT Creatinine"
                    value={finalKTSurgeryData?.preKTCreatinine ? `${finalKTSurgeryData.preKTCreatinine} mg/dL` : "N/A"}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                  Outcomes
                </h4>
                <div className="space-y-1">
                  <DataRow
                    label="Post-KT Creatinine"
                    value={finalKTSurgeryData?.postKTCreatinine ? `${finalKTSurgeryData.postKTCreatinine} mg/dL` : "N/A"}
                  />
                  <DataRow
                    label="Delayed Graft Function"
                    value={safeGet(finalKTSurgeryData?.delayedGraft)}
                  />
                  <DataRow
                    label="Post-KT Dialysis"
                    value={safeGet(finalKTSurgeryData?.postKTDialysis)}
                  />
                  <DataRow
                    label="Acute Rejection"
                    value={safeGet(finalKTSurgeryData?.acuteRejection)}
                  />
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Immunosuppression & Prophylaxis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard icon={Microscope} title="Immunosuppression Protocol">
              <div className="space-y-5">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">
                    Induction & Maintenance
                  </h4>
                  <div className="space-y-1">
                    <DataRow label="Pre-KT" value={safeGet(finalKTSurgeryData?.preKT)} />
                    <DataRow
                      label="Induction Therapy"
                      value={safeGet(finalKTSurgeryData?.inductionTherapy)}
                    />
                    <DataRow
                      label="Maintenance"
                      value={safeGet(finalKTSurgeryData?.maintenance)}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">
                    Current Medications
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-900">
                      {safeGet(finalKTSurgeryData?.currentMeds, "No medications recorded")}
                    </p>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard icon={FileText} title="Prophylaxis & Vaccination">
              <div className="space-y-5">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">
                    Prophylactic Medications
                  </h4>
                  <div className="space-y-1">
                    <DataRow
                      label="Cotrimoxazole"
                      value={`${safeGet(finalKTSurgeryData?.cotrimoxazole)} (${safeGet(finalKTSurgeryData?.cotriDuration)})`}
                    />
                    <DataRow
                      label="Valganciclovir"
                      value={`${safeGet(finalKTSurgeryData?.valganciclovir)} (${safeGet(finalKTSurgeryData?.valganDuration)})`}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">
                    Vaccinations
                  </h4>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-900">
                      {safeGet(finalKTSurgeryData?.vaccination, "No vaccination data recorded")}
                    </p>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Latest Follow-up */}
          <InfoCard icon={Activity} title="Latest Follow-up Assessment">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                  Physical Examination
                </h4>
                <div className="space-y-1">
                  <DataRow label="Date" value={safeGet(formatDateToDDMMYYYY(latestFollowUp?.date))} />
                  <DataRow
                    label="Post-KT Duration"
                    value={safeGet(latestFollowUp?.postKTDuration)}
                  />
                  <DataRow
                    label="Weight"
                    value={safeGet(latestFollowUp?.examination?.bw)}
                  />
                  <DataRow
                    label="BMI"
                    value={safeGet(latestFollowUp?.examination?.bmi)}
                  />
                  <DataRow
                    label="Blood Pressure"
                    value={safeGet(latestFollowUp?.examination?.bp)}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                  Laboratory Results
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <KeyMetric
                    label="Na+"
                    value={safeGet(latestFollowUp?.investigations?.seNa)}
                    unit="mmol/L"
                    status="normal"
                  />
                  <KeyMetric
                    label="K+"
                    value={safeGet(latestFollowUp?.investigations?.seK)}
                    unit="mmol/L"
                    status="normal"
                  />
                  <KeyMetric
                    label="Hemoglobin"
                    value={safeGet(latestFollowUp?.investigations?.seHb)}
                    unit="g/dL"
                    status="normal"
                  />
                  <KeyMetric
                    label="Proteinuria"
                    value={safeGet(latestFollowUp?.investigations?.urinePCR)}
                    unit="g/g"
                    status="normal"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                  Clinical Notes
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {safeGet(latestFollowUp?.doctorNote || latestFollowUp?.doctorsNotes, "No notes available.")}
                  </p>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2 text-sm">
                    Current Treatment
                  </h5>
                  <div className="text-xs text-gray-600 space-y-1.5">
                    <div>
                      • Prednisolone: {safeGet(latestFollowUp?.treatment?.prednisolone)}
                    </div>
                    <div>
                      • Tacrolimus: {safeGet(latestFollowUp?.treatment?.tacrolimus)}
                    </div>
                    <div>• MMF: {safeGet(latestFollowUp?.treatment?.mmf)}</div>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Donor & Immunological Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard icon={User} title="Donor Information">
              <div className="space-y-1">
                <DataRow label="Name" value={safeGet(finalDonorData?.name)} />
                <DataRow label="Age" value={finalDonorData?.age ? `${safeGet(finalDonorData.age)} years` : "N/A"} />
                <DataRow
                  label="Relation"
                  value={safeGet(finalDonorData?.relationToRecipient)}
                />
                <DataRow label="Contact" value={safeGet(finalDonorData?.contactDetails)} />
                <DataRow
                  label="Blood Group"
                  value={safeGet(`${finalDonorData?.immunologicalDetails?.bloodGroup?.d || ""}${finalDonorData?.immunologicalDetails?.bloodGroup?.r || ""}`)}
                />
              </div>
            </InfoCard>

            <InfoCard icon={Microscope} title="Immunological Compatibility">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 text-sm">
                    Recipient
                  </h5>
                  <div className="space-y-1">
                    <DataRow
                      label="Blood Group"
                      value={safeGet(`${patientProfile.recipientAssessment?.immunologicalDetails?.bloodGroup?.d || ""}${patientProfile.recipientAssessment?.immunologicalDetails?.bloodGroup?.r || ""}`)}
                    />
                    <DataRow
                      label="PRA (Pre)"
                      value={safeGet(patientProfile.recipientAssessment?.immunologicalDetails?.pra?.pre)}
                    />
                    <DataRow
                      label="DSA"
                      value={safeGet(patientProfile.recipientAssessment?.immunologicalDetails?.dsa)}
                    />
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 text-sm">
                    Compatibility
                  </h5>
                  <div className="space-y-1">
                    <DataRow
                      label="T Cell Match"
                      value={safeGet(finalDonorData?.immunologicalDetails?.crossMatch?.tCell)}
                    />
                    <DataRow
                      label="B Cell Match"
                      value={safeGet(finalDonorData?.immunologicalDetails?.crossMatch?.bCell)}
                    />
                    <DataRow
                      label="Risk Level"
                      value={safeGet(patientProfile.recipientAssessment?.immunologicalDetails?.immunologicalRisk)}
                    />
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
