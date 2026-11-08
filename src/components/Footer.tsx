import React from 'react';
import { translations } from '../data/translations';
import { contact, socials } from '../data/site';
import { Language } from '../types';
import { SocialIcon } from './ContactPanels';

interface FooterProps {
  lang: Language;
}

/** Footer — toàn bộ thông tin lấy từ /admin → Thông tin chung → Liên hệ */
export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];
  const hours = contact.hours(lang);
  const label = 'block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] uppercase text-ink/35 mb-2';

  return (
    <footer className="border-t border-ink/10 pt-14 pb-10 px-6 sm:px-12 max-w-7xl mx-auto font-sans text-ink/60">
      {/* Thông tin liên hệ */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-12 mb-8 border-b border-ink/[0.07] text-[13px]">
        {contact.hasPhone && (
          <div>
            <span className={label}>Hotline · Zalo</span>
            <a href={contact.telUrl} data-cursor="pointer" className="text-ink hover:text-[#FF5A1F] transition-colors">
              {contact.phone}
            </a>
          </div>
        )}
        {contact.hasEmail && (
          <div>
            <span className={label}>Email</span>
            <a href={`mailto:${contact.email}`} data-cursor="pointer" className="text-ink hover:text-[#FF5A1F] transition-colors break-all">
              {contact.email}
            </a>
          </div>
        )}
        {hours && (
          <div>
            <span className={label}>{lang === 'vi' ? 'Giờ làm việc' : 'Hours'}</span>
            <span className="text-ink/80">{hours}</span>
          </div>
        )}
        <div>
          <span className={label}>{lang === 'vi' ? 'Khu vực' : 'Based in'}</span>
          <span className="text-ink/80">{contact.cities}</span>
        </div>
      </div>

      {/* Logo · mạng xã hội · bản quyền */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <a href="#" data-cursor="pointer" className="font-display text-sm font-extrabold text-ink tracking-wider">
          JACKGRAPHER<span className="text-[#FF5A1F]">.</span>
        </a>

        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.key}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              data-cursor="pointer"
              className="grid place-items-center w-9 h-9 rounded-full border border-ink/10 text-ink/60 hover:text-[#FF5A1F] hover:border-[#FF5A1F] transition-colors"
            >
              <SocialIcon k={s.key} />
            </a>
          ))}
          <a
            href={contact.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="h-9 inline-flex items-center rounded-full border border-[#FF5A1F]/40 px-4 text-[11px] font-bold tracking-widest text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-paper transition-colors"
          >
            ZALO
          </a>
        </div>

        <div className="whitespace-nowrap text-[11px] tracking-widest uppercase text-ink/40">
          © {new Date().getFullYear()} JACKGRAPHER. {t.footer_rights.replace(/^©\s*\d{4}\s*JACKGRAPHER\.\s*/i, '')}
        </div>
      </div>
    </footer>
  );
};
