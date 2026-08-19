import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';

/* ─── Types ──────────────────────────────────────────────────── */
type MoveKey = 'OPEN' | 'TRACE' | 'SHIFT' | 'SURFACE' | 'COMMIT';

interface Scenario {
  id: string;
  text: string;
  move: MoveKey;
  consequence: string;
  hiddenQuestion: string;
  submittedAt: string;
  responses: string[];
  angle: number;
  radius: number;
}

/* ─── Constants ──────────────────────────────────────────────── */
const MOVE_COLORS: Record<MoveKey, string> = {
  OPEN: '#FFD167', TRACE: '#E27238', SHIFT: '#465BA4', SURFACE: '#4DB49F', COMMIT: '#DA3832',
};
const MOVE_TEXT: Record<MoveKey, string> = {
  OPEN: '#1A1A1A', TRACE: '#FFFFFF', SHIFT: '#FFFFFF', SURFACE: '#FFFFFF', COMMIT: '#FFFFFF',
};
const CLUSTER_CENTRES: Record<MoveKey, { x: number; y: number }> = {
  OPEN:    { x: 480,  y: 300 },
  TRACE:   { x: 1100, y: 200 },
  SHIFT:   { x: 820,  y: 620 },
  SURFACE: { x: 260,  y: 720 },
  COMMIT:  { x: 1380, y: 560 },
};
const MOVE_KEYS: MoveKey[] = ['OPEN', 'TRACE', 'SHIFT', 'SURFACE', 'COMMIT'];
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2.5;

/* ─── Stars (deterministic) ──────────────────────────────────── */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: ((i * 247.3) % 1900) + 50,
  y: ((i * 173.7) % 1100) + 50,
  size: 1 + (i % 3) * 0.5,
  opacity: 0.03 + (i % 4) * 0.025,
}));

/* ─── Gemini ─────────────────────────────────────────────────── */
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=AIzaSyCy3MPULuEelJfFfptIbsXyICbvousxNss`;
async function callGemini(prompt: string): Promise<string> {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9, maxOutputTokens: 400 } }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } catch { return ''; }
}

/* ─── Storage ────────────────────────────────────────────────── */
async function loadScenarios(): Promise<Scenario[]> {
  try {
    const ws = (window as any).storage;
    if (ws) {
      const stored = await ws.get('speculate:scenarios');
      if (stored?.value) return JSON.parse(stored.value);
    } else {
      const raw = localStorage.getItem('speculate:scenarios');
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return [];
}
async function saveScenarios(arr: Scenario[]): Promise<void> {
  try {
    const ws = (window as any).storage;
    const json = JSON.stringify(arr.slice(0, 200));
    if (ws) await ws.set('speculate:scenarios', json, true);
    else localStorage.setItem('speculate:scenarios', json);
  } catch {}
}

/* ─── Seeds ──────────────────────────────────────────────────── */
const SEEDS: Scenario[] = [
  { id: 'seed-open-1', text: 'What if India replaced board exams with a portfolio of decisions made over the year?', move: 'OPEN', consequence: 'Students who are risk-averse might thrive — those trained to perform might struggle.', hiddenQuestion: 'Who decides which decisions count as evidence of learning?', submittedAt: '2026-05-01T00:00:00Z', responses: ['This would change tutoring culture completely.', 'But whose definition of a good decision?'], angle: 0, radius: 120 },
  { id: 'seed-open-2', text: 'What if every Indian classroom had a mandatory "Wrong Answers" wall?', move: 'OPEN', consequence: 'The social cost of being wrong might drop — changing participation fundamentally.', hiddenQuestion: 'Are we afraid of being wrong, or afraid of being seen being wrong?', submittedAt: '2026-05-02T00:00:00Z', responses: ['Teachers would need retraining first.'], angle: 72, radius: 160 },
  { id: 'seed-trace-1', text: 'What if Indian textbooks traced who wrote each chapter — and why they were chosen?', move: 'TRACE', consequence: 'Students might begin questioning the authority of the page itself.', hiddenQuestion: 'What does an anonymous author protect?', submittedAt: '2026-05-03T00:00:00Z', responses: ['This would make history class unrecognisable.', 'In a good way.', 'Or a very uncomfortable way.'], angle: 0, radius: 140 },
  { id: 'seed-trace-2', text: 'What if we traced where the idea of "a stable career" came from in Indian culture?', move: 'TRACE', consequence: 'We would find it is a post-Partition anxiety, not a universal truth.', hiddenQuestion: 'What would parents tell their children if stability were not the goal?', submittedAt: '2026-05-04T00:00:00Z', responses: ["My family would disagree. But they can't explain why."], angle: 120, radius: 100 },
  { id: 'seed-shift-1', text: 'What if India had no engineering colleges for one generation?', move: 'SHIFT', consequence: 'Problems would be solved differently — or left unsolved until someone creative found a way.', hiddenQuestion: 'What are engineering colleges actually producing right now?', submittedAt: '2026-05-05T00:00:00Z', responses: ['The jugaad culture would explode.', 'Honestly might be better for the country.'], angle: 0, radius: 130 },
  { id: 'seed-shift-2', text: 'What if school started at 10am and ended at 3pm — no exceptions?', move: 'SHIFT', consequence: 'Tuition culture would collapse — there would be no time left to exploit.', hiddenQuestion: 'Who benefits from the current school schedule?', submittedAt: '2026-05-06T00:00:00Z', responses: ['Sleep research supports this completely.', "But parents' work schedules?"], angle: 72, radius: 180 },
  { id: 'seed-surface-1', text: 'What if we named every assumption inside "a good student works hard"?', move: 'SURFACE', consequence: 'We would find privilege, luck, and structural advantage hiding inside "hard work".', hiddenQuestion: 'What does this belief protect, and for whom?', submittedAt: '2026-05-07T00:00:00Z', responses: ['This is the one that breaks the myth.', 'SURFACE is the hardest move.'], angle: 0, radius: 110 },
  { id: 'seed-commit-1', text: 'What if every 17-year-old had to write one public position statement — and defend it?', move: 'COMMIT', consequence: 'Epistemic cowardice would become visible — and maybe embarrassing enough to change.', hiddenQuestion: 'Why do we train students to hedge instead of commit?', submittedAt: '2026-05-08T00:00:00Z', responses: ['I would have hated this. And it would have been good for me.', 'Public or within school?'], angle: 0, radius: 150 },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function nodePos(s: Scenario) {
  const c = CLUSTER_CENTRES[s.move];
  return {
    x: c.x + Math.cos(s.angle * Math.PI / 180) * s.radius,
    y: c.y + Math.sin(s.angle * Math.PI / 180) * s.radius,
  };
}

function RowLoader() {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
          style={{ width: 8, height: 8, backgroundColor: '#FFD167', transform: 'rotate(45deg)' }} />
      ))}
    </div>
  );
}

/* ─── ScenarioNode ───────────────────────────────────────────── */
function ScenarioNode({ s, isSelected, isFiltered, onClick, zoom }: {
  s: Scenario; isSelected: boolean; isFiltered: boolean; onClick: () => void; zoom: number;
}) {
  const [hovered, setHovered] = useState(false);
  const color = MOVE_COLORS[s.move];
  const { x, y } = nodePos(s);
  const baseSize = 14 + Math.min(s.responses.length * 3, 20);
  const displaySize = isSelected ? baseSize * 1.5 : hovered ? baseSize * 1.2 : baseSize;

  return (
    <div
      style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: isSelected ? 20 : hovered ? 10 : 1 }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ width: displaySize, height: displaySize, opacity: isFiltered && !isSelected ? 0.15 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundColor: isSelected ? color : hovered ? color : `${color}80`,
          transform: 'rotate(45deg)',
          flexShrink: 0,
          boxShadow: isSelected ? `0 0 20px ${color}60, 0 0 6px ${color}40` : hovered ? `0 0 12px ${color}40` : 'none',
          transition: 'box-shadow 0.2s ease',
        }}
      />
      {(hovered || isSelected) && zoom > 0.5 && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px', backgroundColor: '#1A1A1A', border: `1px solid ${color}`, padding: '8px 12px', width: '180px', pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>{s.move}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#FFFFFF', lineHeight: 1.35, fontWeight: 600 }}>
            {s.text.length > 72 ? s.text.slice(0, 69) + '...' : s.text}
          </div>
          {s.responses.length > 0 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginTop: '5px' }}>
              {s.responses.length} {s.responses.length === 1 ? 'speculation' : 'speculations'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Scenario Panel ─────────────────────────────────────────── */
function ScenarioPanel({ s, onClose, isMobile, onUpdate }: {
  s: Scenario; onClose: () => void; isMobile: boolean; onUpdate: (u: Scenario) => void;
}) {
  const [replyText, setReplyText] = useState('');
  const color = MOVE_COLORS[s.move];

  const handleReply = () => {
    if (!replyText.trim()) return;
    onUpdate({ ...s, responses: [...s.responses, replyText.trim()] });
    setReplyText('');
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'fixed', top: '64px', right: 0, bottom: 0, width: isMobile ? '100vw' : 'min(480px, 92vw)', backgroundColor: '#111111', borderLeft: `1px solid ${color}40`, zIndex: 80, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ height: '4px', backgroundColor: color, flexShrink: 0 }} />
      <div style={{ padding: '24px 28px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 8, height: 8, backgroundColor: color, transform: 'rotate(45deg)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>{s.move}</span>
          </div>
          <button onClick={onClose} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}>CLOSE ✕</button>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(18px, 2.8vw, 26px)', color: '#FFFFFF', lineHeight: 1.2, marginBottom: '28px', letterSpacing: '-0.01em' }}>{s.text}</div>
        {s.consequence && (
          <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: '16px', marginBottom: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px' }}>IF THIS HAPPENED...</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>{s.consequence}</div>
          </div>
        )}
        {s.hiddenQuestion && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px' }}>THE QUESTION NOBODY ASKS</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{s.hiddenQuestion}</div>
          </div>
        )}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px' }}>
            SPECULATIONS ({s.responses.length})
          </div>
          {s.responses.map((r, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, display: 'flex', gap: '10px' }}>
              <div style={{ width: 5, height: 5, backgroundColor: color, transform: 'rotate(45deg)', flexShrink: 0, marginTop: '7px', opacity: 0.6 }} />
              {r}
            </div>
          ))}
          <div style={{ marginTop: '16px' }}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add your speculation..."
              rows={3}
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#FFFFFF', padding: '12px', resize: 'none', lineHeight: 1.6, transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              onFocus={(e) => (e.target.style.borderColor = color)}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <button
              onClick={handleReply} disabled={!replyText.trim()}
              style={{ marginTop: '8px', backgroundColor: replyText.trim() ? color : 'rgba(255,255,255,0.1)', color: replyText.trim() ? MOVE_TEXT[s.move] : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, padding: '11px 22px', border: 'none', cursor: replyText.trim() ? 'pointer' : 'default', transition: 'background-color 0.2s, color 0.2s' }}
            >POST →</button>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>TAKE THIS FURTHER</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '16px' }}>Map this scenario's consequences, alternatives, and assumptions using the Futures Map.</p>
          <a
            href={`https://futuresmap.netlify.app/?scenario=${encodeURIComponent(s.text)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: color, color: MOVE_TEXT[s.move], fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, padding: '14px 20px', textDecoration: 'none', transition: 'opacity 0.15s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <div style={{ width: 7, height: 7, backgroundColor: MOVE_TEXT[s.move], transform: 'rotate(45deg)', flexShrink: 0 }} />
            OPEN IN FUTURES MAP ↗
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Compose Modal ──────────────────────────────────────────── */
function ComposeModal({ onClose, onSubmit, isSubmitting }: {
  onClose: () => void;
  onSubmit: (text: string, move: MoveKey | null) => void;
  isSubmitting: boolean;
}) {
  const [composeText, setComposeText] = useState('');
  const [selectedMove, setSelectedMove] = useState<MoveKey | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 90, backdropFilter: 'blur(3px)' }}
      />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(560px, 92vw)', backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)', zIndex: 91, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <motion.div
          animate={{ backgroundColor: selectedMove ? MOVE_COLORS[selectedMove] : '#333333' }}
          transition={{ duration: 0.3 }}
          style={{ height: '4px' }}
        />
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>ADD TO THE UNIVERSE</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(22px, 3vw, 30px)', color: '#FFFFFF', lineHeight: 1.1 }}>What if...</div>
            </div>
            <button onClick={onClose} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', paddingTop: '4px' }}>✕</button>
          </div>
          <textarea
            value={composeText}
            onChange={(e) => setComposeText(e.target.value.slice(0, 200))}
            placeholder="India stopped requiring students to choose a stream before they could vote?"
            rows={3} autoFocus
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: `2px solid ${selectedMove ? MOVE_COLORS[selectedMove] : 'rgba(255,255,255,0.2)'}`, outline: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(16px, 2.2vw, 22px)', color: '#FFFFFF', lineHeight: 1.4, padding: '0 0 12px 0', resize: 'none', marginBottom: '8px', transition: 'border-color 0.3s', boxSizing: 'border-box' }}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', textAlign: 'right', marginBottom: '28px' }}>{composeText.length}/200</div>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px' }}>WHICH MOVE IS THIS? (optional)</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {MOVE_KEYS.map((m) => (
                <button key={m} onClick={() => setSelectedMove(selectedMove === m ? null : m)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' }}
                >
                  <motion.div
                    animate={{ backgroundColor: selectedMove === m ? MOVE_COLORS[m] : 'rgba(255,255,255,0.1)', scale: selectedMove === m ? 1.15 : 1 }}
                    transition={{ duration: 0.18 }}
                    style={{ width: 32, height: 32, transform: 'rotate(45deg)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {selectedMove === m && (
                      <div style={{ width: 8, height: 8, backgroundColor: m === 'OPEN' ? '#1A1A1A' : '#FFFFFF' }} />
                    )}
                  </motion.div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: selectedMove === m ? MOVE_COLORS[m] : 'rgba(255,255,255,0.25)', transition: 'color 0.15s' }}>{m}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onSubmit(composeText, selectedMove)}
            disabled={composeText.length < 10 || isSubmitting}
            style={{ width: '100%', backgroundColor: composeText.length >= 10 ? '#FFFFFF' : 'rgba(255,255,255,0.1)', color: composeText.length >= 10 ? '#1A1A1A' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, padding: '16px', border: 'none', cursor: composeText.length >= 10 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background-color 0.2s, color 0.2s' }}
          >
            {isSubmitting ? <RowLoader /> : (
              <>
                <div style={{ width: 7, height: 7, backgroundColor: composeText.length >= 10 ? '#1A1A1A' : 'rgba(255,255,255,0.2)', transform: 'rotate(45deg)', flexShrink: 0 }} />
                ADD TO THE UNIVERSE
              </>
            )}
          </button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textAlign: 'center', marginTop: '12px' }}>No account needed · CC BY-SA 4.0</div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export function SpeculatePage() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobileInit = typeof window !== 'undefined' && window.innerWidth < 768;
  const [pan, setPan] = useState({ x: isMobileInit ? 80 : 200, y: isMobileInit ? 40 : 80 });
  const [zoom, setZoom] = useState(isMobileInit ? 0.45 : 0.85);
  const [isPanning, setIsPanning] = useState(false);
  const [smoothTransition, setSmoothTransition] = useState(false);

  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const pinchDistRef = useRef<number | null>(null);
  const stateRef = useRef({ pan: { x: 200, y: 80 }, zoom: 0.85 });
  useEffect(() => { stateRef.current = { pan, zoom }; }, [pan, zoom]);

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [filter, setFilter] = useState<MoveKey | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailySeed, setDailySeed] = useState('');

  useEffect(() => { loadScenarios().then(arr => { if (arr.length) setScenarios(arr); }); }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `tark-daily-seed-${today}`;
    const cached = sessionStorage.getItem(key);
    if (cached) { setDailySeed(cached); return; }
    callGemini('Generate ONE specific "What If?" scenario about Indian education or youth culture. One English sentence, starting with the actual scenario (not "What if"), max 15 words. No quotes.').then(text => {
      const line = text.trim().split('\n')[0] || 'schools measured curiosity instead of marks';
      setDailySeed(line);
      sessionStorage.setItem(key, line);
    });
  }, []);

  useEffect(() => {
    setSmoothTransition(true);
    const container = containerRef.current;
    if (!filter) {
      setPan({ x: isMobile ? 80 : 200, y: isMobile ? 40 : 80 });
      setZoom(isMobile ? 0.45 : 0.85);
    } else if (container) {
      const rect = container.getBoundingClientRect();
      const centre = CLUSTER_CENTRES[filter];
      const targetZoom = isMobile ? 0.65 : 1.0;
      setPan({ x: rect.width / 2 - centre.x * targetZoom, y: rect.height / 2 - centre.y * targetZoom });
      setZoom(targetZoom);
    }
    const t = setTimeout(() => setSmoothTransition(false), 520);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, textarea, input')) return;
    setIsPanning(true);
    setSmoothTransition(false);
    panStart.current = { x: e.clientX, y: e.clientY };
    panOrigin.current = stateRef.current.pan;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: panOrigin.current.x + (e.clientX - panStart.current.x), y: panOrigin.current.y + (e.clientY - panStart.current.y) });
  }, [isPanning]);

  const onMouseUp = useCallback(() => setIsPanning(false), []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setSmoothTransition(false);
    const { pan: p, zoom: z } = stateRef.current;
    const rect = containerRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + e.deltaY * -0.001 * z));
    const wx = (mx - p.x) / z;
    const wy = (my - p.y) / z;
    setPan({ x: mx - wx * newZoom, y: my - wy * newZoom });
    setZoom(newZoom);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      setSmoothTransition(false);
      panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panOrigin.current = stateRef.current.pan;
      pinchDistRef.current = null;
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      setPan({ x: panOrigin.current.x + (e.touches[0].clientX - panStart.current.x), y: panOrigin.current.y + (e.touches[0].clientY - panStart.current.y) });
    } else if (e.touches.length === 2 && pinchDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const { pan: p, zoom: z } = stateRef.current;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * (newDist / pinchDistRef.current)));
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - (containerRef.current?.getBoundingClientRect().left ?? 0);
      const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - (containerRef.current?.getBoundingClientRect().top ?? 0);
      setPan({ x: mx - ((mx - p.x) / z) * newZoom, y: my - ((my - p.y) / z) * newZoom });
      setZoom(newZoom);
      pinchDistRef.current = newDist;
    }
  }, [isPanning]);

  const onTouchEnd = useCallback(() => { setIsPanning(false); pinchDistRef.current = null; }, []);

  const containerSize = useRef({ w: 1200, h: 800 });
  useEffect(() => {
    const update = () => { if (containerRef.current) { const r = containerRef.current.getBoundingClientRect(); containerSize.current = { w: r.width, h: r.height }; } };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const allScenarios = useMemo(() => [...SEEDS, ...scenarios], [scenarios]);
  const displayedScenarios = useMemo(() => !filter ? allScenarios : allScenarios.filter(s => s.move === filter), [allScenarios, filter]);
  const visibleScenarios = useMemo(() => {
    if (displayedScenarios.length <= 50) return displayedScenarios;
    const left = -pan.x / zoom - 100;
    const top = -pan.y / zoom - 100;
    const right = left + containerSize.current.w / zoom + 200;
    const bottom = top + containerSize.current.h / zoom + 200;
    return displayedScenarios.filter(s => { const { x, y } = nodePos(s); return x >= left && x <= right && y >= top && y <= bottom; });
  }, [displayedScenarios, pan, zoom]);

  const handleCompose = async (composeText: string, selectedMove: MoveKey | null) => {
    if (composeText.length < 10 || isSubmitting) return;
    setIsSubmitting(true);
    const fullText = 'What if ' + composeText.trim();
    let move: MoveKey = selectedMove || 'OPEN';
    let consequence = '';
    let hiddenQuestion = '';
    const raw = await callGemini(`A student posted: "${fullText}"\n1. Assign ONE TARK move: OPEN=questions assumptions, TRACE=follows origins, SHIFT=imagines alternatives, SURFACE=reveals hidden beliefs, COMMIT=acts despite uncertainty\n2. One speculative consequence sentence (Indian context, max 18 words).\n3. One hidden question this raises (max 12 words).\nReply ONLY as valid JSON: {"move":"OPEN","consequence":"...","hiddenQuestion":"..."}`);
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      if (!selectedMove) move = (MOVE_KEYS.includes(parsed.move) ? parsed.move : 'OPEN') as MoveKey;
      consequence = parsed.consequence || '';
      hiddenQuestion = parsed.hiddenQuestion || '';
    } catch {}
    const clusterCount = allScenarios.filter(s => s.move === move).length;
    const angle = (clusterCount * 137.508) % 360;
    const ring = Math.floor(clusterCount / 8);
    const radius = 90 + ring * 50 + (clusterCount % 8) * 12;
    const newS: Scenario = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      text: fullText, move, consequence, hiddenQuestion,
      submittedAt: new Date().toISOString(), responses: [], angle, radius,
    };
    const updated = [newS, ...scenarios];
    setScenarios(updated);
    await saveScenarios(updated);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const { x: nx, y: ny } = nodePos(newS);
      const z = stateRef.current.zoom;
      setSmoothTransition(true);
      setPan({ x: rect.width / 2 - nx * z, y: rect.height / 2 - ny * z });
      setTimeout(() => setSmoothTransition(false), 600);
    }
    setSelected(newS);
    setComposeOpen(false);
    setIsSubmitting(false);
  };

  const handleUpdate = useCallback((updated: Scenario) => {
    const next = scenarios.map(s => s.id === updated.id ? updated : s);
    setScenarios(next);
    setSelected(updated);
    saveScenarios(next);
  }, [scenarios]);

  const resetView = () => {
    setSmoothTransition(true);
    setPan({ x: isMobile ? 80 : 200, y: isMobile ? 40 : 80 });
    setZoom(isMobile ? 0.45 : 0.85);
    setTimeout(() => setSmoothTransition(false), 520);
  };

  const zoomBtnStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
    padding: '4px 10px', cursor: 'pointer', lineHeight: 1,
  };

  return (
    <div style={{ position: 'relative' }}>

      {/* ── CANVAS ───────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, backgroundColor: '#0A0A0A', overflow: 'hidden', cursor: isPanning ? 'grabbing' : 'grab', touchAction: 'none', userSelect: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* World */}
        <div style={{ position: 'absolute', width: '2000px', height: '1200px', transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', transition: smoothTransition ? 'transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)' : 'none' }}>

          {/* Stars */}
          {STARS.map((star, i) => (
            <div key={i} style={{ position: 'absolute', left: star.x, top: star.y, width: star.size, height: star.size, borderRadius: '50%', backgroundColor: '#FFFFFF', opacity: star.opacity, pointerEvents: 'none' }} />
          ))}

          {/* Cluster auras */}
          {MOVE_KEYS.map(move => {
            const centre = CLUSTER_CENTRES[move];
            const color = MOVE_COLORS[move];
            const count = allScenarios.filter(s => s.move === move).length;
            const size = 320 + count * 20;
            const dimmed = filter !== null && filter !== move;
            return (
              <div key={move} style={{ position: 'absolute', left: centre.x - size / 2, top: centre.y - size / 2, width: size, height: size, transform: 'rotate(45deg)', background: `radial-gradient(ellipse at center, ${color}18 0%, ${color}08 40%, transparent 70%)`, pointerEvents: 'none', opacity: dimmed ? 0.15 : 1, transition: 'opacity 0.3s' }} />
            );
          })}

          {/* Cluster labels */}
          {MOVE_KEYS.map(move => {
            const centre = CLUSTER_CENTRES[move];
            const color = MOVE_COLORS[move];
            const dimmed = filter !== null && filter !== move;
            return (
              <div key={move} style={{ position: 'absolute', left: centre.x, top: centre.y - 20, transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', userSelect: 'none', opacity: dimmed ? 0 : 0.5, transition: 'opacity 0.3s' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color }}>{move}</div>
              </div>
            );
          })}

          {/* Connection lines */}
          {zoom > 0.5 && (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '2000px', height: '1200px', pointerEvents: 'none', overflow: 'visible' }}>
              {visibleScenarios.map(s => {
                const centre = CLUSTER_CENTRES[s.move];
                const { x, y } = nodePos(s);
                const color = MOVE_COLORS[s.move];
                const dimmed = filter !== null && filter !== s.move;
                return <line key={s.id} x1={centre.x} y1={centre.y} x2={x} y2={y} stroke={color} strokeWidth="0.5" strokeOpacity={dimmed ? 0.04 : 0.2} />;
              })}
            </svg>
          )}

          {/* Nodes */}
          {visibleScenarios.map(s => (
            <ScenarioNode key={s.id} s={s}
              isSelected={selected?.id === s.id}
              isFiltered={filter !== null && filter !== s.move}
              onClick={() => setSelected(selected?.id === s.id ? null : s)}
              zoom={zoom}
            />
          ))}

          {/* Daily seed card */}
          {dailySeed && (
            <div style={{ position: 'absolute', left: 820, top: 400, transform: 'translate(-50%, -50%)', width: '220px', backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.15)', padding: '20px', zIndex: 5, pointerEvents: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>TODAY'S QUESTION</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', lineHeight: 1.3 }}>
                <span style={{ color: '#FFD167' }}>What if </span>{dailySeed}
              </div>
              <button onClick={() => setComposeOpen(true)} style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: '#FFD167', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                SPECULATE ON THIS →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTROLS BAR ─────────────────────────────────────── */}
      <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, height: '48px', background: 'linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(12px, 3vw, 40px)', zIndex: 50, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'none' }}>
          {!isMobile && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>SPECULATION UNIVERSE · {allScenarios.length} scenarios</span>}
        </div>
        <div style={{ display: 'flex', gap: isMobile ? '4px' : '6px', alignItems: 'center', pointerEvents: 'auto' }}>
          <button onClick={() => setFilter(null)} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, padding: isMobile ? '5px 8px' : '5px 10px', backgroundColor: filter === null ? 'rgba(255,255,255,0.15)' : 'transparent', color: filter === null ? '#FFFFFF' : 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.15s' }}>ALL</button>
          {MOVE_KEYS.map(m => (
            <button key={m} onClick={() => setFilter(filter === m ? null : m)}
              style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0' : '5px', padding: isMobile ? '6px' : '5px 10px', backgroundColor: filter === m ? `${MOVE_COLORS[m]}22` : 'transparent', border: `1px solid ${filter === m ? MOVE_COLORS[m] : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              <div style={{ width: 6, height: 6, backgroundColor: MOVE_COLORS[m], transform: 'rotate(45deg)', opacity: filter === m ? 1 : 0.5, flexShrink: 0, transition: 'opacity 0.15s' }} />
              {!isMobile && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: filter === m ? MOVE_COLORS[m] : 'rgba(255,255,255,0.4)', transition: 'color 0.15s' }}>{m}</span>}
            </button>
          ))}
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', pointerEvents: 'auto' }}>
            <button onClick={resetView} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', cursor: 'pointer' }}>RESET</button>
            <button onClick={() => { setSmoothTransition(false); setZoom(z => Math.min(z + 0.2, MAX_ZOOM)); }} style={zoomBtnStyle}>+</button>
            <button onClick={() => { setSmoothTransition(false); setZoom(z => Math.max(z - 0.2, MIN_ZOOM)); }} style={zoomBtnStyle}>−</button>
          </div>
        )}
      </div>

      {/* ── COMPOSE BUTTON ───────────────────────────────────── */}
      <button
        onClick={() => setComposeOpen(true)}
        style={{ position: 'fixed', bottom: isMobile ? '24px' : '32px', right: isMobile ? '16px' : '32px', zIndex: 60, backgroundColor: '#FFFFFF', color: '#1A1A1A', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, padding: isMobile ? '12px 18px' : '14px 24px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', transition: 'transform 0.15s, box-shadow 0.15s' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)'; }}
      >
        <motion.div animate={{ rotate: [45, 405] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} style={{ width: 8, height: 8, backgroundColor: '#FFD167', flexShrink: 0 }} />
        {isMobile ? 'ADD' : 'ADD A SCENARIO'}
      </button>

      {/* ── SCENARIO PANEL ───────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <ScenarioPanel key={selected.id} s={selected} onClose={() => setSelected(null)} isMobile={isMobile} onUpdate={handleUpdate} />
        )}
      </AnimatePresence>

      {/* ── COMPOSE MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {composeOpen && (
          <ComposeModal onClose={() => setComposeOpen(false)} onSubmit={handleCompose} isSubmitting={isSubmitting} />
        )}
      </AnimatePresence>
    </div>
  );
}
