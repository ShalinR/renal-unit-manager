import React from 'react';
import ProblemListTab from '../ProblemListTab'; // This is correct for your structure

interface AllergicHistoryTabProps {
  problems: string[];
  setProblems: (problems: string[]) => void;
}

const AllergicHistoryTab: React.FC<AllergicHistoryTabProps> = ({ problems, setProblems }) => (
  <ProblemListTab
    title="Allergic History"
    helpText="Record known drug / food / contrast allergies."
    problems={problems}
    setProblems={setProblems}
  />
);

export default AllergicHistoryTab;