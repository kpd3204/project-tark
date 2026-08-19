import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { EASE, MOVE_COLORS, MOVE_ORDER, Diamond } from './kit';

const NAV_LINKS = [
  { label: 'Framework',        path: '/framework'        },
  { label: 'Thinking Partner', path: '/thinking-partner' },
  { label: 'Toolkit',          path: '/toolkit'          },
  { label: 'Worksheets',       path: '/worksheets'       },
  { label: 'Games',            path: '/games'            },
  { label: 'Case Studies',     path: '/case-studies'     },
  { label: 'Research',         path: '/research'         },
  { label: 'About',            path: '/about'            },
];

function FooterLink({ label, path, index }: { label: string; path: string; index: number }) {
  return (
    <Link
      to={path}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        fontFamily: 'var(--font-body)',
        color: 'rgba(245,244,241,0.55)',
        fontSize: 14,
        textDecoration: 'none',
        padding: '7px 0',
        transition: 'color 0.25s, padding-left 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = '#FFD167';
        el.style.paddingLeft = '8px';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = 'rgba(245,244,241,0.55)';
        el.style.paddingLeft = '0px';
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(245,244,241,0.25)' }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      {label}
    </Link>
  );
}

function ContactLink({ href, label, external = false, icon }: { href: string; label: string; external?: boolean; icon?: React.ReactNode }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-body)',
        color: 'rgba(245,244,241,0.55)',
        fontSize: 13.5,
        textDecoration: 'none',
        padding: '3px 0',
        transition: 'color 0.25s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FFD167')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(245,244,241,0.55)')}
    >
      {icon}
      {label}
    </a>
  );
}

export function PageFooter() {
  return (
    <footer className="tk-grain" style={{ backgroundColor: '#1A1A1A', position: 'relative', overflow: 'hidden' }}>
      {/* Move colour ribbon */}
      <div style={{ display: 'flex', height: 4 }}>
        {MOVE_ORDER.map((k) => (
          <motion.div
            key={k}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: MOVE_ORDER.indexOf(k) * 0.06 }}
            style={{ flex: 1, backgroundColor: MOVE_COLORS[k], transformOrigin: 'left' }}
          />
        ))}
      </div>

      <div className="tk-wrap" style={{ paddingTop: 'clamp(64px, 8vw, 112px)', paddingBottom: 48 }}>
        {/* Top row — statement + columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'clamp(40px, 5vw, 72px)',
            paddingBottom: 'clamp(48px, 6vw, 80px)',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD167', fontSize: 34, fontWeight: 700, lineHeight: 1, marginBottom: 16 }}>
              तर्क
            </div>
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,244,241,0.5)', fontSize: 14, lineHeight: 1.7, maxWidth: 240, margin: 0 }}>
              A system for thinking when answers are not given.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              {MOVE_ORDER.map((k) => <Diamond key={k} color={MOVE_COLORS[k]} size={7} />)}
            </div>
          </div>

          {/* Index */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,244,241,0.3)', fontSize: 9.5, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 20 }}>
              Index
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {NAV_LINKS.map((l, i) => <FooterLink key={l.path} label={l.label} path={l.path} index={i} />)}
            </div>
          </div>

          {/* Connect */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,244,241,0.3)', fontSize: 9.5, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 20 }}>
              Connect
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.3)', marginBottom: 6 }}>
                Project TARK
              </div>
              <ContactLink href="mailto:project.tark@gmail.com" label="project.tark@gmail.com" />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.3)', marginBottom: 6 }}>
                Author
              </div>
              <ContactLink href="mailto:kalpakpdoshi@gmail.com" label="kalpakpdoshi@gmail.com" />
            </div>

            <ContactLink
              href="https://www.instagram.com/project.tark/"
              label="@project.tark"
              external
              icon={<Instagram size={14} strokeWidth={1.5} />}
            />
          </div>
        </div>
      </div>

      {/* Giant wordmark — clipped at the base like a printer's signature */}
      <div style={{ overflow: 'hidden', lineHeight: 0 }} aria-hidden="true">
        <motion.div
          initial={{ y: '38%' }}
          whileInView={{ y: '12%' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(120px, 24vw, 380px)',
            letterSpacing: '-0.04em',
            lineHeight: 0.78,
            color: 'rgba(245,244,241,0.07)',
            textAlign: 'center',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          TARK
        </motion.div>
      </div>

      {/* Bottom strip */}
      <div style={{ backgroundColor: 'var(--tk-navy)', position: 'relative' }}>
        <div
          className="tk-wrap"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap', paddingTop: 16, paddingBottom: 16,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,244,241,0.4)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ◇ Studio Carbon, Gandhinagar · GLS Institute of Design, Ahmedabad
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,244,241,0.4)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Project तर्क · 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
