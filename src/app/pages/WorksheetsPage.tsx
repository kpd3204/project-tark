import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { worksheetKits, WorksheetKit } from '../data/worksheetKits';
import { PageFooter } from '../components/PageFooter';
import { useIsMobile } from '../hooks/useIsMobile';
import { EASE, Reveal, LineReveal, SectionHead, Counter } from '../components/kit';

/* ── Notify modal ─────────────────────────────────────────── */
function NotifyModal({ kit, onClose }: { kit: WorksheetKit; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26,26,26,0.65)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: '#FFFFFF', padding: 'clamp(32px, 4vw, 48px)', maxWidth: 480, width: '100%', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ height: 3, backgroundColor: kit.color, position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div className="tk-eyebrow" style={{ marginBottom: 16, marginTop: 4 }}>Coming Soon</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.015em', color: '#1A1A1A', margin: '0 0 14px' }}>
          {kit.title}
        </h3>
        {!sent ? (
          <>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: '#555555', lineHeight: 1.65, margin: '0 0 28px' }}>
              This worksheet kit is being designed. It will be available for download when ready. Leave your email to be notified.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex' }}>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" required
                style={{ flex: 1, minWidth: 0, padding: '13px 16px', border: '1px solid #1A1A1A', borderRight: 'none', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', backgroundColor: '#FFFFFF' }}
              />
              <button type="submit" className="tk-btn tk-btn--ink" style={{ padding: '13px 22px' }}>Notify Me</button>
            </form>
          </>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#2E8A77', fontWeight: 600, margin: 0 }}>
            ✓ You'll be notified when {kit.title} is ready.
          </p>
        )}
        <button
          onClick={onClose}
          style={{ marginTop: 28, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: '#999999', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Close ×
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Kit card ─────────────────────────────────────────────── */
function KitCard({ kit, index }: { kit: WorksheetKit; index: number }) {
  const [hovered, setHovered]     = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isYellow = kit.color === '#FFD167';
  const dim  = isYellow ? 'rgba(26,26,26,0.62)' : 'rgba(255,255,255,0.68)';
  const dimmer = isYellow ? 'rgba(26,26,26,0.45)' : 'rgba(255,255,255,0.45)';

  return (
    <>
      <Reveal delay={(index % 3) * 0.07} style={{ height: '100%' }}>
        <motion.button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setModalOpen(true)}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{
            backgroundColor: kit.color,
            padding: 'clamp(28px, 3vw, 40px)',
            minHeight: 400,
            width: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            cursor: 'pointer',
            position: 'relative',
            textAlign: 'left',
            border: 'none',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Ghost index numeral */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', right: -8, bottom: -32,
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 180, lineHeight: 1, letterSpacing: '-0.05em',
              color: isYellow ? 'rgba(26,26,26,0.06)' : 'rgba(255,255,255,0.08)',
              userSelect: 'none',
              transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
              transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Top */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: dimmer }}>
                Kit {String(index + 1).padStart(2, '0')} · {kit.count} sheets
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: isYellow ? 'rgba(26,26,26,0.7)' : 'rgba(255,255,255,0.85)', border: `1px solid ${isYellow ? 'rgba(26,26,26,0.25)' : 'rgba(255,255,255,0.35)'}`, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                {kit.status === 'available' ? 'Available' : 'Coming Soon'}
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.4vw, 32px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.02em', color: kit.textColor, margin: '0 0 8px' }}>
              {kit.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: dimmer, lineHeight: 1.5, margin: 0 }}>
              {kit.subtitle}
            </p>
          </div>

          {/* Middle */}
          <p style={{ position: 'relative', fontFamily: 'var(--font-body)', fontSize: 15, color: dim, lineHeight: 1.65, margin: '24px 0' }}>
            {kit.description}
          </p>

          {/* Bottom */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {kit.contents.map((item, i) => (
                <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: dim, border: `1px solid ${isYellow ? 'rgba(26,26,26,0.22)' : 'rgba(255,255,255,0.3)'}`, padding: '4px 9px' }}>
                  {item}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: dimmer }}>
                {kit.audience}
              </span>
              <motion.span
                animate={{ x: hovered ? 0 : -6, opacity: hovered ? 1 : 0.5 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: kit.textColor }}
              >
                →
              </motion.span>
            </div>
          </div>
        </motion.button>
      </Reveal>

      <AnimatePresence>
        {modalOpen && <NotifyModal kit={kit} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export function WorksheetsPage() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* ── HEADER — paper, editorial ───────────────────────── */}
      <header style={{ paddingTop: 'clamp(128px, 18vh, 192px)', paddingBottom: 'clamp(40px, 5vw, 72px)' }}>
        <div className="tk-wrap">
          <Reveal y={16}>
            <div className="tk-eyebrow" style={{ marginBottom: 28 }}>
              Worksheets · Six kits · Forty sheets
            </div>
          </Reveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
              gap: 'clamp(24px, 4vw, 64px)',
              alignItems: 'end',
            }}
          >
            <LineReveal
              as="h1"
              className="tk-hero-h"
              lines={[
                <span key="a" className="tk-light" style={{ color: '#6B6B66' }}>Structured</span>,
                'thinking on paper.',
              ]}
              delay={0.1}
            />
            <Reveal delay={0.3}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lede)', color: '#555555', lineHeight: 1.7, maxWidth: '42ch', margin: 0 }}>
                Forty structured worksheets, organised into six kits for different contexts and audiences.
                Each worksheet targets one cognitive move.
              </p>
            </Reveal>
          </div>

          {/* Stat strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              marginTop: 'clamp(40px, 5vw, 72px)',
              borderTop: '1px solid #1A1A1A',
            }}
          >
            {[{ n: 40, label: 'Worksheets total' }, { n: 6, label: 'Context-specific kits' }, { n: 5, label: 'Cognitive moves covered' }].map((stat, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <div style={{ paddingTop: isMobile ? 20 : 32, paddingBottom: isMobile ? 20 : 32, paddingRight: isMobile ? 12 : 32, paddingLeft: i > 0 ? (isMobile ? 12 : 32) : 0, borderRight: i < 2 ? '1px solid var(--tk-border)' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.5vw, 64px)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.025em', color: '#1A1A1A', marginBottom: 8 }}>
                    <Counter target={stat.n} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#999999' }}>
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </header>

      {/* ── KIT GRID ────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F4F1', paddingBlock: 'var(--space-block)' }}>
        <div className="tk-wrap">
          <SectionHead label="Six kits · Click any kit to register interest" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
              gap: 2,
              marginTop: 'clamp(28px, 3.5vw, 48px)',
            }}
          >
            {worksheetKits.map((kit, i) => <KitCard key={kit.id} kit={kit} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── HOW THEY WORK ───────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A1A1A', paddingBlock: 'var(--space-section)' }}>
        <div
          className="tk-wrap"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(240px, 1fr) 1.8fr',
            gap: isMobile ? 40 : 'clamp(48px, 6vw, 96px)',
            alignItems: 'start',
          }}
        >
          <div style={isMobile ? {} : { position: 'sticky', top: 100 }}>
            <Reveal>
              <div className="tk-eyebrow" style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>How they work</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 700, lineHeight: 0.98, letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>
                One move
                <br />
                at a time.
              </h2>
            </Reveal>
          </div>
          <div>
            {[
              { n: '01', title: 'Pick a kit',      body: 'Choose the kit that matches your context — classroom, home, or a specific literacy area.' },
              { n: '02', title: 'Choose a move',   body: "Each kit covers all five TARK moves. Start with OPEN if you're new to the framework." },
              { n: '03', title: 'Run the session', body: 'Worksheets are self-contained. Facilitators get a one-page guide. Students need only a pen.' },
              { n: '04', title: 'Reflect',         body: 'Every worksheet ends with a reflection prompt that surfaces metacognitive awareness.' },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 0.07}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '48px 1fr' : '96px 1fr',
                    gap: 20,
                    padding: 'clamp(24px, 3vw, 40px) 0',
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                    borderTop: i === 0 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: '#FFD167' }}>{step.n}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 1.9vw, 24px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 10, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                      {step.title}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0, maxWidth: '48ch' }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </>
  );
}
