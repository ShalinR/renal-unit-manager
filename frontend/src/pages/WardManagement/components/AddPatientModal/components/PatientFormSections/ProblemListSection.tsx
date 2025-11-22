import React from 'react';
import { Plus } from 'lucide-react';

interface ProblemListTabProps {
  title: string;
  helpText: string;
  problems: string[];
  setProblems: (p: string[]) => void;
}

const ProblemListTab: React.FC<ProblemListTabProps> = ({ title, helpText, problems, setProblems }) => {
  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const copy = [...problems];
    copy[index] = e.target.value;
    setProblems(copy);
  };

  const handleAdd = () => {
    if (problems.length < 10) {
      setProblems([...problems, ""]);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <p className="text-[11px] text-slate-500">{helpText}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={problems.length >= 10}
          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Problem
        </button>
      </div>
      <div className="space-y-2 text-xs">
        {problems.map((p, idx) => (
          <div key={idx}>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
              Problem {idx + 1}
            </label>
            <textarea
              value={p}
              onChange={handleChange(idx)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemListTab;