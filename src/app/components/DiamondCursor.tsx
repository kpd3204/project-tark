import { useEffect, useRef } from 'react';

/* DiamondCursor: a diamond under the pointer with a trail of five small
   diamonds in the move colours. Each trail diamond chases the one in front
   on a soft spring, so the trail flows evenly at any frame rate; it grows
   with speed and fades away when the pointer rests. Everything moves by
   transform in one animation frame loop, and the background is only
   measured when the element under the pointer changes. */

const MOVE_COLORS: Record<string, string> = {
  open:    '#FFD167',
  trace:   '#E27238',
  shift:   '#465BA4',
  surface: '#4DB49F',
  commit:  '#DA3832',
};
const TRAIL = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];
const INK = '#1D1B16';
const LIGHT = 'rgba(246,240,228,0.92)';

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
  const headRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches || window.innerWidth < 1024) return;
    const head = headRef.current;
    const trail = trailRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!head || trail.length !== TRAIL.length) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const styleEl = document.createElement('style');
    styleEl.textContent = '@media (min-width: 1024px) and (hover: hover) { html, html * { cursor: none !important; } input, textarea, select, [contenteditable] { cursor: text !important; } }';
    document.head.appendChild(styleEl);

    let px = -100, py = -100, lastPx = -100, lastPy = -100;
    const pts = TRAIL.map(() => ({ x: -100, y: -100 }));
    let speed = 0;            // smoothed pointer speed, px per frame
    let trailAlpha = 0;
    let headScale = 1, headTarget = 1;
    let pressed = false, visible = false, hidden = false;
    let lastTarget: Element | null = null;
    let raf = 0;

    const setState = (target: Element) => {
      if (target === lastTarget) return;
      lastTarget = target;
      hidden = !!target.closest('input, textarea, select, [contenteditable="true"]');
      const moveEl = target.closest('[data-move]') as HTMLElement | null;
      const linkEl = target.closest('a, button, [role="button"], label, summary');
      const ink = isBgDark(target) ? LIGHT : INK;
      const moveColor = moveEl ? MOVE_COLORS[moveEl.dataset.move?.toLowerCase() || ''] : '';

      if (moveColor) {
        head.style.backgroundColor = moveColor;
        head.style.borderColor = ink;
        headTarget = 1.5;
      } else if (linkEl) {
        head.style.backgroundColor = ink;
        head.style.borderColor = ink;
        headTarget = 1.5;
      } else {
        head.style.backgroundColor = 'transparent';
        head.style.borderColor = ink;
        headTarget = 1;
      }
    };

    const tick = () => {
      // pointer speed, smoothed so the trail breathes rather than flickers
      const d = Math.hypot(px - lastPx, py - lastPy);
      lastPx = px; lastPy = py;
      speed += (d - speed) * 0.15;

      // trail: each diamond chases the one in front
      let lx = px, ly = py;
      for (let i = 0; i < pts.length; i++) {
        const k = reduced ? 1 : 0.42 - i * 0.03;
        pts[i].x += (lx - pts[i].x) * k;
        pts[i].y += (ly - pts[i].y) * k;
        lx = pts[i].x; ly = pts[i].y;
      }

      const alphaTarget = visible && !hidden && speed > 0.6 ? 1 : 0;
      trailAlpha += (alphaTarget - trailAlpha) * (alphaTarget ? 0.18 : 0.06);
      const grow = 1 + Math.min(speed / 30, 0.5);

      headScale += ((pressed ? headTarget * 0.75 : headTarget) - headScale) * 0.25;
      head.style.opacity = visible && !hidden ? '1' : '0';
      head.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(45deg) scale(${headScale.toFixed(3)})`;

      trail.forEach((el, i) => {
        const p = pts[i];
        el.style.opacity = (trailAlpha * (1 - i * 0.12)).toFixed(3);
        el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) rotate(45deg) scale(${(grow * (1 - i * 0.1)).toFixed(3)})`;
      });

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX; py = e.clientY;
      if (!visible) {
        visible = true;
        lastPx = px; lastPy = py;
        pts.forEach((p) => { p.x = px; p.y = py; });
      }
      setState(e.target as Element);
    };
    const onDown = () => { pressed = true; };
    const onUp = () => { pressed = false; };
    const onLeave = () => { visible = false; };
    const onScroll = () => { lastTarget = null; };

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
      {TRAIL.map((c, i) => (
        <div
          key={c}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="cur-trail"
          style={{ backgroundColor: c, zIndex: 99990 - i }}
          aria-hidden="true"
        />
      ))}
      <div ref={headRef} className="cur-head" aria-hidden="true" />
    </>
  );
}
