import React, { useEffect, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { site } from '../data/site';
import { ContactCard, panelCls } from './ContactPanels';

interface PricingProps {
  lang: Language;
}

type Pkg = { name: string; desc: string; price: string; includes: string[]; highlight: boolean };

const pricing = site.pricing as typeof site.pricing & { note?: string; noteEn?: string };

/** Bảng giá tham khảo dạng danh sách editorial — bấm vào một hàng để mở popup liên hệ */
export const Pricing: React.FC<PricingProps> = ({ lang }) => {
  const t = translations[lang];
  const en = lang === 'en';
  const [selected, setSelected] = useState<Pkg | null | undefined>(undefined); // undefined = đóng, null = mở chung

  const packages: Pkg[] = pricing.packages.map((p) => ({
    name: (en && p.nameEn) || p.name,
    desc: (en && p.descEn) || p.desc,
    price: (en && p.priceEn) || p.price,
    includes: (en && p.includesEn?.length ? p.includesEn : p.includes) || [],
    highlight: !!p.highlight,
  }));
  const note = (en && pricing.noteEn) || pricing.note;
  const isOpen = selected !== undefined;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(undefined);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const Price: React.FC<{ p: Pkg }> = ({ p }) =>
    p.price ? (
      <span className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase text-ink/40">{t.pricing_from}</span>
        <span className="font-display text-xl lg:text-2xl tabular-nums">{p.price}</span>
      </span>
    ) : (
      <span className="font-serif-accent text-2xl lg:text-[28px] text-ink/85 whitespace-nowrap">{t.pricing_custom}</span>
    );

  return (
    <section id="pricing" className="relative py-16 lg:py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10 mb-10 lg:mb-16">
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

      {/* Rate card — mỗi gói là một hàng, không chia box */}
      <ol className="border-t border-ink/15">
        {packages.map((p, i) => (
          <li key={p.name + i} className="border-b border-ink/15">
            <button
              type="button"
              onClick={() => setSelected(p)}
              data-cursor="pointer"
              aria-haspopup="dialog"
              className="group relative w-full text-left grid grid-cols-[auto_1fr_auto] lg:grid-cols-[132px_minmax(0,1.1fr)_minmax(0,1fr)_auto_auto] items-start lg:items-center gap-x-5 lg:gap-x-10 gap-y-4 py-8 lg:py-11 cursor-pointer"
            >
              {/* đường cam chạy khi hover */}
              <span className="pointer-events-none absolute left-0 -bottom-px h-px w-0 bg-[#FF5A1F] transition-[width] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:w-full" />

              {/* 01 */}
              <span className="pt-1.5 lg:pt-0 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-ink/40 group-hover:text-[#FF5A1F] transition-colors">
                {String(i + 1).padStart(2, '0')}
                {p.highlight && (
                  <span className="mt-2 hidden lg:flex items-center gap-1.5 whitespace-nowrap text-[9px] tracking-[0.2em] uppercase text-[#FF5A1F]">
                    <span className="rec-dot w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                    {t.pricing_popular}
                  </span>
                )}
              </span>

              {/* Tên + mô tả */}
              <span className="min-w-0 block">
                {p.highlight && (
                  <span className="mb-2 flex lg:hidden items-center gap-1.5 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] uppercase text-[#FF5A1F]">
                    <span className="rec-dot w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                    {t.pricing_popular}
                  </span>
                )}
                <span className="block font-display uppercase text-[clamp(22px,2.6vw,38px)] leading-[1.05] transition-transform duration-500 group-hover:translate-x-1.5">
                  {p.name}
                </span>
                <span className="mt-2 block font-serif-accent text-lg lg:text-xl text-ink/55">{p.desc}</span>
              </span>

              {/* Mũi tên (mobile ở cột 3, desktop ở cột cuối) */}
              <span className="lg:order-last grid place-items-center w-11 h-11 lg:w-14 lg:h-14 rounded-full border border-ink/20 text-ink/70 transition-all duration-500 group-hover:bg-[#FF5A1F] group-hover:border-[#FF5A1F] group-hover:text-paper group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </span>

              {/* Bao gồm */}
              <span className="col-span-3 lg:col-span-1 grid gap-1.5 text-[13px] leading-snug text-ink/60">
                {p.includes.map((item) => (
                  <span key={item} className="flex items-baseline gap-3">
                    <span className="w-3 h-px shrink-0 translate-y-[-3px] bg-[#FF5A1F]/70" />
                    {item}
                  </span>
                ))}
              </span>

              {/* Giá */}
              <span className="col-span-3 lg:col-span-1 lg:text-right">
                <Price p={p} />
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* Ghi chú + CTA */}
      <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {note && <p className="max-w-xl text-[12px] leading-relaxed text-ink/40">* {note}</p>}
        <button
          type="button"
          onClick={() => setSelected(null)}
          data-cursor="pointer"
          className="self-start sm:self-auto whitespace-nowrap inline-flex items-center gap-3 rounded-full bg-[#FF5A1F] hover:bg-[#e04b14] px-8 py-4 text-paper text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] cursor-pointer"
        >
          {t.pricing_cta}
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Popup liên hệ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(undefined)}
          data-lenis-prevent
        >
          <div
            role="dialog"
            aria-modal="true"
            className={`jg-pop relative w-full max-w-[380px] ${panelCls}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(undefined)}
              aria-label={en ? 'Close' : 'Đóng'}
              data-cursor="pointer"
              className="absolute right-3 top-3 z-10 grid place-items-center w-8 h-8 rounded-full text-ink/50 hover:text-ink hover:bg-ink/[0.06] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <ContactCard
              lang={lang}
              header={
                selected && (
                  <div className="mx-1 mb-2 rounded-xl border border-ink/10 bg-ink/[0.03] px-3.5 py-3">
                    <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.22em] uppercase text-ink/40">{t.pricing_selected}</p>
                    <div className="mt-1 flex items-baseline justify-between gap-3">
                      <p className="text-[14px] font-semibold text-ink">{selected.name}</p>
                      <p className="text-[13px] text-ink/70 whitespace-nowrap">
                        {selected.price ? `${t.pricing_from} ${selected.price}` : <span className="font-serif-accent text-[15px]">{t.pricing_custom}</span>}
                      </p>
                    </div>
                  </div>
                )
              }
            />
          </div>
        </div>
      )}
    </section>
  );
};
