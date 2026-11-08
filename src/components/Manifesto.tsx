import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface ManifestoProps {
  lang: Language;
}

export const Manifesto: React.FC<ManifestoProps> = ({ lang }) => {
  const t = translations[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState({ events: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 } // Runs when element enters 15% of viewport
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Count-up effect for 500+
  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const target = 500;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setCounts({ events: target });
        clearInterval(interval);
      } else {
        setCounts({ events: current });
      }
    }, 25);

    return () => clearInterval(interval);
  }, [inView]);

  const words = t.manifesto.split(' ');

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 px-6 sm:px-12 max-w-6xl mx-auto flex flex-col justify-center select-none"
    >
      {/* 1 Single Sentence: Words light up progressively */}
      <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight leading-[1.05] mb-12 sm:mb-16 text-ink">
        {words.map((word, idx) => (
          <span
            key={idx}
            className={`inline-block mr-3 sm:mr-5 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0 text-ink' : 'opacity-25 translate-y-2 text-ink/30'
            }`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {word === 'lần.' || word === 'once.' ? (
              <span className="font-serif-accent normal-case text-[1.12em]">{word.replace(/\.$/, '')}{word.endsWith('.') && <span className="text-[#FF5A1F]">.</span>}</span>
            ) : (
              word
            )}
          </span>
        ))}
      </h2>

      {/* 3 Count-up / Highlight Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-ink/10">
        <div
          className={`transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
          }`}
        >
          <div className="font-display text-5xl sm:text-6xl font-bold text-ink">
            {counts.events > 0 ? counts.events : 500}<span className="text-[#FF5A1F]">+</span>
          </div>
          <div className="font-sans text-xs tracking-widest text-ink/50 uppercase mt-2">
            {t.metric_events}
          </div>
        </div>

        <div
          className={`transition-all duration-700 delay-300 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
          }`}
        >
          <div className="font-display text-5xl sm:text-6xl font-bold text-[#FF5A1F]">
            4K
          </div>
          <div className="font-sans text-xs tracking-widest text-ink/50 uppercase mt-2">
            {t.metric_res}
          </div>
        </div>

        <div
          className={`transition-all duration-700 delay-400 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
          }`}
        >
          <div className="font-display text-5xl sm:text-6xl font-bold text-ink">
            24h
          </div>
          <div className="font-sans text-xs tracking-widest text-ink/50 uppercase mt-2">
            {t.metric_delivery}
          </div>
        </div>
      </div>
    </section>
  );
};
