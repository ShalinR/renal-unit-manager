import React from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { RecipientAssessmentForm } from "@/types/recipient";

interface RecipientSummaryOverlayProps {
  form: RecipientAssessmentForm;
  onClose: () => void;
}

const Field = ({ label, value, abnormal }: { label: string; value: any; abnormal?: boolean }) => (
  <div>
    <Label className="text-muted-foreground text-xs">{label}</Label>
    <p className="font-medium text-sm text-black dark:text-white break-words">{value === '' || value === null || value === undefined ? '—' : String(value)}</p>
  </div>
);

const RecipientSummaryOverlay: React.FC<RecipientSummaryOverlayProps> = ({ form, onClose }) => {
  const copyAsReport = () => {
    const reportLines: string[] = [];
    reportLines.push(`Recipient Assessment — ${form.name || ''} ${form.phn || ''}`);
    reportLines.push('');

    // Flatten top-level fields (skip objects/arrays)
    Object.entries(form).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if (typeof v === 'object') return;
      reportLines.push(`${k}: ${v}`);
    });

    // Add transfusions if present
    const transfusions = (form as any).transfusions;
    if (Array.isArray(transfusions) && transfusions.length) {
      reportLines.push('');
      reportLines.push('Transfusions:');
      transfusions.forEach((t: any) => reportLines.push(`${t.date || '—'} — ${t.indication || '—'} — ${t.volume || '—'}`));
    }

    // Medications if any
    const meds = (form as any).medications;
    if (Array.isArray(meds) && meds.length) {
      reportLines.push('');
      reportLines.push('Medications:');
      meds.forEach((m: any) => reportLines.push(`${m.name || '—'} — ${m.dosage || ''}`));
    }

    // Filled by
    if ((form as any).completedBy?.staffName) {
      reportLines.push('');
      reportLines.push(`Filled By: ${(form as any).completedBy.staffName}`);
    }

    navigator.clipboard?.writeText(reportLines.join('\n'));
    alert('Report copied to clipboard');
  };

  const exportPrint = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Recipient Assessment</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111} h1{font-size:18px} .section{margin-bottom:12px;} .label{font-weight:600;margin-bottom:4px;} .value{margin-bottom:6px}</style></head><body><h1>Recipient Assessment</h1><p><strong>Patient:</strong> ${form.name || ''} ${form.phn || ''}</p>${['donorName','donorPhn','donorBloodGroup','relationToRecipient','relationType'].map(k=>`<div class="section"><div class="label">${k}</div><div class="value">${String((form as any)[k]||'—')}</div></div>`).join('')}${Array.isArray((form as any).transfusions) && (form as any).transfusions.length ? `<div class="section"><div class="label">Transfusions</div>${(form as any).transfusions.map((t:any)=>`<div class="value">${t.date||'—'} — ${t.indication||'—'} — ${t.volume||'—'}</div>`).join('')}</div>` : ''}${Array.isArray((form as any).medications) && (form as any).medications.length ? `<div class="section"><div class="label">Medications</div>${(form as any).medications.map((m:any)=>`<div class="value">${m.name||'—'} — ${m.dosage||''}</div>`).join('')}</div>` : ''}<script>window.onload=()=>{window.print();}</script></body></html>`;

    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } else {
      alert('Unable to open print window — please allow popups');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pointer-events-none">
      <div className="w-full max-w-2xl pointer-events-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-blue-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Recipient Assessment Summary</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copyAsReport}>Copy as report</Button>
            <Button size="sm" variant="outline" onClick={exportPrint}>Export / Print</Button>
            <Button size="sm" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-6">
          <Accordion type="multiple" defaultValue={[] as string[]}>
            <AccordionItem value="basic">
              <AccordionTrigger>Basic Information</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name" value={form.name} />
                  <Field label="PHN" value={form.phn} />
                  <Field label="Age" value={(form as any).age} />
                  <Field label="Gender" value={(form as any).gender} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="donor">
              <AccordionTrigger>Donor Relationship</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Donor Name" value={form.donorName} />
                  <Field label="Donor PHN" value={form.donorPhn} />
                  <Field label="Donor Blood Group" value={(form as any).donorBloodGroup} />
                  <Field label="Relation" value={form.relationToRecipient} />
                  <Field label="Relation Type" value={form.relationType} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="immuno">
              <AccordionTrigger>Immunological</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Immunological Risk" value={(form as any).immunologicalRisk} />
                  <Field label="DSA" value={(form as any).dsa} />
                  <Field label="PRA Pre" value={(form as any).praPre} />
                  <Field label="PRA Post" value={(form as any).praPost} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="transfusion">
              <AccordionTrigger>Transfusion History</AccordionTrigger>
              <AccordionContent>
                {(form as any).transfusions?.length ? (
                  <div className="space-y-2">
                    {(form as any).transfusions.map((t: any, i: number) => (
                      <div key={i} className="text-sm p-2 rounded border bg-blue-50 dark:bg-slate-800">
                        <div className="grid grid-cols-3 gap-2">
                          <div>{t.date || '—'}</div>
                          <div>{t.indication || '—'}</div>
                          <div>{t.volume || '—'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm">No transfusions recorded</p>}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="meds">
              <AccordionTrigger>Medications & Recommendations</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Medications</Label>
                      <div>
                        {(form as any).medications?.length ? (form as any).medications.map((m: any, i: number) => (
                          <div key={i} className="text-sm">{m.name} — {m.dosage}</div>
                        )) : <div className="text-sm">—</div>}
                      </div>
                    </div>
                    <Field label="Recommendations" value={(form as any).recommendations} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div>
            <h4 className="text-sm font-semibold mb-2">Filled By</h4>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-black dark:text-white whitespace-pre-wrap">{(form as any).completedBy?.staffName || (form as any).filledBy || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientSummaryOverlay;
