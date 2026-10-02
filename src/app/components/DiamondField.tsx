import { useEffect, useRef, type RefObject } from 'react';
import { MOVE_ORDER, MOVE_COLORS } from './kit';

/* DiamondField — hand-drawn TARK diamonds over the hero photography.
   · One shape: a solid diamond with a hand-drawn, marker-like edge.
     Orientation never changes; size is even across the grid.
   · The grid is aligned to the page gutters and starts below the nav.
     Elements marked [data-avoid] inside the hero keep a clear margin.
   · Line boil: each diamond cycles a few hand-drawn variants (~6 fps).
   · Diamonds draw themselves in on load: outline first, then the fill.
   · Pointer: a marker line follows the cursor and fades; diamonds it
     passes swell slightly and boil faster. Tap does the same on touch.
   · Scroll: diamonds drift at different depths and fade into the page.
   Everything renders to one canvas in a single rAF loop. */

type Pt = [number, number];

interface Cell {
  x: number; y: number;
  size: number;
  color: string;
  variants: Pt[][];  // unit-space hand-drawn outlines
  lengths: number[]; // total length of each variant
  row: number;
  depth: number;
  fade: number;
  boilAt: number;    // next variant switch (s)
  v: number;         // current variant
  order: number;     // draw-in order (0–1)
  // live state
  excite: number; o: number;
}

const VARIANTS = 3;

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* One hand-drawn take on a solid unit diamond (vertices at ±1 on each axis):
   each edge is sampled and nudged off the straight line, so the outline wobbles
   the way a marker does. A few takes cycled quickly give the line boil. */
function wobblyDiamond(r: () => number): Pt[] {
  const j = (a: number) => (r() - 0.5) * a;
  const corners: Pt[] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const pts: Pt[] = [];
  const steps = 5;
  for (let k = 0; k < 4; k++) {
    const [ax, ay] = corners[k];
    const [bx, by] = corners[(k + 1) % 4];
    // outward normal of this edge
    const nx = (ax + bx) / Math.SQRT2, ny = (ay + by) / Math.SQRT2;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const n = i === 0 ? j(0.05) : j(0.09);
      pts.push([ax + (bx - ax) * t + nx * n, ay + (by - ay) * t + ny * n]);
    }
  }
  pts.push(pts[0]);
  return pts;
}

function lengthOf(p: Pt[]) {
  let L = 0;
  for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return L;
}

/* Mirrors --gutter in theme.css */
function gutterFor(w: number) { return Math.min(72, Math.max(20, w * 0.05)); }

function buildCells(w: number, h: number, top: number) {
  const g = gutterFor(w);
  const cols = w < 640 ? 5 : w < 1024 ? 7 : 10;
  const spacing = (w - 2 * g) / (cols - 1);
  const rows = Math.floor((h - top - 24) / spacing) + 1; // the grid ends inside the hero
  const size = Math.min(34, Math.max(18, spacing * 0.18));
  const r = rng(41);
  const cells: Cell[] = [];
  const grid: string[][] = [];
  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      // no colour repeats its left or upper neighbour
      let color = MOVE_COLORS[MOVE_ORDER[Math.floor(r() * 5)]];
      for (let k = 0; k < 6 && (color === grid[row][col - 1] || color === grid[row - 1]?.[col]); k++) {
        color = MOVE_COLORS[MOVE_ORDER[Math.floor(r() * 5)]];
      }
      grid[row][col] = color;
      const variants = Array.from({ length: VARIANTS }, () => wobblyDiamond(r));
      cells.push({
        x: g + col * spacing,
        y: top + row * spacing,
        size: size * (0.94 + r() * 0.12),
        color,
        variants,
        lengths: variants.map(lengthOf),
        row,
        depth: 0.35 + r() * 1.1,
        fade: r(),
        boilAt: r() * 0.2,
        v: Math.floor(r() * VARIANTS),
        order: (col / cols) * 0.55 + (row / rows) * 0.45 + r() * 0.08,
        excite: 0, o: 0,
      });
    }
  }
  return { cells, spacing };
}

function fillPoly(ctx: CanvasRenderingContext2D, p: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.closePath();
  ctx.fill();
}

/* Stroke a polyline up to `upTo` of its length */
function strokePartial(ctx: CanvasRenderingContext2D, p: Pt[], upTo: number) {
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  let L = 0;
  for (let i = 1; i < p.length; i++) {
    const seg = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (L + seg >= upTo) {
      const t = (upTo - L) / seg;
      ctx.lineTo(p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t);
      break;
    }
    ctx.lineTo(p[i][0], p[i][1]);
    L += seg;
  }
  ctx.stroke();
}

export function DiamondField({
  heroRef,
  inkColor,
}: {
  heroRef: RefObject<HTMLElement | null>;
  inkColor: string; // colour of the cursor's marker line
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef(inkColor);
  inkRef.current = inkColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let cells: Cell[] = [];
    let spacing = 120;
    let W = 0, H = 0, CH = 0;
    let born = performance.now() / 1000;

    const build = () => {
      W = hero.clientWidth; H = hero.clientHeight;
      CH = Math.round(H * 1.6); // room to drift into the next section
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(CH * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = CH + 'px';
      const top = W < 1024 ? 132 : 176; // clear of the nav and logo
      ({ cells, spacing } = buildCells(W, H, top));
    };
    build();

    // pointer state, hero-local
    let px = -9999, py = -9999, lastMove = 0;
    const trail: { x: number; y: number; t: number }[] = [];
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = y >= 0 && y <= r.height && x >= 0 && x <= r.width;
      px = inside ? x : -9999; py = inside ? y : -9999;
      lastMove = performance.now() / 1000;
      if (inside && e.pointerType === 'mouse' && !reduced) trail.push({ x, y, t: lastMove });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });

    const ro = new ResizeObserver(() => {
      if (Math.abs(hero.clientWidth - W) > 2 || Math.abs(hero.clientHeight - H) > 80) {
        build();
        born = performance.now() / 1000 - 10; // no re-draw-in on resize
      }
    });
    ro.observe(hero);

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '0px 0px 600px 0px' });
    io.observe(hero);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = performance.now() / 1000;
      const heroRect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -heroRect.top / Math.max(1, heroRect.height)));

      // clear zones around the headline and the action bar
      const pad = spacing * 0.5;
      const zones: number[][] = [];
      hero.querySelectorAll('[data-avoid]').forEach((n) => {
        const r = n.getBoundingClientRect();
        zones.push([r.left - heroRect.left - pad, r.right - heroRect.left + pad, r.top - heroRect.top - pad, r.bottom - heroRect.top + pad]);
      });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, CH);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (document.documentElement.dataset.intro) born = t; // hold the draw-in behind the intro
      const pointerLive = t - lastMove < 0.6;
      const R = spacing * 0.9;
      const since = t - born;

      // a row that would show only one or two stragglers is hidden whole
      const inZone = cells.map((c) => zones.some((z) => c.x > z[0] && c.x < z[1] && c.y > z[2] && c.y < z[3]));
      const shownPerRow = new Map<number, number>();
      cells.forEach((c, i) => { if (!inZone[i]) shownPerRow.set(c.row, (shownPerRow.get(c.row) || 0) + 1); });

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const hidden = inZone[i] || (shownPerRow.get(c.row) || 0) < 3;

        // pen proximity
        let near = 0;
        if (pointerLive && !reduced) {
          const d = Math.hypot(c.x - px, c.y - py);
          near = Math.max(0, 1 - d / R);
          near = near * near * (3 - 2 * near);
        }
        c.excite += (near - c.excite) * (near > c.excite ? 0.25 : 0.05);

        // line boil — faster while the pen is near
        if (!reduced && t >= c.boilAt) {
          c.v = (c.v + 1) % VARIANTS;
          c.boilAt = t + (c.excite > 0.2 ? 0.08 : 0.16 + Math.random() * 0.06);
        }

        const scrollFade = Math.max(0, 1 - progress * (1.15 + c.fade * 1.3));
        c.o += ((hidden ? 0 : scrollFade) - c.o) * 0.12;
        if (c.o < 0.01) continue;

        // draw-in on load
        const drawn = reduced ? 1 : Math.min(1, Math.max(0, (since - 0.5 - c.order * 1.4) / 0.55));
        if (drawn <= 0) continue;

        const drift = progress * H * 0.42 * c.depth;
        const s = (c.size / 2) * (1 + c.excite * 0.3) * (1 - progress * 0.3);
        const p = c.variants[c.v];

        ctx.save();
        ctx.globalAlpha = c.o;
        ctx.translate(c.x, c.y + drift);
        ctx.scale(s, s);
        ctx.strokeStyle = c.color;
        ctx.fillStyle = c.color;
        ctx.lineWidth = 0.12;
        if (drawn < 1) {
          // the pen traces the outline, then the colour floods in
          strokePartial(ctx, p, c.lengths[c.v] * Math.min(1, drawn / 0.7));
          const fill = Math.max(0, (drawn - 0.6) / 0.4);
          if (fill > 0) { ctx.globalAlpha = c.o * fill; fillPoly(ctx, p); }
        } else {
          fillPoly(ctx, p);
          ctx.stroke(); // soft marker edge on the same path
        }
        ctx.restore();
      }

      // the pen line
      while (trail.length && t - trail[0].t > 0.9) trail.shift();
      if (trail.length > 1) {
        ctx.save();
        ctx.strokeStyle = inkRef.current;
        ctx.lineWidth = 2.5;
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1], b = trail[i];
          ctx.globalAlpha = Math.max(0, 1 - (t - b.t) / 0.9) * 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      ro.disconnect();
      io.disconnect();
    };
  }, [heroRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 2 }}
    />
  );
}
