import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
    ArrowLeft, CheckCircle2, FileText, MessageSquarePlus, Send, ShieldAlert, ShieldCheck, TrendingUp,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useOneByFilter } from '@/app/useCollection';
import { StatusBadge } from '@/app/status';
import { AppCard, EmptyState, PrimaryButton, SecondaryButton, Skeleton } from '@/app/ui';

const ComplianceReviewPage = () => {
    const { orderId } = useParams();
    const filter = pb.filter('order_id = {:id}', { id: orderId });
    const { record: review, loading } = useOneByFilter('compliance_reviews', filter, orderId);
    const [note, setNote] = useState('');
    const [history, setHistory] = useState([
        { action: 'Review initiated', actor: 'TradeRath AI', time: '2026-09-08 09:12' },
        { action: 'HS classification proposed', actor: 'TradeRath AI', time: '2026-09-08 09:13' },
        { action: 'Party screening completed', actor: 'A. Sharma', time: '2026-09-08 10:40' },
    ]);

    const addNote = () => {
        if (!note.trim()) return;
        setHistory((h) => [{ action: note.trim(), actor: 'You', time: new Date().toISOString().slice(0, 16).replace('T', ' ') }, ...h]);
        setNote('');
    };

    if (loading) return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-64 w-full" /></div>;
    if (!review) {
        return (
            <EmptyState
                icon={ShieldCheck}
                title="Compliance review not found"
                description="This review does not exist or you do not have access to it."
                action={<Link to="/app/compliance" className="text-blue-600 hover:text-blue-700">Back to compliance</Link>}
            />
        );
    }

    const checks = review.checks || [];

    return (
        <div className="space-y-6">
            <Helmet><title>Compliance Review {review.order_id} — TradeRath</title></Helmet>

            <Link to="/app/compliance" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
                <ArrowLeft className="h-4 w-4" /> Back to compliance
            </Link>

            <AppCard className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{review.order_id}</h1>
                        <p className="mt-1 text-sm text-slate-500">{review.product} · {review.origin} → {review.destination}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wide text-slate-400">Overall risk</p>
                            <div className="mt-1"><StatusBadge category="risk" value={review.overall_risk} /></div>
                        </div>
                        <StatusBadge category="reviewStatus" value={review.status} />
                    </div>
                </div>
            </AppCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Compliance checks</h2>
                    {checks.map((c, i) => (
                        <AppCard key={i} className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2.5">
                                    {c.status === 'passed' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : c.status === 'failed' ? <ShieldAlert className="h-5 w-5 text-red-500" /> : <TrendingUp className="h-5 w-5 text-amber-500" />}
                                    <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                                </div>
                                <StatusBadge category="check" value={c.status} />
                            </div>
                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div><p className="text-xs uppercase tracking-wide text-slate-400">Evidence</p><p className="mt-0.5 text-sm text-slate-700">{c.evidence}</p></div>
                                <div><p className="text-xs uppercase tracking-wide text-slate-400">Reason</p><p className="mt-0.5 text-sm text-slate-700">{c.reason}</p></div>
                                <div><p className="text-xs uppercase tracking-wide text-slate-400">Confidence</p><p className="mt-0.5 text-sm text-slate-700">{Math.round((c.confidence || 0) * 100)}%</p></div>
                                <div><p className="text-xs uppercase tracking-wide text-slate-400">Reviewer</p><p className="mt-0.5 text-sm text-slate-700">{c.reviewer}</p></div>
                                <div><p className="text-xs uppercase tracking-wide text-slate-400">Last checked</p><p className="mt-0.5 text-sm text-slate-700">{c.lastChecked}</p></div>
                            </div>
                        </AppCard>
                    ))}
                </div>

                <div className="space-y-4">
                    <AppCard className="p-5">
                        <h3 className="text-sm font-semibold text-slate-900">Actions</h3>
                        <div className="mt-3 space-y-2">
                            <PrimaryButton className="w-full"><CheckCircle2 className="h-4 w-4" /> Approve Review</PrimaryButton>
                            <SecondaryButton className="w-full"><MessageSquarePlus className="h-4 w-4" /> Request Information</SecondaryButton>
                            <SecondaryButton className="w-full"><ShieldAlert className="h-4 w-4" /> Escalate</SecondaryButton>
                        </div>
                    </AppCard>

                    <AppCard className="p-5">
                        <h3 className="text-sm font-semibold text-slate-900">Add note</h3>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            placeholder="Add an audit note…"
                            className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <SecondaryButton className="mt-2 w-full" onClick={addNote}><Send className="h-4 w-4" /> Add to audit history</SecondaryButton>
                    </AppCard>

                    <AppCard className="p-5">
                        <h3 className="text-sm font-semibold text-slate-900">Audit history</h3>
                        <ul className="mt-3 space-y-3 text-sm">
                            {history.map((h, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                    <div><p className="font-medium text-slate-800">{h.action}</p><p className="text-xs text-slate-500">{h.actor} · {h.time}</p></div>
                                </li>
                            ))}
                        </ul>
                    </AppCard>
                </div>
            </div>
        </div>
    );
};

export default ComplianceReviewPage;
