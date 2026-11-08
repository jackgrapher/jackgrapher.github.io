import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onToggleLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
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
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
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
      className={`fixed top-0 left-0 w-full z-50 px-6 sm:px-12 flex items-center justify-between font-sans text-xs tracking-widest uppercase transition-all duration-300 pointer-events-auto ${
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
        className="font-display text-base font-extrabold tracking-wider text-ink"
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
          onClick={() => scrollTo('contact')}
          data-cursor="pointer"
          className="hover:text-ink transition-colors cursor-pointer"
        >
          {lang === 'vi' ? 'Liên hệ' : 'Contact'}
        </button>
      </nav>

      {/* Language Switch */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          data-cursor="pointer"
          aria-label={themeLabel}
          title={themeLabel}
          className="relative w-9 h-9 flex items-center justify-center rounded-full border border-ink/15 text-ink/70 hover:text-[#FF5A1F] hover:border-[#FF5A1F] transition-colors cursor-pointer overflow-hidden"
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
          className="text-ink/60 hover:text-[#FF5A1F] transition-colors cursor-pointer font-bold"
        >
          {lang === 'vi' ? 'EN' : 'VI'}
        </button>
      </div>
    </header>
  );
};
