import { Link } from 'react-router';
import { Instagram } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoClassroom from '../../imports/photos/classroom-workshop.jpg';
import photoMentor from '../../imports/photos/about/mentor-swapnil-soni.jpg';
import photoStudio from '../../imports/photos/about/studio-review.jpg';
import photoStickers from '../../imports/photos/about/thinking-stickers.jpg';
import photoBooklet from '../../imports/photos/about/five-moves-booklet.jpg';
import photoCards from '../../imports/photos/about/thinking-toolkit-cards.jpg';
import photoJury from '../../imports/photos/about/final-jury.jpg';

const PRINCIPLES = [
  { label: 'Design principle', text: 'A system for thinking, not a website for reading.', color: '#E27238', tint: 'var(--tint-trace)' },
  { label: 'Audience',         text: 'Indian adolescents aged 13 to 22, educators, researchers, and institutions engaging with cognitive pedagogy.', color: '#465BA4', tint: 'var(--tint-shift)' },
  { label: 'What TARK is not', text: 'A curriculum replacement. A political position. A quick fix. It is cognitive infrastructure: patient, rigorous, and long-term.', color: '#4DB49F', tint: 'var(--tint-surface)' },
];

const MOVES: { key: MoveKey; hindi: string; color: string; ink: string }[] = [
  { key: 'OPEN',    hindi: 'खुलना',      color: '#FFD167', ink: '#FFFFFF' },
  { key: 'TRACE',   hindi: 'खोजना',      color: '#E27238', ink: '#FFFFFF' },
  { key: 'SHIFT',   hindi: 'बदलना',      color: '#465BA4', ink: '#FFFFFF' },
  { key: 'SURFACE', hindi: 'उभरना',      color: '#4DB49F', ink: '#FFFFFF' },
  { key: 'COMMIT',  hindi: 'प्रतिबद्ध', color: '#DA3832', ink: '#FFFFFF' },
];

const TEAM = [
  { role: 'Author and framework design', name: 'Kalpak Doshi',            color: '#FFD167' },
  { role: 'Mentor',                      name: 'Swapnil Soni',            color: '#E27238' },
  { role: 'Institute mentor',            name: 'Prof. Saurabh Vyas',      color: '#465BA4' },
  { role: 'Institution',                 name: 'GLS Faculty of Design', color: '#4DB49F' },
  { role: 'Studio',                      name: 'Studio Carbon',           color: '#DA3832' },
  { role: 'Published',                   name: 'July 2026',               color: '#FFD167' },
];

/* Acknowledgements, kept short */
const THANKS: { group: string; color: string; people: string[] }[] = [
  {
    group: 'Institutions', color: '#FFD167',
    people: [
      'GLS Faculty of Design',
      'Studio Carbon',
      'IIT Centre for Creative Learning',
    ],
  },
  {
    group: 'Mentors', color: '#E27238',
    people: [
      'Swapnil Soni',
      'Prof. Saurabh Vyas',
    ],
  },
  {
    group: 'Experts and educators', color: '#465BA4',
    people: [
      'Kavita Arvind',
      'Mehul Raval',
      'Soham Chandrachud',
      'Priyanshu Shah',
      'Dharmesh Naik',
      'Urmi Dave',
    ],
  },
  {
    group: 'People who shaped the work', color: '#4DB49F',
    people: [
      'Naveen Kumar Gonga',
      'Om Gajjar',
      'Vivek Bhuwad',
      'Siddhi Kansara',
      'Shageera Mazid',
      'Janvi Shah',
      'Ashray Sachan',
      'Mallika Lahiry',
      'Suyash Kamble',
    ],
  },
  {
    group: 'And', color: '#DA3832',
    people: [
      'Family',
      'Friends',
      'The students who took part',
    ],
  },
];

/* The making of TARK, in the order it happened */
const PROCESS = [
  { src: photoStudio,   alt: 'Reviewing the TARK identity on screens at the studio, worksheets spread across the desk', caption: 'Building the identity at the studio', area: 'a' },
  { src: photoStickers, alt: 'TARK stickers: Ctrl + Shift + Rethink, Mind under construction, Mental gym', caption: 'Stickers for minds under construction', area: 'b' },
  { src: photoBooklet,  alt: 'The Five Cognitive Moves booklet held open at the OPEN page', caption: 'The five moves, as a pocket booklet', area: 'c' },
  { src: photoCards,    alt: 'The Project TARK Thinking Toolkit, a ring of printed tool cards fanned out', caption: 'The Thinking Toolkit, printed and ringed', area: 'd' },
];

const CONNECT = [
  {
    title: 'Project TARK', role: 'Say hello', color: '#FFD167',
    links: [
      { label: 'project.tark@gmail.com', href: 'mailto:project.tark@gmail.com' },
      { label: '@project.tark', href: 'https://www.instagram.com/project.tark/', external: true, ig: true },
    ],
  },
  {
    title: 'Kalpak Doshi', role: 'Author and framework design', color: '#DA3832',
    links: [{ label: 'kalpakpdoshi@gmail.com', href: 'mailto:kalpakpdoshi@gmail.com' }],
  },
  {
    title: 'Studio Carbon', role: 'Design and development', color: '#465BA4',
    links: [{ label: 'studiocarbon.com', href: 'https://www.studiocarbon.com/', external: true }],
  },
];

export function AboutPage() {
  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal><Tag bg="#465BA4" tilt={-3}>About</Tag></Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                Project <Tag bg="#FFD167" color="#1D1B16" tilt={-2} className="tag--word deva">तर्क</Tag>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede" style={{ maxWidth: '44ch' }}>
                TARK is a cognitive pedagogy framework that builds speculative thinking as foundational
                infrastructure for Indian youth. Five moves, practised rather than performed, that build
                the capacity to think when answers are not given.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoClassroom} alt="A classroom workshop running the TARK framework" loading="eager" />
            <Buddy color="#4DB49F" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="spiral" width={84} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── Principles ──────────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <Reveal><h2 className="display-lg" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>What we stand on</h2></Reveal>
          <div className="trio">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.label} delay={i * 0.06} style={{ height: '100%' }}>
                <div className="note note--big" style={{ backgroundColor: p.tint }}>
                  <span className="note__mark" style={{ backgroundColor: p.color }} aria-hidden="true" />
                  <span className="mini-head">{p.label}</span>
                  <p className="note__title">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── The system ──────────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">Five moves.<br />One framework.</h2></Reveal>
            <Reveal delay={0.05} className="section-head__aside">
              <p>Use any move, in any order. Each one has its own colour, its own question and its own set of tools.</p>
              <Pill to="/framework" variant="ghost">Explore the framework</Pill>
            </Reveal>
          </div>
          <Reveal>
            <nav className="jump" style={{ marginTop: 0 }} aria-label="The five moves">
              {MOVES.map((m) => (
                <Link key={m.key} to={`/framework#${m.key.toLowerCase()}`} className="jump__item" style={{ backgroundColor: m.color, color: '#FFFFFF' }}>
                  <MoveIcon move={m.key} size={26} variant="white" />
                  <span className="jump__name">{m.key}</span>
                  <span className="jump__hindi deva" lang="hi">{m.hindi}</span>
                  <span className="jump__go" aria-hidden="true">→</span>
                </Link>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {/* ── How it was made ─────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">How it was made</h2></Reveal>
            <Reveal delay={0.05} className="section-head__aside">
              <p>From the first sketches on a studio wall to booklets, cards and stickers people can hold.</p>
            </Reveal>
          </div>
          <div className="process">
            {PROCESS.map((p, i) => (
              <Reveal key={p.caption} delay={i * 0.06} y={32} className={`process__item process__item--${p.area}`}>
                <figure>
                  <SoftImg src={p.src} alt={p.alt} />
                  <figcaption><i aria-hidden="true" />{p.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mentorship ──────────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap mentor">
          <Reveal y={40} className="mentor__photo">
            <SoftImg src={photoMentor} alt="Kalpak Doshi and mentor Swapnil Soni holding the Project TARK graduation project, with TARK cards and booklets on the desk behind them" />
            <Buddy color="#FFD167" size={64} className="mentor__buddy" delay={0.3} />
          </Reveal>
          <div>
            <Reveal><Tag bg="#E27238" tilt={-3}>Mentorship</Tag></Reveal>
            <Reveal delay={0.05}><h2 className="display-lg mentor__title">Thought through, together</h2></Reveal>
            <Reveal delay={0.15}>
              <div className="mentor__names">
                <div><span className="mini-head">Author</span><strong>Kalpak Doshi</strong></div>
                <div><span className="mini-head">Mentor</span><strong>Swapnil Soni</strong></div>
                <div><span className="mini-head">Institute mentor</span><strong>Prof. Saurabh Vyas</strong></div>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="tk-wrap">
          <Reveal y={40}>
            <figure className="jury">
              <SoftImg src={photoJury} alt="Kalpak Doshi presenting Project TARK to the final jury, with the worksheet kits on screen and booklets and cards on the table" />
              <figcaption><i aria-hidden="true" />Presenting Project <span className="deva" lang="hi">तर्क</span> to the final jury</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Team and publication ────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <Reveal><h2 className="display-lg" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>Team and publication</h2></Reveal>
          <div className="six">
            {TEAM.map((t, i) => (
              <Reveal key={t.role} delay={i * 0.05} style={{ height: '100%' }}>
                <div className="person">
                  <span className="person__mark" style={{ backgroundColor: t.color }} aria-hidden="true" />
                  <span className="mini-head">{t.role}</span>
                  <strong className="person__name">{t.name}</strong>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── With thanks ─────────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">With thanks</h2></Reveal>
            <Reveal delay={0.05} className="section-head__aside">
              <p>TARK was shaped by many people. Thank you.</p>
            </Reveal>
          </div>
          <div className="thanks">
            {THANKS.map((g) => (
              <Reveal key={g.group} className="thanks__group">
                <h3 className="mini-head"><i style={{ backgroundColor: g.color }} aria-hidden="true" />{g.group}</h3>
                <ul>
                  {g.people.map((name) => <li key={name}>{name}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Connect ─────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-shift)', textAlign: 'left' }}>
        <Squiggle kind="loop" width={150} color="#465BA4" className="home-close__sq2" />
        <div className="tk-wrap home-close__inner">
          <Reveal><h2 className="display-lg" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>Let’s talk</h2></Reveal>
          <div className="trio">
            {CONNECT.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06} style={{ height: '100%' }}>
                <div className="contact">
                  <Buddy color={c.color} size={48} />
                  <strong className="contact__name">{c.title}</strong>
                  <span className="contact__role">{c.role}</span>
                  <div className="contact__links">
                    {c.links.map((l: { label: string; href: string; external?: boolean; ig?: boolean }) => (
                      <a key={l.label} href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {l.ig && <Instagram size={16} strokeWidth={1.8} />}
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
