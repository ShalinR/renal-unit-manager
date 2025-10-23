import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface CAPDData {
  counsellingDate: string;
  catheterInsertionDate: string;
  insertionDoneBy: string;
  insertionPlace: string;
  firstFlushing: string;
  secondFlushing: string;
  thirdFlushing: string;
  initiationDate: string;
  petResults: {
    first: { date: string; data: any };
    second: { date: string; data: any };
    third: { date: string; data: any };
  };
  adequacyResults: {
    first: { date: string; data: any };
    second: { date: string; data: any };
    third: { date: string; data: any };
  };
  peritonitisHistory: any[];
  exitSiteInfections: any[];
  tunnelInfections: any[];
}

interface DataPreviewProps {
  capdData: CAPDData | null;
  onBack: () => void;
}
//const [capdSummary, setCapdSummary] = useState<CAPDData | null>(null);

const DataPreview = ({ capdData, onBack }: DataPreviewProps) => {
  if (!capdData) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold">No CAPD Data Available</h2>
        <p className="text-muted-foreground">
          Please fill in CAPD Summary to view the preview.
        </p>
        <Button onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  // Safe access helpers for optional nested metrics
  const get = (obj: any, path: string, fallback: any = "â€”") => {
    try {
      return path.split(".").reduce((o, k) => (o?.[k]), obj) ?? fallback;
    } catch {
      return fallback;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">CAPD Summary Preview</h2>
        <p className="text-muted-foreground">Comprehensive patient dialysis summary</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="default" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to CAPD Summary
        </Button>
        {/* <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button> */}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Key milestones & catheter information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Counselling Date</p>
            <p className="font-semibold">{capdData.counsellingDate || "â€”"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Initiation Date</p>
            <p className="font-semibold">{capdData.initiationDate || "â€”"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Catheter Insertion Date</p>
            <p className="font-semibold">{capdData.catheterInsertionDate || "â€”"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Insertion By</p>
            <p className="font-semibold">{capdData.insertionDoneBy || "â€”"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Insertion Place</p>
            <p className="font-semibold">{capdData.insertionPlace || "â€”"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Flushing (1st / 2nd / 3rd)</p>
            <p className="font-semibold">
              {(capdData.firstFlushing || "â€”")} / {(capdData.secondFlushing || "â€”")} / {(capdData.thirdFlushing || "â€”")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* PET Tests */}
      <Card>
        <CardHeader>
          <CardTitle>PET Tests</CardTitle>
          <CardDescription>Dates and selected ratios (if recorded)</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["first", "second", "third"] as const).map((key) => (
            <div key={key} className="space-y-2 border rounded-lg p-3">
              <p className="text-sm text-muted-foreground capitalize">{key} PET</p>
              <p className="font-semibold">{get(capdData.petResults, `${key}.date`)}</p>
              {/* If you stored calculated fields in .data, surface them */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">D/P Cr:</span>
                <Badge variant="secondary">{get(capdData.petResults, `${key}.data.dpCreatinine`)}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">D/D0 Glu:</span>
                <Badge variant="secondary">{get(capdData.petResults, `${key}.data.dd0Glucose`)}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Adequacy Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Adequacy (Kt/V)</CardTitle>
          <CardDescription>Dates and totals (if recorded)</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["first", "second", "third"] as const).map((key) => (
            <div key={key} className="space-y-2 border rounded-lg p-3">
              <p className="text-sm text-muted-foreground capitalize">{key} Adequacy</p>
              <p className="font-semibold">{get(capdData.adequacyResults, `${key}.date`)}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Total Kt/V:</span>
                <Badge variant="secondary">{get(capdData.adequacyResults, `${key}.data.totalKtV`)}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Adequate:</span>
                <Badge variant={get(capdData.adequacyResults, `${key}.data.isAdequate`) === true ? "default" : "outline"}>
                  {get(capdData.adequacyResults, `${key}.data.isAdequate`) === true ? "Yes" :
                   get(capdData.adequacyResults, `${key}.data.isAdequate`) === false ? "No" : "â€”"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Infection Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Infection Tracking</CardTitle>
          <CardDescription>Counts of recorded episodes</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{capdData.peritonitisHistory?.length ?? 0}</p>
            <p className="text-sm text-muted-foreground">Peritonitis Episodes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{capdData.exitSiteInfections?.length ?? 0}</p>
            <p className="text-sm text-muted-foreground">Exit Site Infections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{capdData.tunnelInfections?.length ?? 0}</p>
            <p className="text-sm text-muted-foreground">Tunnel Infections</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer actions */}
      <div className="flex justify-center gap-4 pt-6">
        <Button variant="default" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit CAPD Summary
        </Button>
        <Button>
          Save Record
        </Button>
      </div>
    </div>
  );
};

export default DataPreview;

