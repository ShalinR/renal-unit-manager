import React from 'react';
import { useNavigate } from 'react-router-dom';

const InvestigationsTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-800">
        Investigations
      </h3>
      <p className="mb-4 text-xs text-slate-600">
        Investigations are handled in a dedicated section. Click below to go
        to the Investigations module for this patient.
      </p>
      <button
        type="button"
        onClick={() => navigate("/investigation")}
        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
      >
        Go to Investigations
      </button>
    </div>
  );
};

export default InvestigationsTab;