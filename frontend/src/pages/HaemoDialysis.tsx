import React, { useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  CalendarDays,
  ClipboardList,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import GlobalSearch from '@/components/GlobalSearch';
import HDSessionForm, { HemodialysisForm } from '@/components/HDSessionForm';
import HDMonthlyReview from '@/components/HDMonthlyReview';
import HDScheduleAppointment from '@/components/HDScheduleAppointment';
import HDSummary from '@/components/HDSummary';
import HDWeekScheduleFloating from '@/components/HDWeekScheduleFloating';

type ActiveView =
  | 'dashboard'
  | 'session-form'
  | 'monthly-review'
  | 'schedule-appointment'
  | 'view-summary';

const initialForm: HemodialysisForm = {
  personal: { name: '', phn: '' },
  prescription: { access: '' },
  vascular: { access: '' },
  session: { date: new Date().toISOString().split('T')[0] },
  otherNotes: '',
  completedBy: { staffName: '', staffRole: '', completionDate: new Date().toISOString().split('T')[0] },
};

const HaemoDialysisPage: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [form, setForm] = useState<HemodialysisForm>(initialForm);
  const [showFloating, setShowFloating] = useState(false);

  const handleBack = () => {
    setActiveView('dashboard');
    setForm(initialForm);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {activeView !== 'dashboard' && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          )}

          

          <div />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            {/* Dashboard Title */}
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-2 mx-auto">
                <Activity className="w-9 h-9 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Hemodialysis Management
              </h1>
             
            </div>

            {/* Dashboard Cards Grid */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* HD Session Form Card */}
                <Card
                  className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveView('session-form')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      setActiveView('session-form');
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <ClipboardList className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-xl font-medium mb-4">
                      HD Session Information
                    </CardTitle>
                  </div>
                  <Button
                    className="px-6 py-2 text-base w-full"
                    onClick={() => setActiveView('session-form')}
                  >
                    Access
                  </Button>
                </Card>

                {/* Monthly Review Card */}
                <Card
                  className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveView('monthly-review')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      setActiveView('monthly-review');
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <ClipboardList className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-xl font-medium mb-4">
                      Monthly Review
                    </CardTitle>
                  </div>
                  <Button
                    className="px-6 py-2 text-base w-full"
                    onClick={() => setActiveView('monthly-review')}
                  >
                    Access
                  </Button>
                </Card>

                {/* Schedule Appointment Card */}
                <Card
                  className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveView('schedule-appointment')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      setActiveView('schedule-appointment');
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <CalendarDays className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-xl font-medium mb-4">
                      Schedule Appointment
                    </CardTitle>
                  </div>
                  <Button
                    className="px-6 py-2 text-base w-full"
                    onClick={() => setActiveView('schedule-appointment')}
                  >
                    Access
                  </Button>
                </Card>

                {/* View Summary Card */}
                <Card
                  className="shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between items-center text-center w-full h-full cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveView('view-summary')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      setActiveView('view-summary');
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <FileText className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-xl font-medium mb-4">
                      View Summary
                    </CardTitle>
                  </div>
                  <Button
                    className="px-6 py-2 text-base w-full"
                    onClick={() => setActiveView('view-summary')}
                  >
                    Access
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeView === 'session-form' && (
          <HDSessionForm
            form={form}
            setForm={setForm}
            onBack={handleBack}
          />
        )}

        {activeView === 'monthly-review' && (
          <HDMonthlyReview onBack={handleBack} />
        )}

        {activeView === 'schedule-appointment' && (
          <HDScheduleAppointment onBack={handleBack} />
        )}

        {activeView === 'view-summary' && (
          <HDSummary onBack={handleBack} />
        )}
      </div>
      {/* Floating action button */}
      <div>
        <button
          onClick={() => setShowFloating((s) => !s)}
          aria-label="Open HD Weekly Timetable"
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          <CalendarDays className="w-6 h-6" />
        </button>
        {showFloating && <HDWeekScheduleFloating onClose={() => setShowFloating(false)} />}
      </div>
    </div>
  );
};

export default HaemoDialysisPage;