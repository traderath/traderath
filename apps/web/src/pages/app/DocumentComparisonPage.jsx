import React from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, CheckCircle2, FileText, GitCompare } from 'lucide-react';
import { AppCard, PageHeader, PrimaryButton, SecondaryButton } from '@/app/ui';

const COLUMNS = [
    { key: 'po', label: 'Purchase Order', file: 'PO-ABC-1024.pdf' },
    { key: 'ci', label: 'Commercial Invoice', file: 'CI-EXP-1024.pdf' },
    { key: 'pl', label: 'Packing List', file: 'PL-EXP-1024.pdf' },
];

// field -> { po, ci, pl }
const FIELDS = [
    { field: 'Buyer', values: { po: 'ABC GmbH', ci: 'ABC GmbH', pl: 'ABC GmbH' } },
    { field: 'Country', values: { po: 'Germany', ci: 'Germany', pl: 'Germany' } },
    { field: 'Product', values: { po: 'Industrial Sensor', ci: 'Industrial Sensor', pl: 'Industrial Sensor' } },
    { field: 'Quantity', values: { po: '500', ci: '480', pl: '500' } },
    { field: 'Unit Price', values: { po: '$150.00', ci: '$150.00', pl: '—' } },
    { field: 'Total Value', values: { po: '$75,000', ci: '$72,000', pl: '—' } },
    { field: 'Incoterm', values: { po: 'FOB', ci: 'FOB', pl: 'FOB' } },
    { field: 'Currency', values: { po: 'USD', ci: 'USD', pl: 'USD' } },
    { field: 'Destination', values: { po: 'Hamburg', ci: 'Hamburg', pl: 'Hamburg' } },
];

const DISCREPANCIES = [
    {
        issue: 'Quantity mismatch',
        detail: 'PO: 500 · Invoice: 480 · Packing List: 500',
        documents: 'Commercial Invoice',
        recommendation: 'Confirm shipped quantity with buyer; amend invoice if 500 units were dispatched.',
        confidence: 0.89,
    },
    {
        issue: 'Total value mismatch',
        detail: 'PO: $75,000 · Invoice: $72,000',
        documents: 'Commercial Invoice',
        recommendation: 'Reconcile unit price × quantity; invoice reflects 480 units at $150.',
        confidence: 0.92,
    },
];

const matchState = (values) => {
    const vals = Object.values(values).filter((v) => v && v !== '—');
    const unique = new Set(vals);
    if (unique.size <= 1) return 'match';
    return 'mismatch';
};

const cellTone = (state) => (state === 'match' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50');

const DocumentComparisonPage = () => (
    <div className="space-y-6">
        <Helmet><title>Document Comparison — TradeRath</title></Helmet>

        <PageHeader
            title="Document comparison"
            subtitle="Cross-check your purchase order, commercial invoice, and packing list for discrepancies."
            actions={<SecondaryButton><GitCompare className="h-4 w-4" /> New comparison</SecondaryButton>}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {COLUMNS.map((c) => (
                <AppCard key={c.key} className="overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3.5 text-sm font-medium text-slate-700">
                        <FileText className="h-4.5 w-4.5 text-blue-600" /> {c.label}
                    </div>
                    <div className="px-5 py-3 text-xs text-slate-400">{c.file}</div>
                </AppCard>
            ))}
        </div>

        <AppCard className="overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-900">Field-by-field comparison</div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-5 py-3 font-medium">Field</th>
                            {COLUMNS.map((c) => <th key={c.key} className="px-5 py-3 font-medium">{c.label}</th>)}
                            <th className="px-5 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {FIELDS.map((f) => {
                            const state = matchState(f.values);
                            return (
                                <tr key={f.field} className="transition-colors hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-700">{f.field}</td>
                                    {COLUMNS.map((c) => (
                                        <td key={c.key} className={`px-5 py-3 ${cellTone(state)}`}>{f.values[c.key]}</td>
                                    ))}
                                    <td className="px-5 py-3">
                                        {state === 'match' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Match</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600"><AlertTriangle className="h-3.5 w-3.5" /> Mismatch</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </AppCard>

        <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Discrepancies detected</h2>
            {DISCREPANCIES.map((d, i) => (
                <AppCard key={i} className="p-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900">{d.issue}</p>
                                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">{Math.round(d.confidence * 100)}% confidence</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{d.detail}</p>
                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <div><p className="text-xs uppercase tracking-wide text-slate-400">Documents affected</p><p className="text-sm text-slate-700">{d.documents}</p></div>
                                <div className="sm:col-span-2"><p className="text-xs uppercase tracking-wide text-slate-400">Recommended review</p><p className="text-sm text-slate-700">{d.recommendation}</p></div>
                            </div>
                        </div>
                    </div>
                </AppCard>
            ))}
        </div>

        <div className="flex justify-end gap-2">
            <SecondaryButton>Dismiss</SecondaryButton>
            <PrimaryButton>Resolve & update records</PrimaryButton>
        </div>
    </div>
);

export default DocumentComparisonPage;
