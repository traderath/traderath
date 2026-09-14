import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, CheckCircle2, FileText, Ship, Truck } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useOneByFilter, useFullList } from '@/app/useCollection';
import { StatusBadge } from '@/app/status';
import { AppCard, EmptyState, Skeleton, formatDate } from '@/app/ui';

const STEP_LABELS = {
    booking_confirmed: 'Booking Confirmed',
    documents_ready: 'Documents Ready',
    customs_cleared: 'Customs Cleared',
    departed: 'Departed',
    in_transit: 'In Transit',
    arrived: 'Arrived',
    delivered: 'Delivered',
};

const ShipmentDetailPage = () => {
    const { orderId } = useParams();
    const filter = pb.filter('order_id = {:id}', { id: orderId });
    const { record: shipment, loading } = useOneByFilter('shipments', filter, orderId);
    const { data: documents } = useFullList('documents', { filter: pb.filter('transaction = {:id}', { id: orderId }) }, orderId);

    if (loading) return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-64 w-full" /></div>;
    if (!shipment) {
        return (
            <EmptyState
                icon={Truck}
                title="Shipment not found"
                description="This shipment does not exist or you do not have access to it."
                action={<Link to="/app/shipments" className="text-blue-600 hover:text-blue-700">Back to shipments</Link>}
            />
        );
    }

    const timeline = shipment.timeline || [];

    return (
        <div className="space-y-6">
            <Helmet><title>Shipment {shipment.order_id} — TradeRath</title></Helmet>

            <Link to="/app/shipments" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
                <ArrowLeft className="h-4 w-4" /> Back to shipments
            </Link>

            <AppCard className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{shipment.order_id}</h1>
                        <p className="mt-1 text-sm text-slate-500">{shipment.origin_port} → {shipment.destination_port}</p>
                    </div>
                    <StatusBadge category="shipment" value={shipment.status} />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Info label="Origin port" value={shipment.origin_port} />
                    <Info label="Destination port" value={shipment.destination_port} />
                    <Info label="Carrier" value={shipment.carrier} />
                    <Info label="Freight forwarder" value={shipment.forwarder} />
                    <Info label="Container" value={shipment.container} />
                    <Info label="BL / AWB" value={shipment.bl_awb} />
                    <Info label="ETD" value={formatDate(shipment.etd)} />
                    <Info label="ETA" value={formatDate(shipment.eta)} />
                </div>
            </AppCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <AppCard className="p-5 lg:col-span-2">
                    <h2 className="text-sm font-semibold text-slate-900">Shipment timeline</h2>
                    <ol className="mt-5 space-y-0">
                        {timeline.map((t, i) => (
                            <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                                {i < timeline.length - 1 && <span className="absolute left-3 top-6 h-full w-px bg-slate-200" />}
                                <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                    t.status === 'done' ? 'bg-emerald-500 text-white' : t.status === 'current' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                                }`}>
                                    {t.status === 'done' ? <CheckCircle2 className="h-4 w-4" /> : t.status === 'current' ? <Ship className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
                                </span>
                                <div>
                                    <p className={`text-sm font-medium ${t.status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>{STEP_LABELS[t.step] || t.step}</p>
                                    <p className="text-xs text-slate-500">{t.date ? formatDate(t.date) : t.status === 'current' ? 'In progress' : 'Pending'}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </AppCard>

                <AppCard className="p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Related documents</h2>
                    <div className="mt-4 divide-y divide-slate-100">
                        {documents.length === 0 && <p className="text-sm text-slate-500">No documents linked.</p>}
                        {documents.map((d) => (
                            <div key={d.id} className="flex items-center gap-3 py-3">
                                <FileText className="h-4.5 w-4.5 text-slate-400" />
                                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{d.name}</p><p className="text-xs text-slate-500">{d.type.replace(/_/g, ' ')}</p></div>
                                <StatusBadge category="verification" value={d.verification} />
                            </div>
                        ))}
                    </div>
                </AppCard>
            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div className="rounded-lg border border-slate-200 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">{value || '—'}</p>
    </div>
);

export default ShipmentDetailPage;
