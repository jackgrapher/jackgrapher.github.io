import React from 'react';
import { contact, socials } from '../data/site';
import { Language } from '../types';
import { SocialIcon } from './ContactPanels';

interface FooterProps {
  lang: Language;
}

/** Footer tối giản — dữ liệu lấy từ /admin → Thông tin chung → Liên hệ */
export const Footer: React.FC<FooterProps> = () => {
  const dot = <span className="mx-3 text-[#FF5A1F]/70">·</span>;

  return (
    <footer className="max-w-7xl mx-auto px-6 sm:px-12 pt-10 pb-8 font-sans">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-ink/10 pt-8">
        <a href="#" data-cursor="pointer" className="font-display text-sm font-extrabold tracking-wider text-ink">
          JACKGRAPHER<span className="text-[#FF5A1F]">.</span>
        </a>

        <div className="flex items-center gap-5 text-ink/45">
          {socials.map((s) => (
            <a
              key={s.key}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              data-cursor="pointer"
              className="hover:text-ink transition-colors"
            >
              <SocialIcon k={s.key} className="w-[17px] h-[17px]" />
            </a>
          ))}
          <a
            href={contact.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="text-[11px] font-bold tracking-[0.2em] text-[#FF5A1F] hover:text-ink transition-colors"
          >
            ZALO
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase text-ink/35">
        <p className="text-center sm:text-left">
          {contact.hasEmail && (
            <a href={`mailto:${contact.email}`} data-cursor="pointer" className="normal-case tracking-[0.08em] hover:text-ink transition-colors">
              {contact.email}
            </a>
          )}
          {contact.hasEmail && contact.hasPhone && dot}
          {contact.hasPhone && (
            <a href={contact.telUrl} data-cursor="pointer" className="whitespace-nowrap hover:text-ink transition-colors">
              {contact.phone}
            </a>
          )}
          <span className="hidden sm:inline">
            {(contact.hasEmail || contact.hasPhone) && dot}
            {contact.cities}
          </span>
        </p>
        <p>© {new Date().getFullYear()} JACKGRAPHER</p>
      </div>
    </footer>
  );
};
