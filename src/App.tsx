// src/App.tsx
// Marieb Site – Light Theme Full Integrated (Unified)
// One-page site with: Hero (terminal cursor), Recent Highlights,
// Workflow Studios, Solutions, Behind the Flow, Pricing, and the Engage Terminal
// wired to Formspree via VITE_FORM_ENDPOINT.

import React, { useEffect, useRef, useState } from 'react';

/* ===================== CONFIG ===================== */
// Use env if present, otherwise fall back to your Formspree endpoint
const ENDPOINT: string =
  (import.meta as any).env?.VITE_FORM_ENDPOINT ||
  'https://formspree.io/f/mykkzlvy';

/* ===================== UI PRIMITIVES ===================== */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'terminal' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50';

  const variants: Record<string, string> = {
    primary: 'bg-sky-600 text-white hover:bg-sky-500',
    outline: 'border border-slate-300 text-slate-900 hover:bg-slate-100 bg-transparent',
    ghost: 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:bg-slate-100',
    terminal: 'bg-emerald-600 text-white hover:bg-emerald-500 font-mono',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
  };

  const sizes: Record<string, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-6 py-3 text-base',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};
const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <label className={`block text-sm ${className}`}>
    {label && <span className="block mb-1 text-slate-700">{label}</span>}
    <input
      {...props}
      className={`w-full rounded-md bg-white border ${
        error ? 'border-rose-500' : 'border-slate-300'
      } px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400`}
    />
    {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
  </label>
);

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};
const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => (
  <label className={`block text-sm ${className}`}>
    {label && <span className="block mb-1 text-slate-700">{label}</span>}
    <textarea
      {...props}
      className={`w-full rounded-md bg-white border ${
        error ? 'border-rose-500' : 'border-slate-300'
      } px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400`}
    />
    {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
  </label>
);

type CardProps = React.HTMLAttributes<HTMLDivElement>;
const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);
const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

/* ===================== BRAND ===================== */
const MariebLogo: React.FC = () => (
  <a href="/" className="flex items-center" aria-label="Marieb home">
    <span className="font-semibold tracking-tight text-xl md:text-2xl text-slate-900">
      Marieb<span className="text-slate-500">.io</span>
    </span>
  </a>
);

/* ===================== WORKFLOW ICONS ===================== */
const WorkflowIcon: React.FC<{ type: string }> = ({ type }) => {
  if (type === 'PoolBrain') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-5 h-5"
      >
        <path d="M12 2C7 2 2 6 2 12s5 10 10 10 10-4 10-10S17 2 12 2z" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <path d="M9 10h.01M15 10h.01" />
      </svg>
    );
  }
  if (type === 'SignalFlow') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-5 h-5"
      >
        <circle cx="5" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
        <path d="M7 12h10" />
        <path d="M12 7v10" />
      </svg>
    );
  }
  if (type === 'InField') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-5 h-5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6v6H9z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-5 h-5"
    >
      <path d="M4 19h16M4 5h16M7 5v14M17 5v14" />
    </svg>
  );
};

/* ===================== SOLUTIONS DATA ===================== */
const SOLUTIONS = [
  {
    id: 'manufacturing',
    title: 'Manufacturing Integration',
    summary:
      'Optimize and augment machinery to maximize capability across production, QA, and maintenance.',
    detail:
      'We connect PLCs, sensors, and line software with AI agents that detect drift, reduce downtime, and tune parameters. Where beneficial, we retrofit machines with vision or edge compute for closed-loop improvements.',
    pillar: 'Construction & Engineering',
    icon: '🏭',
  },
  {
    id: 'marketing',
    title: 'Marketing & Creative',
    summary:
      'Generate and optimize blogs, ads, landing pages, email, and SEO in your brand’s voice.',
    detail:
      'AI keeps campaigns consistent and on-message. With a light PoolBrain.ai integration, content learns from past project results, seasonality, and product language—so every touchpoint feels authentic and current.',
    pillar: 'Customer & Market Insights',
    icon: '📈',
  },
  {
    id: 'sales',
    title: 'Sales Enablement',
    summary:
      'Domain-specifc outreach, decks, objection handling, and follow-ups connected to your CRM, with ai dashboards and bots.',
    detail:
      'Turn your pipeline into a living playbook. Emails and decks adapt to lead type and season, while PoolBrain.ai quietly surfaces patterns from wins, demos, and quotes.',
    pillar: 'Market & Economics',
    icon: '🤝',
  },
  {
    id: 'support',
    title: 'Customer Support & Success',
    summary:
      'Knowledge bases, smart FAQs, and custom ai chat representatives that stay on-brand and on-topic.',
    detail:
      'Summarize tickets, spot recurring issues, and draft proactive guidance. PoolBrain.ai logs insights so service and warranty teams get ahead of problems.',
    pillar: 'Service & Maintenance',
    icon: '🛟',
  },
  {
    id: 'product',
    title: 'Product Management',
    summary:
      'Turn raw notes and field reports into clear insights, release notes, and training.',
    detail:
      'Close the loop between field and factory. PoolBrain.ai correlates substrate, climate, and install feedback for better product decisions.',
    pillar: 'Construction & Engineering',
    icon: '🧩',
  },
  {
    id: 'hr',
    title: 'Human Resources & Recruiting',
    summary:
      'Faster JDs, offers, onboarding, and culture communications with consistent tone.',
    detail:
      'Standardize hiring while preserving your voice. PoolBrain.ai helps align training and policy docs with how your teams actually operate.',
    pillar: 'Workforce & Training',
    icon: '🧑‍💼',
  },
  {
    id: 'ops',
    title: 'Operations & Project Management',
    summary: 'Auto-written SOPs, daily logs, meeting notes, and live dashboard sync.',
    detail:
      'From excavation to fill day, status stays visible without extra admin. PoolBrain.ai adds historical context so schedules and budgets are evidence-based.',
    pillar: 'Construction & Logistics',
    icon: '🗂️',
  },
  {
    id: 'analytics',
    title: 'Data & Analytics',
    summary: 'Translate KPIs into narratives, visuals, and executive-ready summaries.',
    detail:
      'No data scientist required. PoolBrain.ai unifies sources (sales, weather, material usage) so every metric is traceable and decision-ready.',
    pillar: 'Market & Economics',
    icon: '📊',
  },
  {
    id: 'exec',
    title: 'Executive Communications',
    summary: 'Investor updates, press releases, and strategy briefs that stay precise.',
    detail:
      'Leadership messaging remains consistent and verifiable—grounded in current data flowing through PoolBrain.ai.',
    pillar: 'Regulatory & Strategy',
    icon: '🏛️',
  },
  {
    id: 'learning',
    title: 'Learning & Development',
    summary: 'Convert SOPs and manuals into micro-lessons, step-throughs, and quizzes.',
    detail:
      'Training reflects real installs. PoolBrain.ai enriches modules with examples from your successful jobs and verified outcomes.',
    pillar: 'Knowledge & Training',
    icon: '🎓',
  },
];

/* ===================== SOLUTIONS SECTION ===================== */
const SolutionsSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = rootRef.current as HTMLElement | null;
    if (!el) return;
    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      el.querySelectorAll('.reveal').forEach((n) =>
        n.classList.add('opacity-100', 'translate-y-0'),
      );
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            (e.target as HTMLElement).classList.add('opacity-100', 'translate-y-0');
        }),
      { threshold: 0.15 },
    );

    el.querySelectorAll('.reveal').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="solutions"
      ref={rootRef as any}
      className="relative py-16 md:py-24 px-6 bg-[radial-gradient(1200px_600px_at_20%_-10%,#e0f2fe_0%,transparent_60%),radial-gradient(1000px_500px_at_120%_0%,#f5f3ff_0%,transparent_60%)]"
      data-testid="solutions"
    >
      <header className="max-w-4xl mx-auto text-center space-y-4 reveal opacity-0 translate-y-3 transition">
        <span className="inline-block text-xs tracking-[0.18em] text-slate-700 border border-slate-200 rounded-full px-3 py-1 bg-white/60">
          SOLUTIONS
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
          Native AI for Swimming Pool and Outdoor Living Businesses
        </h2>
        <p className="text-slate-700 max-w-2xl mx-auto">
          We integrate an open ecosystem—Jasper, OpenAI, Gemini, Claude—on top of your systems. A
          light PoolBrain.ai layer quietly keeps teams aligned with what’s working in the factory,
          field, and office.
        </p>
      </header>

      <ul
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 max-w-6xl mx-auto mt-10"
      >
        {SOLUTIONS.map((s, idx) => (
          <li
            key={s.id}
            className="reveal opacity-0 translate-y-3 transition"
            style={{ transitionDelay: `${70 * (idx % 6)}ms` }}
          >
            <Card className="group hover:border-slate-300 hover:shadow-lg hover:shadow-sky-500/10">
              <button
                className="w-full text-left p-5 flex items-start gap-3"
                aria-expanded={openId === s.id}
                aria-controls={`panel-${s.id}`}
                onClick={() => setOpenId(openId === s.id ? null : s.id)}
              >
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 group-hover:bg-sky-100">
                  {s.icon}
                </span>
                <span className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{s.title}</strong>
                    <span
                      className={`ml-3 text-slate-500 transition-transform ${
                        openId === s.id ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </div>
                  <span className="inline-block text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5 mt-1">
                    {s.pillar}
                  </span>
                </span>
              </button>

              <div
                id={`panel-${s.id}`}
                role="region"
                className={`overflow-hidden transition-[max-height] duration-300 ${
                  openId === s.id ? 'max-h-80' : 'max-h-0'
                }`}
              >
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-800 mb-2">{s.summary}</p>
                  <p className="text-sm text-slate-600">{s.detail}</p>
                </CardContent>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <footer className="max-w-6xl mx-auto mt-8 flex flex-wrap items-center justify-start gap-2 reveal opacity-0 translate-y-3 transition">
        {['Open Ecosystem', 'In-Field AI™', 'SignalFlow™', 'PoolBrain.ai (light)'].map((chip) => (
          <span
            key={chip}
            className="text-xs text-slate-700 bg-white/70 border border-slate-200 rounded-full px-3 py-1"
          >
            {chip}
          </span>
        ))}
      </footer>
    </section>
  );
};

/* ===================== PRICING ===================== */
const PricingBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-xs text-sky-800 bg-sky-50 border border-sky-200 rounded-full px-2 py-0.5">
    {children}
  </span>
);

const PricingSection: React.FC = () => {
  const tiers = [
    {
      name: 'Fixed-Scope Project',
      tag: 'Discovery → Build → Deploy',
      blurb:
        'Great for a well-defined use case: roadmap, pilot, or integration with clear outcomes.',
      highlights: [
        'Pre-defined deliverables & milestones',
        'SOPs, docs, and handoff assets',
        'Integration with your existing stack',
      ],
      price: 'Project pricing',
      cta: 'Request Proposal',
    },
    {
      name: 'Strategic Retainer',
      tag: 'Continuous delivery & model upkeep',
      blurb: 'Ongoing access to consulting, iteration, monitoring, and measurable KPI improvements.',
      highlights: ['Reserved monthly hours', 'Quarterly strategy syncs', 'Model monitoring & updates'],
      price: 'Monthly retainer',
      featured: true,
      cta: 'Start Retainer',
    },
    {
      name: 'Starter Workshop',
      tag: '2–3 week sprint',
      blurb:
        'Hands-on working sessions to map high-ROI opportunities and an execution plan your team can run.',
      highlights: ['Use-case prioritization', 'Data & workflow audit', 'Pilot plan + timeline'],
      price: 'Flat fee',
      cta: 'Book Workshop',
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 md:py-24 px-6 bg-[radial-gradient(1100px_520px_at_-10%_-10%,#ecfeff_0%,transparent_55%),radial-gradient(900px_440px_at_120%_0%,#f5f3ff_0%,transparent_60%)]"
      data-testid="pricing"
    >
      <header className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-block text-xs tracking-[0.18em] text-slate-700 border border-slate-200 rounded-full px-3 py-1 mb-3 bg-white/60">
          PRICING
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
          Engagements that align with outcomes
        </h2>
        <p className="text-slate-700 mt-3">
          We price against value delivered—not hours spent. Choose a structure, then we tailor
          scope and KPIs to your goals.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tiers.map((t) => (
          <Card
            key={t.name}
            className={`relative ${
              t.featured ? 'border-sky-300 shadow-[0_10px_60px_-15px_rgba(56,189,248,0.25)]' : ''
            }`}
          >
            {t.featured && (
              <div className="absolute -top-3 right-3">
                <PricingBadge>Most Popular</PricingBadge>
              </div>
            )}
            <CardContent>
              <h3 className="text-xl font-semibold text-slate-900">{t.name}</h3>
              <p className="text-xs text-slate-600 mt-1">{t.tag}</p>
              <p className="text-sm text-slate-700 mt-4">{t.blurb}</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {t.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="text-sky-700">✔</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-slate-900 font-medium">{t.price}</span>
                <a href="#engage">
                  <Button variant={t.featured ? 'primary' : 'outline'} size="md">
                    {t.cta}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-10 text-slate-700 text-sm">
        <p>
          Need something different? We can combine a short Workshop to de-risk scope, then roll into
          a Retainer or Fixed-Scope build. We also support <span className="text-slate-900">co-selling</span>{' '}
          with manufacturers and channel partners.
        </p>
      </div>
    </section>
  );
};

/* ===================== HERO TERMINAL CURSOR ===================== */
const HeroCursor: React.FC = () => (
  <span aria-hidden="true" className="ml-3 inline-flex align-baseline font-mono text-emerald-600">
    <span className="text-[0.9em]">&gt;</span>
    <span className="hero-caret-blink inline-block w-[0.65em] text-[0.9em] translate-y-[1px]">
      _
    </span>
  </span>
);

/* ===================== ENGAGE TERMINAL HELPERS ===================== */
function validateEmail(v: string) {
  return /.+@.+\..+/.test(v);
}

// Rotating diagnostics line + flicker
const RotatingDiagnostics: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const phrases = [
    'SIGNALFLOW: COHERENT [NOISE→SIGNAL RATIO OPTIMAL]',
    'DOMAIN LINK: VERIFIED [INTEL STREAM ACTIVE]',
    'TELEMETRY FEED: GREEN [SIGFLOW STABLE]',
    'FIELD NODE: SYNCED [IN-FIELD AI™ OPERATIONAL]',
    'LINK STATUS: NOMINAL [OPEN ECOSYSTEM MODE]',
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="tracking-widest text-emerald-300/90 relative z-10 animate-[flicker_4s_infinite] transition-all duration-500">
      {phrases[index]}
    </span>
  );
};

/* ===================== ENGAGE ===================== */
const EngageTerminal: React.FC = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    friction: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = 'Required';
    if (!validateEmail(data.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;

    if (!ENDPOINT) {
      alert('Endpoint is not configured. Add VITE_FORM_ENDPOINT to .env.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          friction: data.friction,
        }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = { ok: res.ok, status: res.status };
      }

      const success = res.ok || json?.ok || json?.status === 'success' || json?.result === 'success';

      if (success) {
        setSubmitted(true);
      } else {
        throw new Error(json?.error || json?.message || `Submit failed (HTTP ${res.status})`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('There was an issue submitting your info. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

return (
  <section id="engage" className="py-14 md:py-20 px-6">
    <h3 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-slate-900">
      Engage
    </h3>

    <div className="max-w-3xl mx-auto">
      {/* Clean “terminal” panel that fits the light theme */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent>
          {/* Terminal Header */}
          <div className="font-mono text-slate-600 text-xs flex items-center justify-between mb-3">
            <span className="text-slate-600">/root/marieb/engage</span>
            <span className="text-slate-500">_ session: {new Date().toLocaleDateString()}</span>
          </div>

          {/* Status / diagnostics bar */}
          <div className="relative text-xs font-mono text-slate-700 mb-6 flex items-center gap-2 overflow-hidden rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
            {/* LED */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-500 shadow-[0_0_10px_2px_rgba(15,23,42,0.15)]"></span>
            </span>

            {/* Noise background (subtle) */}
            <div className="pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply text-[0.55rem] leading-none text-slate-500 whitespace-nowrap overflow-hidden">
              <div className="animate-[noiseScroll_16s_linear_infinite]">{'01∷ΔΛ⋄≋  '.repeat(40)}</div>
            </div>

            {/* Rotating diagnostics text */}
            <RotatingDiagnostics />

            {/* Soft sweep */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/20 to-transparent animate-[glitch_3s_infinite]"></span>
          </div>

          {!submitted ? (
            <form onSubmit={submit} className="font-mono text-slate-800 space-y-5">
              <label className="block">
                <span className="mr-2 text-slate-700">&gt; Name</span>
                <input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="bg-transparent outline-none border-b border-slate-300 focus:border-slate-600 text-slate-900 placeholder:text-slate-400 w-full py-1"
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
                {errors.name && <span className="block text-xs text-rose-600 mt-1">{errors.name}</span>}
              </label>

              <label className="block">
                <span className="mr-2 text-slate-700">&gt; Email</span>
                <input
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="bg-transparent outline-none border-b border-slate-300 focus:border-slate-600 text-slate-900 placeholder:text-slate-400 w-full py-1"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
                {errors.email && <span className="block text-xs text-rose-600 mt-1">{errors.email}</span>}
              </label>

              <label className="block">
                <span className="mr-2 text-slate-700">&gt; Explain your friction point(s)</span>
                <textarea
                  value={data.friction}
                  onChange={(e) => setData({ ...data, friction: e.target.value })}
                  className="bg-transparent outline-none border-b border-slate-300 focus:border-slate-600 text-slate-900 placeholder:text-slate-400 w-full min-h-[120px] py-1"
                  placeholder="Write as much as you want — what's causing friction, breaking, or needs growth?"
                />
              </label>

              <div className="pt-2 flex items-center justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-slate-800">
              <div className="text-slate-700 font-mono mb-2">&gt; Submission received</div>
              <p className="text-slate-600">Thanks, {data.name}. We’ll reach out via email.</p>
              <div className="mt-6 flex items-center gap-2">
                <Button
                  variant="terminal"
                  onClick={() => {
                    setSubmitted(false);
                    setData({ name: '', email: '', friction: '' });
                    setErrors({});
                  }}
                >
                  NEW SESSION
                </Button>
                <a href="#pricing">
                  <Button variant="outline">View Pricing</Button>
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-sm text-slate-600 mt-6">
        Your information is used to prepare a tailored briefing. We never sell your data.
      </p>
    </div>
  </section>
);

};

/* ===================== MAIN PAGE ===================== */
export default function MariebSiteLight() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const hero = document.querySelector('[data-testid="hero-title"]');
      console.assert(!!hero, 'Hero title should render');
      const sols = document.querySelector('[data-testid="solutions"]');
      console.assert(!!sols, 'Solutions section should mount');
    } catch {
      // noop
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes hero-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        .hero-caret-blink { animation: hero-blink 1s steps(1, end) infinite; }

        @keyframes glitch {
          0%,100% { transform: translateX(0); opacity: 0.2; }
          20% { transform: translateX(-2px); opacity: 0.4; }
          40% { transform: translateX(2px); opacity: 0.25; }
          60% { transform: translateX(-1px); opacity: 0.35; }
          80% { transform: translateX(1px); opacity: 0.3; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.8; }
          47% { opacity: 1; }
          50% { opacity: 0.9; }
          55% { opacity: 1; }
        }
        @keyframes noiseScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200 bg-white/75">
        <div className="flex justify-between items-center py-4 px-4 md:py-5 md:px-8">
          <MariebLogo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm">
            <a href="#workflow" className="text-slate-700 hover:text-slate-900">
              Workflow
            </a>
            <a href="#solutions" className="text-slate-700 hover:text-slate-900">
              Solutions
            </a>
            <a href="#behind" className="text-slate-700 hover:text-slate-900">
              Behind the Flow
            </a>
            <a href="#pricing" className="text-slate-700 hover:text-slate-900">
              Pricing
            </a>
            <a href="#engage" className="text-slate-700 hover:text-slate-900">
              Engage
            </a>
          </nav>

          {/* Header CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <a href="#engage">
              <Button variant="primary" size="lg">
                Engage
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <nav className="flex flex-col p-4 space-y-3">
              {[
                ['#workflow', 'Workflow'],
                ['#solutions', 'Solutions'],
                ['#behind', 'Behind the Flow'],
                ['#pricing', 'Pricing'],
                ['#engage', 'Engage'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left py-2 px-2 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main */}
      <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-sky-200 selection:text-slate-900">
        {/* Hero + Highlights */}
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 px-6 py-12 md:px-12 md:py-16 lg:py-20">
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight text-slate-900"
              data-testid="hero-title"
            >
              Where Industry Expertise Meets Modern Problem-Solving
              <HeroCursor />
            </h1>

            <p className="text-base md:text-lg text-slate-700 mb-8 md:mb-12 max-w-2xl">
              Marieb specializes in removing operational bottlenecks by pairing emerging AI with deep,
              practical industry experience from the factory floor and up. We work directly with each
              client to design custom workflows that improve accuracy, speed, and decision-making—built
              around real factory, job-site, and office conditions, not theoretical models.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a href="#solutions">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Discover →
                </Button>
              </a>
              <a href="#engage">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Engage
                </Button>
              </a>
            </div>
          </div>

          <aside className="w-full lg:w-[26rem] px-6 py-12 md:px-8 md:py-16 lg:py-20 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white/60">
            <h2 className="text-lg md:text-xl font-semibold mb-6 md:mb-8 text-slate-900">
              Recent Highlights
            </h2>

            <div className="space-y-4 md:space-y-6">
              {[
                {
                  t: 'PoolPro.chat Live',
                  d: "An interactive AI assistant designed to answer questions about services, companies, and real-world problem solving-guided by Daniel's field experience and delivered through his AI counterpart, Steven Falken",
                  href: 'https://poolpro.chat',
                },
                {
                  t: '2026 Hotel Brand Standards Update',
                  d: 'Ongoing consultations with major hotel brands-most recently Marriott-working alongside developer and pool builder to interpret, align, and implement evolving 2026 brand and compliance standards',
                },
                {
                  t: 'Renovation Reports & In-Field Support',
                  d: 'Detailed, project-specific renovation reports covering raw materials, surface options, system design, and execution methodology-paired with optional in-field support to ensure field implementation.',
                },
              ].map(({ t, d, href }) => {
                const card = (
                  <Card className="h-full">
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-slate-300 rounded-full mt-2" />
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1 text-sm md:text-base">
                            {t}
                          </h4>
                          <p className="text-xs md:text-sm text-slate-700">{d}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

                return href ? (
                  <a
                    key={t}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    {card}
                  </a>
                ) : (
                  <React.Fragment key={t}>{card}</React.Fragment>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Workflow */}
        <section id="workflow" className="py-14 md:py-20 px-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-slate-900">
            Workflow Studios
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'PoolBrain.ai',
                desc: 'Our domain intelligence layer that learns from past installs, climate, materials, and service logs—so every decision uses field truth.',
                icon: 'PoolBrain',
              },
              {
                title: 'SignalFlow™',
                desc: 'Automation rails that connect CRMs, forms, and jobsite telemetry to keep ops synchronized.',
                icon: 'SignalFlow',
              },
              {
                title: 'In-Field AI™',
                desc: 'Rugged edge kits for diagnostics, QA photos, and condition checks—feeding real-world signals back to your systems.',
                icon: 'InField',
              },
              {
                title: 'Domain-Specific RAG Experts',
                desc: 'Retrievers tuned to pool codes, coatings, chemistry, and equipment—fast answers with citations.',
                icon: 'RAG',
              },
            ].map((studio) => (
              <Card key={studio.title} className="hover:border-slate-300 hover:shadow-lg">
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg md:text-xl font-medium text-slate-900">
                      {studio.title}
                    </h4>
                    <span className="grid place-items-center w-9 h-9 rounded-lg bg-sky-50 text-sky-700 border border-sky-100">
                      <WorkflowIcon type={studio.icon} />
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 mb-3">{studio.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <SolutionsSection />

        {/* Behind the Flow */}
        <section
          id="behind"
          className="py-16 md:py-24 px-6 bg-[radial-gradient(1200px_600px_at_50%_0%,#e0f2fe_0%,transparent_60%)]"
        >
          <header className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block text-xs tracking-[0.18em] text-slate-700 border border-slate-200 rounded-full px-3 py-1 bg-white/60">
              BEHIND THE FLOW
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Behind the Flow</h2>
          </header>

          <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">Industry Depth First —</h3>
              <p className="text-slate-700 leading-relaxed">
                Marieb Consulting was built on experience, not theory. With decades of hands-on
                experience across manufacturing floors, construction sites, and coatings facilities,
                our directions and systems are shaped by the realities of the situation.
              </p>
              <p className="text-slate-700 leading-relaxed mt-3">
                That foundation drives how we approach artificial intelligence today. From production
                cycles and vendor logistics to job-site coordination, we understand that technology
                only works when it respects the human and physical conditions it operates in.
              </p>
              <p className="text-slate-700 leading-relaxed mt-3">
                Every workflow we design is pragmatic, measurable, and grounded in the cadence of real
                operations—not hypothetical dashboards.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">
                Engineering at the Frontier — Built by Hands That Understand the Field
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Led by founder Dan Epple—educated across dual bachelor’s programs and continually
                advancing graduate-level studies in emerging AI technology and organizational systems,
                including a certification in Generative AI for Business from the University of
                Michigan’s College of Engineering — Marieb develops In-Field AI™ and SignalFlow™
                systems that merge edge computing, sensor data, and human reinforcement into adaptive
                operational information and solutions.
              </p>
              <p className="text-slate-700 leading-relaxed mt-3">
                This leadership blends technical fluency with <em>well-lived</em> industry experience—turning
                data and technology workflows into solutions that perform reliably in unpredictable
                environments. Our technology is built to handle real-world conditions because it was
                conceived in them.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-slate-700 leading-relaxed">
              We engage early with emerging frameworks, test unproven APIs, and translate frontier
              innovation into secure, stable, and scalable workflows that give our clients a measurable edge.
            </p>
            <p className="text-slate-600 italic mt-3">
              We don’t chase trends—we operationalize what’s next before others see it coming, making our
              style harder to follow and impossible to replicate.
            </p>
          </div>
        </section>

        <PricingSection />

        {/* Engage */}
        <EngageTerminal />

        {/* Footer */}
        <footer className="py-8 md:py-10 px-4 text-center text-xs md:text-sm text-slate-600 border-t border-slate-200 bg-white/60">
          <p>© 2025 Marieb — Domain-Deep Intelligence. Open Ecosystem.</p>
        </footer>
      </div>
    </>
  );
}
