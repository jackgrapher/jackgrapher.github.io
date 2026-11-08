import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Play,
  Camera,
  Film,
  X,
  ArrowUpRight,
  ChevronDown,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import {
  Project,
  ProjectFilter,
  MediaFilter,
  CityFilter,
  SortOrder,
  ViewMode,
  Language,
} from '../types';
import { translations } from '../data/translations';

type T = typeof translations.vi;

interface WorksProps {
  projects: Project[];
  lang: Language;
  onSelectProject: (project: Project, list: Project[]) => void;
}

const PAGE = 6;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
const pad = (n: number) => (n < 10 ? '0' + n : String(n));
const isMp4 = (u?: string) => !!u && /\.(mp4|webm|mov)(\?|$)/i.test(u);

const CAT_KEY = {
  event: 'filter_event',
  wedding: 'filter_wedding',
  brand: 'filter_brand',
  concert: 'filter_concert',
} as const;

export const categoryLabel = (t: T, c: Project['category']) => t[CAT_KEY[c]];

const STYLES =
  '@keyframes jgRise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}' +
  '.jg-rise{animation:jgRise .75s cubic-bezier(.2,.7,.2,1) both}' +
  '.jg-noscroll{scrollbar-width:none}.jg-noscroll::-webkit-scrollbar{display:none}' +
  '@media (prefers-reduced-motion: reduce){.jg-rise{animation:none}}';

/* ---------- Small UI pieces ---------- */

const Select: React.FC<{
  value: string;
  label: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}> = ({ value, label, onChange, options }) => (
  <label className="relative inline-flex items-center shrink-0">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-cursor="pointer"
      className={cx(
        'appearance-none rounded-full pl-4 pr-9 py-2 text-[11px] tracking-[0.18em] uppercase cursor-pointer focus:outline-none transition-colors border',
        value !== 'all' && value !== 'newest'
          ? 'border-[#FF5A1F]/60 text-[#FF5A1F] bg-[#FF5A1F]/[0.06]'
          : 'border-ink/10 text-ink/70 bg-ink/[0.03] hover:border-ink/25'
      )}
    >
      {options.map((o) => (
        <option key={o.v} value={o.v} className="bg-surface text-ink">
          {o.l}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 w-3.5 h-3.5 opacity-60" />
  </label>
);

/* ---------- Grid card ---------- */

const Card: React.FC<{
  p: Project;
  t: T;
  lang: Language;
  big: boolean;
  index: number;
  onOpen: () => void;
}> = ({ p, t, lang, big, index, onOpen }) => {
  const vref = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const title = lang === 'vi' ? p.title : p.titleEn;
  const isVideo = p.mediaType === 'video';
  const canPreview = isVideo && isMp4(p.videoUrl);

  const enter = () => {
    setHover(true);
    const v = vref.current;
    if (v) {
      v.currentTime = 0;
      const pr = v.play();
      if (pr) pr.catch(() => {});
    }
  };
  const leave = () => {
    setHover(false);
    if (vref.current) vref.current.pause();
  };

  return (
    <article
      className={cx('jg-rise group', big ? 'col-span-12 lg:col-span-7' : 'col-span-12 lg:col-span-5')}
      style={{ animationDelay: (index % PAGE) * 70 + 'ms' }}
    >
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={enter}
        onMouseLeave={leave}
        data-cursor="pointer"
        aria-label={title}
        className="block w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F] rounded-xl"
      >
        <div
          className={cx(
            'relative overflow-hidden rounded-xl bg-surface ring-1 ring-ink/5 text-white',
            big ? 'aspect-[4/3]' : 'aspect-[4/3] lg:aspect-[20/21]'
          )}
        >
          <img
            src={p.thumbnailUrl}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.07]"
          />
          {canPreview && (
            <video
              ref={vref}
              src={p.videoUrl}
              muted
              loop
              playsInline
              preload="none"
              className={cx(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                hover ? 'opacity-100' : 'opacity-0'
              )}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/35 transition-opacity duration-500" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[10px] tracking-[0.2em] uppercase">
                {categoryLabel(t, p.category)}
              </span>
              {p.featured && (
                <span className="px-3 py-1 rounded-full bg-[#FF5A1F] text-paper text-[10px] font-bold tracking-[0.2em] uppercase">
                  {t.featured}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[10px] tracking-[0.2em] uppercase tabular-nums">
              {isVideo ? <Film className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
              {isVideo ? p.duration || t.media_video : (p.gallery ? p.gallery.length : 1) + ' ' + t.photos_unit}
            </span>
          </div>

          {/* Play button for films */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className={cx(
                  'flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-white/40 bg-black/25 backdrop-blur-md transition-all duration-500',
                  hover && canPreview ? 'scale-75 opacity-0' : 'scale-100 opacity-100 group-hover:bg-[#FF5A1F] group-hover:border-[#FF5A1F] group-hover:text-paper'
                )}
              >
                <Play className="w-5 h-5 ml-0.5 fill-current" />
              </span>
            </div>
          )}

          {/* Bottom reveal */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {p.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] tracking-[0.15em] uppercase text-white/80">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="shrink-0 flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-[#FF5A1F] font-bold">
              {isVideo ? t.watch_film : t.view_gallery}
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Caption: name left · location right */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg sm:text-xl uppercase leading-tight line-clamp-2 transition-colors group-hover:text-[#FF5A1F]">
              {title}
            </h3>
            {p.client && (
              <p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-ink/40">{p.client}</p>
            )}
          </div>
          <div className="max-w-[38%] shrink-0 text-right text-[11px] tracking-[0.18em] uppercase leading-relaxed text-ink/50">
            <div>{p.location}</div>
            <div className="text-ink/30 tabular-nums">{p.year}</div>
          </div>
        </div>
      </button>
    </article>
  );
};

/* ---------- Section ---------- */

export const Works: React.FC<WorksProps> = ({ projects, lang, onSelectProject }) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [media, setMedia] = useState<MediaFilter>('all');
  const [city, setCity] = useState<CityFilter>('all');
  const [year, setYear] = useState<string>('all');
  const [sort, setSort] = useState<SortOrder>('newest');
  const [view, setView] = useState<ViewMode>('grid');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const years = useMemo(
    () => Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b.localeCompare(a)),
    [projects]
  );

  // Everything except the category filter (used for per-category counts)
  const base = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (media !== 'all' && p.mediaType !== media) return false;
      if (city !== 'all' && p.city !== city) return false;
      if (year !== 'all' && p.year !== year) return false;
      if (q) {
        const hay = [p.title, p.titleEn, p.client || '', p.location, p.tags.join(' ')].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }, [projects, media, city, year, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length };
    base.forEach((p) => {
      c[p.category] = (c[p.category] || 0) + 1;
    });
    return c;
  }, [base]);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? base.slice() : base.filter((p) => p.category === filter);
    const name = (p: Project) => (lang === 'vi' ? p.title : p.titleEn);
    list.sort((a, b) => {
      if (sort === 'az') return name(a).localeCompare(name(b));
      const d = Number(a.year) - Number(b.year);
      if (d !== 0) return sort === 'newest' ? -d : d;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
    return list;
  }, [base, filter, sort, lang]);

  useEffect(() => {
    setVisible(PAGE);
  }, [filter, media, city, year, query, sort]);

  const shown = filtered.slice(0, visible);
  const activeCount =
    (media !== 'all' ? 1 : 0) + (city !== 'all' ? 1 : 0) + (year !== 'all' ? 1 : 0) + (query.trim() ? 1 : 0);
  const hasActive = filter !== 'all' || activeCount > 0;
  const resetAll = () => {
    setFilter('all');
    setMedia('all');
    setCity('all');
    setYear('all');
    setQuery('');
  };
  const animKey = [filter, media, city, year, sort, view, query].join('|');
  const hovered = view === 'list' && hoverId ? projects.find((p) => p.id === hoverId) : undefined;

  const categoryButtons: { id: ProjectFilter; label: string }[] = [
    { id: 'all', label: t.filter_all },
    { id: 'event', label: t.filter_event },
    { id: 'wedding', label: t.filter_wedding },
    { id: 'brand', label: t.filter_brand },
    { id: 'concert', label: t.filter_concert },
  ];

  const mediaButtons: { id: MediaFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t.media_all, icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'photo', label: t.media_photo, icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'video', label: t.media_video, icon: <Film className="w-3.5 h-3.5" /> },
  ];

  const open = (p: Project) => onSelectProject(p, filtered);

  return (
    <section id="works" className="relative py-16 lg:py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
      <style>{STYLES}</style>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10 mb-10 lg:mb-14">
        <div className="min-w-0">
          <p className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#FF5A1F]">
            <span className="w-8 h-px bg-[#FF5A1F]" />
            {t.works_eyebrow}
          </p>
          <h2 className="mt-5 font-display uppercase leading-[1.06] text-[clamp(36px,6.4vw,96px)]">
            {t.works_title_1}
            <br />
            <span className="font-serif-accent normal-case text-ink/90 text-[1.12em] leading-[0.95]">{t.works_title_2.replace(/\.$/, '')}<span className="text-[#FF5A1F]">.</span></span>
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-sm leading-relaxed text-ink/60">{t.works_desc}</p>
          <p className="mt-4 font-display text-4xl tabular-nums">
            {pad(projects.length)}
            <span className="ml-2 align-middle font-sans text-[11px] tracking-[0.25em] uppercase text-ink/40">
              {t.results_unit}
            </span>
          </p>
        </div>
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-[var(--nav-offset,0px)] transition-[top] duration-300 z-30 -mx-6 sm:-mx-10 lg:-mx-16 px-6 sm:px-10 lg:px-16 py-4 mb-10 bg-paper/80 backdrop-blur-xl border-y border-ink/5">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0 flex gap-2 overflow-x-auto jg-noscroll" role="tablist">
            {categoryButtons.map((btn) => {
              const active = filter === btn.id;
              const n = counts[btn.id] || 0;
              return (
                <button
                  key={btn.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(btn.id)}
                  data-cursor="pointer"
                  className={cx(
                    'shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full border text-[11px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer',
                    active
                      ? 'bg-[#FF5A1F] border-[#FF5A1F] text-paper font-bold'
                      : 'border-ink/10 text-ink/60 hover:border-ink/30 hover:text-ink',
                    !active && n === 0 && 'opacity-30'
                  )}
                >
                  {btn.label}
                  <span className={cx('text-[10px] tabular-nums', active ? 'text-paper/60' : 'text-ink/30')}>
                    {pad(n)}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowFilters((s) => !s)}
            data-cursor="pointer"
            className={cx(
              'lg:hidden shrink-0 relative flex items-center gap-2 px-4 py-2.5 rounded-full border text-[11px] tracking-[0.2em] uppercase cursor-pointer transition-colors',
              showFilters ? 'border-ink text-ink' : 'border-ink/10 text-ink/70'
            )}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.filters_label}</span>
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5A1F] text-paper text-[9px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        <div className={cx(showFilters ? 'flex' : 'hidden', 'lg:flex flex-wrap items-center gap-3 mt-4')}>
          <div className="inline-flex p-1 rounded-full border border-ink/10 bg-ink/[0.03]">
            {mediaButtons.map((o) => (
              <button
                key={o.id}
                onClick={() => setMedia(o.id)}
                data-cursor="pointer"
                className={cx(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer',
                  media === o.id ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'
                )}
              >
                {o.icon}
                {o.label}
              </button>
            ))}
          </div>

          <Select
            label="City"
            value={city}
            onChange={(v) => setCity(v as CityFilter)}
            options={[
              { v: 'all', l: t.city_all },
              { v: 'saigon', l: t.city_saigon },
              { v: 'hanoi', l: t.city_hanoi },
              { v: 'other', l: t.city_other },
            ]}
          />
          <Select
            label="Year"
            value={year}
            onChange={setYear}
            options={[{ v: 'all', l: t.year_all }].concat(years.map((y) => ({ v: y, l: y })))}
          />
          <Select
            label="Sort"
            value={sort}
            onChange={(v) => setSort(v as SortOrder)}
            options={[
              { v: 'newest', l: t.sort_newest },
              { v: 'oldest', l: t.sort_oldest },
              { v: 'az', l: t.sort_az },
            ]}
          />

          <label className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search_placeholder}
              className="w-full rounded-full border border-ink/10 bg-ink/[0.03] hover:border-ink/25 focus:border-[#FF5A1F] pl-11 pr-10 py-2 text-sm text-ink placeholder:text-ink/30 focus:outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                data-cursor="pointer"
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink/50 hover:text-[#FF5A1F] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </label>

          <div className="inline-flex p-1 rounded-full border border-ink/10 bg-ink/[0.03]">
            {(['grid', 'list'] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setView(m)}
                data-cursor="pointer"
                aria-label={m === 'grid' ? t.view_grid : t.view_list}
                title={m === 'grid' ? t.view_grid : t.view_list}
                className={cx(
                  'p-2 rounded-full transition-all cursor-pointer',
                  view === m ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'
                )}
              >
                {m === 'grid' ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result line */}
      <div className="flex items-center justify-between gap-4 mb-8 text-[11px] tracking-[0.2em] uppercase text-ink/40">
        <span className="tabular-nums">
          {t.showing} {pad(shown.length)} / {pad(filtered.length)} {t.results_unit}
        </span>
        {hasActive && (
          <button
            onClick={resetAll}
            data-cursor="pointer"
            className="flex items-center gap-1.5 text-ink/60 hover:text-[#FF5A1F] transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            {t.reset_filters}
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-ink/10 rounded-xl">
          <p className="font-display text-2xl uppercase text-ink/60">{t.empty_state}</p>
          <button
            onClick={resetAll}
            data-cursor="pointer"
            className="mt-6 px-6 py-3 rounded-full border border-ink/20 text-xs tracking-[0.2em] uppercase hover:bg-[#FF5A1F] hover:border-[#FF5A1F] hover:text-paper transition-colors cursor-pointer"
          >
            {t.reset_filters}
          </button>
        </div>
      ) : view === 'grid' ? (
        <div key={animKey} className="grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-y-16 items-start">
          {shown.map((p, idx) => {
            const pairIndex = Math.floor(idx / 2);
            const isFirst = idx % 2 === 0;
            const big = pairIndex % 2 === 0 ? isFirst : !isFirst;
            return (
              <Card key={p.id} p={p} t={t} lang={lang} big={big} index={idx} onOpen={() => open(p)} />
            );
          })}
        </div>
      ) : (
        <div
          key={animKey}
          className="border-t border-ink/10"
          onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
          onMouseLeave={() => setHoverId(null)}
        >
          {shown.map((p, i) => {
            const title = lang === 'vi' ? p.title : p.titleEn;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => open(p)}
                onMouseEnter={() => setHoverId(p.id)}
                data-cursor="pointer"
                style={{ animationDelay: (i % PAGE) * 50 + 'ms' }}
                className="jg-rise group w-full grid grid-cols-12 items-center gap-4 py-6 border-b border-ink/10 text-left cursor-pointer hover:bg-ink/[0.02] transition-colors"
              >
                <span className="col-span-2 sm:col-span-1 text-xs text-ink/30 tabular-nums">{pad(i + 1)}</span>
                <span className="col-span-10 sm:col-span-5 min-w-0">
                  <span className="block font-display text-xl sm:text-2xl uppercase leading-tight transition-all duration-300 group-hover:text-[#FF5A1F] group-hover:translate-x-2">
                    {title}
                  </span>
                  <span className="sm:hidden mt-1 block text-[10px] tracking-[0.18em] uppercase text-ink/40">
                    {categoryLabel(t, p.category)} · {p.location} · {p.year}
                  </span>
                </span>
                <span className="hidden sm:flex col-span-2 items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-ink/50">
                  {p.mediaType === 'video' ? <Film className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                  {categoryLabel(t, p.category)}
                </span>
                <span className="hidden sm:block col-span-3 text-[11px] tracking-[0.18em] uppercase text-ink/50 truncate">
                  {p.location}
                </span>
                <span className="hidden sm:flex col-span-1 justify-end items-center gap-2 text-[11px] text-ink/40 tabular-nums">
                  {p.year}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-[#FF5A1F] transition-all" />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Floating preview for list view */}
      {hovered && (
        <div
          className="hidden lg:block fixed z-40 pointer-events-none w-72 aspect-[4/3] rounded-lg overflow-hidden shadow-2xl ring-1 ring-ink/10"
          style={{ left: mouse.x + 28, top: mouse.y - 108 }}
        >
          <img
            src={hovered.thumbnailUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {hovered.mediaType === 'video' && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] tracking-[0.2em] uppercase">
              <Play className="w-3 h-3 fill-current" /> {hovered.duration}
            </span>
          )}
        </div>
      )}

      {/* Load more */}
      {filtered.length > visible && (
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE)}
            data-cursor="pointer"
            className="group flex items-center gap-3 px-8 py-4 rounded-full border border-ink/20 text-xs tracking-[0.25em] uppercase hover:bg-[#FF5A1F] hover:border-[#FF5A1F] hover:text-paper transition-colors cursor-pointer"
          >
            {t.load_more}
            <span className="tabular-nums opacity-60">+{Math.min(PAGE, filtered.length - visible)}</span>
            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      )}
    </section>
  );
};
