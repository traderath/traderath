import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
    BarChart3, DollarSign, FileText, Globe2, Package, ShieldCheck, Truck, Users,
} from 'lucide-react';
import {
    Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import { useFullList } from '@/app/useCollection';
import { AppCard, AppSelect, KpiCard, PageHeader, formatMoney } from '@/app/ui';

const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const EXPORT_VALUE = [180, 210, 195, 240, 290, 320, 350];
const ORDER_COUNT = [4, 5, 5, 6, 7, 8, 8];

const DONUT_COLORS = ['#2563eb', '#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

const AnalyticsPage = () => {
    const { data: orders } = useFullList('orders', { sort: '-created' });
    const { data: documents } = useFullList('documents', { sort: '-created' });
    const { data: payments } = useFullList('payments', { sort: '-created' });
    const { data: shipments } = useFullList('shipments', { sort: '-created' });

    const [country, setCountry] = useState('all');
    const [status, setCountry2] = useState('all');

    const countries = useMemo(() => Array.from(new Set(orders.map((o) => o.country).filter(Boolean))), [orders]);

    const filtered = useMemo(() => orders.filter((o) => (country === 'all' || o.country === country)), [orders, country]);

    const totalValue = filtered.reduce((s, o) => s + (o.value || 0), 0);
    const customers = new Set(filtered.map((o) => o.customer)).size;
    const products = new Set(filtered.map((o) => o.product).filter(Boolean)).size;

    const byCountry = useMemo(() => {
        const map = {};
        filtered.forEach((o) => { map[o.country] = (map[o.country] || 0) + (o.value || 0); });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [filtered]);

    const complianceSplit = [
        { name: 'Passed', value: orders.filter((o) => o.compliance_status === 'passed').length },
        { name: 'Review', value: orders.filter((o) => o.compliance_status === 'review' || o.compliance_status === 'pending').length },
        { name: 'High Risk', value: orders.filter((o) => o.compliance_status === 'high_risk').length },
    ];

    const lineData = MONTHS.map((m, i) => ({ month: m, value: EXPORT_VALUE[i], orders: ORDER_COUNT[i] }));

    return (
        <div className="space-y-6">
            <Helmet><title>Analytics — TradeRath</title></Helmet>

            <PageHeader
                title="Trade analytics"
                subtitle="Export value, orders, shipments, compliance, and payments — across countries and customers."
                actions={
                    <>
                        <AppSelect value={country} onChange={(e) => setCountry(e.target.value)} className="w-44">
                            <option value="all">All countries</option>
                            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                        </AppSelect>
                        <AppSelect value={status} onChange={(e) => setCountry2(e.target.value)} className="w-40">
                            <option value="all">All statuses</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                        </AppSelect>
                    </>
                }
            />

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <KpiCard icon={DollarSign} label="Export value" value={formatMoney(totalValue)} tone="blue" />
                <KpiCard icon={Package} label="Orders" value={filtered.length} tone="indigo" />
                <KpiCard icon={Truck} label="Shipments" value={shipments.length} tone="sky" />
                <KpiCard icon={Globe2} label="Countries" value={countries.length} tone="emerald" />
                <KpiCard icon={Users} label="Customers" value={customers} tone="blue" />
                <KpiCard icon={FileText} label="Documents" value={documents.length} tone="amber" />
                <KpiCard icon={ShieldCheck} label="Compliance passed" value={complianceSplit[0].value} tone="emerald" />
                <KpiCard icon={DollarSign} label="Received" value={formatMoney(payments.reduce((s, p) => s + (p.received || 0), 0))} tone="indigo" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <AppCard className="p-5 lg:col-span-2">
                    <h2 className="text-sm font-semibold text-slate-900">Export value trend</h2>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} name="Export value ($k)" />
                                <Line type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </AppCard>

                <AppCard className="p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Compliance split</h2>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={complianceSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                                    {complianceSplit.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex justify-center gap-4 text-xs">
                        {complianceSplit.map((c, i) => (
                            <span key={c.name} className="flex items-center gap-1.5 text-slate-600">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} /> {c.name}
                            </span>
                        ))}
                    </div>
                </AppCard>
            </div>

            <AppCard className="p-5">
                <h2 className="text-sm font-semibold text-slate-900">Export value by country</h2>
                <div className="mt-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={byCountry} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} name="Export value" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </AppCard>
        </div>
    );
};

export default AnalyticsPage;
