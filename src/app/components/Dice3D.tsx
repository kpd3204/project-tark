import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { MoveIcon } from './MoveIcon';
import type { MoveKey } from './MoveIcon';

/* The तर्क dice, rendered in WebGL: a rounded plastic cube lit by a key light
   and a studio environment, casting a soft shadow on an invisible table.
   Rolls tumble through the air, bounce, and settle with the result face up.
   Five faces carry the move icons; the sixth is the "Thinking in progress"
   stamp. */

export type FaceKey = MoveKey | 'WILD';

/* BoxGeometry material order is +x, -x, +y, -y, +z, -z. Each entry also
   holds the rotation that turns that face to point up. */
const FACES: { key: FaceKey; up: THREE.Euler; top: THREE.Vector3 }[] = [
  { key: 'TRACE',   up: new THREE.Euler(0, 0, Math.PI / 2),  top: new THREE.Vector3(0, 1, 0) },
  { key: 'SURFACE', up: new THREE.Euler(0, 0, -Math.PI / 2), top: new THREE.Vector3(0, 1, 0) },
  { key: 'OPEN',    up: new THREE.Euler(0, 0, 0),            top: new THREE.Vector3(0, 0, -1) },
  { key: 'WILD',    up: new THREE.Euler(Math.PI, 0, 0),      top: new THREE.Vector3(0, 0, -1) },
  { key: 'SHIFT',   up: new THREE.Euler(-Math.PI / 2, 0, 0), top: new THREE.Vector3(0, -1, 0) },
  { key: 'COMMIT',  up: new THREE.Euler(Math.PI / 2, 0, 0),  top: new THREE.Vector3(0, 1, 0) },
];
/* `top` is the direction, on the cube, that the printed artwork's top edge
   faces. When a face lands up, the dice turns so that edge points away
   from the viewer, a quarter turn off square, so every icon reads the
   right way round rather than sideways or upside down. */
const restYaw = (face: number) => {
  const t = FACES[face].top.clone().applyEuler(FACES[face].up);
  // turn the artwork's top to point away (-z), then a further eighth turn for the three-quarter view
  return Math.atan2(-t.x, -t.z) + Math.PI - Math.PI / 4;
};

const SIZE = 1.6;
const PAPER = '#FBF8F1';
const TEX = 512;
/* the dice rests turned an eighth of a turn to the viewer, so the artwork is
   printed turned the other way: the result face then reads exactly like the logo */
const ART_TURN = -Math.PI / 4;
/* how far above its frame the dice may leap, as a share of the frame's height */
const LEAP_ROOM = 0.7;

/* ── Face textures ─────────────────────────────────────────────── */
function baseFace(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, TEX, TEX);
  // a faint sink toward the edges, like moulded plastic
  const g = ctx.createRadialGradient(TEX / 2, TEX / 2, TEX * 0.2, TEX / 2, TEX / 2, TEX * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(60,50,30,0.07)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX, TEX);
}

/* A bump map made from what is printed on a face: the print sits slightly
   pressed into the plastic, so it catches light like a real dice */
function bumpFrom(draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TEX;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  draw(ctx);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, TEX, TEX);
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, TEX, TEX);
  return canvas;
}

function iconTexture(move: MoveKey, done: () => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TEX;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  baseFace(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = bumpCanvas.height = TEX;
  const bump = new THREE.CanvasTexture(bumpCanvas);
  const markup = renderToStaticMarkup(<MoveIcon move={move} size={256} variant="color" />);
  const svg = (markup.match(/<svg[\s\S]*<\/svg>/) || [''])[0];
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1]?.split(/\s+/).map(Number) || [0, 0, 1, 1];
  const ratio = vb[2] / vb[3];
  const withNs = svg.includes('xmlns=') ? svg : svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  const sized = withNs.replace(/<svg /, `<svg width="${Math.round(512 * ratio)}" height="512" `).replace(/ style="[^"]*"/, '');
  const img = new Image();
  img.onload = () => {
    const box = TEX * 0.52;
    const w = ratio >= 1 ? box : box * ratio;
    const h = ratio >= 1 ? box / ratio : box;
    const place = (c: CanvasRenderingContext2D) => {
      c.save();
      c.translate(TEX / 2, TEX / 2);
      c.rotate(ART_TURN);
      c.drawImage(img, -w / 2, -h / 2, w, h);
      c.restore();
    };
    place(ctx);
    const b = bumpFrom(place);
    bumpCanvas.getContext('2d', { willReadFrequently: true })!.drawImage(b, 0, 0);
    tex.needsUpdate = true;
    bump.needsUpdate = true;
    done();
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sized);
  return { tex, bump };
}

function drawStamp(ctx: CanvasRenderingContext2D) {
  const blue = '#465BA4';
  const c = TEX / 2;
  ctx.save();
  ctx.translate(c, c);
  ctx.rotate(ART_TURN + (-8 * Math.PI) / 180);
  ctx.strokeStyle = blue;
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(0, 0, TEX * 0.38, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = blue;
  ctx.font = '700 48px "Geist Mono", ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const arc = (text: string, radius: number, top: boolean) => {
    const step = 0.215;
    const n = text.length;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * step;
      const a = top ? -Math.PI / 2 + off : Math.PI / 2 - off;
      ctx.save();
      ctx.translate(Math.cos(a) * radius, Math.sin(a) * radius);
      ctx.rotate(top ? a + Math.PI / 2 : a - Math.PI / 2);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };
  arc('THINKING', TEX * 0.27, true);
  arc('IN PROGRESS', TEX * 0.27, false);
  [-40, 0, 40].forEach((x) => { ctx.beginPath(); ctx.arc(x, 0, 12, 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
}

function stampTexture(done: () => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TEX;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = bumpCanvas.height = TEX;
  const bump = new THREE.CanvasTexture(bumpCanvas);
  const draw = () => {
    baseFace(ctx);
    drawStamp(ctx);
    bumpCanvas.getContext('2d', { willReadFrequently: true })!.drawImage(bumpFrom(drawStamp), 0, 0);
    tex.needsUpdate = true;
    bump.needsUpdate = true;
    done();
  };
  (document.fonts?.load('700 48px "Geist Mono"') ?? Promise.resolve()).then(draw, draw);
  return { tex, bump };
}

/* A soft round blot, used for the contact shadow under the dice */
function blotTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(29,27,22,0.55)');
  g.addColorStop(0.5, 'rgba(29,27,22,0.22)');
  g.addColorStop(1, 'rgba(29,27,22,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export type Dice3DHandle = { roll: (push?: number) => void; rolling: () => boolean };

export const Dice3D = forwardRef<Dice3DHandle, {
  onSettle?: (face: FaceKey) => void;
  onRollStart?: () => void;
  idle?: boolean;           // slow turning showcase, no rolling
  className?: string;
}>(function Dice3D({ onSettle, onRollStart, idle = false, className }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<Dice3DHandle>({ roll: () => {}, rolling: () => false });
  const settleRef = useRef(onSettle);
  const startRef = useRef(onRollStart);
  settleRef.current = onSettle;
  startRef.current = onRollStart;

  useImperativeHandle(ref, () => ({
    roll: (p) => api.current.roll(p),
    rolling: () => api.current.rolling(),
  }), []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ROOM = idle ? 0 : LEAP_ROOM;

    /* renderer, scene, camera */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.42;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    if (idle) { camera.position.set(0, 2.9, 6.6); camera.lookAt(0, 0.1, 0); }
    else { camera.position.set(0, 4.6, 7.0); camera.lookAt(0, 0.5, 0); }

    /* light */
    scene.add(new THREE.HemisphereLight(0xfffaf0, 0xcfc2a8, 0.75));
    const key = new THREE.DirectionalLight(0xfff6e8, 1.7);
    key.position.set(3.4, 5.2, 4.2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    const sc = key.shadow.camera as THREE.OrthographicCamera;
    sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3;
    key.shadow.radius = 10;
    key.shadow.blurSamples = 16;
    key.shadow.bias = -0.0004;
    scene.add(key);

    /* table: invisible, only shows the shadow */
    const floorY = -SIZE / 2;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.16 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = floorY;
    floor.receiveShadow = true;
    scene.add(floor);
    const blot = new THREE.Mesh(
      new THREE.PlaneGeometry(SIZE * 1.9, SIZE * 1.9),
      new THREE.MeshBasicMaterial({ map: blotTexture(), transparent: true, depthWrite: false }),
    );
    blot.rotation.x = -Math.PI / 2;
    blot.position.y = floorY + 0.002;
    scene.add(blot);

    /* the dice */
    let dirty = true;
    const markDirty = () => { dirty = true; };
    const materials = FACES.map((f) => {
      const { tex, bump } = f.key === 'WILD' ? stampTexture(markDirty) : iconTexture(f.key, markDirty);
      return new THREE.MeshPhysicalMaterial({
        map: tex,
        bumpMap: bump,
        bumpScale: 1.6,
        roughness: 0.48,
        clearcoat: 0.45,
        clearcoatRoughness: 0.35,
      });
    });
    const dice = new THREE.Mesh(new RoundedBoxGeometry(SIZE, SIZE, SIZE, 8, SIZE * 0.14), materials);
    dice.castShadow = true;
    scene.add(dice);

    const restQuat = (face: number, yaw: number) =>
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
        .multiply(new THREE.Quaternion().setFromEuler(FACES[face].up));

    // start resting with OPEN up, turned a little so three faces show
    dice.quaternion.copy(restQuat(2, restYaw(2)));

    /* sizing */
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      // the canvas reaches above its frame, so the dice can leap over the heading
      const reach = h * ROOM;
      renderer.setSize(w, h + reach, false);
      camera.aspect = w / h;
      camera.setViewOffset(w, h, 0, -reach, w, h + reach);
      camera.updateProjectionMatrix();
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    /* rolling */
    type Anim = { t0: number; dur: number; q0: THREE.Quaternion; q1: THREE.Quaternion; axis: THREE.Vector3; turns: number; hop: number; face: number };
    let anim: Anim | null = null;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const hopY = (t: number, h: number) => {
      // one big arc, then two small bounces
      const seg = (a: number, b: number, height: number) => {
        if (t < a || t > b) return 0;
        const s = (t - a) / (b - a);
        return 4 * height * s * (1 - s);
      };
      return seg(0, 0.52, h) + seg(0.52, 0.74, h * 0.22) + seg(0.74, 0.88, h * 0.06);
    };

    const roll = (push = 0) => {
      if (anim) return;
      const face = Math.floor(Math.random() * FACES.length);
      // a three-quarter turn, so the top and two sides show evenly
      const yaw = restYaw(face) + (Math.random() - 0.5) * 0.18;
      const q1 = restQuat(face, yaw);
      if (reduced) { dice.quaternion.copy(q1); dirty = true; settleRef.current?.(FACES[face].key); return; }
      startRef.current?.();
      const axis = new THREE.Vector3(Math.random() - 0.5, (Math.random() - 0.5) * 0.4, Math.random() - 0.5).normalize();
      anim = { t0: performance.now(), dur: 1500 + push * 150, q0: dice.quaternion.clone(), q1, axis, turns: 2 + Math.floor(Math.random() * 2) + Math.round(push), hop: 2.2 + push * 0.4, face };
    };
    api.current = { roll, rolling: () => !!anim };

    /* grab and flick */
    let drag: { x: number; y: number; moved: number } | null = null;
    const canvas = renderer.domElement;
    if (!idle) {
      el.style.touchAction = 'none';
      el.style.cursor = 'grab';
    }
    const onDown = (e: PointerEvent) => {
      if (idle || anim) return;
      el.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, moved: 0 };
      el.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      drag.moved += Math.hypot(dx, dy);
      const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * 0.012);
      const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * 0.012);
      dice.quaternion.premultiply(qy).premultiply(qx);
      dice.position.y = Math.min(0.5, drag.moved * 0.004);
      dirty = true;
    };
    const onUp = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      el.style.cursor = 'grab';
      roll(moved > 40 ? Math.min(2, moved / 160) : 0);
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    /* loop: renders only while something moves, and only when visible */
    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    const spin = new THREE.Quaternion();
    let last = performance.now();
    renderer.setAnimationLoop((now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      if (idle && !reduced) {
        spin.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dt * 0.45);
        dice.quaternion.premultiply(spin);
        dice.position.y = 0.12 + Math.sin(now / 900) * 0.06;
        dirty = true;
      }
      if (anim) {
        const t = Math.min(1, (now - anim.t0) / anim.dur);
        const e = ease(t);
        const extra = new THREE.Quaternion().setFromAxisAngle(anim.axis, anim.turns * Math.PI * 2 * (1 - e));
        dice.quaternion.copy(anim.q0).slerp(anim.q1, e).premultiply(extra);
        dice.position.y = hopY(t, anim.hop);
        if (t >= 1) {
          dice.quaternion.copy(anim.q1);
          dice.position.y = 0;
          const face = anim.face;
          anim = null;
          settleRef.current?.(FACES[face].key);
        }
        dirty = true;
      } else if (!drag && !idle && dice.position.y > 0) {
        dice.position.y = Math.max(0, dice.position.y - dt * 2);
        dirty = true;
      }
      if (!dirty) return;
      // the contact shadow tightens and darkens as the dice comes down
      const h = Math.max(0, dice.position.y);
      const k = 1 / (1 + h * 0.9);
      blot.scale.setScalar(0.75 + 0.45 * k);
      // the hard shadow fades as the dice rises, so it never runs off the frame mid-leap
      key.shadow.intensity = Math.max(0, 1 - h * 1.1);
      (blot.material as THREE.MeshBasicMaterial).opacity = 0.25 + 0.75 * k;
      renderer.render(scene, camera);
      dirty = false;
    });

    return () => {
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      materials.forEach((m) => { m.map?.dispose(); m.bumpMap?.dispose(); m.dispose(); });
      dice.geometry.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [idle]);

  return <div ref={host} className={`dice3d ${idle ? '' : 'dice3d--leap'} ${className || ''}`} />;
});

export default Dice3D;
