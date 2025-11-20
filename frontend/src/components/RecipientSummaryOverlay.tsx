import React from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const transfusions = (form as any).transfusionHistory || [];
  const comorbidities = (form as any).comorbidities || {};
  const rrt = (form as any).rrtDetails || {};
  const immuno = (form as any).immunologicalDetails || {};

  const copyAsReport = () => {
    const lines: string[] = [];
    lines.push(`Recipient Assessment — ${form.name || ''} (${form.phn || ''})`);
    lines.push('');
    lines.push('Basic Information:');
    ['name','phn','age','gender'].forEach(k=>lines.push(`${k}: ${(form as any)[k] ?? '—'}`));
    lines.push('');
    lines.push('Donor Details:');
    ['donorName','donorPhn','donorBloodGroup','relationToRecipient','relationType'].forEach(k=>lines.push(`${k}: ${(form as any)[k] ?? '—'}`));
    lines.push('');
    lines.push('Comorbidities:');
    Object.entries(comorbidities).forEach(([k,v])=>lines.push(`${k}: ${typeof v==='boolean'? (v? 'Yes':'No') : (v||'—')}`));
    lines.push('');
    lines.push('RRT Details:');
    Object.entries(rrt).forEach(([k,v])=>lines.push(`${k}: ${typeof v==='boolean'? (v? 'Yes':'No') : (v||'—')}`));
    if (transfusions.length){
      lines.push('');
      lines.push('Transfusion History:');
      transfusions.forEach((t:any)=>lines.push(`${t.date||'—'} | ${t.indication||'—'} | ${t.volume||'—'}`));
    }
    lines.push('');
    lines.push('Immunological Details:');
    const immunoFlat: Record<string, any> = {};
    // Shallow flatten key groups
    if (immuno.bloodGroup){ Object.entries(immuno.bloodGroup).forEach(([k,v])=>immunoFlat[`bloodGroup.${k}`]=v); }
    if (immuno.crossMatch){ Object.entries(immuno.crossMatch).forEach(([k,v])=>immunoFlat[`crossMatch.${k}`]=v); }
    if (immuno.praPre) immunoFlat['praPre']=immuno.praPre;
    if (immuno.praPost) immunoFlat['praPost']=immuno.praPost;
    if (immuno.dsa) immunoFlat['dsa']=immuno.dsa;
    if (immuno.immunologicalRisk) immunoFlat['immunologicalRisk']=immuno.immunologicalRisk;
    Object.entries(immunoFlat).forEach(([k,v])=>lines.push(`${k}: ${v||'—'}`));
    if ((form as any).completedBy?.staffName){
      lines.push('');
      lines.push(`Completed By: ${(form as any).completedBy.staffName}`);
    }
    navigator.clipboard?.writeText(lines.join('\n'));
    alert('Report copied to clipboard');
  };

  const exportPrint = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Recipient Assessment</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111} h1{font-size:20px;margin:0 0 12px} h2{font-size:16px;margin:24px 0 8px} table{border-collapse:collapse;width:100%;margin-bottom:12px} th,td{border:1px solid #ddd;padding:6px;font-size:12px;text-align:left} .section{margin-bottom:12px} .kv{display:grid;grid-template-columns:160px 1fr;gap:4px 12px;font-size:12px} .kv div.label{font-weight:600} .badge{display:inline-block;padding:2px 6px;border-radius:4px;background:#eef} </style></head><body><h1>Recipient Assessment Summary</h1><h2>Basic Information</h2><div class="kv">${['name','phn','age','gender'].map(k=>`<div class='label'>${k}</div><div>${(form as any)[k]??'—'}</div>`).join('')}</div><h2>Donor Details</h2><div class="kv">${['donorName','donorPhn','donorBloodGroup','relationToRecipient','relationType'].map(k=>`<div class='label'>${k}</div><div>${(form as any)[k]??'—'}</div>`).join('')}</div><h2>Comorbidities</h2><div class="kv">${Object.entries(comorbidities).map(([k,v])=>`<div class='label'>${k}</div><div>${typeof v==='boolean'?(v?'Yes':'No'):(v||'—')}</div>`).join('')}</div><h2>RRT Details</h2><div class="kv">${Object.entries(rrt).map(([k,v])=>`<div class='label'>${k}</div><div>${typeof v==='boolean'?(v?'Yes':'No'):(v||'—')}</div>`).join('')}</div>${transfusions.length?`<h2>Transfusion History</h2><table><thead><tr><th>Date</th><th>Indication</th><th>Volume</th></tr></thead><tbody>${transfusions.map((t:any)=>`<tr><td>${t.date||'—'}</td><td>${t.indication||'—'}</td><td>${t.volume||'—'}</td></tr>`).join('')}</tbody></table>`:''}<h2>Immunological Details</h2><div class="kv">${(()=>{const arr: string[]=[]; if(immuno.bloodGroup){Object.entries(immuno.bloodGroup).forEach(([k,v])=>arr.push(`<div class='label'>bloodGroup.${k}</div><div>${v||'—'}</div>`));} if(immuno.crossMatch){Object.entries(immuno.crossMatch).forEach(([k,v])=>arr.push(`<div class='label'>crossMatch.${k}</div><div>${v||'—'}</div>`));} ['praPre','praPost','dsa','immunologicalRisk'].forEach(k=>{if((immuno as any)[k]) arr.push(`<div class='label'>${k}</div><div>${(immuno as any)[k]||'—'}</div>`);}); return arr.join('');})()}</div><script>window.onload=()=>window.print()</script></body></html>`;
    const w = window.open('', '_blank');
    if(!w){ alert('Popup blocked'); return; }
    w.document.open(); w.document.write(html); w.document.close();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recipient Assessment Summary</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">{form.phn ? `${form.name || ''} — ${form.phn}` : form.name || ''}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2 mb-2">
          <Button size="sm" variant="outline" onClick={copyAsReport}>Copy as report</Button>
          <Button size="sm" variant="outline" onClick={exportPrint}>Export / Print</Button>
          <Button size="sm" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
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

            <AccordionItem value="comorbidities">
              <AccordionTrigger>Comorbidities</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(comorbidities).map(([k,v]) => (
                    <Field key={k} label={k} value={typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rrt">
              <AccordionTrigger>RRT Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(rrt).map(([k,v]) => (
                    <Field key={k} label={k} value={typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="immuno">
              <AccordionTrigger>Immunological Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {immuno.bloodGroup && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(immuno.bloodGroup).map(([k,v]) => <Field key={k} label={`Blood Group ${k}`} value={v} />)}
                    </div>
                  )}
                  {immuno.crossMatch && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(immuno.crossMatch).map(([k,v]) => <Field key={k} label={`Cross Match ${k}`} value={v} />)}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="PRA Pre" value={immuno.praPre} />
                    <Field label="PRA Post" value={immuno.praPost} />
                    <Field label="DSA" value={immuno.dsa} />
                    <Field label="Immunological Risk" value={immuno.immunologicalRisk} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="transfusion">
              <AccordionTrigger>Transfusion History</AccordionTrigger>
              <AccordionContent>
                {transfusions.length ? (
                  <div className="space-y-2">
                    {transfusions.map((t: any, i: number) => (
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
          </Accordion>

          <div>
            <h4 className="text-sm font-semibold mb-2">Filled By</h4>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-black dark:text-white whitespace-pre-wrap">{(form as any).completedBy?.staffName || (form as any).filledBy || '—'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipientSummaryOverlay;
