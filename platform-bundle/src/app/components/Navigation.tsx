import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Instagram } from 'lucide-react';
import logoSrc from '../../imports/Asset_23_4x-5.png';
import { EASE, MOVE_COLORS, Diamond } from './kit';

const TOOLS_DROPDOWN = [
  { heading: 'Toolkit',    subtitle: '25 thinking tools',        path: '/toolkit',    color: MOVE_COLORS.SURFACE },
  { heading: 'Worksheets', subtitle: '40 printable sheets',      path: '/worksheets', color: MOVE_COLORS.TRACE   },
  { heading: 'Games',      subtitle: 'WHAT IF? and more',        path: '/games',      color: MOVE_COLORS.OPEN    },
  { heading: 'Speculate',  subtitle: "India's speculation wall", path: '/speculate',  color: MOVE_COLORS.COMMIT  },
];

const MOBILE_INDEX = [
  { label: 'Framework',  desc: 'Five moves for thinking better',  path: '/framework',  color: MOVE_COLORS.OPEN    },
  { label: 'Toolkit',    desc: '25 thinking tools',               path: '/toolkit',    color: MOVE_COLORS.SURFACE },
  { label: 'Worksheets', desc: 'Print and fill',                  path: '/worksheets', color: MOVE_COLORS.TRACE   },
  { label: 'Games',      desc: 'The WHAT IF? card game',          path: '/games',      color: MOVE_COLORS.SHIFT   },
  { label: 'Speculate',  desc: "India's speculation wall",        path: '/speculate',  color: MOVE_COLORS.COMMIT  },
  { label: 'Research',   desc: 'The evidence base',               path: '/research',   color: MOVE_COLORS.SHIFT   },
  { label: 'About',      desc: 'The project and the people',      path: '/about',      color: MOVE_COLORS.SURFACE },
];

/* ── Desktop nav link with underline that draws in ───────────── */
function TopLink({ label, path }: { label: string; path: string }) {
  const ink = '#1A1A1A';
  const dim = 'rgba(26,26,26,0.62)';
  return (
    <NavLink to={path} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: isActive ? ink : dim,
            paddingBottom: 5,
            backgroundImage: `linear-gradient(${ink}, ${ink})`,
            backgroundSize: isActive ? '100% 1.5px' : '0% 1.5px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left bottom',
            transition: 'color 0.25s, background-size 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = ink;
            (e.currentTarget as HTMLElement).style.backgroundSize = '100% 1.5px';
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLElement).style.color = dim;
              (e.currentTarget as HTMLElement).style.backgroundSize = '0% 1.5px';
            }
          }}
        >
          {label}
        </span>
      )}
    </NavLink>
  );
}

/* ── Tools dropdown ──────────────────────────────────────────── */
function ToolsDropdown({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, clipPath: 'inset(0 0 100% 0)' }}
      animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      exit={{ opacity: 0, y: 4, clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{
        position: 'absolute',
        top: '100%',
        right: -20,
        width: 264,
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--tk-border)',
        boxShadow: '0 24px 48px -24px rgba(26,26,26,0.18)',
        zIndex: 200,
        padding: '8px 0',
      }}
    >
      {TOOLS_DROPDOWN.map((item, i) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.06 + i * 0.05, ease: EASE }}
        >
          <Link
            to={item.path}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '13px 22px',
              textDecoration: 'none',
              transition: 'background-color 0.2s, padding-left 0.25s cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = '#F5F4F1';
              el.style.paddingLeft = '28px';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = 'transparent';
              el.style.paddingLeft = '22px';
            }}
          >
            <Diamond color={item.color} size={7} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.2 }}>
                {item.heading}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', color: '#999999', marginTop: 2 }}>
                {item.subtitle}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── Main navigation ─────────────────────────────────────────── */
export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen]   = useState(false);
  const [hidden, setHidden]         = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const toolsRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = lastY.current;
    lastY.current = y;
    setScrolled(y > 24);
    if (mobileOpen || toolsOpen) { setHidden(false); return; }
    if (y < 120) { setHidden(false); return; }
    setHidden(y > prev && y - prev > 2);
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setToolsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toolsActive = ['/toolkit', '/worksheets', '/games', '/speculate'].some((p) => pathname.startsWith(p));
  const ink = '#1A1A1A';

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? '-101%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: mobileOpen ? '1px solid transparent' : '1px solid rgba(26,26,26,0.08)',
          transition: 'border-color 0.4s',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 68, paddingInline: 'var(--gutter)',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
            aria-label="Project TARK — home"
          >
            <img
              src={logoSrc}
              alt="Project तर्क"
              style={{ height: 30, width: 'auto', display: 'block' }}
            />
          </button>

          {/* Desktop — only once there is genuinely room for the full row */}
          <div className="hidden lg:flex items-center" style={{ gap: 32 }}>
            <TopLink label="Framework" path="/framework" />

            <div
              ref={toolsRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                onClick={() => setToolsOpen((v) => !v)}
                aria-expanded={toolsOpen}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
                  textTransform: 'uppercase', fontWeight: 600,
                  color: toolsOpen || toolsActive ? ink : 'rgba(26,26,26,0.62)',
                  padding: '22px 0',
                  transition: 'color 0.25s',
                }}
              >
                Tools
                <span
                  style={{
                    width: 6, height: 6,
                    transform: `rotate(45deg) scale(${toolsOpen ? 1.3 : 1})`,
                    backgroundColor: toolsOpen || toolsActive ? ink : '#999999',
                    display: 'inline-block',
                    transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), background-color 0.25s',
                  }}
                />
              </button>
              <AnimatePresence>
                {toolsOpen && <ToolsDropdown onClose={() => setToolsOpen(false)} />}
              </AnimatePresence>
            </div>

            <TopLink label="Research" path="/research" />
            <TopLink label="About" path="/about" />

            <div style={{ width: 1, height: 18, backgroundColor: 'var(--tk-border)' }} />

            <a
              href="https://www.instagram.com/project.tark/"
              target="_blank" rel="noopener noreferrer"
              aria-label="@project.tark on Instagram"
              style={{ color: '#555555', display: 'flex', transition: 'color 0.2s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#E27238')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#555555')}
            >
              <Instagram size={15} strokeWidth={1.5} />
            </a>

            <Link
              to="/thinking-partner"
              className="tk-btn tk-btn--ink"
              style={{ padding: '13px 24px' }}
            >
              Start Thinking →
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex flex-col items-end justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              minWidth: 44, minHeight: 44, gap: 5, padding: 8,
            }}
          >
            <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 3.5 : 0 }} style={{ display: 'block', height: 1.5, width: 22, backgroundColor: ink, transformOrigin: 'center', transition: 'background-color 0.3s' }} />
            <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -3.5 : 0, width: mobileOpen ? 22 : 14 }} style={{ display: 'block', height: 1.5, width: 14, backgroundColor: ink, transformOrigin: 'center', transition: 'background-color 0.3s' }} />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile overlay — editorial index ─────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{
              position: 'fixed', inset: 0, zIndex: 90,
              backgroundColor: '#F5F4F1',
              display: 'flex', flexDirection: 'column',
              paddingTop: 68,
            }}
          >
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {MOBILE_INDEX.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: EASE }}
                  style={{ borderBottom: '1px solid var(--tk-border)' }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'baseline', gap: 16,
                      padding: '20px var(--gutter)',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: '#999999', minWidth: 24 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 7vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1A1A', lineHeight: 1 }}>
                      {item.label}
                    </span>
                    <Diamond color={item.color} size={7} style={{ marginLeft: 'auto' }} />
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + MOBILE_INDEX.length * 0.05, ease: EASE }}
                style={{ padding: '28px var(--gutter)' }}
              >
                <Link to="/thinking-partner" onClick={() => setMobileOpen(false)} className="tk-btn tk-btn--ink" style={{ width: '100%', padding: '18px 24px' }}>
                  Start Thinking →
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ padding: '16px var(--gutter) 24px', borderTop: '1px solid var(--tk-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#999999' }}>
                Project तर्क · 2026
              </span>
              <span style={{ display: 'flex', gap: 6 }}>
                {Object.values(MOVE_COLORS).map((c) => <Diamond key={c} color={c} size={6} />)}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
