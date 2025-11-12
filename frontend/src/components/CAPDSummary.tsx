import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePatientContext } from "@/context/PatientContext";
import PETTest from "./PETTest";
import AdequacyTest from "./AdequacyTest";
// Remove the InfectionTracking import if it's not used here, or keep if needed
// import InfectionTracking, { TunnelEpisode } from "./InfectionTracking";

// --- TypeScript Interfaces ---
// (These should match your Spring Boot DTOs)

interface PetTestEntry {
  date: string;
  data: any | null; // You should replace 'any' with your specific PETData interface
}

interface PetResults {
  first: PetTestEntry;
  second: PetTestEntry;
  third: PetTestEntry;
}

interface AdequacyResults {
  first: PetTestEntry;
  second: PetTestEntry;
  third: PetTestEntry;
}

interface CAPDData {
  counsellingDate: string;
  catheterInsertionDate: string;
  insertionDoneBy: string;
  insertionPlace: string;
  technique: string;
  designation: string;
  firstFlushing: string;
  secondFlushing: string;
  thirdFlushing: string;
  initiationDate: string;
  petResults: PetResults;
  adequacyResults: AdequacyResults;
}

interface CAPDSummaryProps {
  onSubmit: (data: CAPDData) => void;
}

// Define a base state for a new summary
const emptyCAPDData: CAPDData = {
  counsellingDate: "",
  catheterInsertionDate: "",
  insertionDoneBy: "",
  insertionPlace: "",
  technique: "",
  designation: "",
  firstFlushing: "",
  secondFlushing: "",
  thirdFlushing: "",
  initiationDate: "",
  petResults: {
    first: { date: "", data: null },
    second: { date: "", data: null },
    third: { date: "", data: null },
  },
  adequacyResults: {
    first: { date: "", data: null },
    second: { date: "", data: null },
    third: { date: "", data: null },
  },
};

const CAPDSummary = ({ onSubmit }: CAPDSummaryProps) => {
  // Initialize state with the empty object - always start with empty form
  const [formData, setFormData] = useState<CAPDData>(emptyCAPDData);
  const { patient } = usePatientContext();
  const { toast } = useToast();

  // Load existing CAPD summary data when patient is selected
  useEffect(() => {
    const loadPatientData = async () => {
      const phn = patient?.phn;
      if (!phn) {
        // Reset form if no patient selected
        setFormData(emptyCAPDData);
        return;
      }

      try {
        const API_URL = `http://localhost:8081/api/capd-summary/${phn}`;
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData({
              counsellingDate: data.counsellingDate || "",
              catheterInsertionDate: data.catheterInsertionDate || "",
              insertionDoneBy: data.insertionDoneBy || "",
              insertionPlace: data.insertionPlace || "",
              technique: data.technique || "",
              designation: data.designation || "",
              firstFlushing: data.firstFlushing || "",
              secondFlushing: data.secondFlushing || "",
              thirdFlushing: data.thirdFlushing || "",
              initiationDate: data.initiationDate || "",
              petResults: data.petResults || emptyCAPDData.petResults,
              adequacyResults: data.adequacyResults || emptyCAPDData.adequacyResults,
            });
          }
        }
      } catch (error) {
        console.error("Error loading CAPD summary data:", error);
      }
    };

    loadPatientData();
  }, [patient?.phn]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //
  // === NEW PART 2: Save data to backend on submit ===
  // (This part remains unchanged. It will correctly save the *new* PET data
  // that the user enters into the now-empty form.)
  //
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get PHN from patient context
    const phn = patient?.phn;
    if (!phn) {
      toast({
        title: "Patient Not Selected",
        description: "Please search for a patient by PHN first before saving CAPD summary.",
        variant: "destructive",
      });
      return;
    }

    setSaveStatus("saving");

    const API_URL = `http://localhost:8081/api/capd-summary/${phn}`;

    try {
      // Save all form data including basic information, PET results, and adequacy results
      const dataToSave = {
        counsellingDate: formData.counsellingDate,
        catheterInsertionDate: formData.catheterInsertionDate,
        insertionDoneBy: formData.insertionDoneBy,
        insertionPlace: formData.insertionPlace,
        technique: formData.technique,
        designation: formData.designation,
        firstFlushing: formData.firstFlushing,
        secondFlushing: formData.secondFlushing,
        thirdFlushing: formData.thirdFlushing,
        initiationDate: formData.initiationDate,
        petResults: formData.petResults,
        adequacyResults: formData.adequacyResults,
      };

      const response = await fetch(API_URL, {
        // POST request
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave), // Send all form data
      });

      if (response.ok) {
        const savedData = await response.json();
        console.log("CAPD Summary Data Saved:", savedData);
        setSaveStatus("saved");
        // Reset form to empty after saving
        setFormData(emptyCAPDData);
        // Don't call onSubmit() - keep the form open so user can access both tabs
      } else {
        const errorText = await response.text();
        console.error("Failed to save summary data:", errorText);
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveStatus("error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">CAPD Summary</h1>
        <p className="text-muted-foreground">
          Comprehensive patient dialysis summary and tracking
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="pet" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pet">PET Tests</TabsTrigger>
            <TabsTrigger value="adequacy">Adequacy Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="pet">
            <PETTest
              petResults={formData.petResults} // This now passes the empty data
              onUpdate={(results) => updateFormData("petResults", results)}
            />
          </TabsContent>

          <TabsContent value="adequacy">
            <AdequacyTest
              adequacyResults={formData.adequacyResults}
              onUpdate={(results) => updateFormData("adequacyResults", results)}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center">
          <div>
            {saveStatus === "saving" && (
              <p className="text-sm text-muted-foreground">Saving...</p>
            )}
            {saveStatus === "saved" && (
              <p className="text-sm text-green-600">
                ✓ Data saved successfully!
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-sm text-red-600">
                ✗ Failed to save data. Please try again.
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                onSubmit(formData); // Close and navigate to preview
              }}
            >
              Done
            </Button>
            <Button type="submit" disabled={saveStatus === "saving"}>
              {saveStatus === "saving" ? "Saving..." : "Save CAPD Summary"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CAPDSummary;