import { useState } from 'react';
import { motion } from 'motion/react';
import { PageFooter } from '../components/PageFooter';
import { AssumptionTicker } from '../components/AssumptionTicker';
import { useIsMobile } from '../hooks/useIsMobile';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { EASE, Reveal, LineReveal, SectionHead, Diamond } from '../components/kit';

const TP_URL      = 'https://thinkingpartner.netlify.app/';
const CHATGPT_URL = 'https://chatgpt.com/g/g-69e25c86db488191824d86bf3399227f-trk-thinking-partner';
const GEMINI_URL  = 'https://gemini.google.com/gem/1O2CGR8VO65PPOBuctSwskGO7RyGUsucZ?usp=sharing';

const MOVES: { key: MoveKey; color: string; hint: string }[] = [
  { key: 'OPEN',    color: '#FFD167', hint: 'What if the opposite were true?' },
  { key: 'TRACE',   color: '#E27238', hint: 'Where did this idea come from?' },
  { key: 'SHIFT',   color: '#465BA4', hint: 'What would this look like elsewhere?' },
  { key: 'SURFACE', color: '#4DB49F', hint: 'What is nobody saying out loud?' },
  { key: 'COMMIT',  color: '#DA3832', hint: 'What will I actually do with this?' },
];

const HOW_IT_WORKS = [
  {
    step: '01', color: '#FFD167',
    title: 'Describe your situation',
    desc: 'Write about something you are genuinely uncertain about. A decision, a conflict, a question without a clear answer. Real situations only.',
  },
  {
    step: '02', color: '#465BA4',
    title: 'Work through the five moves',
    desc: 'The partner guides you through OPEN, TRACE, SHIFT, SURFACE, and COMMIT, one at a time, at your pace. It asks questions. Not gives answers.',
  },
  {
    step: '03', color: '#DA3832',
    title: 'Build your thinking map',
    desc: 'By the end you will have a clearer picture of the system, your assumptions, and what you are actually deciding.',
  },
];

const WHAT_MAKES = [
  'It asks questions — it never tells you what to think.',
  'It applies one of five moves to your specific situation.',
  'It slows you down intentionally. That is the point.',
  'You can return with the same situation and see new angles.',
];

const WAYS = [
  {
    n: '01',
    name: 'Thinking Partner',
    desc: 'The full guided interface · powered by Gemini 3',
    href: TP_URL,
    color: '#FFD167',
    primary: true,
  },
  {
    n: '02',
    name: 'ChatGPT',
    desc: 'The TARK GPT — the same five moves, inside ChatGPT',
    href: CHATGPT_URL,
    color: '#4DB49F',
  },
  {
    n: '03',
    name: 'Gemini Gem',
    desc: 'The TARK Gem — carry the framework into Google Gemini',
    href: GEMINI_URL,
    color: '#465BA4',
  },
  {
    n: '04',
    name: 'Claude Skill',
    desc: 'Coming soon',
    href: null as string | null,
    color: '#E27238',
  },
];

/* One way to think — an editorial chooser row */
function WayRow({ way }: { way: typeof WAYS[0] }) {
  const [hovered, setHovered] = useState(false);
  const disabled = !way.href;
  const inner = (
    <>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', color: hovered ? 'rgba(245,244,241,0.7)' : 'rgba(245,244,241,0.3)', transition: 'color 0.3s' }}>
        {way.n}
      </span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(22px, 2.8vw, 40px)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: disabled ? 'rgba(245,244,241,0.35)' : hovered ? way.color : '#F5F4F1',
            transition: 'color 0.3s',
          }}
        >
          {way.name}
        </span>
        {way.primary && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#1A1A1A', backgroundColor: '#FFD167', padding: '4px 9px', position: 'relative', top: -3 }}>
            Recommended
          </span>
        )}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: disabled ? 'rgba(245,244,241,0.25)' : 'rgba(245,244,241,0.5)',
          textAlign: 'right',
          justifySelf: 'end',
        }}
        className="hidden md:block"
      >
        {way.desc}
      </span>
      <motion.span
        animate={{ x: hovered ? 0 : -8, opacity: disabled ? 0.15 : hovered ? 1 : 0.4 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: hovered ? way.color : '#F5F4F1', justifySelf: 'end' }}
      >
        ↗
      </motion.span>
    </>
  );

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '44px minmax(0, 1.3fr) minmax(0, 1fr) 32px',
    alignItems: 'center',
    gap: 20,
    padding: 'clamp(20px, 2.4vw, 32px) 4px',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    textDecoration: 'none',
    cursor: disabled ? 'default' : 'pointer',
  };

  if (disabled) {
    return (
      <div style={rowStyle} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <a
      href={way.href!}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={rowStyle}
    >
      {inner}
    </a>
  );
}

export function ThinkingPartnerPage() {
  const isMobile = useIsMobile();

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      {/* ── HERO — navy, focused ─────────────────────────────── */}
      <section
        className="tk-grain"
        style={{
          backgroundColor: 'var(--tk-navy)',
          minHeight: '92svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingBlock: 'clamp(128px, 18vh, 200px) clamp(72px, 9vw, 120px)',
        }}
      >
        <div className="tk-wrap" style={{ width: '100%' }}>
          <Reveal y={16}>
            <div className="tk-eyebrow" style={{ color: 'rgba(245,244,241,0.4)', marginBottom: 32 }}>
              AI Thinking Partner · Project तर्क
            </div>
          </Reveal>

          <LineReveal
            as="h1"
            className="tk-hero-h"
            color="#F5F4F1"
            lines={[
              <span key="a" className="tk-light" style={{ color: 'rgba(245,244,241,0.75)' }}>What do you want</span>,
              'to think through?',
            ]}
            delay={0.1}
          />

          <Reveal delay={0.35}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,244,241,0.62)', fontSize: 'var(--text-lede)', lineHeight: 1.7, maxWidth: '46ch', margin: 'clamp(28px, 3.5vw, 48px) 0 clamp(36px, 4.5vw, 56px)' }}>
              The TARK Thinking Partner guides you through the five moves, applied to any
              situation you are genuinely unsure about. Bring a real decision. Not a hypothetical.
            </p>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="tk-eyebrow" style={{ color: 'rgba(245,244,241,0.4)', marginBottom: 4 }}>
              Choose where to think
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: 16 }}>
              {WAYS.map((way) => (
                <WayRow key={way.n} way={way} />
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,244,241,0.3)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 24 }}>
              Free · Opens in a new tab · No sign-up needed
            </div>
          </Reveal>
        </div>

        {/* Bottom five-colour strip */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', height: 4 }}>
          {MOVES.map((m) => <div key={m.key} style={{ flex: 1, backgroundColor: m.color }} />)}
        </div>
      </section>

      {/* ── FIVE MOVES — applied ─────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F4F1', paddingBlock: 'var(--space-block)', borderBottom: '1px solid var(--tk-border)' }}>
        <div className="tk-wrap">
          <SectionHead label="The five moves — applied to your situation" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
              gap: 1,
              marginTop: 'clamp(28px, 3.5vw, 48px)',
              backgroundColor: 'var(--tk-border)',
              border: '1px solid var(--tk-border)',
            }}
          >
            {MOVES.map((m, i) => (
              <Reveal key={m.key} delay={i * 0.06} style={{ height: '100%' }}>
                <div
                  style={{ backgroundColor: '#FFFFFF', padding: 'clamp(24px, 2.5vw, 36px)', height: '100%', display: 'flex', flexDirection: 'column', gap: 16, transition: 'background-color 0.25s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = `${m.color}0F`)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF')}
                >
                  <MoveIcon move={m.key} size={26} variant="color" />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.01em' }}>
                    {m.key}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontStyle: 'italic', color: '#555555', lineHeight: 1.6, margin: 0 }}>
                    “{m.hint}”
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)' }}>
        <div className="tk-wrap">
          <SectionHead label="How it works" />
          <div className="tk-cols" style={{ marginTop: 'clamp(28px, 3.5vw, 48px)' }}>
            <Reveal delay={0.05}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.015em', color: '#1A1A1A', margin: 0 }}>
                A session takes
                <br />
                20–40 minutes.
              </p>
            </Reveal>
            <div>
              {HOW_IT_WORKS.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.07}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '40px 1fr' : '80px 1fr',
                      gap: 20,
                      padding: 'clamp(24px, 3vw, 40px) 0',
                      borderBottom: '1px solid var(--tk-border)',
                      borderTop: i === 0 ? '1px solid var(--tk-border)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingTop: 6 }}>
                      <Diamond color={item.color} size={8} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(19px, 2.2vw, 28px)', fontWeight: 700, color: '#1A1A1A', marginBottom: 10, letterSpacing: '-0.015em' }}>
                        {item.title}
                      </div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, color: '#555555', lineHeight: 1.75, margin: 0, maxWidth: '52ch' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES IT DIFFERENT + CTA ────────────────────── */}
      <section style={{ backgroundColor: 'var(--tk-navy)', paddingBlock: 'var(--space-section)' }}>
        <div className="tk-wrap">
          <SectionHead label="What makes it different" light />
          <div style={{ marginTop: 'clamp(28px, 3.5vw, 48px)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {WHAT_MAKES.map((line, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', padding: 'clamp(20px, 2.6vw, 32px) 0' }}>
                  <Diamond color={MOVES[i % MOVES.length].color} size={8} style={{ position: 'relative', top: -2 }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(17px, 2vw, 26px)', fontWeight: 700, color: '#F5F4F1', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                    {line}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', marginTop: 'clamp(48px, 6vw, 80px)' }}>
              <div>
                <div className="tk-eyebrow" style={{ color: 'rgba(245,244,241,0.4)', marginBottom: 10 }}>Ready to begin?</div>
                <p style={{ fontFamily: 'var(--font-display)', color: '#F5F4F1', fontSize: 'var(--text-title)', fontWeight: 700, lineHeight: 1.05, margin: 0 }}>
                  Bring a real situation. Not a hypothetical.
                </p>
              </div>
              <a href={TP_URL} target="_blank" rel="noopener noreferrer" className="tk-btn tk-btn--yellow" style={{ padding: '18px 36px' }}>
                Open Thinking Partner →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--tk-border)' }}>
        <div className="tk-wrap" style={{ paddingBlock: 'clamp(28px, 3.5vw, 44px)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: '#AAAAAA', fontSize: 12.5, lineHeight: 1.8, maxWidth: '68ch', margin: 0 }}>
            This is an AI system and may produce inaccurate or incomplete reasoning. It is a thinking
            tool, not an answer. Always bring your own judgement to any conclusion. The TARK framework
            is the scaffold; your thinking is the material.
          </p>
        </div>
      </div>

      <AssumptionTicker />
      <PageFooter />
    </div>
  );
}
