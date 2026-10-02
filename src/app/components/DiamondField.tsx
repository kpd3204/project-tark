import { useEffect, useRef, type RefObject } from 'react';
import { MOVE_ORDER, MOVE_COLORS } from './kit';

/* DiamondField — a grid of TARK diamonds laid over the hero photography.
   · Orientation never changes: diamonds only move, scale and fill.
   · Elements marked [data-avoid] inside the hero stay clear of diamonds.
   · Pointer: nearby diamonds part around the cursor, grow, and outlines fill in.
   · Slide change: a diagonal wave ripples across the grid.
   · Scroll: diamonds drift at different depths and fade into the page below.
   One rAF loop writes transforms straight to the DOM — no React re-renders. */

type Kind = 'solid' | 'outline' | 'nested' | 'tiny';

interface Cell {
  x: number; y: number;
  size: number;
  color: string;
  kind: Kind;
  depth: number;   // scroll parallax factor
  fade: number;    // how early it fades on scroll (0–1)
  phase: number;   // idle breathing offset
  hidden: boolean; // sits under the nav or the headline
  // live state
  dx: number; dy: number; s: number; fill: number; o: number;
}

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCells(w: number, h: number): { cells: Cell[]; spacing: number } {
  const cols = w < 640 ? 5 : w < 1024 ? 7 : 10;
  const spacing = w / cols;
  const rows = Math.ceil(h / spacing) + 1;
  const r = rng(29);
  const cells: Cell[] = [];
  const unit = Math.min(1.2, Math.max(0.62, spacing / 150));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const k = r();
      const kind: Kind = k < 0.52 ? 'solid' : k < 0.74 ? 'outline' : k < 0.9 ? 'nested' : 'tiny';
      const base =
        kind === 'tiny'    ? 8 + r() * 4 :
        kind === 'outline' ? 24 + r() * 12 :
        kind === 'nested'  ? 28 + r() * 10 :
                             18 + r() * 18;
      cells.push({
        x: spacing * (col + 0.5),
        y: spacing * (row + 0.5),
        size: base * unit,
        color: MOVE_COLORS[MOVE_ORDER[Math.floor(r() * 5)]],
        kind,
        depth: 0.35 + r() * 1.1,
        fade: r(),
        phase: r() * Math.PI * 2,
        hidden: false,
        dx: 0, dy: 0, s: 1, fill: 0, o: 0,
      });
    }
  }
  return { cells, spacing };
}

export function DiamondField({
  heroRef,
  wave,
}: {
  heroRef: RefObject<HTMLElement | null>;
  wave: number; // bump to trigger the ripple
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const waveAt = useRef(-10);

  useEffect(() => { waveAt.current = performance.now() / 1000; }, [wave]);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = heroRef.current;
    if (!layer || !hero) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cells: Cell[] = [];
    let els: HTMLDivElement[] = [];
    let fills: (HTMLSpanElement | null)[] = [];
    let spacing = 120;
    let W = 0, H = 0;
    const start = performance.now() / 1000;

    const build = () => {
      W = hero.clientWidth; H = hero.clientHeight;
      ({ cells, spacing } = buildCells(W, H));
      layer.innerHTML = '';
      els = []; fills = [];
      for (const c of cells) {
        const outer = document.createElement('div');
        outer.style.cssText =
          `position:absolute;left:${c.x}px;top:${c.y}px;width:${c.size}px;height:${c.size}px;` +
          `margin:${-c.size / 2}px 0 0 ${-c.size / 2}px;will-change:transform,opacity;opacity:0;`;
        const shape = document.createElement('span');
        const radius = c.kind === 'tiny' ? '12%' : '16%';
        const common = `position:absolute;inset:0;border-radius:${radius};transform:rotate(45deg) scale(0.72);`;
        let fill: HTMLSpanElement | null = null;
        if (c.kind === 'solid' || c.kind === 'tiny') {
          shape.style.cssText = common + `background:${c.color};`;
        } else {
          const bw = Math.max(1.5, c.size * 0.1);
          shape.style.cssText = common + `border:${bw}px solid ${c.color};box-sizing:border-box;`;
          fill = document.createElement('span');
          fill.style.cssText =
            `position:absolute;inset:${c.kind === 'nested' ? '26%' : '0'};border-radius:16%;` +
            `background:${c.color};opacity:${c.kind === 'nested' ? 1 : 0};`;
          shape.appendChild(fill);
        }
        outer.appendChild(shape);
        layer.appendChild(outer);
        els.push(outer);
        fills.push(fill);
      }
    };
    build();

    // pointer state (section-relative)
    let px = -9999, py = -9999, active = 0, activeTarget = 0, touchUntil = 0;
    const toLocal = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      px = p.x; py = p.y;
      activeTarget = p.inside ? 1 : 0;
      if (e.pointerType === 'touch') touchUntil = performance.now() + 900;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      onMove(e);
    };
    const onLeave = () => { activeTarget = 0; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let ro: ResizeObserver | null = new ResizeObserver(() => {
      if (Math.abs(hero.clientWidth - W) > 2 || Math.abs(hero.clientHeight - H) > 80) build();
    });
    ro.observe(hero);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '0px 0px 400px 0px' });
    io.observe(hero);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const now = performance.now();
      const t = now / 1000;
      const heroRect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -heroRect.top / Math.max(1, heroRect.height)));

      if (touchUntil && now > touchUntil) { activeTarget = 0; touchUntil = 0; }
      active += (activeTarget - active) * 0.08;

      // keep the headline, actions and the nav clear of diamonds
      const pad = spacing * 0.42;
      const zones: number[][] = [];
      hero.querySelectorAll('[data-avoid]').forEach((n) => {
        const r = n.getBoundingClientRect();
        zones.push([r.left - heroRect.left - pad, r.right - heroRect.left + pad, r.top - heroRect.top - pad, r.bottom - heroRect.top + pad]);
      });

      const R = Math.max(200, spacing * 2.1);
      const intro = Math.min(1, (t - start) / 1.6);
      const waveT = t - waveAt.current;

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const el = els[i];
        c.hidden = c.y < 92 || zones.some((z) => c.x > z[0] && c.x < z[1] && c.y > z[2] && c.y < z[3]);

        // pointer influence
        let tdx = 0, tdy = 0, f = 0;
        if (!reduced && active > 0.01) {
          const vx = c.x - px, vy = c.y - py;
          const d = Math.hypot(vx, vy) || 1;
          f = Math.max(0, 1 - d / R);
          f = f * f * (3 - 2 * f) * active; // smoothstep
          const push = spacing * 0.42;
          tdx = (vx / d) * f * push;
          tdy = (vy / d) * f * push;
        }

        // diagonal ripple on slide change
        let w = 0;
        if (!reduced && waveT < 2.4) {
          const u = waveT - ((c.x + c.y) / (W + H)) * 1.1;
          if (u > 0 && u < 0.55) w = Math.sin((u / 0.55) * Math.PI);
        }

        const breathe = reduced ? 0 : Math.sin(t * 0.7 + c.phase) * 0.05;
        const ts = 1 + f * 1.1 + w * 0.32 + breathe;

        // scroll: drift down relative to the page (lags behind), shrink, fade
        const drift = progress * H * 0.42 * c.depth;
        const scrollFade = Math.max(0, 1 - progress * (1.05 + c.fade * 1.4));

        // staggered entrance
        const enter = reduced ? 1 : Math.min(1, Math.max(0, (intro * 1.6 - ((c.x + c.y) / (W + H)) * 0.6)));
        const to = c.hidden ? 0 : enter * scrollFade;

        c.dx += (tdx - c.dx) * 0.14;
        c.dy += (tdy - c.dy) * 0.14;
        c.s  += (ts - c.s) * 0.16;
        c.o  += (to - c.o) * 0.12;
        c.fill += ((f > 0.12 ? 1 : 0) - c.fill) * 0.12;

        const sc = c.s * (1 - progress * 0.35) * (0.6 + 0.4 * enter);
        el.style.transform = `translate3d(${c.dx.toFixed(2)}px,${(c.dy + drift).toFixed(2)}px,0) scale(${sc.toFixed(3)})`;
        el.style.opacity = c.o.toFixed(3);
        const fl = fills[i];
        if (fl && c.kind === 'outline') fl.style.opacity = c.fill.toFixed(3);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      ro?.disconnect(); ro = null;
      io.disconnect();
    };
  }, [heroRef]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    />
  );
}
