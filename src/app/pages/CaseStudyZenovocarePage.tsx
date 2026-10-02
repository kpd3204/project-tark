import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal, EASE } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import zcRoom from '../../imports/photos/real/zc-session-room.jpg';
import zcTable from '../../imports/photos/real/zc-session-table.jpg';
import zcLap from '../../imports/photos/real/zc-writing-lap.jpg';
import zcDesk from '../../imports/photos/real/zc-writing-desk.jpg';

const SESSION = [
  { src: zcRoom,  alt: 'The ZenovoCare team gathered around the table at Studio Carbon', caption: 'The kickoff', area: 'a' },
  { src: zcTable, alt: 'Working through the moves together around the studio table', caption: 'Working the moves together', area: 'b' },
  { src: zcLap,   alt: 'A participant filling in a TARK worksheet on their lap', caption: 'Worksheets in use', area: 'c' },
  { src: zcDesk,  alt: 'A participant writing on TARK worksheets at a desk', caption: 'One move at a time', area: 'd' },
];

const MOVES_META: { key: MoveKey; color: string; tint: string; ink: string; hindi: string }[] = [
  { key: 'OPEN',    color: '#FFD167', tint: 'var(--tint-open)',    ink: '#1D1B16', hindi: 'खुलना' },
  { key: 'TRACE',   color: '#E27238', tint: 'var(--tint-trace)',   ink: '#FFFFFF', hindi: 'खोजना' },
  { key: 'SHIFT',   color: '#465BA4', tint: 'var(--tint-shift)',   ink: '#FFFFFF', hindi: 'बदलना' },
  { key: 'SURFACE', color: '#4DB49F', tint: 'var(--tint-surface)', ink: '#FFFFFF', hindi: 'उभरना' },
  { key: 'COMMIT',  color: '#DA3832', tint: 'var(--tint-commit)',  ink: '#FFFFFF', hindi: 'प्रतिबद्ध' },
];

const zenovocare = {
  number: '01',
  year: '2026',
  client: 'ZenovoCare',
  context: 'Brand Strategy Kickoff',
  studio: 'Studio Carbon',
  domain: 'MedTech · Physiotherapy devices',
  location: 'Gandhinagar, India',
  tagline: 'Thinking clearly before positioning carelessly.',
  description: "ZenovoCare came to Studio Carbon with a product, a market, and a set of assumptions they hadn't yet examined. Before any positioning work could begin, the team needed to think more clearly about who they were for, what they were promising, and why anyone should trust them. The TARK framework was used to structure that thinking, rigorously, before any creative work began.",
  overallScore: '6',
  scoreVerdict: 'Good foundation, but lacks conviction.',
  whatWorked: [
    'Trust is peer-driven: correctly identified as the primary sales mechanism.',
    'The demo is the critical moment: the highest-leverage touchpoint in the purchase journey.',
    'Clinical credibility over affordability: the right hierarchy, even if underdeveloped.',
    'A clear effort to think systematically, not surface-level fill.',
  ],
  whatWasWeak: [
    'Too many safe answers: generic phrases like "easy", "affordable" and "effective" that any competitor could claim.',
    'Inconsistency across sheets: audience, positioning and strategy kept shifting.',
    'Low decision sharpness: avoiding trade-offs rather than making them.',
    'Linear journey mapping: clean and ideal, missing the doubt, friction and real behaviour of actual buyers.',
  ],
  moveAssessments: [
    {
      move: 'OPEN',
      label: 'Persona and audience work',
      what_worked: 'Correct instinct: home patients ranked first, aligning with the D2C shift. Different motivations identified: ease, validation, commission, usability.',
      what_was_weak: 'One-sentence realities were too generic. "Affordable device", "easy to use" and "clinical validation" are obvious, not insightful. No sharp tension or contradiction.',
      fix: 'Each persona needs a non-obvious truth. Private physio: "Wants something that looks clinical enough to justify pricing, but simple enough to not slow down patient flow." Push beyond functional needs to include ego, risk, money and time pressure.',
    },
    {
      move: 'TRACE',
      label: 'Trust hierarchy and journey mapping',
      what_worked: 'Correct hierarchy identified: peer, then conference, then institution, then ads. Social proof correctly prioritised over marketing spend.',
      what_was_weak: 'Reasoning was thin and repetitive: describing behaviour, not diagnosing it. Journey mapping felt linear, a happy-path fantasy missing drop-offs, doubts and internal objections.',
      fix: 'Add mechanism clarity. Why does peer trust win? Risk transfer and reputation borrowing. Why do institutions matter less? Bureaucracy is not credibility. Add friction to the journey: "Looks good, but will patients trust it?" "Works, but is it worth switching?"',
    },
    {
      move: 'SHIFT',
      label: 'Positioning and perception',
      what_worked: 'Correctly rejected affordability as the primary position. Leaned toward clinical credibility plus community, the right direction.',
      what_was_weak: 'Still hedging: "clinical credibility + community" is safe, not sharp. No clear trade-off made.',
      fix: 'Pick a hierarchy. Lead with clinical credibility, support with community. Define the link: "We are credible BECAUSE real physios use and validate it."',
    },
    {
      move: 'SURFACE',
      label: 'Language and perception audit',
      what_worked: 'Good instinct: words like "smart" and "intuitive" land better than "affordable". Thinking from user perception, not brand intention.',
      what_was_weak: 'Responses were inconsistent: one sheet said "advanced = confusing", another said "advanced = yes". No locked language system.',
      fix: 'Lock a language system. Avoid: "cheap", "complex", "technical". Use: "effortless", "trusted", "proven", "used by physios".',
    },
    {
      move: 'COMMIT',
      label: 'Strategic direction and promise',
      what_worked: 'Both B2B and B2C routes explored. Aiming at differentiation: pain relief, wireless, and so on.',
      what_was_weak: 'Indecisive across sheets. Features named as promises, but features are not defensible. Anyone can claim them.',
      fix: 'Pick one direction. If D2C, optimise for simplicity, trust and the demo. If B2B, optimise for validation and endorsements. A real promise must be specific, hard to copy, and tied to trust. Direction: "The only device physios trust enough to use on themselves."',
    },
  ],
  whatToDoNext: [
    'Rewrite all personas with one uncomfortable truth each.',
    'Define ONE primary audience, not four.',
    'Lock one positioning, one audience, one trust mechanism.',
    'Redo the customer journey with friction and doubt included.',
    'Turn the demo moment into a clear competitive advantage.',
  ],
};

/* ── One move, as an expandable card ─────────────────────────── */
function MovePanel({ a, m, open, onToggle }: {
  a: typeof zenovocare.moveAssessments[0]; m: typeof MOVES_META[0]; open: boolean; onToggle: () => void;
}) {
  const id = `move-${m.key.toLowerCase()}`;
  return (
    <div className={`mpanel ${open ? 'is-open' : ''}`} style={{ ['--c' as string]: m.color, ['--t' as string]: m.tint, ['--i' as string]: m.ink }}>
      <button type="button" className="mpanel__btn" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span className="mpanel__icon"><MoveIcon move={m.key} size={30} variant="color" /></span>
        <span className="mpanel__text">
          <strong>{m.key} <span className="deva" lang="hi">{m.hindi}</span></strong>
          <span>{a.label}</span>
        </span>
        <span className="mpanel__plus" aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="mpanel__body">
              <div className="mpanel__card">
                <h4 className="mini-head" style={{ color: '#2E8A77' }}>What worked</h4>
                <p>{a.what_worked}</p>
              </div>
              <div className="mpanel__card">
                <h4 className="mini-head" style={{ color: '#DA3832' }}>What needed work</h4>
                <p>{a.what_was_weak}</p>
              </div>
              <div className="mpanel__card mpanel__card--dir">
                <h4 className="mini-head">Direction</h4>
                <p>{a.fix}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CaseStudyZenovocarePage() {
  const [openPanel, setOpenPanel] = useState<string | null>('OPEN');

  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap">
          <Reveal>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/case-studies">Case studies</Link>
              <span aria-hidden="true">→</span>
              <span>{zenovocare.client}</span>
            </nav>
          </Reveal>
          <div className="tk-head__grid">
            <div>
              <Reveal><Tag bg="#DA3832" tilt={-3}>Case study {zenovocare.number}</Tag></Reveal>
              <Reveal delay={0.05}>
                <h1 className="display-xl tk-head__title">{zenovocare.client}</h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="lede" style={{ maxWidth: '30ch' }}>{zenovocare.context}. {zenovocare.tagline}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <dl className="facts">
                  {[
                    ['Domain', zenovocare.domain],
                    ['Year', zenovocare.year],
                    ['Studio', zenovocare.studio],
                    ['Location', zenovocare.location],
                  ].map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </Reveal>
            </div>
            <Reveal delay={0.1} y={40}>
              <div className="score">
                <Buddy color="#FFD167" size={60} className="score__buddy" delay={0.4} />
                <span className="mini-head">Overall assessment</span>
                <strong className="score__num">{zenovocare.overallScore}<span>/10</span></strong>
                <p className="score__verdict">{zenovocare.scoreVerdict}</p>
                <div className="score__moves" aria-label="Moves used">
                  {MOVES_META.map((m) => <MoveIcon key={m.key} move={m.key} size={26} variant="color" />)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ── The session ─────────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap narrow">
          <Reveal><h2 className="display-lg">The session</h2></Reveal>
          <Reveal delay={0.05}><p className="body-lg">{zenovocare.description}</p></Reveal>
          <Reveal delay={0.1}>
            <div className="duo">
              <div className="note" style={{ backgroundColor: 'var(--tint-open)' }}>
                <span className="mini-head">Framework applied</span>
                <p className="note__title" style={{ margin: 0 }}>TARK, the five moves</p>
              </div>
              <div className="note" style={{ backgroundColor: 'var(--tint-shift)' }}>
                <span className="mini-head">Facilitated by</span>
                <p className="note__title" style={{ margin: 0 }}>Studio Carbon</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Session photos ──────────────────────────────────── */}
      <section className="sec sec--tight">
        <div className="tk-wrap">
          <div className="process">
            {SESSION.map((p, i) => (
              <Reveal key={p.caption} delay={i * 0.06} y={32} className={`process__item process__item--${p.area}`}>
                <figure>
                  <SoftImg src={p.src} alt={p.alt} />
                  <figcaption><i aria-hidden="true" />{p.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Assessment ──────────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap">
          <Reveal><h2 className="display-lg" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>What we found</h2></Reveal>
          <div className="duo">
            <Reveal style={{ height: '100%' }}>
              <div className="verdict" style={{ ['--c' as string]: '#4DB49F', backgroundColor: 'var(--tint-surface)' }}>
                <h3 className="verdict__title">What worked</h3>
                <ul className="dlist">{zenovocare.whatWorked.map((t) => <li key={t}><i aria-hidden="true" />{t}</li>)}</ul>
              </div>
            </Reveal>
            <Reveal delay={0.06} style={{ height: '100%' }}>
              <div className="verdict" style={{ ['--c' as string]: '#DA3832', backgroundColor: 'var(--tint-commit)' }}>
                <h3 className="verdict__title">What needed work</h3>
                <ul className="dlist">{zenovocare.whatWasWeak.map((t) => <li key={t}><i aria-hidden="true" />{t}</li>)}</ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Move by move ────────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap narrow">
          <Reveal><h2 className="display-lg" style={{ marginBottom: 'clamp(28px, 4vw, 48px)' }}>Move by move</h2></Reveal>
          <div className="mpanels">
            {zenovocare.moveAssessments.map((a, i) => (
              <MovePanel
                key={a.move}
                a={a}
                m={MOVES_META[i]}
                open={openPanel === a.move}
                onToggle={() => setOpenPanel(openPanel === a.move ? null : a.move)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── What comes next ─────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap narrow">
          <Reveal><h2 className="display-lg" style={{ marginBottom: 'clamp(28px, 4vw, 48px)' }}>What comes next</h2></Reveal>
          <ol className="nextlist">
            {zenovocare.whatToDoNext.map((t, i) => (
              <Reveal key={t} delay={i * 0.05}>
                <li style={{ ['--c' as string]: MOVES_META[i].color }}>
                  <span className="ev__num" style={{ color: MOVES_META[i].ink }}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{t}</span>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.1}>
            <blockquote className="pullquote">
              <Squiggle kind="underline" width="100%" color="#FFD167" stroke={6} className="pullquote__line" />
              <p>“The work is not bad. The work is not finished.”</p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-open)' }}>
        <Squiggle kind="loop" width={150} color="#E27238" className="home-close__sq1" />
        <Squiggle kind="zigzag" width={120} color="#465BA4" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">TARK helped ZenovoCare think before they positioned</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>Your turn.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <Pill to="/framework" variant="ink">Try the framework</Pill>
              <Pill to="/thinking-partner" variant="ghost">Start a thinking session</Pill>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="home-close__meta"><Link to="/case-studies" className="backlink">← Back to case studies</Link></p>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
