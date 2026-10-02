import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import imgCapsule from '../../imports/photos/time-capsule-letter.jpg';
import imgClassroom from '../../imports/photos/classroom-workshop.jpg';
import imgBooklets from '../../imports/photos/five-moves-booklets.jpg';
import imgButterfly from '../../imports/photos/butterfly-effect-group.jpg';
import imgTeam from '../../imports/photos/team-thinking-partner.jpg';
import { useIsMobile } from '../hooks/useIsMobile';
import { DiamondField } from './DiamondField';
import { EASE } from './kit';
import { Pill } from './play';

/* Each phrase is paired with a photograph from a TARK session
   and one of the five move colours. */
const SLIDES = [
  { line1: 'Indian adolescents grow up around answers.', line2: 'तर्क begins with questions.',      img: imgCapsule,    pos: '50% 40%', color: '#FFD167' },
  { line1: 'Thoughts are often given.',                  line2: 'तर्क lets you rearrange them.',    img: imgClassroom,  pos: '50% 55%', color: '#E27238' },
  { line1: 'Ideas come pre-shaped.',                     line2: 'तर्क reshapes them.',              img: imgBooklets,   pos: '55% 45%', color: '#4DB49F' },
  { line1: 'We hold on to first thoughts.',              line2: 'तर्क revisits them.',              img: imgButterfly,  pos: '50% 50%', color: '#7B8FD6' },
  { line1: 'We look for the right answer.',              line2: 'तर्क looks for better questions.', img: imgTeam,       pos: '50% 45%', color: '#F0675F' },
];

const CYCLE_MS = 6500;

const HEADLINE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(32px, 4.9vw, 84px)',
  lineHeight: 1.02,
  letterSpacing: '-0.03em',
  color: '#FFFFFF',
  maxWidth: '21em',
  margin: 0,
  textShadow: '0 2px 30px rgba(0,0,0,0.25)',
  textWrap: 'balance',
};

function Line2({ text, color }: { text: string; color: string }) {
  return (
    <>
      {text.split('तर्क').map((part, i, arr) => (
        <span key={i}>
          {part}
          {i < arr.length - 1 && <span style={{ color, fontFamily: 'var(--font-devanagari)' }}>तर्क</span>}
        </span>
      ))}
    </>
  );
}

/* A line that rises out of its own mask.
   The mask keeps extra room so descenders and Devanagari marks never clip. */
function MaskedLine({ children, delay = 0, light = false }: { children: React.ReactNode; delay?: number; light?: boolean }) {
  return (
    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.16em', marginBottom: '-0.16em', paddingTop: '0.12em', marginTop: '-0.12em' }}>
      <motion.span
        initial={{ y: '115%' }}
        animate={{ y: '0%', transition: { duration: 0.8, delay, ease: EASE } }}
        exit={{ y: '-115%', transition: { duration: 0.45, delay: delay * 0.4, ease: [0.7, 0, 0.84, 0] } }}
        style={{ display: 'block', fontWeight: light ? 400 : 700 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);

  /* Reserve exactly the height of the tallest statement at this width, so the
     headline never jumps between slides and leaves no extra blank space. */
  const measureRef = useRef<HTMLDivElement>(null);
  const [reserve, setReserve] = useState(0);
  useLayoutEffect(() => {
    const box = measureRef.current;
    if (!box) return;
    const measure = () => setReserve(Math.max(...Array.from(box.children).map((c) => (c as HTMLElement).offsetHeight)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [index, paused]);

  // preload the rest of the photographs once the first has painted
  useEffect(() => {
    const t = setTimeout(() => SLIDES.slice(1).forEach((s) => { const i = new Image(); i.src = s.img; }), 1200);
    return () => clearTimeout(t);
  }, []);

  // 0 at the top of the page → 1 once the hero has scrolled away
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / (heroRef.current?.offsetHeight || window.innerHeight))));
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.55]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);

  const slide = SLIDES[index];

  return (
    <section
      ref={heroRef}
      data-hero="true"
      style={{
        minHeight: '100svh',
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'var(--gutter)',
        paddingTop: 96,
        paddingBottom: 'clamp(28px, 3.4vw, 48px)',
      }}
    >
      {/* Photography, crossfades with each phrase, slow push-in */}
      <div className="tk-grain" style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#141414', zIndex: 0 }}>
        <motion.div style={{ position: 'absolute', inset: 0, scale: photoScale }}>
          <AnimatePresence initial={false}>
            <motion.img
              key={index}
              src={slide.img}
              alt=""
              initial={{ opacity: 0, scale: 1.07 }}
              animate={{ opacity: 1, scale: 1, transition: { opacity: { duration: 1.2, ease: 'easeOut' }, scale: { duration: CYCLE_MS / 1000 + 1.5, ease: 'linear' } } }}
              exit={{ opacity: 0, transition: { duration: 1.2, delay: 0.2 } }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: slide.pos, display: 'block' }}
            />
          </AnimatePresence>
        </motion.div>
        {/* Grade: a calm overall tint, deeper at the base for the headline */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,12,12,0.34)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,12,0.86) 0%, rgba(12,12,12,0.5) 34%, rgba(12,12,12,0) 62%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,12,12,0.5) 0%, rgba(12,12,12,0) 18%)' }} />
        <motion.div style={{ position: 'absolute', inset: 0, background: '#0C0C0C', opacity: veil }} />
      </div>

      {/* Hand-drawn diamond grid, over the photo, clear of the headline and actions */}
      <DiamondField heroRef={heroRef} />

      {/* Headline + actions */}
      <motion.div style={{ position: 'relative', zIndex: 3, y: textY, opacity: textOpacity }}>
        <div
          data-avoid
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ display: 'block' }}
        >
          <div data-grid-floor style={{ position: 'relative', minHeight: reserve || undefined, display: 'flex', alignItems: 'flex-end' }}>
            {/* invisible copies of every statement, measured for the reserve */}
            <div ref={measureRef} aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, visibility: 'hidden', pointerEvents: 'none' }}>
              {SLIDES.map((s, i) => (
                <h2 key={i} style={{ ...HEADLINE, position: 'absolute', top: 0, left: 0, right: 0, fontWeight: 400 }}>
                  <span style={{ display: 'block' }}>{s.line1}</span>
                  <span style={{ display: 'block', fontWeight: 700 }}><Line2 text={s.line2} color={s.color} /></span>
                </h2>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <h1 key={index} style={HEADLINE}>
                <MaskedLine light>{slide.line1}</MaskedLine>
                <MaskedLine delay={0.1}><Line2 text={slide.line2} color={slide.color} /></MaskedLine>
              </h1>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          data-avoid
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            marginTop: 'clamp(28px, 3.6vw, 52px)',
            paddingTop: 'clamp(18px, 2vw, 24px)',
            borderTop: '1px solid rgba(255,255,255,0.22)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Pill to="/thinking-partner" variant="yellow">Start thinking</Pill>
            <Pill to="/toolkit" variant="ghost-light">See the tools</Pill>
            {!isMobile && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.72)', letterSpacing: '0.14em', textTransform: 'uppercase', marginLeft: 10 }}>
                Free · No sign-up · Ages 13–22
              </span>
            )}
          </div>

          {/* Slide markers, five diamonds, one per move colour */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: -7 }} role="tablist" aria-label="Hero statements">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Statement ${i + 1}`}
                onClick={() => setIndex(i)}
                style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <span
                  style={{
                    width: 10, height: 10,
                    borderRadius: 2,
                    transform: `rotate(45deg) scale(${i === index ? 1.25 : 1})`,
                    backgroundColor: i === index ? s.color : 'transparent',
                    boxShadow: `inset 0 0 0 1.5px ${i === index ? s.color : 'rgba(255,255,255,0.6)'}`,
                    transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
