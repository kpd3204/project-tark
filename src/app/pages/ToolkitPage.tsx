import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { toolsData } from '../data/tools';
import { PageFooter } from '../components/PageFooter';
import { useIsMobile } from '../hooks/useIsMobile';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { EASE, Reveal, LineReveal, Diamond, MOVE_TEXT } from '../components/kit';

type MoveData = typeof toolsData[0];
type Tool     = MoveData['tools'][0];

const FALLBACK_URL = 'https://drive.google.com/drive/folders/1ivpEmL7nj3No2GXXrpZAo_Qk70TGEpxL';

/* ── Tool card ───────────────────────────────────────────────── */
function ToolCard({ tool, move, index }: { tool: Tool; move: MoveData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const moveSlug = move.key.toLowerCase();
  const accent = MOVE_TEXT[move.key] ?? move.color;

  return (
    <Reveal delay={(index % 3) * 0.06} y={20} style={{ height: '100%' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          height: '100%',
          padding: 'clamp(24px, 2.4vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          overflow: 'hidden',
          isolation: 'isolate',
          outline: '1px solid var(--tk-border)',
        }}
      >
        {/* Hover wash */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0, backgroundColor: `${move.color}0D`, zIndex: -1 }}
        />
        {/* Top accent draws in */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: move.color, transformOrigin: 'left' }}
        />

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: '#BBBBBB' }}>
            {move.key} · {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{ display: 'block', width: 20, height: 20, opacity: hovered ? 1 : 0.65, transition: 'opacity 0.3s' }}>
            <MoveIcon move={move.key as MoveKey} size={20} variant="color" />
          </span>
        </div>

        {/* Name + tagline */}
        <div style={{ flex: 1 }}>
          <Link to={`/toolkit/${moveSlug}/${tool.slug}`} style={{ textDecoration: 'none' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(19px, 1.8vw, 24px)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.015em',
                color: hovered ? accent : '#1A1A1A',
                margin: 0,
                marginBottom: 10,
                transition: 'color 0.25s',
              }}
            >
              {tool.name}
            </h3>
          </Link>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#555555', lineHeight: 1.6, margin: 0 }}>
            {tool.tagline}
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tool.audience.map((a, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', border: '1px solid var(--tk-border)', padding: '4px 9px' }}>
              {a}
            </span>
          ))}
          {tool.thinkingPartner === 'YES' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: accent, border: `1px solid ${move.color}66`, padding: '4px 9px' }}>
              ◆ AI Partner
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--tk-border)' }}>
          <Link to={`/toolkit/${moveSlug}/${tool.slug}`} className="tk-arrow-link" style={{ fontSize: 10 }}>
            <span>Details</span>
            <span className="arr">→</span>
          </Link>
          <a
            href={tool.driveUrl || FALLBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tk-arrow-link"
            style={{ fontSize: 10, color: accent }}
          >
            <span>PDF</span>
            <span className="arr">↓</span>
          </a>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Move divider ────────────────────────────────────────────── */
function MoveDivider({ move }: { move: MoveData }) {
  return (
    <Reveal y={16}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 'clamp(40px, 5vw, 64px) 0 clamp(20px, 2.5vw, 28px)' }}>
        <MoveIcon move={move.key as MoveKey} size={26} variant="color" />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.6vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1A1A' }}>{move.key}</span>
          <span style={{ fontFamily: 'var(--font-devanagari)', fontSize: 15, fontWeight: 700, color: '#999999' }}>{move.hindi}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#999999' }}>{move.tagline}</span>
        </div>
        <div className="tk-rule-x" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#BBBBBB', whiteSpace: 'nowrap' }}>
          {move.tools.length} tools
        </span>
      </div>
    </Reveal>
  );
}

/* ── Filter tab ──────────────────────────────────────────────── */
function FilterBtn({ label, isActive, moveColor, moveKey, onClick }: { label: string; isActive: boolean; moveColor: string; moveKey?: MoveKey; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        letterSpacing: '0.16em',
        fontWeight: 600,
        textTransform: 'uppercase',
        padding: '18px 18px 15px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        color: isActive || hovered ? '#1A1A1A' : '#999999',
        transition: 'color 0.25s',
        whiteSpace: 'nowrap',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {moveKey && (
        <span style={{ opacity: isActive || hovered ? 1 : 0.45, transition: 'opacity 0.25s' }}>
          <MoveIcon move={moveKey} size={13} variant="color" />
        </span>
      )}
      {label}
      <motion.div
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: moveColor, transformOrigin: 'left' }}
      />
    </button>
  );
}

export function ToolkitPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramMove = (searchParams.get('move') || '').toUpperCase();
  const validMove = toolsData.some((m) => m.key === paramMove) ? paramMove : 'ALL';
  const [filter, setFilter] = useState<string>(validMove);
  const isMobile = useIsMobile();

  useEffect(() => { setFilter(validMove); }, [validMove]);

  const applyFilter = (key: string) => {
    setFilter(key);
    setSearchParams(key === 'ALL' ? {} : { move: key }, { replace: true });
  };

  const filteredMoves = filter === 'ALL' ? toolsData : toolsData.filter((m) => m.key === filter);
  const totalTools = toolsData.reduce((n, m) => n + m.tools.length, 0);

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="tk-grain" style={{ backgroundColor: '#1A1A1A', paddingTop: 'clamp(128px, 18vh, 192px)', paddingBottom: 'clamp(48px, 6vw, 88px)' }}>
        <div className="tk-wrap">
          <Reveal y={16}>
            <div className="tk-eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
              The Toolkit · {totalTools} thinking tools
            </div>
          </Reveal>
          <LineReveal
            as="h1"
            className="tk-hero-h"
            color="#FFFFFF"
            lines={[
              <span key="a" className="tk-light" style={{ color: 'rgba(255,255,255,0.75)' }}>Pick any tool.</span>,
              'Start anywhere.',
            ]}
            delay={0.1}
          />
          <Reveal delay={0.35}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-lede)', lineHeight: 1.7, maxWidth: '46ch', margin: 'clamp(28px, 3.5vw, 44px) 0 0' }}>
              Every tool is a one-page structure for a specific kind of stuck.
              Each one is printable, free, and works with the AI Thinking Partner.
            </p>
          </Reveal>
        </div>
      </header>

      {/* ── STICKY FILTER ───────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 20,
          borderBottom: '1px solid var(--tk-border)',
        }}
      >
        <div className="tk-wrap" style={{ display: 'flex', overflowX: 'auto', gap: 4 }} >
          {['ALL', ...toolsData.map((m) => m.key)].map((key) => {
            const moveColor = key === 'ALL' ? '#1A1A1A' : (toolsData.find((m) => m.key === key)?.color ?? '#1A1A1A');
            return (
              <FilterBtn
                key={key}
                label={key === 'ALL' ? `All · ${totalTools}` : key}
                isActive={filter === key}
                moveColor={moveColor}
                moveKey={key !== 'ALL' ? (key as MoveKey) : undefined}
                onClick={() => applyFilter(key)}
              />
            );
          })}
        </div>
      </div>

      {/* ── TOOLS ───────────────────────────────────────────── */}
      <section style={{ paddingBottom: 'var(--space-block)', backgroundColor: '#F5F4F1' }}>
        <div className="tk-wrap">
          {filteredMoves.map((move) => (
            <div key={move.key}>
              <MoveDivider move={move} />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 1,
                }}
              >
                {move.tools.map((tool, i) => (
                  <ToolCard key={tool.slug} tool={tool} move={move} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--tk-navy)', paddingBlock: 'var(--space-block)' }}>
        <div className="tk-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div className="tk-eyebrow" style={{ color: 'rgba(245,244,241,0.4)', marginBottom: 12 }}>Apply these tools</div>
            <p style={{ fontFamily: 'var(--font-display)', color: '#F5F4F1', fontSize: 'var(--text-title)', fontWeight: 700, lineHeight: 1.05, margin: 0 }}>
              Use them with the Thinking Partner.
            </p>
          </div>
          <Link to="/thinking-partner" className="tk-btn tk-btn--yellow" style={{ padding: '18px 36px' }}>
            Open Thinking Partner →
          </Link>
        </div>
      </section>

      <PageFooter />
    </>
  );
}
