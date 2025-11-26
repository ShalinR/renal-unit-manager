import React from 'react';
import ProblemListTab from '../ProblemListTab'; // This is correct for your structure

interface AllergicHistoryTabProps {
  problems: string[];
  setProblems: (problems: string[]) => void;
  onSave: (problems: string[]) => Promise<void>;
}

const AllergicHistoryTab: React.FC<AllergicHistoryTabProps> = ({ problems, setProblems, onSave }) => (
  <ProblemListTab
    title="Allergic History"
    helpText="Record known drug / food / contrast allergies."
    problems={problems}
    setProblems={setProblems}
    onSave={onSave}
  />
);

export default AllergicHistoryTab;