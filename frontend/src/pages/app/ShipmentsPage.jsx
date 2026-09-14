import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Truck } from 'lucide-react';
import { useFullList } from '@/app/useCollection';
import { StatusBadge } from '@/app/status';
import { AppCard, EmptyState, PageHeader, TableSkeleton, formatDate } from '@/app/ui';

const ShipmentsPage = () => {
    const { data: shipments, loading } = useFullList('shipments', { sort: '-created' });

    return (
        <div className="space-y-6">
            <Helmet><title>Shipments — TradeRath</title></Helmet>

            <PageHeader title="Shipments" subtitle="Every shipment in motion, with carrier, container, and milestone status." />

            <AppCard>
                {loading ? (
                    <TableSkeleton rows={7} cols={6} />
                ) : shipments.length === 0 ? (
                    <EmptyState icon={Truck} title="No shipments yet." description="Shipments appear here once an order is booked with a carrier." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-4 py-3 font-medium">Order</th>
                                    <th className="px-4 py-3 font-medium">Route</th>
                                    <th className="px-4 py-3 font-medium">Carrier</th>
                                    <th className="px-4 py-3 font-medium">Container</th>
                                    <th className="px-4 py-3 font-medium">ETD</th>
                                    <th className="px-4 py-3 font-medium">ETA</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {shipments.map((s) => (
                                    <tr key={s.id} className="transition-colors hover:bg-slate-50">
                                        <td className="px-4 py-3"><Link to={`/app/shipments/${s.order_id}`} className="font-medium text-blue-600 hover:text-blue-700">{s.order_id}</Link></td>
                                        <td className="px-4 py-3 text-slate-600">{s.origin_port} → {s.destination_port}</td>
                                        <td className="px-4 py-3 text-slate-600">{s.carrier || '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{s.container || '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{formatDate(s.etd)}</td>
                                        <td className="px-4 py-3 text-slate-600">{formatDate(s.eta)}</td>
                                        <td className="px-4 py-3"><StatusBadge category="shipment" value={s.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AppCard>
        </div>
    );
};

export default ShipmentsPage;
