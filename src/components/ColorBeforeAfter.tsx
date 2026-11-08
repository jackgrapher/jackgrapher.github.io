import React, { useState, useRef, useCallback } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface ColorBeforeAfterProps {
  lang: Language;
}

export const ColorBeforeAfter: React.FC<ColorBeforeAfterProps> = ({ lang }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let percentage = ((clientX - rect.left) / rect.width) * 100;
    if (percentage < 3) percentage = 3;
    if (percentage > 97) percentage = 97;
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="py-16 lg:py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
      {/* 1 Minimalist Heading */}
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-ink/10">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-ink">
          {t.grading_title}
        </h2>
        <div className="font-sans text-xs tracking-widest text-ink/40 uppercase">
          {t.grading_after} ⟷ {t.grading_before}
        </div>
      </div>

      {/* Clean Drag Comparison Slider */}
      <div
        ref={containerRef}
        data-cursor="pointer"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[400px] sm:h-[550px] md:h-[650px] overflow-hidden select-none cursor-ew-resize"
      >
        {/* Layer 1: Flat S-Log3 Original */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1800&auto=format&fit=crop"
            alt="Before"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter grayscale-[88%] brightness-[0.92] contrast-[0.70]"
          />
          <span className="absolute bottom-6 right-6 font-sans text-xs tracking-widest text-white/70 uppercase">
            {t.grading_before}
          </span>
        </div>

        {/* Layer 2: Graded Hollywood Finish */}
        <div
          className="absolute inset-0 h-full overflow-hidden border-r border-[#FF5A1F]"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
              minWidth: '800px',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1800&auto=format&fit=crop"
              alt="After"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-[1.28] saturate-[1.4] brightness-[1.02]"
            />
          </div>

          <span className="absolute bottom-6 left-6 font-sans text-xs tracking-widest text-[#FF5A1F] uppercase font-bold">
            {t.grading_after}
          </span>
        </div>

        {/* Minimal Hairline Divider Handle */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center -ml-[14px]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-paper border border-[#FF5A1F] text-[#FF5A1F] flex items-center justify-center text-[10px] font-bold">
            ↔
          </div>
        </div>
      </div>
    </section>
  );
};
