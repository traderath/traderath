import React from 'react';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import TradeRathLogo from '@/components/TradeRathLogo';

const COLS = [
    {
        title: 'Solutions',
        links: [
            { label: 'Material Sourcing', href: '#services' },
            { label: 'Export Coordination', href: '#services' },
            { label: 'Global Logistics', href: '#services' },
            { label: 'Documentation', href: '#services' },
            { label: 'Partner Network', href: '#services' },
        ],
    },
    {
        title: 'Materials',
        links: [
            { label: 'Metals & Minerals', href: '#materials' },
            { label: 'Chemicals', href: '#materials' },
            { label: 'Construction Materials', href: '#materials' },
            { label: 'Industrial Raw Materials', href: '#materials' },
            { label: 'View All Materials', href: '#materials' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '#about' },
            { label: 'Our Network', href: '#network' },
            { label: 'Careers', href: '#contact' },
            { label: 'News & Insights', href: '#process' },
            { label: 'Contact', href: '#contact' },
        ],
    },
];

const SiteFooter = () => (
    <footer className="bg-[#062B5C] text-white">
        <div className="tr-container py-14 md:py-16">
            <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-3">
                    <TradeRathLogo variant="light" showTagline size="lg" />
                </div>

                {COLS.map((col) => (
                    <div key={col.title} className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                        <ul className="mt-4 space-y-2.5">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-white/60 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="lg:col-span-3">
                    <h3 className="text-sm font-semibold text-white">Stay Ahead in Global Trade</h3>
                    <p className="mt-2 text-sm text-white/55">
                        Get updates on market insights, new material opportunities, and TradeRath news.
                    </p>
                    <form
                        className="mt-4 flex gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <input
                            type="email"
                            required
                            placeholder="Your email address"
                            className="h-11 flex-1 rounded-full border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#0878F9]"
                        />
                        <button
                            type="submit"
                            className="h-11 shrink-0 rounded-full bg-[#0878F9] px-5 text-sm font-semibold text-white hover:bg-[#0666d6]"
                        >
                            Subscribe
                        </button>
                    </form>
                    <div className="mt-6 flex items-center gap-3">
                        {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                            <a
                                key={i}
                                href="#contact"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                                aria-label="Social"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
                <p className="text-xs uppercase tracking-[0.12em] text-white/45">
                    From Supplier to Buyer.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-white/45">
                    <a href="#contact" className="hover:text-white/80">
                        Privacy
                    </a>
                    <a href="#contact" className="hover:text-white/80">
                        Terms
                    </a>
                    <a href="#contact" className="hover:text-white/80">
                        Sitemap
                    </a>
                    <span>© 2025 TradeRath. All rights reserved.</span>
                </div>
            </div>
        </div>
    </footer>
);

export default SiteFooter;
