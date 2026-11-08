import React, { useState } from 'react';
import { ArrowUpRight, CalendarCheck, Facebook, Instagram, Link2, Mail, MessageCircle, Phone, Youtube } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { contact, socials, SocialKey } from '../data/site';

/* ───────── Icons ───────── */

const TikTok: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.5 2.6 2.3 4.4 5 4.8" />
  </svg>
);

export const SocialIcon: React.FC<{ k: SocialKey; className?: string }> = ({ k, className = 'w-4 h-4' }) => {
  const props = { className, strokeWidth: 1.8 };
  if (k === 'facebook') return <Facebook {...props} />;
  if (k === 'instagram') return <Instagram {...props} />;
  if (k === 'youtube') return <Youtube {...props} />;
  return <TikTok className={className} />;
};

/* ───────── Building blocks ───────── */

export const panelCls =
  'normal-case tracking-normal font-sans text-left rounded-2xl border border-ink/10 bg-surface/95 backdrop-blur-xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] p-2';

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] uppercase text-[#FF5A1F]">{children}</p>
);

interface RowProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  sub?: string;
  accent?: boolean;
  external?: boolean;
}

const Row: React.FC<RowProps> = ({ href, icon, title, sub, accent, external }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    data-cursor="pointer"
    className={`group flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors ${
      accent ? 'bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/15 text-[#FF5A1F]' : 'hover:bg-ink/[0.05] text-ink'
    }`}
  >
    <span
      className={`grid place-items-center w-9 h-9 shrink-0 rounded-[10px] border ${
        accent ? 'border-[#FF5A1F]/30' : 'border-ink/10 bg-ink/[0.03] text-ink/70 group-hover:text-[#FF5A1F]'
      } transition-colors`}
    >
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-[13px] font-semibold leading-tight">{title}</span>
      {sub && <span className={`block mt-0.5 text-[12px] truncate ${accent ? 'text-[#FF5A1F]/70' : 'text-ink/50'}`}>{sub}</span>}
    </span>
    <ArrowUpRight
      className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
        accent ? '' : 'text-ink/35 group-hover:text-ink'
      }`}
    />
  </a>
);

/* ───────── Contact card ───────── */

export const ContactCard: React.FC<{ lang: Language; header?: React.ReactNode }> = ({ lang, header }) => {
  const t = translations[lang];
  const hours = contact.hours(lang);
  return (
    <div>
      <div className="px-3 pt-3 pb-3">
        <Eyebrow>{t.cp_eyebrow}</Eyebrow>
        <p className="mt-1.5 text-[15px] font-semibold text-ink leading-snug">{t.cp_title}</p>
        {hours && <p className="mt-1 text-[12px] text-ink/50">{hours}</p>}
      </div>
      {header}
      <div className="space-y-0.5">
        {contact.hasEmail && (
          <Row href={`mailto:${contact.email}`} icon={<Mail className="w-4 h-4" strokeWidth={1.8} />} title={t.cp_email} sub={contact.email} />
        )}
        {contact.hasPhone && (
          <Row href={contact.telUrl} icon={<Phone className="w-4 h-4" strokeWidth={1.8} />} title={t.cp_phone} sub={contact.phone} />
        )}
        <Row href={contact.zaloUrl} external icon={<MessageCircle className="w-4 h-4" strokeWidth={1.8} />} title={t.cp_zalo} sub={t.cp_zalo_sub} />
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-ink/[0.07]">
        <Row href={contact.zaloUrl} external accent icon={<CalendarCheck className="w-4 h-4" strokeWidth={1.8} />} title={t.cp_book} sub={t.cp_book_sub} />
      </div>
    </div>
  );
};

/* ───────── Social card ───────── */

export const SocialCard: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.origin + window.location.pathname;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* người dùng huỷ chia sẻ */
    }
  };

  return (
    <div>
      <div className="px-3 pt-3 pb-3">
        <Eyebrow>{t.sp_eyebrow}</Eyebrow>
        <p className="mt-1.5 text-[15px] font-semibold text-ink leading-snug">{t.sp_title}</p>
        <p className="mt-1 text-[12px] text-ink/50 leading-relaxed">{t.sp_sub}</p>
      </div>
      <div className="space-y-0.5">
        {socials.map((s) => (
          <Row key={s.key} href={s.url!} external icon={<SocialIcon k={s.key} />} title={s.label} sub={s.url!.replace(/^https?:\/\/(www\.)?/, '')} />
        ))}
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-ink/[0.07]">
        <button
          type="button"
          onClick={share}
          data-cursor="pointer"
          className="group w-full flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-ink hover:bg-ink/[0.05] transition-colors cursor-pointer"
        >
          <span className="grid place-items-center w-9 h-9 shrink-0 rounded-[10px] border border-ink/10 bg-ink/[0.03] text-ink/70 group-hover:text-[#FF5A1F] transition-colors">
            <Link2 className="w-4 h-4" strokeWidth={1.8} />
          </span>
          <span className="flex-1 text-left text-[13px] font-semibold">{copied ? t.sp_copied : t.sp_share}</span>
        </button>
      </div>
    </div>
  );
};
