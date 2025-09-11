import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, UserCheck, Users, Heart, TrendingUp } from "lucide-react";
import DonorAssessment from "../components/DonorAssessment";
import RecipientAssessment from "../components/RecipientAssessment";
import FollowUpForm from "../components/FollowUpForm";
export type ActiveView = 'dashboard' | 'donor-assessment' | 'recipient-assessment' | 'kt' | 'follow-up';

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
      />
      )}
      {activeView === "kt" && (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Kidney Transplant (KT)</h2>
        <p className="text-muted-foreground">Transplant procedure management and documentation.</p>
        <Card>
        <CardHeader>
          <CardTitle>Transplant Procedure</CardTitle>
          <CardDescription>Document transplant surgery details</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Transplant procedure functionality will be implemented here.</p>
        </CardContent>
        </Card>
      </div>
      )}
      {activeView === "follow-up" && (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Follow Up</h2>
        <p className="text-muted-foreground">Post-transplant monitoring and care management.</p>
        <FollowUpForm setActiveView={setActiveView} />
      </div>
      )}
      {activeView === "dashboard" && (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Kidney Transplant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kidney transplant program management and patient tracking
          </p>
        </div>
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <CardTitle>Donor Assessment</CardTitle>
              </div>
              <CardDescription>
                Register and assess kidney donors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveView("donor-assessment")} className="w-full">
                Go to Donor Assessment
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle>Recipient Assessment</CardTitle>
              </div>
              <CardDescription>
                Register and assess transplant recipients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveView("recipient-assessment")} className="w-full">
                Go to Recipient Assessment
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <CardTitle>KT</CardTitle>
              </div>
              <CardDescription>
                Kidney transplant surgery details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveView("kt")} className="w-full">
                Go to KT
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle>Follow Up</CardTitle>
              </div>
              <CardDescription>
                Post-transplant follow-up and monitoring.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveView("follow-up")} className="w-full">
                Go to Follow Up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
};

export default KidneyTransplant;
