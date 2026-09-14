import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
    ArrowRight,
    Box,
    CheckCircle2,
    FileText,
    Globe2,
    Loader2,
    Network,
    Search,
    Settings2,
    ShieldCheck,
    Ship,
    Truck,
    Users,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import pb from '@/lib/pocketbaseClient';

const HERO_SHIP = 'https://images.hostinger.com/54e80ebb-cba6-4849-a26e-5e6fbb1b8c4f.png';
const TESTIMONIAL_AVATAR = 'https://images.hostinger.com/405ca35a-0209-496f-b3ef-046fefc2d67c.png';

const MATERIALS = [
    {
        title: 'Aluminium & Non-Ferrous Metals',
        img: 'https://images.hostinger.com/ac477bf8-2b2c-4bc8-baf1-708abd0a9589.png',
    },
    {
        title: 'Steel & Raw Materials',
        img: 'https://images.hostinger.com/77985724-497a-4c6b-9330-c16195a94cb2.png',
    },
    {
        title: 'Chemicals & Petrochemicals',
        img: 'https://images.hostinger.com/ea30ddeb-dd95-4a47-b8be-0d81cbf0ede3.png',
    },
    {
        title: 'Construction Materials',
        img: 'https://images.hostinger.com/826ab767-258c-46fc-8ae1-012608f84657.png',
    },
    {
        title: 'Minerals & Ores',
        img: 'https://images.hostinger.com/60cc7c49-16c5-4254-a845-0f383d51485f.png',
    },
];

const SERVICES = [
    {
        icon: Box,
        title: 'Material Sourcing',
        desc: 'Access reliable global supply chains for a wide range of industrial materials.',
    },
    {
        icon: Ship,
        title: 'Export Coordination',
        desc: 'Manage complex export processes with compliance and efficiency.',
    },
    {
        icon: Truck,
        title: 'Global Logistics',
        desc: 'End-to-end logistics solutions by sea, air, and land.',
    },
    {
        icon: FileText,
        title: 'Documentation & Compliance',
        desc: 'Hassle-free trade documentation and regulatory support.',
    },
    {
        icon: Users,
        title: 'Trusted Partner Network',
        desc: 'A global network of vetted suppliers, buyers, and logistics partners.',
    },
];

const STEPS = [
    {
        n: '01',
        title: 'Understand Your Needs',
        desc: 'We analyze your material requirements and goals.',
        icon: Search,
    },
    {
        n: '02',
        title: 'Source & Validate',
        desc: 'We find the right suppliers and ensure quality.',
        icon: CheckCircle2,
    },
    {
        n: '03',
        title: 'Coordinate & Ship',
        desc: 'We manage logistics, documentation, and compliance.',
        icon: Ship,
    },
    {
        n: '04',
        title: 'Deliver Value',
        desc: 'Your materials arrive safely, on time, anywhere in the world.',
        icon: ShieldCheck,
    },
];

const LOGOS = ['ArcelorMittal', 'RioTinto', 'BASF', 'ADNOC', 'GLENCORE', 'vedanta', 'Cargill', 'POSCO'];

const HomePage = () => {
    const [tracking, setTracking] = useState('');
    const [form, setForm] = useState({
        company: '',
        email: '',
        phone: '',
        message: '',
        service_interest: 'Material Sourcing',
    });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');
        try {
            await pb.collection('enquiries').create({
                company: form.company,
                email: form.email,
                phone: form.phone,
                message: form.message,
                service_interest: form.service_interest,
            });
            setStatus('success');
            setForm({
                company: '',
                email: '',
                phone: '',
                message: '',
                service_interest: 'Material Sourcing',
            });
        } catch (err) {
            setStatus('error');
            setError(
                "We couldn't submit your enquiry right now. Please try again, or email us directly at info@traderath.com.",
            );
        }
    };

    return (
        <div id="top" className="min-h-screen bg-[#F7FAFC] text-[#10233F]">
            <Helmet>
                <title>TradeRath — From Supplier to Buyer.</title>
                <meta
                    name="description"
                    content="TradeRath sources, exports, and delivers industrial materials worldwide through trusted partnerships, efficient logistics, and technology."
                />
            </Helmet>

            <SiteHeader />

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#F7FAFC] to-white">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 70% 40%, rgba(31,94,255,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(19,184,178,0.08), transparent 40%)',
                    }}
                />
                <div className="tr-container relative grid items-center gap-10 pb-16 pt-10 lg:grid-cols-2 lg:gap-8 lg:pb-20 lg:pt-14">
                    <Reveal>
                        <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#607089]">
                            <span>Global Materials</span>
                            <span className="text-[#10BFC7]">•</span>
                            <span>Export Solutions</span>
                            <span className="text-[#10BFC7]">•</span>
                            <span>Logistics</span>
                        </p>
                        <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[#062B5C] sm:text-5xl lg:text-[3.25rem]">
                            From Supplier to Buyer.{' '}
                            <span className="text-[#0878F9]">Connect Markets.</span>{' '}
                            Deliver Globally.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#607089] sm:text-lg">
                            We source, export, and deliver industrial materials worldwide through trusted
                            partnerships, efficient logistics, and technology.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#contact"
                                className="group inline-flex items-center gap-2 rounded-full bg-[#0878F9] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#0666d6]"
                            >
                                Get a Quote
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </a>
                            <a
                                href="#services"
                                className="inline-flex items-center gap-2 rounded-full border border-[#DDE6F0] bg-white px-6 py-3 text-sm font-semibold text-[#062B5C] transition hover:border-[#0878F9] hover:text-[#0878F9]"
                            >
                                Explore Our Services
                            </a>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-6 text-sm text-[#607089]">
                            {[
                                { icon: Globe2, t: 'Global Reach', s: 'International trade lanes' },
                                { icon: ShieldCheck, t: 'Trusted Partners', s: 'Long-term relationships' },
                                { icon: Settings2, t: 'End-to-End Support', s: 'From sourcing to delivery' },
                            ].map((item) => (
                                <div key={item.t} className="flex items-start gap-2.5">
                                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#0878F9]/10 text-[#0878F9]">
                                        <item.icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-[#062B5C]">{item.t}</p>
                                        <p className="text-xs text-[#607089]">{item.s}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={0.12} className="relative">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/15">
                            <img
                                src={HERO_SHIP}
                                alt="Container ship at port delivering industrial materials"
                                className="h-full max-h-[420px] w-full object-cover lg:max-h-[480px]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#062B5C]/50 via-transparent to-transparent" />
                            <div className="absolute left-4 top-4 rounded-xl border border-white/30 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
                                <p className="flex items-center gap-2 text-xs font-semibold text-[#062B5C]">
                                    <span className="h-2 w-2 rounded-full bg-[#10BFC7]" />
                                    Trusted Global Trade Partner
                                </p>
                                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#607089]">
                                    Sourcing · Exporting · Logistics
                                </p>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                                <div className="rounded-xl bg-[#062B5C]/85 px-3 py-2 text-white backdrop-blur-sm">
                                    <p className="text-[10px] uppercase tracking-wider text-white/70">
                                        Materials move the world.
                                    </p>
                                    <p className="text-sm font-semibold">We make it happen.</p>
                                </div>
                                <div className="grid grid-cols-4 gap-2 rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur-sm">
                                    {[
                                        { v: '100+', l: 'Countries' },
                                        { v: '1,000+', l: 'Clients' },
                                        { v: '5M+', l: 'Tonnes Moved' },
                                        { v: '99%', l: 'On-Time' },
                                    ].map((s) => (
                                        <div key={s.l} className="min-w-[56px] px-1 text-center">
                                            <p className="text-sm font-bold text-[#0878F9]">{s.v}</p>
                                            <p className="text-[9px] font-medium uppercase tracking-wide text-[#607089]">
                                                {s.l}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* decorative network dots */}
                        <svg
                            className="pointer-events-none absolute -left-6 top-8 hidden h-40 w-48 text-[#0878F9]/40 lg:block"
                            viewBox="0 0 200 160"
                            fill="none"
                            aria-hidden
                        >
                            <path d="M10 120 C60 40, 120 30, 190 50" stroke="currentColor" strokeDasharray="4 4" />
                            <circle cx="20" cy="110" r="4" fill="#0878F9" />
                            <circle cx="90" cy="48" r="4" fill="#10BFC7" />
                            <circle cx="160" cy="42" r="4" fill="#0878F9" />
                        </svg>
                    </Reveal>
                </div>
            </section>

            {/* CORE SERVICES */}
            <section id="services" className="border-t border-[#DDE6F0] bg-white py-16 md:py-20">
                <div className="tr-container">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0878F9]">
                                Our Core Services
                            </p>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#062B5C] md:text-3xl">
                                End-to-end industrial materials trade
                            </h2>
                        </div>
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0878F9] hover:underline"
                        >
                            View All Services <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {SERVICES.map((s, i) => (
                            <Reveal key={s.title} delay={i * 0.05}>
                                <article className="group flex h-full flex-col rounded-2xl border border-[#DDE6F0] bg-[#F7FAFC] p-5 transition hover:border-[#0878F9]/40 hover:bg-white hover:shadow-lg hover:shadow-blue-600/5">
                                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0878F9] shadow-sm ring-1 ring-[#DDE6F0] group-hover:bg-[#0878F9] group-hover:text-white group-hover:ring-transparent">
                                        <s.icon className="h-5 w-5" strokeWidth={1.8} />
                                    </span>
                                    <h3 className="text-base font-semibold text-[#062B5C]">{s.title}</h3>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#607089]">{s.desc}</p>
                                    <a
                                        href="#contact"
                                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0878F9]"
                                    >
                                        Learn More <ArrowRight className="h-3.5 w-3.5" />
                                    </a>
                                </article>
                            </Reveal>
                        ))}
                    </div>

                    {/* Track shipment strip */}
                    <Reveal className="mt-10 overflow-hidden rounded-2xl border border-[#dbe7ff] bg-gradient-to-r from-[#eef4ff] to-white">
                        <div className="grid items-center gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
                            <div>
                                <div className="flex items-center gap-2 text-[#0878F9]">
                                    <Truck className="h-5 w-5" />
                                    <h3 className="text-lg font-bold text-[#062B5C]">Track Your Shipment</h3>
                                </div>
                                <p className="mt-1 text-sm text-[#607089]">
                                    Get real-time updates on your cargo anywhere in the world.
                                </p>
                                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                    <input
                                        value={tracking}
                                        onChange={(e) => setTracking(e.target.value)}
                                        placeholder="Enter tracking number (e.g. TR12345678)"
                                        className="h-11 flex-1 rounded-full border border-[#d0d7e2] bg-white px-4 text-sm outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/20"
                                    />
                                    <a
                                        href="/login"
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0878F9] px-5 text-sm font-semibold text-white hover:bg-[#0666d6]"
                                    >
                                        Track Shipment <ArrowRight className="h-4 w-4" />
                                    </a>
                                </div>
                                <a
                                    href="/login"
                                    className="mt-3 inline-block text-sm font-medium text-[#0878F9] hover:underline"
                                >
                                    View a Sample Tracking Journey →
                                </a>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* MATERIALS */}
            <section id="materials" className="bg-[#F7FAFC] py-16 md:py-20">
                <div className="tr-container">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0878F9]">
                                Featured Material Categories
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-[#062B5C] md:text-3xl">
                                Industrial materials that move the world
                            </h2>
                        </div>
                        <a href="#contact" className="text-sm font-semibold text-[#0878F9] hover:underline">
                            Explore All Materials →
                        </a>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {MATERIALS.map((m, i) => (
                            <Reveal key={m.title} delay={i * 0.04}>
                                <a
                                    href="#contact"
                                    className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#DDE6F0]"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={m.img}
                                            alt={m.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#062B5C]/90 to-transparent p-4 pt-12">
                                        <p className="text-sm font-semibold text-white">
                                            {m.title}{' '}
                                            <span className="inline-block transition group-hover:translate-x-0.5">
                                                →
                                            </span>
                                        </p>
                                    </div>
                                </a>
                            </Reveal>
                        ))}
                    </div>

                    {/* Impact + banner */}
                    <div id="network" className="mt-12 grid gap-4 lg:grid-cols-2">
                        <Reveal>
                            <div className="rounded-2xl border border-[#DDE6F0] bg-white p-6 md:p-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0878F9]">
                                    Our Impact in Numbers
                                </p>
                                <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
                                    {[
                                        { icon: Globe2, v: 100, s: '+', l: 'Countries Served' },
                                        { icon: Users, v: 1000, s: '+', l: 'Global Clients' },
                                        { icon: Ship, v: 5, s: 'M+', l: 'Tonnes of Materials' },
                                        { icon: ShieldCheck, v: 99, s: '%', l: 'On-Time Delivery' },
                                    ].map((stat) => (
                                        <div key={stat.l} className="text-center sm:text-left">
                                            <stat.icon className="mx-auto mb-2 h-5 w-5 text-[#0878F9] sm:mx-0" />
                                            <p className="text-2xl font-bold text-[#062B5C]">
                                                <CountUp value={stat.v} suffix={stat.s} />
                                            </p>
                                            <p className="mt-1 text-xs text-[#607089]">{stat.l}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <div className="relative flex min-h-[200px] overflow-hidden rounded-2xl bg-[#062B5C] p-6 md:p-8">
                                <div
                                    className="absolute inset-0 opacity-40"
                                    style={{
                                        backgroundImage:
                                            'radial-gradient(circle at 80% 50%, #0878F9 0%, transparent 55%)',
                                    }}
                                />
                                <div className="relative z-10 flex flex-col justify-center">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#10BFC7]">
                                        People · Materials · Partnerships · Progress
                                    </p>
                                    <h3 className="mt-3 max-w-md text-2xl font-bold leading-snug text-white">
                                        A Stronger Tomorrow Through Global Partnerships.
                                    </h3>
                                    <div className="mt-4 h-1 w-12 rounded-full bg-[#10BFC7]" />
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* HOW WE WORK */}
            <section id="process" className="border-t border-[#DDE6F0] bg-white py-16 md:py-20">
                <div className="tr-container">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0878F9]">
                                How We Work
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-[#062B5C] md:text-3xl">Our Process</h2>
                        </div>
                        <a href="#contact" className="text-sm font-semibold text-[#0878F9] hover:underline">
                            Our Process →
                        </a>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                        {STEPS.map((step, i) => (
                            <Reveal key={step.n} delay={i * 0.06}>
                                <div className="relative rounded-2xl border border-[#DDE6F0] bg-[#F7FAFC] p-5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-[#0878F9]/30">{step.n}</span>
                                        <step.icon className="h-5 w-5 text-[#0878F9]" />
                                    </div>
                                    <h3 className="mt-3 font-semibold text-[#062B5C]">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#607089]">{step.desc}</p>
                                    {i < STEPS.length - 1 && (
                                        <span className="absolute -right-2 top-1/2 hidden text-[#c5d0e0] md:block">
                                            ›
                                        </span>
                                    )}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIAL + LOGOS */}
            <section id="about" className="bg-[#F7FAFC] py-16 md:py-20">
                <div className="tr-container grid gap-8 lg:grid-cols-2">
                    <Reveal>
                        <div className="rounded-2xl border border-[#DDE6F0] bg-white p-6 md:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0878F9]">
                                What Our Clients Say
                            </p>
                            <blockquote className="mt-6 text-lg leading-relaxed text-[#062B5C] md:text-xl">
                                “TradeRath has been a reliable partner in our global supply chain. Their
                                professionalism, transparency, and ability to deliver on time set them apart.”
                            </blockquote>
                            <div className="mt-6 flex items-center gap-3">
                                <img
                                    src={TESTIMONIAL_AVATAR}
                                    alt="James Carter"
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#DDE6F0]"
                                />
                                <div>
                                    <p className="font-semibold text-[#062B5C]">James Carter</p>
                                    <p className="text-sm text-[#607089]">
                                        Procurement Director, Global Manufacturing Co.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <div className="rounded-2xl border border-[#DDE6F0] bg-white p-6 md:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0878F9]">
                                Trusted by Industry Leaders
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {LOGOS.map((name) => (
                                    <div
                                        key={name}
                                        className="flex h-14 items-center justify-center rounded-xl border border-[#DDE6F0] bg-[#F7FAFC] px-2 text-center text-xs font-bold uppercase tracking-wide text-[#062B5C]/45"
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="border-t border-[#DDE6F0] bg-white py-16 md:py-20">
                <div className="tr-container grid gap-10 lg:grid-cols-2">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0878F9]">
                            Request a Quote
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#062B5C]">
                            Let’s move materials together.
                        </h2>
                        <p className="mt-4 max-w-md text-[#607089]">
                            Tell us what you need to source, export, or deliver. Our team responds within one
                            business day.
                        </p>
                        <ul className="mt-8 space-y-3 text-sm text-[#607089]">
                            {[
                                'Dedicated export managers',
                                'Multi-lane logistics coordination',
                                'Full documentation & compliance support',
                            ].map((t) => (
                                <li key={t} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-[#10BFC7]" />
                                    {t}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 flex items-center gap-2 text-sm text-[#607089]">
                            <Network className="h-4 w-4 text-[#0878F9]" />
                            Already a partner?{' '}
                            <a href="/login" className="font-semibold text-[#0878F9] hover:underline">
                                Sign in to the platform
                            </a>
                        </div>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <form
                            onSubmit={onSubmit}
                            className="rounded-2xl border border-[#DDE6F0] bg-[#F7FAFC] p-6 shadow-sm md:p-8"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        required
                                        value={form.company}
                                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                                        className="rounded-xl border-[#d0d7e2] bg-white"
                                        placeholder="Your company name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Work email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                        className="rounded-xl border-[#d0d7e2] bg-white"
                                        placeholder="you@company.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={form.phone}
                                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                        className="rounded-xl border-[#d0d7e2] bg-white"
                                        placeholder="+1 …"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="interest">Service interest</Label>
                                    <select
                                        id="interest"
                                        value={form.service_interest}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, service_interest: e.target.value }))
                                        }
                                        className="flex h-10 w-full rounded-xl border border-[#d0d7e2] bg-white px-3 text-sm outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/20"
                                    >
                                        {SERVICES.map((s) => (
                                            <option key={s.title}>{s.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="message">How can we help?</Label>
                                    <Textarea
                                        id="message"
                                        required
                                        rows={4}
                                        value={form.message}
                                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                        className="rounded-xl border-[#d0d7e2] bg-white"
                                        placeholder="Materials, volumes, origin/destination…"
                                    />
                                </div>
                            </div>
                            {status === 'success' && (
                                <p className="mt-4 text-sm font-medium text-[#10BFC7]">
                                    Thank you — we received your enquiry and will be in touch shortly.
                                </p>
                            )}
                            {status === 'error' && (
                                <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0878F9] text-sm font-semibold text-white hover:bg-[#0666d6] disabled:opacity-70"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                                    </>
                                ) : (
                                    <>
                                        Submit enquiry <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </Reveal>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default HomePage;
