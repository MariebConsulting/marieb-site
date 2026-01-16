import { useState } from 'react';

// Debug: prints your endpoint to the browser console
console.log('VITE endpoint:', import.meta.env.VITE_FORM_ENDPOINT);

const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string;

export default function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [msg, setMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setMsg('');

    const fd = new FormData(e.currentTarget);

    // Build a simple (URL-encoded) request → no custom headers → no CORS preflight
    const params = new URLSearchParams();
    params.set('name', String(fd.get('name') || ''));
    params.set('company', String(fd.get('company') || ''));
    params.set('email', String(fd.get('email') || ''));
    params.set('phone', String(fd.get('phone') || ''));
    params.set('friction', String(fd.get('friction') || ''));
    params.set('honeypot', String(fd.get('website') || ''));

    try {
      const res = await fetch(endpoint, { method: 'POST', body: params });

      // Try JSON; if server returns plain text, degrade gracefully
      let json: any = null;
      try { json = await res.json(); } catch { json = { ok: res.ok, status: res.status }; }

      if ((json && json.ok) || res.ok) {
        setOk(true);
        setMsg('Thanks—message received. We’ll follow up shortly.');
        e.currentTarget.reset();
      } else {
        setOk(false);
        setMsg(json?.error || `Submit failed (HTTP ${res.status}).`);
      }
    } catch (err) {
      setOk(false);
      setMsg('Network hiccup. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      {/* Visible debug (remove when happy) */}
      <div className="text-xs font-mono">endpoint: {String(endpoint || 'undefined')}</div>

      {/* Honeypot (bots only) */}
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" placeholder="Name *" required className="border rounded px-3 py-2 w-full" />
        <input name="company" placeholder="Company" className="border rounded px-3 py-2 w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <input name="email" type="email" placeholder="Email *" required className="border rounded px-3 py-2 w-full" />
        <input name="phone" placeholder="Phone" className="border rounded px-3 py-2 w-full" />
      </div>

      <textarea
        name="friction"
        placeholder="What’s the friction point? *"
        required
        rows={4}
        className="border rounded px-3 py-2 w-full"
      />

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Sending…' : 'Send'}
      </button>

      {ok === true && <p className="text-slate-600">{msg}</p>}
      {ok === false && <p className="text-red-600">{msg}</p>}
    </form>
  );
}

