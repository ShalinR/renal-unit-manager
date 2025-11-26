import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SummaryItem {
  label: string;
  value: React.ReactNode;
}
interface SummarySection {
  title: string;
  items: SummaryItem[];
}
interface TransplantSummaryModalProps {
  title: string;
  sections: SummarySection[];
  onClose: () => void;
}

// Simple floating modal overlay for form summaries
export const TransplantSummaryModal: React.FC<TransplantSummaryModalProps> = ({
  title,
  sections,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pointer-events-none">
      <div className="w-full max-w-xl pointer-events-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-blue-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            {title}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Close
          </Button>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto">
          {sections.length === 0 && (
            <p className="text-sm text-blue-600 dark:text-blue-300">
              No summary data available yet.
            </p>
          )}
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-sm font-semibold tracking-wide text-blue-700 dark:text-blue-300 uppercase">
                {section.title}
              </h3>
              <div className="bg-blue-50 dark:bg-slate-800 rounded-md p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section.items.map((item) => (
                  <div key={item.label} className="text-xs">
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      {item.label}:{" "}
                    </span>
                    <span className="text-blue-700 dark:text-blue-300 break-words">
                      {item.value ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransplantSummaryModal;
