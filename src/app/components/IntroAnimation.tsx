import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Buddy } from './play';

/* Preloader: one diamond buddy hops in on paper, in a brand colour picked
   at random each time, then the paper closes
   into a diamond at the centre of the screen, the same gesture as the page
   transitions. */

const EASE = [0.22, 1, 0.36, 1] as const;
const CLOSE_EASE = [0.65, 0, 0.35, 1] as const;
const COLORS = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];

const OPEN_DIAMOND = 'polygon(50% -110%, 210% 50%, 50% 210%, -110% 50%)';
const CLOSED_DIAMOND = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)';

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [closing, setClosing] = useState(false);
  const [color] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);

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
        <motion.div
          initial={{ y: 70, scale: 0.3, rotate: -20, opacity: 0 }}
          animate={{ y: [70, -18, 0], scale: [0.3, 1.1, 1], rotate: [-20, 6, 0], opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE, times: [0, 0.6, 1] }}
        >
          <Buddy color={color} size={0} className="intro__buddy" glance />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
