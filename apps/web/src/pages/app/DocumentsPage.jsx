import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FileText, Plus, Search, Sparkles, Upload, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useFullList, owner } from '@/app/useCollection';
import { StatusBadge, docTypeLabel } from '@/app/status';
import {
    AppCard, AppInput, AppSelect, EmptyState, PageHeader, PrimaryButton, SecondaryButton,
    TableSkeleton, formatDate,
} from '@/app/ui';

const TYPE_FILTERS = [
    { value: 'all', label: 'All types' },
    { value: 'purchase_order', label: 'Purchase Order' },
    { value: 'commercial_invoice', label: 'Commercial Invoice' },
    { value: 'packing_list', label: 'Packing List' },
    { value: 'certificate_of_origin', label: 'Certificate of Origin' },
    { value: 'bill_of_lading', label: 'Bill of Lading' },
    { value: 'airway_bill', label: 'Airway Bill' },
];

const UploadModal = ({ open, onClose, onCreated }) => {
    const [form, setForm] = useState({ name: '', transaction: '', customer: '', type: 'purchase_order' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await pb.collection('documents').create({
                ...form,
                verification: 'pending',
                compliance: 'pending',
                owner: owner(),
            });
            onCreated();
            onClose();
        } catch (err) {
            setError('Could not upload the document. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
            <AppCard className="relative w-full max-w-md p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Upload document</h3>
                    <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div className="space-y-1.5"><label className="text-sm font-medium text-slate-700">Document name</label><AppInput required value={form.name} onChange={update('name')} placeholder="CI-EXP-1032.pdf" /></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium text-slate-700">Transaction</label><AppInput value={form.transaction} onChange={update('transaction')} placeholder="EXP-1024" /></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium text-slate-700">Customer</label><AppInput value={form.customer} onChange={update('customer')} placeholder="Buyer name" /></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium text-slate-700">Type</label>
                        <AppSelect className="w-full" value={form.type} onChange={update('type')}>
                            {TYPE_FILTERS.filter((t) => t.value !== 'all').map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </AppSelect>
                    </div>
                    {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                    <div className="flex justify-end gap-2 pt-2"><SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton><PrimaryButton type="submit" loading={saving}>Upload</PrimaryButton></div>
                </form>
            </AppCard>
        </div>
    );
};

const DocumentsPage = () => {
    const [type, setType] = useState('all');
    const [query, setQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const { data: docs, loading, refresh } = useFullList('documents', { sort: '-created' });

    const filtered = useMemo(() => {
        return docs.filter((d) => {
            const matchesType = type === 'all' || d.type === type;
            const q = query.trim().toLowerCase();
            const matchesQuery = !q || d.name.toLowerCase().includes(q) || (d.customer || '').toLowerCase().includes(q) || (d.transaction || '').toLowerCase().includes(q);
            return matchesType && matchesQuery;
        });
    }, [docs, type, query]);

    return (
        <div className="space-y-6">
            <Helmet><title>Documents — TradeRath</title></Helmet>

            <PageHeader
                title="Document management"
                subtitle="Upload, generate, and verify every export document in one place."
                actions={
                    <>
                        <SecondaryButton><Sparkles className="h-4 w-4" /> Generate Document</SecondaryButton>
                        <PrimaryButton onClick={() => setModalOpen(true)}><Upload className="h-4 w-4" /> Upload Document</PrimaryButton>
                    </>
                }
            />

            <AppCard>
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                    <AppSelect value={type} onChange={(e) => setType(e.target.value)} className="md:w-56">
                        {TYPE_FILTERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </AppSelect>
                    <div className="relative md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <AppInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents..." className="pl-9" />
                    </div>
                </div>

                {loading ? (
                    <TableSkeleton rows={7} cols={6} />
                ) : filtered.length === 0 ? (
                    <EmptyState icon={FileText} title="No documents yet." description="Upload or generate your first export document to get started." action={<PrimaryButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Upload Document</PrimaryButton>} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-4 py-3 font-medium">Document</th>
                                    <th className="px-4 py-3 font-medium">Transaction</th>
                                    <th className="px-4 py-3 font-medium">Customer</th>
                                    <th className="px-4 py-3 font-medium">Type</th>
                                    <th className="px-4 py-3 font-medium">Created</th>
                                    <th className="px-4 py-3 font-medium">Verification</th>
                                    <th className="px-4 py-3 font-medium">Compliance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((d) => (
                                    <tr key={d.id} className="transition-colors hover:bg-slate-50">
                                        <td className="px-4 py-3"><div className="flex items-center gap-2.5"><FileText className="h-4.5 w-4.5 text-slate-400" /><span className="font-medium text-slate-800">{d.name}</span></div></td>
                                        <td className="px-4 py-3">{d.transaction ? <Link to={`/app/orders/${d.transaction}`} className="text-blue-600 hover:text-blue-700">{d.transaction}</Link> : '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{d.customer || '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{docTypeLabel(d.type)}</td>
                                        <td className="px-4 py-3 text-slate-600">{formatDate(d.created)}</td>
                                        <td className="px-4 py-3"><StatusBadge category="verification" value={d.verification} /></td>
                                        <td className="px-4 py-3"><StatusBadge category="docCompliance" value={d.compliance} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AppCard>

            <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={refresh} />
        </div>
    );
};

export default DocumentsPage;
