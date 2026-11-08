import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, ChevronDown, Share2, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ContactCard, SocialCard, panelCls } from './ContactPanels';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onToggleLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState<null | 'contact' | 'share'>(null);
  const openRef = useRef(open);
  openRef.current = open;
  const clusterRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Đóng popover khi bấm ra ngoài / nhấn Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (clusterRef.current && !clusterRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Cho phép popup báo giá / nút ở nơi khác mở bảng liên hệ trên menu
  useEffect(() => {
    const h = () => setOpen('contact');
    window.addEventListener('jg:open-contact', h);
    return () => window.removeEventListener('jg:open-contact', h);
  }, []);
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('light') ? 'light' : 'dark'
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.add('theme-anim');
    root.classList.toggle('light', next === 'light');
    root.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('jg-theme', next);
    } catch (e) {
      /* ignore */
    }
    setTheme(next);
    window.setTimeout(() => root.classList.remove('theme-anim'), 650);
  };

  const themeLabel =
    theme === 'dark'
      ? lang === 'vi' ? 'Chuyển sang nền sáng' : 'Switch to light mode'
      : lang === 'vi' ? 'Chuyển sang nền tối' : 'Switch to dark mode';

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      // Hide on scroll down, show on scroll up
      if (openRef.current) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const h = document.querySelector('header')?.getBoundingClientRect().height ?? 72;
    document.documentElement.style.setProperty('--nav-offset', visible ? `${Math.round(h)}px` : '0px');
  }, [visible, scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-12 gap-3 flex items-center justify-between font-sans text-xs tracking-widest uppercase transition-all duration-300 pointer-events-auto ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'py-4 sm:py-5 bg-paper/75 backdrop-blur-[12px] border-b border-ink/[0.08]'
          : 'py-6 sm:py-7 bg-transparent border-b border-transparent'
      }`}
    >
      {/* Brand */}
      <a
        href="#"
        data-cursor="pointer"
        className="shrink-0 whitespace-nowrap font-display text-[13px] min-[400px]:text-sm sm:text-base font-extrabold tracking-wide sm:tracking-wider text-ink"
      >
        JACKGRAPHER<span className="text-[#FF5A1F]">.</span>
      </a>

      {/* Center Nav */}
      <nav className="hidden sm:flex items-center gap-8 text-ink/60">
        <button
          onClick={() => scrollTo('works')}
          data-cursor="pointer"
          className="hover:text-ink transition-colors cursor-pointer"
        >
          {lang === 'vi' ? 'Tác phẩm' : 'Works'}
        </button>
        <button
          onClick={() => scrollTo('pricing')}
          data-cursor="pointer"
          className="hover:text-ink transition-colors cursor-pointer"
        >
          {lang === 'vi' ? 'Báo giá' : 'Pricing'}
        </button>
      </nav>

      {/* Language Switch */}
      <div ref={clusterRef} className="relative shrink-0 flex items-center gap-1.5 min-[400px]:gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          data-cursor="pointer"
          aria-label={themeLabel}
          title={themeLabel}
          className="relative hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-ink/15 text-ink/70 hover:text-[#FF5A1F] hover:border-[#FF5A1F] transition-colors cursor-pointer overflow-hidden"
        >
          <Sun
            className={'absolute w-4 h-4 transition-all duration-500 ' + (theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0')}
          />
          <Moon
            className={'absolute w-4 h-4 transition-all duration-500 ' + (theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0')}
          />
        </button>
        <button
          onClick={onToggleLang}
          data-cursor="pointer"
          className="px-1.5 whitespace-nowrap text-ink/60 hover:text-[#FF5A1F] transition-colors cursor-pointer font-bold"
        >
          {lang === 'vi' ? 'EN' : 'VI'}
        </button>

        {/* Liên hệ ⌄ */}
        <button
          onClick={() => setOpen(open === 'contact' ? null : 'contact')}
          data-cursor="pointer"
          aria-expanded={open === 'contact'}
          aria-haspopup="dialog"
          aria-label={t.nav_contact}
          className={`h-9 shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-1.5 rounded-full border w-9 min-[400px]:w-auto min-[400px]:pl-4 min-[400px]:pr-3 text-[11px] font-semibold transition-colors cursor-pointer ${
            open === 'contact' ? 'border-[#FF5A1F] text-[#FF5A1F]' : 'border-ink/15 text-ink/80 hover:border-ink/40 hover:text-ink'
          }`}
        >
          <MessageCircle className="w-4 h-4 min-[400px]:hidden" strokeWidth={1.8} />
          <span className="hidden min-[400px]:inline">{t.nav_contact}</span>
          <ChevronDown className={`hidden min-[400px]:block w-3.5 h-3.5 transition-transform duration-300 ${open === 'contact' ? 'rotate-180' : ''}`} />
        </button>

        {/* Chia sẻ / mạng xã hội */}
        <button
          onClick={() => setOpen(open === 'share' ? null : 'share')}
          data-cursor="pointer"
          aria-expanded={open === 'share'}
          aria-haspopup="dialog"
          aria-label={t.sp_title}
          className={`w-9 h-9 shrink-0 grid place-items-center rounded-full border transition-colors cursor-pointer ${
            open === 'share' ? 'border-[#FF5A1F] text-[#FF5A1F]' : 'border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink'
          }`}
        >
          <Share2 className="w-4 h-4" strokeWidth={1.8} />
        </button>

        {open && (
          <div
            role="dialog"
            data-lenis-prevent
            className={`jg-pop absolute right-0 top-[calc(100%+14px)] w-[min(340px,calc(100vw-32px))] ${panelCls}`}
          >
            {open === 'contact' ? <ContactCard lang={lang} /> : <SocialCard lang={lang} />}
          </div>
        )}
      </div>
    </header>
  );
};
