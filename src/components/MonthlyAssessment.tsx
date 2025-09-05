import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Calendar, TrendingUp } from "lucide-react";

interface MonthlyAssessmentProps {
  onComplete: () => void;
}

interface AssessmentData {
  id: string;
  date: string;
  levelOfDependency: string;
  exitSite: string;
  residualUrineOutput: string;
  pdBalance: string;
  bodyWeight: string;
  bloodPressure: string;
  numberOfExchanges: string;
  totalBalance: string;
  shortnessOfBreath: boolean;
  edema: boolean;
  ivIron: string;
  erythropoietin: string;
  capdPrescriptionAPDPlan: boolean;
  handWashingTechnique: boolean;
  catheterComponents: string;
}

const MonthlyAssessment = ({ onComplete }: MonthlyAssessmentProps) => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);

  const addAssessment = () => {
    const newAssessment: AssessmentData = {
      id: Date.now().toString(),
      date: "",
      levelOfDependency: "",
      exitSite: "",
      residualUrineOutput: "",
      pdBalance: "",
      bodyWeight: "",
      bloodPressure: "",
      numberOfExchanges: "",
      totalBalance: "",
      shortnessOfBreath: false,
      edema: false,
      ivIron: "",
      erythropoietin: "",
      capdPrescriptionAPDPlan: false,
      handWashingTechnique: false,
      catheterComponents: ""
    };
    setAssessments(prev => [...prev, newAssessment]);
  };

  const updateAssessment = (id: string, field: string, value: any) => {
    setAssessments(prev =>
      prev.map(assessment =>
        assessment.id === id ? { ...assessment, [field]: value } : assessment
      )
    );
  };

  const removeAssessment = (id: string) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Monthly Assessments:", assessments);
    onComplete();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Monthly Assessment</h1>
        <p className="text-muted-foreground">Regular monthly evaluation of patient progress and condition</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Monthly Assessment Records
              </CardTitle>
              <Button type="button" onClick={addAssessment}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Assessment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No monthly assessments recorded yet.</p>
                <p className="text-sm">Click "Add New Assessment" to start tracking monthly progress.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {assessments.map((assessment, index) => (
                  <Card key={assessment.id} className="border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge>Assessment {index + 1}</Badge>
                        </CardTitle>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAssessment(assessment.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Assessment Date</Label>
                        <Input
                          type="date"
                          value={assessment.date}
                          onChange={(e) => updateAssessment(assessment.id, 'date', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <Label>Level of Dependency</Label>
                            <RadioGroup
                              value={assessment.levelOfDependency}
                              onValueChange={(value) => updateAssessment(assessment.id, 'levelOfDependency', value)}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="independent-occupation" id={`independent-occupation-${assessment.id}`} />
                                <Label htmlFor={`independent-occupation-${assessment.id}`}>Independent & occupation</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="physically-independent" id={`physically-independent-${assessment.id}`} />
                                <Label htmlFor={`physically-independent-${assessment.id}`}>Physically independent</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="totally-dependent" id={`totally-dependent-${assessment.id}`} />
                                <Label htmlFor={`totally-dependent-${assessment.id}`}>Totally dependent</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label>Exit Site Condition</Label>
                            <Input
                              value={assessment.exitSite}
                              onChange={(e) => updateAssessment(assessment.id, 'exitSite', e.target.value)}
                              placeholder="Describe exit site condition"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Residual Urine Output (mL)</Label>
                            <Input
                              type="number"
                              value={assessment.residualUrineOutput}
                              onChange={(e) => updateAssessment(assessment.id, 'residualUrineOutput', e.target.value)}
                              placeholder="Daily urine output"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>PD Balance (+/-)</Label>
                            <Input
                              value={assessment.pdBalance}
                              onChange={(e) => updateAssessment(assessment.id, 'pdBalance', e.target.value)}
                              placeholder="e.g., +500 mL or -200 mL"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Body Weight (kg)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={assessment.bodyWeight}
                              onChange={(e) => updateAssessment(assessment.id, 'bodyWeight', e.target.value)}
                              placeholder="Current weight"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Blood Pressure (mmHg)</Label>
                            <Input
                              value={assessment.bloodPressure}
                              onChange={(e) => updateAssessment(assessment.id, 'bloodPressure', e.target.value)}
                              placeholder="e.g., 120/80"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Number of Exchanges</Label>
                            <Input
                              type="number"
                              value={assessment.numberOfExchanges}
                              onChange={(e) => updateAssessment(assessment.id, 'numberOfExchanges', e.target.value)}
                              placeholder="Daily exchanges"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Total Balance (mL)</Label>
                            <Input
                              value={assessment.totalBalance}
                              onChange={(e) => updateAssessment(assessment.id, 'totalBalance', e.target.value)}
                              placeholder="Net fluid balance"
                            />
                          </div>
                        </div>
                      </div>

                      <Card className="bg-muted/20">
                        <CardHeader>
                          <CardTitle className="text-lg">Volume Status & Symptoms</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`sob-${assessment.id}`}
                              checked={assessment.shortnessOfBreath}
                              onCheckedChange={(checked) => updateAssessment(assessment.id, 'shortnessOfBreath', checked)}
                            />
                            <Label htmlFor={`sob-${assessment.id}`}>Shortness of breath (SOB)</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`edema-${assessment.id}`}
                              checked={assessment.edema}
                              onCheckedChange={(checked) => updateAssessment(assessment.id, 'edema', checked)}
                            />
                            <Label htmlFor={`edema-${assessment.id}`}>Edema</Label>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/20">
                        <CardHeader>
                          <CardTitle className="text-lg">Medications & Treatment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>IV Iron</Label>
                              <Input
                                value={assessment.ivIron}
                                onChange={(e) => updateAssessment(assessment.id, 'ivIron', e.target.value)}
                                placeholder="Iron supplementation details"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Erythropoietin</Label>
                              <Input
                                value={assessment.erythropoietin}
                                onChange={(e) => updateAssessment(assessment.id, 'erythropoietin', e.target.value)}
                                placeholder="EPO treatment details"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`capd-plan-${assessment.id}`}
                              checked={assessment.capdPrescriptionAPDPlan}
                              onCheckedChange={(checked) => updateAssessment(assessment.id, 'capdPrescriptionAPDPlan', checked)}
                            />
                            <Label htmlFor={`capd-plan-${assessment.id}`}>CAPD Prescription / APD Plan</Label>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/20">
                        <CardHeader>
                          <CardTitle className="text-lg">Technical Assessment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <Label>Hand Washing Technique</Label>
                            <RadioGroup
                              value={assessment.handWashingTechnique ? "yes" : "no"}
                              onValueChange={(value) => updateAssessment(assessment.id, 'handWashingTechnique', value === "yes")}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id={`handwash-yes-${assessment.id}`} />
                                <Label htmlFor={`handwash-yes-${assessment.id}`}>Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id={`handwash-no-${assessment.id}`} />
                                <Label htmlFor={`handwash-no-${assessment.id}`}>No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-3">
                            <Label>Catheter Components in Order</Label>
                            <RadioGroup
                              value={assessment.catheterComponents}
                              onValueChange={(value) => updateAssessment(assessment.id, 'catheterComponents', value)}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="competent" id={`catheter-competent-${assessment.id}`} />
                                <Label htmlFor={`catheter-competent-${assessment.id}`}>Competent</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="not-competent" id={`catheter-not-competent-${assessment.id}`} />
                                <Label htmlFor={`catheter-not-competent-${assessment.id}`}>Not Competent</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">
            Save Monthly Assessments
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyAssessment;