import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface HDScheduleAppointmentProps {
  onBack: () => void;
}

const HDScheduleAppointment: React.FC<HDScheduleAppointmentProps> = ({ onBack }) => {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Schedule Appointment</CardTitle>
          <CardDescription className="text-blue-100">
            Book hemodialysis sessions and manage dialysis schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              This feature is currently under development.
            </p>
            <p className="text-sm text-gray-500">
              You will be able to schedule hemodialysis sessions, view available
              slots, and manage your dialysis appointments.
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

export default HDScheduleAppointment;
