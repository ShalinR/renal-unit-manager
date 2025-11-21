import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Calendar as CalendarIcon, TrendingUp, Eye, Trash2, RefreshCw, FileText } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { useToast } from "@/hooks/use-toast";
import { monthlyAssessmentApi } from "@/services/monthlyAssessmentApi";
import { formatDateToDDMMYYYY, isoStringToDate, toLocalISO } from "@/lib/dateUtils";

interface MonthlyAssessmentProps {
  onComplete: () => void;
}

interface AssessmentData {
  capdPrescription: string;
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
  catheterComponentsInOrder: boolean;
}

interface SavedAssessment {
  id: number;
  patientId: string;
  assessmentDate: string;
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
  capdPrescription: string;
  catheterComponentsInOrder: boolean;
}

const MonthlyAssessment = ({ onComplete }: MonthlyAssessmentProps) => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: { [field: string]: string } }>({});
  const { patient } = usePatientContext();
  const { toast } = useToast();

  // Fetch saved assessments on component mount
  const fetchAssessments = async () => {
    const phn = patient?.phn;
    if (!phn) {
      setSavedAssessments([]);
      return;
    }

    setLoading(true);
    try {
      const data = await monthlyAssessmentApi.list(phn);
      setSavedAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch monthly assessments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.phn]);

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
      catheterComponents: "",
      capdPrescription: "",
      catheterComponentsInOrder: false,
    };
    setAssessments(prev => [...prev, newAssessment]);
  };

  const updateAssessment = (id: string, field: string, value: any) => {
    setAssessments(prev =>
      prev.map(assessment =>
        assessment.id === id ? { ...assessment, [field]: value } : assessment
      )
    );
    // Clear field error when user starts typing
    if (fieldErrors[id]?.[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[id]) {
          delete newErrors[id][field];
          if (Object.keys(newErrors[id]).length === 0) {
            delete newErrors[id];
          }
        }
        return newErrors;
      });
    }
  };

  const removeAssessment = (id: string) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  const validateAssessment = (assessment: AssessmentData): { [field: string]: string } => {
    const errors: { [field: string]: string } = {};
    
    if (!assessment.date || assessment.date.trim() === "") {
      errors.date = "Assessment date is required";
    }
    
    if (!assessment.exitSite || assessment.exitSite.trim() === "") {
      errors.exitSite = "Exit site status is required";
    }
    
    if (!assessment.bodyWeight || assessment.bodyWeight.trim() === "") {
      errors.bodyWeight = "Body weight is required";
    } else {
      const weight = parseFloat(assessment.bodyWeight);
      if (isNaN(weight) || weight <= 0 || weight > 500) {
        errors.bodyWeight = "Body weight must be a valid number between 1 and 500 kg";
      }
    }
    
    if (!assessment.bloodPressure || assessment.bloodPressure.trim() === "") {
      errors.bloodPressure = "Blood pressure is required";
    }
    
    if (!assessment.numberOfExchanges || assessment.numberOfExchanges.trim() === "") {
      errors.numberOfExchanges = "Number of exchanges is required";
    } else {
      const exchanges = parseFloat(assessment.numberOfExchanges);
      if (isNaN(exchanges) || exchanges <= 0 || exchanges > 10) {
        errors.numberOfExchanges = "Number of exchanges must be between 1 and 10";
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get PHN from patient context
    const phn = patient?.phn;
    if (!phn) {
      toast({
        title: "Patient Not Selected",
        description: "Please search for a patient by PHN first before saving monthly assessments.",
        variant: "destructive",
      });
      return;
    }

    // Validate all assessments
    const validationErrors: { [key: string]: { [field: string]: string } } = {};
    let hasErrors = false;
    
    assessments.forEach((assessment) => {
      const errors = validateAssessment(assessment);
      if (Object.keys(errors).length > 0) {
        validationErrors[assessment.id] = errors;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      // Set field errors for display
      setFieldErrors(validationErrors);
      const errorMessages = Object.values(validationErrors)
        .flatMap(err => Object.values(err))
        .join(", ");
      toast({
        title: "Validation Error",
        description: `Please fix the following errors: ${errorMessages}`,
        variant: "destructive",
      });
      return;
    }
    
    // Clear errors if validation passes
    setFieldErrors({});

    setSaving(true);
    
    try {
      // Save each assessment to the backend
      const savePromises = assessments.map(async (assessment) => {
        const assessmentDto = {
          assessmentDate: assessment.date,
          exitSite: assessment.exitSite,
          residualUrineOutput: assessment.residualUrineOutput,
          pdBalance: assessment.pdBalance,
          bodyWeight: assessment.bodyWeight,
          bloodPressure: assessment.bloodPressure,
          numberOfExchanges: assessment.numberOfExchanges,
          totalBalance: assessment.totalBalance,
          shortnessOfBreath: assessment.shortnessOfBreath,
          edema: assessment.edema,
          ivIron: assessment.ivIron,
          erythropoietin: assessment.erythropoietin,
          capdPrescriptionAPDPlan: assessment.capdPrescriptionAPDPlan,
          handWashingTechnique: assessment.handWashingTechnique,
          capdPrescription: assessment.capdPrescription,
          catheterComponentsInOrder: assessment.catheterComponentsInOrder,
        };

        return monthlyAssessmentApi.create(phn, assessmentDto);
      });

      await Promise.all(savePromises);
      
      // Clear the form and refresh the saved assessments list
      setAssessments([]);
      await fetchAssessments();
      toast({
        title: "Success",
        description: "Monthly assessments saved successfully!",
      });
    } catch (error) {
      console.error("Error saving assessments:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save assessments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssessment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    const phn = patient?.phn;
    if (!phn) {
      toast({
        title: "Patient Not Selected",
        description: "Please search for a patient by PHN first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await monthlyAssessmentApi.remove(phn, id);
      await fetchAssessments();
      toast({
        title: "Success",
        description: "Assessment deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Monthly Assessment</h1>
        <p className="text-muted-foreground">Regular monthly evaluation of patient progress and condition</p>
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/investigation/pd")}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View PD Investigation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="enter" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enter">Enter Assessment</TabsTrigger>
          <TabsTrigger value="view">View Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="enter">
          <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
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
                        <Label>Assessment Date <span className="text-red-500">*</span></Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={`w-full justify-start text-left font-normal ${fieldErrors[assessment.id]?.date ? "border-red-500" : ""}`}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {assessment.date ? formatDateToDDMMYYYY(assessment.date) : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={isoStringToDate(assessment.date)}
                              onSelect={(date) => { if (date) updateAssessment(assessment.id, 'date', toLocalISO(date)); }}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {fieldErrors[assessment.id]?.date && (
                          <p className="text-sm text-red-500">{fieldErrors[assessment.id].date}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {/* <div className="space-y-3">
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
                          </div> */}

                          <div className="space-y-2">
                            <Label>Exit Site Condition <span className="text-red-500">*</span></Label>
                            <Input
                              value={assessment.exitSite}
                              onChange={(e) => updateAssessment(assessment.id, 'exitSite', e.target.value)}
                              placeholder="Describe exit site condition"
                              className={fieldErrors[assessment.id]?.exitSite ? "border-red-500" : ""}
                            />
                            {fieldErrors[assessment.id]?.exitSite && (
                              <p className="text-sm text-red-500">{fieldErrors[assessment.id].exitSite}</p>
                            )}
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
                            <Label>Body Weight (kg) <span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={assessment.bodyWeight}
                              onChange={(e) => updateAssessment(assessment.id, 'bodyWeight', e.target.value)}
                              placeholder="Current weight"
                              className={fieldErrors[assessment.id]?.bodyWeight ? "border-red-500" : ""}
                            />
                            {fieldErrors[assessment.id]?.bodyWeight && (
                              <p className="text-sm text-red-500">{fieldErrors[assessment.id].bodyWeight}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Blood Pressure (mmHg) <span className="text-red-500">*</span></Label>
                            <Input
                              value={assessment.bloodPressure}
                              onChange={(e) => updateAssessment(assessment.id, 'bloodPressure', e.target.value)}
                              placeholder="e.g., 120/80"
                              className={fieldErrors[assessment.id]?.bloodPressure ? "border-red-500" : ""}
                            />
                            {fieldErrors[assessment.id]?.bloodPressure && (
                              <p className="text-sm text-red-500">{fieldErrors[assessment.id].bloodPressure}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Number of Exchanges <span className="text-red-500">*</span></Label>
                            <Input
                              type="number"
                              value={assessment.numberOfExchanges}
                              onChange={(e) => updateAssessment(assessment.id, 'numberOfExchanges', e.target.value)}
                              placeholder="Daily exchanges"
                              className={fieldErrors[assessment.id]?.numberOfExchanges ? "border-red-500" : ""}
                            />
                            {fieldErrors[assessment.id]?.numberOfExchanges && (
                              <p className="text-sm text-red-500">{fieldErrors[assessment.id].numberOfExchanges}</p>
                            )}
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
                          
                          {/* --- 1. Catheter Components in Order --- */}
                          <div className="space-y-3">
                            <Label>Catheter Components in Order</Label>
                            <RadioGroup
                              // This group controls 'catheterComponentsInOrder'
                              value={assessment.catheterComponentsInOrder ? "yes" : "no"}
                              onValueChange={(value) => updateAssessment(assessment.id, 'catheterComponentsInOrder', value === "yes")}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id={`components-yes-${assessment.id}`} />
                                <Label htmlFor={`components-yes-${assessment.id}`}>Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id={`components-no-${assessment.id}`} />
                                <Label htmlFor={`components-no-${assessment.id}`}>No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* --- 2. Hand Washing Technique --- */}
                          <div className="space-y-3">
                            <Label>Hand Washing Technique</Label>
                            <RadioGroup
                              // This group correctly controls 'handWashingTechnique'
                              value={assessment.handWashingTechnique ? "competent" : "not-competent"}
                              onValueChange={(value) => updateAssessment(assessment.id, 'handWashingTechnique', value === "competent")}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="competent" id={`handwash-competent-${assessment.id}`} />
                                <Label htmlFor={`handwash-competent-${assessment.id}`}>Competent</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="not-competent" id={`handwash-not-competent-${assessment.id}`} />
                                <Label htmlFor={`handwash-not-competent-${assessment.id}`}>Not Competent</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* --- 3. CAPD Prescription --- */}
                          <div className="space-y-3">
                            <Label>CAPD Prescription</Label>
                            <RadioGroup
                              // This group correctly controls 'capdPrescription'
                              value={assessment.capdPrescription}
                              onValueChange={(value) => updateAssessment(assessment.id, 'capdPrescription', value)}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1.5x" id={`capd-1.5x-${assessment.id}`} />
                                <Label htmlFor={`capd-1.5x-${assessment.id}`}>1.5x</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2.5x" id={`capd-2.5x-${assessment.id}`} />
                                <Label htmlFor={`capd-2.5x-${assessment.id}`}>2.5x</Label>
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
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Monthly Assessments"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Saved Monthly Assessments
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={fetchAssessments}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50 animate-spin" />
                  <p>Loading assessments...</p>
                </div>
              ) : savedAssessments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No monthly assessments found.</p>
                  <p className="text-sm">Enter assessments in the "Enter Assessment" tab to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Body Weight (kg)</TableHead>
                          <TableHead>Blood Pressure</TableHead>
                          <TableHead>Exit Site</TableHead>
                          <TableHead>PD Balance</TableHead>
                          <TableHead>Exchanges</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedAssessments.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">
                              {assessment.assessmentDate || "N/A"}
                            </TableCell>
                            <TableCell>{assessment.bodyWeight || "N/A"}</TableCell>
                            <TableCell>{assessment.bloodPressure || "N/A"}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {assessment.exitSite || "N/A"}
                            </TableCell>
                            <TableCell>{assessment.pdBalance || "N/A"}</TableCell>
                            <TableCell>{assessment.numberOfExchanges || "N/A"}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAssessment(assessment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Detailed view cards */}
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">Detailed Assessment Records</h3>
                    {savedAssessments.map((assessment) => (
                      <Card key={assessment.id} className="border-primary/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Badge>Assessment Date: {assessment.assessmentDate || "N/A"}</Badge>
                            </CardTitle>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAssessment(assessment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">Exit Site Condition</Label>
                              <p className="text-sm text-muted-foreground">{assessment.exitSite || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">Residual Urine Output (mL)</Label>
                              <p className="text-sm text-muted-foreground">{assessment.residualUrineOutput || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">PD Balance</Label>
                              <p className="text-sm text-muted-foreground">{assessment.pdBalance || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">Body Weight (kg)</Label>
                              <p className="text-sm text-muted-foreground">{assessment.bodyWeight || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">Blood Pressure (mmHg)</Label>
                              <p className="text-sm text-muted-foreground">{assessment.bloodPressure || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">Number of Exchanges</Label>
                              <p className="text-sm text-muted-foreground">{assessment.numberOfExchanges || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">Total Balance (mL)</Label>
                              <p className="text-sm text-muted-foreground">{assessment.totalBalance || "N/A"}</p>
                            </div>
                          </div>

                          <Card className="bg-muted/20">
                            <CardHeader>
                              <CardTitle className="text-base">Volume Status & Symptoms</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox checked={assessment.shortnessOfBreath || false} disabled />
                                <Label>Shortness of breath (SOB)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox checked={assessment.edema || false} disabled />
                                <Label>Edema</Label>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-muted/20">
                            <CardHeader>
                              <CardTitle className="text-base">Medications & Treatment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div>
                                <Label className="text-sm font-semibold">IV Iron</Label>
                                <p className="text-sm text-muted-foreground">{assessment.ivIron || "N/A"}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-semibold">Erythropoietin</Label>
                                <p className="text-sm text-muted-foreground">{assessment.erythropoietin || "N/A"}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox checked={assessment.capdPrescriptionAPDPlan || false} disabled />
                                <Label>CAPD Prescription / APD Plan</Label>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-muted/20">
                            <CardHeader>
                              <CardTitle className="text-base">Technical Assessment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div>
                                <Label className="text-sm font-semibold">Catheter Components in Order</Label>
                                <p className="text-sm text-muted-foreground">
                                  {assessment.catheterComponentsInOrder ? "Yes" : "No"}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-semibold">Hand Washing Technique</Label>
                                <p className="text-sm text-muted-foreground">
                                  {assessment.handWashingTechnique ? "Competent" : "Not Competent"}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-semibold">CAPD Prescription</Label>
                                <p className="text-sm text-muted-foreground">{assessment.capdPrescription || "N/A"}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonthlyAssessment;

