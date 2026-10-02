import { useEffect, useRef, useState } from 'react';
import { useOutlet, useLocation } from 'react-router';
import { useAnimate } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { DiamondCursor } from '../components/DiamondCursor';
import { ScrollProgress } from '../components/ScrollProgress';
import { IntroAnimation } from '../components/IntroAnimation';
import { EASE } from '../components/kit';
import { Buddy } from '../components/play';
import { watchWidows } from '../components/noWidows';

/* ── Page transition ──────────────────────────────────────────
   Two diamonds in brand colours grow out of the point you tapped and cover
   the old page; the new page is swapped in underneath (already scrolled to
   the top), then the diamonds shrink back into that point to reveal it. */
const MOVE_RING = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];
const PAGE_COLOR: Record<string, string> = {
  '/':                 '#FFD167',
  '/framework':        '#FFD167',
  '/toolkit':          '#4DB49F',
  '/thinking-partner': '#465BA4',
  '/worksheets':       '#E27238',
  '/games':            '#FFD167',
  '/activity-booklet': '#4DB49F',
  '/case-studies':     '#DA3832',
  '/research':         '#E27238',
  '/about':            '#465BA4',
};
function pageColor(pathname: string) {
  if (pathname.startsWith('/case-studies/')) return '#DA3832';
  if (pathname.startsWith('/toolkit/'))      return '#4DB49F';
  return PAGE_COLOR[pathname] || '#FFD167';
}
const COVER_EASE  = [0.76, 0, 0.24, 1] as const;
const REVEAL_EASE = [0.65, 0, 0.35, 1] as const;
const BASE = 100; // px side of the diamond before scaling

export function Root() {
  const { pathname, hash } = useLocation();
  const outlet = useOutlet();

  useEffect(() => watchWidows(), []);


  /* The intro plays once per visit, not on every reload */
  const [showIntro, setShowIntro] = useState(() => {
    try {
      if (sessionStorage.getItem('tk-intro-seen')) return false;
      sessionStorage.setItem('tk-intro-seen', '1');
    } catch { /* storage unavailable, just play it */ }
    return true;
  });
  /* Let the page know while the intro covers it (the hero holds its entrance) */
  useEffect(() => {
    if (showIntro) document.documentElement.dataset.intro = '1';
    else delete document.documentElement.dataset.intro;
  }, [showIntro]);

  /* The page on screen lags the router while the cover plays */
  const [view, setView] = useState<{ path: string; el: typeof outlet }>({ path: pathname, el: outlet });
  const pending = useRef({ path: pathname, el: outlet, hash });
  const running = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const [scope, animate] = useAnimate();
  const [colors, setColors] = useState({ outer: '#465BA4', inner: '#FFD167' });

  useEffect(() => {
    const onDown = (e: PointerEvent) => { lastPointer.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    return () => window.removeEventListener('pointerdown', onDown, { capture: true });
  }, []);

  const swapIn = () => {
    const next = pending.current;
    setView({ path: next.path, el: next.el });
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (next.hash) {
      setTimeout(() => document.querySelector(next.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
    }
  };

  const frames = (n: number) => new Promise<void>((res) => {
    const step = (k: number) => (k <= 0 ? res() : requestAnimationFrame(() => step(k - 1)));
    step(n);
  });

  const runTransition = async () => {
    running.current = true;
    const root = scope.current as HTMLElement | null;
    const outer = root?.querySelector<HTMLElement>('[data-d="outer"]');
    const inner = root?.querySelector<HTMLElement>('[data-d="inner"]');
    const buddy = root?.querySelector<HTMLElement>('[data-d="buddy"]');
    if (!root || !outer || !inner || !buddy) { swapIn(); running.current = false; return; }

    const w = window.innerWidth, h = window.innerHeight;
    const p = lastPointer.current ?? { x: w / 2, y: h / 2 };
    lastPointer.current = null;
    // half-diagonal needed to cover the farthest corner, as a diamond
    const reach = Math.max(p.x + p.y, w - p.x + p.y, p.x + h - p.y, w - p.x + h - p.y) * 1.04;
    const scale = (reach * Math.SQRT2) / BASE;
    root.style.setProperty('--x', `${p.x}px`);
    root.style.setProperty('--y', `${p.y}px`);
    root.style.visibility = 'visible';
    document.documentElement.dataset.intro = '1';

    await Promise.all([
      animate(outer, { scale: [0, scale], rotate: 45 }, { duration: 0.6, ease: COVER_EASE }),
      animate(inner, { scale: [0, scale], rotate: 45 }, { duration: 0.6, ease: COVER_EASE, delay: 0.08 }),
      animate(buddy, { scale: [0, 1], rotate: [-30, 0] }, { duration: 0.45, ease: EASE, delay: 0.32 }),
    ]);

    swapIn();
    await frames(2);
    if (!showIntroRef.current) delete document.documentElement.dataset.intro;

    await Promise.all([
      animate(buddy, { scale: 0, rotate: 30 }, { duration: 0.3, ease: EASE }),
      animate(inner, { scale: 0, rotate: 45 }, { duration: 0.6, ease: REVEAL_EASE, delay: 0.05 }),
      animate(outer, { scale: 0, rotate: 45 }, { duration: 0.6, ease: REVEAL_EASE, delay: 0.13 }),
    ]);
    root.style.visibility = 'hidden';
    running.current = false;
    // another navigation landed while this one played
    if (pending.current.path !== viewPathRef.current) runTransition();
  };

  const viewPathRef = useRef(view.path);
  viewPathRef.current = view.path;
  const showIntroRef = useRef(showIntro);
  showIntroRef.current = showIntro;

  useEffect(() => {
    pending.current = { path: pathname, el: outlet, hash };
    if (pathname === view.path) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { swapIn(); return; }
    const inner = pageColor(pathname);
    const i = MOVE_RING.indexOf(inner);
    setColors({ inner, outer: MOVE_RING[(i + 2) % MOVE_RING.length] });
    if (!running.current) runTransition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash]);

  /* Same page (filters, hashes): always render the live outlet */
  const page = pathname === view.path ? outlet : view.el;

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <DiamondCursor />
      <Navigation />
      <ScrollProgress />

      <div ref={scope} className="pt" aria-hidden="true" style={{ visibility: 'hidden' }}>
        <div data-d="outer" className="pt__d" style={{ background: colors.outer }} />
        <div data-d="inner" className="pt__d" style={{ background: colors.inner }} />
        <div data-d="buddy" className="pt__buddy"><Buddy color="#1D1B16" size={72} /></div>
      </div>

      <main key={view.path}>
        {page}
      </main>

    </div>
  );
}
