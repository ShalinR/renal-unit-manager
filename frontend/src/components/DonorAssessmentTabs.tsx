import React, { useState, useEffect } from "react";
import { useDonorContext } from "@/context/DonorContext";
import { DonorDetailsModal } from "./DonorDetailsModal";
import { Donor, DonorAssessmentForm } from "../types/donor";
import { Trash2 } from "lucide-react";

const DonorAssessmentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"available" | "register">(
    "available"
  );
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorAssessmentForm | null>(null);
  const [deletingDonorId, setDeletingDonorId] = useState<string | null>(null);
  const { donors, fetchAllDonors, removeDonor } = useDonorContext();

  useEffect(() => {
    console.log("Donors in DonorAssessmentTabs:", donors);
  }, [donors]);

  useEffect(() => {
    fetchAllDonors(); 
  }, [fetchAllDonors]);

  const convertDonorToFormData = (donor: Donor): DonorAssessmentForm => {
    console.log('🔄 Converting donor to form data:', donor);
    
    return {
      // Basic information
      name: donor.name || "",
      age: donor.age || 0,
      gender: donor.gender || "",
      dateOfBirth: donor.dateOfBirth || "",
      occupation: donor.occupation || "",
      address: donor.address || "",
      nicNo: donor.nicNo || "",
      contactDetails: donor.contactDetails || "",
      emailAddress: donor.emailAddress || "",
      relationToRecipient: donor.relationToRecipient || "",
      relationType: donor.relationType || "",

      // Medical history
      comorbidities: donor.comorbidities || {
        dl: false, dm: false, psychiatricIllness: false, htn: false, ihd: false,
      },
      complains: donor.complains || "",

      // Systemic inquiry
      systemicInquiry: donor.systemicInquiry || {
        constitutional: { loa: false, low: false },
        cvs: { chestPain: false, odema: false, sob: false },
        respiratory: { cough: false, hemoptysis: false, wheezing: false },
        git: { constipation: false, diarrhea: false, melena: false, prBleeding: false },
        renal: { hematuria: false, frothyUrine: false },
        neuro: { seizures: false, visualDisturbance: false, headache: false, limbWeakness: false },
        gynecology: { pvBleeding: false, menopause: false, menorrhagia: false, lrmp: false },
        sexualHistory: "",
      },

      // Drug & allergy
      drugHistory: donor.drugHistory || "",
      allergyHistory: donor.allergyHistory || { foods: false, drugs: false, p: false },

      // Family history
      familyHistory: donor.familyHistory || { dm: "", htn: "", ihd: "", stroke: "", renal: "" },

      // Substance use
      substanceUse: donor.substanceUse || { smoking: false, alcohol: false, other: "" },

      // Social history
      socialHistory: donor.socialHistory || {
        spouseDetails: "", childrenDetails: "", income: "", other: "",
      },

      // Examination - this is the key area that was missing data
      examination: donor.examination ? {
        height: donor.examination.height || "",
        weight: donor.examination.weight || "",
        bmi: donor.examination.bmi || "",
        pallor: donor.examination.pallor || false,
        icterus: donor.examination.icterus || false,
        oral: donor.examination.oral ? {
          dentalCaries: donor.examination.oral.dentalCaries || false,
          oralHygiene: donor.examination.oral.oralHygiene || false,
          satisfactory: donor.examination.oral.satisfactory || false,
          unsatisfactory: donor.examination.oral.unsatisfactory || false,
        } : {
          dentalCaries: false, oralHygiene: false, satisfactory: false, unsatisfactory: false
        },
        lymphNodes: donor.examination.lymphNodes ? {
          cervical: donor.examination.lymphNodes.cervical || false,
          axillary: donor.examination.lymphNodes.axillary || false,
          inguinal: donor.examination.lymphNodes.inguinal || false,
        } : {
          cervical: false, axillary: false, inguinal: false
        },
        clubbing: donor.examination.clubbing || false,
        ankleOedema: donor.examination.ankleOedema || false,
        cvs: donor.examination.cvs ? {
          bp: donor.examination.cvs.bp || "",
          pr: donor.examination.cvs.pr || "",
          murmurs: donor.examination.cvs.murmurs || false,
        } : {
          bp: "", pr: "", murmurs: false
        },
        respiratory: donor.examination.respiratory ? {
          rr: donor.examination.respiratory.rr || false,
          spo2: donor.examination.respiratory.spo2 || false,
          auscultation: donor.examination.respiratory.auscultation || false,
          crepts: donor.examination.respiratory.crepts || false,
          ranchi: donor.examination.respiratory.ranchi || false,
          effusion: donor.examination.respiratory.effusion || false,
        } : {
          rr: false, spo2: false, auscultation: false, crepts: false, ranchi: false, effusion: false
        },
        abdomen: donor.examination.abdomen ? {
          hepatomegaly: donor.examination.abdomen.hepatomegaly || false,
          splenomegaly: donor.examination.abdomen.splenomegaly || false,
          renalMasses: donor.examination.abdomen.renalMasses || false,
          freeFluid: donor.examination.abdomen.freeFluid || false,
        } : {
          hepatomegaly: false, splenomegaly: false, renalMasses: false, freeFluid: false
        },
        BrcostExamination: donor.examination.BrcostExamination || "",
        neurologicalExam: donor.examination.neurologicalExam ? {
          cranialNerves: donor.examination.neurologicalExam.cranialNerves || false,
          upperLimb: donor.examination.neurologicalExam.upperLimb || false,
          lowerLimb: donor.examination.neurologicalExam.lowerLimb || false,
          coordination: donor.examination.neurologicalExam.coordination || false,
        } : {
          cranialNerves: false, upperLimb: false, lowerLimb: false, coordination: false
        },
      } : {
        // Default examination structure if no examination data exists
        height: "", weight: "", bmi: "", pallor: false, icterus: false,
        oral: { dentalCaries: false, oralHygiene: false, satisfactory: false, unsatisfactory: false },
        lymphNodes: { cervical: false, axillary: false, inguinal: false },
        clubbing: false, ankleOedema: false,
        cvs: { bp: "", pr: "", murmurs: false },
        respiratory: { rr: false, spo2: false, auscultation: false, crepts: false, ranchi: false, effusion: false },
        abdomen: { hepatomegaly: false, splenomegaly: false, renalMasses: false, freeFluid: false },
        BrcostExamination: "",
        neurologicalExam: { cranialNerves: false, upperLimb: false, lowerLimb: false, coordination: false },
      },

      // Immunological details
      immunologicalDetails: donor.immunologicalDetails ? {
        bloodGroup: donor.immunologicalDetails.bloodGroup ? {
          d: donor.immunologicalDetails.bloodGroup.d || "",
          r: donor.immunologicalDetails.bloodGroup.r || "",
        } : { d: "", r: "" },
        crossMatch: donor.immunologicalDetails.crossMatch ? {
          tCell: donor.immunologicalDetails.crossMatch.tCell || "",
          bCell: donor.immunologicalDetails.crossMatch.bCell || "",
        } : { tCell: "", bCell: "" },
        hlaTyping: donor.immunologicalDetails.hlaTyping ? {
          donor: donor.immunologicalDetails.hlaTyping.donor ? {
            hlaA: donor.immunologicalDetails.hlaTyping.donor.hlaA || "",
            hlaB: donor.immunologicalDetails.hlaTyping.donor.hlaB || "",
            hlaC: donor.immunologicalDetails.hlaTyping.donor.hlaC || "",
            hlaDR: donor.immunologicalDetails.hlaTyping.donor.hlaDR || "",
            hlaDP: donor.immunologicalDetails.hlaTyping.donor.hlaDP || "",
            hlaDQ: donor.immunologicalDetails.hlaTyping.donor.hlaDQ || "",
          } : { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
          recipient: donor.immunologicalDetails.hlaTyping.recipient ? {
            hlaA: donor.immunologicalDetails.hlaTyping.recipient.hlaA || "",
            hlaB: donor.immunologicalDetails.hlaTyping.recipient.hlaB || "",
            hlaC: donor.immunologicalDetails.hlaTyping.recipient.hlaC || "",
            hlaDR: donor.immunologicalDetails.hlaTyping.recipient.hlaDR || "",
            hlaDP: donor.immunologicalDetails.hlaTyping.recipient.hlaDP || "",
            hlaDQ: donor.immunologicalDetails.hlaTyping.recipient.hlaDQ || "",
          } : { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
          conclusion: donor.immunologicalDetails.hlaTyping.conclusion ? {
            hlaA: donor.immunologicalDetails.hlaTyping.conclusion.hlaA || "",
            hlaB: donor.immunologicalDetails.hlaTyping.conclusion.hlaB || "",
            hlaC: donor.immunologicalDetails.hlaTyping.conclusion.hlaC || "",
            hlaDR: donor.immunologicalDetails.hlaTyping.conclusion.hlaDR || "",
            hlaDP: donor.immunologicalDetails.hlaTyping.conclusion.hlaDP || "",
            hlaDQ: donor.immunologicalDetails.hlaTyping.conclusion.hlaDQ || "",
          } : { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
        } : {
          donor: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
          recipient: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
          conclusion: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
        },
        pra: donor.immunologicalDetails.pra ? {
          pre: donor.immunologicalDetails.pra.pre || "",
          post: donor.immunologicalDetails.pra.post || "",
        } : { pre: "", post: "" },
        dsa: donor.immunologicalDetails.dsa || "",
        immunologicalRisk: donor.immunologicalDetails.immunologicalRisk || "",
      } : {
        // Default immunological structure
        bloodGroup: { d: "", r: "" },
        crossMatch: { tCell: "", bCell: "" },
        hlaTyping: {
          donor: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
          recipient: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
          conclusion: { hlaA: "", hlaB: "", hlaC: "", hlaDR: "", hlaDP: "", hlaDQ: "" },
        },
        pra: { pre: "", post: "" },
        dsa: "",
        immunologicalRisk: "",
      },
    };
  };

  const handleViewDonor = (donor: Donor) => {
    console.log('👁️ View button clicked for donor:', donor);
    const donorDetails = convertDonorToFormData(donor);
    console.log('📋 Converted form data:', donorDetails);
    setSelectedDonor(donorDetails);
    setShowDonorModal(true);
  };

  const handleDeleteDonor = async (donorId: string, donorName: string) => {
    if (window.confirm(`Are you sure you want to delete donor "${donorName}"?`)) {
      try {
        setDeletingDonorId(donorId);
        await removeDonor(donorId);
        console.log(`✅ Donor ${donorName} deleted successfully`);
      } catch (error) {
        console.error(`❌ Error deleting donor ${donorName}:`, error);
        alert(`Failed to delete donor: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setDeletingDonorId(null);
      }
    }
  };

  // Get available donors count
  const availableDonorsCount = donors.filter(donor => donor.status !== 'assigned').length;
  const assignedDonorsCount = donors.filter(donor => donor.status === 'assigned').length;

  const renderAvailableDonors = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Donor Management
        </h2>
        <div className="text-sm text-gray-500">
          {availableDonorsCount} available, {assignedDonorsCount} assigned
        </div>
      </div>

      {donors.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No donors registered yet</div>
          <div className="text-sm text-gray-500">
            Register a donor to see them listed here
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donors.map((donor, index) => (
                <tr key={donor.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {donor.name}
                    </div>
                    <div className="text-sm text-gray-500">{donor.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{donor.bloodGroup}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{donor.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donor.relationToRecipient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donor.status === 'assigned' ? (
                      <div className="flex flex-col gap-1">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Assigned
                        </span>
                        <span className="text-xs text-gray-600">
                          {donor.assignedRecipientName || donor.patientPhn}
                        </span>
                      </div>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                    <button
                      onClick={() => handleViewDonor(donor)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteDonor(donor.id, donor.name)}
                      disabled={deletingDonorId === donor.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete donor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Donor Assessment
      </h1>

      <div className="w-full">
        <div className="grid w-full grid-cols-2 bg-gray-100 rounded-t-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("available")}
            className={`py-3 px-4 text-center font-medium ${
              activeTab === "available"
                ? "bg-white text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            View All Donors
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`py-3 px-4 text-center font-medium ${
              activeTab === "register"
                ? "bg-white text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Register New Donor
          </button>
        </div>

        <div className="bg-gray-50 p-1 rounded-b-lg shadow">
          {activeTab === "available" && renderAvailableDonors()}
          {activeTab === "register" && (
            <div className="p-4 text-center">
              <p className="text-gray-600 mb-4">
                Please use the full Donor Assessment form to register new
                donors.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Open Donor Assessment Form
              </button>
            </div>
          )}
        </div>
      </div>

      <DonorDetailsModal
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        donorData={selectedDonor}
      />
    </div>
  );
};

export default DonorAssessmentTabs;