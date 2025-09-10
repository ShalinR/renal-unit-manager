import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope, Users, Calendar, Activity, UserCheck, ClipboardList, Heart, TrendingUp, Save, ArrowLeft, Pill } from "lucide-react";

type ActiveView = 'dashboard' | 'donor-assessment' | 'recipient-assessment' | 'kt' | 'follow-up';

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
  });

  const handleDonorFormChange = (field: string, value: any) => {
    if (field.startsWith('comorbidities.')) {
      const comorbidityField = field.split('.')[1];
      setDonorForm(prev => ({
        ...prev,
        comorbidities: {
          ...prev.comorbidities,
          [comorbidityField]: value,
        },
      }));
    } else if (field.startsWith('systemicInquiry.')) {
      const parts = field.split('.');
      const section = parts[1];
      const subField = parts[2];
      setDonorForm(prev => ({
        ...prev,
        systemicInquiry: {
          ...prev.systemicInquiry,
          [section]: {
            ...(prev.systemicInquiry[section as keyof typeof prev.systemicInquiry] as any),
            [subField]: value,
          },
        },
      }));
    } else if (field.startsWith('allergyHistory.')) {
      const allergyField = field.split('.')[1];
      setDonorForm(prev => ({
        ...prev,
        allergyHistory: {
          ...prev.allergyHistory,
          [allergyField]: value,
        },
      }));
    } else if (field.startsWith('familyHistory.')) {
      const familyField = field.split('.')[1];
      setDonorForm(prev => ({
        ...prev,
        familyHistory: {
          ...prev.familyHistory,
          [familyField]: value,
        },
      }));
    } else if (field.startsWith('substanceUse.')) {
      const substanceField = field.split('.')[1];
      setDonorForm(prev => ({
        ...prev,
        substanceUse: {
          ...prev.substanceUse,
          [substanceField]: value,
        },
      }));
    } else if (field.startsWith('socialHistory.')) {
      const socialField = field.split('.')[1];
      setDonorForm(prev => ({
        ...prev,
        socialHistory: {
          ...prev.socialHistory,
          [socialField]: value,
        },
      }));
    } else if (field.startsWith('examination.')) {
      const parts = field.split('.');
      if (parts.length === 2) {
        const examField = parts[1];
        setDonorForm(prev => ({
          ...prev,
          examination: {
            ...prev.examination,
            [examField]: value,
          },
        }));
      } else if (parts.length === 3) {
        const section = parts[1];
        const subField = parts[2];
        setDonorForm(prev => ({
          ...prev,
          examination: {
            ...prev.examination,
            [section]: {
              ...(prev.examination[section as keyof typeof prev.examination] as any),
              [subField]: value,
            },
          },
        }));
      }
    } else {
      setDonorForm(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleDonorFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Donor Assessment Form:', donorForm);
    // Here you would typically save the form data
    alert('Donor assessment form submitted successfully!');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'donor-assessment':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold">Donor Assessment</h2>
                <p className="text-muted-foreground">Comprehensive donor evaluation and screening process</p>
              </div>
            </div>

            <form onSubmit={handleDonorFormSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Basic donor information and contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={donorForm.name}
                        onChange={(e) => handleDonorFormChange('name', e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={donorForm.age}
                        onChange={(e) => handleDonorFormChange('age', e.target.value)}
                        placeholder="Enter age"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <RadioGroup
                        value={donorForm.gender}
                        onValueChange={(value) => handleDonorFormChange('gender', value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={donorForm.dateOfBirth}
                        onChange={(e) => handleDonorFormChange('dateOfBirth', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input
                      id="occupation"
                      value={donorForm.occupation}
                      onChange={(e) => handleDonorFormChange('occupation', e.target.value)}
                      placeholder="Enter occupation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={donorForm.address}
                      onChange={(e) => handleDonorFormChange('address', e.target.value)}
                      placeholder="Enter complete address"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nicNo">NIC No *</Label>
                      <Input
                        id="nicNo"
                        value={donorForm.nicNo}
                        onChange={(e) => handleDonorFormChange('nicNo', e.target.value)}
                        placeholder="Enter NIC number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactDetails">Contact Details *</Label>
                      <Input
                        id="contactDetails"
                        value={donorForm.contactDetails}
                        onChange={(e) => handleDonorFormChange('contactDetails', e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={donorForm.emailAddress}
                      onChange={(e) => handleDonorFormChange('emailAddress', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Relationship Information
                  </CardTitle>
                  <CardDescription>Donor's relationship to the recipient</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="relationToRecipient">Relation to the Recipient *</Label>
                    <Input
                      id="relationToRecipient"
                      value={donorForm.relationToRecipient}
                      onChange={(e) => handleDonorFormChange('relationToRecipient', e.target.value)}
                      placeholder="e.g., Brother, Sister, Friend, etc."
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Relation Type *</Label>
                    <RadioGroup
                      value={donorForm.relationType}
                      onValueChange={(value) => handleDonorFormChange('relationType', value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="related" id="related" />
                        <Label htmlFor="related">Related</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unrelated" id="unrelated" />
                        <Label htmlFor="unrelated">Unrelated</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="altruistic" id="altruistic" />
                        <Label htmlFor="altruistic">Altruistic</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Medical History
                  </CardTitle>
                  <CardDescription>Comorbidities and medical conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Comorbidities</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dm"
                          checked={donorForm.comorbidities.dm}
                          onCheckedChange={(checked) => handleDonorFormChange('comorbidities.dm', checked)}
                        />
                        <Label htmlFor="dm">Diabetes Mellitus (DM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="psychiatricIllness"
                          checked={donorForm.comorbidities.psychiatricIllness}
                          onCheckedChange={(checked) => handleDonorFormChange('comorbidities.psychiatricIllness', checked)}
                        />
                        <Label htmlFor="psychiatricIllness">Psychiatric Illness</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="htn"
                          checked={donorForm.comorbidities.htn}
                          onCheckedChange={(checked) => handleDonorFormChange('comorbidities.htn', checked)}
                        />
                        <Label htmlFor="htn">Hypertension (HTN)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ihd"
                          checked={donorForm.comorbidities.ihd}
                          onCheckedChange={(checked) => handleDonorFormChange('comorbidities.ihd', checked)}
                        />
                        <Label htmlFor="ihd">Ischemic Heart Disease (IHD)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complains">Complaints</Label>
                    <Textarea
                      id="complains"
                      value={donorForm.complains}
                      onChange={(e) => handleDonorFormChange('complains', e.target.value)}
                      placeholder="Describe any current complaints or symptoms..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Systemic Inquiry
                  </CardTitle>
                  <CardDescription>Comprehensive system review</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Constitutional</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="loa"
                          checked={donorForm.systemicInquiry.constitutional.loa}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.constitutional.loa', checked)}
                        />
                        <Label htmlFor="loa">Loss of Appetite (LOA)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="low"
                          checked={donorForm.systemicInquiry.constitutional.low}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.constitutional.low', checked)}
                        />
                        <Label htmlFor="low">Loss of Weight (LOW)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Cardiovascular System (CVS)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="chestPain"
                          checked={donorForm.systemicInquiry.cvs.chestPain}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.cvs.chestPain', checked)}
                        />
                        <Label htmlFor="chestPain">Chest Pain</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="odema"
                          checked={donorForm.systemicInquiry.cvs.odema}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.cvs.odema', checked)}
                        />
                        <Label htmlFor="odema">Oedema</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sob"
                          checked={donorForm.systemicInquiry.cvs.sob}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.cvs.sob', checked)}
                        />
                        <Label htmlFor="sob">Shortness of Breath (SOB)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Respiratory</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cough"
                          checked={donorForm.systemicInquiry.respiratory.cough}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.respiratory.cough', checked)}
                        />
                        <Label htmlFor="cough">Cough</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hemoptysis"
                          checked={donorForm.systemicInquiry.respiratory.hemoptysis}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.respiratory.hemoptysis', checked)}
                        />
                        <Label htmlFor="hemoptysis">Hemoptysis</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="wheezing"
                          checked={donorForm.systemicInquiry.respiratory.wheezing}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.respiratory.wheezing', checked)}
                        />
                        <Label htmlFor="wheezing">Wheezing</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Gastrointestinal Tract (GIT)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="constipation"
                          checked={donorForm.systemicInquiry.git.constipation}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.git.constipation', checked)}
                        />
                        <Label htmlFor="constipation">Constipation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="diarrhea"
                          checked={donorForm.systemicInquiry.git.diarrhea}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.git.diarrhea', checked)}
                        />
                        <Label htmlFor="diarrhea">Diarrhea</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="melena"
                          checked={donorForm.systemicInquiry.git.melena}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.git.melena', checked)}
                        />
                        <Label htmlFor="melena">Melena</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="prBleeding"
                          checked={donorForm.systemicInquiry.git.prBleeding}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.git.prBleeding', checked)}
                        />
                        <Label htmlFor="prBleeding">PR Bleeding</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Renal</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hematuria"
                          checked={donorForm.systemicInquiry.renal.hematuria}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.renal.hematuria', checked)}
                        />
                        <Label htmlFor="hematuria">Hematuria</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="frothyUrine"
                          checked={donorForm.systemicInquiry.renal.frothyUrine}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.renal.frothyUrine', checked)}
                        />
                        <Label htmlFor="frothyUrine">Frothy Urine</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Neurological</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="seizures"
                          checked={donorForm.systemicInquiry.neuro.seizures}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.neuro.seizures', checked)}
                        />
                        <Label htmlFor="seizures">Seizures</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="visualDisturbance"
                          checked={donorForm.systemicInquiry.neuro.visualDisturbance}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.neuro.visualDisturbance', checked)}
                        />
                        <Label htmlFor="visualDisturbance">Visual Disturbance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="headache"
                          checked={donorForm.systemicInquiry.neuro.headache}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.neuro.headache', checked)}
                        />
                        <Label htmlFor="headache">Headache</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="limbWeakness"
                          checked={donorForm.systemicInquiry.neuro.limbWeakness}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.neuro.limbWeakness', checked)}
                        />
                        <Label htmlFor="limbWeakness">Limb Weakness</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Gynecology</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="pvBleeding"
                          checked={donorForm.systemicInquiry.gynecology.pvBleeding}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.gynecology.pvBleeding', checked)}
                        />
                        <Label htmlFor="pvBleeding">PV Bleeding</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="menopause"
                          checked={donorForm.systemicInquiry.gynecology.menopause}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.gynecology.menopause', checked)}
                        />
                        <Label htmlFor="menopause">Menopause</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="menorrhagia"
                          checked={donorForm.systemicInquiry.gynecology.menorrhagia}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.gynecology.menorrhagia', checked)}
                        />
                        <Label htmlFor="menorrhagia">Menorrhagia</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lrmp"
                          checked={donorForm.systemicInquiry.gynecology.lrmp}
                          onCheckedChange={(checked) => handleDonorFormChange('systemicInquiry.gynecology.lrmp', checked)}
                        />
                        <Label htmlFor="lrmp">LRMP</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sexualHistory">Sexual History</Label>
                    <Textarea
                      id="sexualHistory"
                      value={donorForm.systemicInquiry.sexualHistory}
                      onChange={(e) => handleDonorFormChange('systemicInquiry.sexualHistory', e.target.value)}
                      placeholder="Enter sexual history details..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Drug & Allergy History
                  </CardTitle>
                  <CardDescription>Current medications and allergy information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="drugHistory">Current Medications</Label>
                    <Textarea
                      id="drugHistory"
                      value={donorForm.drugHistory}
                      onChange={(e) => handleDonorFormChange('drugHistory', e.target.value)}
                      placeholder="List current medications..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Allergy History</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="foods"
                          checked={donorForm.allergyHistory.foods}
                          onCheckedChange={(checked) => handleDonorFormChange('allergyHistory.foods', checked)}
                        />
                        <Label htmlFor="foods">Foods</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="drugs"
                          checked={donorForm.allergyHistory.drugs}
                          onCheckedChange={(checked) => handleDonorFormChange('allergyHistory.drugs', checked)}
                        />
                        <Label htmlFor="drugs">Drugs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="p"
                          checked={donorForm.allergyHistory.p}
                          onCheckedChange={(checked) => handleDonorFormChange('allergyHistory.p', checked)}
                        />
                        <Label htmlFor="p">P</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family History
                  </CardTitle>
                  <CardDescription>Family medical history details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dm">Diabetes Mellitus (DM)</Label>
                        <Input
                          id="dm"
                          value={donorForm.familyHistory.dm}
                          onChange={(e) => handleDonorFormChange('familyHistory.dm', e.target.value)}
                          placeholder="Enter details..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="htn">Hypertension (HTN)</Label>
                        <Input
                          id="htn"
                          value={donorForm.familyHistory.htn}
                          onChange={(e) => handleDonorFormChange('familyHistory.htn', e.target.value)}
                          placeholder="Enter details..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ihd">Ischemic Heart Disease (IHD)</Label>
                        <Input
                          id="ihd"
                          value={donorForm.familyHistory.ihd}
                          onChange={(e) => handleDonorFormChange('familyHistory.ihd', e.target.value)}
                          placeholder="Enter details..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stroke">Stroke</Label>
                        <Input
                          id="stroke"
                          value={donorForm.familyHistory.stroke}
                          onChange={(e) => handleDonorFormChange('familyHistory.stroke', e.target.value)}
                          placeholder="Enter details..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="renal">Renal</Label>
                        <Input
                          id="renal"
                          value={donorForm.familyHistory.renal}
                          onChange={(e) => handleDonorFormChange('familyHistory.renal', e.target.value)}
                          placeholder="Enter details..."
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Substance Use
                  </CardTitle>
                  <CardDescription>Substance use history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smoking"
                        checked={donorForm.substanceUse.smoking}
                        onCheckedChange={(checked) => handleDonorFormChange('substanceUse.smoking', checked)}
                      />
                      <Label htmlFor="smoking">Smoking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="alcohol"
                        checked={donorForm.substanceUse.alcohol}
                        onCheckedChange={(checked) => handleDonorFormChange('substanceUse.alcohol', checked)}
                      />
                      <Label htmlFor="alcohol">Alcohol</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherSubstance">Other</Label>
                    <Input
                      id="otherSubstance"
                      value={donorForm.substanceUse.other}
                      onChange={(e) => handleDonorFormChange('substanceUse.other', e.target.value)}
                      placeholder="Enter other substances..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Social History
                  </CardTitle>
                  <CardDescription>Social and family details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="spouseDetails">Spouse Details</Label>
                      <Input
                        id="spouseDetails"
                        value={donorForm.socialHistory.spouseDetails}
                        onChange={(e) => handleDonorFormChange('socialHistory.spouseDetails', e.target.value)}
                        placeholder="Enter spouse details..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="childrenDetails">Children Details</Label>
                      <Input
                        id="childrenDetails"
                        value={donorForm.socialHistory.childrenDetails}
                        onChange={(e) => handleDonorFormChange('socialHistory.childrenDetails', e.target.value)}
                        placeholder="Enter children details..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="income">Income</Label>
                      <Input
                        id="income"
                        value={donorForm.socialHistory.income}
                        onChange={(e) => handleDonorFormChange('socialHistory.income', e.target.value)}
                        placeholder="Enter income details..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherSocial">Other</Label>
                      <Input
                        id="otherSocial"
                        value={donorForm.socialHistory.other}
                        onChange={(e) => handleDonorFormChange('socialHistory.other', e.target.value)}
                        placeholder="Enter other social details..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    On Examination (O/E)
                  </CardTitle>
                  <CardDescription>Physical examination findings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={donorForm.examination.height}
                        onChange={(e) => handleDonorFormChange('examination.height', e.target.value)}
                        placeholder="Enter height in cm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={donorForm.examination.weight}
                        onChange={(e) => handleDonorFormChange('examination.weight', e.target.value)}
                        placeholder="Enter weight in kg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bmi">BMI (kg/m²)</Label>
                      <Input
                        id="bmi"
                        type="number"
                        value={donorForm.examination.bmi}
                        onChange={(e) => handleDonorFormChange('examination.bmi', e.target.value)}
                        placeholder="Enter BMI"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pallor"
                        checked={donorForm.examination.pallor}
                        onCheckedChange={(checked) => handleDonorFormChange('examination.pallor', checked)}
                      />
                      <Label htmlFor="pallor">Pallor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="icterus"
                        checked={donorForm.examination.icterus}
                        onCheckedChange={(checked) => handleDonorFormChange('examination.icterus', checked)}
                      />
                      <Label htmlFor="icterus">Icterus</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Oral</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dentalCaries"
                          checked={donorForm.examination.oral.dentalCaries}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.oral.dentalCaries', checked)}
                        />
                        <Label htmlFor="dentalCaries">Dental Caries</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="oralHygiene"
                          checked={donorForm.examination.oral.oralHygiene}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.oral.oralHygiene', checked)}
                        />
                        <Label htmlFor="oralHygiene">Oral Hygiene</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="satisfactory"
                          checked={donorForm.examination.oral.satisfactory}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.oral.satisfactory', checked)}
                        />
                        <Label htmlFor="satisfactory">Satisfactory</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="unsatisfactory"
                          checked={donorForm.examination.oral.unsatisfactory}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.oral.unsatisfactory', checked)}
                        />
                        <Label htmlFor="unsatisfactory">Unsatisfactory</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Lymph Nodes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cervical"
                          checked={donorForm.examination.lymphNodes.cervical}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.lymphNodes.cervical', checked)}
                        />
                        <Label htmlFor="cervical">Cervical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="axillary"
                          checked={donorForm.examination.lymphNodes.axillary}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.lymphNodes.axillary', checked)}
                        />
                        <Label htmlFor="axillary">Axillary</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inguinal"
                          checked={donorForm.examination.lymphNodes.inguinal}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.lymphNodes.inguinal', checked)}
                        />
                        <Label htmlFor="inguinal">Inguinal</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="clubbing"
                        checked={donorForm.examination.clubbing}
                        onCheckedChange={(checked) => handleDonorFormChange('examination.clubbing', checked)}
                      />
                      <Label htmlFor="clubbing">Clubbing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ankleOedema"
                        checked={donorForm.examination.ankleOedema}
                        onCheckedChange={(checked) => handleDonorFormChange('examination.ankleOedema', checked)}
                      />
                      <Label htmlFor="ankleOedema">Ankle Oedema</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Cardiovascular System (CVS)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bp">BP</Label>
                        <Input
                          id="bp"
                          value={donorForm.examination.cvs.bp}
                          onChange={(e) => handleDonorFormChange('examination.cvs.bp', e.target.value)}
                          placeholder="e.g., 120/80"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pr">PR</Label>
                        <Input
                          id="pr"
                          value={donorForm.examination.cvs.pr}
                          onChange={(e) => handleDonorFormChange('examination.cvs.pr', e.target.value)}
                          placeholder="e.g., 72 bpm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="murmurs"
                          checked={donorForm.examination.cvs.murmurs}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.cvs.murmurs', checked)}
                        />
                        <Label htmlFor="murmurs">Murmurs</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Respiratory</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rr">RR</Label>
                        <Input
                          id="rr"
                          value={donorForm.examination.respiratory.rr}
                          onChange={(e) => handleDonorFormChange('examination.respiratory.rr', e.target.value)}
                          placeholder="e.g., 16/min"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spo2">SPO2</Label>
                        <Input
                          id="spo2"
                          value={donorForm.examination.respiratory.spo2}
                          onChange={(e) => handleDonorFormChange('examination.respiratory.spo2', e.target.value)}
                          placeholder="e.g., 98%"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="auscultation"
                          checked={donorForm.examination.respiratory.auscultation}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.respiratory.auscultation', checked)}
                        />
                        <Label htmlFor="auscultation">Auscultation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="crepts"
                          checked={donorForm.examination.respiratory.crepts}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.respiratory.crepts', checked)}
                        />
                        <Label htmlFor="crepts">Crepts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ranchi"
                          checked={donorForm.examination.respiratory.ranchi}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.respiratory.ranchi', checked)}
                        />
                        <Label htmlFor="ranchi">Ranchi</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="effusion"
                          checked={donorForm.examination.respiratory.effusion}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.respiratory.effusion', checked)}
                        />
                        <Label htmlFor="effusion">Effusion</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Abdomen</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hepatomegaly"
                          checked={donorForm.examination.abdomen.hepatomegaly}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.abdomen.hepatomegaly', checked)}
                        />
                        <Label htmlFor="hepatomegaly">Hepatomegaly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="splenomegaly"
                          checked={donorForm.examination.abdomen.splenomegaly}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.abdomen.splenomegaly', checked)}
                        />
                        <Label htmlFor="splenomegaly">Splenomegaly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="renalMasses"
                          checked={donorForm.examination.abdomen.renalMasses}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.abdomen.renalMasses', checked)}
                        />
                        <Label htmlFor="renalMasses">Renal Masses</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="freeFluid"
                          checked={donorForm.examination.abdomen.freeFluid}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.abdomen.freeFluid', checked)}
                        />
                        <Label htmlFor="freeFluid">Free Fluid</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Brcost Examination</h4>
                    <div className="space-y-2">
                      <Textarea
                        id="brcotExamination"
                        value={donorForm.examination.BrcostExamination}
                        onChange={(e) => handleDonorFormChange('examination.BrcostExamination', e.target.value)}
                        placeholder="Enter brcost examination findings..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Neurological Exam</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cranialNerves"
                          checked={donorForm.examination.neurologicalExam.cranialNerves}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.neurologicalExam.cranialNerves', checked)}
                        />
                        <Label htmlFor="cranialNerves">Cranial Nerves</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="upperLimb"
                          checked={donorForm.examination.neurologicalExam.upperLimb}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.neurologicalExam.upperLimb', checked)}
                        />
                        <Label htmlFor="upperLimb">Upper Limb</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowerLimb"
                          checked={donorForm.examination.neurologicalExam.lowerLimb}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.neurologicalExam.lowerLimb', checked)}
                        />
                        <Label htmlFor="lowerLimb">Lower Limb</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="coordination"
                          checked={donorForm.examination.neurologicalExam.coordination}
                          onCheckedChange={(checked) => handleDonorFormChange('examination.neurologicalExam.coordination', checked)}
                        />
                        <Label htmlFor="coordination">Coordination</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveView('dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Assessment
                </Button>
              </div>
            </form>
          </div>
        );
      case 'recipient-assessment':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Recipient Assessment</h2>
            <p className="text-muted-foreground">Patient evaluation for kidney transplant candidacy.</p>
            <Card>
              <CardHeader>
                <CardTitle>Recipient Assessment Form</CardTitle>
                <CardDescription>Complete recipient evaluation checklist</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Recipient assessment functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'kt':
        return (
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
        );
      case 'follow-up':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Follow Up</h2>
            <p className="text-muted-foreground">Post-transplant monitoring and care management.</p>
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Care</CardTitle>
                <CardDescription>Track patient progress and complications</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Follow-up care functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('donor-assessment')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Donor Assessment</CardTitle>
                  <CardDescription>
                    Comprehensive donor evaluation and screening
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('recipient-assessment')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Recipient Assessment</CardTitle>
                  <CardDescription>
                    Patient evaluation for transplant candidacy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('kt')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Kidney Transplant (KT)</CardTitle>
                  <CardDescription>
                    Transplant procedure management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Manage Procedure
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('follow-up')}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Follow Up</CardTitle>
                  <CardDescription>
                    Post-transplant monitoring and care
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Track Progress
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {activeView !== 'dashboard' && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setActiveView('dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default KidneyTransplant;
