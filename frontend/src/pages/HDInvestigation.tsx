import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Activity, ArrowLeft, Download, CheckCircle, Loader } from "lucide-react";
import { exportInvestigationData, flattenHDInvestigationData } from '@/lib/exportUtils';
import { useToast } from "@/hooks/use-toast";
import * as hdMonthlyReviewInvestigationApi from "@/services/hdMonthlyReviewInvestigationApi";
import { usePatientContext } from "@/context/PatientContext";

interface InvestigationData {
  patientId: string;
  date: string;
  creatinine: string;
  eGFR: string;
  seNa: string;
  seK: string;
  sCa: string;
  sPO4: string;
  seHb: string;
  sAlbumin: string;
  ktV: string;
  notes: string;
}

const HDInvestigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { monthlyReviewId } = useParams<{ monthlyReviewId: string }>();
  const location = useLocation();
  const { patient } = usePatientContext();
  const phn = patient?.phn;

  const [formData, setFormData] = useState<InvestigationData>({
    patientId: "",
    date: "",
    creatinine: "",
    eGFR: "",
    seNa: "",
    seK: "",
    sCa: "",
    sPO4: "",
    seHb: "",
    sAlbumin: "",
    ktV: "",
    notes: "",
  });

  const [isMonthlyReviewMode, setIsMonthlyReviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordedInvestigations, setRecordedInvestigations] = useState<any[]>([]);

  // Load recorded investigations if in monthly review mode
  useEffect(() => {
    if (monthlyReviewId && phn) {
      setIsMonthlyReviewMode(true);
      loadInvestigations();
    }
  }, [monthlyReviewId, phn]);

  const loadInvestigations = async () => {
    if (!monthlyReviewId) return;
    setIsLoading(true);
    try {
      const investigations = await hdMonthlyReviewInvestigationApi.getInvestigationsByMonthlyReview(
        parseInt(monthlyReviewId)
      );
      setRecordedInvestigations(investigations || []);
      console.log("Loaded investigations:", investigations);
    } catch (error) {
      console.error("Error loading investigations:", error);
      toast({
        title: "Error",
        description: "Failed to load investigations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const patientParam = params.get('patient');
    if (patientParam) {
      setFormData((prev) => ({ ...prev, patientId: patientParam }));
    } else if (phn && !isMonthlyReviewMode) {
      setFormData((prev) => ({ ...prev, patientId: phn }));
    }
  }, [location.search, phn, isMonthlyReviewMode]);

  const loadInvestigationData = (investigation: any) => {
    setFormData({
      patientId: investigation.patientId || phn || "",
      date: investigation.investigationDate ? investigation.investigationDate.split('T')[0] : "",
      creatinine: investigation.creatinine?.toString() || "",
      eGFR: investigation.eGFR?.toString() || "",
      seNa: investigation.sodium?.toString() || "",
      seK: investigation.potassium?.toString() || "",
      sCa: investigation.calcium?.toString() || "",
      sPO4: investigation.phosphate?.toString() || "",
      seHb: investigation.hemoglobin?.toString() || "",
      sAlbumin: investigation.albumin?.toString() || "",
      ktV: investigation.ktV?.toString() || "",
      notes: investigation.clinicalNotes || "",
    });
  };

  const handleChange = (field: keyof InvestigationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map frontend field names to backend DTO field names
    const dto = {
      patientId: formData.patientId,
      investigationDate: formData.date,
      monthlyReviewId: monthlyReviewId ? parseInt(monthlyReviewId) : null,
      creatinine: formData.creatinine ? parseFloat(formData.creatinine) : null,
      sodium: formData.seNa ? parseFloat(formData.seNa) : null,
      potassium: formData.seK ? parseFloat(formData.seK) : null,
      calcium: formData.sCa ? parseFloat(formData.sCa) : null,
      phosphate: formData.sPO4 ? parseFloat(formData.sPO4) : null,
      hemoglobin: formData.seHb ? parseFloat(formData.seHb) : null,
      albumin: formData.sAlbumin ? parseFloat(formData.sAlbumin) : null,
      ktV: formData.ktV ? parseFloat(formData.ktV) : null,
      clinicalNotes: formData.notes,
    };

    console.log("Submitting investigation data:", dto);
    
    // Submit based on mode
    if (isMonthlyReviewMode && monthlyReviewId) {
      hdMonthlyReviewInvestigationApi.createInvestigationForMonthlyReview(parseInt(monthlyReviewId), dto)
        .then(() => {
          toast({
            title: "Success!",
            description: `HD investigation for patient ${formData.patientId} submitted successfully.`,
            className: "bg-green-50 border-green-200",
          });
          setTimeout(() => {
            loadInvestigations(); // Reload to show the new investigation
          }, 1500);
        })
        .catch((error) => {
          console.error("Error submitting investigation:", error);
          toast({
            title: "Error",
            description: "Failed to submit investigation. Please try again.",
            variant: "destructive",
          });
        });
    } else {
      hdMonthlyReviewInvestigationApi.createInvestigationForMonthlyReview(parseInt(monthlyReviewId || "0"), dto)
        .then(() => {
          toast({
            title: "Success!",
            description: `HD investigation for patient ${formData.patientId} submitted successfully.`,
            className: "bg-green-50 border-green-200",
          });
          setTimeout(() => {
            navigate("/investigation");
          }, 1500);
        })
        .catch((error) => {
          console.error("Error submitting investigation:", error);
          toast({
            title: "Error",
            description: "Failed to submit investigation. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/investigation")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Hemodialysis Investigation</h1>
        </div>
      </div>

      {isMonthlyReviewMode && recordedInvestigations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recorded Investigations</CardTitle>
            <CardDescription>
              Click on an investigation to view or edit its details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Loading investigations...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {recordedInvestigations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => loadInvestigationData(inv)}
                  >
                    <div>
                      <p className="font-medium">
                        {inv.investigationDate ? new Date(inv.investigationDate).toLocaleDateString() : "No date"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created: {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        loadInvestigationData(inv);
                      }}
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Enter Investigation Results</CardTitle>
          <CardDescription>
            Fill in the investigation results for Hemodialysis patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient ID</Label>
              <Input
                id="patient"
                value={formData.patientId}
                onChange={(e) => handleChange("patientId", e.target.value)}
                placeholder="Enter patient ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                <Input
                  id="creatinine"
                  value={formData.creatinine}
                  onChange={(e) => handleChange("creatinine", e.target.value)}
                  placeholder="mg/dL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="egfr">eGFR (mL/min/1.73m²)</Label>
                <Input
                  id="egfr"
                  value={formData.eGFR}
                  onChange={(e) => handleChange("eGFR", e.target.value)}
                  placeholder="mL/min/1.73m²"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="na">Serum Na (mEq/L)</Label>
                <Input
                  id="na"
                  value={formData.seNa}
                  onChange={(e) => handleChange("seNa", e.target.value)}
                  placeholder="mEq/L"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="k">Serum K (mEq/L)</Label>
                <Input
                  id="k"
                  value={formData.seK}
                  onChange={(e) => handleChange("seK", e.target.value)}
                  placeholder="mEq/L"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ca">Serum Ca (mg/dL)</Label>
                <Input
                  id="ca"
                  value={formData.sCa}
                  onChange={(e) => handleChange("sCa", e.target.value)}
                  placeholder="mg/dL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="po4">Serum PO4 (mg/dL)</Label>
                <Input
                  id="po4"
                  value={formData.sPO4}
                  onChange={(e) => handleChange("sPO4", e.target.value)}
                  placeholder="mg/dL"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hb">Hemoglobin (g/dL)</Label>
                <Input
                  id="hb"
                  value={formData.seHb}
                  onChange={(e) => handleChange("seHb", e.target.value)}
                  placeholder="g/dL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ktv">Kt/V</Label>
                <Input
                  id="ktv"
                  value={formData.ktV}
                  onChange={(e) => handleChange("ktV", e.target.value)}
                  placeholder="Kt/V ratio"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="albumin">Albumin (g/dL)</Label>
              <Input
                id="albumin"
                value={formData.sAlbumin}
                onChange={(e) => handleChange("sAlbumin", e.target.value)}
                placeholder="g/dL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/investigation")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const flatData = flattenHDInvestigationData(formData);
                  const filename = `HD_Investigation_${formData.patientId || 'unknown'}_${formData.date || new Date().toISOString().split('T')[0]}`;
                  exportInvestigationData(flatData, filename, 'excel');
                }}
                disabled={!formData.patientId || !formData.date}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const flatData = flattenHDInvestigationData(formData);
                  const filename = `HD_Investigation_${formData.patientId || 'unknown'}_${formData.date || new Date().toISOString().split('T')[0]}`;
                  exportInvestigationData(flatData, filename, 'csv');
                }}
                disabled={!formData.patientId || !formData.date}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button type="submit" className="flex-1">
                Submit Investigation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HDInvestigation;

