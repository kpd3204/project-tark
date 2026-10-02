import { PageFooter } from '../components/PageFooter';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoWorkshop from '../../imports/photos/university-workshop.jpg';

/* Five bodies of evidence, each keyed to a move colour */
const SECTIONS = [
  {
    title: 'Learning, measured', tint: 'var(--tint-open)',
    color: '#FFD167', textColor: '#1A1A1A',
    stats: [
      { stat: '56%',   label: 'of Grade 8 students cannot read a Grade 2 text', source: 'ASER 2023' },
      { stat: '0 hrs', label: 'mandated for speculative thinking in the Indian curriculum', source: 'NEP 2020' },
    ],
    citations: [
      { author: 'ASER Centre', year: '2023', title: 'Annual Status of Education Report 2023', synthesis: 'Persistent learning poverty despite record enrollment. 56% of Grade 8 students cannot read a Grade 2-level text, a signal that correct-answer thinking dominates at the expense of genuine comprehension.', url: 'https://asercentre.org/aser-2023/' },
      { author: 'NEP 2020 Analysis', year: '2020', title: 'National Education Policy: Implementation Review', synthesis: "Critical thinking is named as a goal in India's NEP 2020, yet zero curriculum hours are explicitly mandated for speculative or reflective practice. Intent without structure produces no change.", url: 'https://www.education.gov.in/nep/about-nep' },
    ],
  },
  {
    title: 'Room to think', tint: 'var(--tint-trace)',
    color: '#E27238', textColor: '#FFFFFF',
    stats: [
      { stat: '76%',  label: 'of teachers report limited time for open-ended discussion', source: 'NCERT Survey 2022' },
      { stat: '3.5×', label: 'higher dropout rate among students with low classroom agency', source: 'UDISE+ 2022–23' },
    ],
    citations: [
      { author: 'NCERT', year: '2022', title: 'National Survey of Teachers on Curriculum Flexibility', synthesis: '76% of surveyed teachers report that existing syllabi leave little room for open-ended discussion. The constraint is systemic, not attitudinal, teachers want to; the structure does not allow it.', url: 'https://ncert.nic.in/' },
      { author: 'UDISE+', year: '2022', title: 'Unified District Information System for Education (2022–23)', synthesis: 'Students reporting low classroom agency drop out at 3.5× the rate of engaged peers. Disengagement is predictable, and preventable, when traced to its structural causes.', url: 'https://udiseplus.gov.in/' },
    ],
  },
  {
    title: 'The future of work', tint: 'var(--tint-shift)',
    color: '#465BA4', textColor: '#FFFFFF',
    stats: [
      { stat: '#1',   label: 'Critical thinking ranked the top skill needed globally by 2030', source: 'WEF Future of Jobs 2025' },
      { stat: '40%+', label: 'of current jobs estimated automatable within a decade', source: 'WEF 2025' },
    ],
    citations: [
      { author: 'World Economic Forum', year: '2025', title: 'Future of Jobs Report 2025', synthesis: 'Critical and creative thinking top the global skills agenda for 2030. Automation will reshape work fundamentally; perspective-shifting and alternative generation are the distinctly human competitive advantage.', url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2025/' },
      { author: 'PISA / OECD', year: '2022', title: 'PISA 2022 Results: Creative Thinking', synthesis: 'Finland and Estonia, which centre speculative and collaborative learning, lead global rankings. Alternative approaches to curriculum design produce measurably different outcomes across socioeconomic groups.', url: 'https://www.oecd.org/pisa/' },
    ],
  },
  {
    title: 'Thinking about thinking', tint: 'var(--tint-surface)',
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
    title: 'From insight to action', tint: 'var(--tint-commit)',
    color: '#DA3832', textColor: '#FFFFFF',
    stats: [
      { stat: '+34%', label: 'improvement in intrinsic motivation from commitment-framed learning contexts', source: 'Sailer et al. 2025' },
      { stat: '2.1×', label: 'greater skill transfer when learners articulate a commitment to act on insight', source: 'EEF 2023' },
    ],
    citations: [
      { author: 'Sailer, M. et al.', year: '2025', title: 'Cambridge Systematic Review: Gamification in Education', synthesis: 'Gamification elements, especially those framing choices as consequential, significantly increase intrinsic motivation and commitment. Structure turns intention into action across diverse learning contexts.', url: 'https://www.cambridge.org/' },
      { author: 'Education Endowment Foundation', year: '2023', title: 'Metacognition and Self-Regulated Learning: Guidance Report', synthesis: 'Students who explicitly articulate what they intend to do with new thinking demonstrate 2.1× greater skill transfer to novel contexts. Commitment is not a soft finish, it is where learning becomes practice.', url: 'https://educationendowmentfoundation.org.uk/' },
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

const levelTint: Record<string, string> = {
  High: 'var(--tint-surface)', Medium: 'var(--tint-trace)', Low: 'var(--tint-commit)', Emerging: 'var(--tint-shift)',
};

type Section = typeof SECTIONS[0];

function EvidenceBlock({ s, index }: { s: Section; index: number }) {
  const ink = s.textColor === '#1A1A1A' ? '#1D1B16' : '#FFFFFF';
  return (
    <article className="ev" style={{ ['--c' as string]: s.color, ['--t' as string]: s.tint }}>
      <Reveal className="ev__head">
        <span className="ev__num" style={{ color: ink }}>{String(index + 1).padStart(2, '0')}</span>
        <h2 className="ev__title">{s.title}</h2>
      </Reveal>

      <div className="ev__stats">
        {s.stats.map((st, i) => (
          <Reveal key={st.stat} delay={i * 0.06} style={{ height: '100%' }}>
            <div className="stat" style={{ backgroundColor: s.tint }}>
              <span className="stat__mark" style={{ backgroundColor: s.color }} aria-hidden="true" />
              <strong className="stat__num ev__num-big">{st.stat}</strong>
              <p className="stat__label">{st.label}</p>
              <span className="stat__src">{st.source}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="ev__cites">
        {s.citations.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06} style={{ height: '100%' }}>
            <a className="cite" href={c.url} target="_blank" rel="noopener noreferrer">
              <span className="cite__meta"><i aria-hidden="true" />{c.author} · {c.year}</span>
              <span className="cite__title">{c.title}</span>
              <span className="cite__text">{c.synthesis}</span>
              <span className="cite__go">Read source <span aria-hidden="true">↗</span></span>
            </a>
          </Reveal>
        ))}
      </div>
    </article>
  );
}

export function ResearchPage() {
  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal><Tag bg="#E27238" tilt={-3}>The evidence</Tag></Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                Why thinking<br />
                needs a <span className="nowrap">system<Buddy color="#4DB49F" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">Five bodies of evidence, each grounded in a distinct problem: how Indian adolescents learn, how classrooms are built, and the research the framework stands on.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="head-actions">
                <Pill to="/case-studies" variant="ghost">See the case studies</Pill>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoWorkshop} alt="Students at a TARK workshop working through the five moves" loading="eager" />
            <Buddy color="#FFD167" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="wave" width={140} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── Five bodies of evidence ─────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          {SECTIONS.map((s, i) => <EvidenceBlock key={s.title} s={s} index={i} />)}
        </div>
      </section>

      {/* ── Global comparison ───────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">How the world teaches thinking</h2></Reveal>
            <Reveal delay={0.05} className="section-head__aside">
              <p>How major education systems approach speculative and reflective thinking, and where India sits in that landscape.</p>
            </Reveal>
          </div>
          <div className="cmp" role="table" aria-label="Global comparison of education systems">
            <div className="cmp__row cmp__row--head" role="row">
              <span role="columnheader">System</span>
              <span role="columnheader">Approach</span>
              <span role="columnheader">Speculative thinking</span>
            </div>
            {comparativeSystems.map((row, i) => (
              <Reveal key={row.system} delay={i * 0.04} y={12}>
                <div className="cmp__row" role="row">
                  <span role="cell">
                    <strong className="cmp__sys">{row.system}</strong>
                    <span className="cmp__note">{row.note}</span>
                  </span>
                  <span role="cell" className="cmp__approach">{row.approach}</span>
                  <span role="cell">
                    <span className="cmp__level" style={{ backgroundColor: levelTint[row.level] }}>
                      <i style={{ backgroundColor: levelColor[row.level] }} aria-hidden="true" />{row.level}
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who TARK is for ─────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <Reveal><h2 className="display-lg" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>Who TARK is for</h2></Reveal>
          <div className="five">
            {archetypes.map((a, i) => (
              <Reveal key={a.name} delay={i * 0.05} style={{ height: '100%' }}>
                <div className="arche" style={{ backgroundColor: a.color, color: a.textColor === '#1A1A1A' ? '#1D1B16' : '#FFFFFF' }}>
                  <div className="arche__top">
                    <Buddy color="#1D1B16" size={44} />
                    <span className="arche__age">{a.age}</span>
                  </div>
                  <h3 className="arche__name">{a.name}</h3>
                  <p className="arche__desc">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-trace)' }}>
        <Squiggle kind="loop" width={150} color="#E27238" className="home-close__sq1" />
        <Squiggle kind="zigzag" width={120} color="#DA3832" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">This research is the foundation</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>TARK is what<br />it produces.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <Pill to="/framework" variant="ink">Read the framework</Pill>
              <Pill to="/toolkit" variant="ghost">Explore the toolkit</Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
