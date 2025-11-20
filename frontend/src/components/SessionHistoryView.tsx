import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SessionHistoryEntry } from '@/hooks/useSessionHistory';
import { Trash2, Eye, Download, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

interface SessionHistoryViewProps {
  entries: SessionHistoryEntry[];
  onRestore: (entry: SessionHistoryEntry) => void;
  onDelete: (entryId: string) => void;
  onViewDetails: (entry: SessionHistoryEntry) => void;
}

const SessionHistoryView: React.FC<SessionHistoryViewProps> = ({
  entries,
  onRestore,
  onDelete,
  onViewDetails,
}) => {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No session history yet. Start by creating a new session.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      case 'submitted':
        return 'bg-blue-50 border-l-4 border-l-blue-500';
      case 'synced':
        return 'bg-green-50 border-l-4 border-l-green-500';
      default:
        return 'bg-gray-50 border-l-4 border-l-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded">Draft</span>;
      case 'submitted':
        return <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">Submitted</span>;
      case 'synced':
        return <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">Synced</span>;
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">Unknown</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session History</CardTitle>
        <CardDescription>View and manage your saved sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries
            .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
            .map((entry) => (
              <div key={entry.id} className={`p-4 rounded-lg ${getStatusColor(entry.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-sm">
                        Session on {format(new Date(entry.sessionDate), 'MMM dd, yyyy')}
                      </h4>
                      {getStatusBadge(entry.status)}
                    </div>
                    <p className="text-xs text-gray-600">
                      Saved at {format(new Date(entry.savedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                    {entry.data?.prescription?.access && (
                      <p className="text-xs text-gray-600 mt-1">
                        Access: <span className="font-medium">{entry.data.prescription.access}</span>
                      </p>
                    )}
                    {entry.data?.session?.durationMinutes && (
                      <p className="text-xs text-gray-600">
                        Duration: <span className="font-medium">{entry.data.session.durationMinutes} min</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(entry)}
                      className="text-blue-600 hover:text-blue-700"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {entry.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRestore(entry)}
                        className="text-green-600 hover:text-green-700"
                        title="Restore this draft"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(entry.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionHistoryView;
