import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal, EASE } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill } from '../components/play';
import { Die, FACES, ThinkingStamp } from '../components/Dice';
import type { FaceKey } from '../components/Dice';

const TP_URL = 'https://thinkingpartner.netlify.app/';

const MOVES: Record<MoveKey, { hindi: string; color: string; tint: string; questions: string[] }> = {
  OPEN: {
    hindi: 'खुलना', color: '#FFD167', tint: 'var(--tint-open)',
    questions: ['What if the opposite were true?', 'What are you treating as fixed that might not be?', 'Which option did you rule out in two seconds?'],
  },
  TRACE: {
    hindi: 'खोजना', color: '#E27238', tint: 'var(--tint-trace)',
    questions: ['Where did this idea come from?', 'Who decided this, and who gains from it?', 'If this happens, what happens next, and after that?'],
  },
  SHIFT: {
    hindi: 'बदलना', color: '#465BA4', tint: 'var(--tint-shift)',
    questions: ['What would this look like in a completely different world?', 'How would someone who disagrees with you see it?', 'How will this look twenty years from now?'],
  },
  SURFACE: {
    hindi: 'उभरना', color: '#4DB49F', tint: 'var(--tint-surface)',
    questions: ['What is everyone assuming but nobody is saying?', 'What do you actually know, and what are you guessing?', 'What is driving this underneath?'],
  },
  COMMIT: {
    hindi: 'प्रतिबद्ध', color: '#DA3832', tint: 'var(--tint-commit)',
    questions: ['What will you actually do with this?', 'If you had to decide today, what would you choose?', 'What will your choice cost you?'],
  },
};
const MOVE_KEYS = Object.keys(MOVES) as MoveKey[];

/* Everyday situations for young people in India */
const SITUATIONS = [
  'Choosing a stream after Class 10',
  'Your parents want you to become an engineer',
  'Everyone in class is joining the same coaching centre',
  'A forward on the family WhatsApp group',
  'Deciding whether to take a gap year',
  'Picking a college far from home',
  'A friend asks to copy your assignment',
  'Whether to speak up when a teacher is wrong',
  'Feeling behind after scrolling social media',
  'Choosing between a hobby and extra tuition',
  'Spending your first salary',
  'Your group wants to skip the hard part of a project',
  'Marks decide which friends you sit with',
  'A relative says your career choice is "not stable"',
  'Picking a side in a group chat argument',
  'Deciding what to do this summer',
];

const pick = <T,>(arr: T[], not?: T) => {
  const pool = arr.length > 1 && not !== undefined ? arr.filter((x) => x !== not) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
};

type Result = { face: FaceKey; move: MoveKey | null; question: string };

function readRolled(): MoveKey[] {
  try { return JSON.parse(sessionStorage.getItem('tk-dice-rolled') || '[]'); } catch { return []; }
}

export function DicePage() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const lift = useMotionValue(0);
  const shadowScale = useTransform(lift, [-150, 0], [0.45, 1]);
  const shadowOpacity = useTransform(lift, [-150, 0], [0.12, 0.32]);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [rollId, setRollId] = useState(0);
  const [situation, setSituation] = useState(() => pick(SITUATIONS));
  const [own, setOwn] = useState('');
  const [rolled, setRolled] = useState<MoveKey[]>(readRolled);
  const drag = useRef<{ x: number; y: number; rx: number; ry: number; moved: number } | null>(null);
  const reduced = useRef(false);

  useEffect(() => { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  useEffect(() => { try { sessionStorage.setItem('tk-dice-rolled', JSON.stringify(rolled)); } catch { /* storage unavailable */ } }, [rolled]);

  const settle = useCallback((face: FaceKey) => {
    const move = face === 'WILD' ? null : face;
    setResult({ face, move, question: move ? pick(MOVES[move].questions) : '' });
    setRollId((n) => n + 1);
    if (move) setRolled((r) => (r.includes(move) ? r : [...r, move]));
  }, []);

  const roll = useCallback((push = 1) => {
    if (rolling) return;
    const face = FACES[Math.floor(Math.random() * FACES.length)];
    if (reduced.current) {
      rx.set(face.show[0]); ry.set(face.show[1]);
      settle(face.key);
      return;
    }
    setRolling(true);
    setSituation((s) => pick(SITUATIONS, s));
    const spinsX = 2 + Math.floor(Math.random() * 2) + Math.round(push);
    const spinsY = 2 + Math.floor(Math.random() * 2) + Math.round(push);
    const baseX = Math.ceil(rx.get() / 360) * 360;
    const baseY = Math.ceil(ry.get() / 360) * 360;
    const toX = baseX + spinsX * 360 + face.show[0];
    const toY = baseY + spinsY * 360 + face.show[1];
    const duration = 1.5;
    animate(lift, [0, -150, 0, -34, 0, -8, 0], { duration, times: [0, 0.3, 0.6, 0.72, 0.84, 0.92, 1], ease: 'easeInOut' });
    animate(rx, toX, { duration, ease: [0.15, 0.7, 0.25, 1] });
    animate(ry, toY, { duration, ease: [0.15, 0.7, 0.25, 1] }).then(() => {
      setRolling(false);
      settle(face.key);
    });
  }, [rolling, rx, ry, lift, settle]);

  /* Space or Enter rolls */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, button, a')) return;
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); roll(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [roll]);

  /* Grab and flick: drag turns the dice, letting go throws it */
  const onPointerDown = (e: React.PointerEvent) => {
    if (rolling) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, rx: rx.get(), ry: ry.get(), moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    d.moved = Math.max(d.moved, Math.hypot(dx, dy));
    ry.set(d.ry + dx * 0.6);
    rx.set(d.rx - dy * 0.6);
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    roll(d.moved > 40 ? Math.min(2, d.moved / 120) : 0);
  };

  const pickMove = (m: MoveKey) => {
    setResult({ face: 'WILD', move: m, question: pick(MOVES[m].questions) });
    setRollId((n) => n + 1);
    setRolled((r) => (r.includes(m) ? r : [...r, m]));
  };

  const move = result?.move ? MOVES[result.move] : null;
  const applyTo = own.trim() || situation;
  const allFive = rolled.length === 5;

  return (
    <div className="page">
      {/* ── Play ────────────────────────────────────────────── */}
      <header className="tk-head dice-head">
        <div className="tk-wrap">
          <div className="dice-play">
            {/* Title and the dice */}
            <div className="dice-left">
          <Reveal>
              <div className="tag-row">
                <Tag bg="#465BA4" tilt={-3}>Thinking Dice</Tag>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                Stuck? Roll<br />
                for a <span className="nowrap">move<Buddy color="#FFD167" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>

            <div className="dice-stage">
              <motion.div
                className="dice-grab"
                style={{ y: lift }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={() => { drag.current = null; }}
                role="button"
                tabIndex={0}
                aria-label="Roll the dice"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); roll(); } }}
              >
                <Die rx={rx} ry={ry} />
              </motion.div>
              <motion.div className="dice-shadow" style={{ scale: shadowScale, opacity: shadowOpacity }} aria-hidden="true" />
              <p className="dice-hint">Tap it, flick it, or press Space</p>
              <button type="button" className="pill pill--ink dice-roll" onClick={() => roll()} disabled={rolling}>
                <span>{rolling ? 'Rolling…' : result ? 'Roll again' : 'Roll the dice'}</span>
                <span className="pill__arrow" aria-hidden="true">↻</span>
              </button>
            </div>
            </div>

            {/* The result */}
            <div className="dice-result" aria-live="polite">
              <AnimatePresence mode="wait">
                {!result && (
                  <motion.div key="empty" className="dice-card dice-card--empty"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
                    <span className="mini-head">How it works</span>
                    <p className="dice-card__big">Roll the dice. It lands on one of the five moves. Use that move on a real situation.</p>
                    <p className="dice-card__small">The sixth face says “Thinking in progress”: you choose the move.</p>
                  </motion.div>
                )}

                {result && result.face === 'WILD' && !result.move && (
                  <motion.div key={`wild-${rollId}`} className="dice-card"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
                    <span className="mini-head">Thinking in progress</span>
                    <p className="dice-card__big">Pause. Which move do you need right now? You choose.</p>
                    <div className="dice-pick">
                      {MOVE_KEYS.map((m) => (
                        <button key={m} type="button" className="dice-pick__btn" style={{ backgroundColor: MOVES[m].color }} onClick={() => pickMove(m)}>
                          <MoveIcon move={m} size={22} variant="white" /> {m}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {result && move && result.move && (
                  <motion.div key={`move-${rollId}`} className="dice-card" style={{ backgroundColor: move.tint }}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
                    <div className="dice-card__move" style={{ backgroundColor: move.color }}>
                      <MoveIcon move={result.move} size={26} variant="white" />
                      <strong>{result.move}</strong>
                      <span className="deva" lang="hi">{move.hindi}</span>
                    </div>
                    <p className="dice-card__q">{result.question}</p>
                    <div className="dice-card__apply">
                      <span className="mini-head">Try it on</span>
                      <p className="dice-card__situation">{applyTo}</p>
                      <div className="dice-card__row">
                        {!own.trim() && (
                          <button type="button" className="link-btn" onClick={() => setSituation((s) => pick(SITUATIONS, s))}>Another situation ↻</button>
                        )}
                      </div>
                      <label className="dice-own">
                        <span className="sr-only">Or use your own situation</span>
                        <input value={own} onChange={(e) => setOwn(e.target.value)} placeholder="Or type your own situation…" maxLength={120} />
                      </label>
                    </div>
                    <div className="dice-card__actions">
                      <Pill to={`/toolkit?move=${result.move.toLowerCase()}`} variant="ink">{result.move} tools</Pill>
                      <Pill href={TP_URL} variant="ghost">Think it through</Pill>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collection */}
              <div className="dice-collect">
                <div className="dice-collect__row" aria-label={`${rolled.length} of 5 moves rolled`}>
                  {MOVE_KEYS.map((m) => (
                    <motion.i key={m}
                      animate={{ scale: rolled.includes(m) ? 1 : 0.85 }}
                      style={{ backgroundColor: rolled.includes(m) ? MOVES[m].color : 'transparent', borderColor: MOVES[m].color }}
                      title={m} />
                  ))}
                </div>
                <span>{allFive ? 'All five moves rolled. That’s the whole framework.' : `${rolled.length} of 5 moves rolled`}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── The faces ───────────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">Six faces</h2></Reveal>
            <Reveal delay={0.05} className="section-head__aside">
              <p>Modelled on the physical TARK dice used in sessions. Five faces, five moves. The sixth, “Thinking in progress”, hands the choice to you.</p>
            </Reveal>
          </div>
          <div className="six">
            {MOVE_KEYS.map((m, i) => (
              <Reveal key={m} delay={i * 0.04} style={{ height: '100%' }}>
                <div className="face-card" style={{ backgroundColor: MOVES[m].color }}>
                  <MoveIcon move={m} size={40} variant="white" />
                  <strong>{m} <span className="deva" lang="hi">{MOVES[m].hindi}</span></strong>
                  <p>“{MOVES[m].questions[0]}”</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.2} style={{ height: '100%' }}>
              <div className="face-card face-card--wild">
                <ThinkingStamp className="stamp--flat" />
                <strong>Thinking in progress</strong>
                <p>“Which move do you need right now?”</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-shift)' }}>
        <Squiggle kind="spiral" width={90} color="#465BA4" className="home-close__sq1" />
        <Squiggle kind="zigzag" width={130} color="#E27238" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">Rolled something that stuck?</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>Go deeper<br />with a tool.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <Pill to="/toolkit" variant="ink">Browse the toolkit</Pill>
              <Pill to="/framework" variant="ghost">Learn the five moves</Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
