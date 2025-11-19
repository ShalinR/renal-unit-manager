import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface HDSummaryProps {
  onBack: () => void;
}

const HDSummary: React.FC<HDSummaryProps> = ({ onBack }) => {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Treatment Summary</CardTitle>
          <CardDescription className="text-blue-100">
            View comprehensive hemodialysis history and statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              This feature is currently under development.
            </p>
            <p className="text-sm text-gray-500">
              You will be able to view comprehensive statistics, charts,
              treatment history, and quality metrics for hemodialysis sessions.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default HDSummary;
