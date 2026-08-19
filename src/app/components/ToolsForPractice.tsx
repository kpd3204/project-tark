import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Monitor, Layers } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { MoveIcon } from './MoveIcon';
import type { MoveKey } from './MoveIcon';

/* ─── Color constants ──────────────────────────────────────── */
const BG      = '#FFFFFF';
const BG_ALT  = '#F5F4F1';
const BORDER  = '#E0E0E0';
const BORDER_STR = '#1A1A1A';
const TEXT    = '#1A1A1A';
const TEXT2   = '#555555';
const MUTED   = '#999999';

/* ─── Data ────────────────────────────────────────────────── */

const moves: {
  key: MoveKey;
  color: string;
  description: string;
  tools: { name: string; function: string }[];
  worksheets: { title: string; pages: number; desc: string }[];
}[] = [
  {
    key: 'OPEN',
    color: '#FFD167',
    description: 'Suspend certainty. Create space for possibilities not yet considered.',
    tools: [
      { name: 'Assumption Mapper',  function: 'Surface and examine hidden beliefs before starting an inquiry'      },
      { name: 'What-If Explorer',   function: 'Generate five divergent scenarios from a single starting condition' },
      { name: 'Opposite Day',       function: 'Argue the contrary position to stress-test your initial thinking'  },
      { name: "Beginner's Mind",    function: 'Re-encounter a familiar topic as if for the first time'            },
    ],
    worksheets: [
      { title: 'Question Your Assumptions',  pages: 1, desc: 'Map core assumptions before engaging with any new topic or decision.' },
      { title: 'Belief Inventory',           pages: 1, desc: 'List and examine the beliefs you bring to a given situation.' },
      { title: 'What-If Explorer',           pages: 2, desc: 'Generate five divergent scenarios from a single starting condition.' },
      { title: 'Opposite Position',          pages: 1, desc: 'Construct the strongest version of the view you disagree with.' },
      { title: 'Certainty Scale',            pages: 1, desc: 'Rate your confidence across a set of claims and examine the gaps.' },
      { title: "Beginner's Eye",             pages: 1, desc: 'Re-encounter something familiar as if for the very first time.' },
      { title: 'Possibility Map',            pages: 2, desc: 'Chart the space of what could be true before narrowing down.' },
      { title: 'Assumption Origin Trace',    pages: 1, desc: 'Follow one key assumption back to where you first learned it.' },
    ],
  },
  {
    key: 'TRACE',
    color: '#E27238',
    description: 'Follow the lineage of an idea. Understand how beliefs and systems were constructed.',
    tools: [
      { name: 'Origin Story',       function: 'Map an idea, practice, or norm back to its historical roots'       },
      { name: 'System Timeline',    function: 'Construct a chronological map of how a system evolved'             },
      { name: 'Who Benefits?',      function: 'Identify power structures embedded in an existing system'          },
      { name: 'Source Audit',       function: 'Trace where your knowledge of a topic actually comes from'         },
    ],
    worksheets: [
      { title: 'Origin Mapping',        pages: 2, desc: 'Trace a belief or norm back to its historical and social roots.' },
      { title: 'System Timeline',       pages: 2, desc: 'Build a chronological map of how a system or idea evolved.' },
      { title: 'Who Benefits?',         pages: 1, desc: 'Identify whose interests are served by a given arrangement.' },
      { title: 'Source Audit',          pages: 1, desc: 'Trace where your knowledge of a topic actually comes from.' },
      { title: 'Belief History',        pages: 1, desc: 'Document when and how a key belief was formed or changed.' },
      { title: 'Power Map',             pages: 2, desc: 'Diagram the power relationships embedded in any system.' },
      { title: 'Narrative Archaeology', pages: 2, desc: 'Excavate the layers of story beneath a dominant account.' },
      { title: 'Knowledge Trail',       pages: 1, desc: 'Follow a piece of knowledge back through its sources.' },
    ],
  },
  {
    key: 'SHIFT',
    color: '#465BA4',
    description: 'Change the frame. Reimagine the rules, constraints, and contexts.',
    tools: [
      { name: 'Frame Flip',         function: 'Restate the same problem from three entirely different frames'     },
      { name: 'World Builder',      function: 'Imagine an alternative rule-set and design its consequences'       },
      { name: 'Constraint Remover', function: 'Explore what becomes possible if one rule is eliminated'           },
      { name: 'Persona Shift',      function: 'Analyse a situation through the lens of a different actor'        },
    ],
    worksheets: [
      { title: 'Frame Rewrite',         pages: 1, desc: 'Restate the same problem across three entirely different frames.' },
      { title: 'World Builder',         pages: 2, desc: 'Imagine an alternative rule-set and trace its consequences.' },
      { title: 'Constraint Removal',    pages: 1, desc: 'Explore what becomes possible when one rule is lifted.' },
      { title: 'Persona Shift',         pages: 1, desc: 'Analyse a situation through the lens of a different actor.' },
      { title: 'Rule Inversion',        pages: 1, desc: 'Flip the dominant logic and see what the inverse implies.' },
      { title: 'Context Transfer',      pages: 1, desc: 'Move a problem into a different context and observe what changes.' },
      { title: 'Metaphor Swap',         pages: 1, desc: 'Replace the governing metaphor of an idea and explore the shift.' },
      { title: 'Lens Library',          pages: 2, desc: 'Apply six different analytical lenses to a single situation.' },
    ],
  },
  {
    key: 'SURFACE',
    color: '#4DB49F',
    description: 'Make the invisible visible. Name what is assumed, normalized, or hidden.',
    tools: [
      { name: 'Invisible Rules',    function: 'Name the unspoken norms operating in a familiar environment'       },
      { name: 'Hidden Stakes',      function: 'Identify whose interests are silent in a given situation'          },
      { name: 'Language Audit',     function: 'Examine the assumptions embedded in the words we use'             },
      { name: 'Meta-Mirror',        function: 'Reflect on your own reasoning process as you complete a task'     },
    ],
    worksheets: [
      { title: "What's Invisible Here?", pages: 2, desc: 'Surface unspoken norms and hidden stakes in any situation.' },
      { title: 'Hidden Stakes',          pages: 1, desc: 'Identify whose interests are silent in a given situation.' },
      { title: 'Language Audit',         pages: 1, desc: 'Examine the assumptions embedded in the words being used.' },
      { title: 'Meta-Mirror',            pages: 1, desc: 'Reflect on your own reasoning process as you complete a task.' },
      { title: 'Norm Inventory',         pages: 1, desc: 'List the unspoken rules operating in a familiar environment.' },
      { title: 'Silence Map',            pages: 2, desc: 'Chart what is consistently absent from a conversation or system.' },
      { title: 'Assumption Embedder',    pages: 1, desc: 'Locate the assumptions hidden inside everyday statements.' },
      { title: 'The Unsaid',             pages: 1, desc: 'Name what is true but never spoken in a given context.' },
    ],
  },
  {
    key: 'COMMIT',
    color: '#DA3832',
    description: 'Take a stance. Choose a direction, even in uncertainty.',
    tools: [
      { name: 'Decision Audit',      function: 'Review and document the reasoning behind a significant decision'  },
      { name: 'Commitment Contract', function: 'Commit to a position with documented uncertainty bounds'          },
      { name: 'Uncertainty Ledger',  function: 'Separate what you know from what you are assuming'               },
      { name: 'Action Scaffold',     function: 'Translate speculative thinking into a concrete first step'        },
    ],
    worksheets: [
      { title: 'Decision Journal',       pages: 1, desc: 'Document reasoning, uncertainty bounds, and commitments.' },
      { title: 'Commitment Contract',    pages: 1, desc: 'Commit to a position with your uncertainty documented.' },
      { title: 'Uncertainty Ledger',     pages: 1, desc: 'Separate what you know from what you are assuming.' },
      { title: 'Action Scaffold',        pages: 1, desc: 'Translate speculative thinking into a concrete first step.' },
      { title: 'Stance Statement',       pages: 1, desc: 'Write a clear position with supporting and qualifying claims.' },
      { title: 'Evidence Register',      pages: 2, desc: 'Log the evidence for and against your current position.' },
      { title: 'Risk & Resolve',         pages: 1, desc: 'Name the risks of committing and the cost of not committing.' },
      { title: 'Next Step Map',          pages: 1, desc: 'Translate a decision into a mapped sequence of next steps.' },
    ],
  },
];

const worksheetKits = [
  {
    title: 'TARK Starter Kit',
    desc: 'One worksheet per move, an introductory set for first-time use. Designed as a five-session classroom arc.',
    contents: '5 worksheets · one per move',
    tag: 'Introductory',
    color: '#FFD167',
    textOnColor: '#1A1A1A',
  },
  {
    title: 'Inquiry Sprint Kit',
    desc: 'A focused 3-session set combining OPEN, TRACE, and COMMIT for condensed inquiry units.',
    contents: '6 worksheets · 3 moves',
    tag: 'Condensed',
    color: '#465BA4',
    textOnColor: '#FFFFFF',
  },
  {
    title: 'Classroom Full Set',
    desc: 'All 40 worksheets plus facilitation notes, learning objectives, and a sequencing guide for educators.',
    contents: '40 worksheets · full facilitation guide',
    tag: 'Complete',
    color: '#4DB49F',
    textOnColor: '#FFFFFF',
  },
];

type Tab = 'toolkit' | 'worksheets' | 'games';

/* ─── Tool card ───────────────────────────────────────────── */
function ToolCard({ name, fn, color, onTap }: { name: string; fn: string; color: string; onTap: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onTap}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className="w-full text-left"
      style={{
        position: 'relative',
        backgroundColor: BG,
        borderTop: `1.5px solid ${hovered ? color : BORDER}`,
        borderRight: `1.5px solid ${hovered ? color : BORDER}`,
        borderBottom: `1.5px solid ${hovered ? color : BORDER}`,
        borderLeft: `3px solid ${color}`,
        padding: '20px 20px 20px 16px',
        cursor: 'pointer',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s',
        boxShadow: hovered ? `0 4px 0 0 ${color}` : 'none',
        transform: pressed ? 'scale(0.98) translateY(0)' : hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          color: TEXT,
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          color: TEXT2,
          fontSize: '13px',
          lineHeight: 1.5,
          marginBottom: '16px',
        }}
      >
        {fn}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          color: color === '#FFD167' ? '#1A1A1A' : '#FFFFFF',
          backgroundColor: color,
          fontSize: '7.5px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          display: 'inline-block',
        }}
      >
        Releasing soon
      </span>
    </button>
  );
}

/* ─── Worksheet group (8 items per move) ─────────────────── */
function WorksheetGroup({ move, onTap }: { move: typeof moves[0]; onTap: () => void }) {
  const [open, setOpen] = useState(false);
  const textOnColor = move.color === '#FFD167' ? '#1A1A1A' : '#FFFFFF';

  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <MoveIcon move={move.key} size={24} variant="color" />
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: move.color,
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {move.key}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: MUTED,
                fontSize: '9px',
                letterSpacing: '0.1em',
                marginLeft: '14px',
              }}
            >
              8 worksheets
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              color: MUTED,
              fontSize: '12px',
              display: 'none',
            }}
            className="md:block"
          >
            {move.description}
          </span>
          <span
            style={{
              color: open ? move.color : MUTED,
              fontSize: '18px',
              fontFamily: 'var(--font-mono)',
              transition: 'color 0.15s, transform 0.2s',
              display: 'block',
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          >
            +
          </span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              style={{ paddingBottom: '24px', gap: '2px' }}
            >
              {move.worksheets.map((ws) => (
                <button
                  key={ws.title}
                  onClick={onTap}
                  className="w-full text-left"
                  style={{
                    backgroundColor: BG_ALT,
                    border: `1.5px solid ${BORDER}`,
                    borderTop: `3px solid ${move.color}`,
                    padding: '16px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = move.color;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 0 0 ${move.color}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = BORDER;
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.borderTopColor = move.color;
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: TEXT,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    {ws.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: TEXT2,
                      fontSize: '11px',
                      lineHeight: 1.5,
                      marginBottom: '12px',
                    }}
                  >
                    {ws.desc}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: MUTED,
                        fontSize: '8px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {ws.pages}p · A4 · PDF
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: move.color === '#FFD167' ? '#1A1A1A' : '#FFFFFF',
                        backgroundColor: move.color,
                        fontSize: '7px',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        fontWeight: 600,
                      }}
                    >
                      Soon
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Worksheet kit card ──────────────────────────────────── */
function KitCard({ kit, onTap }: { kit: typeof worksheetKits[0]; onTap: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onTap}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left"
      style={{
        backgroundColor: hovered ? kit.color : BG,
        borderTop: `3px solid ${kit.color}`,
        borderRight: `1.5px solid ${hovered ? kit.color : BORDER}`,
        borderBottom: `1.5px solid ${hovered ? kit.color : BORDER}`,
        borderLeft: `1.5px solid ${hovered ? kit.color : BORDER}`,
        padding: 'clamp(20px, 3vw, 28px)',
        cursor: 'pointer',
        outline: 'none',
        transition: 'background-color 0.18s, border-color 0.18s, box-shadow 0.15s',
        boxShadow: hovered ? `0 4px 0 0 ${kit.color}` : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '14px',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            color: hovered ? kit.textOnColor : kit.color,
            fontSize: '7.5px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
            border: `1px solid ${hovered ? 'transparent' : kit.color}`,
            padding: '4px 10px',
            flexShrink: 0,
          }}
        >
          {kit.tag}
        </span>
        <Download size={13} style={{ color: hovered ? kit.textOnColor : MUTED, flexShrink: 0, marginTop: '2px' }} />
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          color: hovered ? kit.textOnColor : TEXT,
          fontSize: 'clamp(16px, 2vw, 22px)',
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: '10px',
          transition: 'color 0.15s',
        }}
      >
        {kit.title}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          color: hovered ? (kit.textOnColor === '#1A1A1A' ? 'rgba(17,17,17,0.75)' : 'rgba(255,255,255,0.8)') : TEXT2,
          fontSize: '13px',
          lineHeight: 1.6,
          marginBottom: '16px',
          transition: 'color 0.15s',
        }}
      >
        {kit.desc}
      </p>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          color: hovered ? (kit.textOnColor === '#1A1A1A' ? 'rgba(17,17,17,0.6)' : 'rgba(255,255,255,0.6)') : MUTED,
          fontSize: '8px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 600,
          transition: 'color 0.15s',
        }}
      >
        {kit.contents}
      </div>
    </button>
  );
}

/* ─── Games tab ───────────────────────────────────────────── */
function GamesTab() {
  const cards = [
    {
      id: 'physical',
      label: 'Physical Game',
      subtitle: 'WHAT IF? Card Game',
      icon: Layers,
      tagline: 'Cards & print-and-play',
      description: 'A physical card game and board game format that brings the five moves to life in classroom, workshop, and home settings. Each card carries a move, a challenge, and a reflection prompt.',
      formats: ['Card deck', 'Board game', 'Print-and-play', 'Workshop set'],
      bg: '#1A1A1A',
      textColor: '#FFFFFF',
    },
    {
      id: 'digital',
      label: 'Digital Game',
      subtitle: 'Browser-based',
      icon: Monitor,
      tagline: 'Browser-based & app',
      description: 'Interactive reasoning challenges built around the TARK moves. Players navigate cognitive scenarios, earn move tokens, and build critical thinking fluency through play.',
      formats: ['Browser game', 'Classroom mode', 'Solo play', 'Multiplayer'],
      bg: '#F5F4F1',
      textColor: '#1A1A1A',
    },
  ];

  return (
    <motion.div
      key="games"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2px' }}>
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <FadeIn key={card.id} delay={i * 0.08}>
              <div
                style={{
                  backgroundColor: card.bg,
                  overflow: 'hidden',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 'clamp(28px, 4vw, 48px)',
                }}
              >
                {/* Status badge */}
                <div style={{ marginBottom: '28px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: card.textColor,
                      fontSize: '7.5px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      border: `1px solid ${card.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : 'rgba(17,17,17,0.3)'}`,
                      padding: '5px 12px',
                    }}
                  >
                    In Development
                  </span>
                </div>

                {/* Five diamonds row */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {(['OPEN', 'TRACE', 'SHIFT', 'SURFACE', 'COMMIT'] as MoveKey[]).map((m) => (
                    <MoveIcon key={m} move={m} size={24} variant={card.bg === '#1A1A1A' ? 'color' : 'color'} />
                  ))}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: card.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : MUTED,
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  {card.tagline}
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: card.textColor,
                    fontSize: 'clamp(24px, 3.5vw, 40px)',
                    fontWeight: 700,
                    lineHeight: 1.0,
                    marginBottom: '16px',
                  }}
                >
                  {card.label}
                </h2>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: card.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.7)' : TEXT2,
                    fontSize: '14px',
                    lineHeight: 1.7,
                    marginBottom: '28px',
                    maxWidth: '420px',
                    flex: 1,
                  }}
                >
                  {card.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {card.formats.map((fmt) => (
                    <span
                      key={fmt}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: card.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : MUTED,
                        fontSize: '8px',
                        letterSpacing: '0.1em',
                        border: `1px solid ${card.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : BORDER}`,
                        padding: '4px 10px',
                        fontWeight: 600,
                      }}
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.18}>
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: '24px',
            marginTop: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '5px',
              height: '5px',
              border: `1px solid ${BORDER}`,
              transform: 'rotate(45deg)',
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              color: MUTED,
              fontSize: '8.5px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Digital and physical games in development, designed for ages 15-22
          </p>
        </div>
      </FadeIn>
    </motion.div>
  );
}

/* ─── Modal ───────────────────────────────────────────────── */
function SoonModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full"
        style={{
          backgroundColor: '#FFFFFF',
          border: `1.5px solid ${BORDER_STR}`,
          borderBottom: 'none',
          padding: 'clamp(28px, 5vw, 44px) clamp(20px, 5vw, 40px)',
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            color: MUTED,
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: '16px',
          }}
        >
          Tools in progress
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            color: TEXT,
            fontSize: 'clamp(22px, 4vw, 34px)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '12px',
          }}
        >
          These will be available soon.
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: TEXT2,
            fontSize: '14px',
            lineHeight: 1.65,
            marginBottom: '28px',
            maxWidth: '480px',
          }}
        >
          The full toolkit and worksheets are in development. Each is designed around a specific cognitive move, built for classroom use with students aged 15–22.
        </p>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            color: TEXT2,
            border: `1.5px solid ${BORDER}`,
            padding: '12px 22px',
            fontSize: '20px',
            letterSpacing: '0',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            minHeight: '44px',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#1A1A1A';
            (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = TEXT2;
          }}
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Tab bar ─────────────────────────────────────────────── */
function TabBar({ active, onChange, activeColor }: { active: Tab; onChange: (t: Tab) => void; activeColor: string }) {
  const tabs: { id: Tab; label: string; count: string; move: MoveKey }[] = [
    { id: 'toolkit',    label: 'Toolkit',    count: '20 tools',  move: 'OPEN'   },
    { id: 'worksheets', label: 'Worksheets', count: '40 sheets', move: 'TRACE'  },
    { id: 'games',      label: 'Games',      count: '2 formats', move: 'COMMIT' },
  ];

  return (
    <div style={{ display: 'flex', backgroundColor: BG_ALT, marginBottom: '48px' }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const tabMove = moves.find(m => m.key === tab.move);
        const tabColor = tabMove?.color || '#1A1A1A';
        const textColor = tabColor === '#FFD167' ? '#1A1A1A' : '#FFFFFF';

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 20px',
              background: isActive ? tabColor : 'none',
              border: 'none',
              borderRight: `1.5px solid ${BORDER}`,
              cursor: 'pointer',
              outline: 'none',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = `${tabColor}15`;
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'none';
            }}
          >
            {isActive && (
              <MoveIcon move={tab.move} size={16} variant={isActive ? 'white' : 'color'} />
            )}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: isActive ? textColor : TEXT2,
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: isActive ? (textColor === '#1A1A1A' ? 'rgba(17,17,17,0.6)' : 'rgba(255,255,255,0.6)') : MUTED,
                fontSize: '8.5px',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────── */
export function ToolsForPractice() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('toolkit');

  const headings: Record<Tab, string> = { toolkit: 'Toolkit', worksheets: 'Worksheets', games: 'Games' };
  const subtitles: Record<Tab, string> = {
    toolkit:    '20 structured tools across the five cognitive moves, designed for classroom facilitation.',
    worksheets: '40 printable worksheets, 8 per move, and integrated kits for multi-session use.',
    games:      'Digital and physical game formats bringing the TARK moves into play.',
  };

  return (
    <section id="tools" className="py-16 md:py-28 px-6 md:px-16" style={{ backgroundColor: BG, minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: MUTED,
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '18px',
            }}
          >
            Tools for Practice
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-4">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: TEXT,
                fontSize: 'clamp(28px, 5vw, 64px)',
                fontWeight: 700,
                lineHeight: 1.0,
              }}
            >
              {headings[activeTab]}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: TEXT2,
                fontSize: '14px',
                maxWidth: '320px',
                lineHeight: 1.65,
              }}
            >
              {subtitles[activeTab]}
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.04}>
          <TabBar active={activeTab} onChange={setActiveTab} activeColor="#1A1A1A" />
        </FadeIn>
        <AnimatePresence mode="wait">
          {activeTab === 'toolkit' && <ToolkitContent key="toolkit" onModal={() => setModalOpen(true)} />}
          {activeTab === 'worksheets' && <WorksheetsContent key="worksheets" onModal={() => setModalOpen(true)} />}
          {activeTab === 'games' && <GamesContent key="games" />}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {modalOpen && <SoonModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

/* ─── Standalone page sections ────────────────────────────── */
export function ToolkitSection() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      {/* Colored header — SURFACE teal */}
      <div className="pt-24 pb-14 px-6 md:px-16" style={{ backgroundColor: '#4DB49F' }}>
        <div className="max-w-6xl mx-auto">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            Tools for Practice
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              fontSize: 'clamp(40px, 7vw, 96px)',
              fontWeight: 700,
              lineHeight: 1.0,
              marginBottom: '16px',
            }}
          >
            Toolkit
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 'clamp(14px, 1.6vw, 17px)',
              lineHeight: 1.65,
              maxWidth: '480px',
            }}
          >
            20 structured tools across the five cognitive moves, designed for classroom facilitation.
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 px-6 md:px-16" style={{ backgroundColor: BG, minHeight: '60vh' }}>
        <div className="max-w-6xl mx-auto">
          <ToolkitContent onModal={() => setModalOpen(true)} />
        </div>
        <AnimatePresence>{modalOpen && <SoonModal onClose={() => setModalOpen(false)} />}</AnimatePresence>
      </section>
    </>
  );
}

export function WorksheetsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      {/* Colored header — SURFACE teal */}
      <div className="pt-24 pb-14 px-6 md:px-16" style={{ backgroundColor: '#4DB49F' }}>
        <div className="max-w-6xl mx-auto">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            Tools for Practice
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              fontSize: 'clamp(40px, 7vw, 96px)',
              fontWeight: 700,
              lineHeight: 1.0,
              marginBottom: '16px',
            }}
          >
            Worksheets
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 'clamp(14px, 1.6vw, 17px)',
              lineHeight: 1.65,
              maxWidth: '480px',
            }}
          >
            40 printable worksheets, 8 per move, and integrated kits for multi-session use.
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 px-6 md:px-16" style={{ backgroundColor: BG, minHeight: '60vh' }}>
        <div className="max-w-6xl mx-auto">
          <WorksheetsContent onModal={() => setModalOpen(true)} />
        </div>
        <AnimatePresence>{modalOpen && <SoonModal onClose={() => setModalOpen(false)} />}</AnimatePresence>
      </section>
    </>
  );
}

export function GamesSection() {
  return (
    <>
      {/* Colored header — COMMIT red */}
      <div className="pt-24 pb-14 px-6 md:px-16" style={{ backgroundColor: '#DA3832' }}>
        <div className="max-w-6xl mx-auto">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            Physical + Digital
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              fontSize: 'clamp(40px, 7vw, 96px)',
              fontWeight: 700,
              lineHeight: 1.0,
              marginBottom: '16px',
            }}
          >
            Games
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 'clamp(14px, 1.6vw, 17px)',
              lineHeight: 1.65,
              maxWidth: '480px',
            }}
          >
            Digital and physical game formats bringing the TARK moves into play.
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 px-6 md:px-16" style={{ backgroundColor: BG, minHeight: '60vh' }}>
        <div className="max-w-6xl mx-auto">
          <GamesContent />
        </div>
      </section>
    </>
  );
}

/* ─── Content sections ────────────────────────────────────── */
function ToolkitContent({ onModal }: { onModal: () => void }) {
  return (
    <motion.div
      key="toolkit"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {moves.map((move, gi) => (
        <FadeIn key={move.key} delay={gi * 0.04}>
          <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                marginBottom: '16px',
                paddingBottom: '14px',
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <MoveIcon move={move.key} size={24} variant="color" />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: move.color,
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: '5px',
                  }}
                >
                  {move.key}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: TEXT2,
                    fontSize: '13px',
                    lineHeight: 1.45,
                    maxWidth: '480px',
                  }}
                >
                  {move.description}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '2px' }}>
              {move.tools.map((tool) => (
                <ToolCard key={tool.name} name={tool.name} fn={tool.function} color={move.color} onTap={onModal} />
              ))}
            </div>
          </div>
        </FadeIn>
      ))}
      <FadeIn delay={0.22}>
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ width: '5px', height: '5px', border: `1px solid ${BORDER}`, transform: 'rotate(45deg)', flexShrink: 0 }} />
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              color: MUTED,
              fontSize: '8.5px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            20 tools, 5 moves, a system that exists, not yet unlocked
          </p>
        </div>
      </FadeIn>
    </motion.div>
  );
}

function WorksheetsContent({ onModal }: { onModal: () => void }) {
  return (
    <motion.div
      key="worksheets"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <div style={{ marginBottom: '60px' }}>
        {moves.map((move, i) => (
          <FadeIn key={move.key} delay={i * 0.04}>
            <WorksheetGroup move={move} onTap={onModal} />
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#1A1A1A',
                transform: 'rotate(45deg)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#1A1A1A',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Worksheet Kits
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: MUTED,
                fontSize: '8.5px',
                letterSpacing: '0.1em',
              }}
            >
              · All moves integrated
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '2px' }}>
            {worksheetKits.map((kit, i) => (
              <FadeIn key={kit.title} delay={i * 0.06}>
                <KitCard kit={kit} onTap={onModal} />
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            paddingTop: '24px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ width: '5px', height: '5px', border: `1px solid ${BORDER}`, transform: 'rotate(45deg)', flexShrink: 0 }} />
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              color: MUTED,
              fontSize: '8.5px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            40 worksheets · 3 kits · print-ready PDFs · releasing soon
          </p>
        </div>
      </FadeIn>
    </motion.div>
  );
}

function GamesContent() {
  return <GamesTab />;
}
