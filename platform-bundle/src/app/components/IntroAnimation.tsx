import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

const DIAMONDS = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 1450);
    const t2 = setTimeout(() => onComplete(), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: '0%' }}
      animate={{ y: exiting ? '-100%' : '0%' }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#141414',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
      }}
    >
      {/* Five diamonds rise out of a mask, in sequence.
          The motion wrapper only translates — the rotation lives on the
          inner element so the diamond orientation is never overridden. */}
      <div style={{ display: 'flex', gap: 18, overflow: 'hidden', padding: 8 }}>
        {DIAMONDS.map((color, i) => (
          <motion.div
            key={i}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.12 + i * 0.09, ease: EASE }}
            style={{ flexShrink: 0 }}
          >
            <span
              style={{
                display: 'block',
                width: 16,
                height: 16,
                backgroundColor: color,
                transform: 'rotate(45deg)',
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        Project तर्क
      </motion.div>
    </motion.div>
  );
}
