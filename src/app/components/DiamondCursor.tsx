import { useEffect, useRef } from 'react';

const MOVE_COLORS: Record<string, string> = {
  open:    '#FFD167',
  trace:   '#E27238',
  shift:   '#465BA4',
  surface: '#4DB49F',
  commit:  '#DA3832',
};

const TRAIL_COLORS = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];

// Walk up DOM, find first opaque background, return true if dark
function isBgDark(el: Element): boolean {
  let node: Element | null = el;
  for (let i = 0; i < 20 && node && node !== document.body; i++) {
    const bg = window.getComputedStyle(node as HTMLElement).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      const m = bg.match(/[\d.]+/g);
      if (m && m.length >= 3) {
        return (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255 < 0.45;
      }
    }
    node = node.parentElement;
  }
  return false;
}

export function DiamondCursor() {
  const svgRef   = useRef<SVGSVGElement>(null);
  const rectRef  = useRef<SVGRectElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth < 1024) return;

    const svg  = svgRef.current;
    const rect = rectRef.current;
    if (!svg || !rect) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = '@media (min-width: 1024px) { body, body * { cursor: none !important; } }';
    document.head.appendChild(styleEl);

    let visible = false;
    let moving = false;
    let stillFrames = 0;
    const HISTORY = 30;
    const posH: { x: number; y: number }[] = Array(HISTORY).fill({ x: 0, y: 0 });
    let hi = 0, lastX = 0, lastY = 0, prevX = 0, prevY = 0;
    const trail = trailRefs.current;

    const setTrail = (show: boolean) =>
      trail.forEach((el) => { if (el) el.style.opacity = show ? '0.9' : '0'; });

    /* Trail follows everywhere; it breathes in while moving and
       settles away when the cursor rests, so reading stays calm. */
    let rafId = 0;
    const tick = () => {
      posH[hi] = { x: lastX, y: lastY };
      hi = (hi + 1) % HISTORY;

      const dist = Math.hypot(lastX - prevX, lastY - prevY);
      prevX = lastX; prevY = lastY;
      if (dist > 1.5) {
        stillFrames = 0;
        if (!moving && visible) { moving = true; setTrail(true); }
      } else if (moving && ++stillFrames > 24) {
        moving = false;
        setTrail(false);
      }

      trail.forEach((el, i) => {
        const p = posH[(hi - (i + 1) * 3 + HISTORY) % HISTORY];
        if (el) { el.style.left = p.x + 'px'; el.style.top = p.y + 'px'; }
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;

      // Position: direct style, no transition
      svg.style.left = e.clientX + 'px';
      svg.style.top  = e.clientY + 'px';

      if (!visible) { svg.style.opacity = '1'; visible = true; }

      const target    = e.target as Element;
      const moveEl    = target.closest('[data-move]') as HTMLElement | null;
      const linkEl    = target.closest('a, button, [role="button"]');
      const dark      = isBgDark(target);

      // CSS-transition-friendly: set via style, not setAttribute
      if (moveEl) {
        const c = MOVE_COLORS[moveEl.dataset.move?.toLowerCase() || ''] || '#1A1A1A';
        rect.style.fill   = c;
        rect.style.stroke = c;
        svg.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1.4)';
      } else if (linkEl) {
        const c = dark ? 'rgba(255,255,255,0.9)' : '#1A1A1A';
        rect.style.fill   = c;
        rect.style.stroke = c;
        svg.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1.4)';
      } else {
        // default & text: hollow cursor, colour adapts to bg
        rect.style.fill   = 'transparent';
        rect.style.stroke = dark ? 'rgba(255,255,255,0.85)' : '#1A1A1A';
        svg.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1)';
      }

    };

    const onLeave = () => { svg.style.opacity = '0'; visible = false; setTrail(false); };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
      if (document.head.contains(styleEl)) document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <>
      <svg
        ref={svgRef}
        width="16" height="16" viewBox="0 0 16 16"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          // transition ONLY on transform (scale) and NOT on left/top — position is set directly
          transition: 'transform 0.28s ease, opacity 0.15s',
        }}
      >
        {/* non-scaling-stroke keeps strokeWidth constant across scale changes */}
        <rect
          ref={rectRef}
          x="2.5" y="2.5" width="11" height="11"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{
            fill: 'transparent',
            stroke: '#1A1A1A',
            transition: 'fill 0.18s ease, stroke 0.18s ease',
          }}
        />
      </svg>

      {TRAIL_COLORS.map((color, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          style={{
            position: 'fixed',
            width: `${8 - i * 0.8}px`, height: `${8 - i * 0.8}px`,
            backgroundColor: color,
            transform: 'translate(-50%,-50%) rotate(45deg)',
            pointerEvents: 'none',
            zIndex: 99990 - i,
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      ))}
    </>
  );
}
