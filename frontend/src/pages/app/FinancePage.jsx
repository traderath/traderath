import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Wallet } from 'lucide-react';
import { useFullList } from '@/app/useCollection';
import { StatusBadge } from '@/app/status';
import { AppCard, KpiCard, PageHeader, TableSkeleton, formatMoney, formatDate } from '@/app/ui';

const FinancePage = () => {
    const { data: payments, loading } = useFullList('payments', { sort: '-created' });

    const totals = useMemo(() => {
        const invoiced = payments.reduce((s, p) => s + (p.invoice_amount || 0), 0);
        const received = payments.reduce((s, p) => s + (p.received || 0), 0);
        const outstanding = payments.reduce((s, p) => s + (p.outstanding || 0), 0);
        const overdue = payments.reduce((s, p) => s + (p.overdue || 0), 0);
        return { invoiced, received, outstanding, overdue };
    }, [payments]);

    const aging = [
        { bucket: 'Current (not due)', amount: payments.filter((p) => p.status !== 'overdue').reduce((s, p) => s + (p.outstanding || 0), 0) },
        { bucket: '1–30 days', amount: payments.filter((p) => p.status === 'overdue').reduce((s, p) => s + (p.overdue || 0) * 0.4, 0) },
        { bucket: '31–60 days', amount: payments.filter((p) => p.status === 'overdue').reduce((s, p) => s + (p.overdue || 0) * 0.35, 0) },
        { bucket: '60+ days', amount: payments.filter((p) => p.status === 'overdue').reduce((s, p) => s + (p.overdue || 0) * 0.25, 0) },
    ];
    const maxAging = Math.max(...aging.map((a) => a.amount), 1);

    const upcoming = payments.filter((p) => p.status !== 'paid').slice(0, 5);
    const recent = payments.filter((p) => (p.received || 0) > 0).slice(0, 5);

    const currencyExposure = useMemo(() => {
        const map = {};
        payments.forEach((p) => { map[p.currency] = (map[p.currency] || 0) + (p.outstanding || 0); });
        return Object.entries(map).map(([currency, amount]) => ({ currency, amount }));
    }, [payments]);

    return (
        <div className="space-y-6">
            <Helmet><title>Finance — Export Receivables — TradeRath</title></Helmet>

            <PageHeader title="Export receivables" subtitle="Track invoiced exports, realized payments, and outstanding receivables — not investment software." />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard icon={Wallet} label="Total invoiced" value={formatMoney(totals.invoiced)} tone="blue" />
                <KpiCard icon={CheckCircle2} label="Received" value={formatMoney(totals.received)} tone="emerald" />
                <KpiCard icon={Clock} label="Outstanding" value={formatMoney(totals.outstanding)} tone="amber" />
                <KpiCard icon={AlertCircle} label="Overdue" value={formatMoney(totals.overdue)} tone="red" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Receivables aging */}
                <AppCard className="p-5 lg:col-span-2">
                    <h2 className="text-sm font-semibold text-slate-900">Receivables aging</h2>
                    <div className="mt-5 space-y-4">
                        {aging.map((a) => (
                            <div key={a.bucket}>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{a.bucket}</span>
                                    <span className="font-medium text-slate-800">{formatMoney(a.amount)}</span>
                                </div>
                                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${(a.amount / maxAging) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </AppCard>

                {/* Currency exposure */}
                <AppCard className="p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Currency exposure</h2>
                    <div className="mt-4 space-y-3">
                        {currencyExposure.map((c) => (
                            <div key={c.currency} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5">
                                <span className="text-sm font-medium text-slate-700">{c.currency}</span>
                                <span className="text-sm text-slate-600">{formatMoney(c.amount, c.currency)}</span>
                            </div>
                        ))}
                    </div>
                </AppCard>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AppCard>
                    <div className="border-b border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-900">Upcoming payments</div>
                    {loading ? <TableSkeleton rows={4} cols={4} /> : (
                        <div className="divide-y divide-slate-100">
                            {upcoming.length === 0 && <p className="px-5 py-6 text-sm text-slate-500">No upcoming payments.</p>}
                            {upcoming.map((p) => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                                    <div><p className="text-sm font-medium text-slate-800">{p.order_id} · {p.customer}</p><p className="text-xs text-slate-500">Due {formatDate(p.due_date)}</p></div>
                                    <div className="text-right"><p className="text-sm font-medium text-slate-800">{formatMoney(p.outstanding, p.currency)}</p><StatusBadge category="payment" value={p.status} /></div>
                                </div>
                            ))}
                        </div>
                    )}
                </AppCard>

                <AppCard>
                    <div className="border-b border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-900">Recent payments received</div>
                    {loading ? <TableSkeleton rows={4} cols={4} /> : (
                        <div className="divide-y divide-slate-100">
                            {recent.length === 0 && <p className="px-5 py-6 text-sm text-slate-500">No payments received yet.</p>}
                            {recent.map((p) => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                                    <div className="flex items-center gap-2.5"><TrendingUp className="h-4.5 w-4.5 text-emerald-500" /><div><p className="text-sm font-medium text-slate-800">{p.order_id} · {p.customer}</p><p className="text-xs text-slate-500">Realized</p></div></div>
                                    <p className="text-sm font-medium text-emerald-600">+{formatMoney(p.received, p.currency)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </AppCard>
            </div>

            <AppCard className="p-5">
                <h2 className="text-sm font-semibold text-slate-900">Realization status</h2>
                <p className="mt-1 text-xs text-slate-500">Export receivable realization tracking — aligned with your bank's EDPMS / export realization cycle.</p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Fully realized</p><p className="mt-1 text-lg font-semibold text-emerald-600">{payments.filter((p) => p.status === 'paid').length}</p></div>
                    <div className="rounded-lg border border-slate-200 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Partially realized</p><p className="mt-1 text-lg font-semibold text-blue-600">{payments.filter((p) => p.status === 'partial').length}</p></div>
                    <div className="rounded-lg border border-slate-200 p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Awaiting realization</p><p className="mt-1 text-lg font-semibold text-amber-600">{payments.filter((p) => p.status === 'unpaid' || p.status === 'overdue').length}</p></div>
                </div>
            </AppCard>
        </div>
    );
};

export default FinancePage;
