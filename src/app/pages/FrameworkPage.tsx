import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoBooklets from '../../imports/photos/real/five-moves-booklet-grass.jpg';
import wsOpen from '../../imports/photos/real/ws-reframe-machine.jpg';
import wsTrace from '../../imports/photos/real/ws-slow-burn.jpg';
import wsShift from '../../imports/photos/real/ws-walk-a-mile.jpg';
import wsSurface from '../../imports/photos/real/ws-assumptions.jpg';
import wsCommit from '../../imports/photos/real/ws-pressure-gauge.jpg';

/* A real worksheet for each move */
const SHEET: Record<string, { src: string; alt: string; caption: string }> = {
  OPEN:    { src: wsOpen,    alt: 'The Reframe Machine worksheet: see your problem through five different eyes', caption: 'The Reframe Machine' },
  TRACE:   { src: wsTrace,   alt: 'The Slow Burn worksheet: rings for what changes this week, this month and this year', caption: 'The Slow Burn' },
  SHIFT:   { src: wsShift,   alt: 'The Walk a Mile worksheet: I am walking as…', caption: 'Walk a Mile' },
  SURFACE: { src: wsSurface, alt: 'The Assumption Spotter worksheet with a magnifying glass and “I’m assuming that…” notes', caption: 'The Assumption Spotter' },
  COMMIT:  { src: wsCommit,  alt: 'The Put It Under Pressure worksheet: a gauge up to evidence, and my position after pressure', caption: 'Put It Under Pressure' },
};

const moves: {
  hindi: string;
  english: MoveKey;
  color: string;
  tint: string;
  ink: string;
  number: string;
  tagline: string;
  question: string;
  questionHi: string;
  whatItIs: string;
  inPlainLanguage: string;
  whenToUse: string[];
}[] = [
  {
    hindi: 'खुलना',
    english: 'OPEN',
    color: '#FFD167', tint: 'var(--tint-open)', ink: '#1D1B16',
    number: '01',
    tagline: 'Challenge the given',
    question: 'What if the opposite were true?',
    questionHi: 'अगर इसका उलटा सच हो तो?',
    whatItIs: 'Stop. Before you react, question.',
    inPlainLanguage:
      "Most of the time, we see a situation and immediately know what we think. OPEN is the move that says: wait, what if you're wrong? What if there's something you're assuming without realising? It doesn't mean you are wrong. It means you might be.",
    whenToUse: [
      'When a decision feels obvious.',
      'When someone says "that\'s just how it is."',
      'When your first answer comes too quickly.',
    ],
  },
  {
    hindi: 'खोजना',
    english: 'TRACE',
    color: '#E27238', tint: 'var(--tint-trace)', ink: '#FFFFFF',
    number: '02',
    tagline: 'Map the system',
    question: 'Where did this idea come from?',
    questionHi: 'यह विचार कहाँ से आया?',
    whatItIs: 'Find out where it came from.',
    inPlainLanguage:
      'Every belief, every rule, every norm has a history. Someone decided it. Someone benefited from it. TRACE is the move that asks: who decided this, when, and why? Once you know the origin of an idea, you can decide whether you actually agree with it, or whether you just inherited it.',
    whenToUse: [
      'When something feels "just true."',
      'When a rule exists but nobody explains why.',
      'When you want to understand a problem before trying to fix it.',
    ],
  },
  {
    hindi: 'बदलना',
    english: 'SHIFT',
    color: '#465BA4', tint: 'var(--tint-shift)', ink: '#FFFFFF',
    number: '03',
    tagline: 'Imagine alternatives',
    question: 'What would this look like in a completely different world?',
    questionHi: 'यह एक अलग दुनिया में कैसा दिखेगा?',
    whatItIs: 'What if the rules were different?',
    inPlainLanguage:
      'The way things are is not the only way they could be. SHIFT is the move that picks up the situation and puts it in a completely different world: different rules, different people, different time. What changes? What stays the same? What does that reveal about the situation you started with?',
    whenToUse: [
      "When you're stuck in one framing.",
      'When all your options feel the same.',
      'When you want to think bigger.',
    ],
  },
  {
    hindi: 'उभरना',
    english: 'SURFACE',
    color: '#4DB49F', tint: 'var(--tint-surface)', ink: '#FFFFFF',
    number: '04',
    tagline: 'See your thinking',
    question: 'What is everyone assuming but nobody is saying?',
    questionHi: 'यहाँ सब क्या मान रहे हैं, लेकिन कोई बोल नहीं रहा?',
    whatItIs: 'Name what nobody is saying.',
    inPlainLanguage:
      "Most conversations have an invisible layer: the things everyone assumes but nobody says out loud. SURFACE is the move that makes the invisible visible. What are the unspoken rules here? What are people assuming? What can't be said in this room? Naming it is the first step to changing it, or choosing it consciously.",
    whenToUse: [
      'In group discussions that feel stuck.',
      'When something feels "off" but you can\'t say what.',
      'When you want to understand your own thinking.',
    ],
  },
  {
    hindi: 'प्रतिबद्ध',
    english: 'COMMIT',
    color: '#DA3832', tint: 'var(--tint-commit)', ink: '#FFFFFF',
    number: '05',
    tagline: 'Act under uncertainty',
    question: 'What will I actually do with this thinking?',
    questionHi: 'मैं इस सोच के साथ असल में क्या करूँगा?',
    whatItIs: "Decide, even when you're not sure.",
    inPlainLanguage:
      "Certainty is a luxury. Most real decisions happen without enough information. COMMIT is the move that says: you've thought about this enough. Now take a position. Not because you're certain, but because thinking without deciding is just comfortable procrastination. A COMMIT position can change. But you have to actually make one first.",
    whenToUse: [
      "After a long thinking session that's going in circles.",
      'When you know what you think but are scared to say it.',
      'When action is required.',
    ],
  },
];

const NOTES = [
  { title: 'Not a sequence',     body: 'Use any move, in any order. One at a time, or all five. Come back to others when you need them.', color: '#E27238', tint: 'var(--tint-trace)' },
  { title: 'Pick what you need', body: "Use OPEN when you're stuck. Use COMMIT when you need to decide. It's a toolkit, not a ladder.",   color: '#465BA4', tint: 'var(--tint-shift)' },
  { title: 'Built for India',    body: 'Every example, every scenario, every question, grounded in Indian contexts and Indian lives.',    color: '#4DB49F', tint: 'var(--tint-surface)' },
];

/* ── One move as a chapter ───────────────────────────────────── */
function Chapter({ move }: { move: typeof moves[0] }) {
  return (
    <article id={move.english.toLowerCase()} className="chapter" style={{ ['--c' as string]: move.color, ['--t' as string]: move.tint }}>
      <div className="chapter__id-wrap">
        <Reveal y={24} className="chapter__id" style={{ backgroundColor: move.color, color: move.ink }}>
          <div className="chapter__top">
            <span className="chapter__num">Move {move.number}</span>
            <MoveIcon move={move.english} size={56} variant={move.ink === '#FFFFFF' ? 'white' : 'black'} />
          </div>
          <h2 className="chapter__name">{move.english}</h2>
          <div className="chapter__hindi deva" lang="hi">{move.hindi}</div>
          <div className="chapter__tagline">{move.tagline}</div>
        </Reveal>
        <Reveal y={24} delay={0.08} className="chapter__sheet">
          <figure>
            <SoftImg src={SHEET[move.english].src} alt={SHEET[move.english].alt} />
            <figcaption><i aria-hidden="true" />{SHEET[move.english].caption}</figcaption>
          </figure>
        </Reveal>
      </div>

      <div className="chapter__body">
        <Reveal><p className="chapter__lead">{move.whatItIs}</p></Reveal>
        <Reveal delay={0.05}><p className="chapter__text">{move.inPlainLanguage}</p></Reveal>

        <Reveal delay={0.08}>
          <h3 className="mini-head">When to use it</h3>
          <ul className="dlist">
            {move.whenToUse.map((w) => <li key={w}><i aria-hidden="true" />{w}</li>)}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <figure className="qcard">
            <figcaption className="mini-head">The question it asks</figcaption>
            <blockquote>
              <p className="qcard__en">{move.question}</p>
              <p className="qcard__hi deva" lang="hi">{move.questionHi}</p>
            </blockquote>
            <Buddy color={move.color} size={52} className="qcard__buddy" />
          </figure>
        </Reveal>

        <Reveal delay={0.12}>
          <Pill to={`/toolkit?move=${move.english.toLowerCase()}`} variant="ink">Try {move.english === 'OPEN' ? 'an' : 'a'} {move.english} tool</Pill>
        </Reveal>
      </div>
    </article>
  );
}

export function FrameworkPage() {
  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal><Tag bg="#FFD167" color="#1D1B16" tilt={-3}>Framework</Tag></Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                Five moves<br />
                for <span className="nowrap">thinking<Buddy color="#465BA4" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">Not rules, not steps. Five ways of looking at any situation differently. Use any move, in any order: one at a time, or all five.</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoBooklets} alt="The Five Moves, Unlimited Possibilities booklet lying on green leaves" loading="eager" />
            <Buddy color="#DA3832" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="loop" width={120} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>

        {/* Jump to a move */}
        <div className="tk-wrap">
          <Reveal delay={0.15}>
            <nav className="jump" aria-label="Jump to a move">
              {moves.map((m) => (
                <a key={m.english} href={`#${m.english.toLowerCase()}`} className="jump__item" style={{ backgroundColor: m.color, color: m.ink }}>
                  <MoveIcon move={m.english} size={26} variant={m.ink === '#FFFFFF' ? 'white' : 'black'} />
                  <span className="jump__name">{m.english}</span>
                  <span className="jump__hindi deva" lang="hi">{m.hindi}</span>
                  <span className="jump__go" aria-hidden="true">↓</span>
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </header>

      {/* ── Three notes ─────────────────────────────────────── */}
      <section className="sec sec--cream sec--tight">
        <div className="tk-wrap">
          <div className="trio">
            {NOTES.map((n, i) => (
              <Reveal key={n.title} delay={i * 0.06} style={{ height: '100%' }}>
                <div className="note" style={{ backgroundColor: n.tint }}>
                  <span className="note__mark" style={{ backgroundColor: n.color }} aria-hidden="true" />
                  <h2 className="note__title">{n.title}</h2>
                  <p className="note__body">{n.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Five chapters ───────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap">
          {moves.map((m) => <Chapter key={m.english} move={m} />)}
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-surface)' }}>
        <Squiggle kind="zigzag" width={150} color="#4DB49F" className="home-close__sq1" />
        <Squiggle kind="spiral" width={90} color="#465BA4" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">Put it to work</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>Five moves.<br />Twenty-five tools.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <Pill to="/toolkit" variant="ink">Open the toolkit</Pill>
              <Pill to="/thinking-partner" variant="ghost">Try the Thinking Partner</Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
