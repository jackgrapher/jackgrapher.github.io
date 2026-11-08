import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Film,
  Camera,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Project, Language } from '../types';
import { translations } from '../data/translations';
import { categoryLabel } from './Works';

interface LightboxModalProps {
  project: Project | null;
  projects?: Project[];
  lang: Language;
  onClose: () => void;
  onNavigate?: (project: Project) => void;
}

const ZALO_URL = 'https://zalo.me/[SỐ ĐIỆN THOẠI]';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
const pad = (n: number) => (n < 10 ? '0' + n : String(n));
const youtubeId = (url: string) => {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
};

const STYLES =
  '@keyframes jgFade{from{opacity:0}to{opacity:1}}.jg-fade{animation:jgFade .25s ease-out both}' +
  '@keyframes jgZoom{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:none}}.jg-zoom{animation:jgZoom .5s cubic-bezier(.2,.7,.2,1) both}' +
  '.jg-noscroll{scrollbar-width:none}.jg-noscroll::-webkit-scrollbar{display:none}';

export const LightboxModal: React.FC<LightboxModalProps> = ({
  project,
  projects = [],
  lang,
  onClose,
  onNavigate,
}) => {
  const t = translations[lang];
  const [shot, setShot] = useState(0);
  const idx = project ? projects.findIndex((p) => p.id === project.id) : -1;
  const total = projects.length;
  const canNav = !!onNavigate && idx >= 0 && total > 1;

  const go = useCallback(
    (dir: number) => {
      if (!onNavigate || idx < 0 || total < 2) return;
      onNavigate(projects[(idx + dir + total) % total]);
    },
    [onNavigate, idx, total, projects]
  );

  const images = useMemo(
    () => (project ? (project.gallery && project.gallery.length ? project.gallery : [project.highResUrl]) : []),
    [project]
  );

  useEffect(() => {
    setShot(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose, go]);

  if (!project) return null;

  const title = lang === 'vi' ? project.title : project.titleEn;
  const desc = lang === 'vi' ? project.description : project.descriptionEn;
  const isVideo = project.mediaType === 'video' && !!project.videoUrl;
  const yt = isVideo && project.videoUrl ? youtubeId(project.videoUrl) : null;
  const next = canNav ? projects[(idx + 1) % total] : undefined;

  const navBtn =
    'absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-black/45 backdrop-blur-md text-white hover:bg-[#FF5A1F] hover:border-[#FF5A1F] hover:text-paper transition-colors cursor-pointer';

  return (
    <div
      onClick={onClose}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="jg-fade fixed inset-0 z-[60] overflow-y-auto bg-paper/95 backdrop-blur-xl"
    >
      <style>{STYLES}</style>

      <button
        onClick={onClose}
        data-cursor="pointer"
        aria-label="Close"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-black/45 backdrop-blur-md text-white hover:bg-[#FF5A1F] hover:border-[#FF5A1F] hover:text-paper transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto max-w-7xl min-h-full flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 px-4 sm:px-8 py-20 lg:py-12"
      >
        {/* Media */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="relative">
            <div
              key={project.id + '-' + shot}
              className="jg-zoom relative w-full overflow-hidden rounded-xl bg-surface ring-1 ring-ink/5 flex items-center justify-center"
            >
              {isVideo ? (
                yt ? (
                  <div className="w-full aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={'https://www.youtube.com/embed/' + yt + '?autoplay=1&rel=0&modestbranding=1'}
                      title={title}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    src={project.videoUrl}
                    poster={project.highResUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[78vh] bg-black"
                  />
                )
              ) : (
                <img
                  src={images[shot]}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[78vh] object-contain"
                />
              )}
            </div>

            {canNav && (
              <>
                <button onClick={() => go(-1)} data-cursor="pointer" aria-label={t.lb_prev} className={cx(navBtn, 'left-3')}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => go(1)} data-cursor="pointer" aria-label={t.lb_next} className={cx(navBtn, 'right-3')}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {!isVideo && images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto jg-noscroll">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setShot(i)}
                  data-cursor="pointer"
                  aria-label={'Photo ' + (i + 1)}
                  className={cx(
                    'relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-md overflow-hidden ring-1 transition-all cursor-pointer',
                    i === shot ? 'ring-[#FF5A1F] opacity-100' : 'ring-transparent opacity-45 hover:opacity-100'
                  )}
                >
                  <img
                    src={src.replace('w=1800', 'w=320')}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <aside className="lg:w-[340px] shrink-0 flex flex-col gap-6">
          <div className="flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-ink/40 tabular-nums">
            <span>{idx >= 0 ? pad(idx + 1) + ' / ' + pad(total) : ''}</span>
            <span className="flex items-center gap-1.5 text-[#FF5A1F]">
              {isVideo ? <Film className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
              {categoryLabel(t, project.category)}
            </span>
          </div>

          <div>
            <h2 className="font-display text-3xl sm:text-4xl uppercase leading-[1.1]">{title}</h2>
            {project.client && (
              <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-ink/50">
                {t.lb_client}: <span className="text-ink">{project.client}</span>
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-5 border-y border-ink/10 py-5">
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-ink/40">
                <MapPin className="w-3 h-3" />
                {t.lb_location}
              </dt>
              <dd className="mt-1.5 text-sm">{project.location}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-ink/40">
                <Calendar className="w-3 h-3" />
                {t.lb_year}
              </dt>
              <dd className="mt-1.5 text-sm tabular-nums">{project.year}</dd>
            </div>
            {project.duration && (
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-ink/40">
                  <Clock className="w-3 h-3" />
                  {t.lb_duration}
                </dt>
                <dd className="mt-1.5 text-sm tabular-nums">{project.duration}</dd>
              </div>
            )}
            {!isVideo && (
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-ink/40">
                  <Camera className="w-3 h-3" />
                  {t.lb_photos}
                </dt>
                <dd className="mt-1.5 text-sm tabular-nums">
                  {pad(shot + 1)} / {pad(images.length)}
                </dd>
              </div>
            )}
          </dl>

          {desc && <p className="text-sm leading-relaxed text-ink/70">{desc}</p>}

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-ink/10 text-[10px] tracking-[0.18em] uppercase text-ink/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={ZALO_URL}
            target="_blank"
            rel="noopener"
            data-cursor="pointer"
            className="group flex items-center justify-between gap-3 rounded-full bg-[#FF5A1F] text-paper px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-ink transition-colors"
          >
            {t.lb_book}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {next && (
            <button
              onClick={() => go(1)}
              data-cursor="pointer"
              className="group flex items-center gap-4 pt-2 text-left cursor-pointer"
            >
              <span className="relative shrink-0 w-20 h-14 rounded-md overflow-hidden">
                <img
                  src={next.thumbnailUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] tracking-[0.25em] uppercase text-ink/40">{t.lb_next} →</span>
                <span className="block font-display uppercase text-sm leading-tight line-clamp-2 group-hover:text-[#FF5A1F] transition-colors">
                  {lang === 'vi' ? next.title : next.titleEn}
                </span>
              </span>
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};
