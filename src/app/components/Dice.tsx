import { motion, type MotionValue } from 'motion/react';
import { MoveIcon } from './MoveIcon';
import type { MoveKey } from './MoveIcon';

/* The तर्क dice: a CSS 3D cube modelled on the physical TARK dice. Five
   faces carry the move icons; the sixth is a wild face (any move). */

export type FaceKey = MoveKey | 'WILD';

/* Each face, where it sits on the cube, and the cube rotation that brings
   it to the front: [rotateX, rotateY]. */
export const FACES: { key: FaceKey; place: string; show: [number, number] }[] = [
  { key: 'OPEN',    place: 'rotateY(0deg)',    show: [0, 0] },
  { key: 'TRACE',   place: 'rotateY(90deg)',   show: [0, -90] },
  { key: 'SHIFT',   place: 'rotateY(180deg)',  show: [0, 180] },
  { key: 'SURFACE', place: 'rotateY(-90deg)',  show: [0, 90] },
  { key: 'COMMIT',  place: 'rotateX(90deg)',   show: [-90, 0] },
  { key: 'WILD',    place: 'rotateX(-90deg)',  show: [90, 0] },
];

const CORE = ['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'];

/* The sixth face: a "Thinking in progress" stamp */
export function ThinkingStamp({ className }: { className?: string }) {
  return (
    <svg className={`stamp ${className || ''}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id="stamp-top" d="M 40 100 A 60 60 0 0 1 160 100" />
        <path id="stamp-bottom" d="M 22 100 A 78 78 0 0 0 178 100" />
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="5" />
      <text className="stamp__text"><textPath href="#stamp-top" startOffset="50%" textAnchor="middle">THINKING</textPath></text>
      <text className="stamp__text"><textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">IN PROGRESS</textPath></text>
      <circle cx="80" cy="100" r="5" fill="currentColor" />
      <circle cx="100" cy="100" r="5" fill="currentColor" />
      <circle cx="120" cy="100" r="5" fill="currentColor" />
    </svg>
  );
}

function Face({ k }: { k: FaceKey }) {
  if (k === 'WILD') return <span className="die__stamp"><ThinkingStamp /></span>;
  return <span className="die__icon"><MoveIcon move={k} size={64} variant="color" /></span>;
}

/* rx / ry: motion values for the cube rotation; spin: idle turning */
export function Die({ rx, ry, spin = false, className }: {
  rx?: MotionValue<number>; ry?: MotionValue<number>; spin?: boolean; className?: string;
}) {
  return (
    <div className={`die ${spin ? 'die--spin' : ''} ${className || ''}`}>
      {/* a fixed presentation tilt, so every face lands square but reads in 3D */}
      <div className="die__tilt">
      <motion.div className="die__cube" style={rx && ry ? { rotateX: rx, rotateY: ry } : undefined}>
        {/* a smaller solid core fills the rounded corners */}
        {CORE.map((t) => <div key={t} className="die__core" style={{ transform: `${t} translateZ(calc(var(--s) * 0.41))` }} />)}
        {FACES.map((f) => (
          <div key={f.key} className="die__face" style={{ transform: `${f.place} translateZ(calc(var(--s) / 2))` }}>
            <Face k={f.key} />
          </div>
        ))}
      </motion.div>
      </div>
    </div>
  );
}
