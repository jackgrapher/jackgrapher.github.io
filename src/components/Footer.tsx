import React from 'react';
import { translations } from '../data/translations';
import { contact } from '../data/site';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="border-t border-ink/10 py-12 px-6 sm:px-12 max-w-7xl mx-auto font-sans text-xs tracking-widest text-ink/50 uppercase">
      {/* Contact Info Line */}
      <div className="pb-8 mb-8 border-b border-ink/5 text-center sm:text-left text-ink/70 font-sans tracking-widest text-[11px] sm:text-xs">
        {contact.hasPhone && (
          <>
            <a href={contact.telUrl} data-cursor="pointer" className="hover:text-ink transition-colors">Hotline/Zalo: {contact.phone}</a>
            <span className="mx-2 text-[#FF5A1F]">·</span>
          </>
        )}
        {contact.hasEmail && (
          <>
            <a href={`mailto:${contact.email}`} data-cursor="pointer" className="normal-case hover:text-ink transition-colors">{contact.email}</a>
            <span className="mx-2 text-[#FF5A1F]">·</span>
          </>
        )}
        <span>{contact.cities}</span>
      </div>

      {/* Main Bar: Logo, Socials, 1-Line Copyright */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <a href="#" data-cursor="pointer" className="font-display text-sm font-extrabold text-ink tracking-wider">
          JACKGRAPHER<span className="text-[#FF5A1F]">.</span>
        </a>

        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href={contact.facebook}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="hover:text-ink transition-colors"
          >
            Facebook
          </a>
          <a
            href={contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="hover:text-ink transition-colors"
          >
            Instagram
          </a>
          <a
            href={contact.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="text-[#FF5A1F] hover:text-[#FF5A1F]/80 transition-colors"
          >
            Zalo
          </a>
        </div>

        <div className="whitespace-nowrap text-[11px] text-ink/40">
          © {new Date().getFullYear()} JACKGRAPHER. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
