import React, { useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { site, contact } from '../data/site';

interface PricingProps {
  lang: Language;
}

type Status = 'idle' | 'sending' | 'ok' | 'fallback' | 'error';

const pricing = site.pricing;

const inputCls =
  'w-full bg-transparent border-0 border-b border-ink/15 rounded-none px-0 py-3 text-[15px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-[#FF5A1F] transition-colors';
const labelCls = 'block text-[10px] tracking-[0.25em] uppercase text-ink/45';

export const Pricing: React.FC<PricingProps> = ({ lang }) => {
  const t = translations[lang];
  const en = lang === 'en';
  const formRef = useRef<HTMLDivElement>(null);

  const packages = pricing.packages.map((p) => ({
    name: (en && p.nameEn) || p.name,
    desc: (en && p.descEn) || p.desc,
    price: (en && p.priceEn) || p.price,
    includes: (en && p.includesEn?.length ? p.includesEn : p.includes) || [],
    highlight: !!p.highlight,
  }));
  const otherLabel = en ? 'Other' : 'Khác';
  const typeOptions = [...packages.map((p) => p.name), otherLabel];
  const budgetOptions = t.form_budget_opts.split('|');
  const serviceOptions = [t.form_service_both, t.form_service_film, t.form_service_photo];

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: typeOptions[0],
    service: serviceOptions[0],
    date: '',
    city: '',
    budget: budgetOptions[0],
    note: '',
    botcheck: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const choosePackage = (name: string) => {
    setForm((f) => ({ ...f, type: name }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const summary = () =>
    [
      `${t.form_title.toUpperCase()} — JACKGRAPHER`,
      `${t.form_name}: ${form.name}`,
      `${t.form_phone}: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      `${t.form_type}: ${form.type}`,
      `${t.form_service}: ${form.service}`,
      form.date && `${t.form_date}: ${form.date}`,
      form.city && `${t.form_city}: ${form.city}`,
      `${t.form_budget}: ${form.budget}`,
      form.note && `${t.form_note}: ${form.note}`,
    ]
      .filter(Boolean)
      .join('\n');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.botcheck) return; // bot
    if (!form.name.trim() || form.phone.replace(/[^\d]/g, '').length < 8) {
      setError(t.form_required);
      return;
    }

    const key = (pricing.formKey || '').trim();

    // Chưa cấu hình khoá Web3Forms → sao chép nội dung và mở email / Zalo
    if (!key) {
      try {
        await navigator.clipboard.writeText(summary());
      } catch {
        /* clipboard có thể bị chặn — vẫn mở kênh liên hệ */
      }
      const url = contact.hasEmail
        ? `mailto:${contact.email}?subject=${encodeURIComponent('Yêu cầu báo giá — ' + form.name)}&body=${encodeURIComponent(summary())}`
        : contact.zaloUrl;
      window.open(url, contact.hasEmail ? '_self' : '_blank', 'noopener');
      setStatus('fallback');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: `Yêu cầu báo giá mới — ${form.name} (${form.type})`,
          from_name: 'JACKGRAPHER website',
          ...(form.email ? { replyto: form.email } : {}),
          [t.form_name]: form.name,
          [t.form_phone]: form.phone,
          Email: form.email || '—',
          [t.form_type]: form.type,
          [t.form_service]: form.service,
          [t.form_date]: form.date || '—',
          [t.form_city]: form.city || '—',
          [t.form_budget]: form.budget,
          [t.form_note]: form.note || '—',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) setStatus('ok');
      else throw new Error(data.message || 'send failed');
    } catch {
      setStatus('error');
      setError(t.form_err);
    }
  };

  const done = status === 'ok' || status === 'fallback';

  return (
    <section id="pricing" className="relative py-16 lg:py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10 mb-10 lg:mb-14">
        <div className="min-w-0">
          <p className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#FF5A1F]">
            <span className="w-8 h-px bg-[#FF5A1F]" />
            {t.pricing_eyebrow}
          </p>
          <h2 className="mt-5 font-display uppercase leading-[1.06] text-[clamp(36px,6.4vw,96px)]">
            {t.pricing_title_1}
            <br />
            <span className="font-serif-accent normal-case text-ink/90 text-[1.12em] leading-[0.95]">
              {t.pricing_title_2.replace(/\.$/, '')}
              <span className="text-[#FF5A1F]">.</span>
            </span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink/60">{t.pricing_desc}</p>
      </div>

      {/* Packages */}
      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((p, i) => (
          <article
            key={p.name + i}
            className={`group relative flex flex-col rounded-2xl border p-7 lg:p-8 transition-colors duration-300 ${
              p.highlight ? 'border-[#FF5A1F]/60 bg-surface' : 'border-ink/10 hover:border-ink/25'
            }`}
          >
            <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase text-ink/40">
              <span>{String(i + 1).padStart(2, '0')}</span>
              {p.highlight && (
                <span className="flex items-center gap-2 text-[#FF5A1F]">
                  <span className="rec-dot w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                  {t.pricing_popular}
                </span>
              )}
            </div>
            <h3 className="mt-8 font-display text-xl lg:text-2xl uppercase leading-tight">{p.name}</h3>
            <p className="mt-2 text-sm text-ink/55 leading-relaxed">{p.desc}</p>

            <div className="mt-7 pb-7 border-b border-ink/10">
              {p.price ? (
                <p className="flex items-baseline gap-2">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-ink/40">{t.pricing_from}</span>
                  <span className="font-display text-2xl lg:text-3xl tabular-nums">{p.price}</span>
                </p>
              ) : (
                <p className="font-serif-accent text-2xl lg:text-[28px] text-ink/90">{t.pricing_custom}</p>
              )}
            </div>

            <ul className="mt-6 space-y-3 flex-1">
              {p.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink/75">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#FF5A1F]" strokeWidth={2.2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => choosePackage(p.name)}
              data-cursor="pointer"
              className={`mt-8 inline-flex items-center justify-between gap-3 rounded-full px-6 py-3.5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                p.highlight
                  ? 'bg-[#FF5A1F] text-paper hover:bg-[#e04b14]'
                  : 'border border-ink/20 text-ink hover:border-[#FF5A1F] hover:text-[#FF5A1F]'
              }`}
            >
              {t.pricing_choose}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </article>
        ))}
      </div>

      {/* Quote form */}
      <div ref={formRef} id="quote" className="scroll-mt-28 mt-16 lg:mt-24 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h3 className="font-display uppercase text-3xl lg:text-5xl leading-[1.05]">
            {t.form_title.split('&')[0].trim()}
            <br />
            <span className="font-serif-accent normal-case text-[1.1em]">
              &amp; {(t.form_title.split('&')[1] || '').trim().toLowerCase()}
              <span className="text-[#FF5A1F]">.</span>
            </span>
          </h3>
          <p className="mt-6 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] uppercase text-ink/60">
            <span className="rec-dot w-2 h-2 rounded-full bg-[#FF5A1F]" />
            {(en && pricing.responseTimeEn) || pricing.responseTime}
          </p>
          <div className="mt-8 space-y-2 text-sm text-ink/60">
            {contact.hasPhone && (
              <a href={contact.telUrl} data-cursor="pointer" className="block hover:text-ink transition-colors">
                Hotline · {contact.phone}
              </a>
            )}
            <a href={contact.zaloUrl} target="_blank" rel="noopener noreferrer" data-cursor="pointer" className="block hover:text-[#FF5A1F] transition-colors">
              Zalo ↗
            </a>
            {contact.hasEmail && (
              <a href={`mailto:${contact.email}`} data-cursor="pointer" className="block hover:text-ink transition-colors">
                {contact.email}
              </a>
            )}
          </div>
        </div>

        {done ? (
          <div className="rounded-2xl border border-ink/10 p-8 lg:p-12 flex flex-col justify-center">
            <p className="font-serif-accent text-4xl lg:text-5xl">
              {status === 'ok' ? t.form_ok_title.replace(/\.$/, '') : (en ? 'Almost there' : 'Gần xong rồi')}
              <span className="text-[#FF5A1F]">.</span>
            </p>
            <p className="mt-4 text-sm text-ink/60 max-w-md">{status === 'ok' ? t.form_ok : t.form_fallback}</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="rounded-2xl border border-ink/10 p-6 sm:p-8 lg:p-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {/* honeypot */}
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" checked={!!form.botcheck} onChange={(e) => setForm((f) => ({ ...f, botcheck: e.target.checked ? '1' : '' }))} />

            <label className="block">
              <span className={labelCls}>{t.form_name} *</span>
              <input className={inputCls} value={form.name} onChange={set('name')} autoComplete="name" required />
            </label>
            <label className="block">
              <span className={labelCls}>{t.form_phone} *</span>
              <input className={inputCls} value={form.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" required />
            </label>

            <label className="block">
              <span className={labelCls}>{t.form_type}</span>
              <select className={`${inputCls} cursor-pointer`} value={form.type} onChange={set('type')}>
                {typeOptions.map((o) => (
                  <option key={o} value={o} className="bg-paper">{o}</option>
                ))}
              </select>
            </label>
            <div>
              <span className={labelCls}>{t.form_service}</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {serviceOptions.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, service: o }))}
                    data-cursor="pointer"
                    className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-widest border transition-colors cursor-pointer ${
                      form.service === o ? 'border-[#FF5A1F] bg-[#FF5A1F] text-paper' : 'border-ink/15 text-ink/60 hover:border-ink/40'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className={labelCls}>{t.form_date}</span>
              <input className={`${inputCls} [color-scheme:inherit]`} value={form.date} onChange={set('date')} type="date" />
            </label>
            <label className="block">
              <span className={labelCls}>{t.form_city}</span>
              <input className={inputCls} value={form.city} onChange={set('city')} placeholder={en ? 'Saigon, Hanoi…' : 'Sài Gòn, Hà Nội…'} />
            </label>

            <label className="block">
              <span className={labelCls}>{t.form_budget}</span>
              <select className={`${inputCls} cursor-pointer`} value={form.budget} onChange={set('budget')}>
                {budgetOptions.map((o) => (
                  <option key={o} value={o} className="bg-paper">{o}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>{t.form_email}</span>
              <input className={inputCls} value={form.email} onChange={set('email')} type="email" autoComplete="email" />
            </label>

            <label className="block sm:col-span-2">
              <span className={labelCls}>{t.form_note}</span>
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.note} onChange={set('note')} placeholder={t.form_note_ph} />
            </label>

            <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-5">
              <p className="text-[11px] text-ink/35 max-w-xs">{error ? <span className="text-[#FF5A1F]">{error}</span> : t.form_privacy}</p>
              <button
                type="submit"
                disabled={status === 'sending'}
                data-cursor="pointer"
                className="whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-3 rounded-full bg-[#FF5A1F] hover:bg-[#e04b14] disabled:opacity-60 px-8 py-4 text-paper text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                {status === 'sending' ? t.form_sending : t.form_submit}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
