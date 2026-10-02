import { useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { toolsData } from '../data/tools';
import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal, EASE } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoDomino from '../../imports/photos/about/thinking-toolkit-cards.jpg';
import photoWorksheet from '../../imports/photos/real/ws-feelings-circle.jpg';

type MoveData = typeof toolsData[0];
type Tool = MoveData['tools'][0];

const FALLBACK_URL = 'https://drive.google.com/drive/folders/1ivpEmL7nj3No2GXXrpZAo_Qk70TGEpxL';
const AUDIENCES = ['Solo', 'Small Group', 'Large Group'];

const TINT: Record<string, string> = {
  OPEN: 'var(--tint-open)', TRACE: 'var(--tint-trace)', SHIFT: 'var(--tint-shift)',
  SURFACE: 'var(--tint-surface)', COMMIT: 'var(--tint-commit)',
};
const INK: Record<string, string> = { OPEN: '#1D1B16' };

/* Plain-language ways in: what the stuck feels like, mapped to a move */
const STUCK: { move: string; feels: string }[] = [
  { move: 'OPEN',    feels: 'I keep landing on the same answer' },
  { move: 'TRACE',   feels: 'I want to see where this leads' },
  { move: 'SHIFT',   feels: "I can't see the other side" },
  { move: 'SURFACE', feels: "I'm not sure what I really think" },
  { move: 'COMMIT',  feels: 'I need to decide' },
];

const TOTAL = toolsData.reduce((n, m) => n + m.tools.length, 0);

/* ── Card ───────────────────────────────────────────────────── */
function ToolCard({ tool, move, index }: { tool: Tool; move: MoveData; index: number }) {
  const href = `/toolkit/${move.key.toLowerCase()}/${tool.slug}`;
  return (
    <article className="tcard" style={{ ['--c' as string]: move.color, ['--t' as string]: TINT[move.key] }} data-move={move.key}>
      <div className="tcard__top">
        <span className="tcard__move"><i aria-hidden="true" />{move.key} · {String(index + 1).padStart(2, '0')}</span>
        <span className="tcard__icon" aria-hidden="true"><MoveIcon move={move.key as MoveKey} size={28} variant="color" /></span>
      </div>
      <h3 className="tcard__name">
        <Link to={href} className="tcard__link">{tool.name.replace(/-/g, '\u2011')}</Link>
      </h3>
      <p className="tcard__tag">{tool.tagline}</p>
      <div className="tcard__chips">
        {tool.audience.map((a) => <span key={a} className="mini-chip">{a}</span>)}
      </div>
      <div className="tcard__actions">
        <span className="tcard__open">Open tool <span aria-hidden="true">→</span></span>
        <a className="tcard__pdf" href={tool.driveUrl || FALLBACK_URL} target="_blank" rel="noopener noreferrer">PDF ↓</a>
      </div>
    </article>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export function ToolkitPage() {
  const [params, setParams] = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  const moveParam = (params.get('move') || '').toUpperCase();
  const move = toolsData.some((m) => m.key === moveParam) ? moveParam : 'ALL';
  const q = params.get('q') || '';
  const who = params.get('who') || '';

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };
  const reset = () => setParams({}, { replace: true });

  const filtering = move !== 'ALL' || !!q || !!who;
  const needle = q.trim().toLowerCase();

  const results = useMemo(() => {
    const out: { tool: Tool; move: MoveData; index: number }[] = [];
    toolsData.forEach((m) => m.tools.forEach((t, i) => {
      if (move !== 'ALL' && m.key !== move) return;
      if (who && !t.audience.includes(who)) return;
      if (needle && ![t.name, t.tagline, t.plainDescription, t.description].join(' ').toLowerCase().includes(needle)) return;
      out.push({ tool: t, move: m, index: i });
    }));
    return out;
  }, [move, who, needle]);

  const pickStuck = (key: string) => {
    const next = new URLSearchParams();
    next.set('move', key.toLowerCase());
    setParams(next, { replace: true });
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="toolkit">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal><Tag bg="#4DB49F" tilt={-3}>Toolkit</Tag></Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                Pick a tool.<br />
                Start <span className="nowrap">anywhere<Buddy color="#FFD167" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">Every tool is a one-page structure for a specific kind of stuck. Printable, free, and each one works with the AI Thinking Partner.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="toolkit-counters">
                <div><strong>{TOTAL}</strong><span>tools</span></div>
                <div><strong>5</strong><span>moves</span></div>
                <div><strong>1</strong><span>page each</span></div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoDomino} alt="The Project TARK Thinking Toolkit: a ring of printed tool cards fanned out" loading="eager" />
            <Buddy color="#E27238" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="spiral" width={84} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── What kind of stuck? ─────────────────────────────── */}
      <section className="stuck">
        <div className="tk-wrap">
          <Reveal><h2 className="display-lg">What kind of stuck are you?</h2></Reveal>
          <div className="stuck__grid">
            {STUCK.map((s, i) => {
              const m = toolsData.find((d) => d.key === s.move)!;
              return (
                <Reveal key={s.move} delay={i * 0.05} y={24}>
                  <button type="button" className="stuck__btn" style={{ backgroundColor: m.color, color: INK[s.move] || '#FFFFFF' }} onClick={() => pickStuck(s.move)}>
                    <span className="stuck__feels">“{s.feels}”</span>
                    <span className="stuck__move">
                      Try <strong>{s.move}</strong> · {m.tools.length} tools <span aria-hidden="true">→</span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Filters + archive: the bar sticks only while the list is in view ── */}
      <div className="archive-wrap">
      <div className="filters" ref={resultsRef}>
        <div className="tk-wrap filters__inner">
          <label className="search">
            <span className="sr-only">Search tools</span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M15.5 15.5 20 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            <input type="search" placeholder="Search tools…" value={q} onChange={(e) => set('q', e.target.value)} />
          </label>
          <div className="chip-scroll" role="group" aria-label="Filter by move">
            <button type="button" className={`chip ${move === 'ALL' ? 'is-on is-ink' : ''}`} onClick={() => set('move', '')}>All · {TOTAL}</button>
            {toolsData.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`chip ${move === m.key ? 'is-on' : ''}`}
                style={move === m.key ? { backgroundColor: m.color, borderColor: m.color, color: INK[m.key] || '#FFFFFF' } : undefined}
                onClick={() => set('move', move === m.key ? '' : m.key.toLowerCase())}
              >
                <span className="chip__dot" style={{ backgroundColor: m.color }} />{m.key}
              </button>
            ))}
            <span className="chip-sep" aria-hidden="true" />
            {AUDIENCES.map((a) => (
              <button key={a} type="button" className={`chip ${who === a ? 'is-on is-ink' : ''}`} onClick={() => set('who', who === a ? '' : a)}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Archive ─────────────────────────────────────────── */}
      <section className="archive">
        <div className="tk-wrap">
          {!filtering ? (
            toolsData.map((m) => (
              <div key={m.key} className="archive__group" id={m.key.toLowerCase()}>
                <Reveal y={20}>
                  <div className="group-head" style={{ ['--c' as string]: m.color, ['--t' as string]: TINT[m.key] }}>
                    <span className="group-head__icon"><MoveIcon move={m.key as MoveKey} size={34} variant={INK[m.key] ? 'black' : 'white'} /></span>
                    <span className="group-head__name">{m.key}</span>
                    <span className="group-head__hindi deva" lang="hi">{m.hindi}</span>
                    <span className="group-head__tag">{m.tagline}</span>
                    <span className="group-head__count">{m.tools.length} tools</span>
                  </div>
                </Reveal>
                <div className="tgrid tgrid--five">
                  {m.tools.map((t, i) => (
                    <Reveal key={t.slug} delay={(i % 5) * 0.05} y={24} style={{ height: '100%' }}>
                      <ToolCard tool={t} move={m} index={i} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="results-bar">
                <span><strong>{results.length}</strong> {results.length === 1 ? 'tool' : 'tools'}{move !== 'ALL' && <> in <strong>{move}</strong></>}{who && <> for <strong>{who.toLowerCase()}</strong></>}{q && <> matching “{q}”</>}</span>
                <button type="button" className="link-btn" onClick={reset}>Clear filters</button>
              </div>
              <AnimatePresence mode="popLayout">
                {results.length > 0 ? (
                  <motion.div key={`${move}-${who}-${needle}`} className={`tgrid ${results.length === 5 ? 'tgrid--five' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                    {results.map((r) => <ToolCard key={r.tool.slug} tool={r.tool} move={r.move} index={r.index} />)}
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Buddy color="#465BA4" size={72} />
                    <h3>No tool matches that yet.</h3>
                    <p>Try fewer filters, or a different word.</p>
                    <button type="button" className="pill pill--ink" onClick={reset}><span>Show all tools</span><span className="pill__arrow" aria-hidden="true">→</span></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </section>
      </div>

      {/* ── How a tool works ────────────────────────────────── */}
      <section className="howto">
        <div className="tk-wrap howto__grid">
          <Reveal y={40} className="howto__photo">
            <SoftImg src={photoWorksheet} alt="A printed TARK worksheet with its how-to-use notes and prompts" />
          </Reveal>
          <div>
            <Reveal><h2 className="display-lg">How a tool works</h2></Reveal>
            <ol className="steps">
              {[
                { t: 'Pick the stuck', d: 'Choose a tool by what the problem feels like, or by move.', c: '#FFD167' },
                { t: 'Print it or open it', d: 'Every tool is one page. Fill it in alone, or around a table.', c: '#E27238' },
                { t: 'Think it through with a partner', d: 'Scan the QR code to open the AI Thinking Partner, already set up for that tool.', c: '#465BA4' },
              ].map((s, i) => (
                <Reveal key={s.t} delay={i * 0.07}>
                  <li>
                    <Buddy color={s.c} size={44} delay={0.08 * i} />
                    <div><h3>{s.t}</h3><p>{s.d}</p></div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.2}>
              <div className="howto__actions">
                <Pill to="/thinking-partner" variant="ink">Open the Thinking Partner</Pill>
                <Pill href={FALLBACK_URL} variant="ghost">All PDFs</Pill>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
