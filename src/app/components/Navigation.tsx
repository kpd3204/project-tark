import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router';
import logoSrc from '../../imports/Asset_23_4x-5.png';
import logoLightSrc from '../../imports/logo-light.png';
import { MOVE_COLORS } from './kit';
import { Buddy } from './play';
import { DOC_URL } from './ProjectDoc';

/* Navigation: logo on the left; on the right, the index sits in a solid
   rounded pill so it reads the same over photography and over paper.
   Every link carries a move colour. State changes only when a threshold is
   crossed, so scrolling never re-renders the bar. */

const LINKS = [
  { label: 'Framework',        path: '/framework',        color: MOVE_COLORS.OPEN,    tint: 'var(--tint-open)'    },
  { label: 'Thinking Partner', path: '/thinking-partner', color: MOVE_COLORS.SHIFT,   tint: 'var(--tint-shift)'   },
  { label: 'Research',         path: '/research',         color: MOVE_COLORS.TRACE,   tint: 'var(--tint-trace)'   },
  { label: 'About',            path: '/about',            color: MOVE_COLORS.COMMIT,  tint: 'var(--tint-commit)'  },
];

const TOOLS = [
  { heading: 'Toolkit',      subtitle: '25 thinking tools',  path: '/toolkit',      color: MOVE_COLORS.SURFACE },
  { heading: 'Worksheets',   subtitle: 'Printable kits',     path: '/worksheets',   color: MOVE_COLORS.TRACE,  soon: true },
  { heading: 'Games',        subtitle: 'Thinking, played',   path: '/games',        color: MOVE_COLORS.OPEN,   soon: true },
  { heading: 'Activity booklet', subtitle: '25 activities for young adults', path: '/activity-booklet', color: MOVE_COLORS.COMMIT, soon: true },
];

const RESEARCH = [
  { heading: 'Evidence'    , subtitle: 'Why TARK exists',    path: '/research',     color: MOVE_COLORS.TRACE },
  { heading: 'Case Studies', subtitle: 'TARK in the field',  path: '/case-studies', color: MOVE_COLORS.COMMIT },
  { heading: 'Document', subtitle: 'The full project, in one file', path: DOC_URL, color: MOVE_COLORS.SHIFT, external: true },
];

type MenuItem = { heading: string; subtitle: string; path: string; color: string; soon?: boolean; external?: boolean };

/* A link in the pill that opens a small card of destinations.
   Opens on hover or click, waits a moment before closing so the pointer can
   travel onto the card, and closes on Escape or an outside click. */
function MenuLink({ label, color, tint, items, active, id, open, setOpen }: {
  label: string; color: string; tint: string; items: MenuItem[]; active: boolean;
  id: string; open: string; setOpen: (v: string) => void;
}) {
  const timer = useRef<number>(0);
  const isOpen = open === id;
  const show = () => { window.clearTimeout(timer.current); setOpen(id); };
  const hideSoon = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(''), 160); };
  return (
    <div className="nav__tools" data-menu={id} onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        className={`nav__link ${active ? 'is-active' : ''} ${isOpen ? 'is-open' : ''}`}
        style={{ ['--c' as string]: color, ['--t' as string]: tint }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setOpen(isOpen ? '' : id)}
      >
        <span className="nav__dot" aria-hidden="true" />{label}
        <span className="nav__caret" aria-hidden="true" />
      </button>
      <div className={`nav__menu ${isOpen ? 'is-open' : ''}`} role="menu">
        {items.map((t) => {
          const inner = (
            <>
              <Buddy color={t.color} size={40} />
              <span className="nav__item-text">
                <span className="nav__item-title">
                  {t.heading}
                  {t.soon && <span className="soon">Soon</span>}
                  {t.external && <span className="soon soon--new">PDF</span>}
                </span>
                <span className="nav__item-sub">{t.subtitle}</span>
              </span>
              <span className="nav__item-go" aria-hidden="true">{t.external ? '↗' : '→'}</span>
            </>
          );
          return t.external ? (
            <a key={t.path} href={t.path} target="_blank" rel="noopener noreferrer" className="nav__item" role="menuitem" tabIndex={isOpen ? 0 : -1} onClick={() => setOpen('')}>{inner}</a>
          ) : (
            <Link key={t.path} to={t.path} className="nav__item" role="menuitem" tabIndex={isOpen ? 0 : -1} onClick={() => setOpen('')}>{inner}</Link>
          );
        })}
      </div>
    </div>
  );
}

const MOBILE = [
  { label: 'Framework',        path: '/framework',        color: MOVE_COLORS.OPEN    },
  { label: 'Toolkit',          path: '/toolkit',          color: MOVE_COLORS.SURFACE },
  { label: 'Thinking Partner', path: '/thinking-partner', color: MOVE_COLORS.SHIFT   },
  { label: 'Worksheets',       path: '/worksheets',       color: MOVE_COLORS.TRACE, soon: true },
  { label: 'Games',            path: '/games',            color: MOVE_COLORS.OPEN,  soon: true },
  { label: 'Activity booklet', path: '/activity-booklet', color: MOVE_COLORS.COMMIT, soon: true },
  { label: 'Research',         path: '/research',         color: MOVE_COLORS.TRACE   },
  { label: 'Case Studies',     path: '/case-studies',     color: MOVE_COLORS.COMMIT  },
  { label: 'About',            path: '/about',            color: MOVE_COLORS.COMMIT  },
];

function useScrollFlags(pathname: string) {
  const [overHero, setOverHero] = useState(pathname === '/');
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      const hero = pathname === '/' && y < window.innerHeight - 90;
      setOverHero((v) => (v === hero ? v : hero));
      const s = y > 8;
      setScrolled((v) => (v === s ? v : s));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);
  return { overHero, scrolled };
}

export function Navigation() {
  const { pathname } = useLocation();
  const { overHero, scrolled } = useScrollFlags(pathname);
  const [openMenu, setOpenMenu] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); setOpenMenu(''); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpenMenu(''); setMobileOpen(false); } };
    const onDown = (e: MouseEvent) => { if (!(e.target as Element).closest?.('[data-menu]')) setOpenMenu(''); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toolsActive = ['/toolkit', '/worksheets', '/games', '/activity-booklet'].some((p) => pathname.startsWith(p));
  const researchActive = ['/research', '/case-studies'].some((p) => pathname.startsWith(p));
  const light = overHero && !mobileOpen;
  const v = (c: string, t: string) => ({ ['--c' as string]: c, ['--t' as string]: t });

  return (
    <>
      <header className={`nav ${light ? 'nav--hero' : ''} ${scrolled && !light ? 'nav--solid' : ''}`}>
        <Link to="/" className="nav__logo" aria-label="Project तर्क home">
          <img src={light ? logoLightSrc : logoSrc} alt="Project तर्क" />
        </Link>

        {/* Desktop index */}
        <nav className="nav__pill" aria-label="Main">
          <NavLink to="/framework" className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`} style={v(LINKS[0].color, LINKS[0].tint)}>
            <span className="nav__dot" aria-hidden="true" />Framework
          </NavLink>

          <MenuLink id="tools" label="Tools" color={MOVE_COLORS.SURFACE} tint="var(--tint-surface)" items={TOOLS} active={toolsActive} open={openMenu} setOpen={setOpenMenu} />

          <NavLink to="/thinking-partner" className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`} style={v(LINKS[1].color, LINKS[1].tint)}>
            <span className="nav__dot" aria-hidden="true" />Thinking Partner
          </NavLink>

          <MenuLink id="research" label="Research" color={MOVE_COLORS.TRACE} tint="var(--tint-trace)" items={RESEARCH} active={researchActive} open={openMenu} setOpen={setOpenMenu} />

          <NavLink to="/about" className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`} style={v(LINKS[3].color, LINKS[3].tint)}>
            <span className="nav__dot" aria-hidden="true" />About
          </NavLink>

          <Link to="/thinking-partner" className="nav__cta">
            Start thinking <span className="nav__cta-arrow" aria-hidden="true">→</span>
          </Link>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          className="nav__menu-btn"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span>{mobileOpen ? 'Close' : 'Menu'}</span>
          <span className={`nav__burger ${mobileOpen ? 'is-x' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      {/* Mobile overlay */}
      <div className={`mnav ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
        <nav className="mnav__list" aria-label="Mobile">
          {MOBILE.map((m, i) => (
            <NavLink
              key={m.path}
              to={m.path}
              className="mnav__link"
              style={{ ['--c' as string]: m.color, transitionDelay: mobileOpen ? `${60 + i * 35}ms` : '0ms' }}
              tabIndex={mobileOpen ? 0 : -1}
            >
              <span className="mnav__diamond" aria-hidden="true" />
              {m.label}
              {m.soon && <span className="soon">Soon</span>}
            </NavLink>
          ))}
        </nav>
        <div className="mnav__foot">
          <Link to="/thinking-partner" className="pill pill--ink" tabIndex={mobileOpen ? 0 : -1}>
            <span>Start thinking</span><span className="pill__arrow" aria-hidden="true">→</span>
          </Link>
          <a href={DOC_URL} target="_blank" rel="noopener noreferrer" className="mnav__doc" tabIndex={mobileOpen ? 0 : -1}>Project document ↗</a>
          <a href="https://www.instagram.com/project.tark/" target="_blank" rel="noopener noreferrer" className="mnav__ig" tabIndex={mobileOpen ? 0 : -1}>@project.tark</a>
        </div>
      </div>
    </>
  );
}
