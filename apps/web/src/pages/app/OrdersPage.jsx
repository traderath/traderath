import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Eye, Package, Plus, Search, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useFullList, owner } from '@/app/useCollection';
import { StatusBadge } from '@/app/status';
import {
    AppCard,
    AppInput,
    EmptyState,
    PageHeader,
    PrimaryButton,
    SecondaryButton,
    TableSkeleton,
    formatMoney,
    formatDate,
} from '@/app/ui';

const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'ready_to_ship', label: 'Ready to Ship' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'completed', label: 'Completed' },
];

const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {children}
    </div>
);

const CreateOrderModal = ({ open, onClose, onCreated }) => {
    const [form, setForm] = useState({
        order_id: '', customer: '', country: '', origin: '', destination: '',
        value: '', currency: 'USD', incoterm: 'FOB', product: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await pb.collection('orders').create({
                ...form,
                value: Number(form.value) || 0,
                status: 'draft',
                shipment_status: 'not_started',
                payment_status: 'unpaid',
                compliance_status: 'pending',
                owner: owner(),
            });
            onCreated();
            onClose();
        } catch (err) {
            setError('Could not create the order. Please check the details and try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
            <AppCard className="relative w-full max-w-lg p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Create export order</h3>
                    <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={submit} className="mt-4 grid grid-cols-2 gap-4">
                    <Field label="Order ID"><AppInput required value={form.order_id} onChange={update('order_id')} placeholder="EXP-1032" /></Field>
                    <Field label="Customer"><AppInput required value={form.customer} onChange={update('customer')} placeholder="Buyer name" /></Field>
                    <Field label="Product"><AppInput value={form.product} onChange={update('product')} placeholder="Product" /></Field>
                    <Field label="Country"><AppInput value={form.country} onChange={update('country')} placeholder="Destination country" /></Field>
                    <Field label="Origin"><AppInput value={form.origin} onChange={update('origin')} placeholder="Mumbai" /></Field>
                    <Field label="Destination"><AppInput value={form.destination} onChange={update('destination')} placeholder="Hamburg" /></Field>
                    <Field label="Value"><AppInput type="number" value={form.value} onChange={update('value')} placeholder="75000" /></Field>
                    <Field label="Currency">
                        <select className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" value={form.currency} onChange={update('currency')}>
                            <option>USD</option><option>EUR</option><option>GBP</option>
                        </select>
                    </Field>
                    <Field label="Incoterm">
                        <select className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" value={form.incoterm} onChange={update('incoterm')}>
                            <option>FOB</option><option>CIF</option><option>EXW</option><option>CFR</option><option>DDP</option>
                        </select>
                    </Field>
                    {error && <p className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                    <div className="col-span-2 flex justify-end gap-2 pt-2">
                        <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit" loading={saving}>Create order</PrimaryButton>
                    </div>
                </form>
            </AppCard>
        </div>
    );
};

const OrdersPage = () => {
    const [filter, setFilter] = useState('all');
    const [query, setQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const { data: orders, loading, refresh } = useFullList('orders', { sort: '-created' });

    const filtered = useMemo(() => {
        return orders.filter((o) => {
            const matchesFilter = filter === 'all' || o.status === filter;
            const q = query.trim().toLowerCase();
            const matchesQuery = !q || o.order_id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || (o.country || '').toLowerCase().includes(q);
            return matchesFilter && matchesQuery;
        });
    }, [orders, filter, query]);

    return (
        <div className="space-y-6">
            <Helmet><title>Export Orders — TradeRath</title></Helmet>

            <PageHeader
                title="Export orders"
                subtitle="Every export transaction in one governed system of record."
                actions={<PrimaryButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Export Order</PrimaryButton>}
            />

            <AppCard>
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {FILTERS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    filter === f.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <AppInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders..." className="pl-9" />
                    </div>
                </div>

                {loading ? (
                    <TableSkeleton rows={7} cols={8} />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No export orders yet."
                        description="Create your first export order to start managing your trade workflow."
                        action={<PrimaryButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Export Order</PrimaryButton>}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-4 py-3 font-medium">Order ID</th>
                                    <th className="px-4 py-3 font-medium">Customer</th>
                                    <th className="px-4 py-3 font-medium">Country</th>
                                    <th className="px-4 py-3 font-medium">Order Date</th>
                                    <th className="px-4 py-3 font-medium">Value</th>
                                    <th className="px-4 py-3 font-medium">Incoterm</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Shipment</th>
                                    <th className="px-4 py-3 font-medium">Payment</th>
                                    <th className="px-4 py-3 font-medium">Compliance</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((o) => (
                                    <tr key={o.id} className="transition-colors hover:bg-slate-50">
                                        <td className="px-4 py-3"><Link to={`/app/orders/${o.order_id}`} className="font-medium text-blue-600 hover:text-blue-700">{o.order_id}</Link></td>
                                        <td className="px-4 py-3 text-slate-700">{o.customer}</td>
                                        <td className="px-4 py-3 text-slate-600">{o.country}</td>
                                        <td className="px-4 py-3 text-slate-600">{formatDate(o.order_date)}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{formatMoney(o.value, o.currency)}</td>
                                        <td className="px-4 py-3 text-slate-600">{o.incoterm}</td>
                                        <td className="px-4 py-3"><StatusBadge category="order" value={o.status} /></td>
                                        <td className="px-4 py-3"><StatusBadge category="shipment" value={o.shipment_status} /></td>
                                        <td className="px-4 py-3"><StatusBadge category="payment" value={o.payment_status} /></td>
                                        <td className="px-4 py-3"><StatusBadge category="compliance" value={o.compliance_status} /></td>
                                        <td className="px-4 py-3 text-right">
                                            <Link to={`/app/orders/${o.order_id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-600">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AppCard>

            <CreateOrderModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={refresh} />
        </div>
    );
};

export default OrdersPage;
