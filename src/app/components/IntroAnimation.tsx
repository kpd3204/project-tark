import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Buddy, Tag } from './play';

/* Preloader: five diamond buddies hop in on paper, the wordmark settles
   under them, then the paper closes into a diamond at the centre of the
   screen, the same gesture as the page transitions. */

const EASE = [0.22, 1, 0.36, 1] as const;
const CLOSE_EASE = [0.65, 0, 0.35, 1] as const;
const BUDDIES = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];

const OPEN_DIAMOND = 'polygon(50% -110%, 210% 50%, 50% 210%, -110% 50%)';
const CLOSED_DIAMOND = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)';

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(() => setClosing(true), reduced ? 500 : 1900);
    const t2 = setTimeout(() => onComplete(), reduced ? 800 : 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      className="intro"
      initial={{ clipPath: OPEN_DIAMOND }}
      animate={{ clipPath: closing ? CLOSED_DIAMOND : OPEN_DIAMOND }}
      transition={{ duration: 0.75, ease: CLOSE_EASE }}
      aria-hidden="true"
    >
      <motion.div
        className="intro__inner"
        animate={closing ? { scale: 0.35, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={closing ? { scale: { duration: 0.75, ease: CLOSE_EASE }, opacity: { duration: 0.3, delay: 0.42 } } : { duration: 0.3 }}
      >
        <div className="intro__buddies">
          {BUDDIES.map((c, i) => (
            <motion.div
              key={c}
              initial={{ y: 60, scale: 0.4, opacity: 0 }}
              animate={{ y: [60, -14, 0], scale: [0.4, 1.08, 1], opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: EASE, times: [0, 0.6, 1] }}
            >
              <Buddy color={c} size={0} className="intro__buddy" />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="intro__word"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
        >
          Project <Tag bg="#FFD167" color="#1D1B16" tilt={-3} className="tag--word deva">तर्क</Tag>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
