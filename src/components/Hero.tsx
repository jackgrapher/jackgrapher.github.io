import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { PhotographerIllustration } from './PhotographerIllustration';
import { Language } from '../types';
import { translations } from '../data/translations';

/* Timecode chạy 24 fps, cập nhật trực tiếp DOM để không re-render Hero */
const Timecode: React.FC = () => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = (now: number) => {
      const totalFrames = Math.floor(((now - start) / 1000) * 24);
      const f = totalFrames % 24;
      const s = Math.floor(totalFrames / 24);
      if (ref.current) {
        ref.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref}>00:00:00:00</span>;
};

interface HeroProps {
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const [headlineRevealed, setHeadlineRevealed] = useState(false);
  const t = translations[lang];

  const scrollToWorks = () => {
    const el = document.getElementById('works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen lg:h-screen lg:max-h-screen w-full flex items-center justify-center px-6 sm:px-10 lg:px-16 pt-24 pb-8 overflow-hidden bg-paper">
      {/* Viewfinder HUD */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-6 sm:inset-x-10 lg:inset-x-16 top-24 bottom-8 hidden md:block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase text-ink/50 transition-opacity duration-1000 ${headlineRevealed ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="vf-corner tl" />
        <span className="vf-corner tr" />
        <span className="vf-corner bl" />
        <span className="vf-corner br" />
        <div className="absolute top-4 left-5 flex items-center gap-2 text-ink/80">
          <span className="rec-dot w-2 h-2 rounded-full bg-[#FF5A1F]" />
          REC
        </div>
        <div className="absolute top-4 right-5 tabular-nums text-ink/80"><Timecode /></div>
        <div className="absolute bottom-4 left-5">ISO 800 · 1/50 · f/1.8</div>
        <div className="absolute bottom-4 right-5">4K · 24P · 2.39:1</div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
        {/* Desktop Left (55%): Headline + Subtitle + Action Button */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center">
          
          {/* Headline Container with Overflow Hidden for Line-by-Line Reveal */}
          <div className="overflow-hidden mb-2 pt-[0.42em]">
            <h1
              className={`font-display font-extrabold uppercase tracking-tight leading-[1.1] text-[clamp(30px,8.6vw,72px)] lg:text-[clamp(46px,4.6vw,70px)] text-ink transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                headlineRevealed ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <div className="whitespace-nowrap">{t.hero_title_1}</div>
              <div className="whitespace-nowrap font-serif-accent normal-case text-ink text-[1.18em] leading-[1.05] tracking-normal">{t.hero_title_2.replace(/\.$/, '')}<span className="text-[#FF5A1F]">.</span></div>
            </h1>
          </div>

          {/* Subtitle: 1 Clean Line */}
          <p
            className={`font-sans text-xs sm:text-sm font-medium tracking-widest text-ink/60 uppercase mt-4 mb-8 transition-all duration-700 delay-200 ease-out ${
              headlineRevealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            {t.hero_sub}
          </p>

          {/* 1 Single Minimalist Action Button: "Xem tác phẩm" */}
          <div
            className={`transition-all duration-700 delay-300 ease-out ${
              headlineRevealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <button
              onClick={scrollToWorks}
              data-cursor="pointer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-ink/20 bg-transparent hover:border-[#FF5A1F] hover:bg-[#FF5A1F] text-ink hover:text-paper font-sans text-xs font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              <span>{t.btn_explore}</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        </div>

        {/* Mobile: Sits below the button (width max 80%). Desktop Right (45%): Sits neatly in right column */}
        <div className="w-[80%] max-w-[340px] sm:max-w-[400px] lg:max-w-none lg:w-[45%] flex items-center justify-center shrink-0">
          <PhotographerIllustration
            onAnimationComplete={() => setHeadlineRevealed(true)}
          />
        </div>
      </div>
    </section>
  );
};
