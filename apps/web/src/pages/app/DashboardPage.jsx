import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock,
    Package,
    ShieldAlert,
    Truck,
    Wallet,
} from 'lucide-react';
import { useFullList } from '@/app/useCollection';
import { StatusBadge } from '@/app/status';
import {
    AppCard,
    EmptyState,
    KpiCard,
    PageHeader,
    PrimaryButton,
    TableSkeleton,
    formatMoney,
    formatDate,
} from '@/app/ui';

const DashboardPage = () => {
    const { data: orders, loading } = useFullList('orders', { sort: '-created' });
    const { data: payments } = useFullList('payments', { sort: '-created' });

    const activeOrders = orders.filter((o) => !['completed', 'draft'].includes(o.status)).length;
    const inTransit = orders.filter((o) => o.shipment_status === 'in_transit').length;
    const review = orders.filter((o) => ['review', 'pending'].includes(o.compliance_status)).length;
    const outstanding = payments.reduce((sum, p) => sum + (p.outstanding || 0), 0);

    const attention = orders
        .filter((o) => o.compliance_status === 'high_risk' || o.payment_status === 'overdue' || o.compliance_status === 'review')
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <Helmet>
                <title>Dashboard — TradeRath</title>
            </Helmet>

            <PageHeader
                title="Export operations overview"
                subtitle="Where your exports stand, and what needs your attention today."
                actions={
                    <Link to="/app/orders">
                        <PrimaryButton>
                            <Package className="h-4 w-4" /> Create Export Order
                        </PrimaryButton>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard icon={Package} label="Active orders" value={activeOrders} sub="In progress this cycle" tone="blue" />
                <KpiCard icon={Truck} label="In transit" value={inTransit} sub="Shipments moving now" tone="indigo" />
                <KpiCard icon={ShieldAlert} label="Compliance review" value={review} sub="Awaiting clearance" tone="amber" />
                <KpiCard icon={Wallet} label="Outstanding" value={formatMoney(outstanding)} sub="Receivables pending" tone="red" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <AppCard className="lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h2 className="text-sm font-semibold text-slate-900">Recent export orders</h2>
                        <Link to="/app/orders" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                            View all <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    {loading ? (
                        <TableSkeleton rows={5} cols={6} />
                    ) : orders.length === 0 ? (
                        <EmptyState
                            icon={Package}
                            title="No export orders yet."
                            description="Create your first export order to start managing your trade workflow."
                            action={<Link to="/app/orders"><PrimaryButton>Create Export Order</PrimaryButton></Link>}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                                        <th className="px-5 py-3 font-medium">Order</th>
                                        <th className="px-5 py-3 font-medium">Customer</th>
                                        <th className="px-5 py-3 font-medium">Value</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">Compliance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.slice(0, 6).map((o) => (
                                        <tr key={o.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-5 py-3">
                                                <Link to={`/app/orders/${o.order_id}`} className="font-medium text-blue-600 hover:text-blue-700">
                                                    {o.order_id}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-3 text-slate-700">{o.customer}</td>
                                            <td className="px-5 py-3 text-slate-700">{formatMoney(o.value, o.currency)}</td>
                                            <td className="px-5 py-3"><StatusBadge category="order" value={o.status} /></td>
                                            <td className="px-5 py-3"><StatusBadge category="compliance" value={o.compliance_status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AppCard>

                <AppCard>
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="text-sm font-semibold text-slate-900">Needs attention</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {attention.length === 0 && (
                            <div className="flex items-center gap-3 px-5 py-6 text-sm text-slate-500">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Nothing needs action right now.
                            </div>
                        )}
                        {attention.map((o) => (
                            <Link
                                key={o.id}
                                to={`/app/orders/${o.order_id}`}
                                className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                            >
                                {o.compliance_status === 'high_risk' ? (
                                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                ) : o.payment_status === 'overdue' ? (
                                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                ) : (
                                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-900">{o.order_id} · {o.customer}</p>
                                    <p className="truncate text-xs text-slate-500">
                                        {o.compliance_status === 'high_risk'
                                            ? 'High-risk compliance flag — escalate'
                                            : o.payment_status === 'overdue'
                                                ? 'Payment overdue'
                                                : 'Compliance review required'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </AppCard>
            </div>
        </div>
    );
};

export default DashboardPage;
