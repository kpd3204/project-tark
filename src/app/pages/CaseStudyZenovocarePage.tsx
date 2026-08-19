import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { PageFooter } from '../components/PageFooter';
import { useIsMobile } from '../hooks/useIsMobile';

const BORDER = '#E0E0E0';

const MOVES_META = [
  { key: 'OPEN',    color: '#FFD167', textColor: '#1A1A1A', hindi: 'उलझना'      },
  { key: 'TRACE',   color: '#E27238', textColor: '#FFFFFF', hindi: 'परखना'       },
  { key: 'SHIFT',   color: '#465BA4', textColor: '#FFFFFF', hindi: 'बदलना'       },
  { key: 'SURFACE', color: '#4DB49F', textColor: '#FFFFFF', hindi: 'उभरना'       },
  { key: 'COMMIT',  color: '#DA3832', textColor: '#FFFFFF', hindi: 'प्रतिबद्ध' },
];

const NEXT_STEPS_COLORS = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];

const zenovocare = {
  number: '01',
  year: '2026',
  client: 'ZenovoCare',
  context: 'Brand Strategy Kickoff',
  studio: 'Studio Carbon',
  domain: 'MedTech · Physiotherapy Devices',
  sector: 'Healthcare',
  location: 'Gandhinagar, India',
  tagline: 'Thinking clearly before positioning carelessly.',
  description: 'ZenovoCare came to Studio Carbon with a product, a market, and a set of assumptions they hadn\'t yet examined. Before any positioning work could begin, the team needed to think more clearly about who they were for, what they were promising, and why anyone should trust them. The TARK framework was used to structure that thinking - rigorously, before any creative work began.',
  movesUsed: ['OPEN', 'TRACE', 'SHIFT', 'SURFACE', 'COMMIT'],
  overallScore: '6',
  scoreVerdict: 'Good foundation, but lacks conviction.',
  whatWorked: [
    'Trust = peer-driven, correctly identified as the primary sales mechanism',
    'Demo = critical moment, the highest-leverage touchpoint in the purchase journey',
    'Clinical credibility > affordability, the right hierarchy, even if underdeveloped',
    'Clear effort to think systematically, not surface-level fill',
  ],
  whatWasWeak: [
    'Too many safe answers, generic phrases like "easy," "affordable," "effective" that any competitor could claim',
    'Inconsistency across sheets, audience, positioning, and strategy kept shifting',
    'Low decision sharpness, avoiding trade-offs rather than making them',
    'Linear journey mapping, clean and ideal, missing the doubt, friction, and real behavior of actual buyers',
  ],
  moveAssessments: [
    {
      move: 'OPEN',
      label: 'Persona & Audience Work',
      what_worked: 'Correct instinct: home patients ranked first, aligning with D2C shift. Different motivations identified: ease, validation, commission, usability.',
      what_was_weak: 'One-sentence realities were too generic, "affordable device," "easy to use," "clinical validation" are obvious, not insightful. No sharp tension or contradiction.',
      fix: 'Each persona needs a non-obvious truth. Private physio: "Wants something that looks clinical enough to justify pricing, but simple enough to not slow down patient flow." Push beyond functional needs → include ego, risk, money, time pressure.',
    },
    {
      move: 'TRACE',
      label: 'Trust Hierarchy & Journey Mapping',
      what_worked: 'Correct hierarchy identified: peer > conference > institution > ads. Social proof correctly prioritised over marketing spend.',
      what_was_weak: 'Reasoning was thin and repetitive. Describing behaviour, not diagnosing it. Journey mapping felt linear, a happy path fantasy missing drop-offs, doubts, and internal objections.',
      fix: 'Add mechanism clarity. WHY does peer trust win? Risk transfer, reputation borrowing. WHY do institutions matter less? Bureaucracy ≠ credibility. Add friction to the journey: "Looks good → but will patients trust it?" "Works → but is it worth switching?"',
    },
    {
      move: 'SHIFT',
      label: 'Positioning & Perception',
      what_worked: 'Correctly rejected affordability as primary position. Leaned toward clinical credibility + community, the right direction.',
      what_was_weak: 'Still hedging: "clinical credibility + community" is safe, not sharp. No clear trade-off made.',
      fix: 'Pick a hierarchy. Lead: Clinical credibility. Support: Community. Define the conflict: "We are credible BECAUSE real physios use and validate it."',
    },
    {
      move: 'SURFACE',
      label: 'Language & Perception Audit',
      what_worked: 'Good instinct, words like "smart" and "intuitive" land better than "affordable." Thinking from user perception, not brand intention.',
      what_was_weak: 'Responses inconsistent: one sheet said "advanced = confusing," another said "advanced = yes." No locked language system.',
      fix: 'Lock a language system. Avoid: "cheap," "complex," "technical." Use: "effortless," "trusted," "proven," "used by physios."',
    },
    {
      move: 'COMMIT',
      label: 'Strategic Direction & Promise',
      what_worked: 'Both B2B and B2C routes explored. Aiming at differentiation: pain relief, wireless, etc.',
      what_was_weak: 'Indecisive across sheets. Features named as promises, but features are not defensible. Anyone can claim them.',
      fix: 'Pick one direction. If D2C → optimise for simplicity, trust, demo. If B2B → optimise for validation, endorsements. A real promise must be specific, hard to copy, and tied to trust. Direction: "The only device physios trust enough to use on themselves."',
    },
  ],
  whatToDoNext: [
    'Rewrite all personas with one uncomfortable truth each',
    'Define ONE primary audience, not four',
    'Lock: one positioning, one audience, one trust mechanism',
    'Redo the customer journey with friction and doubt included',
    'Turn the demo moment into a clear competitive advantage',
  ],
  photos: [
  {
    src: 'https://i.postimg.cc/yJXTd3pq/write1.jpg',
    alt: 'Participant filling out TARK worksheets during the Brand Strategy Kickoff session',
    caption: 'Worksheets in use',
    style: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
      maxWidth: '1200px'
    }
  },
  {
    src: 'https://i.postimg.cc/Tyqcw57z/write2.jpg',
    alt: 'Participant completing the framework tools at a desk',
    caption: 'Framework tools',
    style: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
      maxWidth: '1200px'
    }
  },
  {
    src: 'https://i.postimg.cc/Ny7xM2Cw/group1.jpg',
    alt: 'Group session at Studio Carbon — TARK website visible on screen',
    caption: 'Group working session',
    style: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
      maxWidth: '1200px'
    }
  },
  {
    src: 'https://i.postimg.cc/f3jvLSqn/group2.jpg',
    alt: 'Team working through the framework at Studio Carbon',
    caption: 'Five Moves in action',
    style: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
      maxWidth: '1200px'
    }
  },
  {
    src: 'https://i.postimg.cc/3yCZR0SS/discussion.jpg',
    alt: 'Post-assessment discussion — reviewing findings',
    caption: 'Post-session debrief',
    style: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
      maxWidth: '1200px'
    }
  }
],
};

/* ── Scroll-reveal hook ── */
function useInViewRef(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Photo with hover caption ── */
function SessionPhoto({ photo, style }: { photo: typeof zenovocare.photos[0]; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    null
  );
}

/* ── Move accordion panel ── */
function MovePanel({ assessment, moveData, isOpen, onToggle }: {
  assessment: typeof zenovocare.moveAssessments[0];
  moveData: typeof MOVES_META[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div style={{ marginBottom: '2px' }}>
      <button
        onClick={onToggle}
        data-move={moveData.key.toLowerCase()}
        style={{
          width: '100%', background: isOpen ? moveData.color : '#FFFFFF',
          border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center',
          borderLeft: `3px solid ${moveData.color}`, minHeight: '72px',
          transition: 'background-color 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 24px', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: isOpen ? (moveData.textColor === '#1A1A1A' ? '#1A1A1A' : '#FFFFFF') : moveData.color, transform: 'rotate(45deg)', flexShrink: 0, transition: 'background-color 0.2s' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: isOpen ? moveData.textColor : '#1A1A1A', transition: 'color 0.2s' }}>{moveData.key}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: isOpen ? (moveData.textColor === '#1A1A1A' ? 'rgba(26,26,26,0.65)' : 'rgba(255,255,255,0.65)') : '#555555', marginTop: '2px', transition: 'color 0.2s' }}>{assessment.label}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: isOpen ? moveData.textColor : '#4DB49F', transition: 'color 0.2s' }}>What worked ✓</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: isOpen ? moveData.textColor : '#1A1A1A', lineHeight: 1, transition: 'transform 0.25s, color 0.2s', display: 'inline-block', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
          </div>
        </div>
      </button>

      <div style={{ height: `${height}px`, overflow: 'hidden', transition: 'height 0.3s ease-in-out' }}>
        <div ref={contentRef} style={{ backgroundColor: `${moveData.color}14` }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2px', padding: '2px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, color: '#4DB49F', marginBottom: '12px' }}>What Worked</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#1A1A1A', lineHeight: 1.65 }}>{assessment.what_worked}</p>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, color: '#DA3832', marginBottom: '12px' }}>What Needed Work</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#1A1A1A', lineHeight: 1.65 }}>{assessment.what_was_weak}</p>
            </div>
          </div>
          <div style={{ backgroundColor: moveData.color, padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, color: moveData.textColor === '#1A1A1A' ? 'rgba(26,26,26,0.5)' : 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>Direction</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: moveData.textColor, lineHeight: 1.65 }}>{assessment.fix}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaseStudyZenovocarePage() {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const nextSteps = useInViewRef();
  const isMobile = useIsMobile();

  return (
    <>
      {/* ── SECTION A — HERO ─────────────────────── */}
      <section style={{ backgroundColor: '#1C2B3A', paddingTop: '120px', paddingBottom: '80px', paddingLeft: 'clamp(24px, 6vw, 96px)', paddingRight: 'clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '64px', alignItems: 'start' }}>
            {/* Left */}
            <div>
              {/* Breadcrumb */}
              <div style={{ fontFamily: 'var(--font-display)', color: '#999999', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '20px' }}>
                <Link to="/case-studies" style={{ color: '#999999', textDecoration: 'none' }}>Case Studies</Link>
                <span style={{ margin: '0 8px', color: '#555555' }}>→</span>
                <span>ZenovoCare</span>
              </div>

              {/* Move pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '32px' }}>
                {MOVES_META.map((m) => (
                  <span key={m.key} data-move={m.key.toLowerCase()} style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, backgroundColor: m.color, color: m.textColor, padding: '4px 10px' }}>{m.key}</span>
                ))}
              </div>

              {/* Case number */}
              <div style={{ fontFamily: 'var(--font-display)', color: '#999999', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Case Study {zenovocare.number}</div>

              {/* Client name */}
              <h1 style={{ fontFamily: 'var(--font-display)', color: '#F5F4F1', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '10px' }}>{zenovocare.client}</h1>

              {/* Context */}
              <div style={{ fontFamily: 'var(--font-body)', color: '#999999', fontSize: '18px', marginBottom: '32px' }}>{zenovocare.context}</div>

              {/* Meta row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { label: 'Domain',   value: zenovocare.domain },
                  { label: 'Year',     value: zenovocare.year },
                  { label: 'Studio',   value: zenovocare.studio },
                  { label: 'Location', value: zenovocare.location },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#555555', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#999999' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Tagline */}
              <div style={{ borderLeft: '3px solid #DA3832', paddingLeft: '16px' }}>
                <p style={{ fontFamily: 'var(--font-display)', color: '#F5F4F1', fontSize: '20px', fontStyle: 'italic', lineHeight: 1.4 }}>{zenovocare.tagline}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION B — CONTEXT NARRATIVE ────────── */}
      <section style={{ backgroundColor: '#FFFFFF', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: '#999999', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '20px' }}>The Session</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: '#1A1A1A', lineHeight: 1.75, marginBottom: '40px' }}>{zenovocare.description}</p>

          {/* Two callout tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2px' }}>
            {[
              { label: 'Framework Applied', value: 'TARK - Five Cognitive Moves' },
              { label: 'Facilitated By',    value: 'Studio Carbon' },
            ].map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: '#F5F4F1', padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', marginBottom: '8px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION C — SESSION PHOTOS ───────────── */}
      <section style={{ backgroundColor: '#F5F4F1' }}>
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SessionPhoto photo={zenovocare.photos[0]} style={{ width: '100%', height: '260px' }} />
            <SessionPhoto photo={zenovocare.photos[1]} style={{ width: '100%', height: '220px' }} />
            <SessionPhoto photo={zenovocare.photos[2]} style={{ width: '100%', height: '220px' }} />
          </div>
        ) : (
          <>
            {/* Row 1 */}
            <div style={{ display: 'flex', gap: '2px' }}>
              <SessionPhoto photo={zenovocare.photos[0]} style={{ width: '55%', height: '400px' }} />
              <SessionPhoto photo={zenovocare.photos[1]} style={{ width: '45%', height: '400px' }} />
            </div>
            {/* Row 2 */}
            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
              <SessionPhoto photo={zenovocare.photos[2]} style={{ width: '40%', height: '320px' }} />
              <SessionPhoto photo={zenovocare.photos[3]} style={{ width: '35%', height: '320px' }} />
              <SessionPhoto photo={zenovocare.photos[4]} style={{ width: '25%', height: '320px' }} />
            </div>
          </>
        )}
      </section>

      {/* ── SECTION D — OVERALL ASSESSMENT ──────── */}
      <section style={{ backgroundColor: '#FFFFFF', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: '#999999', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '32px' }}>Assessment</div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '48px' }}>
            {/* What worked */}
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: '#4DB49F', marginBottom: '20px' }}>What worked</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {zenovocare.whatWorked.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 0', borderBottom: `1px solid #F5F4F1` }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#4DB49F', transform: 'rotate(45deg)', flexShrink: 0, marginTop: '5px' }} />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#1A1A1A', lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What was weak */}
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: '#DA3832', marginBottom: '20px' }}>What needed work</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {zenovocare.whatWasWeak.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 0', borderBottom: `1px solid #F5F4F1` }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#DA3832', transform: 'rotate(45deg)', flexShrink: 0, marginTop: '5px' }} />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#1A1A1A', lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION E — FIVE MOVE BREAKDOWN ──────── */}
      <section style={{ backgroundColor: '#F5F4F1', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: '#999999', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '24px' }}>Move-by-Move Assessment</div>
          {zenovocare.moveAssessments.map((assessment, i) => {
            const moveData = MOVES_META[i];
            return (
              <MovePanel
                key={assessment.move}
                assessment={assessment}
                moveData={moveData}
                isOpen={openPanel === assessment.move}
                onToggle={() => setOpenPanel(openPanel === assessment.move ? null : assessment.move)}
              />
            );
          })}
        </div>
      </section>

      {/* ── SECTION F — WHAT TO DO NEXT ──────────── */}
      <section style={{ backgroundColor: '#1C2B3A', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }} ref={nextSteps.ref}>
          <div style={{ fontFamily: 'var(--font-display)', color: '#999999', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '32px' }}>What Comes Next</div>

          <div>
            {zenovocare.whatToDoNext.map((action, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '32px',
                  padding: '24px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  opacity: nextSteps.visible ? 1 : 0,
                  transform: nextSteps.visible ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, lineHeight: 1, color: NEXT_STEPS_COLORS[i], flexShrink: 0, letterSpacing: '-0.02em' }}>{String(i + 1).padStart(2, '0')}</span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: '#F5F4F1', lineHeight: 1.6 }}>{action}</p>
              </div>
            ))}
          </div>

          {/* Pull quote */}
          <div style={{ borderLeft: '4px solid #FFD167', paddingLeft: '24px', marginTop: '48px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: '#F5F4F1', lineHeight: 1.2 }}>
              "The work is not bad. The work is not finished."
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION G — FRAMEWORK CTA ────────────── */}
      <section style={{ backgroundColor: '#FFD167', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(26,26,26,0.5)', marginBottom: '16px' }}>The Framework</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color: '#1A1A1A', marginBottom: '20px', lineHeight: 1.1 }}>TARK helped ZenovoCare think before they positioned.</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#1A1A1A', lineHeight: 1.65, marginBottom: '32px', maxWidth: '600px' }}>
            The five cognitive moves - OPEN, TRACE, SHIFT, SURFACE, COMMIT - were applied as a structured Brand Strategy Kickoff. The assessment that followed gave Studio Carbon the clarity they needed before any visual or messaging work began.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/framework" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#1C2B3A', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', padding: '14px 28px' }}>
              Try the Framework →
            </Link>
            <Link to="/thinking-partner" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#1A1A1A', fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', padding: '14px 28px', border: '1.5px solid #1A1A1A' }}>
              Start a Thinking Session →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION H — BACK NAVIGATION ──────────── */}
      <section style={{ backgroundColor: '#FFFFFF', padding: 'clamp(32px, 4vw, 48px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <BackLink />
        </div>
      </section>

      <PageFooter />
    </>
  );
}

function BackLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to="/case-studies"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '13px',
        fontWeight: 600,
        color: hovered ? '#1A1A1A' : '#555555',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'color 0.15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ display: 'inline-block', transform: hovered ? 'translateX(-4px)' : 'translateX(0)', transition: 'transform 0.15s' }}>←</span>
      Back to Case Studies
    </Link>
  );
}
