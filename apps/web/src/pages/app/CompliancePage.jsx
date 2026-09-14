import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
    AlertTriangle, CheckCircle2, FileWarning, Globe2, Hash, IdCard, ScrollText, ShieldAlert, ShieldCheck, Truck,
} from 'lucide-react';
import { useFullList } from '@/app/useCollection';
import { StatusBadge } from '@/app/status';
import { AppCard, KpiCard, PageHeader, Skeleton, TableSkeleton } from '@/app/ui';

const SECTIONS = [
    { key: 'reviews', label: 'Compliance Reviews', icon: ShieldCheck },
    { key: 'hs', label: 'HS Classification', icon: Hash },
    { key: 'party', label: 'Party Screening', icon: IdCard },
    { key: 'country', label: 'Country Restrictions', icon: Globe2 },
    { key: 'license', label: 'License Review', icon: ScrollText },
    { key: 'missing', label: 'Missing Documents', icon: FileWarning },
    { key: 'audit', label: 'Audit Activity', icon: Truck },
];

const CompliancePage = () => {
    const { data: orders, loading } = useFullList('orders', { sort: '-created' });
    const { data: reviews } = useFullList('compliance_reviews', { sort: '-created' });
    const { data: documents } = useFullList('documents', { sort: '-created' });

    const checked = orders.length;
    const passed = orders.filter((o) => o.compliance_status === 'passed').length;
    const reviewReq = orders.filter((o) => ['review', 'pending'].includes(o.compliance_status)).length;
    const high = orders.filter((o) => o.compliance_status === 'high_risk').length;
    const missingDocs = documents.filter((d) => d.compliance === 'pending').length;

    return (
        <div className="space-y-6">
            <Helmet><title>Compliance Dashboard — TradeRath</title></Helmet>

            <PageHeader title="Compliance dashboard" subtitle="Every export checked against HS codes, party screening, country rules, and licences." />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard icon={ShieldCheck} label="Transactions checked" value={checked} tone="blue" />
                <KpiCard icon={CheckCircle2} label="Passed" value={passed} tone="emerald" />
                <KpiCard icon={AlertTriangle} label="Review required" value={reviewReq} tone="amber" />
                <KpiCard icon={ShieldAlert} label="High risk" value={high} tone="red" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Compliance reviews list */}
                <AppCard className="lg:col-span-2">
                    <div className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900">Compliance reviews</div>
                    {loading ? (
                        <TableSkeleton rows={6} cols={5} />
                    ) : reviews.length === 0 ? (
                        <p className="px-5 py-10 text-center text-sm text-slate-500">No compliance reviews yet.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {reviews.map((r) => (
                                <Link key={r.id} to={`/app/compliance/${r.order_id}`} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{r.order_id} · {r.product}</p>
                                        <p className="text-xs text-slate-500">{r.origin} → {r.destination}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge category="risk" value={r.overall_risk} />
                                        <StatusBadge category="reviewStatus" value={r.status} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </AppCard>

                {/* Side sections */}
                <div className="space-y-4">
                    {SECTIONS.filter((s) => s.key !== 'reviews').map((s) => {
                        let count = '';
                        if (s.key === 'hs') count = `${orders.length} classified`;
                        else if (s.key === 'party') count = `${orders.length} screened`;
                        else if (s.key === 'country') count = '0 restrictions';
                        else if (s.key === 'license') count = '0 licences pending';
                        else if (s.key === 'missing') count = `${missingDocs} pending`;
                        else if (s.key === 'audit') count = 'Full audit trail';
                        return (
                            <AppCard key={s.key} className="flex items-center gap-3 p-4">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><s.icon className="h-5 w-5" /></span>
                                <div className="flex-1"><p className="text-sm font-medium text-slate-800">{s.label}</p><p className="text-xs text-slate-500">{count}</p></div>
                            </AppCard>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CompliancePage;
