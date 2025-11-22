import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Admission } from '../types/wardManagement';
import { apiDownloadDischargeSummaryPDF } from '../services/api';

interface AdmissionsCardProps {
  admissions: Admission[];
  patientPhn?: string;
}

const AdmissionsCard: React.FC<AdmissionsCardProps> = ({ admissions, patientPhn }) => {
  const handleDownloadPDF = async (adm: Admission) => {
    if (!patientPhn) {
      alert("No patient selected");
      return;
    }

    if (!adm.hasDischargeSummary) {
      alert("No discharge summary available for this admission");
      return;
    }

    try {
      const blob = await apiDownloadDischargeSummaryPDF(patientPhn, adm.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `discharge-summary-${adm.bhtNumber}-${patientPhn}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download discharge summary: ' + error.message);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Format admission type for display
  const getAdmissionStatus = (admission: Admission) => {
    if (admission.active) {
      return { text: "Current Admission", class: "bg-blue-100 text-blue-700" };
    } else if (admission.hasDischargeSummary) {
      return { text: "Discharged", class: "bg-slate-100 text-slate-700" };
    } else {
      return { text: "Past Admission", class: "bg-slate-100 text-slate-700" };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          Admission History
        </h3>
        <span className="text-xs text-slate-500">
          {admissions.length} admission(s)
        </span>
      </div>
      <div className="space-y-3 text-xs">
        {admissions.length === 0 ? (
          <div className="text-center py-4 text-slate-500">
            No admissions found
          </div>
        ) : (
          admissions.map((adm) => {
            const status = getAdmissionStatus(adm);
            return (
              <div
                key={adm.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  adm.active
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold shadow-sm ${status.class}`}>
                    {adm.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 truncate">
                      {status.text}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {formatDate(adm.admittedOn)}
                    </div>
                    <div className="text-[11px] font-medium">
                      {adm.bhtNumber}
                    </div>
                    <div className="mt-1 text-[11px]">
                      {adm.hasDischargeSummary ? (
                        <span className="font-medium text-emerald-600 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Discharge Summary Available
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          No Discharge Summary
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(adm)}
                  disabled={!adm.hasDischargeSummary}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                  <Download className="mr-1 h-3 w-3" />
                  PDF
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Legend for admission status */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
            <span>Current Admission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div>
            <span>Past Admission</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-emerald-600" />
            <span>Discharge Summary Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsCard;