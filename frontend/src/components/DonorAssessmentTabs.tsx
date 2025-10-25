import React, { useState, useEffect } from "react";
import { useDonorContext } from "@/context/DonorContext";
import { DonorDetailsModal } from "./DonorDetailsModal";
import { Donor, DonorAssessmentForm } from "../types/donor";

const DonorAssessmentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"available" | "register">(
    "available"
  );
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [selectedDonor, setSelectedDonor] =
    useState<DonorAssessmentForm | null>(null);
  const { donors, setSelectedDonor: setContextSelectedDonor } =
    useDonorContext();

  useEffect(() => {
    console.log("Donors in DonorAssessmentTabs:", donors);
  }, [donors]);

  const handleSelectDonor = (donor: Donor) => {
    setContextSelectedDonor(donor);
    alert(
      `Donor ${donor.name} selected! You can now use this donor in recipient assessment.`
    );
  };

  const convertDonorToFormData = (donor: Donor): DonorAssessmentForm => {
    return {
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
      comorbidities: donor.comorbidities || {
        dl: false,
        dm: false,
        psychiatricIllness: false,
        htn: false,
        ihd: false,
      },
      complains: "",
      systemicInquiry: {
        constitutional: { loa: false, low: false },
        cvs: { chestPain: false, odema: false, sob: false },
        respiratory: { cough: false, hemoptysis: false, wheezing: false },
        git: {
          constipation: false,
          diarrhea: false,
          melena: false,
          prBleeding: false,
        },
        renal: { hematuria: false, frothyUrine: false },
        neuro: {
          seizures: false,
          visualDisturbance: false,
          headache: false,
          limbWeakness: false,
        },
        gynecology: {
          pvBleeding: false,
          menopause: false,
          menorrhagia: false,
          lrmp: false,
        },
        sexualHistory: "",
      },
      drugHistory: "",
      allergyHistory: { foods: false, drugs: false, p: false },
      familyHistory: { dm: "", htn: "", ihd: "", stroke: "", renal: "" },
      substanceUse: { smoking: false, alcohol: false, other: "" },
      socialHistory: {
        spouseDetails: "",
        childrenDetails: "",
        income: "",
        other: "",
      },
      examination: donor.examination || {
        height: "",
        weight: "",
        bmi: "",
        pallor: false,
        icterus: false,
        oral: {
          dentalCaries: false,
          oralHygiene: false,
          satisfactory: false,
          unsatisfactory: false,
        },
        lymphNodes: { cervical: false, axillary: false, inguinal: false },
        clubbing: false,
        ankleOedema: false,
        cvs: { bp: "", pr: "", murmurs: false },
        respiratory: {
          rr: false,
          spo2: false,
          auscultation: false,
          crepts: false,
          ranchi: false,
          effusion: false,
        },
        abdomen: {
          hepatomegaly: false,
          splenomegaly: false,
          renalMasses: false,
          freeFluid: false,
        },
        BrcostExamination: "",
        neurologicalExam: {
          cranialNerves: false,
          upperLimb: false,
          lowerLimb: false,
          coordination: false,
        },
      },
      immunologicalDetails: donor.immunologicalDetails || {
        bloodGroup: {
          d: donor.bloodGroup?.charAt(0) || "",
          r: donor.bloodGroup?.charAt(1) || "",
        },
        crossMatch: { tCell: "", bCell: "" },
        hlaTyping: {
          donor: {
            hlaA: "",
            hlaB: "",
            hlaC: "",
            hlaDR: "",
            hlaDP: "",
            hlaDQ: "",
          },
          recipient: {
            hlaA: "",
            hlaB: "",
            hlaC: "",
            hlaDR: "",
            hlaDP: "",
            hlaDQ: "",
          },
          conclusion: {
            hlaA: "",
            hlaB: "",
            hlaC: "",
            hlaDR: "",
            hlaDP: "",
            hlaDQ: "",
          },
        },
        pra: { pre: "", post: "" },
        dsa: "",
        immunologicalRisk: "",
      },
    };
  };

  const handleViewDonor = (donor: Donor) => {
    const donorDetails = convertDonorToFormData(donor);
    setSelectedDonor(donorDetails);
    setShowDonorModal(true);
  };

  const renderAvailableDonors = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Available Donors ({donors.length})
        </h2>
        <div className="text-sm text-gray-500">
          {donors.length === 0
            ? "No donors registered yet"
            : `${donors.length} donor(s) available`}
        </div>
      </div>

      {donors.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No donors available</div>
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
                  Status
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
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donor.status === "assigned"
                          ? "bg-blue-100 text-blue-800"
                          : donor.status === "evaluating"
                            ? "bg-yellow-100 text-yellow-800"
                            : donor.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      {donor.status
                        ? donor.status.charAt(0).toUpperCase() +
                          donor.status.slice(1)
                        : "Available"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewDonor(donor)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleSelectDonor(donor)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Select
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
            View Available Donors
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
