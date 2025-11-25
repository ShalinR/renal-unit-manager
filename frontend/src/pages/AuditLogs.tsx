import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Search, RefreshCw, Loader2, User, Calendar, Activity } from "lucide-react";
import { formatDateTimeDisplay } from "@/lib/dateUtils";
import { hipaaAuditApi, PatientAuditLog, AuditStats } from "@/services/hipaaAuditApi";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AuditLogs = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<PatientAuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<PatientAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<AuditStats | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      toast({
        title: "Access Denied",
        description: "Only administrators can view audit logs",
        variant: "destructive",
      });
      navigate("/ward-management");
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    loadLogs();
    loadStats();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, logs]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await hipaaAuditApi.getAll();
      setLogs(data);
      setFilteredLogs(data);
    } catch (error: any) {
      console.error("Error loading audit logs:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to load audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await hipaaAuditApi.getStats();
      setStats(data);
    } catch (error: any) {
      console.error("Error loading stats:", error);
    }
  };

  const filterLogs = () => {
    if (!searchTerm.trim()) {
      setFilteredLogs(logs);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = logs.filter(
      (log) =>
        log.username.toLowerCase().includes(term) ||
        log.patientPhn.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.description.toLowerCase().includes(term) ||
        log.userRole.toLowerCase().includes(term)
    );
    setFilteredLogs(filtered);
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "CREATE":
        return "default";
      case "VIEW":
        return "secondary";
      case "UPDATE":
        return "outline";
      case "DELETE":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role.includes("ADMIN")) return "destructive";
    if (role.includes("DOCTOR")) return "default";
    if (role.includes("NURSE")) return "secondary";
    return "outline";
  };

  // Don't render if not admin
  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
             Audit Logs
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View all patient data access logs for compliance
          </p>
        </div>
        <Button onClick={loadLogs} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Creates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.creates}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.views}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.updates}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Deletes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.deletes}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Audit Logs</CardTitle>
          <CardDescription>
            Search by username, patient PHN, action, or description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                {searchTerm ? "No logs found matching your search" : "No audit logs available"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Patient PHN</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">
                            {formatDateTimeDisplay(log.timestamp)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{log.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(log.userRole)}>
                          {log.userRole.replace("ROLE_", "")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{log.patientPhn}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {log.description}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;

