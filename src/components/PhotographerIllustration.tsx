import React, { useEffect, useRef, useState } from 'react';

interface PhotographerIllustrationProps {
  onAnimationComplete?: () => void;
}

/**
 * One-line-art: nhiếp ảnh gia (nhìn nghiêng, quay sang trái) đang ngắm chụp
 * bằng máy DSLR + ống kính tele. Nét vẽ tự chạy 1 lần khi tải trang,
 * màu nét theo theme (currentColor = ink), điểm nhấn cam #FF5A1F.
 */

// Các khối che (camera, ống kính) được tô bằng màu nền để nét phía sau bị che như thật.
const OCC: React.CSSProperties = { fill: 'var(--c-paper)' };
const ORANGE = '#FF5A1F';

const STYLES =
  '@keyframes piBlink{0%,60%{opacity:1}61%,100%{opacity:.15}}.pi-rec{animation:piBlink 1.4s steps(1) infinite}' +
  '@keyframes piIn{from{opacity:0}to{opacity:1}}.pi-in{animation:piIn .8s ease-out both}' +
  '@keyframes piBreath{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}.pi-breath{animation:piBreath 5s ease-in-out infinite}';

export const PhotographerIllustration: React.FC<PhotographerIllustrationProps> = ({ onAnimationComplete }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [ready, setReady] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [snap, setSnap] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Vẽ nét (stroke-dashoffset) chạy 1 lần
  useEffect(() => {
    const done = window.setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 350);
    const svg = svgRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!svg || reduce || typeof (svg as any).animate !== 'function') {
      setReady(true);
      setDrawn(true);
      return () => window.clearTimeout(done);
    }
    const els = Array.from(svg.querySelectorAll<SVGGeometryElement>('[data-draw]'));
    const anims: Animation[] = [];
    let t = 0;
    els.forEach((el) => {
      let len = 0;
      try {
        len = el.getTotalLength();
      } catch (e) {
        len = 0;
      }
      if (!len) return;
      const dur = Math.min(1500, Math.max(360, len * 2.4));
      el.style.strokeDasharray = len + ' ' + len;
      el.style.strokeDashoffset = String(len);
      const a = el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: dur,
        delay: t,
        easing: 'cubic-bezier(.65,0,.35,1)',
        fill: 'forwards',
      });
      a.onfinish = () => {
        el.style.strokeDasharray = 'none';
        el.style.strokeDashoffset = '0';
      };
      anims.push(a);
      t += 55;
    });
    setReady(true);
    const fin = window.setTimeout(() => setDrawn(true), t + 900);
    return () => {
      window.clearTimeout(done);
      window.clearTimeout(fin);
      anims.forEach((a) => a.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nháy "chụp" định kỳ sau khi vẽ xong
  useEffect(() => {
    if (!drawn) return;
    let off = 0;
    const id = window.setInterval(() => {
      setSnap(true);
      off = window.setTimeout(() => setSnap(false), 170);
    }, 5200);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(off);
    };
  }, [drawn]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  const detail = { strokeWidth: 1, opacity: 0.55 } as const;

  return (
    <div
      className="relative w-full select-none"
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      aria-hidden="true"
    >
      <style>{STYLES}</style>
      <div
        className="transition-transform duration-500 ease-out"
        style={{
          transform:
            'perspective(1000px) rotateY(' + (tilt.x * 7).toFixed(2) + 'deg) rotateX(' + (-tilt.y * 5).toFixed(2) + 'deg)',
        }}
      >
        <svg
          ref={svgRef}
          viewBox="-70 60 560 540"
          className="w-full h-auto max-h-[78vh] text-ink overflow-visible"
          style={{ opacity: ready ? 1 : 0 }}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id="piFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.8" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="piMask">
              <rect x="-80" y="50" width="600" height="560" fill="url(#piFade)" />
            </mask>
            <radialGradient id="piFlash">
              <stop offset="0" stopColor={ORANGE} stopOpacity="0.55" />
              <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
            </radialGradient>
          </defs>

          <g mask="url(#piMask)" className="pi-breath">
            {/* ---------- TORSO / JACKET ---------- */}
            <path data-draw d="M444 330 C460 362 468 410 470 460 C472 500 468 540 462 590" />
            <path data-draw d="M336 340 C320 382 312 432 316 482 C318 522 322 556 326 590" />
            <path data-draw d="M346 300 C338 312 334 326 336 340" />
            <path data-draw d="M420 288 C434 300 442 314 444 330" />
            <path data-draw d="M352 296 C372 308 398 308 422 292" />
            <path data-draw d="M424 312 C412 340 404 362 398 384" style={detail} />
            <path data-draw d="M352 474 C372 469 396 469 416 474 L412 528" style={detail} />
            <path data-draw d="M446 420 C440 446 438 476 440 506" style={detail} />
            <path d="M342 348 C332 402 330 472 336 584" strokeWidth={1} strokeDasharray="2 6" opacity={0.5} className="pi-in" style={{ animationDelay: '1.6s' }} />

            {/* ---------- NECK ---------- */}
            <path data-draw d="M350 280 C352 290 350 298 346 306" />
            <path data-draw d="M402 246 C404 262 410 276 420 288" />

            {/* ---------- HEAD ---------- */}
            {/* cranium + nape */}
            <path data-draw d="M318 96 C316 86 326 76 340 74 C346 64 362 60 372 66 C384 58 402 62 406 74 C420 78 430 92 428 108 C436 122 434 140 426 152 C428 172 424 186 420 196 C412 214 405 230 402 246" />
            {/* forehead -> brow (meets eyecup) */}
            <path data-draw d="M318 96 C306 108 300 124 298 142" />
            {/* nose / mouth pressed to camera back, chin, jaw */}
            <path data-draw d="M304 178 C308 190 303 200 292 205" />
            <path data-draw d="M292 216 C298 218 301 226 300 234 C302 250 306 262 316 272 C326 280 342 282 354 278 C366 274 374 262 378 250" />
            {/* eyebrow + lashes peeking above eyecup */}
            <path data-draw d="M300 133 C308 127 318 127 327 131" />
            <path data-draw d="M306 146 C310 143 314 143 318 146" style={detail} />
            {/* ear */}
            <path data-draw d="M372 168 C384 158 396 170 394 186 C392 202 383 210 374 207" />
            <path data-draw d="M379 177 C386 180 387 190 381 196" style={detail} />
            {/* hair */}
            <path data-draw d="M326 90 C340 92 350 100 354 114" style={detail} />
            <path data-draw d="M358 74 C368 86 372 100 369 114" style={detail} />
            <path data-draw d="M388 70 C400 84 405 100 402 118 M414 96 C422 110 423 126 418 140" style={detail} />
            <path data-draw d="M362 146 C368 156 369 166 366 176" style={detail} />
            <path data-draw d="M404 150 C410 166 412 182 410 196" style={detail} />

            {/* ---------- CAMERA STRAP (behind arms) ---------- */}
            <path data-draw d="M194 152 C182 222 206 290 268 302 C320 312 380 290 412 262" />
            <path data-draw d="M201 154 C190 220 212 282 270 294 C318 303 374 284 404 258" style={detail} />

            {/* ---------- RIGHT FOREARM (grip hand, behind camera) ---------- */}
            <path data-draw d="M262 236 C272 262 286 284 306 304" />
            <path data-draw d="M286 236 C296 252 306 266 320 280" />

            {/* ---------- LEFT ARM (supports the lens) ---------- */}
            {/* upper arm */}
            <path data-draw d="M282 362 C310 340 350 318 382 302" />
            <path data-draw d="M278 386 C318 374 360 358 398 340" />
            {/* elbow */}
            <path data-draw d="M246 372 C252 386 266 390 278 386 C288 380 288 368 282 362" />
            {/* forearm */}
            <path data-draw d="M168 262 C190 292 222 340 246 372" />
            <path data-draw d="M148 246 C172 252 196 270 214 294 C232 318 252 344 270 362" />
            {/* sleeve cuff + folds */}
            <path data-draw d="M158 252 C170 262 176 276 172 290" style={detail} />
            <path data-draw d="M216 302 C224 310 227 320 224 330" style={detail} />
            <path data-draw d="M296 356 C303 366 301 376 294 384" style={detail} />
            <path data-draw d="M312 350 C320 360 320 370 313 378" style={detail} />

            {/* ---------- CAMERA BODY ---------- */}
            <path data-draw style={OCC} d="M196 138 H280 Q290 138 290 148 V228 Q290 238 280 238 H196 Q186 238 186 228 V148 Q186 138 196 138 Z" />
            {/* pentaprism + hot shoe */}
            <path data-draw style={OCC} d="M210 138 L222 112 H260 L272 138 Z" />
            <path data-draw d="M230 112 V105 H252 V112" />
            {/* mode dial */}
            <path data-draw style={OCC} d="M268 138 V128 H288 V138" />
            <ellipse data-draw cx={278} cy={128} rx={10} ry={3.5} style={OCC} />
            {/* eyecup / viewfinder */}
            <path data-draw style={OCC} d="M290 150 H300 Q305 150 305 155 V173 Q305 178 300 178 H290" />
            {/* side details */}
            <path data-draw d="M196 158 H272" style={detail} />
            <path data-draw d="M196 222 H272" style={detail} />
            <circle data-draw cx={200} cy={200} r={5} />
            <path data-draw d="M212 192 h10 v16 h-10 z" style={detail} />
            <circle data-draw cx={256} cy={190} r={13} style={detail} />
            <circle data-draw cx={256} cy={190} r={6} style={detail} />
            {/* strap lug */}
            <circle data-draw cx={196} cy={149} r={3.5} />

            {/* ---------- LENS ---------- */}
            {/* mount */}
            <path data-draw style={OCC} d="M186 150 H178 V226 H186" />
            <path data-draw style={OCC} d="M178 154 H160 V222 H178 Z" />
            {/* zoom ring */}
            <path data-draw style={OCC} d="M160 146 H118 V230 H160 Z" />
            <path
              d="M154 146 V230 M148 146 V230 M142 146 V230 M136 146 V230 M130 146 V230 M124 146 V230"
              strokeWidth={0.9}
              opacity={0.35}
              className="pi-in"
              style={{ animationDelay: '1.9s' }}
            />
            {/* front barrel */}
            <path data-draw style={OCC} d="M118 142 H72 V234 H118 Z" />
            <path data-draw d="M112 160 H80" style={detail} />
            <path data-draw d="M112 168 H96" style={detail} />
            <path data-draw d="M104 204 h8 v12 h-8 z" style={detail} />
            {/* hood */}
            <path data-draw style={OCC} d="M72 138 L38 127 V249 L72 238 Z" />
            <ellipse data-draw cx={38} cy={188} rx={11} ry={61} style={OCC} />
            <ellipse data-draw cx={39} cy={188} rx={6} ry={38} style={detail} />

            {/* ---------- LEFT HAND (fingers wrap the lens) ---------- */}
            <path data-draw d="M168 262 C150 258 120 250 104 240" />
            <path data-draw style={OCC} d="M104 240 C96 236 94 222 100 212 C104 206 110 208 110 214 C110 222 108 230 112 236" />
            <path data-draw style={OCC} d="M112 236 C108 226 110 214 118 210 C124 208 128 214 126 222 C124 230 124 236 128 240" />
            <path data-draw style={OCC} d="M128 240 C126 230 128 220 136 218 C142 218 144 224 142 232 C141 238 142 242 148 246" />
            <path data-draw d="M101 221 C104 220 107 221 109 223 M118 220 C121 219 124 220 126 222 M135 227 C138 226 141 227 142 229" style={detail} />

            {/* ---------- ORANGE ACCENTS ---------- */}
            <g className={drawn ? 'pi-in' : 'opacity-0'}>
              {/* lens glint */}
              <path d="M33 156 C29 174 29 202 33 220" stroke={ORANGE} strokeWidth={1.5} />
              {/* REC dot */}
              <circle cx={300} cy={110} r={3.5} fill={ORANGE} stroke="none" className="pi-rec" />
            </g>
          </g>

          {/* AF focus brackets in front of the lens */}
          <g
            className={drawn ? 'pi-in' : 'opacity-0'}
            stroke={ORANGE}
            strokeWidth={1.5}
            style={{
              transformOrigin: '-40px 188px',
              transform: snap ? 'scale(0.86)' : 'scale(1)',
              transition: 'transform .18s ease-out',
            }}
          >
            <path d="M-66 166 V156 H-56 M-24 156 H-14 V166 M-14 210 V220 H-24 M-56 220 H-66 V210" />
            <path d="M-44 188 H-36 M-40 184 V192" strokeWidth={1} />
          </g>

          {/* Shutter flash */}
          <circle
            cx={-10}
            cy={188}
            r={90}
            fill="url(#piFlash)"
            stroke="none"
            style={{ opacity: snap ? 1 : 0, transition: snap ? 'opacity .05s' : 'opacity .5s ease-out' }}
          />
        </svg>
      </div>
    </div>
  );
};
