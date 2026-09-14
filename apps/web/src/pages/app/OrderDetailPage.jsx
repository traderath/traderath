import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
    ArrowLeft, CheckCircle2, Circle, FileText, Package, ShieldCheck, Sparkles, Truck, Wallet,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useOneByFilter, useFullList } from '@/app/useCollection';
import { StatusBadge } from '@/app/status';
import { AppCard, EmptyState, Skeleton, formatMoney, formatDate } from '@/app/ui';

const TABS = ['Overview', 'Products', 'Documents', 'Compliance', 'Shipment', 'Payments', 'Activity', 'AI Insights'];

const PROGRESS = [
    { key: 'order', label: 'Order' },
    { key: 'documents', label: 'Documents' },
    { key: 'compliance', label: 'Compliance' },
    { key: 'shipment', label: 'Shipment' },
    { key: 'payment', label: 'Payment' },
    { key: 'completed', label: 'Completed' },
];

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const filter = pb.filter('order_id = {:id}', { id: orderId });
    const { record: order, loading } = useOneByFilter('orders', filter, orderId);
    const { data: documents } = useFullList('documents', { filter: pb.filter('transaction = {:id}', { id: orderId }) }, orderId);
    const { data: shipment } = useFullList('shipments', { filter: pb.filter('order_id = {:id}', { id: orderId }) }, orderId);
    const { data: payment } = useFullList('payments', { filter: pb.filter('order_id = {:id}', { id: orderId }) }, orderId);
    const { data: review } = useFullList('compliance_reviews', { filter: pb.filter('order_id = {:id}', { id: orderId }) }, orderId);
    const [tab, setTab] = useState('Overview');

    if (loading) {
        return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-64 w-full" /></div>;
    }
    if (!order) {
        return (
            <EmptyState
                icon={Package}
                title="Order not found"
                description="This export order does not exist or you do not have access to it."
                action={<Link to="/app/orders" className="text-blue-600 hover:text-blue-700">Back to orders</Link>}
            />
        );
    }

    const progressState = (key) => {
        if (key === 'order') return 'done';
        if (key === 'documents') return documents.length > 0 ? 'done' : 'current';
        if (key === 'compliance') {
            if (order.compliance_status === 'passed') return 'done';
            if (order.compliance_status === 'high_risk') return 'current';
            return 'current';
        }
        if (key === 'shipment') {
            if (order.shipment_status === 'delivered') return 'done';
            if (order.shipment_status === 'in_transit') return 'current';
            return order.shipment_status === 'not_started' ? 'todo' : 'current';
        }
        if (key === 'payment') {
            if (order.payment_status === 'paid') return 'done';
            if (order.payment_status === 'overdue') return 'current';
            return order.payment_status === 'unpaid' ? 'todo' : 'current';
        }
        if (key === 'completed') return order.status === 'completed' ? 'done' : 'todo';
        return 'todo';
    };

    const shp = shipment[0];
    const pmt = payment[0];
    const rev = review[0];

    return (
        <div className="space-y-6">
            <Helmet><title>{order.order_id} — TradeRath</title></Helmet>

            <Link to="/app/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
                <ArrowLeft className="h-4 w-4" /> Back to orders
            </Link>

            <AppCard className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{order.order_id}</h1>
                            <StatusBadge category="order" value={order.status} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{order.customer} · {order.country}</p>
                        <p className="mt-1 text-sm text-slate-500">{order.origin} → {order.destination}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-2xl font-semibold text-slate-900">{formatMoney(order.value, order.currency)}</p>
                        <p className="text-sm text-slate-500">Incoterm {order.incoterm} · {formatDate(order.order_date)}</p>
                    </div>
                </div>

                {/* Progress tracker */}
                <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {PROGRESS.map((p) => {
                        const st = progressState(p.key);
                        return (
                            <div key={p.key} className="flex flex-col items-center gap-1.5 text-center">
                                {st === 'done' ? (
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                ) : st === 'current' ? (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">●</span>
                                ) : (
                                    <Circle className="h-6 w-6 text-slate-300" />
                                )}
                                <span className={`text-xs font-medium ${st === 'done' ? 'text-slate-700' : st === 'current' ? 'text-blue-700' : 'text-slate-400'}`}>{p.label}</span>
                            </div>
                        );
                    })}
                </div>
            </AppCard>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-slate-200">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`-mb-px border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                            tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <AppCard className="p-5">
                {tab === 'Overview' && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Info label="Product" value={order.product} />
                        <Info label="Origin" value={order.origin} />
                        <Info label="Destination" value={order.destination} />
                        <Info label="Order date" value={formatDate(order.order_date)} />
                        <Info label="Incoterm" value={order.incoterm} />
                        <Info label="Order value" value={formatMoney(order.value, order.currency)} />
                        <Info label="Shipment" value={<StatusBadge category="shipment" value={order.shipment_status} />} />
                        <Info label="Payment" value={<StatusBadge category="payment" value={order.payment_status} />} />
                        <Info label="Compliance" value={<StatusBadge category="compliance" value={order.compliance_status} />} />
                    </div>
                )}
                {tab === 'Products' && (
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                                <tr><th className="px-4 py-2.5 font-medium">Product</th><th className="px-4 py-2.5 font-medium">Quantity</th><th className="px-4 py-2.5 font-medium">Unit value</th><th className="px-4 py-2.5 font-medium">Total</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr><td className="px-4 py-3 text-slate-700">{order.product}</td><td className="px-4 py-3 text-slate-600">1 lot</td><td className="px-4 py-3 text-slate-600">{formatMoney(order.value, order.currency)}</td><td className="px-4 py-3 font-medium text-slate-800">{formatMoney(order.value, order.currency)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {tab === 'Documents' && (
                    <div className="divide-y divide-slate-100">
                        {documents.length === 0 && <p className="py-6 text-sm text-slate-500">No documents linked to this order yet.</p>}
                        {documents.map((d) => (
                            <div key={d.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-slate-400" />
                                    <div><p className="text-sm font-medium text-slate-800">{d.name}</p><p className="text-xs text-slate-500">{d.type.replace(/_/g, ' ')}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge category="verification" value={d.verification} />
                                    <StatusBadge category="docCompliance" value={d.compliance} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {tab === 'Compliance' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-600">Overall risk</p>
                            <StatusBadge category="risk" value={rev?.overall_risk || 'low'} />
                        </div>
                        {(rev?.checks || []).map((c, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                                <span className="text-sm text-slate-700">{c.name}</span>
                                <StatusBadge category="check" value={c.status} />
                            </div>
                        ))}
                        <Link to={`/app/compliance/${order.order_id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                            <ShieldCheck className="h-4 w-4" /> Open full compliance review
                        </Link>
                    </div>
                )}
                {tab === 'Shipment' && shp && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Info label="Origin port" value={shp.origin_port} />
                        <Info label="Destination port" value={shp.destination_port} />
                        <Info label="Carrier" value={shp.carrier} />
                        <Info label="Freight forwarder" value={shp.forwarder} />
                        <Info label="Container" value={shp.container} />
                        <Info label="BL / AWB" value={shp.bl_awb} />
                        <Info label="ETD" value={formatDate(shp.etd)} />
                        <Info label="ETA" value={formatDate(shp.eta)} />
                        <Info label="Status" value={<StatusBadge category="shipment" value={shp.status} />} />
                        <div className="sm:col-span-2 lg:col-span-3">
                            <Link to={`/app/shipments/${order.order_id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                                <Truck className="h-4 w-4" /> Open shipment detail
                            </Link>
                        </div>
                    </div>
                )}
                {tab === 'Shipment' && !shp && <p className="py-6 text-sm text-slate-500">No shipment record yet.</p>}
                {tab === 'Payments' && pmt && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Info label="Invoice amount" value={formatMoney(pmt.invoice_amount, pmt.currency)} />
                        <Info label="Received" value={formatMoney(pmt.received, pmt.currency)} />
                        <Info label="Outstanding" value={formatMoney(pmt.outstanding, pmt.currency)} />
                        <Info label="Overdue" value={formatMoney(pmt.overdue, pmt.currency)} />
                        <Info label="Due date" value={formatDate(pmt.due_date)} />
                        <Info label="Status" value={<StatusBadge category="payment" value={pmt.status} />} />
                    </div>
                )}
                {tab === 'Payments' && !pmt && <p className="py-6 text-sm text-slate-500">No payment record yet.</p>}
                {tab === 'Activity' && (
                    <ul className="space-y-3 text-sm">
                        <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-blue-500" /><div><p className="font-medium text-slate-800">Order created</p><p className="text-xs text-slate-500">{formatDate(order.order_date)}</p></div></li>
                        <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-slate-300" /><div><p className="font-medium text-slate-800">Documents uploaded</p><p className="text-xs text-slate-500">{documents.length} document(s)</p></div></li>
                        <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-slate-300" /><div><p className="font-medium text-slate-800">Compliance review initiated</p><p className="text-xs text-slate-500">TradeRath AI</p></div></li>
                    </ul>
                )}
                {tab === 'AI Insights' && (
                    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
                        <div className="flex items-center gap-2 text-blue-700"><Sparkles className="h-5 w-5" /><p className="font-semibold">TradeRath AI insights</p></div>
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                            <li>• HS classification proposed with 92% confidence — awaiting broker confirmation.</li>
                            <li>• Counterparty screen returned clear across 120+ lists.</li>
                            <li>• Preferential origin documentation would reduce duty to 0% under the EU FTA.</li>
                            <li>• Payment realization tracking suggests follow-up 7 days before ETA.</li>
                        </ul>
                    </div>
                )}
            </AppCard>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div className="rounded-lg border border-slate-200 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <div className="mt-1 text-sm font-medium text-slate-800">{value || '—'}</div>
    </div>
);

export default OrderDetailPage;
