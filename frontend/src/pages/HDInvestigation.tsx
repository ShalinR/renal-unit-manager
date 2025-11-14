import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Activity, ArrowLeft } from "lucide-react";

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

  const handleChange = (field: keyof InvestigationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("HD Investigation:", formData);
    // TODO: Implement API call
    navigate("/investigation");
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

