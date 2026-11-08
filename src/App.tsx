/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Works } from './components/Works';
import { ColorBeforeAfter } from './components/ColorBeforeAfter';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { CustomCursor } from './components/CustomCursor';
import { portfolioProjects } from './data/portfolioData';
import { Language, Project } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxList, setLightboxList] = useState<Project[]>(portfolioProjects);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  // Scroll reveal: mỗi khối hiện dần (mờ -> rõ, trượt lên) khi vào khung nhìn
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pick = (el: Element, depth: number): Element[] => {
      const kids = Array.from(el.children).filter((k) => k.tagName !== 'STYLE' && k.tagName !== 'SCRIPT');
      if (depth < 2 && kids.length === 1 && kids[0].children.length > 1) return pick(kids[0], depth + 1);
      return kids;
    };
    const groups = Array.from(document.querySelectorAll('main > section'))
      .slice(1)
      .concat(Array.from(document.querySelectorAll('footer')));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' }
    );
    groups.forEach((g) => {
      pick(g, 0).forEach((el, i) => {
        const h = el as HTMLElement;
        h.classList.add('reveal');
        h.style.setProperty('--reveal-delay', Math.min(i, 4) * 90 + 'ms');
        io.observe(h);
      });
    });
    return () => io.disconnect();
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  return (
    <div className="relative min-h-screen bg-paper text-ink font-sans selection:bg-[#FF5A1F] selection:text-paper overflow-x-clip">
      {/* 35mm Film Grain Overlay (Opacity 0.04) */}
      <div className="film-grain" aria-hidden="true" />

      {/* Minimalist Difference Custom Cursor */}
      <CustomCursor />

      {/* Fixed Luxury Minimalist Header */}
      <Navbar lang={lang} onToggleLang={toggleLanguage} />

      {/* Main Flow: 1 Idea Per Section with Generous Whitespace */}
      <main>
        {/* 1. Hero: 100vh Split (2-Line Massive Headline + Animated Line-Art Photographer) */}
        <Hero lang={lang} />

        {/* 2. Manifesto: Single Sentence Word Reveal + 3 Clean Metrics */}
        <Manifesto lang={lang} />

        {/* 3. Works: Asymmetric Masonry Image Grid + 4-Word Filter */}
        <Works
          projects={portfolioProjects}
          lang={lang}
          onSelectProject={(project, list) => {
            setLightboxList(list);
            setSelectedProject(project);
          }}
        />

        {/* 4. Color Science: Minimalist Before/After Slider */}
        <ColorBeforeAfter lang={lang} />

        {/* 5. Contact: Massive "LET'S SHOOT." + Zalo Action Button */}
        <Contact lang={lang} />
      </main>

      {/* 6. Footer: 1-Line Minimalist Signature */}
      <Footer lang={lang} />

      {/* Lightbox Modal */}
      <LightboxModal
        project={selectedProject}
        projects={lightboxList}
        lang={lang}
        onNavigate={setSelectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
