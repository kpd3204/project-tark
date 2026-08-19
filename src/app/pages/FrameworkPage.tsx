import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { useIsMobile } from '../hooks/useIsMobile';
import { EASE, Reveal, LineReveal, SectionHead, Diamond, MOVE_TEXT } from '../components/kit';

const moves: {
  hindi: string;
  english: MoveKey;
  color: string;
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
    color: '#FFD167',
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
    hindi: 'पता लगाना',
    english: 'TRACE',
    color: '#E27238',
    number: '02',
    tagline: 'Map the system',
    question: 'Where did this idea come from?',
    questionHi: 'यह विचार कहाँ से आया?',
    whatItIs: 'Find out where it came from.',
    inPlainLanguage:
      'Every belief, every rule, every norm — has a history. Someone decided it. Someone benefited from it. TRACE is the move that asks: who decided this, when, and why? Once you know the origin of an idea, you can decide whether you actually agree with it, or whether you just inherited it.',
    whenToUse: [
      'When something feels "just true."',
      'When a rule exists but nobody explains why.',
      'When you want to understand a problem before trying to fix it.',
    ],
  },
  {
    hindi: 'बदलना',
    english: 'SHIFT',
    color: '#465BA4',
    number: '03',
    tagline: 'Imagine alternatives',
    question: 'What would this look like in a completely different world?',
    questionHi: 'यह एक अलग दुनिया में कैसा दिखेगा?',
    whatItIs: 'What if the rules were different?',
    inPlainLanguage:
      'The way things are is not the only way they could be. SHIFT is the move that picks up the situation and puts it in a completely different world — different rules, different people, different time. What changes? What stays the same? What does that reveal about the situation you started with?',
    whenToUse: [
      "When you're stuck in one framing.",
      'When all your options feel the same.',
      'When you want to think bigger.',
    ],
  },
  {
    hindi: 'उभारना',
    english: 'SURFACE',
    color: '#4DB49F',
    number: '04',
    tagline: 'See your thinking',
    question: 'What is everyone assuming but nobody is saying?',
    questionHi: 'यहाँ सब क्या मान रहे हैं, लेकिन कोई बोल नहीं रहा?',
    whatItIs: 'Name what nobody is saying.',
    inPlainLanguage:
      "Most conversations have an invisible layer, the things everyone assumes but nobody says out loud. SURFACE is the move that makes the invisible visible. What are the unspoken rules here? What are people assuming? What can't be said in this room? Naming it is the first step to changing it, or choosing it consciously.",
    whenToUse: [
      'In group discussions that feel stuck.',
      'When something feels "off" but you can\'t say what.',
      'When you want to understand your own thinking.',
    ],
  },
  {
    hindi: 'प्रतिबद्ध होना',
    english: 'COMMIT',
    color: '#DA3832',
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

const INTRO_CARDS = [
  { title: 'Not a sequence',    body: "You don't need to use all five in order. Use one. Use three. Come back to others.", color: '#E27238' },
  { title: 'Pick what you need', body: "Use OPEN when you're stuck. Use COMMIT when you need to decide. It's a toolkit.",   color: '#465BA4' },
  { title: 'Built for India',    body: 'Every example, every scenario, every question, grounded in Indian contexts.',       color: '#4DB49F' },
];

/* ── One move as an editorial chapter ────────────────────────── */
function MoveChapter({ move, index }: { move: typeof moves[0]; index: number }) {
  const isMobile = useIsMobile();
  const accent = MOVE_TEXT[move.english] ?? move.color;

  return (
    <article
      id={move.english.toLowerCase()}
      style={{
        borderTop: '1px solid var(--tk-border)',
        paddingBlock: 'clamp(56px, 7vw, 112px)',
        position: 'relative',
        scrollMarginTop: 72,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(240px, 340px) minmax(0, 1fr)',
          gap: isMobile ? 40 : 'clamp(48px, 6vw, 112px)',
          alignItems: 'start',
        }}
      >
        {/* Left rail — sticky identity */}
        <div style={isMobile ? {} : { position: 'sticky', top: 100 }}>
          <Reveal y={20}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: '#BBBBBB', marginBottom: 24 }}>
              MOVE {move.number} / 05
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ width: 'clamp(72px, 8vw, 120px)', height: 'clamp(72px, 8vw, 120px)', marginBottom: 28 }}
            >
              <MoveIcon move={move.english} size={120} variant="color" />
            </motion.div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 0.95, color: '#1A1A1A', margin: 0 }}>
              {move.english}
            </h2>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontWeight: 700, fontSize: 'clamp(20px, 2.2vw, 28px)', color: accent, marginTop: 10 }}>
              {move.hindi}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#999999', marginTop: 16 }}>
              {move.tagline}
            </div>
          </Reveal>
        </div>

        {/* Right — the chapter body */}
        <div>
          <Reveal delay={0.05}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.8vw, 40px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.015em', color: '#1A1A1A', margin: 0, maxWidth: '24ch' }}>
              {move.whatItIs}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.4vw, 18px)', color: '#555555', lineHeight: 1.8, margin: '28px 0 0', maxWidth: '58ch' }}>
              {move.inPlainLanguage}
            </p>
          </Reveal>

          {/* When to use — list */}
          <Reveal delay={0.12}>
            <div style={{ marginTop: 'clamp(36px, 4vw, 56px)' }}>
              <div className="tk-eyebrow" style={{ marginBottom: 8 }}>When to use it</div>
              <div>
                {move.whenToUse.map((w, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'baseline', gap: 14,
                      padding: '14px 0',
                      borderBottom: '1px solid var(--tk-border)',
                    }}
                  >
                    <Diamond color={move.color} size={7} style={{ position: 'relative', top: -1 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#1A1A1A', lineHeight: 1.5 }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* The question it asks — set like a pull quote */}
          <Reveal delay={0.14}>
            <figure style={{ margin: 0, marginTop: 'clamp(40px, 5vw, 64px)', paddingLeft: 'clamp(20px, 2.5vw, 36px)', borderLeft: `3px solid ${move.color}` }}>
              <div className="tk-eyebrow" style={{ marginBottom: 16 }}>The question it asks</div>
              <blockquote style={{ margin: 0 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.6vw, 36px)', fontWeight: 700, fontStyle: 'italic', color: accent, lineHeight: 1.2, letterSpacing: '-0.015em', margin: 0 }}>
                  “{move.question}”
                </p>
                <p style={{ fontFamily: 'var(--font-devanagari)', fontWeight: 700, fontSize: 'clamp(17px, 2vw, 26px)', color: accent, opacity: 0.75, lineHeight: 1.4, margin: '10px 0 0' }}>
                  {move.questionHi}
                </p>
              </blockquote>
            </figure>
          </Reveal>

          <Reveal delay={0.16}>
            <div style={{ marginTop: 'clamp(36px, 4vw, 56px)' }}>
              <Link to={`/toolkit?move=${move.english}`} className="tk-arrow-link" style={{ color: accent }}>
                <span>Try a {move.english} tool</span>
                <span className="arr">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

export function FrameworkPage() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* ── HEADER — dark, editorial ───────────────────────── */}
      <header className="tk-grain" style={{ backgroundColor: '#1A1A1A', paddingTop: 'clamp(128px, 18vh, 200px)', paddingBottom: 'clamp(56px, 7vw, 104px)' }}>
        <div className="tk-wrap">
          <Reveal y={16}>
            <div className="tk-eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
              The Framework · Five Cognitive Moves
            </div>
          </Reveal>

          <LineReveal
            as="h1"
            className="tk-hero-h"
            color="#FFFFFF"
            lines={[
              <span key="a" className="tk-light" style={{ color: 'rgba(255,255,255,0.75)' }}>Five moves</span>,
              'for thinking.',
            ]}
            delay={0.1}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 560px) 1fr',
              gap: 32,
              alignItems: 'end',
              marginTop: 'clamp(32px, 4vw, 56px)',
            }}
          >
            <Reveal delay={0.3}>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.62)', fontSize: 'var(--text-lede)', lineHeight: 1.7, margin: 0 }}>
                Not rules, not steps — five ways of looking at any situation differently.
                Use any one of them. Use one at a time. Come back to others when you need them.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div style={{ display: 'flex', gap: 'clamp(12px, 1.6vw, 24px)', justifyContent: isMobile ? 'flex-start' : 'flex-end', flexWrap: 'wrap' }}>
                {moves.map((m, i) => (
                  <motion.a
                    key={m.english}
                    href={`#${m.english.toLowerCase()}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.07, ease: EASE }}
                    whileHover={{ y: -4 }}
                    style={{ display: 'block' }}
                    aria-label={`Jump to ${m.english}`}
                  >
                    <MoveIcon move={m.english} size={isMobile ? 30 : 38} variant="color" />
                  </motion.a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ── INTRO NOTES — three hairline columns ───────────── */}
      <section style={{ backgroundColor: '#F5F4F1', borderBottom: '1px solid var(--tk-border)' }}>
        <div className="tk-wrap" style={{ paddingBlock: 'clamp(40px, 5vw, 72px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' }}>
            {INTRO_CARDS.map((card, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  style={{
                    paddingTop: isMobile ? 20 : 8,
                    paddingBottom: isMobile ? 20 : 8,
                    paddingRight: isMobile ? 0 : 'clamp(24px, 3vw, 48px)',
                    paddingLeft: isMobile || i === 0 ? 0 : 'clamp(24px, 3vw, 48px)',
                    borderLeft: !isMobile && i > 0 ? '1px solid var(--tk-border)' : 'none',
                    borderTop: isMobile && i > 0 ? '1px solid var(--tk-border)' : 'none',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <Diamond color={card.color} size={7} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>{card.title}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#555555', lineHeight: 1.7, margin: 0 }}>
                    {card.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIVE CHAPTERS ───────────────────────────────────── */}
      <section>
        <div className="tk-wrap">
          {moves.map((move, i) => (
            <MoveChapter key={move.english} move={move} index={i} />
          ))}
        </div>
      </section>

      {/* ── CLOSE ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A1A1A', paddingBlock: 'var(--space-block)' }}>
        <div className="tk-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div className="tk-eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Put it to work</div>
            <p style={{ fontFamily: 'var(--font-display)', color: '#F5F4F1', fontSize: 'var(--text-title)', fontWeight: 700, lineHeight: 1.05, margin: 0 }}>
              Five moves. Twenty-five tools.
            </p>
          </div>
          <Link to="/toolkit" className="tk-btn tk-btn--yellow" style={{ padding: '18px 36px' }}>
            Open the Toolkit →
          </Link>
        </div>
      </section>

      <PageFooter />
    </>
  );
}
