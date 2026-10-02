import { useEffect, useRef } from 'react';

/* DiamondCursor: a small rounded diamond under the pointer, and a larger
   diamond ring that follows on a spring and tilts with the movement.
   Over links the ring opens up and takes a soft fill; over anything tagged
   with a move it takes that move's colour; on dark backgrounds it turns
   light. Everything moves by transform in one animation frame loop, and the
   background is only measured when the element under the pointer changes. */

const MOVE_COLORS: Record<string, string> = {
  open:    '#FFD167',
  trace:   '#E27238',
  shift:   '#465BA4',
  surface: '#4DB49F',
  commit:  '#DA3832',
};
const INK = '#1D1B16';
const PAPER = '#F6F0E4';

/* Walk up from an element to the first opaque background; true if dark */
function isBgDark(el: Element): boolean {
  let node: Element | null = el;
  for (let i = 0; i < 20 && node && node !== document.documentElement; i++) {
    const bg = window.getComputedStyle(node as HTMLElement).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      const m = bg.match(/[\d.]+/g);
      if (m && m.length >= 3) return (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255 < 0.45;
    }
    node = node.parentElement;
  }
  return false;
}

export function DiamondCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches || window.innerWidth < 1024) return;
    const dot = dotRef.current, ring = ringRef.current;
    if (!dot || !ring) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const styleEl = document.createElement('style');
    styleEl.textContent = '@media (min-width: 1024px) and (hover: hover) { html, html * { cursor: none !important; } input, textarea, select, [contenteditable] { cursor: text !important; } }';
    document.head.appendChild(styleEl);

    let px = -100, py = -100;          // pointer
    let rx = -100, ry = -100;          // ring position
    let vx = 0, vy = 0;                // ring velocity
    let tilt = 0;
    let ringScale = 1, ringTarget = 1;
    let dotScale = 1, dotTarget = 1;
    let pressed = false, visible = false, hidden = false;
    let lastTarget: Element | null = null;
    let raf = 0;

    const setState = (target: Element) => {
      if (target === lastTarget) return;
      lastTarget = target;
      const field = target.closest('input, textarea, select, [contenteditable="true"]');
      hidden = !!field;
      const moveEl = target.closest('[data-move]') as HTMLElement | null;
      const linkEl = target.closest('a, button, [role="button"], label, summary');
      const dark = isBgDark(target);
      const ink = dark ? PAPER : INK;
      const moveColor = moveEl ? MOVE_COLORS[moveEl.dataset.move?.toLowerCase() || ''] : '';

      if (moveColor) {
        ring.style.borderColor = ink;
        ring.style.backgroundColor = moveColor + 'B3';
        dot.style.backgroundColor = ink;
        ringTarget = 1.6; dotTarget = 0.7;
      } else if (linkEl) {
        ring.style.borderColor = ink;
        ring.style.backgroundColor = dark ? 'rgba(246,240,228,0.16)' : 'rgba(29,27,22,0.08)';
        dot.style.backgroundColor = ink;
        ringTarget = 1.6; dotTarget = 0.7;
      } else {
        ring.style.borderColor = dark ? 'rgba(246,240,228,0.55)' : 'rgba(29,27,22,0.35)';
        ring.style.backgroundColor = 'transparent';
        dot.style.backgroundColor = ink;
        ringTarget = 1; dotTarget = 1;
      }
    };

    const tick = () => {
      // ring follows on a spring; the dot sits exactly on the pointer
      if (reduced) { rx = px; ry = py; vx = vy = 0; }
      else {
        vx = (vx + (px - rx) * 0.22) * 0.62;
        vy = (vy + (py - ry) * 0.22) * 0.62;
        rx += vx; ry += vy;
      }
      const speed = Math.max(-1, Math.min(1, vx / 40));
      tilt += (speed * 18 - tilt) * 0.2;
      ringScale += ((pressed ? ringTarget * 0.8 : ringTarget) - ringScale) * 0.2;
      dotScale += ((pressed ? dotTarget * 1.4 : dotTarget) - dotScale) * 0.25;

      const show = visible && !hidden ? '1' : '0';
      dot.style.opacity = show;
      ring.style.opacity = show;
      dot.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(45deg) scale(${dotScale.toFixed(3)})`;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) rotate(${(45 + tilt).toFixed(2)}deg) scale(${ringScale.toFixed(3)})`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX; py = e.clientY;
      if (!visible) { visible = true; rx = px; ry = py; }
      setState(e.target as Element);
    };
    const onDown = () => { pressed = true; };
    const onUp = () => { pressed = false; };
    const onLeave = () => { visible = false; };
    const onScroll = () => { lastTarget = null; }; // the element under the pointer may change

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      styleEl.remove();
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cur-ring" aria-hidden="true" />
      <div ref={dotRef} className="cur-dot" aria-hidden="true" />
    </>
  );
}
