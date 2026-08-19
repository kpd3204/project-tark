import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PageFooter } from '../components/PageFooter';
import { useIsMobile } from '../hooks/useIsMobile';
import { EASE, Reveal, LineReveal, SectionHead, Diamond, MOVE_COLORS, MOVE_ORDER } from '../components/kit';

export function CaseStudiesPage() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* ── HEADER — OPEN yellow ────────────────────────────── */}
      <header style={{ backgroundColor: '#FFD167', paddingTop: 'clamp(128px, 18vh, 192px)', paddingBottom: 'clamp(48px, 6vw, 88px)' }}>
        <div className="tk-wrap">
          <Reveal y={16}>
            <div className="tk-eyebrow" style={{ color: 'rgba(26,26,26,0.55)', marginBottom: 28 }}>
              Field Work · Deployments of the framework
            </div>
          </Reveal>
          <LineReveal as="h1" className="tk-hero-h" color="#1A1A1A" lines={['Case Studies']} delay={0.1} />
          <Reveal delay={0.25}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(26,26,26,0.68)', fontSize: 'var(--text-lede)', lineHeight: 1.7, maxWidth: '48ch', margin: 'clamp(24px, 3vw, 40px) 0 0' }}>
              Real deployments of the TARK framework: how the five moves have been applied
              across different contexts and organisations.
            </p>
          </Reveal>
        </div>
      </header>

      {/* ── FEATURED CASE ───────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-block)' }}>
        <div className="tk-wrap">
          <SectionHead label="Case Study 01" index="2026 · Brand Strategy" />

          <Reveal delay={0.1}>
            <Link
              to="/case-studies/zenovocare"
              style={{ textDecoration: 'none', display: 'block', marginTop: 'clamp(28px, 3.5vw, 48px)' }}
            >
              <motion.div
                whileHover="hover"
                initial="rest"
                style={{
                  border: '1px solid #1A1A1A',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Top accent */}
                <div style={{ height: 3, backgroundColor: '#E27238' }} />

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
                    gap: 0,
                  }}
                >
                  {/* Left — narrative */}
                  <div style={{ padding: 'clamp(28px, 4vw, 64px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                      <Diamond color="#1A1A1A" size={7} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#1A1A1A' }}>
                        Samvardhan
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: '#999999' }}>
                        · Studio Carbon
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-display)', color: '#1A1A1A', fontSize: 'clamp(32px, 4.5vw, 64px)', fontWeight: 700, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '0 0 10px' }}>
                      ZenovoCare
                    </h2>
                    <div style={{ fontFamily: 'var(--font-body)', color: '#555555', fontSize: 'clamp(15px, 1.5vw, 18px)', marginBottom: 28 }}>
                      Brand Strategy &amp; Future Positioning
                    </div>

                    <p style={{ fontFamily: 'var(--font-body)', color: '#555555', fontSize: 15, lineHeight: 1.75, margin: '0 0 36px', maxWidth: '54ch' }}>
                      The TARK framework was deployed within Samvardhan (a Studio Carbon programme)
                      to guide ZenovoCare through a structured brand strategy process. The five
                      cognitive moves were used to surface assumptions in their current positioning,
                      trace the origins of their market beliefs, and build a more grounded foundation
                      for future direction.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {['Brand Strategy', 'Future Positioning', 'Assumption Surfacing', 'Organisational Thinking'].map((tag) => (
                        <span key={tag} style={{ fontFamily: 'var(--font-mono)', color: '#555555', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid var(--tk-border)', padding: '5px 11px', fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right — moves applied */}
                  <div
                    style={{
                      borderLeft: isMobile ? 'none' : '1px solid var(--tk-border)',
                      borderTop: isMobile ? '1px solid var(--tk-border)' : 'none',
                      padding: 'clamp(28px, 4vw, 64px)',
                      backgroundColor: '#F5F4F1',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 32,
                    }}
                  >
                    <div>
                      <div className="tk-eyebrow" style={{ marginBottom: 20 }}>Moves applied</div>
                      <div>
                        {MOVE_ORDER.map((key, i) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', borderBottom: i < MOVE_ORDER.length - 1 ? '1px solid var(--tk-border)' : 'none' }}>
                            <Diamond color={MOVE_COLORS[key]} size={8} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: '#1A1A1A' }}>
                              {key}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      variants={{ rest: { x: 0 }, hover: { x: 6 } }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="tk-arrow-link"
                      style={{ alignSelf: 'flex-start' }}
                    >
                      <span>Read case study</span>
                      <span className="arr">→</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </Reveal>

          {/* More coming */}
          <Reveal delay={0.15}>
            <div
              style={{
                border: '1px dashed #CFCDC7',
                padding: 'clamp(40px, 5vw, 72px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', gap: 18, marginTop: 24,
              }}
            >
              <div style={{ display: 'flex', gap: 12 }}>
                {MOVE_ORDER.map((k) => (
                  <span key={k} className="tk-diamond" style={{ width: 9, height: 9, border: `1px solid ${MOVE_COLORS[k]}`, display: 'inline-block' }} />
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', color: '#555555', fontSize: 'clamp(19px, 2.4vw, 30px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.015em' }}>
                More case studies being documented
              </div>
              <p style={{ fontFamily: 'var(--font-body)', color: '#999999', fontSize: 14, lineHeight: 1.65, maxWidth: '44ch', margin: 0 }}>
                As TARK continues to be deployed across programmes, organisations, and classrooms,
                each application will be documented and published here.
              </p>
            </div>
          </Reveal>

          {/* Footnote */}
          <Reveal delay={0.2}>
            <div style={{ borderTop: '1px solid var(--tk-border)', paddingTop: 24, marginTop: 'clamp(40px, 5vw, 64px)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="tk-diamond" style={{ width: 5, height: 5, border: '1px solid #CFCDC7', display: 'inline-block' }} />
              <p style={{ fontFamily: 'var(--font-mono)', color: '#999999', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
                Project तर्क · Field deployments · Samvardhan × Studio Carbon
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </>
  );
}
