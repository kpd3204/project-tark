import { PageFooter } from '../components/PageFooter';
import { AssumptionTicker } from '../components/AssumptionTicker';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoLaptop from '../../imports/photos/thinking-partner-laptop.jpg';

const TP_URL      = 'https://thinkingpartner.netlify.app/';
const CHATGPT_URL = 'https://chatgpt.com/g/g-69e25c86db488191824d86bf3399227f-trk-thinking-partner';
const GEMINI_URL  = 'https://gemini.google.com/gem/1O2CGR8VO65PPOBuctSwskGO7RyGUsucZ?usp=sharing';

const MOVES: { key: MoveKey; hindi: string; color: string; ink: string; hint: string }[] = [
  { key: 'OPEN',    hindi: 'खुलना',      color: '#FFD167', ink: '#1D1B16', hint: 'What if the opposite were true?' },
  { key: 'TRACE',   hindi: 'खोजना',      color: '#E27238', ink: '#FFFFFF', hint: 'Where did this idea come from?' },
  { key: 'SHIFT',   hindi: 'बदलना',      color: '#465BA4', ink: '#FFFFFF', hint: 'What would this look like elsewhere?' },
  { key: 'SURFACE', hindi: 'उभरना',      color: '#4DB49F', ink: '#FFFFFF', hint: 'What is nobody saying out loud?' },
  { key: 'COMMIT',  hindi: 'प्रतिबद्ध', color: '#DA3832', ink: '#FFFFFF', hint: 'What will I actually do with this?' },
];

const WAYS = [
  { name: 'Thinking Partner', desc: 'The full guided interface, powered by Gemini 3.',           href: TP_URL,      color: '#FFD167', primary: true },
  { name: 'ChatGPT',          desc: 'The TARK GPT: the same five moves, inside ChatGPT.',         href: CHATGPT_URL, color: '#4DB49F' },
  { name: 'Gemini Gem',       desc: 'The TARK Gem: carry the framework into Google Gemini.',      href: GEMINI_URL,  color: '#465BA4' },
  { name: 'Claude Skill',     desc: 'The five moves as a skill for Claude.',                      href: null as string | null, color: '#E27238' },
];

const STEPS = [
  { t: 'Describe your situation',     d: 'Write about something you are genuinely unsure about. A decision, a conflict, a question without a clear answer. Real situations only.', c: '#FFD167' },
  { t: 'Work through the five moves', d: 'The partner takes you through OPEN, TRACE, SHIFT, SURFACE and COMMIT, one at a time, at your pace. It asks questions. It does not give answers.', c: '#465BA4' },
  { t: 'Build your thinking map',     d: 'By the end you have a clearer picture of the system, your assumptions, and what you are actually deciding.', c: '#DA3832' },
];

const DIFFERENT = [
  { line: 'It asks questions. It never tells you what to think.', color: '#FFD167' },
  { line: 'It applies one of five moves to your specific situation.', color: '#E27238' },
  { line: 'It slows you down on purpose. That is the point.', color: '#465BA4' },
  { line: 'Come back with the same situation and see new angles.', color: '#4DB49F' },
];

export function ThinkingPartnerPage() {
  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal><Tag bg="#465BA4" tilt={-3}>AI Thinking Partner</Tag></Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                What do you want to think <span className="nowrap">through?<Buddy color="#FFD167" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede" style={{ maxWidth: '40ch' }}>The Thinking Partner takes you through the five moves, applied to anything you are genuinely unsure about. Bring a real decision, not a hypothetical.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="head-actions">
                <Pill href={TP_URL} variant="ink">Open Thinking Partner</Pill>
              </div>
              <p className="fine">Free · Opens in a new tab · No sign-up needed</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoLaptop} alt="The TARK Thinking Partner open on a laptop" loading="eager" />
            <Buddy color="#DA3832" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="zigzag" width={110} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── Where to think ──────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <Reveal><h2 className="display-lg" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>Choose where to think</h2></Reveal>
          <div className="quad">
            {WAYS.map((w, i) => {
              const inner = (
                <>
                  <div className="way__top">
                    <Buddy color={w.color} size={48} delay={0.06 * i} />
                    {w.primary && <span className="way__badge">Recommended</span>}
                    {!w.href && <span className="soon">Soon</span>}
                  </div>
                  <strong className="way__name">{w.name}</strong>
                  <span className="way__desc">{w.desc}</span>
                  {w.href && <span className="way__go">Open <span aria-hidden="true">↗</span></span>}
                </>
              );
              return (
                <Reveal key={w.name} delay={i * 0.05} style={{ height: '100%' }}>
                  {w.href ? (
                    <a className={`way ${w.primary ? 'way--primary' : ''}`} href={w.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                  ) : (
                    <div className="way way--off" aria-disabled="true">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Five moves, applied ─────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">The five moves, applied to your situation</h2></Reveal>
            <Reveal delay={0.05} className="section-head__aside">
              <p>Each move comes with one question. The partner asks it about your situation, then keeps asking.</p>
            </Reveal>
          </div>
          <div className="five">
            {MOVES.map((m, i) => (
              <Reveal key={m.key} delay={i * 0.05} style={{ height: '100%' }}>
                <div className="moveq" style={{ backgroundColor: m.color, color: m.ink }}>
                  <MoveIcon move={m.key} size={36} variant={m.ink === '#FFFFFF' ? 'white' : 'black'} />
                  <div>
                    <strong className="moveq__name">{m.key} <span className="deva" lang="hi">{m.hindi}</span></strong>
                    <p className="moveq__q">“{m.hint}”</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap split">
          <Reveal>
            <h2 className="display-lg">A session takes<br /><span className="hl">20 to 40<span className="hl__mark" style={{ background: '#FFD167' }} aria-hidden="true" /></span> minutes.</h2>
          </Reveal>
          <ol className="steps" style={{ marginTop: 0 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.07}>
                <li>
                  <Buddy color={s.c} size={44} delay={0.08 * i} />
                  <div><h3>{s.t}</h3><p>{s.d}</p></div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What makes it different ─────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap">
          <Reveal><h2 className="display-lg">What makes it different</h2></Reveal>
          <ul className="why-list">
            {DIFFERENT.map((w, i) => (
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

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-shift)' }}>
        <Squiggle kind="loop" width={150} color="#465BA4" className="home-close__sq1" />
        <Squiggle kind="spiral" width={90} color="#DA3832" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">Ready to begin?</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>Bring a real<br />situation.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <Pill href={TP_URL} variant="ink">Open Thinking Partner</Pill>
              <Pill to="/toolkit" variant="ghost">Or start with a tool</Pill>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="disclaimer">
              This is an AI system and may produce inaccurate or incomplete reasoning. It is a thinking
              tool, not an answer. Always bring your own judgement to any conclusion. The TARK framework
              is the scaffold; your thinking is the material.
            </p>
          </Reveal>
        </div>
      </section>

      <AssumptionTicker />
      <PageFooter />
    </div>
  );
}
