import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { getToolBySlug, getNextTool, toolsData } from '../data/tools';
import { PageFooter } from '../components/PageFooter';
import { useIsMobile } from '../hooks/useIsMobile';

const BORDER = '#E0E0E0';

function CopyButton({ text, color, textColor }: { text: string; color: string; textColor: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 600,
        backgroundColor: copied ? color : 'transparent',
        color: copied ? textColor : color,
        border: `1.5px solid ${color}`,
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, color 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? '✓ Copied' : 'Copy Prompt'}
    </button>
  );
}

function StepCard({ step, index, color, textColor }: { step: string; index: number; color: string; textColor: string }) {
  const [hovered, setHovered] = useState(false);
  const isYellow = color === '#FFD167';
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '20px',
        padding: '26px 24px',
        backgroundColor: hovered ? color : '#FFFFFF',
        borderTop: `1px solid ${BORDER}`,
        transition: 'background-color 0.3s cubic-bezier(0.22,1,0.36,1)',
        cursor: 'default',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '11px',
        letterSpacing: '0.18em',
        fontWeight: 700,
        color: hovered ? (isYellow ? 'rgba(26,26,26,0.5)' : 'rgba(255,255,255,0.5)') : '#999999',
        flexShrink: 0,
        marginTop: '2px',
        transition: 'color 0.2s',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        lineHeight: 1.6,
        color: hovered ? (isYellow ? '#1A1A1A' : '#FFFFFF') : '#1A1A1A',
        transition: 'color 0.2s',
      }}>
        {step}
      </div>
    </div>
  );
}

export function ToolDetailPage() {
  const { move: moveParam, toolSlug } = useParams<{ move: string; toolSlug: string }>();
  const result = getToolBySlug(moveParam || '', toolSlug || '');
  const nextResult = getNextTool(moveParam || '', toolSlug || '');
  const isMobile = useIsMobile();

  if (!result) {
    return (
      <div style={{ paddingTop: '120px', paddingLeft: 'clamp(24px, 6vw, 96px)', paddingRight: 'clamp(24px, 6vw, 96px)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, color: '#1A1A1A' }}>Tool not found.</div>
        <Link to="/toolkit" style={{ fontFamily: 'var(--font-display)', color: '#555555', fontSize: '13px', textDecoration: 'none', letterSpacing: '0.1em' }}>← Back to Toolkit</Link>
      </div>
    );
  }

  const { move, tool } = result;
  const toolIndex = move.tools.findIndex((t) => t.slug === tool.slug);
  const letter = String.fromCharCode(65 + toolIndex);
  const isYellow = move.color === '#FFD167';

  return (
    <>
      {/* Hero */}
      <section
        data-move={move.key}
        style={{ backgroundColor: move.color, paddingTop: '64px', position: 'relative', overflow: 'hidden', minHeight: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
      >
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          fontFamily: 'var(--font-display)',
          fontSize: '320px',
          fontWeight: 700,
          color: isYellow ? 'rgba(26,26,26,0.06)' : 'rgba(255,255,255,0.08)',
          lineHeight: 1,
          display: 'flex', alignItems: 'center',
          userSelect: 'none',
          paddingRight: '40px',
        }}>
          {letter}
        </div>

        <div style={{ position: 'relative', padding: 'clamp(24px, 4vw, 64px) clamp(24px, 6vw, 96px)', paddingTop: '96px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <Link to="/toolkit" style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: isYellow ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Toolkit</Link>
            <span style={{ color: isYellow ? 'rgba(26,26,26,0.4)' : 'rgba(255,255,255,0.4)', fontSize: '10px' }}>·</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: isYellow ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.6)' }}>{move.key}</span>
            <span style={{ color: isYellow ? 'rgba(26,26,26,0.4)' : 'rgba(255,255,255,0.4)', fontSize: '10px' }}>·</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: isYellow ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.6)' }}>Tool {String(toolIndex + 1).padStart(2, '0')}</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 80px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: isYellow ? '#1A1A1A' : '#FFFFFF',
            marginBottom: '16px',
          }}>
            {tool.name}
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            color: isYellow ? 'rgba(26,26,26,0.7)' : 'rgba(255,255,255,0.75)',
            lineHeight: 1.5,
            maxWidth: '560px',
          }}>
            {tool.tagline}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '40px', paddingTop: '24px', borderTop: `1px solid ${isYellow ? 'rgba(26,26,26,0.15)' : 'rgba(255,255,255,0.2)'}` }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '8.5px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, color: isYellow ? 'rgba(26,26,26,0.5)' : 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Thinking Partner</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: isYellow ? '#1A1A1A' : '#FFFFFF', fontWeight: 600 }}>{tool.thinkingPartner}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '8.5px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, color: isYellow ? 'rgba(26,26,26,0.5)' : 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Audience</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {tool.audience.map((a, i) => (
                  <span key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: isYellow ? '#1A1A1A' : '#FFFFFF', fontWeight: 600, backgroundColor: isYellow ? 'rgba(26,26,26,0.1)' : 'rgba(255,255,255,0.15)', padding: '3px 10px' }}>{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download strip */}
      <section style={{ backgroundColor: isYellow ? 'rgba(255,209,103,0.15)' : 'rgba(26,26,26,0.04)', borderBottom: '1px solid #E0E0E0' }}>
        <div style={{ padding: '16px clamp(24px, 6vw, 96px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: '#999999' }}>
            Download the PDF worksheet for this tool
          </div>
          <a
            href={tool.driveUrl || 'https://drive.google.com/drive/folders/1ivpEmL7nj3No2GXXrpZAo_Qk70TGEpxL'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, backgroundColor: move.color, color: isYellow ? '#1A1A1A' : '#FFFFFF', padding: '10px 22px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            Download PDF →
          </a>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '64px', alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', marginBottom: '16px' }}>What this tool does</div>
            {/* Plain-language pull-quote */}
            {tool.plainDescription && (
              <div style={{ borderLeft: `6px solid ${move.color}`, paddingLeft: '24px', marginBottom: '28px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, fontStyle: 'italic', color: '#1A1A1A', lineHeight: 1.35, margin: 0 }}>
                  "{tool.plainDescription}"
                </p>
              </div>
            )}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: '#1A1A1A', lineHeight: 1.7 }}>{tool.description}</p>
          </div>

          <div style={{ backgroundColor: '#F5F4F1', padding: '32px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', marginBottom: '16px' }}>Move</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: 16, height: 16, backgroundColor: move.color, transform: 'rotate(45deg)', flexShrink: 0 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>{move.key}</div>
              <div style={{ fontFamily: 'var(--font-display)', color: '#555555', fontSize: '12px' }}>- {move.hindi}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#555555', lineHeight: 1.6, marginBottom: '20px' }}>{move.tagline}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', marginBottom: '10px' }}>Other tools in this move</div>
            {move.tools.filter((t) => t.slug !== tool.slug).map((t) => (
              <Link
                key={t.slug}
                to={`/toolkit/${move.key.toLowerCase()}/${t.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: `1px solid ${BORDER}`, textDecoration: 'none' }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600, color: '#999999', minWidth: '40px' }}>{String(move.tools.findIndex(x => x.slug === t.slug) + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#1A1A1A' }}>{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '0 clamp(24px, 6vw, 96px) clamp(48px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, color: '#999999' }}>How to run it</div>
            <div style={{ flex: 1, height: '1px', backgroundColor: BORDER }} />
          </div>
          <div style={{ borderBottom: `1px solid ${BORDER}` }}>
            {tool.howToUse.map((step, i) => (
              <StepCard key={i} step={step} index={i} color={move.color} textColor={move.textColor} />
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section style={{ backgroundColor: '#F5F4F1', padding: '0 clamp(24px, 6vw, 96px) clamp(48px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: 'clamp(48px, 6vw, 80px)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '28px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, color: '#999999' }}>In Practice</div>
            <div style={{ flex: 1, height: '1px', backgroundColor: BORDER }} />
          </div>
          <div style={{ borderLeft: `4px solid ${move.color}`, paddingLeft: '24px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', marginBottom: '12px' }}>Example</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: '#1A1A1A', lineHeight: 1.7 }}>{tool.example}</p>
          </div>
        </div>
      </section>

      {/* Thinking Partner Prompt */}
      <section style={{ backgroundColor: 'var(--tk-navy)', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, color: '#555555', marginBottom: '8px' }}>Thinking Partner</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                Thinking Partner: <span style={{ color: move.color }}>{tool.thinkingPartner}</span>
              </div>
            </div>
            <CopyButton text={tool.tpPrompt} color={move.color} textColor={move.textColor} />
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: 1.75,
            color: '#CCCCCC',
            backgroundColor: 'rgba(255,255,255,0.04)',
            padding: '28px',
            borderLeft: `3px solid ${move.color}`,
            whiteSpace: 'pre-wrap',
          }}>
            {tool.tpPrompt}
          </div>
          <div style={{ marginTop: '20px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            Paste this prompt into the{' '}
            <a href="https://chatgpt.com/g/g-69e25c86db488191824d86bf3399227f-trk-thinking-partner" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.75)' }}>TARK GPT</a>
            {' '}or the{' '}
            <a href="https://gemini.google.com/gem/1O2CGR8VO65PPOBuctSwskGO7RyGUsucZ?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.75)' }}>TARK Gem</a>.
            Replace the text in [SQUARE BRACKETS] with your actual content before running.
          </div>
        </div>
      </section>

      {/* Next tool */}
      {nextResult && (
        <section style={{ padding: 'clamp(32px, 4vw, 48px) clamp(24px, 6vw, 96px)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', marginBottom: '16px' }}>Next Tool</div>
            <Link
              to={`/toolkit/${nextResult.move.key.toLowerCase()}/${nextResult.tool.slug}`}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px', border: '1px solid #1A1A1A', gap: '16px', transition: 'background-color 0.25s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F4F1'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 12, height: 12, backgroundColor: nextResult.move.color, transform: 'rotate(45deg)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', marginBottom: '4px' }}>{nextResult.move.key} · {nextResult.move.tools.findIndex(t => t.slug === nextResult.tool.slug) + 1}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>{nextResult.tool.name}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', color: '#1A1A1A', fontSize: '20px', flexShrink: 0 }}>→</div>
            </Link>
          </div>
        </section>
      )}

      {/* All moves strip */}
      <section style={{ padding: '0 clamp(24px, 6vw, 96px) clamp(48px, 6vw, 80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', marginBottom: '16px' }}>All Moves</div>
          <div style={{ display: 'flex', gap: '2px' }}>
            {toolsData.map((m) => (
              <Link
                key={m.key}
                to={`/toolkit/${m.key.toLowerCase()}/${m.tools[0].slug}`}
                style={{ flex: 1, backgroundColor: m.key === move.key ? m.color : '#F5F4F1', padding: '16px 12px', textDecoration: 'none', textAlign: 'center', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = m.color; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = m.key === move.key ? m.color : '#F5F4F1'; }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: m.key === move.key ? (m.color === '#FFD167' ? '#1A1A1A' : '#FFFFFF') : '#1A1A1A' }}>{m.key}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </>
  );
}
