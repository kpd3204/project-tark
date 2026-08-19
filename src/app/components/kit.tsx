/* kit — the shared editorial grammar of the TARK site.
   One easing, one reveal voice, one set of layout primitives.
   Every page composes from these so the whole site moves as one system. */

import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useInView } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;

export const MOVE_ORDER = ['OPEN', 'TRACE', 'SHIFT', 'SURFACE', 'COMMIT'] as const;
export const MOVE_COLORS: Record<string, string> = {
  OPEN: '#FFD167',
  TRACE: '#E27238',
  SHIFT: '#465BA4',
  SURFACE: '#4DB49F',
  COMMIT: '#DA3832',
};
/* Readable version of a move colour on white (OPEN yellow is too light for text) */
export const MOVE_TEXT: Record<string, string> = {
  OPEN: '#8B6A00',
  TRACE: '#C85A20',
  SHIFT: '#465BA4',
  SURFACE: '#2E8A77',
  COMMIT: '#DA3832',
};

/* ── Reveal — the single scroll-entrance used across the site ── */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  once = true,
  style,
  className,
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  style?: CSSProperties;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.85, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── LineReveal — headline lines rise out of a mask ──────────── */
export function LineReveal({
  lines,
  as = 'h2',
  className = 'tk-display-h',
  delay = 0,
  stagger = 0.09,
  style,
  color,
}: {
  lines: ReactNode[];
  as?: 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
  delay?: number;
  stagger?: number;
  style?: CSSProperties;
  color?: string;
}) {
  const Tag = as;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.4 });
  return (
    <Tag ref={ref as any} className={className} style={{ margin: 0, ...(color ? { color } : {}), ...style }}>
      {lines.map((line, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            overflow: 'hidden',
            /* breathing room inside the mask so descenders and
               Devanagari marks never get sheared off */
            paddingBottom: '0.16em',
            marginBottom: '-0.16em',
            paddingTop: '0.12em',
            marginTop: '-0.12em',
          }}
        >
          <motion.span
            initial={{ y: '115%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
            style={{ display: 'block' }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ── Eyebrow — mono section label with diamond ───────────────── */
export function Eyebrow({
  children,
  color = '#999999',
  diamond,
  light = false,
  style,
}: {
  children: ReactNode;
  color?: string;
  diamond?: string;
  light?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className="tk-eyebrow"
      style={{ color: light ? 'rgba(255,255,255,0.45)' : color, ...style }}
    >
      {diamond && <span className="tk-diamond" style={{ width: 7, height: 7, backgroundColor: diamond }} />}
      <span>{children}</span>
    </div>
  );
}

/* ── SectionHead — eyebrow + rule + optional index number ────── */
export function SectionHead({
  label,
  index,
  light = false,
  diamond,
  style,
}: {
  label: string;
  index?: string;
  light?: boolean;
  diamond?: string;
  style?: CSSProperties;
}) {
  const line = light ? 'rgba(255,255,255,0.14)' : 'var(--tk-border)';
  return (
    <Reveal y={12}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...style }}>
        <Eyebrow light={light} diamond={diamond}>{label}</Eyebrow>
        <div style={{ flex: 1, height: 1, backgroundColor: line }} />
        {index && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              color: light ? 'rgba(255,255,255,0.3)' : '#BBBBBB',
            }}
          >
            {index}
          </span>
        )}
      </div>
    </Reveal>
  );
}

/* ── Diamond — the brand mark, sized ─────────────────────────── */
export function Diamond({
  color,
  size = 8,
  style,
}: {
  color: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      className="tk-diamond"
      style={{ width: size, height: size, backgroundColor: color, ...style }}
    />
  );
}

/* ── Counter — animated stat number ──────────────────────────── */
export function Counter({
  target,
  suffix = '',
  duration = 1100,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  return (
    <motion.span ref={ref}>
      {inView ? (
        <CounterInner target={target} suffix={suffix} duration={duration} />
      ) : (
        <span>0{suffix}</span>
      )}
    </motion.span>
  );
}

import { useState, useEffect } from 'react';
function CounterInner({ target, suffix, duration }: { target: number; suffix: string; duration: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <span>{val}{suffix}</span>;
}

/* ── Btn / ArrowLink convenience wrappers ────────────────────── */
export function Btn({
  children,
  variant = 'ink',
  href,
  to,
  onClick,
  style,
  external = false,
}: {
  children: ReactNode;
  variant?: 'ink' | 'paper' | 'yellow' | 'ghost' | 'ghost-light';
  href?: string;
  to?: string;
  onClick?: () => void;
  style?: CSSProperties;
  external?: boolean;
}) {
  const cls = `tk-btn tk-btn--${variant}`;
  if (href) {
    return (
      <a className={cls} href={href} style={style} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <RouterBtn to={to} className={cls} style={style}>{children}</RouterBtn>
    );
  }
  return (
    <button className={cls} onClick={onClick} style={style}>{children}</button>
  );
}

import { Link } from 'react-router';
function RouterBtn({ to, className, style, children }: { to: string; className: string; style?: CSSProperties; children: ReactNode }) {
  return <Link to={to} className={className} style={style}>{children}</Link>;
}

export function ArrowLink({
  children,
  to,
  href,
  color,
  style,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  color?: string;
  style?: CSSProperties;
}) {
  const inner = (
    <>
      <span>{children}</span>
      <span className="arr">→</span>
    </>
  );
  const s = { ...(color ? { color } : {}), ...style };
  if (to) return <Link className="tk-arrow-link" to={to} style={s}>{inner}</Link>;
  return (
    <a className="tk-arrow-link" href={href} target="_blank" rel="noopener noreferrer" style={s}>
      {inner}
    </a>
  );
}
