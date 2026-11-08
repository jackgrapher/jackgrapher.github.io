import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on devices with hover & fine pointer (mouse), strictly hidden on touch screens
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    if (isTouch) return;

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!hasMoved) {
        setHasMoved(true);
        ringPos.current = { x: e.clientX, y: e.clientY };
      }

      // Dot follows immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isClickable = target.closest(
        'button, a, input, [data-cursor="pointer"], [role="button"], img, .cursor-pointer, .cursor-ew-resize'
      );
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Ring follows with gentle lerp 0.15
    const updateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(updateRing);
    };

    animFrameId.current = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [hasMoved]);

  if (!enabled) return null;

  return (
    <div className={`pointer-events-none custom-cursor ${hasMoved ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      {/* 1. Center dot: follows mouse instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF5A1F] pointer-events-none z-[9999] -ml-1 -mt-1 mix-blend-difference"
      />

      {/* 2. Outer ring: follows with lerp 0.15, scales up 1.8x on hover */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border border-ink/50 transition-all duration-200 ease-out -ml-4 -mt-4 ${
          isHovering
            ? 'w-14 h-14 -ml-7 -mt-7 border-[#FF5A1F] bg-[#FF5A1F]/10 scale-[1.8] mix-blend-difference'
            : 'w-8 h-8 -ml-4 -mt-4 scale-100'
        }`}
      />
    </div>
  );
};
