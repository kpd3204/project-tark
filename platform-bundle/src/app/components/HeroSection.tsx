import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import heroGif from '../../imports/webgif1.gif';
import { useIsMobile } from '../hooks/useIsMobile';
import { EASE } from './kit';

const phrases = [
  { line1: 'Indian adolescents grow up around answers.', line2: 'तर्क begins with questions.'      },
  { line1: 'Thoughts are often given.',                  line2: 'तर्क lets you rearrange them.'    },
  { line1: 'Ideas come pre-shaped.',                     line2: 'तर्क reshapes them.'              },
  { line1: 'We hold on to first thoughts.',              line2: 'तर्क revisits them.'              },
  { line1: 'We look for the right answer.',              line2: 'तर्क looks for better questions.' },
];

const PHRASE_COLORS = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];
const CYCLE_MS = 6000;

/* A line that rises out of its own mask.
   The mask keeps extra room so descenders and Devanagari marks never clip. */
function MaskedLine({ children, delay = 0, light = false }: { children: React.ReactNode; delay?: number; light?: boolean }) {
  return (
    <span
      style={{
        display: 'block',
        overflow: 'hidden',
        paddingBottom: '0.16em',
        marginBottom: '-0.16em',
        paddingTop: '0.12em',
        marginTop: '-0.12em',
      }}
    >
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
  const isMobile = useIsMobile();

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const color = PHRASE_COLORS[index];

  return (
    <section
      data-hero="true"
      className="tk-grain"
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#141414',
        padding: 'var(--gutter)',
        paddingTop: 96,
        paddingBottom: 'clamp(24px, 3vw, 44px)',
      }}
    >
      {/* Background film */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <motion.img
          src={heroGif}
          alt=""
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Legibility scrims — bottom for the phrase, a soft cap for the kicker */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.95) 10%, rgba(10,10,10,0.6) 48%, rgba(10,10,10,0.28) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 24%)',
          }}
        />
        {/* Live accent tint that follows the current phrase */}
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(120% 90% at 85% 10%, ${color}22 0%, transparent 55%)`,
              pointerEvents: 'none',
            }}
          />
        </AnimatePresence>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Phrase — light line against bold line */}
        <div style={{ minHeight: isMobile ? '2.2em' : undefined }}>
          <AnimatePresence mode="wait">
            <div
              key={index}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(30px, 6.6vw, 100px)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                maxWidth: '14em',
              }}
            >
              <MaskedLine light>{phrases[index].line1}</MaskedLine>
              <MaskedLine delay={0.1}>
                {phrases[index].line2.split('तर्क').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <motion.span
                        animate={{ color }}
                        transition={{ duration: 0.5 }}
                        style={{ color, fontFamily: 'var(--font-devanagari)' }}
                      >
                        तर्क
                      </motion.span>
                    )}
                  </span>
                ))}
              </MaskedLine>
            </div>
          </AnimatePresence>
        </div>

        {/* Structured bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
        >
          <div
            style={{
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.16)',
              marginTop: 'clamp(32px, 4.5vw, 64px)',
              marginBottom: 'clamp(18px, 2vw, 26px)',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            {/* Counter + progress segments */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                {String(index + 1).padStart(2, '0')} — 05
              </span>
              <div style={{ display: 'flex', gap: 5, width: isMobile ? 130 : 280 }}>
                {phrases.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Phrase ${i + 1}`}
                    style={{ flex: 1, height: 14, display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    <span style={{ flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.18)', position: 'relative', overflow: 'hidden', display: 'block' }}>
                      {i === index && (
                        <motion.span
                          key={`fill-${index}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                          style={{ position: 'absolute', inset: 0, backgroundColor: PHRASE_COLORS[i], transformOrigin: 'left', display: 'block' }}
                        />
                      )}
                      {i < index && (
                        <span style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.4)', display: 'block' }} />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs + meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {!isMobile && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.16em', textTransform: 'uppercase', marginRight: 6 }}>
                  Free · No sign-up · Ages 13–22
                </span>
              )}
              <Link
                to="/thinking-partner"
                className="tk-btn tk-btn--paper"
                style={{ padding: isMobile ? '13px 20px' : '15px 30px' }}
              >
                Start Thinking →
              </Link>
              <Link to="/toolkit" className="tk-btn tk-btn--ghost-light" style={{ padding: isMobile ? '13px 20px' : '15px 30px' }}>
                See the Tools
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
