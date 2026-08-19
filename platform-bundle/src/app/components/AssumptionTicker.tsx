import { useState } from 'react';
import { Link } from 'react-router';

const ITEMS = [
  'Hard work always leads to success.',
  'Science is more important than arts.',
  'You should know what you want by 17.',
  'Marks measure intelligence.',
  "There's one right answer.",
  'The teacher always knows best.',
  'Engineering is the safe option.',
  "Failure means you didn't try hard enough.",
  'Success means a stable job.',
  'Reading is less useful than practice.',
];

const Diamond = () => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block',
      width: 5,
      height: 5,
      backgroundColor: '#C9C7C1',
      transform: 'rotate(45deg)',
      margin: '0 28px',
      verticalAlign: 'middle',
      flexShrink: 0,
    }}
  />
);

const tickerContent = ITEMS.flatMap((item) => [item, null]);

export function AssumptionTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      style={{
        height: 54,
        backgroundColor: '#F5F4F1',
        borderTop: '1px solid var(--tk-border)',
        borderBottom: '1px solid var(--tk-border)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left label */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2, display: 'flex', alignItems: 'stretch' }}>
        <div style={{ backgroundColor: '#F5F4F1', paddingInline: 'clamp(16px, 3vw, 28px)', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--tk-border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', whiteSpace: 'nowrap' }}>
            Are these facts?
          </span>
        </div>
        <div style={{ width: 64, background: 'linear-gradient(to right, #F5F4F1, transparent)' }} />
      </div>

      {/* Right label */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 2, display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 64, background: 'linear-gradient(to left, #F5F4F1, transparent)' }} />
        <Link
          to="/speculate"
          style={{
            backgroundColor: '#F5F4F1',
            paddingInline: 'clamp(16px, 3vw, 28px)',
            display: 'flex', alignItems: 'center',
            borderLeft: '1px solid var(--tk-border)',
            textDecoration: 'none',
            transition: 'background-color 0.25s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#1A1A1A';
            const label = e.currentTarget.querySelector('span') as HTMLElement;
            if (label) label.style.color = '#FFD167';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F4F1';
            const label = e.currentTarget.querySelector('span') as HTMLElement;
            if (label) label.style.color = '#999999';
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', whiteSpace: 'nowrap', transition: 'color 0.25s' }}>
            Speculate →
          </span>
        </Link>
      </div>

      {/* Scrolling track */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          animation: 'tk-ticker 64s linear infinite',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {[...tickerContent, ...tickerContent].map((item, i) =>
          item === null ? (
            <Diamond key={i} />
          ) : (
            <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: '#777772' }}>
              {item}
            </span>
          )
        )}
      </div>
    </div>
  );
}
