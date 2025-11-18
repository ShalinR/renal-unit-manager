import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type FormState = {
  phn: string;
  bht: string;
  fullName: string;
  dob: string;
  age: string;
  gender: string;
  nic: string;
  phone: string;
  address: string;

  // Guardian
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianNIC: string;
  guardianAddress: string;

  // Admission
  admissionType: string;
  admittingOfficer: string;
  admittingHospital: string;
  presentingComplaints: string;

  // Examinations
  tempC: string;
  heightCm: string;
  weightKg: string;
  bmi: string;
  bpSys: string;
  bpDia: string;
  heartRate: string;

  // Problems
  problems: string[];
};

type Errors = Record<string, string>;

const MAX_PROBLEMS = 10;

const RegisterPatient: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    phn: "",
    bht: "",
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    nic: "",
    phone: "",
    address: "",

    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    guardianNIC: "",
    guardianAddress: "",

    admissionType: "",
    admittingOfficer: "",
    admittingHospital: "",
    presentingComplaints: "",

    tempC: "",
    heightCm: "",
    weightKg: "",
    bmi: "",
    bpSys: "",
    bpDia: "",
    heartRate: "",

    problems: [""],
  });

  const [errors, setErrors] = useState<Errors>({});

  // Auto-calc BMI whenever height/weight change
  useEffect(() => {
    const h = parseFloat(form.heightCm);
    const w = parseFloat(form.weightKg);
    if (h > 0 && w > 0) {
      const m = h / 100;
      const bmi = w / (m * m);
      setForm((prev) => ({
        ...prev,
        bmi: (Math.round(bmi * 10) / 10).toString(),
      }));
    } else {
      setForm((prev) => ({ ...prev, bmi: "" }));
    }
  }, [form.heightCm, form.weightKg]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProblemChange = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.problems];
      next[index] = value;
      return { ...prev, problems: next };
    });
  };

  const addProblem = () => {
    setForm((prev) => {
      if (prev.problems.length >= MAX_PROBLEMS) return prev;
      return { ...prev, problems: [...prev.problems, ""] };
    });
  };

  const removeProblem = (index: number) => {
    setForm((prev) => {
      const next = prev.problems.filter((_, i) => i !== index);
      if (next.length === 0) next.push("");
      return { ...prev, problems: next };
    });
  };

  const validate = (): boolean => {
    const e: Errors = {};

    const phoneRegex = /^\d{10}$/;
    const nicRegex = /^[A-Za-z0-9]{10}$/;

    if (!form.fullName.trim()) e.fullName = "Name is required.";
    if (!form.phn.trim()) e.phn = "PHN is required.";
    if (!form.bht.trim()) e.bht = "BHT number is required.";
    if (!form.gender.trim()) e.gender = "Gender is required.";
    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    } else if (!phoneRegex.test(form.phone.trim())) {
      e.phone = "Phone number must be 10 digits.";
    }
    if (!form.nic.trim()) {
      e.nic = "NIC is required.";
    } else if (!nicRegex.test(form.nic.trim())) {
      e.nic = "NIC must be exactly 10 letters/digits.";
    }
    if (!form.address.trim()) e.address = "Address is required.";

    // Guardian validation
    if (!form.guardianName.trim())
      e.guardianName = "Guardian name is required.";
    if (!form.guardianRelationship.trim())
      e.guardianRelationship = "Guardian relationship is required.";
    if (!form.guardianPhone.trim()) {
      e.guardianPhone = "Guardian phone is required.";
    } else if (!phoneRegex.test(form.guardianPhone.trim())) {
      e.guardianPhone = "Guardian phone must be 10 digits.";
    }
    if (!form.guardianNIC.trim()) {
      e.guardianNIC = "Guardian NIC is required.";
    } else if (!nicRegex.test(form.guardianNIC.trim())) {
      e.guardianNIC = "Guardian NIC must be exactly 10 letters/digits.";
    }
    if (!form.guardianAddress.trim())
      e.guardianAddress = "Guardian address is required.";

    // Admission
    if (!form.admissionType.trim())
      e.admissionType = "Type of admission is required.";
    if (!form.presentingComplaints.trim())
      e.presentingComplaints = "Presenting complaints are required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      phn: form.phn.trim(),
      bht: form.bht.trim(),
      fullName: form.fullName.trim(),
      dob: form.dob || null,
      age: form.age ? Number(form.age) : null,
      gender: form.gender,
      nic: form.nic.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),

      guardian: {
        name: form.guardianName.trim(),
        relationship: form.guardianRelationship.trim(),
        phone: form.guardianPhone.trim(),
        nic: form.guardianNIC.trim(),
        address: form.guardianAddress.trim(),
      },

      admission: {
        typeOfAdmission: form.admissionType,
        admittingOfficer: form.admittingOfficer.trim() || null,
        admittingHospital: form.admittingHospital.trim() || null,
        presentingComplaints: form.presentingComplaints.trim(),
        examinations: {
          tempC: form.tempC ? Number(form.tempC) : null,
          heightCm: form.heightCm ? Number(form.heightCm) : null,
          weightKg: form.weightKg ? Number(form.weightKg) : null,
          bmi: form.bmi ? Number(form.bmi) : null,
          bpSystolic: form.bpSys ? Number(form.bpSys) : null,
          bpDiastolic: form.bpDia ? Number(form.bpDia) : null,
          heartRate: form.heartRate ? Number(form.heartRate) : null,
        },
        problems: form.problems
          .map((p) => p.trim())
          .filter((p) => p.length > 0),
      },
    };

    console.log("Add New Patient payload (front-end only):", payload);
    alert("Patient form is valid and ready to be sent to backend.");

    // Optionally redirect to ward management with PHN:
    if (payload.phn) {
      navigate(`/ward-management?phn=${encodeURIComponent(payload.phn)}`);
    }
  };

  const renderError = (field: keyof Errors) =>
    errors[field] ? (
      <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Add New Patient
        </h1>
        <p className="text-xs text-slate-500">
          All critical patient, guardian and admission details with proper
          validation. Guardians are now fully captured.
        </p>
      </div>
      <Separator />
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* BASIC + CONTACT */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              1. Patient Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                {renderError("fullName")}
              </div>
              <div>
                <Label htmlFor="phn">PHN Number</Label>
                <Input
                  id="phn"
                  value={form.phn}
                  onChange={(e) => updateField("phn", e.target.value)}
                  placeholder="e.g. PHN-443221"
                />
                {renderError("phn")}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="bht">BHT Number (current admission)</Label>
                <Input
                  id="bht"
                  value={form.bht}
                  onChange={(e) => updateField("bht", e.target.value)}
                  placeholder="e.g. BHT-1001"
                />
                {renderError("bht")}
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={form.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label>Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => updateField("gender", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {renderError("gender")}
              </div>
              <div>
                <Label htmlFor="nic">NIC</Label>
                <Input
                  id="nic"
                  value={form.nic}
                  onChange={(e) => updateField("nic", e.target.value)}
                  placeholder="10 letters/digits"
                />
                {renderError("nic")}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="10 digits"
                />
                {renderError("phone")}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={2}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
              {renderError("address")}
            </div>
          </CardContent>
        </Card>

        {/* GUARDIAN */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              2. Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={form.guardianName}
                  onChange={(e) =>
                    updateField("guardianName", e.target.value)
                  }
                />
                {renderError("guardianName")}
              </div>
              <div>
                <Label htmlFor="guardianRelationship">
                  Relationship to Patient
                </Label>
                <Input
                  id="guardianRelationship"
                  value={form.guardianRelationship}
                  onChange={(e) =>
                    updateField("guardianRelationship", e.target.value)
                  }
                />
                {renderError("guardianRelationship")}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  value={form.guardianPhone}
                  onChange={(e) =>
                    updateField("guardianPhone", e.target.value)
                  }
                  placeholder="10 digits"
                />
                {renderError("guardianPhone")}
              </div>
              <div>
                <Label htmlFor="guardianNIC">Guardian NIC</Label>
                <Input
                  id="guardianNIC"
                  value={form.guardianNIC}
                  onChange={(e) =>
                    updateField("guardianNIC", e.target.value)
                  }
                  placeholder="10 letters/digits"
                />
                {renderError("guardianNIC")}
              </div>
            </div>

            <div>
              <Label htmlFor="guardianAddress">Guardian Address</Label>
              <Textarea
                id="guardianAddress"
                rows={2}
                value={form.guardianAddress}
                onChange={(e) =>
                  updateField("guardianAddress", e.target.value)
                }
              />
              {renderError("guardianAddress")}
            </div>
          </CardContent>
        </Card>

        {/* ADMISSION */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              3. Admission Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label>Type of Admission</Label>
                <Select
                  value={form.admissionType}
                  onValueChange={(v) => updateField("admissionType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIRECT">Direct</SelectItem>
                    <SelectItem value="TRANSFER">
                      Transfer from Other Ward
                    </SelectItem>
                    <SelectItem value="HOSPITAL">
                      Transfer from Other Hospital
                    </SelectItem>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {renderError("admissionType")}
              </div>
              <div>
                <Label htmlFor="admittingOfficer">Admitting Officer</Label>
                <Input
                  id="admittingOfficer"
                  value={form.admittingOfficer}
                  onChange={(e) =>
                    updateField("admittingOfficer", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="admittingHospital">
                  Admitting Hospital
                </Label>
                <Input
                  id="admittingHospital"
                  value={form.admittingHospital}
                  onChange={(e) =>
                    updateField("admittingHospital", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="presentingComplaints">
                Presenting Complaints
              </Label>
              <Textarea
                id="presentingComplaints"
                rows={3}
                value={form.presentingComplaints}
                onChange={(e) =>
                  updateField("presentingComplaints", e.target.value)
                }
              />
              {renderError("presentingComplaints")}
            </div>

            <p className="text-xs text-slate-500">
              Stamps and direct allergies fields removed as requested; admission
              details are streamlined here.
            </p>
          </CardContent>
        </Card>

        {/* EXAMINATIONS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              4. Examinations at Admission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="tempC">Temperature (°C)</Label>
                <Input
                  id="tempC"
                  type="number"
                  step="0.1"
                  value={form.tempC}
                  onChange={(e) => updateField("tempC", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heightCm">Height (cm)</Label>
                <Input
                  id="heightCm"
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => updateField("heightCm", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  value={form.weightKg}
                  onChange={(e) => updateField("weightKg", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="bmi">BMI (auto)</Label>
                <Input
                  id="bmi"
                  value={form.bmi}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
              <div>
                <Label htmlFor="bpSys">BP High (mmHg)</Label>
                <Input
                  id="bpSys"
                  type="number"
                  value={form.bpSys}
                  onChange={(e) => updateField("bpSys", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bpDia">BP Low (mmHg)</Label>
                <Input
                  id="bpDia"
                  type="number"
                  value={form.bpDia}
                  onChange={(e) => updateField("bpDia", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={form.heartRate}
                  onChange={(e) => updateField("heartRate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PROBLEM LIST */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              5. Problem List (up to 10)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-xs text-slate-500">
              Start with one problem. Click the + button to add more. Maximum 10
              problems as requested.
            </p>
            <div className="space-y-2">
              {form.problems.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={p}
                    onChange={(e) =>
                      handleProblemChange(idx, e.target.value)
                    }
                    placeholder={`Problem ${idx + 1}`}
                  />
                  {form.problems.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeProblem(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {form.problems.length < MAX_PROBLEMS && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProblem}
              >
                <span className="mr-1">+</span> Add Problem
              </Button>
            )}
          </CardContent>
        </Card>

        {/* CURRENT MEDICATIONS LINK */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              6. Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-xs text-slate-500">
              As per your requirement, medications are managed in a separate
              section. This form only keeps a link.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/medications")}
            >
              Go to Medications Tab
            </Button>
          </CardContent>
        </Card>

        {/* SUBMIT */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Save Patient
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPatient;
