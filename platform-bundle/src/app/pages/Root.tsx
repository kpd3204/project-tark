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
  '/speculate':        '#DA3832',
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
  const isSpeculate = pathname === '/speculate';
  const isThinkingPartner = pathname === '/thinking-partner';

  /* Mobile CTA appears only once the reader has committed to the page */
  const { scrollY } = useScroll();
  const [pastFold, setPastFold] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setPastFold(y > 480));

  /* The intro plays on every full page load */
  const [showIntro, setShowIntro] = useState(true);

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
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <DiamondCursor />
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
      {isMobile && !isSpeculate && !isThinkingPartner && pastFold && (
        <motion.div
          key="mobile-cta"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 70,
            padding: '24px 16px 20px',
            background: 'linear-gradient(to top, rgba(15,15,15,0.95) 55%, transparent)',
            pointerEvents: 'none',
          }}
        >
          <Link
            to="/thinking-partner"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              backgroundColor: '#FFFFFF', color: '#0F0F0F',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
              textTransform: 'uppercase', fontWeight: 700,
              padding: '15px 20px', textDecoration: 'none',
              width: '100%', boxSizing: 'border-box', pointerEvents: 'auto',
            }}
          >
            <span style={{ width: 7, height: 7, backgroundColor: '#FFD167', transform: 'rotate(45deg)', flexShrink: 0, display: 'inline-block' }} />
            Start Thinking →
          </Link>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
