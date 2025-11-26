import React from 'react';

interface SmallMetricProps {
  label: string;
  value?: number | string;
  suffix?: string;
}

const SmallMetric: React.FC<SmallMetricProps> = ({ label, value, suffix }) => (
  <div className="text-[11px] text-slate-600">
    <span className="font-medium text-slate-500">{label}: </span>
    {value !== undefined ? (
      <span className="font-semibold text-slate-800">
        {value}
        {suffix ? ` ${suffix}` : ""}
      </span>
    ) : (
      <span className="text-slate-400">–</span>
    )}
  </div>
);

export default SmallMetric;