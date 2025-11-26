import React from 'react';
import { ProgressForm, ProgressNote } from '../../types/wardManagement';
import InputField from '../InputField';
import SmallMetric from '../SmallMetric';

interface ProgressNotesTabProps {
  progressForm: ProgressForm;
  onChange: (
    field: keyof ProgressForm
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  notes: ProgressNote[];
}

const ProgressNotesTab: React.FC<ProgressNotesTabProps> = ({
  progressForm,
  onChange,
  onSubmit,
  notes
}) => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">
        New Progress Note
      </h3>
      <form onSubmit={onSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <InputField
            label="Temperature (°C)"
            value={progressForm.tempC}
            onChange={onChange("tempC")}
            type="number"
            min="25"
            max="45"
          />
          <InputField
            label="Body Weight (kg)"
            value={progressForm.weightKg}
            onChange={onChange("weightKg")}
            type="number"
            step="0.1"
          />
          <InputField
            label="BP High (mmHg)"
            value={progressForm.bpHigh}
            onChange={onChange("bpHigh")}
            type="number"
          />
          <InputField
            label="BP Low (mmHg)"
            value={progressForm.bpLow}
            onChange={onChange("bpLow")}
            type="number"
          />
          <InputField
            label="Heart Rate (bpm)"
            value={progressForm.heartRate}
            onChange={onChange("heartRate")}
            type="number"
          />
          <InputField
            label="Input (mL)"
            value={progressForm.inputMl}
            onChange={onChange("inputMl")}
            type="number"
          />
          <InputField
            label="Urine Output (mL)"
            value={progressForm.urineOutputMl}
            onChange={onChange("urineOutputMl")}
            type="number"
          />
          <InputField
            label="PD Balance (mL)"
            value={progressForm.pdBalance}
            onChange={onChange("pdBalance")}
            type="number"
          />
          <InputField
            label="Total Balance (mL)"
            value={progressForm.totalBalance}
            onChange={onChange("totalBalance")}
            type="number"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            Save Progress Note
          </button>
        </div>
      </form>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">
        Previous Progress Notes
      </h3>
      {notes.length === 0 ? (
        <p className="text-xs text-slate-500">No progress notes yet.</p>
      ) : (
        <div className="space-y-3 text-xs">
          {notes.map((n) => (
            <article
              key={n.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="font-semibold text-slate-800">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-1 md:grid-cols-4">
                <SmallMetric label="Temp" value={n.tempC} suffix="°C" />
                <SmallMetric label="Wt" value={n.weightKg} suffix="kg" />
                <SmallMetric
                  label="BP"
                  value={
                    n.bpHigh && n.bpLow
                      ? `${n.bpHigh}/${n.bpLow}`
                      : undefined
                  }
                  suffix="mmHg"
                />
                <SmallMetric label="HR" value={n.heartRate} suffix="bpm" />
                <SmallMetric label="Input" value={n.inputMl} suffix="mL" />
                <SmallMetric
                  label="Urine"
                  value={n.urineOutputMl}
                  suffix="mL"
                />
                <SmallMetric
                  label="PD Bal"
                  value={n.pdBalance}
                  suffix="mL"
                />
                <SmallMetric
                  label="Total Bal"
                  value={n.totalBalance}
                  suffix="mL"
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default ProgressNotesTab;