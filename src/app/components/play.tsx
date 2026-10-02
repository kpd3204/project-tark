/* play, the playful layer of the TARK identity.
   Buddy:    a TARK diamond with eyes that follow the pointer and blink.
   Squiggle: a hand-drawn line that draws itself when it scrolls into view.
   Tag:      a tilted colour label.
   Pill:     the rounded button with a round arrow.
   Styling lives in styles/play.css so every piece stays fluid across widths. */

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

/* ── Shared pointer, one listener for every buddy ─────────────── */
type Looker = (x: number, y: number) => void;
const lookers = new Set<Looker>();
let pointerBound = false;
let frame = 0;
let lastX = -1, lastY = -1;
function bindPointer() {
  if (pointerBound || typeof window === 'undefined') return;
  pointerBound = true;
  window.addEventListener('pointermove', (e) => {
    lastX = e.clientX; lastY = e.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      lookers.forEach((fn) => fn(lastX, lastY));
    });
  }, { passive: true });
}

/* Readable ink for each move colour (yellow takes dark ink) */
const INK_ON: Record<string, string> = { '#FFD167': '#1D1B16' };

/* size in px, or 0 to let CSS size it (e.g. in em, inside a headline) */
export function Buddy({
  color,
  size = 56,
  style,
  className,
  delay = 0,
}: {
  color: string;
  size?: number;
  style?: CSSProperties;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const pupils = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    bindPointer();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const look: Looker = (x, y) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 260);
      const tx = (dx / d) * reach * 0.09 * r.width;
      const ty = (dy / d) * reach * 0.07 * r.width;
      pupils.current.forEach((p) => { if (p) p.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`; });
    };
    lookers.add(look);
    return () => { lookers.delete(look); };
  }, []);

  const ink = INK_ON[color] || '#1D1B16';

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className={`buddy ${className || ''}`}
      initial={{ scale: 0, rotate: -12 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 16, delay }}
      style={{ ...(size ? { width: size, height: size } : {}), ...style }}
    >
      <span className="buddy__body" style={{ backgroundColor: color }} />
      <span className="buddy__eyes">
        {[0, 1].map((i) => (
          <span key={i} className="buddy__eye" style={{ animationDelay: `${(delay * 7 + i * 0.02) % 5}s` }}>
            <span
              ref={(el) => { pupils.current[i] = el; }}
              className="buddy__pupil"
              style={{ backgroundColor: ink }}
            />
          </span>
        ))}
      </span>
    </motion.span>
  );
}

/* ── Squiggle, hand-drawn strokes ───────────────────────────── */
const SQUIGGLES = {
  loop:   { vb: '0 0 160 70',  d: 'M6 52 C 26 10, 58 8, 62 34 C 66 58, 34 62, 40 38 C 46 14, 92 8, 108 30 C 120 46, 134 50, 154 30' },
  arrow:  { vb: '0 0 120 90',  d: 'M8 82 C 12 40, 40 14, 96 14 M80 2 L 98 14 L 82 28' },
  zigzag: { vb: '0 0 150 50',  d: 'M4 40 L 22 10 L 40 40 L 58 10 L 76 40 L 94 10 L 112 40 L 130 10 L 146 34' },
  wave:   { vb: '0 0 180 40',  d: 'M4 24 C 24 4, 40 4, 56 22 S 92 40, 110 20 S 146 4, 176 22' },
  spiral: { vb: '0 0 90 90',   d: 'M46 46 C 52 42, 54 52, 46 54 C 36 56, 34 40, 46 36 C 62 32, 66 56, 48 64 C 26 72, 18 40, 36 26 C 56 12, 82 30, 78 54' },
  underline: { vb: '0 0 300 24', d: 'M4 15 C 70 9, 170 8, 296 12' },
} as const;

export type SquiggleKind = keyof typeof SQUIGGLES;

export function Squiggle({
  kind,
  color = 'var(--ink)',
  width = 120,
  stroke = 3,
  style,
  className,
  delay = 0,
}: {
  kind: SquiggleKind;
  color?: string;
  width?: number | string;
  stroke?: number;
  style?: CSSProperties;
  className?: string;
  delay?: number;
}) {
  const s = SQUIGGLES[kind];
  return (
    <svg viewBox={s.vb} preserveAspectRatio={kind === 'underline' ? 'none' : undefined} className={`squiggle ${className || ''}`} style={{ width, height: 'auto', ...style }} aria-hidden="true" fill="none">
      <motion.path
        d={s.d}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        // a stretched underline must not use non-scaling-stroke, or the draw-in dash is mis-measured
        vectorEffect={kind === 'underline' ? undefined : 'non-scaling-stroke'}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.1, delay, ease: [0.45, 0, 0.2, 1] }}
      />
    </svg>
  );
}

/* ── Tag, a tilted colour label ─────────────────────────────── */
export function Tag({
  children,
  bg,
  color = '#FFFFFF',
  tilt = -2,
  className,
  style,
}: {
  children: ReactNode;
  bg: string;
  color?: string;
  tilt?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`tag ${className || ''}`} style={{ backgroundColor: bg, color, transform: `rotate(${tilt}deg)`, ...style }}>
      {children}
    </span>
  );
}

/* ── Pill, rounded button with a round arrow ────────────────── */
export function Pill({
  children,
  to,
  href,
  variant = 'ink',
  arrow = true,
  className,
  style,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: 'ink' | 'paper' | 'ghost' | 'ghost-light' | 'yellow';
  arrow?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const cls = `pill pill--${variant} ${className || ''}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <span className="pill__arrow" aria-hidden="true">→</span>}
    </>
  );
  if (href) return <a className={cls} href={href} target="_blank" rel="noopener noreferrer" style={style}>{inner}</a>;
  return <Link className={cls} to={to || '/'} style={style}>{inner}</Link>;
}
