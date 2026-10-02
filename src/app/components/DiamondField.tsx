import { useEffect, useRef, type RefObject } from 'react';
import { MOVE_ORDER, MOVE_COLORS } from './kit';

/* DiamondField — hand-drawn TARK diamonds over the hero photography.
   · One shape: a solid diamond with a hand-drawn, marker-like edge.
     Orientation never changes; size is even across the grid.
   · The grid's outer diamond edges sit exactly on the page gutters (in line
     with the logo, headline and nav), and its rows are spaced evenly to fill
     the space between the nav and the headline ([data-grid-floor]).
     A row that would touch a [data-avoid] element is hidden whole.
   · Line boil: each diamond cycles a few hand-drawn variants (~6 fps).
   · Diamonds draw themselves in on load: outline first, then the fill.
   · Pointer: diamonds near the cursor are nudged the way it is moving —
     harder for faster strokes — then spring back with a soft wobble.
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
  dx: number; dy: number; vx: number; vy: number; o: number;
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

function buildCells(w: number, top: number, floor: number) {
  const g = gutterFor(w);
  const cols = w < 640 ? 5 : w < 1024 ? 7 : 10;
  const size = Math.min(34, Math.max(18, (w - 2 * g) / (cols - 1) * 0.18));
  // outer diamond edges on the gutters
  const colStep = (w - 2 * g - size) / (cols - 1);
  // rows fill [top, floor] evenly, at a pitch close to the column pitch
  const span = floor - top - size;
  const rows = span < 0 ? 0 : Math.max(1, Math.round(span / colStep) + 1);
  const rowStep = rows > 1 ? span / (rows - 1) : 0;
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
        x: g + size / 2 + col * colStep,
        y: top + size / 2 + row * rowStep,
        size: size * (0.96 + r() * 0.08),
        color,
        variants,
        lengths: variants.map(lengthOf),
        row,
        depth: 0.35 + r() * 1.1,
        fade: r(),
        boilAt: r() * 0.2,
        v: Math.floor(r() * VARIANTS),
        order: (col / cols) * 0.55 + (row / Math.max(1, rows)) * 0.45 + r() * 0.08,
        dx: 0, dy: 0, vx: 0, vy: 0, o: 0,
      });
    }
  }
  return { cells, spacing: colStep };
}

/* Stroke a polyline up to `upTo` of its length */
function fillPoly(ctx: CanvasRenderingContext2D, p: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.closePath();
  ctx.fill();
}

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

export function DiamondField({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    let W = 0, H = 0, CH = 0, floorY = 0;
    let born = performance.now() / 1000;
    const floorEl = hero.querySelector('[data-grid-floor]') as HTMLElement | null;

    const measureFloor = () => {
      if (!floorEl) return H - 200;
      // layout position, ignoring any scroll-driven transform on the way
      let y = 0;
      let n: HTMLElement | null = floorEl;
      while (n && n !== hero) { y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
      return y;
    };

    const build = () => {
      W = hero.clientWidth; H = hero.clientHeight;
      CH = Math.round(H * 1.6); // room to drift into the next section
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(CH * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = CH + 'px';
      const top = W < 1024 ? 112 : 160;           // clear of the nav and logo
      const g = gutterFor(W);
      const pitch = (W - 2 * g) / ((W < 640 ? 5 : W < 1024 ? 7 : 10) - 1);
      floorY = measureFloor();
      ({ cells, spacing } = buildCells(W, top, floorY - pitch * 0.55));
    };
    build();

    // pointer — position and velocity, hero-local
    let px = -9999, py = -9999, pvx = 0, pvy = 0, lastT = 0, moved = false;
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      if (px > -9000 && now - lastT < 120) {
        // smoothed velocity in px per frame (~16ms)
        pvx = pvx * 0.5 + ((x - px) / dt) * 16 * 0.5;
        pvy = pvy * 0.5 + ((y - py) / dt) * 16 * 0.5;
      } else { pvx = 0; pvy = 0; }
      px = x; py = y; lastT = now; moved = true;
    };
    const onLeave = () => { px = -9999; py = -9999; pvx = pvy = 0; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let lastW = 0, lastFloor = 0;
    const ro = new ResizeObserver(() => {
      const f = measureFloor();
      if (Math.abs(hero.clientWidth - lastW) > 2 || Math.abs(f - lastFloor) > 4) {
        lastW = hero.clientWidth; lastFloor = f;
        build();
        if (performance.now() / 1000 - born > 2) born = performance.now() / 1000 - 10; // no re-draw-in once shown
      }
    });
    ro.observe(hero);
    if (floorEl) ro.observe(floorEl);

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

      // a row that touches the headline or the action bar is hidden whole
      const pad = spacing * 0.3;
      const zones: number[][] = [];
      hero.querySelectorAll('[data-avoid]').forEach((n) => {
        const r = n.getBoundingClientRect();
        zones.push([r.left - heroRect.left - pad, r.right - heroRect.left + pad, r.top - heroRect.top - pad, r.bottom - heroRect.top + pad]);
      });
      const blockedRows = new Set<number>();
      for (const c of cells) {
        if (zones.some((z) => c.x > z[0] && c.x < z[1] && c.y > z[2] && c.y < z[3])) blockedRows.add(c.row);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, CH);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (document.documentElement.dataset.intro) born = t; // hold the draw-in behind the intro
      const since = t - born;
      const R = spacing * 1.25;
      // a moving cursor pushes; a resting one does nothing
      const push = moved && !reduced;
      moved = false;

      for (const c of cells) {
        // spring back to rest, with a little wobble
        if (!reduced) {
          if (push) {
            const d = Math.hypot(c.x + c.dx - px, c.y + c.dy - py);
            if (d < R) {
              const f = 1 - d / R;
              const k = f * f * 0.32;
              c.vx += pvx * k;
              c.vy += pvy * k;
            }
          }
          c.vx += -c.dx * 0.06; c.vy += -c.dy * 0.06;
          c.vx *= 0.84;         c.vy *= 0.84;
          c.dx += c.vx;         c.dy += c.vy;
          const lim = spacing * 0.32;
          const m = Math.hypot(c.dx, c.dy);
          if (m > lim) { c.dx *= lim / m; c.dy *= lim / m; }
        }

        // line boil
        if (!reduced && t >= c.boilAt) {
          c.v = (c.v + 1) % VARIANTS;
          c.boilAt = t + 0.16 + Math.random() * 0.06;
        }

        const hidden = blockedRows.has(c.row);
        const scrollFade = Math.max(0, 1 - progress * (1.15 + c.fade * 1.3));
        c.o += ((hidden ? 0 : scrollFade) - c.o) * 0.12;
        if (c.o < 0.01) continue;

        // draw-in on load
        const drawn = reduced ? 1 : Math.min(1, Math.max(0, (since - 0.5 - c.order * 1.4) / 0.55));
        if (drawn <= 0) continue;

        const drift = progress * H * 0.42 * c.depth;
        const s = (c.size / 2) * (1 - progress * 0.3);
        const p = c.variants[c.v];

        ctx.save();
        ctx.globalAlpha = c.o;
        ctx.translate(c.x + c.dx, c.y + c.dy + drift);
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
      // velocity decays when the cursor stops sending moves
      pvx *= 0.6; pvy *= 0.6;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
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
