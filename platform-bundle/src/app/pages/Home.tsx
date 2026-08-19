import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PageFooter } from '../components/PageFooter';
import { AssumptionTicker } from '../components/AssumptionTicker';
import { HeroSection } from '../components/HeroSection';
import { useIsMobile } from '../hooks/useIsMobile';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import {
  EASE, Reveal, LineReveal, SectionHead, Counter, Btn,
} from '../components/kit';

/* ─── Data ─────────────────────────────────────────────────── */
const MOVES: { key: MoveKey; color: string; dark: boolean; hindi: string; tagline: string; action: string }[] = [
  { key: 'OPEN',    color: '#FFD167', dark: true,  hindi: 'खुलना',           tagline: 'Challenge the given',   action: 'Question what you assume'  },
  { key: 'TRACE',   color: '#E27238', dark: false, hindi: 'पता लगाना',       tagline: 'Map the system',        action: 'Follow where it came from' },
  { key: 'SHIFT',   color: '#465BA4', dark: false, hindi: 'बदलना',           tagline: 'Imagine alternatives',  action: 'Imagine it differently'    },
  { key: 'SURFACE', color: '#4DB49F', dark: false, hindi: 'उभारना',          tagline: 'See your thinking',     action: "Name what nobody's saying" },
  { key: 'COMMIT',  color: '#DA3832', dark: false, hindi: 'प्रतिबद्ध होना', tagline: 'Act under uncertainty', action: 'Decide and own it'         },
];

const WHAT_IS_STRIPS = [
  { color: '#FFD167', lead: 'A system, not a syllabus.', text: 'Most education gives you answers. This gives you a system for finding better ones.' },
  { color: '#465BA4', lead: 'Five moves, not rules.',    text: 'Not a checklist. Five ways of looking at any situation differently.' },
  { color: '#4DB49F', lead: 'Built for India.',          text: 'Every scenario, every question, grounded in Indian contexts and concerns.' },
];

const STATS: { value?: number; suffix?: string; label1?: string; label: string; color: string; isText?: boolean; source: string }[] = [
  { value: 56, suffix: '%', label: "of Grade 8 students can't read a Grade 2 text.", color: '#FFD167', source: 'ASER 2023' },
  { label1: '1 in 7', label: 'Indian adolescents experience a mental health condition.', color: '#E27238', isText: true, source: 'NIMHANS 2023' },
  { value: 0, suffix: ' hrs', label: 'mandated in the Indian curriculum for thinking practice.', color: '#465BA4', source: 'NEP 2020' },
];

const WHY_LINES = [
  'Most education teaches answers. This teaches thinking.',
  "Real problems don't come with instructions.",
  'You need a system when certainty breaks.',
];

/* ═══ FIVE MOVES — editorial index ═══════════════════════════ */
function MoveRow({ move, index }: { move: typeof MOVES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const ink = move.dark ? '#1A1A1A' : '#FFFFFF';
  const inkDim = move.dark ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.65)';

  return (
    <Reveal delay={index * 0.05} y={20}>
      <Link
        to={`/framework#${move.key.toLowerCase()}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: isMobile ? '32px 44px 1fr auto' : '64px 72px minmax(240px, 1.1fr) 1fr auto',
          alignItems: 'center',
          gap: isMobile ? 14 : 28,
          padding: isMobile ? '22px 4px' : 'clamp(24px, 2.6vw, 38px) 8px',
          borderBottom: '1px solid var(--tk-border)',
          textDecoration: 'none',
          overflow: 'hidden',
          isolation: 'isolate',
        }}
      >
        {/* Colour fill sweeps up on hover */}
        <motion.div
          animate={{ scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ position: 'absolute', inset: 0, backgroundColor: move.color, transformOrigin: 'bottom', zIndex: -1 }}
        />

        {/* Index */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? 10 : 12,
            letterSpacing: '0.14em',
            color: hovered ? inkDim : '#BBBBBB',
            transition: 'color 0.3s',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon — colour state swaps, orientation never changes */}
        <div style={{ width: isMobile ? 36 : 52, height: isMobile ? 36 : 52 }}>
          <MoveIcon move={move.key} size={isMobile ? 36 : 52} variant={hovered ? (move.dark ? 'black' : 'white') : 'color'} />
        </div>

        {/* Name + Hindi */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(26px, 4.2vw, 60px)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: hovered ? ink : '#1A1A1A',
              transition: 'color 0.3s',
            }}
          >
            {move.key}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-devanagari)',
              fontWeight: 700,
              fontSize: 'clamp(14px, 1.6vw, 22px)',
              color: hovered ? inkDim : '#999999',
              transition: 'color 0.3s',
            }}
          >
            {move.hindi}
          </span>
        </div>

        {/* Tagline — swaps to the action line on hover */}
        {!isMobile && (
          <div style={{ position: 'relative', height: 22, overflow: 'hidden' }}>
            <motion.div
              animate={{ y: hovered ? -22 : 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div style={{ height: 22, display: 'flex', alignItems: 'center', fontFamily: 'var(--font-body)', fontSize: 15, color: '#555555' }}>
                {move.tagline}
              </div>
              <div style={{ height: 22, display: 'flex', alignItems: 'center', fontFamily: 'var(--font-body)', fontSize: 15, color: inkDim, fontStyle: 'italic' }}>
                {move.action}
              </div>
            </motion.div>
          </div>
        )}

        {/* Arrow */}
        <motion.span
          animate={{ x: hovered ? 0 : -8, opacity: hovered ? 1 : 0.35 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 18 : 26,
            color: hovered ? ink : '#1A1A1A',
            justifySelf: 'end',
          }}
        >
          →
        </motion.span>
      </Link>
    </Reveal>
  );
}

/* ═══ Main component ═════════════════════════════════════════ */
export function Home() {
  const isMobile = useIsMobile();

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <HeroSection />

      {/* ── WHAT IS TARK — manifesto ─────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)' }}>
        <div className="tk-wrap">
          <SectionHead label="What is TARK" index="01 / 04" />

          <div className="tk-cols" style={{ marginTop: 'clamp(36px, 5vw, 64px)' }}>
            <div>
              <Reveal delay={0.1}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.8, color: '#999999', maxWidth: 240, margin: 0 }}>
                  तर्क (tark) — Sanskrit-rooted Hindi for <em>reasoning, logic, deliberation</em>.
                </p>
              </Reveal>
            </div>

            <div>
              {WHAT_IS_STRIPS.map((strip, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '28px 1fr' : '72px 1fr',
                      gap: isMobile ? 14 : 32,
                      alignItems: 'baseline',
                      padding: 'clamp(28px, 3.4vw, 48px) 0',
                      borderTop: i === 0 ? '1px solid var(--tk-border)' : 'none',
                      borderBottom: '1px solid var(--tk-border)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: '#BBBBBB' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(20px, 2.6vw, 36px)',
                        lineHeight: 1.25,
                        letterSpacing: '-0.018em',
                        color: '#1A1A1A',
                        margin: 0,
                        maxWidth: '26em',
                        fontWeight: 400,
                        textWrap: 'balance' as any,
                      }}
                    >
                      <strong style={{ fontWeight: 700 }}>{strip.lead}</strong>{' '}
                      <span style={{ color: '#8A8A85' }}>{strip.text}</span>
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FIVE MOVES — editorial index ─────────────────────── */}
      <section style={{ backgroundColor: '#F5F4F1', paddingBlock: 'var(--space-section)' }}>
        <div className="tk-wrap">
          <SectionHead label="The Five Moves" index="02 / 04" />

          <div style={{ marginTop: 'clamp(28px, 4vw, 48px)', marginBottom: 'clamp(36px, 5vw, 64px)' }}>
            <LineReveal
              lines={[
                <span key="a" className="tk-light">Five ways of looking</span>,
                'at any situation.',
              ]}
              className="tk-display-h"
            />
          </div>

          <div style={{ borderTop: '1px solid var(--tk-border)' }}>
            {MOVES.map((move, i) => (
              <MoveRow key={move.key} move={move} index={i} />
            ))}
          </div>

          <Reveal delay={0.15}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 28 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#999999' }}>
                Not a sequence — use any move, in any order
              </span>
              <Link to="/framework" className="tk-arrow-link">
                <span>Read the framework</span>
                <span className="arr">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WHY TARK EXISTS — navy chapter ───────────────────── */}
      <section className="tk-grain" style={{ backgroundColor: 'var(--tk-navy)', paddingBlock: 'var(--space-section)' }}>
        <div className="tk-wrap">
          <SectionHead label="Why TARK Exists" index="03 / 04" light />

          {/* Stats — hairline table, no boxes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              marginTop: 'clamp(40px, 5vw, 72px)',
              borderTop: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  style={{
                    paddingTop: isMobile ? 28 : 'clamp(28px, 3vw, 48px)',
                    paddingBottom: isMobile ? 28 : 'clamp(28px, 3vw, 48px)',
                    paddingRight: isMobile ? 0 : 'clamp(20px, 2.5vw, 40px)',
                    paddingLeft: isMobile || i === 0 ? 0 : 'clamp(20px, 2.5vw, 40px)',
                    borderRight: !isMobile && i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.14)' : 'none',
                    borderBottom: isMobile ? '1px solid rgba(255,255,255,0.14)' : 'none',
                    height: '100%',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 5.5vw, 84px)', fontWeight: 700, color: stat.color, lineHeight: 0.95, marginBottom: 16, letterSpacing: '-0.02em' }}>
                    {stat.isText ? stat.label1 : <Counter target={stat.value!} suffix={stat.suffix} />}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: 0, maxWidth: '30ch' }}>
                    {stat.label}
                  </p>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: 14 }}>
                    {stat.source}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Statement */}
          <div style={{ marginTop: 'clamp(56px, 7vw, 104px)' }}>
            <LineReveal
              as="h2"
              className="tk-display-h"
              lines={[
                <span key="a" className="tk-light" style={{ color: 'rgba(245,244,241,0.85)' }}>Indian education builds knowledge.</span>,
                <span key="b" style={{ color: '#FFD167' }}>This builds thinking.</span>,
              ]}
            />
          </div>

          {/* Why lines */}
          <div style={{ marginTop: 'clamp(48px, 6vw, 88px)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            {WHY_LINES.map((line, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '32px 1fr' : '64px 1fr',
                    gap: 20,
                    alignItems: 'baseline',
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                    padding: 'clamp(20px, 2.8vw, 36px) 0',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', color: '#F5F4F1', fontSize: 'clamp(19px, 2.6vw, 36px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.015em' }}>
                    {line}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ASSUMPTION TICKER — a beat before the close ──────── */}
      <AssumptionTicker />

      {/* ── CLOSING CTA ──────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)' }}>
        <div className="tk-wrap">
          <SectionHead label="Begin" index="04 / 04" />

          <div style={{ marginTop: 'clamp(40px, 5vw, 72px)', display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 4vw, 56px)' }}>
            <LineReveal
              as="h2"
              className="tk-hero-h"
              lines={[
                <span key="a" className="tk-light" style={{ color: '#6B6B66' }}>You already know how to think.</span>,
                <span key="b">
                  <span style={{ fontFamily: 'var(--font-devanagari)', color: '#E9B33B' }}>तर्क</span> makes it visible.
                </span>,
              ]}
            />

            <Reveal delay={0.2}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
                  <Btn to="/thinking-partner" variant="ink" style={isMobile ? { flex: 1 } : { padding: '20px 44px' }}>
                    Start Thinking →
                  </Btn>
                  <Btn to="/toolkit" variant="ghost" style={isMobile ? { flex: 1 } : { padding: '20px 44px' }}>
                    Browse the Tools
                  </Btn>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#999999' }}>
                  Free · No sign-up · Works in 15 minutes
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
