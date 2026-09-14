import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Bell,
    FileText,
    GitCompare,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    ShieldCheck,
    Sparkles,
    Truck,
    Wallet,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { TradeRathMark } from '@/components/TradeRathLogo';

const NAV = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/shipments', label: 'Shipments', icon: Truck },
    { to: '/app/orders', label: 'Orders', icon: Package },
    { to: '/app/documents', label: 'Documents', icon: FileText },
    { to: '/app/ai-extraction', label: 'AI Extraction', icon: Sparkles },
    { to: '/app/comparison', label: 'Comparison', icon: GitCompare },
    { to: '/app/compliance', label: 'Compliance', icon: ShieldCheck },
    { to: '/app/finance', label: 'Finance', icon: Wallet },
    { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
];

const SidebarContent = ({ onNavigate }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const displayName = user?.get?.('name') || user?.name || 'User';

    return (
        <div className="flex h-full flex-col bg-[#062B5C] text-white">
            <div className="flex h-[72px] items-center gap-2.5 border-b border-white/10 px-5">
                <TradeRathMark variant="light" className="h-9 w-9" />
                <div className="min-w-0 leading-tight">
                    <p className="truncate text-base font-bold tracking-tight">
                        Trade<span className="text-sky-300">Rath</span>
                    </p>
                    <p className="truncate text-[9px] font-medium uppercase tracking-[0.12em] text-white/50">
                        Global Materials. Stronger Tomorrows.
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {NAV.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-[#0878F9] text-white shadow-lg shadow-blue-600/30'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                            )
                        }
                    >
                        <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.9} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-white/10 p-3">
                <div className="mb-2 hidden rounded-xl bg-gradient-to-br from-[#132a4a] to-[#0a1a30] p-3 ring-1 ring-white/10 xl:block">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#10BFC7]">
                        Partnerships
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-snug text-white">
                        A stronger tomorrow through global partnerships.
                    </p>
                </div>
                <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0878F9]/30 text-sm font-semibold text-white ring-2 ring-white/10">
                        {displayName.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{displayName}</p>
                        <p className="truncate text-xs text-white/45">{user?.email || ''}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Log out"
                        title="Log out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
                <p className="mt-1 px-2 text-[10px] text-white/30">TradeRath · v1.0.0</p>
            </div>
        </div>
    );
};

const AppLayout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user } = useAuth();
    const displayName = user?.get?.('name') || user?.name || 'User';

    return (
        <div className="min-h-screen bg-[#F7FAFC] text-[#062B5C]">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] lg:block">
                <SidebarContent />
            </aside>

            {drawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-[#062B5C]/50" onClick={() => setDrawerOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-72 shadow-2xl">
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="lg:pl-[260px]">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#DDE6F0] bg-white/95 px-4 backdrop-blur md:px-6">
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DDE6F0] text-[#607089] lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="relative max-w-xl flex-1">
                        <input
                            type="text"
                            placeholder="Search shipments, materials, suppliers, or orders…"
                            className="h-10 w-full rounded-full border border-[#DDE6F0] bg-[#F7FAFC] pl-10 pr-12 text-sm text-[#062B5C] placeholder:text-[#98a2b3] focus:border-[#0878F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0878F9]/15"
                        />
                        <svg
                            className="absolute left-3.5 top-2.5 h-5 w-5 text-[#98a2b3]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <kbd className="absolute right-3 top-2 hidden rounded-md border border-[#DDE6F0] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#98a2b3] sm:inline">
                            ⌘ K
                        </kbd>
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#607089] hover:bg-[#F7FAFC]"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>
                        <div className="hidden h-8 w-px bg-[#DDE6F0] sm:block" />
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0878F9]/15 text-sm font-semibold text-[#0878F9]">
                                {displayName.slice(0, 1).toUpperCase()}
                            </span>
                            <div className="hidden leading-tight sm:block">
                                <p className="text-sm font-semibold text-[#062B5C]">{displayName}</p>
                                <p className="text-[11px] text-[#607089]">Export Manager</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
