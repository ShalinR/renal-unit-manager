import React from 'react';
import ProblemListTab from '../ProblemListTab'; // This is correct for your structure

interface MedicalHistoryTabProps {
  problems: string[];
  setProblems: (problems: string[]) => void;
}

const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({ problems, setProblems }) => (
  <ProblemListTab
    title="Medical History"
    helpText="Add key long-term medical problems (e.g. Diabetes, Hypertension, IHD)."
    problems={problems}
    setProblems={setProblems}
  />
);

export default MedicalHistoryTab;