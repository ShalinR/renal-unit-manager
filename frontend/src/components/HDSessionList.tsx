import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, Trash2, Plus } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import {
  getHemodialysisRecordsByPatientId,
  deleteHemodialysisRecord,
} from "@/services/hemodialysisApi";
import { useToast } from "@/hooks/use-toast";
import { HemodialysisForm } from "./HDSessionForm";

interface HDSessionListProps {
  onSelectSession: (form: HemodialysisForm) => void;
  onCreateNew: () => void;
}

interface SavedSession {
  id: number;
  patientId: string;
  hemoDialysisSessionDate: string;
  filledBy?: string;
}

const HDSessionList: React.FC<HDSessionListProps> = ({
  onSelectSession,
  onCreateNew,
}) => {
  const { patient, globalPatient } = usePatientContext();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const currentPatient = patient || globalPatient;

  useEffect(() => {
    if (!currentPatient?.phn) return;

    const loadSessions = async () => {
      setLoading(true);
      try {
        const records = await getHemodialysisRecordsByPatientId(
          currentPatient.phn
        );
        setSessions(records as SavedSession[]);
      } catch (error) {
        console.error("Failed to load sessions:", error);
        toast({
          title: "Error",
          description: "Failed to load saved sessions.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [currentPatient?.phn, toast]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      await deleteHemodialysisRecord(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Deleted",
        description: "Session deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast({
        title: "Error",
        description: "Failed to delete session.",
        variant: "destructive",
      });
    }
  };

  const handleViewSession = (session: SavedSession) => {
    // Parse the saved data back into form shape
    // For now, show a placeholder — data is in session_json as a Map
    toast({
      title: "Session Data",
      description: `Loaded session from ${session.hemoDialysisSessionDate}. Full data is in database.`,
      variant: "default",
    });
    // TODO: Fetch full record details and convert to form shape
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.hemoDialysisSessionDate?.toLowerCase().includes(filter.toLowerCase()) ||
      s.filledBy?.toLowerCase().includes(filter.toLowerCase())
  );

  if (!currentPatient?.phn) {
    return (
      <div className="flex items-center gap-2 text-amber-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Please select a patient first.</span>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border border-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg">Saved HD Sessions</CardTitle>
          <Button
            size="sm"
            onClick={onCreateNew}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Session
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Filter by date or staff name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm"
        />

        {loading ? (
          <p className="text-center text-sm text-gray-500 py-8">
            Loading sessions...
          </p>
        ) : filteredSessions.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            {sessions.length === 0
              ? "No sessions saved yet."
              : "No sessions match the filter."}
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {session.hemoDialysisSessionDate || "No date"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {session.filledBy
                      ? `Filled by: ${session.filledBy}`
                      : "No staff info"}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewSession(session)}
                    className="flex items-center gap-1"
                    title="View and edit this session"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(session.id)}
                    title="Delete this session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HDSessionList;
