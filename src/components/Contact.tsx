import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { contact } from '../data/site';

interface ContactProps {
  lang: Language;
}

export const Contact: React.FC<ContactProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section
      id="contact"
      className="w-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto py-16 lg:py-24 select-none overflow-hidden"
    >
      <div className="border-t border-ink/10 pt-12 sm:pt-16">
        {/* Massive Headline with clamp(56px, 11vw, 200px) and zero horizontal overflow */}
        <div className="w-full overflow-hidden mb-6">
          <h2
            style={{ fontSize: 'clamp(56px, 11vw, 190px)' }}
            className="font-display font-black uppercase tracking-tight text-ink leading-[0.9] break-words"
          >
            {t.contact_title.split(' ')[0]}{' '}
            <span className="font-serif-accent normal-case text-[1.08em]">{t.contact_title.split(' ').slice(1).join(' ').toLowerCase().replace(/\.$/, '')}<span className="text-[#FF5A1F]">.</span></span>
          </h2>
        </div>

        {/* 1 Short Line Subtext */}
        <p className="font-sans text-xs sm:text-sm tracking-widest text-ink/50 uppercase mb-10 max-w-lg">
          {t.contact_sub}
        </p>

        {/* 1 Single Orange Button: Nhắn Zalo with https://zalo.me/[SỐ ĐIỆN THOẠI] */}
        <div>
          <a
            href={contact.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#FF5A1F] hover:bg-[#e04b14] text-paper font-sans text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <span>{t.btn_zalo}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
