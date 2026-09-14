import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TradeRathLogo from '@/components/TradeRathLogo';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/app');
        } catch (err) {
            setError('We could not sign you in. Please check your email and password, then try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Helmet>
                <title>Sign in — TradeRath</title>
                <meta name="description" content="Sign in to your TradeRath export operations workspace." />
            </Helmet>

            <div className="flex w-full flex-col items-center justify-center px-5 py-10">
                <div className="w-full max-w-sm">
                    <Link to="/" className="mb-8 inline-flex">
                        <TradeRathLogo showTagline size="sm" />
                    </Link>

                    <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
                        <p className="mt-1 text-sm text-slate-500">Sign in to your export operations workspace.</p>

                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
                            </button>
                        </form>

                        <div className="mt-5 rounded-lg bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
                            <p className="font-medium text-slate-600">Demo account</p>
                            <p className="mt-0.5">Use credentials supplied by your administrator.</p>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        New to TradeRath?{' '}
                        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
