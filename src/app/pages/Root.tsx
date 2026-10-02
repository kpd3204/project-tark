import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { DiamondCursor } from '../components/DiamondCursor';
import { ScrollProgress } from '../components/ScrollProgress';
import { IntroAnimation } from '../components/IntroAnimation';
import { useIsMobile } from '../hooks/useIsMobile';
import { EASE } from '../components/kit';

const PAGE_WIPE_COLORS: Record<string, string> = {
  '/':                 '#1A1A1A',
  '/framework':        '#FFD167',
  '/toolkit':          '#4DB49F',
  '/thinking-partner': '#465BA4',
  '/worksheets':       '#E27238',
  '/games':            '#DA3832',
  '/case-studies':     '#E27238',
  '/research':         '#465BA4',
  '/about':            '#1A1A1A',
};

function getWipeColor(pathname: string): string {
  if (pathname.startsWith('/case-studies/')) return '#DA3832';
  if (pathname.startsWith('/toolkit/'))      return '#4DB49F';
  return PAGE_WIPE_COLORS[pathname] || '#1A1A1A';
}

export function Root() {
  const { pathname, hash } = useLocation();
  const [wiping, setWiping]       = useState(false);
  const [wipeColor, setWipeColor] = useState('#1A1A1A');
  const prevPath = useRef(pathname);
  const isMobile = useIsMobile();
  const isThinkingPartner = pathname === '/thinking-partner';

  /* Mobile CTA appears only once the reader has committed to the page */
  const { scrollY } = useScroll();
  const [pastFold, setPastFold] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setPastFold(y > 480));

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

  const isMainPage = (p: string) => p.split('/').filter(Boolean).length <= 1;

  useEffect(() => {
    if (pathname === prevPath.current) return;
    const shouldWipe = isMainPage(pathname) || isMainPage(prevPath.current);
    prevPath.current = pathname;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (hash) {
      setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450);
    }
    if (!shouldWipe) return;
    setWipeColor(getWipeColor(pathname));
    setWiping(true);
    const t = setTimeout(() => setWiping(false), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      {/* The landing page has its own pen interaction in the hero */}
      {pathname !== '/' && <DiamondCursor />}
      <Navigation />
      <ScrollProgress />

      <AnimatePresence>
        {wiping && (
          <motion.div
            key="wipe"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: wipeColor,
              zIndex: 9000,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ rotate: 45, scale: 0 }}
              animate={{ rotate: 135, scale: [0, 1, 1, 0] }}
              transition={{ duration: 0.7, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
              style={{
                width: 18, height: 18,
                backgroundColor: wipeColor === '#FFD167' ? '#1A1A1A' : '#FFFFFF',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: wiping ? 0.2 : 0 }}
      >
        <Outlet />
      </motion.main>

      <AnimatePresence>
      {isMobile && !isThinkingPartner && pastFold && (
        <motion.div
          key="mobile-cta"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="m-cta"
        >
          <Link to="/thinking-partner" className="pill pill--yellow">
            <span>Start thinking</span><span className="pill__arrow" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
