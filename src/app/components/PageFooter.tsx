import { Link } from 'react-router';
import { Instagram } from 'lucide-react';
import { MOVE_COLORS, MOVE_ORDER } from './kit';
import { Buddy } from './play';

const EXPLORE = [
  { label: 'Framework',        path: '/framework'        },
  { label: 'Thinking Partner', path: '/thinking-partner' },
  { label: 'Toolkit',          path: '/toolkit'          },
  { label: 'Worksheets',       path: '/worksheets',  soon: true },
  { label: 'Games',            path: '/games',       soon: true },
];
const ABOUT = [
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'Research',     path: '/research'     },
  { label: 'About',        path: '/about'        },
];

export function PageFooter() {
  return (
    <footer className="footer">
      <div className="tk-wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__mark">
              <span lang="hi" className="deva">तर्क</span>
              <span className="footer__buddies" aria-hidden="true">
                {MOVE_ORDER.map((k, i) => <Buddy key={k} color={MOVE_COLORS[k]} size={34} delay={0.05 * i} />)}
              </span>
            </div>
            <p>A system for thinking when answers are not given.</p>
          </div>

          <nav className="footer__col" aria-label="Explore">
            <h3>Explore</h3>
            {EXPLORE.map((l) => (
              <Link key={l.path} to={l.path}>
                {l.label}
                {l.soon && <span className="soon">Soon</span>}
              </Link>
            ))}
          </nav>

          <nav className="footer__col" aria-label="About">
            <h3>Project</h3>
            {ABOUT.map((l) => <Link key={l.path} to={l.path}>{l.label}</Link>)}
          </nav>

          <div className="footer__col">
            <h3>Say hello</h3>
            <a href="mailto:project.tark@gmail.com">project.tark@gmail.com</a>
            <a href="mailto:kalpakpdoshi@gmail.com">kalpakpdoshi@gmail.com <span className="footer__note">author</span></a>
            <a href="https://www.instagram.com/project.tark/" target="_blank" rel="noopener noreferrer" className="footer__ig">
              <Instagram size={16} strokeWidth={1.8} /> @project.tark
            </a>
          </div>
        </div>

        <div className="footer__base">
          <span>Studio Carbon, Gandhinagar · GLS Institute of Design, Ahmedabad</span>
          <span>Project <span lang="hi" className="deva">तर्क</span> · 2026</span>
        </div>
      </div>
    </footer>
  );
}
