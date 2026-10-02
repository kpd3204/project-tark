import { PageFooter } from '../components/PageFooter';
import { DocBand, DocPill } from '../components/ProjectDoc';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoWorkshop from '../../imports/photos/real/commit-booklet.jpg';

/* Five bodies of evidence, each keyed to a move colour */
const SECTIONS = [
  {
    title: 'Learning, measured', tint: 'var(--tint-open)',
    color: '#FFD167', textColor: '#1A1A1A',
    stats: [
      { stat: '1 in 3', label: 'Class 8 students in rural government schools cannot read a Class 2 level text', source: 'ASER 2024' },
      { stat: '37%',    label: 'average Class 9 score in mathematics in the national achievement survey', source: 'PARAKH 2024' },
    ],
    citations: [
      { author: 'ASER Centre', year: '2025', title: 'Annual Status of Education Report (Rural) 2024', synthesis: 'In rural government schools, 67.5% of Class 8 students could read a Class 2 level text in 2024, up from 66.2% in 2022 but still below 69% in 2018. Basic reading is far from secure by the end of middle school.', url: 'https://asercentre.org/wp-content/uploads/2022/12/ASER-2024-National-findings.pdf' },
      { author: 'NCERT', year: '2025', title: 'PARAKH Rashtriya Sarvekshan 2024', synthesis: 'India’s national achievement survey found average Class 9 scores of 37% in mathematics, 40% in science, 40% in social science and 54% in language, with scores falling as students move up through school.', url: 'https://parakh.ncert.gov.in/' },
    ],
  },
  {
    title: 'Beyond the basics', tint: 'var(--tint-trace)',
    color: '#E27238', textColor: '#FFFFFF',
    stats: [
      { stat: '25%',   label: 'of 14 to 18 year olds cannot fluently read a Class 2 text in their regional language', source: 'ASER 2023' },
      { stat: '11.5%', label: 'of students drop out at the secondary level', source: 'UDISE+ 2024–25' },
    ],
    citations: [
      { author: 'ASER Centre', year: '2024', title: 'ASER 2023: Beyond Basics', synthesis: 'Surveying 34,745 young people aged 14 to 18 across 28 districts, ASER found about a quarter cannot fluently read a Class 2 text in their regional language, and only 43.3% can solve a three-digit by one-digit division.', url: 'https://asercentre.org/wp-content/uploads/2022/12/ASER-2023_Main-findings-1.pdf' },
      { author: 'Ministry of Education', year: '2025', title: 'UDISE+ 2024–25', synthesis: 'The secondary dropout rate fell from 14.1% in 2023–24 to 11.5% in 2024–25, with wide gaps between states: several report rates above 16%.', url: 'https://udiseplus.gov.in/' },
    ],
  },
  {
    title: 'The future of work', tint: 'var(--tint-shift)',
    color: '#465BA4', textColor: '#FFFFFF',
    stats: [
      { stat: '7 in 10', label: 'employers say analytical thinking is essential, the top core skill', source: 'WEF Future of Jobs 2025' },
      { stat: '39%',     label: 'of workers’ core skills are expected to change by 2030', source: 'WEF Future of Jobs 2025' },
    ],
    citations: [
      { author: 'World Economic Forum', year: '2025', title: 'Future of Jobs Report 2025', synthesis: 'Analytical thinking remains the top core skill, with seven in ten employers calling it essential, followed by resilience, flexibility and agility. Employers expect 39% of core skills to change by 2030.', url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/' },
      { author: 'OECD', year: '2024', title: 'PISA 2022 Results (Volume III): Creative Minds, Creative Schools', synthesis: 'The first PISA test of creative thinking placed Singapore, Korea, Canada, Australia and Finland among the top performers. In Singapore, more than half of 15 year olds reached the highest levels.', url: 'https://www.oecd.org/en/publications/pisa-results-2022-volume-iii-factsheets_041a90f1-en/singapore_3e8ab415-en.html' },
    ],
  },
  {
    title: 'Thinking about thinking', tint: 'var(--tint-surface)',
    color: '#4DB49F', textColor: '#FFFFFF',
    stats: [
      { stat: 'd = 0.69', label: 'effect size of metacognitive strategies, well above the 0.40 of a typical year', source: 'Hattie 2009' },
      { stat: '7.3%',     label: 'of Indian 13 to 17 year olds live with a mental disorder', source: 'NMHS 2015–16' },
    ],
    citations: [
      { author: 'Hattie, J.', year: '2009', title: 'Visible Learning: A Synthesis of Over 800 Meta-Analyses Relating to Achievement', synthesis: 'Across more than 800 meta-analyses, metacognitive strategies showed an effect size of 0.69, well above the 0.40 that Hattie treats as a typical year of growth.', url: 'https://en.wikipedia.org/wiki/Visible_learning' },
      { author: 'NIMHANS', year: '2016', title: 'National Mental Health Survey of India, 2015–16', synthesis: 'Mental disorders were found in 7.3% of 13 to 17 year olds, nearly equal across genders: an estimated 9.8 million young Indians in need of active intervention.', url: 'https://mohfw.gov.in/sites/default/files/National%20Mental%20Health%20Survey%2C%202015-16%20-%20Summary%20Report_0.pdf' },
    ],
  },
  {
    title: 'From insight to action', tint: 'var(--tint-commit)',
    color: '#DA3832', textColor: '#FFFFFF',
    stats: [
      { stat: '+7',       label: 'months of additional progress from teaching metacognition and self-regulation', source: 'EEF Toolkit' },
      { stat: 'g = 0.49', label: 'effect of gamified learning on cognitive outcomes', source: 'Sailer and Homner 2020' },
    ],
    citations: [
      { author: 'Education Endowment Foundation', year: '2024', title: 'Teaching and Learning Toolkit: Metacognition and self-regulation', synthesis: 'Teaching pupils to plan, monitor and evaluate their own learning adds an average of seven months’ progress over a year, one of the highest-impact, lowest-cost approaches in the Toolkit.', url: 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/metacognition-and-self-regulation' },
      { author: 'Sailer, M. and Homner, L.', year: '2020', title: 'The Gamification of Learning: a Meta-analysis', synthesis: 'Gamification had small but significant effects on cognitive (g = 0.49), motivational (g = 0.36) and behavioural (g = 0.25) learning outcomes. Game fiction, and combining competition with collaboration, worked best. Educational Psychology Review 32, 77–112.', url: 'https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109056' },
    ],
  },
];

const comparativeSystems = [
  { system: 'Finland',          approach: 'Phenomenon-based learning',    level: 'High',     note: 'No national standardised tests before the matriculation exam at the end of upper secondary.' },
  { system: 'Estonia',          approach: 'Digital + critical thinking',   level: 'High',     note: 'Highest-scoring European system in PISA 2022 maths, reading and science.' },
  { system: 'Singapore',        approach: 'Mastery + structured inquiry',  level: 'Medium',   note: '“Teach Less, Learn More”, introduced in 2004, to make room for deeper learning.' },
  { system: 'Japan',            approach: 'Collaborative problem-solving', level: 'Medium',   note: 'Reform toward active learning ongoing.' },
  { system: 'South Korea',      approach: 'Exam-driven rote',              level: 'Low',      note: 'Among the highest private tutoring spending in the world.' },
  { system: 'India (NEP 2020)', approach: 'Competency-based (stated)',     level: 'Emerging', note: 'NEP 2020 asks for content to be cut to its core to make space for critical thinking (§4.5).' },
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
                <DocPill />
                <Pill to="/case-studies" variant="ghost">See the case studies</Pill>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoWorkshop} alt="The COMMIT booklet held open among bougainvillea flowers" loading="eager" />
            <Buddy color="#FFD167" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="wave" width={140} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── Five bodies of evidence ─────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <div style={{ marginBottom: 'clamp(56px, 7vw, 112px)' }}><DocBand kicker="Start here" /></div>
          {SECTIONS.map((s, i) => <EvidenceBlock key={s.title} s={s} index={i} />)}
          <p className="fine" style={{ marginTop: 32 }}>Every figure links to its original source. Last checked October 2026.</p>
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
              <span role="columnheader">Room for open thinking*</span>
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
          <p className="fine">* TARK’s reading of each system, based on the policies noted. Not a ranking.</p>
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
