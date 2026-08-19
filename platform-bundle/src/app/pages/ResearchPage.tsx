import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PageFooter } from '../components/PageFooter';
import { useIsMobile } from '../hooks/useIsMobile';
import { EASE, Reveal, LineReveal, SectionHead, Diamond } from '../components/kit';

/* 5 move colours — sections are identified only by colour, not by name */
const SECTIONS = [
  {
    color: '#FFD167', textColor: '#1A1A1A',
    stats: [
      { stat: '56%',   label: 'of Grade 8 students cannot read a Grade 2 text', source: 'ASER 2023' },
      { stat: '0 hrs', label: 'mandated for speculative thinking in the Indian curriculum', source: 'NEP 2020' },
    ],
    citations: [
      { author: 'ASER Centre', year: '2023', title: 'Annual Status of Education Report 2023', synthesis: 'Persistent learning poverty despite record enrollment. 56% of Grade 8 students cannot read a Grade 2-level text, a signal that correct-answer thinking dominates at the expense of genuine comprehension.', url: 'https://asercentre.org/aser-2023/' },
      { author: 'NEP 2020 Analysis', year: '2020', title: 'National Education Policy — Implementation Review', synthesis: "Critical thinking is named as a goal in India's NEP 2020, yet zero curriculum hours are explicitly mandated for speculative or reflective practice. Intent without structure produces no change.", url: 'https://www.education.gov.in/nep/about-nep' },
    ],
  },
  {
    color: '#E27238', textColor: '#FFFFFF',
    stats: [
      { stat: '76%',  label: 'of teachers report limited time for open-ended discussion', source: 'NCERT Survey 2022' },
      { stat: '3.5×', label: 'higher dropout rate among students with low classroom agency', source: 'UDISE+ 2022–23' },
    ],
    citations: [
      { author: 'NCERT', year: '2022', title: 'National Survey of Teachers on Curriculum Flexibility', synthesis: '76% of surveyed teachers report that existing syllabi leave little room for open-ended discussion. The constraint is systemic, not attitudinal — teachers want to; the structure does not allow it.', url: 'https://ncert.nic.in/' },
      { author: 'UDISE+', year: '2022', title: 'Unified District Information System for Education (2022–23)', synthesis: 'Students reporting low classroom agency drop out at 3.5× the rate of engaged peers. Disengagement is predictable, and preventable, when traced to its structural causes.', url: 'https://udiseplus.gov.in/' },
    ],
  },
  {
    color: '#465BA4', textColor: '#FFFFFF',
    stats: [
      { stat: '#1',   label: 'Critical thinking ranked the top skill needed globally by 2030', source: 'WEF Future of Jobs 2025' },
      { stat: '40%+', label: 'of current jobs estimated automatable within a decade', source: 'WEF 2025' },
    ],
    citations: [
      { author: 'World Economic Forum', year: '2025', title: 'Future of Jobs Report 2025', synthesis: 'Critical and creative thinking top the global skills agenda for 2030. Automation will reshape work fundamentally; perspective-shifting and alternative generation are the distinctly human competitive advantage.', url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2025/' },
      { author: 'PISA / OECD', year: '2022', title: 'PISA 2022 Results — Creative Thinking', synthesis: 'Finland and Estonia, which centre speculative and collaborative learning, lead global rankings. Alternative approaches to curriculum design produce measurably different outcomes across socioeconomic groups.', url: 'https://www.oecd.org/pisa/' },
    ],
  },
  {
    color: '#4DB49F', textColor: '#FFFFFF',
    stats: [
      { stat: 'd = 0.69', label: 'Effect size of metacognitive strategies, among the highest of any educational intervention', source: 'Hattie 2009' },
      { stat: '1 in 7', label: 'Indian adolescents experience a mental health condition, most unsurfaced', source: 'NIMHANS 2023' },
    ],
    citations: [
      { author: 'Hattie, J.', year: '2009', title: 'Visible Learning: A Synthesis of Over 800 Meta-Analyses', synthesis: 'Across 800+ meta-analyses covering millions of students, metacognitive and self-regulation strategies produce an effect size of d = 0.69, one of the highest-ranking interventions in all of educational research.', url: 'https://visible-learning.org/' },
      { author: 'NIMHANS', year: '2023', title: 'National Mental Health Survey of School Students', synthesis: '1 in 7 Indian adolescents experience a diagnosable mental health condition. Most go unnamed and unaddressed. Teaching students to observe and name their own thinking also teaches them to surface what they carry.', url: 'https://nimhans.ac.in/research/' },
    ],
  },
  {
    color: '#DA3832', textColor: '#FFFFFF',
    stats: [
      { stat: '+34%', label: 'improvement in intrinsic motivation from commitment-framed learning contexts', source: 'Sailer et al. 2025' },
      { stat: '2.1×', label: 'greater skill transfer when learners articulate a commitment to act on insight', source: 'EEF 2023' },
    ],
    citations: [
      { author: 'Sailer, M. et al.', year: '2025', title: 'Cambridge Systematic Review: Gamification in Education', synthesis: 'Gamification elements, especially those framing choices as consequential, significantly increase intrinsic motivation and commitment. Structure turns intention into action across diverse learning contexts.', url: 'https://www.cambridge.org/' },
      { author: 'Education Endowment Foundation', year: '2023', title: 'Metacognition and Self-Regulated Learning — Guidance Report', synthesis: 'Students who explicitly articulate what they intend to do with new thinking demonstrate 2.1× greater skill transfer to novel contexts. Commitment is not a soft finish, it is where learning becomes practice.', url: 'https://educationendowmentfoundation.org.uk/' },
    ],
  },
];

const comparativeSystems = [
  { system: 'Finland',          approach: 'Phenomenon-based learning',    level: 'High',     note: 'No standardised exams until 18; student-directed inquiry is core curriculum.' },
  { system: 'Estonia',          approach: 'Digital + critical thinking',   level: 'High',     note: 'Ranked #1 in Europe (PISA 2022); integrates philosophical reasoning.' },
  { system: 'Singapore',        approach: 'Mastery + structured inquiry',  level: 'Medium',   note: '"Teach Less, Learn More" policy since 2004.' },
  { system: 'Japan',            approach: 'Collaborative problem-solving', level: 'Medium',   note: 'Reform toward active learning ongoing.' },
  { system: 'South Korea',      approach: 'Exam-driven rote',              level: 'Low',      note: 'Highest private tutoring expenditure globally.' },
  { system: 'India (NEP 2020)', approach: 'Competency-based (stated)',     level: 'Emerging', note: 'Critical thinking listed as goal; structured implementation in progress.' },
];

const levelColor: Record<string, string> = {
  High: '#4DB49F', Medium: '#E27238', Low: '#DA3832', Emerging: '#465BA4',
};

const archetypes = [
  { name: 'The Exam Maximiser',       age: '16–18', color: '#FFD167', textColor: '#1A1A1A', desc: 'High-achieving students who conflate marks with worth. Entry point: suspend that equation.' },
  { name: 'The Aspirational Migrant', age: '18–22', color: '#E27238', textColor: '#FFFFFF', desc: 'First-generation college students navigating unfamiliar systems with remarkable resourcefulness.' },
  { name: 'The Question Hoarder',     age: '15–17', color: '#465BA4', textColor: '#FFFFFF', desc: "Curious minds sitting on questions they've been told not to ask. Entry point: legitimise the unspoken." },
  { name: 'The Skilled Pragmatist',   age: '16–19', color: '#4DB49F', textColor: '#FFFFFF', desc: 'Vocational students with practical intelligence, a different but equally valid cognition.' },
  { name: 'The Digital Native',       age: '15–20', color: '#DA3832', textColor: '#FFFFFF', desc: 'Fluent in technology, immersed in information. Needs tools for meaningful sense-making and action.' },
];

function CitationCard({ c, color }: { c: typeof SECTIONS[0]['citations'][0]; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={c.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        padding: 'clamp(28px, 3vw, 40px) 0',
        textDecoration: 'none',
        borderBottom: '1px solid var(--tk-border)',
        borderLeft: `2px solid ${hovered ? color : 'transparent'}`,
        paddingLeft: hovered ? 24 : 0,
        transition: 'border-color 0.3s, padding-left 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: '#999999' }}>
          {c.author}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#BBBBBB', flexShrink: 0 }}>{c.year}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(17px, 1.6vw, 21px)', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
        {c.title}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: '#555555', lineHeight: 1.7, flex: 1, margin: 0, maxWidth: '58ch' }}>
        {c.synthesis}
      </p>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: hovered ? '#1A1A1A' : '#BBBBBB', transition: 'color 0.25s' }}>
        Read source →
      </div>
    </a>
  );
}

function ResearchSection({ s, index }: { s: typeof SECTIONS[0]; index: number }) {
  const dim = s.textColor === '#1A1A1A' ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.65)';
  const dimmer = s.textColor === '#1A1A1A' ? 'rgba(26,26,26,0.4)' : 'rgba(255,255,255,0.4)';
  const isMobile = useIsMobile();

  return (
    <div>
      {/* Colour band — evidence in numbers */}
      <div style={{ backgroundColor: s.color }}>
        <div className="tk-wrap" style={{ paddingBlock: 'clamp(36px, 4.5vw, 64px)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '80px repeat(2, 1fr)',
              gap: isMobile ? 28 : 48,
              alignItems: 'start',
            }}
          >
            <Reveal y={12}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', fontWeight: 600, color: dimmer }}>
                0{index + 1}
              </span>
            </Reveal>
            {s.stats.map((st, i) => (
              <Reveal key={i} delay={0.08 + i * 0.08}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 4.5vw, 68px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.025em', color: s.textColor }}>
                    {st.stat}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: dim, lineHeight: 1.55, maxWidth: '30ch', marginTop: 12 }}>
                    {st.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: dimmer, marginTop: 10 }}>
                    {st.source}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Citations */}
      <div className="tk-wrap">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))',
            gap: '0 clamp(32px, 4vw, 64px)',
            paddingBottom: 'clamp(24px, 3vw, 40px)',
          }}
        >
          {s.citations.map((c, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <CitationCard c={c} color={s.color} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResearchPage() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="tk-grain" style={{ backgroundColor: '#1A1A1A', paddingTop: 'clamp(128px, 18vh, 192px)', paddingBottom: 'clamp(48px, 6vw, 88px)' }}>
        <div className="tk-wrap">
          <Reveal y={16}>
            <div className="tk-eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
              Evidence Base · Five bodies of research
            </div>
          </Reveal>
          <LineReveal
            as="h1"
            className="tk-hero-h"
            color="#FFFFFF"
            lines={[
              <span key="a" className="tk-light" style={{ color: 'rgba(255,255,255,0.75)' }}>The evidence</span>,
              'behind the system.',
            ]}
            delay={0.1}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', marginTop: 'clamp(28px, 3.5vw, 48px)' }}>
            <Reveal delay={0.3}>
              <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-lede)', lineHeight: 1.7, maxWidth: '48ch', margin: 0 }}>
                Five bodies of evidence, each grounded in a distinct problem: Indian adolescent
                cognition, global comparative analysis, and the academic research underpinning the framework.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div style={{ display: 'flex', gap: 10 }}>
                {SECTIONS.map((s, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.07, ease: EASE }}
                  >
                    <Diamond color={s.color} size={10} />
                  </motion.span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ── FIVE COLOUR-CODED SECTIONS ──────────────────────── */}
      {SECTIONS.map((s, i) => (
        <ResearchSection key={i} s={s} index={i} />
      ))}

      {/* ── GLOBAL COMPARISON ───────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F4F1', paddingBlock: 'var(--space-block)' }}>
        <div className="tk-wrap">
          <SectionHead label="Global Comparison" />
          <Reveal delay={0.1}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, color: '#555555', lineHeight: 1.7, maxWidth: '56ch', margin: 'clamp(24px, 3vw, 40px) 0 clamp(28px, 3.5vw, 44px)' }}>
              How major education systems approach speculative and reflective thinking — and where India sits in that landscape.
            </p>
          </Reveal>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
            <div style={{ minWidth: 640, borderTop: '1px solid #1A1A1A' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.6fr 0.8fr', borderBottom: '1px solid var(--tk-border)' }}>
                {['System', 'Approach', 'Speculative'].map((h) => (
                  <div key={h} style={{ padding: '14px 20px 14px 0', fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#999999' }}>
                    {h}
                  </div>
                ))}
              </div>
              {comparativeSystems.map((row, i) => (
                <Reveal key={i} delay={i * 0.05} y={12}>
                  <div
                    style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.6fr 0.8fr', borderBottom: '1px solid var(--tk-border)', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                  >
                    <div style={{ padding: '18px 20px 18px 0' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{row.system}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#999999', lineHeight: 1.5, maxWidth: '38ch' }}>{row.note}</div>
                    </div>
                    <div style={{ padding: '18px 20px 18px 0', fontFamily: 'var(--font-body)', fontSize: 14, color: '#555555', display: 'flex', alignItems: 'center' }}>
                      {row.approach}
                    </div>
                    <div style={{ padding: '18px 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: levelColor[row.level] }}>
                        <Diamond color={levelColor[row.level]} size={6} />
                        {row.level}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHETYPES ──────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-block)' }}>
        <div className="tk-wrap">
          <SectionHead label="Who TARK Is For" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
              marginTop: 'clamp(28px, 3.5vw, 48px)',
            }}
          >
            {archetypes.map((a, i) => {
              const dim = a.textColor === '#1A1A1A' ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.65)';
              return (
                <Reveal key={a.name} delay={i * 0.06} style={{ height: '100%' }}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    style={{
                      backgroundColor: a.color,
                      padding: 'clamp(24px, 2.5vw, 36px) clamp(20px, 2vw, 28px)',
                      display: 'flex', flexDirection: 'column', gap: 12,
                      height: '100%',
                      minHeight: 220,
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: dim }}>
                      {a.age}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 1.5vw, 19px)', fontWeight: 700, color: a.textColor, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                      {a.name}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: dim, lineHeight: 1.6, margin: 0 }}>
                      {a.desc}
                    </p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A1A1A', paddingBlock: 'var(--space-block)' }}>
        <div className="tk-wrap">
          <div style={{ display: 'flex', height: 3, marginBottom: 'clamp(32px, 4vw, 56px)', maxWidth: 320 }}>
            {SECTIONS.map((s, i) => <div key={i} style={{ flex: 1, backgroundColor: s.color }} />)}
          </div>
          <LineReveal
            as="h2"
            className="tk-display-h"
            color="#FFFFFF"
            lines={['This research is the foundation.', 'TARK is what it produces.']}
          />
          <Reveal delay={0.2}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 'clamp(32px, 4vw, 48px)' }}>
              <Link to="/framework" className="tk-btn tk-btn--yellow">Read the Framework →</Link>
              <Link to="/toolkit" className="tk-btn tk-btn--ghost-light">Explore the Toolkit →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </>
  );
}
