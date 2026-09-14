import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Globe2, Menu, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import TradeRathLogo from '@/components/TradeRathLogo';

const NAV_LINKS = [
    { label: 'Solutions', href: '#services', hasMenu: true },
    { label: 'Materials', href: '#materials', hasMenu: true },
    { label: 'Global Network', href: '#network' },
    { label: 'About', href: '#about' },
    { label: 'Resources', href: '#process', hasMenu: true },
    { label: 'Contact', href: '#contact' },
];

const SiteHeader = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-[height,box-shadow] duration-200',
                scrolled ? 'border-[#DDE6F0] shadow-sm shadow-[#062B5C]/5' : 'border-[#DDE6F0]',
            )}
        >
            <div
                className={cn(
                    'tr-container flex items-center justify-between gap-4 transition-[height] duration-200',
                    scrolled ? 'h-[64px]' : 'h-[76px]',
                )}
            >
                <a href="#top" className="shrink-0" aria-label="TradeRath home">
                    {/* Desktop / tablet horizontal logo */}
                    <span className="hidden sm:block">
                        <TradeRathLogo
                            showTagline={!scrolled}
                            size={scrolled ? 'sticky' : 'lg'}
                        />
                    </span>
                    {/* Mobile: compact circular TR mark */}
                    <span className="block sm:hidden">
                        <TradeRathLogo compact size="md" />
                    </span>
                </a>

                <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="inline-flex items-center gap-1 text-[14px] font-medium text-[#062B5C]/85 transition-colors hover:text-[#0878F9]"
                        >
                            {link.label}
                            {link.hasMenu && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        className="hidden h-10 w-10 items-center justify-center rounded-full text-[#607089] transition-colors hover:bg-[#F7FAFC] xl:inline-flex"
                        aria-label="Search"
                    >
                        <Search className="h-4.5 w-4.5" />
                    </button>
                    <a
                        href="#contact"
                        className="hidden items-center rounded-full border border-[#DDE6F0] px-4 py-2 text-sm font-semibold text-[#062B5C] transition-colors hover:border-[#0878F9] hover:text-[#0878F9] md:inline-flex"
                    >
                        Request a Quote
                    </a>
                    <a
                        href="/login"
                        className="group hidden items-center gap-1.5 rounded-full bg-[#0878F9] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:bg-[#0666d6] md:inline-flex"
                    >
                        Get Started
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                    <button
                        type="button"
                        className="hidden items-center gap-1.5 rounded-full px-2 py-2 text-sm font-medium text-[#607089] lg:inline-flex"
                        aria-label="Language"
                    >
                        <Globe2 className="h-4 w-4" />
                        EN
                        <ChevronDown className="h-3 w-3" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDE6F0] text-[#062B5C] lg:hidden"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <div
                className={cn(
                    'overflow-hidden border-t border-[#DDE6F0] bg-white transition-[max-height] duration-300 ease-out lg:hidden',
                    open ? 'max-h-[480px]' : 'max-h-0 border-t-0',
                )}
            >
                <nav className="flex flex-col px-5 py-3" aria-label="Mobile">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="border-b border-[#DDE6F0] py-3 text-sm font-medium text-[#062B5C]"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        onClick={() => setOpen(false)}
                        className="mt-3 rounded-full border border-[#DDE6F0] px-4 py-3 text-center text-sm font-semibold text-[#062B5C]"
                    >
                        Request a Quote
                    </a>
                    <a
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="mt-2 rounded-full bg-[#0878F9] px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                        Get Started
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default SiteHeader;
