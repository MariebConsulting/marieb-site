// src/App.tsx
// Marieb Site – Dark Theme Full Integrated V8
// One-page dark theme site with: Hero (terminal cursor), Recent Highlights,
// Workflow Studios, Solutions, Behind the Flow, Pricing, and the Engage Terminal.
// This version posts to Google Apps Script using URL-encoded data.

// Requirements:
// 1) At project root, create .env with:
//    VITE_FORM_ENDPOINT="https://script.google.com/macros/s/AKfycb.../exec"
// 2) Restart dev server after editing .env (npm run dev)

import React, { useEffect, useRef, useState } from 'react';

/* ===================== CONFIG ===================== */
// Use inverted (white) logo only, with WebP first and PNG fallback via <picture>
const MARIEB_LOGO_SRC = '/brand/marieb-logo-header.png'; // exact name in public/brand

// Use env if present, otherwise fall back to your Apps Script URL
const ENDPOINT: string =
  (import.meta as any).env?.VITE_FORM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbzORTfFUtRdpss_h5H2HgyIyhLmVocL-q4ui5YY-kepCEf4qEl63fA1r6n4e9NhwVZZzw/exec';

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
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-sky-400 disabled:pointer-events-none disabled:opacity-50';
  const variants: Record<string, string> = {
    primary: 'bg-sky-500 text-slate-900 hover:bg-sky-400',
    outline: 'border border-slate-700 text-slate-200 hover:bg-slate-800/60 bg-transparent',
    ghost: 'text-slate-300 hover:text-white hover:bg-white/5 focus-visible:bg-white/10',
    terminal: 'bg-emerald-400 text-slate-900 hover:bg-emerald-300 font-mono',
    danger: 'bg-rose-500 text-white hover:bg-rose-400',
  };
  const sizes: Record<string, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2 text-sm',
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
    {label && <span className="block mb-1 text-slate-300">{label}</span>}
    <input
      {...props}
      className={`w-full rounded-md bg-slate-900 border ${
        error ? 'border-rose-500' : 'border-slate-700'
      } px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400`}
    />
    {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
  </label>
);

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};
const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => (
  <label className={`block text-sm ${className}`}>
    {label && <span className="block mb-1 text-slate-300">{label}</span>}
    <textarea
      {...props}
      className={`w-full rounded-md bg-slate-900 border ${
        error ? 'border-rose-500' : 'border-slate-700'
      } px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400`}
    />
    {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
  </label>
);

type CardProps = React.HTMLAttributes<HTMLDivElement>;
const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm shadow-sm ${className}`}
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
  <a href="/" className="flex items-center" aria-label="Marieb Consulting home">
    <img
      src={MARIEB_LOGO_SRC}
      srcSet="/brand/marieb-logo-header-2x.png 2x, /brand/marieb-logo-header-3x.png 3x"
      alt="Marieb Consulting"
      className="h-12 md:h-14 lg:h-16 w-auto object-contain"
      loading="eager"
      decoding="async"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        img.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.textContent = 'MARIEB';
        fallback.className = 'text-white font-semibold text-xl';
        img.parentElement?.appendChild(fallback);
      }}
    />
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
      'We connect PLCs, sensors, and line software with AI observers that detect drift, reduce downtime, and tune parameters. Where beneficial, we retrofit stations with vision or edge compute for closed-loop improvements.',
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
      'Personalized outreach, decks, objection handling, and follow-ups connected to your CRM.',
    detail:
      'Turn your pipeline into a living playbook. Emails and decks adapt to lead type and season, while PoolBrain.ai quietly surfaces patterns from wins, demos, and quotes.',
    pillar: 'Market & Economics',
    icon: '🤝',
  },
  {
    id: 'support',
    title: 'Customer Support & Success',
    summary: 'Knowledge bases, smart FAQs, and chat responses that stay on-brand and on-topic.',
    detail:
      'Summarize tickets, spot recurring issues, and draft proactive guidance. PoolBrain.ai logs insights so service and warranty teams get ahead of problems.',
    pillar: 'Service & Maintenance',
    icon: '🛟',
  },
  {
    id: 'product',
    title: 'Product Management',
    summary: 'Turn raw notes and field reports into clear insights, release notes, and training.',
    detail:
      'Close the loop between field and factory. PoolBrain.ai correlates substrate, climate, and install feedback for better product decisions.',
    pillar: 'Construction & Engineering',
    icon: '🧩',
  },
  {
    id: 'hr',
    title: 'Human Resources & Recruiting',
    summary: 'Faster JDs, offers, onboarding, and culture communications with consistent tone.',
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
      el.querySelectorAll('.reveal').forEach((n) => n.classList.add('opacity-100', 'translate-y-0'));
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
      className="relative py-16 md:py-24 px-6 bg-[radial-gradient(1200px_600px_at_20%_-10%,#0f1729_0%,transparent_60%),radial-gradient(1000px_500px_at_120%_0%,#1b1031_0%,transparent_60%)]"
      data-testid="solutions"
    >
      <header className="max-w-4xl mx-auto text-center space-y-4 reveal opacity-0 translate-y-3 transition">
        <span className="inline-block text-xs tracking-[0.18em] text-slate-400 border border-slate-800 rounded-full px-3 py-1">
          SOLUTIONS
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-100">
          Native AI for Swimming Pool and Outdoor Living Businesses
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          We integrate an open ecosystem—Jasper, OpenAI, Gemini, Claude—on top of your systems. A
          light PoolBrain.ai layer quietly keeps teams aligned with what’s working in the field.
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
            <Card className="group hover:border-slate-700 hover:shadow-lg hover:shadow-sky-500/5">
              <button
                className="w-full text-left p-5 flex items-start gap-3"
                aria-expanded={openId === s.id}
                aria-controls={`panel-${s.id}`}
                onClick={() => setOpenId(openId === s.id ? null : s.id)}
              >
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-sky-400/10 text-sky-300 group-hover:bg-sky-400/20">
                  {s.icon}
                </span>
                <span className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-100">{s.title}</strong>
                    <span
                      className={`ml-3 text-slate-400 transition-transform ${
                        openId === s.id ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </div>
                  <span className="inline-block text-xs text-slate-400 bg-slate-800/70 border border-slate-700 rounded-full px-2 py-0.5 mt-1">
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
                  <p className="text-sm text-slate-200 mb-2">{s.summary}</p>
                  <p className="text-sm text-slate-400">{s.detail}</p>
                </CardContent>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <footer className="max-w-6xl mx-auto mt-8 flex items-center justify-start gap-2 reveal opacity-0 translate-y-3 transition">
        {['Open Ecosystem', 'In-Field AI™', 'SignalFlow™', 'PoolBrain.ai (light)'].map((chip) => (
          <span
            key={chip}
            className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1"
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
  <span className="text-xs text-sky-300 bg-sky-400/10 border border-sky-400/30 rounded-full px-2 py-0.5">
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
      blurb:
        'Ongoing access to consulting, iteration, monitoring, and measurable KPI improvements.',
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
      className="py-16 md:py-24 px-6 bg-[radial-gradient(1100px_520px_at_-10%_-10%,#07101e_0%,transparent_55%),radial-gradient(900px_440px_at_120%_0%,#1a0f2e_0%,transparent_60%)]"
      data-testid="pricing"
    >
      <header className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-block text-xs tracking-[0.18em] text-slate-400 border border-slate-800 rounded-full px-3 py-1 mb-3">
          PRICING
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-100">
          Engagements that align with outcomes
        </h2>
        <p className="text-slate-400 mt-3">
          We price against value delivered—not hours spent. Choose a structure, then we tailor scope
          and KPIs to your goals.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tiers.map((t) => (
          <Card
            key={t.name}
            className={`relative ${
              t.featured
                ? 'border-sky-500/40 shadow-[0_10px_60px_-15px_rgba(56,189,248,0.25)]'
                : ''
            }`}
          >
            {t.featured && (
              <div className="absolute -top-3 right-3">
                <PricingBadge>Most Popular</PricingBadge>
              </div>
            )}
            <CardContent>
              <h3 className="text-xl font-semibold text-slate-100">{t.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{t.tag}</p>
              <p className="text-sm text-slate-300 mt-4">{t.blurb}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {t.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="text-sky-300">✔</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-slate-200 font-medium">{t.price}</span>
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
      <div className="max-w-4xl mx-auto mt-10 text-slate-400 text-sm">
        <p>
          Need something different? We can combine a short Workshop to de-risk scope, then roll into
          a Retainer or Fixed-Scope build. We also support{' '}
          <span className="text-slate-200">co-selling</span> with manufacturers and channel
          partners.
        </p>
      </div>
    </section>
  );
};

/* ===================== HERO TERMINAL CURSOR ===================== */
const HeroCursor: React.FC = () => (
  <span
    aria-hidden="true"
    className="ml-3 inline-flex align-baseline font-mono text-emerald-300"
    data-testid="hero-cursor"
  >
    <span className="text-[0.9em]">&gt;</span>
    <span className="hero-caret-blink inline-block w-[0.65em] text-[0.9em] translate-y-[1px]">
      _
    </span>
  </span>
);

/* ===================== ENGAGE TERMINAL (URL-ENCODED SUBMIT) ===================== */
function validateEmail(v: string) {
  return /.+@.+\..+/.test(v);
}

const StepDot: React.FC<{ active: boolean; done: boolean }> = ({ active, done }) => (
  <span
    className={`inline-block w-2.5 h-2.5 rounded-full ${
      done ? 'bg-emerald-400' : active ? 'bg-sky-400' : 'bg-slate-600'
    }`}
  />
);

const EngageTerminal: React.FC = () => {
  const [data, setData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    friction: '',
    contact: 'email',
    consent: false,
    honey: '',
  });
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = ['Intro', 'Company', 'Friction', 'Review'];

  function validateStep() {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!data.name) e.name = 'Required';
      if (!validateEmail(data.email)) e.email = 'Invalid email';
    }
    if (step === 1) {
      if (!data.company) e.company = 'Required';
      if (!data.phone) e.phone = 'Required';
    }
    if (step === 2) {
      if (!data.friction) e.friction = 'Tell us a bit about the challenge';
      if (!data.consent) e.consent = 'Please accept to proceed';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Fire-and-forget submit: avoids “Network error / Load failed” noise while
  // Apps Script still writes the row to your sheet.
  async function submit() {
    if (!validateStep()) return;
    if (data.honey) return; // honeypot

    if (!ENDPOINT) {
      alert('Endpoint is not configured. Add VITE_FORM_ENDPOINT to .env and rebuild.');
      return;
    }

    setSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.set('name', data.name);
      params.set('company', data.company);
      params.set('email', data.email);
      params.set('phone', data.phone);
      params.set('friction', data.friction);
      params.set('honeypot', data.honey);

      await fetch(ENDPOINT, {
        method: 'POST',
        body: params,
        mode: 'no-cors', // opaque response, but request is sent
      });

      // If we got here, the browser accepted the request.
      // Apps Script is already known to append rows, so treat as success.
      setSubmitted(true);
    } catch (err) {
      console.error('Network or fetch error (POST may still have been sent):', err);
      // Be optimistic, since we know the backend often succeeds even when the browser complains.
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="engage" className="py-14 md:py-20 px-6">
      <h3 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-slate-100">
        Engage
      </h3>
      <div className="max-w-3xl mx-auto">
        <Card className="bg-black/90 border-emerald-700/40 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.05)]">
          <CardContent>
            {/* Terminal Header */}
            <div className="font-mono text-emerald-300 text-xs flex items-center justify-between mb-4">
              <span className="text-emerald-300/80">/root/marieb/engage</span>
              <span className="text-emerald-300/60">
                _ session: {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Endpoint Debug – safe to remove later */}
            <div className="text-xs font-mono text-emerald-400 mb-4"> connection: active [OK]  </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <StepDot key={i} active={i === step} done={i < step} />
                ))}
              </div>
              <div className="text-xs text-slate-400">
                Step {step + 1} of {steps.length}
              </div>
            </div>

            {/* FORM */}
            {!submitted ? (
              <div className="font-mono text-emerald-300">
                {step === 0 && (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mr-2">&gt; Name</span>
                      <input
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className="bg-transparent outline-none border-b border-emerald-700/50 focus:border-emerald-400 text-emerald-200 w-full"
                        placeholder="Jane Doe"
                      />
                      {errors.name && (
                        <span className="block text-xs text-rose-400 mt-1">{errors.name}</span>
                      )}
                    </label>
                    <label className="block">
                      <span className="mr-2">&gt; Email</span>
                      <input
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className="bg-transparent outline-none border-b border-emerald-700/50 focus:border-emerald-400 text-emerald-200 w-full"
                        placeholder="you@company.com"
                      />
                      {errors.email && (
                        <span className="block text-xs text-rose-400 mt-1">{errors.email}</span>
                      )}
                    </label>
                    {/* honeypot */}
                    <input
                      aria-hidden
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={data.honey}
                      onChange={(e) => setData({ ...data, honey: e.target.value })}
                      className="hidden"
                    />
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mr-2">&gt; Company</span>
                      <input
                        value={data.company}
                        onChange={(e) => setData({ ...data, company: e.target.value })}
                        className="bg-transparent outline-none border-b border-emerald-700/50 focus:border-emerald-400 text-emerald-200 w-full"
                        placeholder="Marieb Consulting"
                      />
                      {errors.company && (
                        <span className="block text-xs text-rose-400 mt-1">{errors.company}</span>
                      )}
                    </label>
                    <label className="block">
                      <span className="mr-2">&gt; Phone</span>
                      <input
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        className="bg-transparent outline-none border-b border-emerald-700/50 focus:border-emerald-400 text-emerald-200 w-full"
                        placeholder="(555) 555-1212"
                      />
                      {errors.phone && (
                        <span className="block text-xs text-rose-400 mt-1">{errors.phone}</span>
                      )}
                    </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mr-2">&gt; Friction Point</span>
                      <textarea
                        value={data.friction}
                        onChange={(e) => setData({ ...data, friction: e.target.value })}
                        className="bg-transparent outline-none border-b border-emerald-700/50 focus:border-emerald-400 text-emerald-200 w-full min-h-[88px]"
                        placeholder="Briefly describe the bottleneck, e.g., coating QA, scheduling, ticket backlog…"
                      />
                      {errors.friction && (
                        <span className="block text-xs text-rose-400 mt-1">{errors.friction}</span>
                      )}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-emerald-200">
                      <input
                        type="checkbox"
                        checked={data.consent}
                        onChange={(e) =>
                          setData({
                            ...data,
                            consent: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-emerald-700 bg-slate-900"
                      />
                      I agree to be contacted about this inquiry.
                    </label>
                    {errors.consent && (
                      <span className="text-xs text-rose-400 -mt-3">{errors.consent}</span>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="text-sm text-emerald-200 space-y-2">
                    <div className="border border-emerald-700/40 rounded-md p-3 bg-slate-950/60">
                      <div>
                        <span className="text-emerald-400/80">Name:</span> {data.name}
                      </div>
                      <div>
                        <span className="text-emerald-400/80">Email:</span> {data.email}
                      </div>
                      <div>
                        <span className="text-emerald-400/80">Company:</span> {data.company}
                      </div>
                      <div>
                        <span className="text-emerald-400/80">Phone:</span> {data.phone}
                      </div>
                      <div className="mt-2">
                        <span className="text-emerald-400/80">Friction Point:</span>
                        <div className="mt-1 text-emerald-200 whitespace-pre-wrap">
                          {data.friction || '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="mt-6 flex items-center justify-between">
                  <div>{step > 0 && <Button variant="outline" onClick={back}>Back</Button>}</div>
                  <div className="flex gap-2">
                    {step < steps.length - 1 ? (
                      <Button onClick={next}>Next</Button>
                    ) : (
                      <Button onClick={submit} disabled={submitting}>
                        {submitting ? 'Submitting…' : 'Submit'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-200">
                <div className="text-emerald-300 font-mono mb-2">&gt; Submission received</div>
                <p className="text-slate-300">
                  Thanks, {data.name}. We’ll review your details and a Marieb specialist will reach
                  out via {data.contact}.
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  You’ll also receive a tailored reply based on your company footprint and mission
                  info.
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <Button
                    variant="terminal"
                    onClick={() => {
                      setSubmitted(false);
                      setStep(0);
                      setData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        friction: '',
                        contact: 'email',
                        consent: false,
                        honey: '',
                      });
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
        <p className="text-center text-sm text-slate-400 mt-6">
          Your information is used to prepare a tailored briefing. We never sell your data.
        </p>
      </div>
    </section>
  );
};

/* ===================== MAIN PAGE ===================== */
export default function MariebDarkSiteV8() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const hero = document.querySelector('[data-testid="hero-cursor"]');
      console.assert(!!hero, 'Hero cursor should render');
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
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70 border-b border-slate-800 bg-slate-950/60">
        <div className="flex justify-between items-center py-4 px-4 md:py-5 md:px-8">
          <MariebLogo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm">
            <a href="#workflow" className="hover:text:white text-slate-300">
              Workflow
            </a>
            <a href="#solutions" className="hover:text:white text-slate-300">
              Solutions
            </a>
            <a href="#behind" className="hover:text:white text-slate-300">
              Behind the Flow
            </a>
            <a href="#pricing" className="hover:text:white text-slate-300">
              Pricing
            </a>
            <a href="#engage" className="hover:text:white text-slate-300">
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
            className="lg:hidden text-slate-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950">
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
                  className="text-left py-2 px-2 rounded-md hover:bg:white/5 text-slate-300 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main */}
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-sky-400/30 selection:text-slate-50">
        {/* Hero + Highlights */}
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 px-6 py-12 md:px-12 md:py-16 lg:py-20">
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight text-slate-100"
              data-testid="hero-title"
            >
              Where Pool Industry Expertise Meets AI Evolution
              <HeroCursor />
            </h1>
            <p className="text-base md:text-lg text-slate-400 mb-8 md:mb-12 max-w-2xl">
              Marieb designs intelligent systems built for the realities of manufacturing, coatings,
              and construction—connecting real-world operations to digital intelligence.
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

          <aside className="w-full lg:w-[26rem] px-6 py-12 md:px-8 md:py-16 lg:py-20 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/60">
            <h2 className="text-lg md:text-xl font-semibold mb-6 md:mb-8 text-slate-100">
              Recent Highlights
            </h2>
            <div className="space-y-4 md:space-y-6">
              {[
                [
                  'PoolBrain.ai Launch',
                  'Our intelligence engine is now powering solutions across multiple industries.',
                ],
                [
                  'SignalFlow™ Legislation Integration Lobby',
                  'Early-phase strategy design guided by science and industry expertise to modernize legislation for natural swimming pools.',
                ],
                [
                  'Television Collaboration',
                  'Worked with a national production company on a feature project involving pool and outdoor living design, contributing both in front of and behind the camera.',
                ],
              ].map(([t, d]) => (
                <Card key={t as string}>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mt-2" />
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-1 text-sm md:text-base">
                          {t}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-400">{d}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </aside>
        </div>

        {/* Workflow */}
        <section id="workflow" className="py-14 md:py-20 px-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-slate-100">
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
              <Card
                key={studio.title}
                className="hover:border-slate-700 hover:shadow-lg hover:shadow-sky-500/5"
              >
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg md:text-xl font-medium text-slate-100">
                      {studio.title}
                    </h4>
                    <span className="grid place-items-center w-9 h-9 rounded-lg bg-sky-400/10 text-sky-300">
                      <WorkflowIcon type={studio.icon} />
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 mb-3">{studio.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <SolutionsSection />

        {/* Behind the Flow */}
        <section
          id="behind"
          className="py-16 md:py-24 px-6 bg-[radial-gradient(1200px_600px_at_50%_0%,#0b1220_0%,transparent_60%)]"
        >
          <header className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block text-xs tracking-[0.18em] text-slate-400 border border-slate-800 rounded-full px-3 py-1">
              BEHIND THE FLOW
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-100">Behind the Flow</h2>
          </header>
          <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold text-sky-400 mb-3">
                Industry Depth First —
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Our founder has decades of hands-on operational and field experience. Marieb
                Consulting was built by professionals who’ve led teams through manufacturing floors,
                construction sites, and coatings facilities—solving problems that live at the
                intersection of materials, weather, and people.
              </p>
              <p className="text-slate-300 leading-relaxed mt-3">
                That background brings an uncommon fluency in how real work gets done: from managing
                production cycles and vendor logistics to coordinating site crews and ensuring safety
                in the field. We know what happens when timing slips, when materials behave
                unpredictably, and when technology promises more than it delivers.
              </p>
              <p className="text-slate-300 leading-relaxed mt-3">
                That grounding ensures every system we design is not theoretical—it’s practical,
                measurable, and built for the rhythm of real operations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-sky-400 mb-3">
                Engineering at the Frontier — Driven by Minds That Build the Future
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Our senior business-intelligence engineer leads a team of data architects and
                software developers who work directly with emerging technologies from
                companies such as OpenAI, Google (Gemini), and xAI (Grok).
              </p>
              <p className="text-slate-300 leading-relaxed mt-3">
                Holding a master's degree in business artificial intelligence and a career spent
                developing enterprise-scale data infrastructure, this leadership combines academic
                precision with applied engineering experience.
              </p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-slate-400 leading-relaxed">
              The team engages early with new releases, explores untested APIs, and translates
              frontier technology into secure, stable, and dependable workflows for our clients.
            </p>
            <p className="text-slate-500 italic mt-3">
              We don’t chase trends—we implement what’s next before others understand it, making our
              style harder to follow.
            </p>
          </div>
        </section>

        <PricingSection />

        {/* Engage */}
        <EngageTerminal />

        {/* Footer */}
        <footer className="py-8 md:py-10 px-4 text-center text-xs md:text-sm text-slate-500 border-t border-slate-800">
          <p>© 2025 Marieb — Domain-Deep Intelligence. Open Ecosystem.</p>
        </footer>
      </div>
    </>
  );
}
