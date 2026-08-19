import { Link } from 'react-router';
import { Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { useIsMobile } from '../hooks/useIsMobile';
import { EASE, Reveal, LineReveal, SectionHead, Diamond } from '../components/kit';

const principles = [
  { label: 'Design principle', text: 'A system for thinking, not a website for reading.', color: '#E27238' },
  { label: 'Audience',         text: 'Indian adolescents aged 13–22, educators, researchers, and institutions engaging with cognitive pedagogy.', color: '#465BA4' },
  { label: 'What TARK is not', text: 'A curriculum replacement. A political position. A quick fix. It is a cognitive infrastructure project — patient, rigorous, and long-term.', color: '#4DB49F' },
];

const teamEntries = [
  { role: 'Author & Framework Design', name: 'Kalpak Doshi' },
  { role: 'Institutional Partner',     name: 'GLS Institute of Design' },
  { role: 'Studio',                    name: 'Studio Carbon' },
  { role: 'Published',                 name: 'April 2026' },
];

const moves: MoveKey[] = ['OPEN', 'TRACE', 'SHIFT', 'SURFACE', 'COMMIT'];

const connectColumns = [
  {
    title: 'Project TARK',
    role: null as string | null,
    links: [
      { label: 'project.tark@gmail.com', href: 'mailto:project.tark@gmail.com' },
      { label: '@project.tark', href: 'https://www.instagram.com/project.tark/', external: true, ig: true },
    ],
  },
  {
    title: 'Kalpak Doshi',
    role: 'Author & Framework Design',
    links: [{ label: 'kalpakpdoshi@gmail.com', href: 'mailto:kalpakpdoshi@gmail.com' }],
  },
  {
    title: 'Studio Carbon',
    role: 'Design & Development',
    links: [{ label: 'studiocarbon.com', href: 'https://www.studiocarbon.com/', external: true }],
  },
];

export function AboutPage() {
  const isMobile = useIsMobile();

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="tk-grain" style={{ backgroundColor: '#1A1A1A', paddingTop: 'clamp(128px, 18vh, 200px)', paddingBottom: 'clamp(56px, 7vw, 104px)' }}>
        <div className="tk-wrap">
          <Reveal y={16}>
            <div className="tk-eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
              About the Project
            </div>
          </Reveal>
          <LineReveal
            as="h1"
            className="tk-hero-h"
            color="#FFFFFF"
            lines={[
              <span key="a">Project <span style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD167' }}>तर्क</span></span>,
            ]}
            delay={0.1}
          />
          <Reveal delay={0.3}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.62)', fontSize: 'var(--text-lede)', lineHeight: 1.75, maxWidth: '52ch', margin: 'clamp(28px, 3.5vw, 48px) 0 0' }}>
              TARK is a cognitive pedagogy framework developing Speculative Thinking as
              foundational infrastructure for Indian youth. It proposes five recursive cognitive
              moves — practised, not performed — that build the capacity to think when answers
              are not given.
            </p>
          </Reveal>
        </div>
      </header>

      {/* ── CORE PRINCIPLES ─────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)' }}>
        <div className="tk-wrap">
          <SectionHead label="Core Principles" />
          <div style={{ marginTop: 'clamp(28px, 3.5vw, 48px)', borderTop: '1px solid var(--tk-border)' }}>
            {principles.map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'minmax(200px, 280px) 1fr',
                    gap: isMobile ? 12 : 48,
                    padding: 'clamp(28px, 3.5vw, 52px) 0',
                    borderBottom: '1px solid var(--tk-border)',
                    alignItems: 'baseline',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Diamond color={p.color} size={7} />
                    <span className="tk-eyebrow" style={{ color: '#999999' }}>{p.label}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', color: '#1A1A1A', fontSize: 'clamp(19px, 2.4vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.015em', margin: 0, maxWidth: '32ch' }}>
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIVE MOVES ──────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F4F1', paddingBlock: 'var(--space-block)', borderBlock: '1px solid var(--tk-border)' }}>
        <div className="tk-wrap">
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 32 }}>
            <div>
              <SectionHead label="The System" />
              <div style={{ marginTop: 'clamp(20px, 2.5vw, 36px)' }}>
                <LineReveal as="h2" className="tk-display-h" lines={['Five moves.', 'One framework.']} />
              </div>
            </div>
            <Reveal delay={0.2}>
              <Link to="/framework" className="tk-btn tk-btn--ghost">Explore Framework →</Link>
            </Reveal>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px, 3vw, 48px)', marginTop: 'clamp(36px, 4.5vw, 64px)' }}>
            {moves.map((m, i) => (
              <Reveal key={m} delay={0.1 + i * 0.06}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.35, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <MoveIcon move={m} size={30} variant="color" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#1A1A1A' }}>
                    {m}
                  </span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM & PUBLICATION ──────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)' }}>
        <div className="tk-wrap">
          <SectionHead label="Team & Publication" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              marginTop: 'clamp(28px, 3.5vw, 48px)',
              borderTop: '1px solid var(--tk-border)',
            }}
          >
            {teamEntries.map((entry, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  style={{
                    borderBottom: '1px solid var(--tk-border)',
                    paddingBlock: 'clamp(24px, 3vw, 40px)',
                    paddingRight: 32,
                    height: '100%',
                  }}
                >
                  <div className="tk-eyebrow" style={{ marginBottom: 12 }}>{entry.role}</div>
                  <div style={{ fontFamily: 'var(--font-display)', color: '#1A1A1A', fontSize: 'clamp(20px, 2.4vw, 32px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.015em' }}>
                    {entry.name}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONNECT ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F4F1', paddingBlock: 'var(--space-block)', borderTop: '1px solid var(--tk-border)' }}>
        <div className="tk-wrap">
          <SectionHead label="Connect" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              marginTop: 'clamp(28px, 3.5vw, 48px)',
            }}
          >
            {connectColumns.map((col, i) => (
              <Reveal key={col.title} delay={i * 0.07}>
                <div
                  style={{
                    paddingRight: isMobile ? 0 : 32,
                    paddingLeft: !isMobile && i > 0 ? 32 : 0,
                    borderLeft: !isMobile && i > 0 ? '1px solid var(--tk-border)' : 'none',
                    paddingBlock: isMobile ? 20 : 8,
                    borderTop: isMobile && i > 0 ? '1px solid var(--tk-border)' : 'none',
                    height: '100%',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#1A1A1A', marginBottom: col.role ? 4 : 18 }}>
                    {col.title}
                  </div>
                  {col.role && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#999999', marginBottom: 18 }}>{col.role}</div>
                  )}
                  {col.links.map((l: any) => (
                    <a
                      key={l.label}
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 14.5, color: '#555555', textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = l.ig ? '#E27238' : '#1A1A1A')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#555555')}
                    >
                      {l.ig && <Instagram size={14} strokeWidth={1.5} />}
                      {l.label}
                    </a>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
