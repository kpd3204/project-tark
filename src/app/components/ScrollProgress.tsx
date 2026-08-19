import { motion, useScroll, useSpring, useTransform } from 'motion/react';

/* Reading-progress hairline — the five move colours filling left to right. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  const width = useTransform(smooth, (v) => `${v * 100}%`);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 2,
        zIndex: 200,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        style={{
          height: '100%',
          width,
          overflow: 'hidden',
        }}
      >
        {/* Fixed-position bands pinned to the viewport width, revealed as the bar grows —
            each fifth stays a true move colour with a hard edge, never a blend */}
        <div
          style={{
            width: '100vw',
            height: '100%',
            background: 'linear-gradient(to right, #FFD167 0% 20%, #E27238 20% 40%, #465BA4 40% 60%, #4DB49F 60% 80%, #DA3832 80% 100%)',
          }}
        />
      </motion.div>
    </div>
  );
}
