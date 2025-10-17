import React, { useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";

export interface KTFormData {
  name: string;
  dob: string;
  age: string;
  gender: string;
  address: string;
  contact: string;
  diabetes: string;
  hypertension: string;
  ihd: string;
  dyslipidaemia: string;
  other: string;
  otherSpecify: string;
  primaryDiagnosis: string;
  modeOfRRT: string;
  durationRRT: string;
  ktDate: string;
  numberOfKT: string;
  ktUnit: string;
  wardNumber: string;
  ktSurgeon: string;
  ktType: string;
  donorRelationship: string;
  peritonealPosition: string;
  sideOfKT: string;
  preKT: string;
  inductionTherapy: string;
  maintenance: string;
  maintenanceOther: string;
  cotrimoxazole: string;
  cotriDuration: string;
  cotriStopped: string;
  valganciclovir: string;
  valganDuration: string;
  valganStopped: string;
  vaccination: string;
  preOpStatus: string;
  preOpPreparation: string;
  surgicalNotes: string;
  preKTCreatinine: string;
  postKTCreatinine: string;
  delayedGraft: string;
  postKTDialysis: string;
  acuteRejection: string;
  acuteRejectionDetails: string;
  otherComplications: string;
  postKTComp1: string;
  postKTComp2: string;
  postKTComp3: string;
  postKTComp4: string;
  postKTComp5: string;
  postKTComp6: string;
  currentMeds: string;
  recommendations: string;
}

import type { ActiveView } from "../pages/KidneyTransplant";

interface KTFormProps {
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
}

const initialForm: KTFormData = {
  name: "",
  dob: "",
  age: "",
  gender: "",
  address: "",
  contact: "",
  diabetes: "",
  hypertension: "",
  ihd: "",
  dyslipidaemia: "",
  other: "",
  otherSpecify: "",
  primaryDiagnosis: "",
  modeOfRRT: "",
  durationRRT: "",
  ktDate: "",
  numberOfKT: "",
  ktUnit: "",
  wardNumber: "",
  ktSurgeon: "",
  ktType: "",
  donorRelationship: "",
  peritonealPosition: "",
  sideOfKT: "",
  preKT: "",
  inductionTherapy: "",
  maintenance: "",
  maintenanceOther: "",
  cotrimoxazole: "",
  cotriDuration: "",
  cotriStopped: "",
  valganciclovir: "",
  valganDuration: "",
  valganStopped: "",
  vaccination: "",
  preOpStatus: "",
  preOpPreparation: "",
  surgicalNotes: "",
  preKTCreatinine: "",
  postKTCreatinine: "",
  delayedGraft: "",
  postKTDialysis: "",
  acuteRejection: "",
  acuteRejectionDetails: "",
  otherComplications: "",
  postKTComp1: "",
  postKTComp2: "",
  postKTComp3: "",
  postKTComp4: "",
  postKTComp5: "",
  postKTComp6: "",
  currentMeds: "",
  recommendations: "",
};

const FORM_STEPS = [
  "Introduction",
  "Medical History",
  "Pre-KT Details",
  "KT Related Info",
  "Immunological",
  "Immunosuppression",
  "Prophylaxis",
  "Pre-op",
  "Immediate Post KT",
  "Surgery Complications",
  "Medication",
  "Recommendations"
];

const KTForm: React.FC<KTFormProps> = ({ setActiveView }) => {
  const [form, setForm] = useState<KTFormData>(initialForm);
  const [step, setStep] = useState(0);

  const handleChange = (field: keyof KTFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(FORM_STEPS.length - 1, s + 1));
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("KT form submitted!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div>
        <button
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-2 mb-6 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
      
      {/* Stepper */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{FORM_STEPS[step]}</h2>
        <div className="flex items-center gap-1 mb-2">
          {FORM_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 flex-1 rounded-full ${step === idx ? "bg-blue-600" : idx < step ? "bg-blue-400" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center">
          Step {step + 1} of {FORM_STEPS.length}
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Step 0: Introduction */}
        {step === 0 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
            <p className="text-gray-600 mb-6">Enter the patient's basic details</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.name} 
                    onChange={e => handleChange("name", e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.contact} 
                    onChange={e => handleChange("contact", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.dob} 
                    onChange={e => handleChange("dob", e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age at Referral (years) *</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.age} 
                    onChange={e => handleChange("age", e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="Male"
                        checked={form.gender === "Male"}
                        onChange={e => handleChange("gender", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="male" className="text-sm text-gray-700 cursor-pointer">Male</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="Female"
                        checked={form.gender === "Female"}
                        onChange={e => handleChange("gender", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="female" className="text-sm text-gray-700 cursor-pointer">Female</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={form.address} 
                  onChange={e => handleChange("address", e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Medical History */}
        {step === 1 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Medical History</h2>
            <p className="text-gray-600 mb-6">Select all applicable conditions</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="diabetes"
                    checked={form.diabetes === "true"}
                    onChange={(e) => handleChange("diabetes", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="diabetes" className="text-sm text-gray-700 cursor-pointer flex-1">Diabetes</label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="hypertension"
                    checked={form.hypertension === "true"}
                    onChange={(e) => handleChange("hypertension", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hypertension" className="text-sm text-gray-700 cursor-pointer flex-1">Hypertension</label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="ihd"
                    checked={form.ihd === "true"}
                    onChange={(e) => handleChange("ihd", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ihd" className="text-sm text-gray-700 cursor-pointer flex-1">IHD</label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="dyslipidaemia"
                    checked={form.dyslipidaemia === "true"}
                    onChange={(e) => handleChange("dyslipidaemia", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dyslipidaemia" className="text-sm text-gray-700 cursor-pointer flex-1">Dyslipidaemia</label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="other"
                    checked={form.other === "true"}
                    onChange={(e) => handleChange("other", e.target.checked ? "true" : "false")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="other" className="text-sm text-gray-700 cursor-pointer flex-1">Other</label>
                </div>
              </div>
              
              {form.other === "true" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Please specify other conditions</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.otherSpecify}
                    onChange={(e) => handleChange("otherSpecify", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Pre-KT Details */}
        {step === 2 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pre-Transplant Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Renal Diagnosis</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.primaryDiagnosis} 
                  onChange={e => handleChange("primaryDiagnosis", e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode of RRT prior to KT</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.modeOfRRT} 
                    onChange={e => handleChange("modeOfRRT", e.target.value)}
                  >
                    <option value="">Select mode</option>
                    <option value="HD">HD</option>
                    <option value="PD">PD</option>
                    <option value="Pre-emptive">Pre-emptive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration of RRT prior to KT</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2 years"
                    value={form.durationRRT} 
                    onChange={e => handleChange("durationRRT", e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: KT Related Info */}
        {step === 3 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Transplantation Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Transplantation</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.ktDate} 
                    onChange={e => handleChange("ktDate", e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transplant Number</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.numberOfKT} 
                    onChange={e => handleChange("numberOfKT", e.target.value)}
                  >
                    <option value="">Select number</option>
                    <option value="1">1st Transplant</option>
                    <option value="2">2nd Transplant</option>
                    <option value="3">3rd Transplant</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transplant Unit</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.ktUnit} 
                    onChange={e => handleChange("ktUnit", e.target.value)}
                  >
                    <option value="">Select unit</option>
                    <option value="NHK">NHK</option>
                    <option value="THP">THP</option>
                    <option value="Other">Other</option>
                  </select>
                  {form.ktUnit === "Other" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.wardNumber} 
                        onChange={e => handleChange("wardNumber", e.target.value)} 
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transplant Surgeon</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.ktSurgeon} 
                    onChange={e => handleChange("ktSurgeon", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type of Transplant</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.ktType} 
                    onChange={e => handleChange("ktType", e.target.value)}
                  >
                    <option value="">Select type</option>
                    <option value="Live related">Live related</option>
                    <option value="Live unrelated">Live unrelated</option>
                    <option value="DDKT">Deceased Donor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donor Relationship</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Mother, Father, etc."
                    value={form.donorRelationship} 
                    onChange={e => handleChange("donorRelationship", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peritoneal Position</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.peritonealPosition} 
                    onChange={e => handleChange("peritonealPosition", e.target.value)}
                  >
                    <option value="">Select position</option>
                    <option value="Extraperitoneal">Extraperitoneal</option>
                    <option value="Intraperitoneal">Intraperitoneal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Side of Transplant</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.sideOfKT} 
                    onChange={e => handleChange("sideOfKT", e.target.value)}
                  >
                    <option value="">Select side</option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Immunological */}
        {step === 4 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Immunological Details
            </h2>
            <p className="text-gray-600 mb-6">Blood group, cross match, HLA typing, and immunological risk assessment</p>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Blood Group</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Donor</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter donor blood group"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter recipient blood group"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Cross Match</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">T Cell</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter T cell value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">B Cell</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter B cell value"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">HLA Typing</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">Type</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-A</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-B</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-C</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-DR</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-DP</th>
                        <th className="border border-gray-300 p-3 text-left font-medium text-gray-700">HLA-DQ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Donor</td>
                        {["A", "B", "C", "DR", "DP", "DQ"].map((type) => (
                          <td key={type} className="border border-gray-300 p-2">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={type}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Recipient</td>
                        {["A", "B", "C", "DR", "DP", "DQ"].map((type) => (
                          <td key={type} className="border border-gray-300 p-2">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={type}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">PRA (Panel Reactive Antibodies)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pre (%)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter pre PRA percentage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Post (%)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter post PRA percentage"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">DSA (Donor Specific Antibodies)</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DSA Details</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter DSA details"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Immunological Risk</h4>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="recipientRiskLow"
                      name="immunologicalRisk"
                      value="low"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="recipientRiskLow" className="text-sm text-gray-700 cursor-pointer">Low</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="recipientRiskAverage"
                      name="immunologicalRisk"
                      value="average"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="recipientRiskAverage" className="text-sm text-gray-700 cursor-pointer">Average</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="recipientRiskHigh"
                      name="immunologicalRisk"
                      value="high"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="recipientRiskHigh" className="text-sm text-gray-700 cursor-pointer">High</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Immunosuppression */}
        {step === 5 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Immunosuppression Therapy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-Transplant Treatment</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.preKT} 
                  onChange={e => handleChange("preKT", e.target.value)}
                >
                  <option value="">Select treatment</option>
                  <option value="TPE">TPE</option>
                  <option value="IVIG">IVIG</option>
                  <option value="None">None</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Induction Therapy</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.inductionTherapy} 
                  onChange={e => handleChange("inductionTherapy", e.target.value)}
                >
                  <option value="">Select therapy</option>
                  <option value="Basiliximab">Basiliximab</option>
                  <option value="ATG">ATG</option>
                  <option value="Methylprednisolone">Methylprednisolone</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Therapy</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.maintenance} 
                  onChange={e => handleChange("maintenance", e.target.value)}
                >
                  <option value="">Select maintenance</option>
                  <option value="Pred">Pred</option>
                  <option value="MMF">MMF</option>
                  <option value="Tac">Tac</option>
                  <option value="Everolimus">Everolimus</option>
                </select>
                
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other (specify)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.maintenanceOther}
                    onChange={e => handleChange("maintenanceOther", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Prophylaxis */}
        {step === 6 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Prophylaxis</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Cotrimoxazole</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cotri-yes"
                        name="cotrimoxazole"
                        value="Yes"
                        checked={form.cotrimoxazole === "Yes"}
                        onChange={e => handleChange("cotrimoxazole", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="cotri-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cotri-no"
                        name="cotrimoxazole"
                        value="No"
                        checked={form.cotrimoxazole === "No"}
                        onChange={e => handleChange("cotrimoxazole", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="cotri-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                    </div>
                  </div>
                  
                  {form.cotrimoxazole === "Yes" && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.cotriDuration} 
                          onChange={e => handleChange("cotriDuration", e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Stopped</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.cotriStopped} 
                          onChange={e => handleChange("cotriStopped", e.target.value)} 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Valganciclovir</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="valgan-yes"
                        name="valganciclovir"
                        value="Yes"
                        checked={form.valganciclovir === "Yes"}
                        onChange={e => handleChange("valganciclovir", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="valgan-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="valgan-no"
                        name="valganciclovir"
                        value="No"
                        checked={form.valganciclovir === "No"}
                        onChange={e => handleChange("valganciclovir", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="valgan-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                    </div>
                  </div>
                  
                  {form.valganciclovir === "Yes" && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.valganDuration} 
                          onChange={e => handleChange("valganDuration", e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Stopped</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.valganStopped} 
                          onChange={e => handleChange("valganStopped", e.target.value)} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.vaccination} 
                  onChange={e => handleChange("vaccination", e.target.value)}
                >
                  <option value="">Select vaccination</option>
                  <option value="COVID">COVID</option>
                  <option value="Influenza">Influenza</option>
                  <option value="Pneumococcal">Pneumococcal</option>
                  <option value="Varicella">Varicella</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Pre-op */}
        {step === 7 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pre-Operative Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-operative Status</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={form.preOpStatus} 
                  onChange={e => handleChange("preOpStatus", e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pre-operative Preparation</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={form.preOpPreparation} 
                  onChange={e => handleChange("preOpPreparation", e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surgical Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={form.surgicalNotes} 
                  onChange={e => handleChange("surgicalNotes", e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Immediate Post KT */}
        {step === 8 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Immediate Post-Transplant Details</h2>
            <p className="text-gray-600 mb-6">Within the first week after transplantation</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pre-transplant Creatinine</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.preKTCreatinine} 
                    onChange={e => handleChange("preKTCreatinine", e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post-transplant Creatinine at Discharge</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.postKTCreatinine} 
                    onChange={e => handleChange("postKTCreatinine", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delayed Graft Function</label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="delayedGraft-yes"
                      name="delayedGraft"
                      value="Yes"
                      checked={form.delayedGraft === "Yes"}
                      onChange={e => handleChange("delayedGraft", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="delayedGraft-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="delayedGraft-no"
                      name="delayedGraft"
                      value="No"
                      checked={form.delayedGraft === "No"}
                      onChange={e => handleChange("delayedGraft", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="delayedGraft-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Post-transplant Dialysis Required</label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="postKTDialysis-yes"
                      name="postKTDialysis"
                      value="Yes"
                      checked={form.postKTDialysis === "Yes"}
                      onChange={e => handleChange("postKTDialysis", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="postKTDialysis-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="postKTDialysis-no"
                      name="postKTDialysis"
                      value="No"
                      checked={form.postKTDialysis === "No"}
                      onChange={e => handleChange("postKTDialysis", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="postKTDialysis-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Acute Rejection</label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="acuteRejection-yes"
                      name="acuteRejection"
                      value="Yes"
                      checked={form.acuteRejection === "Yes"}
                      onChange={e => handleChange("acuteRejection", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="acuteRejection-yes" className="text-sm text-gray-700 cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="acuteRejection-no"
                      name="acuteRejection"
                      value="No"
                      checked={form.acuteRejection === "No"}
                      onChange={e => handleChange("acuteRejection", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="acuteRejection-no" className="text-sm text-gray-700 cursor-pointer">No</label>
                  </div>
                </div>
                
                {form.acuteRejection === "Yes" && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Details</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.acuteRejectionDetails} 
                      onChange={e => handleChange("acuteRejectionDetails", e.target.value)} 
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Complications</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={form.otherComplications} 
                  onChange={e => handleChange("otherComplications", e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Surgery Complications */}
        {step === 9 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Surgery Complications</h2>
            <p className="text-gray-600 mb-6">List any post-transplant surgical complications</p>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complication {num}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form[`postKTComp${num}` as keyof KTFormData]} 
                    onChange={e => handleChange(`postKTComp${num}` as keyof KTFormData, e.target.value)} 
                    placeholder={`Enter complication #${num}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 10: Medication */}
        {step === 10 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Medications</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Current Medications</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.currentMeds} 
                  onChange={e => handleChange("currentMeds", e.target.value)}
                >
                  <option value="">Select medication</option>
                  <option value="Tacrolimus">Tacrolimus</option>
                  <option value="MMF">MMF</option>
                  <option value="Prednisolone">Prednisolone</option>
                  <option value="Everolimus">Everolimus</option>
                  <option value="Cyclosporine">Cyclosporine</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 11: Recommendations */}
        {step === 11 && (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Management Recommendations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommendations</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  value={form.recommendations} 
                  onChange={e => handleChange("recommendations", e.target.value)} 
                  placeholder="Enter recommendations for ongoing management..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button 
            type="button" 
            onClick={prevStep} 
            disabled={step === 0}
            className="min-w-[100px] px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="text-sm text-gray-500">
            Step {step + 1} of {FORM_STEPS.length}
          </div>
          
          {step < FORM_STEPS.length - 1 ? (
            <button 
              type="button" 
              onClick={nextStep}
              className="min-w-[100px] px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="min-w-[150px] px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save All Details
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default KTForm;