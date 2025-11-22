import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h4 className="mt-4 mb-1 text-xs font-semibold text-slate-700">{children}</h4>
);

export default SectionTitle;