import { Dispatch, SetStateAction, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, UserCheck, Users, Heart, TrendingUp } from "lucide-react";
import DonorAssessment from "../components/DonorAssessment";
import RecipientAssessment from "../components/RecipientAssessment";
import FollowUpForm from "../components/FollowUp";
import KTFormData  from "../components/KTSurgery";
import { FileText } from "lucide-react";
import KidneyTransplantSummary from "../components/KidneyTransplantSummary";
export type ActiveView = 'dashboard' | 'donor-assessment' | 'recipient-assessment' | 'kt' | 'follow-up' | 'summary';
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

interface RecipientAssessmentForm {
  name: string;
  age: string;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  nicNo: string;
  contactDetails: string;
  emailAddress: string;
  donorId: string;
  relationToRecipient: string;
  relationType: string;
  comorbidities: {
    dm: boolean;
    duration: string;
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

import { usePatientContext } from "../context/PatientContext";
import React from 'react';

const KidneyTransplant = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [donorForm, setDonorForm] = useState<DonorAssessmentForm>({
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
      ihd: false,
    },
    complains: '',
    systemicInquiry: {
      constitutional: {
        loa: false,
        low: false,
      },
      cvs: {
        chestPain: false,
        odema: false,
        sob: false,
      },
      respiratory: {
        cough: false,
        hemoptysis: false,
        wheezing: false,
      },
      git: {
        constipation: false,
        diarrhea: false,
        melena: false,
        prBleeding: false,
      },
      renal: {
        hematuria: false,
        frothyUrine: false,
      },
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
      sexualHistory: '',
    },
    drugHistory: '',
    allergyHistory: {
      foods: false,
      drugs: false,
      p: false,
    },
    familyHistory: {
      dm: '',
      htn: '',
      ihd: '',
      stroke: '',
      renal: '',
    },
    substanceUse: {
      smoking: false,
      alcohol: false,
      other: '',
    },
    socialHistory: {
      spouseDetails: '',
      childrenDetails: '',
      income: '',
      other: '',
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
        unsatisfactory: false,
      },
      lymphNodes: {
        cervical: false,
        axillary: false,
        inguinal: false,
      },
      clubbing: false,
      ankleOedema: false,
      cvs: {
        bp: '',
        pr: '',
        murmurs: false,
      },
      respiratory: {
        rr: '',
        spo2: '',
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
      BrcostExamination: '',
      neurologicalExam: {
        cranialNerves: false,
        upperLimb: false,
        lowerLimb: false,
        coordination: false,
      },
    },
    immunologicalDetails: {
      bloodGroup: {
        d: '',
        r: '',
      },
      crossMatch: {
        tCell: '',
        bCell: '',
      },
      hlaTyping: {
        donor: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: '',
        },
        recipient: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: '',
        },
        conclusion: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: '',
        },
      },
      pra: {
        pre: '',
        post: '',
      },
      dsa: '',
      immunologicalRisk: '',
    },
  });

  const [recipientForm, setRecipientForm] = useState<RecipientAssessmentForm>({
    name: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    occupation: '',
    address: '',
    nicNo: '',
    contactDetails: '',
    emailAddress: '',
    donorId: '',
    relationToRecipient: '',
    relationType: '',
    comorbidities: {
      dm: false,
      duration: '',
      psychiatricIllness: false,
      htn: false,
      ihd: false,
    },
    complains: '',
    systemicInquiry: {
      constitutional: {
        loa: false,
        low: false,
      },
      cvs: {
        chestPain: false,
        odema: false,
        sob: false,
      },
      respiratory: {
        cough: false,
        hemoptysis: false,
        wheezing: false,
      },
      git: {
        constipation: false,
        diarrhea: false,
        melena: false,
        prBleeding: false,
      },
      renal: {
        hematuria: false,
        frothyUrine: false,
      },
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
      sexualHistory: '',
    },
    drugHistory: '',
    allergyHistory: {
      foods: false,
      drugs: false,
      p: false,
    },
    familyHistory: {
      dm: '',
      htn: '',
      ihd: '',
      stroke: '',
      renal: '',
    },
    substanceUse: {
      smoking: false,
      alcohol: false,
      other: '',
    },
    socialHistory: {
      spouseDetails: '',
      childrenDetails: '',
      income: '',
      other: '',
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
        unsatisfactory: false,
      },
      lymphNodes: {
        cervical: false,
        axillary: false,
        inguinal: false,
      },
      clubbing: false,
      ankleOedema: false,
      cvs: {
        bp: '',
        pr: '',
        murmurs: false,
      },
      respiratory: {
        rr: '',
        spo2: '',
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
      BrcostExamination: '',
      neurologicalExam: {
        cranialNerves: false,
        upperLimb: false,
        lowerLimb: false,
        coordination: false,
      },
    },
    immunologicalDetails: {
      bloodGroup: {
        d: '',
        r: '',
      },
      crossMatch: {
        tCell: '',
        bCell: '',
      },
      hlaTyping: {
        donor: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: '',
        },
        recipient: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: '',
        },
        conclusion: {
          hlaA: '',
          hlaB: '',
          hlaC: '',
          hlaDR: '',
          hlaDP: '',
          hlaDQ: '',
        },
      },
      pra: {
        pre: '',
        post: '',
      },
      dsa: '',
      immunologicalRisk: '',
    },
  });

  // Access the setPatientData function from the context
  const { setPatientData } = usePatientContext();
    const [summaryData, setSummaryData] = useState({
    donor: null,
    recipient: null,
    followUp: null,
    surgery: null,
  });

  
  // Helper: update nested objects safely
  const updateNestedField = (obj: any, path: string[], value: any): any => {
    if (path.length === 1) {
      return { ...obj, [path[0]]: value };
    }
    const [head, ...rest] = path;
    return {
      ...obj,
      [head]: updateNestedField(obj[head] ?? {}, rest, value),
    };
  };

  // Donor form handlers
  const handleDonorFormChange = (field: string, value: any) => {
    setDonorForm(prev => {
      // Handle nested paths with dot notation
      if (field.includes('.')) {
        const paths = field.split('.');
        const newForm = { ...prev };
        let current: any = newForm;
        
        for (let i = 0; i < paths.length - 1; i++) {
          current = current[paths[i]];
        }
        
        current[paths[paths.length - 1]] = value;
        return newForm;
      }
      
      // Handle top-level fields
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleDonorFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!donorForm.name || !donorForm.age || !donorForm.gender || !donorForm.nicNo) {
        alert("Please fill in all required fields");
        return;
      }

      // API call to submit donor data
      const response = await fetch('/api/donor-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorForm),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Donor form submitted successfully:", result);
        
        // Update PatientContext with Donor Assessment data
        setPatientData(prev => ({
          ...prev,
          recipientAssessment: {
            name: donorForm.name,
            age: donorForm.age,
            gender: donorForm.gender,
            bloodGroup: donorForm.immunologicalDetails.bloodGroup.d + donorForm.immunologicalDetails.bloodGroup.r,
          },
          ktSurgery: prev.ktSurgery,
          followUp: prev.followUp,
        }));
        
        // Reset form or navigate to next step
        setActiveView('dashboard');
        alert("Donor assessment submitted successfully!");
      } else {
        throw new Error('Failed to submit donor form');
      }
    } catch (error) {
      console.error("Error submitting donor form:", error);
      alert("Error submitting donor assessment. Please try again.");
    }
  };


  // Recipient form handlers
  const handleRecipientFormChange = (field: string, value: any) => {
    setRecipientForm(prev => updateNestedField(prev, field.split("."), value));
  };

  const handleRecipientFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!recipientForm.name || !recipientForm.age || !recipientForm.gender || !recipientForm.nicNo) {
        alert("Please fill in all required fields");
        return;
      }

      // API call to submit recipient data
      const response = await fetch('/api/recipient-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipientForm),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Recipient form submitted successfully:", result);

        // Update PatientContext with Recipient Assessment data
        setPatientData(prev => ({
          ...prev,
          recipientAssessment: {
            name: recipientForm.name,
            age: recipientForm.age,
            gender: recipientForm.gender,
            bloodGroup: recipientForm.immunologicalDetails.bloodGroup.d + recipientForm.immunologicalDetails.bloodGroup.r,
          },
          ktSurgery: prev.ktSurgery,
          followUp: prev.followUp,
        }));
        
        // Reset form or navigate to next step
        setActiveView('dashboard');
        alert("Recipient assessment submitted successfully!");
      } else {
        throw new Error('Failed to submit recipient form');
      }
    } catch (error) {
      console.error("Error submitting recipient form:", error);
      alert("Error submitting recipient assessment. Please try again.");
    }
  };
  return (
    <div>
      {activeView === "donor-assessment" && (
        <DonorAssessment
          donorForm={donorForm}
          setDonorForm={setDonorForm}
          setActiveView={setActiveView}
          handleDonorFormChange={handleDonorFormChange}
          handleDonorFormSubmit={handleDonorFormSubmit}
        />
      )}
      {activeView === "recipient-assessment" && (
        <RecipientAssessment
          recipientForm={recipientForm}
          setRecipientForm={setRecipientForm}
          setActiveView={setActiveView}
          handleRecipientFormChange={handleRecipientFormChange}
          handleRecipientFormSubmit={handleRecipientFormSubmit}
          donors={[]}
        />
      )}
      {activeView === "follow-up" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Follow Up</h2>
          <FollowUpForm setActiveView={setActiveView} />
        </div>
      )}
      {activeView === "kt" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Kidney Transplant & Surgery</h2>
          <KTFormData setActiveView={setActiveView} />
        </div>
      )}
      {activeView === "summary" && (
        <KidneyTransplantSummary />
      )}
      {activeView === "dashboard" && (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-2">
              <Stethoscope className="w-9 h-9 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Kidney Transplant
            </h1>
          </div>

          {/* centered container with 2x2 grid */}
          <div className="max-w-7xl mx-auto px-4"> {/* Increased max-width to accommodate 5 items */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"> {/* Changed to 5 columns */}
    {[
      { icon: UserCheck, title: "Donor Assessment", view: "donor-assessment" },
      { icon: Users, title: "Recipient Assessment", view: "recipient-assessment" },
      { icon: Heart, title: "Kidney Transplant Surgery", view: "kt" },
      { icon: TrendingUp, title: "Follow Up", view: "follow-up" },
      { icon: FileText, title: "Patient Summary", view: "summary" }
    ].map((item) => (
      <Card
        key={item.title}
        className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full"
      > {/* Removed max-width constraints */}
        <div className="flex flex-col items-center text-center">
          <item.icon className="w-10 h-10 text-primary mb-2" />
          <CardTitle className="text-xl font-medium mb-4">{item.title}</CardTitle>
        </div>
        <Button
          onClick={() => setActiveView(item.view as ActiveView)}
          className="px-6 py-2 text-base w-full"
        > {/* Removed max-width constraint */}
          Access
        </Button>
      </Card>
    ))}
  </div>
</div>

          
        </div>
      )}
    </div>
  );
};

export default KidneyTransplant;
