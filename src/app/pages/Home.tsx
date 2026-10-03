import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { DocBand } from '../components/ProjectDoc';

import { PageFooter } from '../components/PageFooter';
import { AssumptionTicker } from '../components/AssumptionTicker';
import { HeroSection } from '../components/HeroSection';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal, Counter, EASE } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import { toolsData } from '../data/tools';
import photoUniversity from '../../imports/photos/university-workshop.jpg';
import photoWorksheetPhone from '../../imports/photos/worksheet-and-phone.jpg';
import photoPresentation from '../../imports/photos/presentation-screen.jpg';

// three.js only loads when the dice teaser is reached
const Dice3D = lazy(() => import('../components/Dice3D'));

/* ─── Data ─────────────────────────────────────────────────── */
const MOVES: { key: MoveKey; color: string; tint: string; text: string; ink: string; hindi: string; tagline: string; question: string }[] = [
  { key: 'OPEN',    color: '#FFD167', tint: 'var(--tint-open)',    text: 'var(--text-open)',    ink: '#FFFFFF', hindi: 'खुलना',           tagline: 'Challenge the given',   question: 'What if the opposite were true?' },
  { key: 'TRACE',   color: '#E27238', tint: 'var(--tint-trace)',   text: 'var(--text-trace)',   ink: '#FFFFFF', hindi: 'खोजना',       tagline: 'Map the system',        question: 'Where did this idea come from?' },
  { key: 'SHIFT',   color: '#465BA4', tint: 'var(--tint-shift)',   text: 'var(--text-shift)',   ink: '#FFFFFF', hindi: 'बदलना',           tagline: 'Imagine alternatives',  question: 'What would this look like elsewhere?' },
  { key: 'SURFACE', color: '#4DB49F', tint: 'var(--tint-surface)', text: 'var(--text-surface)', ink: '#FFFFFF', hindi: 'उभरना',          tagline: 'See your thinking',     question: 'What is nobody saying out loud?' },
  { key: 'COMMIT',  color: '#DA3832', tint: 'var(--tint-commit)',  text: 'var(--text-commit)',  ink: '#FFFFFF', hindi: 'प्रतिबद्ध', tagline: 'Act under uncertainty', question: 'What will I actually do with this?' },
];

const PILLARS = [
  { color: '#FFD167', lead: 'A system, not a syllabus.', text: 'Most education gives you answers. This gives you a system for finding better ones.' },
  { color: '#465BA4', lead: 'Five moves, not rules.',    text: 'Not a checklist. Five ways of looking at any situation differently.' },
  { color: '#4DB49F', lead: 'Built for India.',          text: 'Every scenario, every question, grounded in Indian contexts and concerns.' },
];

const STATS: { value?: number; suffix?: string; text?: string; label: string; color: string; tint: string; source: string }[] = [
  { text: '1 in 3',          label: "Class 8 students in rural government schools can't read a Class 2 text.", color: '#FFD167', tint: 'var(--tint-open)',    source: 'ASER 2024' },
  { value: 37, suffix: '%',  label: 'average Class 9 maths score in the national survey.', color: '#E27238', tint: 'var(--tint-trace)',   source: 'PARAKH 2024' },
  { text: '1 in 7',          label: '10 to 19 year olds worldwide live with a mental health condition.', color: '#4DB49F', tint: 'var(--tint-surface)', source: 'WHO 2025' },
];

const PHOTOS = [
  { src: photoUniversity,     alt: 'Students around a table, working through printed TARK tools together', shape: 'a' },
  { src: photoWorksheetPhone, alt: 'A student filling in a TARK worksheet while scanning its QR code with a phone', shape: 'b' },
  { src: photoPresentation,   alt: 'A group mapping ideas on a large screen in a workshop', shape: 'c' },
];

const WHY_LINES = [
  { line: 'Most education teaches answers. This teaches thinking.', color: '#FFD167' },
  { line: "Real problems don't come with instructions.",           color: '#E27238' },
  { line: 'You need a system when certainty breaks.',              color: '#465BA4' },
];

/* ═══ Manifesto ═════════════════════════════════════════════ */
function Manifesto() {
  return (
    <section className="home-manifesto">
      <div className="tk-wrap">
        <Reveal>
          <p className="home-eyebrow">
            <span lang="hi" className="deva">तर्क</span> (tark): Sanskrit-rooted Hindi for <em>reasoning, logic, deliberation</em>
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="home-statement">
            Most education gives you <span className="nowrap">answers <Buddy color="#465BA4" size={0} className="buddy--inline" delay={0.2} /></span>{' '}
            <Tag bg="#FFD167" color="#1D1B16" tilt={-2} className="tag--word"><span lang="hi" className="deva">तर्क</span></Tag> gives you a{' '}
            <span className="hl">
              system
              <Squiggle kind="underline" color="#FFD167" stroke={9} width="100%" className="hl__mark" delay={0.4} />
            </span>{' '}
            for finding better <span className="nowrap"><Buddy color="#DA3832" size={0} className="buddy--inline" delay={0.35} /> ones.</span>
          </h2>
        </Reveal>

        <div className="photo-strip">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.src} delay={0.08 * i} y={36} className={`photo-strip__item photo-strip__item--${p.shape}`}>
              <SoftImg src={p.src} alt={p.alt} />
            </Reveal>
          ))}
          <Buddy color="#4DB49F" size={64} className="photo-strip__buddy" delay={0.3} />
        </div>

        <div className="home-pillars">
          {PILLARS.map((p, i) => (
            <Reveal key={p.lead} delay={0.08 * i}>
              <div className="pillar">
                <Buddy color={p.color} size={44} delay={0.1 * i} />
                <h3 className="pillar__lead">{p.lead}</h3>
                <p className="pillar__text">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ Five moves ════════════════════════════════════════════ */
function MoveCard({ move, index }: { move: typeof MOVES[0]; index: number }) {
  return (
    <Reveal delay={index * 0.06} y={40}>
      <Link to={`/framework#${move.key.toLowerCase()}`} className="move-card" style={{ backgroundColor: move.color, color: move.ink }} data-move={move.key}>
        <span className="move-card__num">{String(index + 1).padStart(2, '0')}</span>
        <span className="move-card__icon"><MoveIcon move={move.key} size={64} variant={move.ink === '#FFFFFF' ? 'white' : 'black'} /></span>
        <span className="move-card__name">{move.key}</span>
        <span className="move-card__hindi deva" lang="hi">{move.hindi}</span>
        <span className="move-card__tagline">{move.tagline}</span>
        <span className="move-card__q">{move.question}</span>
        <span className="move-card__go" aria-hidden="true">→</span>
      </Link>
    </Reveal>
  );
}

function FiveMoves() {
  return (
    <section className="home-moves">
      <div className="tk-wrap">
        <div className="section-head">
          <Reveal>
            <h2 className="display-xl">
              Five ways of <span className="nowrap">l<Buddy color="#E27238" size={0} className="buddy--letter" />oking</span>
              <br />at anything.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="section-head__aside">
              <p>Not a sequence. Use any move, in any order. One at a time, or all five.</p>
              <Pill to="/framework" variant="ghost">Read the framework</Pill>
            </div>
          </Reveal>
        </div>

        <div className="move-grid">
          {MOVES.map((m, i) => <MoveCard key={m.key} move={m} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══ Toolkit, a live peek into the archive ════════════════ */
function ToolkitPeek() {
  const [active, setActive] = useState(0);
  const move = toolsData[active];
  const meta = MOVES[active];
  const total = toolsData.reduce((n, m) => n + m.tools.length, 0);

  return (
    <section className="home-toolkit">
      <div className="tk-wrap">
        <div className="toolkit-panel">
          <div className="toolkit-panel__intro">
            <Tag bg="#1D1B16" tilt={-3}>Toolkit</Tag>
            <h2 className="display-lg">Stuck? <br />There’s a tool for that.</h2>
            <p className="lede">Every tool is a one-page structure for a specific kind of stuck. Printable, free, and it works with the AI Thinking Partner.</p>
            <div className="toolkit-counters">
              <div><strong><Counter target={total} /></strong><span>tools</span></div>
              <div><strong>5</strong><span>moves</span></div>
            </div>
            <Pill to="/toolkit" variant="ink">Browse all {total} tools</Pill>
          </div>

          <div className="toolkit-panel__browser">
            <div className="chip-row" role="tablist" aria-label="Filter tools by move">
              {toolsData.map((m, i) => (
                <button
                  key={m.key}
                  role="tab"
                  aria-selected={i === active}
                  className={`chip ${i === active ? 'is-on' : ''}`}
                  style={i === active ? { backgroundColor: MOVES[i].color, color: MOVES[i].ink, borderColor: MOVES[i].color } : undefined}
                  onClick={() => setActive(i)}
                >
                  <span className="chip__dot" style={{ backgroundColor: MOVES[i].color }} />
                  {m.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={move.key}
                className="tool-list"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {move.tools.map((t, i) => (
                  <li key={t.slug}>
                    <Link to={`/toolkit/${move.key.toLowerCase()}/${t.slug}`} className="tool-row" data-move={move.key}>
                      <span className="tool-row__num"><i style={{ backgroundColor: meta.color }} aria-hidden="true" />{String(i + 1).padStart(2, '0')}</span>
                      <span className="tool-row__body">
                        <span className="tool-row__name">{t.name}</span>
                        <span className="tool-row__tag">{t.tagline}</span>
                      </span>
                      <span className="tool-row__meta">
                        {t.audience.slice(0, 2).map((a) => <span key={a} className="mini-chip">{a}</span>)}
                      </span>
                      <span className="tool-row__go" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Why it exists ═════════════════════════════════════════ */
function Why() {
  return (
    <section className="home-why">
      <div className="tk-wrap">
        <div className="section-head">
          <Reveal>
            <h2 className="display-xl">Why <span lang="hi" className="deva" style={{ color: '#E27238' }}>तर्क</span> exists.</h2>
          </Reveal>
        </div>

        <div className="stat-grid">
          {STATS.map((s, i) => (
            <Reveal key={s.source} delay={i * 0.08}>
              <div className="stat" style={{ backgroundColor: s.tint }}>
                <span className="stat__mark" style={{ backgroundColor: s.color }} aria-hidden="true" />
                <span className="stat__num">{s.text ?? <Counter target={s.value!} suffix={s.suffix} />}</span>
                <p className="stat__label">{s.label}</p>
                <span className="stat__src">Source · {s.source}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="home-claim">
            Indian education builds knowledge.{' '}
            <span className="hl">
              This builds thinking.
              <Squiggle kind="underline" color="#E27238" stroke={9} width="100%" className="hl__mark" delay={0.3} />
            </span>
          </p>
        </Reveal>

        <ul className="why-list">
          {WHY_LINES.map((w, i) => (
            <Reveal key={w.line} delay={i * 0.07}>
              <li>
                <Buddy color={w.color} size={36} delay={0.08 * i} />
                <span>{w.line}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ═══ Close ═════════════════════════════════════════════════ */
function Close() {
  return (
    <section className="home-close">
      <Squiggle kind="loop" width="clamp(120px, 16vw, 220px)" color="var(--ink)" className="home-close__sq1" />
      <Squiggle kind="spiral" width="clamp(60px, 7vw, 96px)" color="var(--ink)" className="home-close__sq2" delay={0.3} />
      <div className="tk-wrap home-close__inner">
        <Reveal>
          <p className="home-close__kicker">You already know how to think.</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="home-close__title">
            <span lang="hi" className="deva">तर्क</span> makes it
            <span className="home-close__tags">
              <Tag bg="#E27238" tilt={-3}>visible</Tag>
              <Tag bg="#465BA4" tilt={2}>usable</Tag>
              <Tag bg="#4DB49F" tilt={-1.5}>yours</Tag>
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="home-close__actions">
            <Pill to="/thinking-partner" variant="ink">Start thinking</Pill>
            <Pill to="/toolkit" variant="ghost">Browse the tools</Pill>
          </div>
          <p className="home-close__meta">Free · No sign-up · Works in 15 minutes</p>
        </Reveal>
        <div className="home-close__buddies" aria-hidden="true">
          {MOVES.map((m, i) => <Buddy key={m.key} color={m.color} size={56} delay={0.06 * i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══ Page ══════════════════════════════════════════════════ */
export function Home() {
  return (
    <div className="home">
      <HeroSection />
      <Manifesto />
      <FiveMoves />
      <ToolkitPeek />
      <AssumptionTicker />
      <Why />
      <section className="sec sec--tight" style={{ background: '#FFFDF8', paddingTop: 0 }}>
        <div className="tk-wrap">
          <Reveal>
            <div className="dice-teaser">
              <div>
                <Tag bg="#465BA4" tilt={-3}>Thinking Dice</Tag>
                <h2 className="dice-teaser__title">Stuck? Roll for a move.</h2>
                <p className="lede" style={{ maxWidth: '40ch' }}>A 3D version of the TARK dice. Flick it, see which move it lands on, and try that move on a real situation.</p>
                <div style={{ marginTop: 26 }}><Pill to="/dice" variant="ink">Roll the dice</Pill></div>
              </div>
              <Link to="/dice" className="dice-teaser__die" aria-label="Open the Thinking Dice"><Suspense fallback={<div className="dice3d" />}><Dice3D idle /></Suspense></Link>
            </div>
          </Reveal>
          <div style={{ marginTop: 'clamp(16px, 2vw, 24px)' }}><DocBand /></div>
        </div>
      </section>
      <Close />
      <PageFooter />
    </div>
  );
}
