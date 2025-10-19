import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, UserCheck, Activity, Save, ArrowLeft, Pill, Users, ClipboardList,User,FileText,Stethoscope,Shield,TestTube,CheckCircle,ChevronRight,Eye,UserPlus,ArrowRight} from "lucide-react";
import { DonorDetailsModal } from "./DonorDetailsModal";

interface DonorAssessmentForm {
  name: string;
  age: string;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  nicNo: string;
  contactDetails: string;
  emailAddress: string;
  relationToRecipient: string;
  relationType: string;
  comorbidities: {
    dl: boolean;
    dm: boolean;
    psychiatricIllness: boolean;
    htn: boolean;
    ihd: boolean;
  };
  complains: string;
  systemicInquiry: {
    constitutional: {
      loa: boolean;
      low: boolean;
    };
    cvs: {
      chestPain: boolean;
      odema: boolean;
      sob: boolean;
    };
    respiratory: {
      cough: boolean;
      hemoptysis: boolean;
      wheezing: boolean;
    };
    git: {
      constipation: boolean;
      diarrhea: boolean;
      melena: boolean;
      prBleeding: boolean;
    };
    renal: {
      hematuria: boolean;
      frothyUrine: boolean;
    };
    neuro: {
      seizures: boolean;
      visualDisturbance: boolean;
      headache: boolean;
      limbWeakness: boolean;
    };
    gynecology: {
      pvBleeding: boolean;
      menopause: boolean;
      menorrhagia: boolean;
      lrmp: boolean;
    };
    sexualHistory: string;
  };
  drugHistory: string;
  allergyHistory: {
    foods: boolean;
    drugs: boolean;
    p: boolean;
  };
  familyHistory: {
    dm: string;
    htn: string;
    ihd: string;
    stroke: string;
    renal: string;
  };
  substanceUse: {
    smoking: boolean;
    alcohol: boolean;
    other: string;
  };
  socialHistory: {
    spouseDetails: string;
    childrenDetails: string;
    income: string;
    other: string;
  };
  examination: {
    height: string;
    weight: string;
    bmi: string;
    pallor: boolean;
    icterus: boolean;
    oral: {
      dentalCaries: boolean;
      oralHygiene: boolean;
      satisfactory: boolean;
      unsatisfactory: boolean;
    };
    lymphNodes: {
      cervical: boolean;
      axillary: boolean;
      inguinal: boolean;
    };
    clubbing: boolean;
    ankleOedema: boolean;
    cvs: {
      bp: string;
      pr: string;
      murmurs: boolean;
    };
    respiratory: {
      rr: string;
      spo2: string;
      auscultation: boolean;
      crepts: boolean;
      ranchi: boolean;
      effusion: boolean;
    };
    abdomen: {
      hepatomegaly: boolean;
      splenomegaly: boolean;
      renalMasses: boolean;
      freeFluid: boolean;
    };
    BrcostExamination: string;
    neurologicalExam: {
      cranialNerves: boolean;
      upperLimb: boolean;
      lowerLimb: boolean;
      coordination: boolean;
    };
  };
  immunologicalDetails: {
    bloodGroup: {
      d: string;
      r: string;
    };
    crossMatch: {
      tCell: string;
      bCell: string;
    };
    hlaTyping: {
      donor: {
        hlaA: string;
        hlaB: string;
        hlaC: string;
        hlaDR: string;
        hlaDP: string;
        hlaDQ: string;
      };
      recipient: {
        hlaA: string;
        hlaB: string;
        hlaC: string;
        hlaDR: string;
        hlaDP: string;
        hlaDQ: string;
      };
      conclusion: {
        hlaA: string;
        hlaB: string;
        hlaC: string;
        hlaDR: string;
        hlaDP: string;
        hlaDQ: string;
      };
    };
    pra: {
      pre: string;
      post: string;
    };
    dsa: string;
    immunologicalRisk: string;
  };
}

const FORM_STEPS = [
  { title: "Personal Info", icon: User },
  { title: "Relationship", icon: Users },
  { title: "Medical History", icon: FileText },
  { title: "Systemic Inquiry", icon: ClipboardList },
  { title: "Drug & Allergy", icon: Pill },
  { title: "Family History", icon: Heart },
  { title: "Substance Use", icon: Activity },
  { title: "Social History", icon: UserCheck },
  { title: "Examination", icon: Stethoscope },
  { title: "Immunological", icon: TestTube },
  { title: "Confirmation", icon: CheckCircle }
];

interface DonorAssessmentProps {
  donorForm?: DonorAssessmentForm;
  setDonorForm?: (form: DonorAssessmentForm) => void;
  setActiveView?: (view: 'dashboard' | 'donor-assessment' | 'recipient-assessment' | 'kt' | 'follow-up' | 'summary') => void;
  handleDonorFormChange?: (field: string, value: any) => void;
  handleDonorFormSubmit?: (e: React.FormEvent) => void;
}

const DonorAssessmentTabs: React.FC<DonorAssessmentProps> = ({
  donorForm,
  setDonorForm,
  setActiveView,
  handleDonorFormChange,
  handleDonorFormSubmit,
}) => {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [currentStep, setCurrentStep] = useState(0);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorAssessmentForm | null>(null);
  
  // Use props data if available, otherwise use local state
  const [localFormData, setLocalFormData] = useState<DonorAssessmentForm>({
    name: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    occupation: '',
    address: '',
    nicNo: '',
    contactDetails: '',
    emailAddress: '',
    relationToRecipient: '',
    relationType: '',
    comorbidities: {
      dl: false,
      dm: false,
      psychiatricIllness: false,
      htn: false,
      ihd: false
    },
    complains: '',
    systemicInquiry: {
      constitutional: {
        loa: false,
        low: false
      },
      cvs: {
        chestPain: false,
        odema: false,
        sob: false
      },
      respiratory: {
        cough: false,
        hemoptysis: false,
        wheezing: false
      },
      git: {
        constipation: false,
        diarrhea: false,
        melena: false,
        prBleeding: false
      },
      renal: {
        hematuria: false,
        frothyUrine: false
      },
      neuro: {
        seizures: false,
        visualDisturbance: false,
        headache: false,
        limbWeakness: false
      },
      gynecology: {
        pvBleeding: false,
        menopause: false,
        menorrhagia: false,
        lrmp: false
      },
      sexualHistory: ''
    },
    drugHistory: '',
    allergyHistory: {
      foods: false,
      drugs: false,
      p: false
    },
    familyHistory: {
      dm: '',
      htn: '',
      ihd: '',
      stroke: '',
      renal: ''
    },
    substanceUse: {
      smoking: false,
      alcohol: false,
      other: ''
    },
    socialHistory: {
      spouseDetails: '',
      childrenDetails: '',
      income: '',
      other: ''
    },
    examination: {
      height: '',
      weight: '',
      bmi: '',
      pallor: false,
      icterus: false,
      oral: {
        dentalCaries: false,
        oralHygiene: false,
        satisfactory: false,
        unsatisfactory: false
      },
      lymphNodes: {
        cervical: false,
        axillary: false,
        inguinal: false
      },
      clubbing: false,
      ankleOedema: false,
      cvs: {
        bp: '',
        pr: '',
        murmurs: false
      },
      respiratory: {
        rr: '',
        spo2: '',
        auscultation: false,
        crepts: false,
        ranchi: false,
        effusion: false
      },
      abdomen: {
        hepatomegaly: false,
        splenomegaly: false,
        renalMasses: false,
        freeFluid: false
      },
      BrcostExamination: '',
      neurologicalExam: {
        cranialNerves: false,
        upperLimb: false,
        lowerLimb: false,
        coordination: false
      }
    },
    immunologicalDetails: {
      bloodGroup: {
        d: '',
        r: ''
      },
      crossMatch: {
        tCell: '',
        bCell: ''
      },
      hlaTyping: {
        donor: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: ''
        },
        recipient: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: ''
        },
        conclusion: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: ''
        }
      },
      pra: {
        pre: '',
        post: ''
      },
      dsa: '',
      immunologicalRisk: ''
    }
  });

  // Use props data if available, otherwise use local state
  const formData = donorForm || localFormData;
  const setFormData = setDonorForm || setLocalFormData;
  const handleFieldChange = handleDonorFormChange || ((field: string, value: any) => {
    const keys = field.split('.');
    setFormData((prev: DonorAssessmentForm) => {
      const updated = { ...prev };
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      
      if (subChild) {
        setFormData(prev => {
          const parentObj = prev[parent as keyof DonorAssessmentForm];
          
          if (typeof parentObj !== 'object' || parentObj === null) {
            return prev;
          }
          
          const childObj = (parentObj as any)[child];
          
          if (typeof childObj !== 'object' || childObj === null) {
            return {
              ...prev,
              [parent]: {
                ...parentObj,
                [child]: {
                  [subChild]: type === 'checkbox' ? checked : value
                }
              }
            };
          }
          
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: {
                ...childObj,
                [subChild]: type === 'checkbox' ? checked : value
              }
            }
          };
        });
      } else {
        setFormData(prev => {
          const parentObj = prev[parent as keyof DonorAssessmentForm];
          
          if (typeof parentObj !== 'object' || parentObj === null) {
            return prev;
          }
          
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: type === 'checkbox' ? checked : value
            }
          };
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const calculateBMI = () => {
    const height = parseFloat(formData.examination.height);
    const weight = parseFloat(formData.examination.weight);
    if (height && weight) {
      const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
      setFormData(prev => ({
        ...prev,
        examination: {
          ...prev.examination,
          bmi: bmi
        }
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Donor registration submitted successfully!');
    setCurrentStep(0);
  };


  const renderAvailableDonors = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">Available Donors</h2>
          <p className="text-slate-600">Review and select from registered donors</p>
        </div>
        <Button 
          onClick={() => setCurrentView('form')}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Donor
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Donor</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Blood Type</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Last Assessment</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "John Smith", bloodType: "O+", date: "2023-05-15", status: "Eligible", statusColor: "green" },
                  { name: "Maria Garcia", bloodType: "A-", date: "2023-08-22", status: "Eligible", statusColor: "green" },
                  { name: "Robert Johnson", bloodType: "B+", date: "2023-01-30", status: "Pending Review", statusColor: "yellow" }
                ].map((donor, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{donor.name}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{donor.bloodType}</td>
                    <td className="py-4 px-6 text-slate-600">{donor.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        donor.statusColor === 'green' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {donor.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-slate-600 border-slate-300 hover:bg-slate-50"
                          onClick={() => {
                            setSelectedDonor({
                              name: donor.name,
                              age: "35", // Mock data - in real app this would come from the donor record
                              gender: "Male",
                              dateOfBirth: "1989-01-01",
                              occupation: "Software Engineer",
                              address: "123 Main St, City",
                              nicNo: "123456789V",
                              contactDetails: "+94 77 123 4567",
                              emailAddress: "john.smith@email.com",
                              relationToRecipient: "Brother",
                              relationType: "Family",
                              comorbidities: {
                                dl: false,
                                dm: false,
                                psychiatricIllness: false,
                                htn: false,
                                ihd: false
                              },
                              complains: "No current complaints",
                              systemicInquiry: {
                                constitutional: { loa: false, low: false },
                                cvs: { chestPain: false, odema: false, sob: false },
                                respiratory: { cough: false, hemoptysis: false, wheezing: false },
                                git: { constipation: false, diarrhea: false, melena: false, prBleeding: false },
                                renal: { hematuria: false, frothyUrine: false },
                                neuro: { seizures: false, visualDisturbance: false, headache: false, limbWeakness: false },
                                gynecology: { pvBleeding: false, menopause: false, menorrhagia: false, lrmp: false },
                                sexualHistory: ""
                              },
                              drugHistory: "None",
                              allergyHistory: { foods: false, drugs: false, p: false },
                              familyHistory: { dm: "", htn: "", ihd: "", stroke: "", renal: "" },
                              substanceUse: { smoking: false, alcohol: false, other: "" },
                              socialHistory: { spouseDetails: "", childrenDetails: "", income: "", other: "" },
                              examination: {
                                height: "175",
                                weight: "70",
                                bmi: "22.9",
                                pallor: false,
                                icterus: false,
                                oral: { dentalCaries: false, oralHygiene: true, satisfactory: true, unsatisfactory: false },
                                lymphNodes: { cervical: false, axillary: false, inguinal: false },
                                clubbing: false,
                                ankleOedema: false,
                                cvs: { bp: "120/80", pr: "72", murmurs: false },
                                respiratory: { rr: "16", spo2: "98", auscultation: true, crepts: false, ranchi: false, effusion: false },
                                abdomen: { hepatomegaly: false, splenomegaly: false, renalMasses: false, freeFluid: false },
                                BrcostExamination: "",
                                neurologicalExam: { cranialNerves: true, upperLimb: true, lowerLimb: true, coordination: true }
                              },
                              immunologicalDetails: {
                                bloodGroup: { d: "O", r: "+" },
                                crossMatch: { tCell: "Negative", bCell: "Negative" },
                                hlaTyping: {
                                  donor: { hlaA: "A*01:01", hlaB: "B*08:01", hlaC: "C*07:01", hlaDR: "DRB1*03:01", hlaDP: "DPB1*04:01", hlaDQ: "DQB1*02:01" },
                                  recipient: { hlaA: "A*02:01", hlaB: "B*07:02", hlaC: "C*07:02", hlaDR: "DRB1*04:01", hlaDP: "DPB1*03:01", hlaDQ: "DQB1*03:02" },
                                  conclusion: { hlaA: "Mismatch", hlaB: "Mismatch", hlaC: "Match", hlaDR: "Mismatch", hlaDP: "Mismatch", hlaDQ: "Mismatch" }
                                },
                                pra: { pre: "5%", post: "0%" },
                                dsa: "Negative",
                                immunologicalRisk: "Low"
                              }
                            });
                            setShowDonorModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Select
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CheckboxField = ({ name, label, checked }: { name: string; label: string; checked: boolean }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
      <Checkbox
        name={name}
        checked={checked}
        onCheckedChange={(checked) => {
          const syntheticEvent = {
            target: { name, checked, type: 'checkbox' }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(syntheticEvent);
        }}
        className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
      <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </label>
  );

  const InputField = ({ name, label, value, type = "text", placeholder = "", required = false }: { 
    name: string; 
    label: string; 
    value: string; 
    type?: string; 
    placeholder?: string;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );

  const SectionCard = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white border border-slate-200 rounded-lg p-6 ${className}`}>
      <h4 className="text-base font-medium text-slate-900 mb-4">{title}</h4>
      {children}
    </div>
  );

  const renderFormStep = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="name" label="Full Name" value={formData.name} placeholder="Enter full name" required />
              <InputField name="age" label="Age" value={formData.age} placeholder="Enter age" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Gender <span className="text-red-500 ml-1">*</span>
                </Label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <InputField name="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} type="date" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="occupation" label="Occupation" value={formData.occupation} placeholder="Enter occupation" />
              <InputField name="nicNo" label="NIC Number" value={formData.nicNo} placeholder="Enter NIC number" required />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Address</Label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter full address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="contactDetails" label="Phone Number" value={formData.contactDetails} placeholder="Enter phone number" required />
              <InputField name="emailAddress" label="Email Address" value={formData.emailAddress} type="email" placeholder="Enter email address" />
            </div>
          </div>
        );

      case 1: // Relationship
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                name="relationToRecipient" 
                label="Relation to Recipient" 
                value={formData.relationToRecipient} 
                placeholder="Enter relationship" 
                required
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Type of Relation <span className="text-red-500 ml-1">*</span>
                </Label>
                <select
                  name="relationType"
                  value={formData.relationType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select relation type</option>
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2: // Medical History
        return (
          <div className="space-y-6">
            <SectionCard title="Comorbidities">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField name="comorbidities.dm" label="Diabetes Mellitus" checked={formData.comorbidities.dm} />
                <CheckboxField name="comorbidities.htn" label="Hypertension" checked={formData.comorbidities.htn} />
                <CheckboxField name="comorbidities.ihd" label="Ischemic Heart Disease" checked={formData.comorbidities.ihd} />
                <CheckboxField name="comorbidities.psychiatricIllness" label="Psychiatric Illness" checked={formData.comorbidities.psychiatricIllness} />
              </div>
            </SectionCard>

            <SectionCard title="Renal System">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField name="systemicInquiry.renal.hematuria" label="Hematuria" checked={formData.systemicInquiry.renal.hematuria} />
                <CheckboxField name="systemicInquiry.renal.frothyUrine" label="Frothy Urine" checked={formData.systemicInquiry.renal.frothyUrine} />
              </div>
            </SectionCard>

            <SectionCard title="Neurological System">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField name="systemicInquiry.neuro.seizures" label="Seizures" checked={formData.systemicInquiry.neuro.seizures} />
                <CheckboxField name="systemicInquiry.neuro.visualDisturbance" label="Visual Disturbance" checked={formData.systemicInquiry.neuro.visualDisturbance} />
                <CheckboxField name="systemicInquiry.neuro.headache" label="Headache" checked={formData.systemicInquiry.neuro.headache} />
                <CheckboxField name="systemicInquiry.neuro.limbWeakness" label="Limb Weakness" checked={formData.systemicInquiry.neuro.limbWeakness} />
              </div>
            </SectionCard>

            <SectionCard title="Gynecological History">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField name="systemicInquiry.gynecology.pvBleeding" label="PV Bleeding" checked={formData.systemicInquiry.gynecology.pvBleeding} />
                <CheckboxField name="systemicInquiry.gynecology.menopause" label="Menopause" checked={formData.systemicInquiry.gynecology.menopause} />
                <CheckboxField name="systemicInquiry.gynecology.menorrhagia" label="Menorrhagia" checked={formData.systemicInquiry.gynecology.menorrhagia} />
                <CheckboxField name="systemicInquiry.gynecology.lrmp" label="LRMP" checked={formData.systemicInquiry.gynecology.lrmp} />
              </div>
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium text-slate-700">Sexual History</Label>
                <Textarea
                  name="systemicInquiry.sexualHistory"
                  value={formData.systemicInquiry.sexualHistory}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter sexual history details"
                />
              </div>
            </SectionCard>
          </div>
        );

      case 3: // Systemic Inquiry
        return (
          <div className="space-y-6">
            <SectionCard title="Constitutional Symptoms">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxField name="systemicInquiry.constitutional.loa" label="Loss of Appetite" checked={formData.systemicInquiry.constitutional.loa} />
                <CheckboxField name="systemicInquiry.constitutional.low" label="Loss of Weight" checked={formData.systemicInquiry.constitutional.low} />
              </div>
            </SectionCard>

            <SectionCard title="Cardiovascular System">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxField name="systemicInquiry.cvs.chestPain" label="Chest Pain" checked={formData.systemicInquiry.cvs.chestPain} />
                <CheckboxField name="systemicInquiry.cvs.odema" label="Edema" checked={formData.systemicInquiry.cvs.odema} />
                <CheckboxField name="systemicInquiry.cvs.sob" label="Shortness of Breath" checked={formData.systemicInquiry.cvs.sob} />
              </div>
            </SectionCard>

            <SectionCard title="Respiratory System">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxField name="systemicInquiry.respiratory.cough" label="Cough" checked={formData.systemicInquiry.respiratory.cough} />
                <CheckboxField name="systemicInquiry.respiratory.hemoptysis" label="Hemoptysis" checked={formData.systemicInquiry.respiratory.hemoptysis} />
                <CheckboxField name="systemicInquiry.respiratory.wheezing" label="Wheezing" checked={formData.systemicInquiry.respiratory.wheezing} />
              </div>
            </SectionCard>

            <SectionCard title="Gastrointestinal System">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField name="systemicInquiry.git.constipation" label="Constipation" checked={formData.systemicInquiry.git.constipation} />
                <CheckboxField name="systemicInquiry.git.diarrhea" label="Diarrhea" checked={formData.systemicInquiry.git.diarrhea} />
                <CheckboxField name="systemicInquiry.git.melena" label="Melena" checked={formData.systemicInquiry.git.melena} />
                <CheckboxField name="systemicInquiry.git.prBleeding" label="PR Bleeding" checked={formData.systemicInquiry.git.prBleeding} />
              </div>
            </SectionCard>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Chief Complaints</Label>
              <Textarea
                name="complains"
                value={formData.complains}
                onChange={handleInputChange}
                rows={4}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter chief complaints and details"
              />
            </div>
          </div>
        );

      case 4: // Drug & Allergy
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Current Medications</Label>
              <Textarea
                name="drugHistory"
                value={formData.drugHistory}
                onChange={handleInputChange}
                rows={4}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="List current medications, dosages, and duration"
              />
            </div>

            <SectionCard title="Known Allergies">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxField name="allergyHistory.foods" label="Food Allergies" checked={formData.allergyHistory.foods} />
                <CheckboxField name="allergyHistory.drugs" label="Drug Allergies" checked={formData.allergyHistory.drugs} />
                <CheckboxField name="allergyHistory.p" label="Environmental Allergies" checked={formData.allergyHistory.p} />
              </div>
            </SectionCard>
          </div>
        );

      case 5: // Family History
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="familyHistory.dm" label="Diabetes Mellitus" value={formData.familyHistory.dm} placeholder="Family member relationship" />
              <InputField name="familyHistory.htn" label="Hypertension" value={formData.familyHistory.htn} placeholder="Family member relationship" />
              <InputField name="familyHistory.ihd" label="Ischemic Heart Disease" value={formData.familyHistory.ihd} placeholder="Family member relationship" />
              <InputField name="familyHistory.stroke" label="Stroke" value={formData.familyHistory.stroke} placeholder="Family member relationship" />
              <InputField name="familyHistory.renal" label="Renal Disease" value={formData.familyHistory.renal} placeholder="Family member relationship" />
            </div>
          </div>
        );

      case 6: // Substance Use
        return (
          <div className="space-y-6">
            <SectionCard title="Substance Use History">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CheckboxField name="substanceUse.smoking" label="Smoking" checked={formData.substanceUse.smoking} />
                  <CheckboxField name="substanceUse.alcohol" label="Alcohol" checked={formData.substanceUse.alcohol} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Other Substances</Label>
                  <Textarea
                    name="substanceUse.other"
                    value={formData.substanceUse.other}
                    onChange={handleInputChange}
                    rows={3}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Describe any other substance use"
                  />
                </div>
              </div>
            </SectionCard>
          </div>
        );

      case 7: // Social History
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Spouse Details</Label>
                <Textarea
                  name="socialHistory.spouseDetails"
                  value={formData.socialHistory.spouseDetails}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Spouse information"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Children Details</Label>
                <Textarea
                  name="socialHistory.childrenDetails"
                  value={formData.socialHistory.childrenDetails}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Children information"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField name="socialHistory.income" label="Monthly Income" value={formData.socialHistory.income} placeholder="Monthly income" />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Other Social Information</Label>
                <Textarea
                  name="socialHistory.other"
                  value={formData.socialHistory.other}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Other relevant social information"
                />
              </div>
            </div>
          </div>
        );

      case 8: // Examination
        return (
          <div className="space-y-6">
            <SectionCard title="Anthropometric Measurements">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField 
                  name="examination.height" 
                  label="Height (cm)" 
                  value={formData.examination.height} 
                  placeholder="Height in cm"
                />
                <InputField 
                  name="examination.weight" 
                  label="Weight (kg)" 
                  value={formData.examination.weight} 
                  placeholder="Weight in kg"
                />
                <div className="space-y-2">
                  <InputField 
                    name="examination.bmi" 
                    label="BMI" 
                    value={formData.examination.bmi} 
                    placeholder="Auto-calculated"
                  />
                  <Button
                    type="button"
                    onClick={calculateBMI}
                    size="sm"
                    variant="outline"
                    className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Calculate BMI
                  </Button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="General Examination">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField name="examination.pallor" label="Pallor" checked={formData.examination.pallor} />
                <CheckboxField name="examination.icterus" label="Icterus" checked={formData.examination.icterus} />
                <CheckboxField name="examination.clubbing" label="Clubbing" checked={formData.examination.clubbing} />
                <CheckboxField name="examination.ankleOedema" label="Ankle Edema" checked={formData.examination.ankleOedema} />
              </div>
            </SectionCard>

            <SectionCard title="Oral Examination">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField name="examination.oral.dentalCaries" label="Dental Caries" checked={formData.examination.oral.dentalCaries} />
                <CheckboxField name="examination.oral.oralHygiene" label="Poor Oral Hygiene" checked={formData.examination.oral.oralHygiene} />
                <CheckboxField name="examination.oral.satisfactory" label="Satisfactory" checked={formData.examination.oral.satisfactory} />
                <CheckboxField name="examination.oral.unsatisfactory" label="Unsatisfactory" checked={formData.examination.oral.unsatisfactory} />
              </div>
            </SectionCard>

            <SectionCard title="Lymph Nodes">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CheckboxField name="examination.lymphNodes.cervical" label="Cervical" checked={formData.examination.lymphNodes.cervical} />
                <CheckboxField name="examination.lymphNodes.axillary" label="Axillary" checked={formData.examination.lymphNodes.axillary} />
                <CheckboxField name="examination.lymphNodes.inguinal" label="Inguinal" checked={formData.examination.lymphNodes.inguinal} />
              </div>
            </SectionCard>

            <SectionCard title="Cardiovascular System">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField name="examination.cvs.bp" label="Blood Pressure" value={formData.examination.cvs.bp} placeholder="e.g., 120/80" />
                <InputField name="examination.cvs.pr" label="Pulse Rate" value={formData.examination.cvs.pr} placeholder="e.g., 72 bpm" />
                <div className="flex items-end pb-2">
                  <CheckboxField name="examination.cvs.murmurs" label="Murmurs" checked={formData.examination.cvs.murmurs} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Respiratory System">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField name="examination.respiratory.rr" label="Respiratory Rate" value={formData.examination.respiratory.rr} placeholder="e.g., 16/min" />
                  <InputField name="examination.respiratory.spo2" label="SpO2" value={formData.examination.respiratory.spo2} placeholder="e.g., 98%" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <CheckboxField name="examination.respiratory.auscultation" label="Abnormal Auscultation" checked={formData.examination.respiratory.auscultation} />
                  <CheckboxField name="examination.respiratory.crepts" label="Crepts" checked={formData.examination.respiratory.crepts} />
                  <CheckboxField name="examination.respiratory.ranchi" label="Ronchi" checked={formData.examination.respiratory.ranchi} />
                  <CheckboxField name="examination.respiratory.effusion" label="Effusion" checked={formData.examination.respiratory.effusion} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Abdominal Examination">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField name="examination.abdomen.hepatomegaly" label="Hepatomegaly" checked={formData.examination.abdomen.hepatomegaly} />
                <CheckboxField name="examination.abdomen.splenomegaly" label="Splenomegaly" checked={formData.examination.abdomen.splenomegaly} />
                <CheckboxField name="examination.abdomen.renalMasses" label="Renal Masses" checked={formData.examination.abdomen.renalMasses} />
                <CheckboxField name="examination.abdomen.freeFluid" label="Free Fluid" checked={formData.examination.abdomen.freeFluid} />
              </div>
            </SectionCard>

            <SectionCard title="Breast/Chest Examination">
              <div className="space-y-2">
                <Textarea
                  name="examination.BrcostExamination"
                  value={formData.examination.BrcostExamination}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe breast/chest examination findings"
                />
              </div>
            </SectionCard>

            <SectionCard title="Neurological Examination">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CheckboxField name="examination.neurologicalExam.cranialNerves" label="Cranial Nerves Abnormal" checked={formData.examination.neurologicalExam.cranialNerves} />
                <CheckboxField name="examination.neurologicalExam.upperLimb" label="Upper Limb Abnormal" checked={formData.examination.neurologicalExam.upperLimb} />
                <CheckboxField name="examination.neurologicalExam.lowerLimb" label="Lower Limb Abnormal" checked={formData.examination.neurologicalExam.lowerLimb} />
                <CheckboxField name="examination.neurologicalExam.coordination" label="Coordination Abnormal" checked={formData.examination.neurologicalExam.coordination} />
              </div>
            </SectionCard>
          </div>
        );

      case 9: // Immunological
        return (
          <div className="space-y-6">
            <SectionCard title="Blood Group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  name="immunological.bloodGroup.d"
                  label="D"
                  value={formData.immunologicalDetails?.bloodGroup?.d || ''}
                  placeholder="Enter D value" 
                />
                <InputField 
                  name="immunological.bloodGroup.r"
                  label="R"
                  value={formData.immunologicalDetails?.bloodGroup?.r || ''}
                  placeholder="Enter R value" 
                />
              </div>
            </SectionCard>
            
            <SectionCard title="Cross Match">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  name="immunological.crossMatch.tCell"
                  label="T Cell"
                  value={formData.immunologicalDetails?.crossMatch?.tCell || ''}
                  placeholder="Enter T cell value" 
                />
                <InputField 
                  name="immunological.crossMatch.bCell"
                  label="B Cell"
                  value={formData.immunologicalDetails?.crossMatch?.bCell || ''}
                  placeholder="Enter B cell value" 
                />
              </div>
            </SectionCard>
            
            <SectionCard title="HLA Typing">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">HLA-A</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">HLA-B</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">HLA-C</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">HLA-DR</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">HLA-DP</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">HLA-DQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['donor', 'recipient', 'conclusion'].map((type) => (
                      <tr key={type} className="border-b border-slate-200">
                        <td className="py-3 px-4 font-medium text-slate-700 capitalize">{type}</td>
                        {['hlaA', 'hlaB', 'hlaC', 'hlaDR', 'hlaDP', 'hlaDQ'].map((hla) => (
                          <td key={hla} className="py-3 px-2">
                            <Input 
                              name={`immunological.hlaTyping.${type}.${hla}`}
                              value={formData.immunologicalDetails?.hlaTyping?.[type as keyof typeof formData.immunologicalDetails.hlaTyping]?.[hla as keyof typeof formData.immunologicalDetails.hlaTyping.donor] || ''}
                              onChange={handleInputChange}
                              className="h-9 text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder={hla.replace('hla', '')} 
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
            
            <SectionCard title="PRA (Panel Reactive Antibodies)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  name="immunological.pra.pre"
                  label="Pre (%)"
                  value={formData.immunologicalDetails?.pra?.pre || ''}
                  placeholder="Enter pre PRA percentage" 
                />
                <InputField 
                  name="immunological.pra.post"
                  label="Post (%)"
                  value={formData.immunologicalDetails?.pra?.post || ''}
                  placeholder="Enter post PRA percentage" 
                />
              </div>
            </SectionCard>
            
            <SectionCard title="DSA & Risk Assessment">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">DSA (Donor Specific Antibodies)</Label>
                  <Input 
                    name="immunological.dsa"
                    value={formData.immunologicalDetails?.dsa || ''}
                    onChange={handleInputChange}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter DSA details" 
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Immunological Risk</Label>
                  <RadioGroup
                    value={formData.immunologicalDetails?.immunologicalRisk || ''}
                    onValueChange={(value) => {
                      const syntheticEvent = {
                        target: { name: 'immunologicalDetails.immunologicalRisk', value, type: 'radio' }
                      } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(syntheticEvent);
                    }}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="text-sm text-slate-700 cursor-pointer">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Low</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="average" />
                      <Label htmlFor="average" className="text-sm text-slate-700 cursor-pointer">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Average</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="text-sm text-slate-700 cursor-pointer">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </SectionCard>
          </div>
        );

      case 10: // Confirmation
        return (
          <div className="space-y-6">
            <SectionCard title="Registration Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Name:</span>
                    <span className="text-slate-900">{formData.name || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Age:</span>
                    <span className="text-slate-900">{formData.age || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Gender:</span>
                    <span className="text-slate-900">{formData.gender || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">NIC:</span>
                    <span className="text-slate-900">{formData.nicNo || 'Not provided'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Contact:</span>
                    <span className="text-slate-900">{formData.contactDetails || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Email:</span>
                    <span className="text-slate-900">{formData.emailAddress || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Relation:</span>
                    <span className="text-slate-900">{formData.relationToRecipient || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-600">Relation Type:</span>
                    <span className="text-slate-900">{formData.relationType || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-amber-800 mb-1">Important Notice</h5>
                  <p className="text-sm text-amber-700">
                    Please review all information carefully before submitting. Once submitted, the donor will be entered into the assessment process and contacted for further medical evaluation and testing.
                  </p>
                </div>
              </div>
            </div>

            <SectionCard title="Consent and Confirmation">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    required
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    I confirm that all information provided is accurate to the best of my knowledge and understand the importance of providing truthful medical information.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    required
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    I consent to the processing of this information for donor assessment purposes and understand that this data will be used for medical evaluation and matching processes.
                  </span>
                </label>
              </div>
            </SectionCard>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-2">{FORM_STEPS[currentStep].title}</h3>
              <p className="text-slate-600">This section is under development.</p>
            </div>
          </div>
        );
    }
  };

    const renderRegisterForm = () => (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => {
          setCurrentView('list');
          setCurrentStep(0);
        }}
        className="mb-4 flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Donor List
      </Button>

      {/* Progress Stepper */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative mb-2">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200">
              <div 
                className="h-0.5 bg-blue-600 transition-all duration-300"
                style={{ width: `${(currentStep / (FORM_STEPS.length - 1)) * 100}%` }}
              />
            </div>
            
            {FORM_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center relative">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 bg-white relative z-10
                    ${currentStep >= index 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-slate-300 text-slate-400'
                    }
                  `}>
                    {currentStep > index ? (
                      <CheckCircle className="w-6 h-6 text-blue-600 fill-current" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className={`
                    text-center mt-3 transition-colors duration-200
                    ${currentStep >= index ? 'text-slate-900' : 'text-slate-400'}
                  `}>
                    <div className="text-xs font-medium">{step.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              {React.createElement(FORM_STEPS[currentStep].icon, { className: "w-5 h-5 text-blue-600" })}
              {FORM_STEPS[currentStep].title}
            </CardTitle>
            <CardDescription className="text-slate-600">
              Step {currentStep + 1} of {FORM_STEPS.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {renderFormStep()}
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className={`${
              currentStep === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < FORM_STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Complete Registration
            </Button>
          )}
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Donor Assessment</h1>
              <p className="text-blue-600">Comprehensive donor evaluation and management system</p>
            </div>
            {setActiveView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView("dashboard")}
                className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-8">
          {currentView === 'list' && renderAvailableDonors()}
          {currentView === 'form' && renderRegisterForm()}
        </div>
      </div>
      
      {/* Donor Details Modal */}
      <DonorDetailsModal
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        donorData={selectedDonor}
      />
    </div>
  );
};

export default DonorAssessmentTabs;