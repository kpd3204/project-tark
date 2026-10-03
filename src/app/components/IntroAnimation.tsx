import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Buddy } from './play';

/* Preloader: one diamond buddy eases in on paper, in a brand colour
   picked at random each time, glances left and right, then the paper
   closes into a diamond at the centre of the screen, the same gesture as
   the page transitions. Everything moves by transform and opacity only,
   so the browser never has to repaint the full screen. */

const CLOSE_EASE = [0.65, 0, 0.35, 1] as const;
const COLORS = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [closing, setClosing] = useState(false);
  const [color] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(() => setClosing(true), reduced ? 500 : 2100);
    const t2 = setTimeout(() => onComplete(), reduced ? 800 : 2850);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className="intro" aria-hidden="true">
      {/* the paper: a diamond large enough to cover the screen, closing to a point */}
      <motion.div
        className="intro__paper"
        initial={{ scale: 1, rotate: 45 }}
        animate={{ scale: closing ? 0 : 1, rotate: 45 }}
        transition={{ duration: 0.7, ease: CLOSE_EASE }}
      />
      <motion.div
        className="intro__buddy-wrap"
        initial={{ y: 30, scale: 0.4, rotate: -18, opacity: 0 }}
        animate={closing
          ? { y: 0, scale: 0, rotate: 0, opacity: 0 }
          : { y: 0, scale: 1, rotate: 0, opacity: 1 }}
        transition={closing
          ? { duration: 0.55, ease: CLOSE_EASE }
          : { type: 'spring', stiffness: 85, damping: 14, mass: 1, delay: 0.3, opacity: { duration: 0.7, delay: 0.3, ease: 'easeOut' } }}
      >
        <Buddy color={color} size={0} className="intro__buddy" glance pop={false} />
      </motion.div>
    </div>
  );
}
