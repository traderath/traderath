import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2, FileText, Loader2, Sparkles, X } from 'lucide-react';
import { AppCard, PageHeader, PrimaryButton, SecondaryButton } from '@/app/ui';

const FIELDS = [
    { key: 'buyer', label: 'Buyer', value: 'ABC GmbH', confidence: 0.96 },
    { key: 'country', label: 'Country', value: 'Germany', confidence: 0.94 },
    { key: 'products', label: 'Products', value: 'Industrial Sensor (HS 9031.80)', confidence: 0.88 },
    { key: 'quantity', label: 'Quantity', value: '500 units', confidence: 0.91 },
    { key: 'price', label: 'Unit Price', value: '$150.00', confidence: 0.9 },
    { key: 'currency', label: 'Currency', value: 'USD', confidence: 0.99 },
    { key: 'incoterm', label: 'Incoterm', value: 'FOB Mumbai', confidence: 0.93 },
    { key: 'deliveryDate', label: 'Delivery Date', value: '2026-10-04', confidence: 0.82 },
    { key: 'destination', label: 'Destination', value: 'Hamburg, DE', confidence: 0.95 },
];

const confidenceTone = (c) => (c >= 0.9 ? 'text-emerald-600 bg-emerald-50' : c >= 0.8 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50');

const AiExtractionPage = () => {
    const [extracting, setExtracting] = useState(false);
    const [extracted, setExtracted] = useState(true);

    const runExtraction = () => {
        setExtracting(true);
        setExtracted(false);
        setTimeout(() => {
            setExtracting(false);
            setExtracted(true);
        }, 1600);
    };

    return (
        <div className="space-y-6">
            <Helmet><title>AI Document Extraction — TradeRath</title></Helmet>

            <PageHeader
                title="AI document extraction"
                subtitle="TradeRath AI reads your export documents and structures the data with confidence scores."
                actions={<SecondaryButton onClick={runExtraction} loading={extracting}><Sparkles className="h-4 w-4" /> Re-run extraction</SecondaryButton>}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* LEFT — document preview */}
                <AppCard className="overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><FileText className="h-4.5 w-4.5 text-blue-600" /> CI-EXP-1024.pdf</div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">Commercial Invoice</span>
                    </div>
                    <div className="bg-slate-100 p-6">
                        <div className="mx-auto max-w-sm space-y-3 rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex justify-between border-b border-slate-200 pb-3 text-xs text-slate-500">
                                <span>COMMERCIAL INVOICE</span><span>No. CI-EXP-1024</span>
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-700">
                                <p><span className="text-slate-400">Seller:</span> TradeRath Exports Pvt Ltd, Mumbai</p>
                                <p><span className="text-slate-400">Buyer:</span> ABC GmbH, Hamburg, Germany</p>
                                <p><span className="text-slate-400">Incoterm:</span> FOB Mumbai</p>
                                <p><span className="text-slate-400">Currency:</span> USD</p>
                            </div>
                            <div className="border-t border-slate-200 pt-3 text-xs text-slate-700">
                                <p className="font-medium text-slate-800">Industrial Sensor — 500 units @ $150.00</p>
                                <p className="mt-1 text-right font-semibold">Total: $75,000.00</p>
                            </div>
                            <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
                                <p>Delivery: 2026-10-04 · Destination: Hamburg, DE</p>
                            </div>
                        </div>
                    </div>
                </AppCard>

                {/* RIGHT — extraction results */}
                <AppCard className="overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <Sparkles className="h-4.5 w-4.5 text-blue-600" /> TradeRath AI Extraction
                        </div>
                        {extracted && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Extracted</span>}
                    </div>

                    {extracting ? (
                        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="mt-3 text-sm text-slate-500">Reading document and extracting trade data…</p>
                            <div className="mt-4 flex gap-1">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '0ms' }} />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '150ms' }} />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {FIELDS.map((f) => (
                                <div key={f.key} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-slate-400">{f.label}</p>
                                        <p className="mt-0.5 text-sm font-medium text-slate-800">{f.value}</p>
                                    </div>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${confidenceTone(f.confidence)}`}>
                                        {Math.round(f.confidence * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!extracting && (
                        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
                            <SecondaryButton>Cancel</SecondaryButton>
                            <SecondaryButton>Review Fields</SecondaryButton>
                            <PrimaryButton><Sparkles className="h-4 w-4" /> Create Draft Order</PrimaryButton>
                        </div>
                    )}
                </AppCard>
            </div>
        </div>
    );
};

export default AiExtractionPage;
