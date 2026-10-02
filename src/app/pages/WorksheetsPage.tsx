import { worksheetKits, type WorksheetKit } from '../data/worksheetKits';
import { PageFooter } from '../components/PageFooter';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoWorksheet from '../../imports/photos/real/student-writing.jpg';
import photoGuide from '../../imports/photos/real/facilitator-guide.jpg';

const notifyHref = (title: string) =>
  `mailto:project.tark@gmail.com?subject=${encodeURIComponent(`Notify me: ${title}`)}&body=${encodeURIComponent(`Please let me know when the ${title} is ready.`)}`;

const TOTAL_SHEETS = worksheetKits.reduce((n, k) => n + k.count, 0);

function KitCard({ kit, index }: { kit: WorksheetKit; index: number }) {
  const light = kit.textColor !== '#1A1A1A';
  return (
    <article className={`kit ${light ? 'kit--light' : ''}`} style={{ backgroundColor: kit.color, color: light ? '#FFFFFF' : '#1D1B16' }}>
      <div className="kit__top">
        <span className="kit__num">Kit {String(index + 1).padStart(2, '0')} · {kit.count} sheets</span>
        <span className="kit__status">{kit.status === 'available' ? 'Available' : 'Soon'}</span>
      </div>
      <h3 className="kit__title">{kit.title}</h3>
      <p className="kit__sub">{kit.subtitle}</p>
      <p className="kit__desc">{kit.description}</p>
      <div className="kit__chips">
        {kit.contents.map((c) => <span key={c}>{c}</span>)}
      </div>
      <div className="kit__foot">
        <span className="kit__aud">{kit.audience}</span>
        <a className="kit__notify" href={notifyHref(kit.title)}>Notify me <span aria-hidden="true">→</span></a>
      </div>
    </article>
  );
}

export function WorksheetsPage() {
  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal>
              <div className="tag-row">
                <Tag bg="#E27238" tilt={-3}>Worksheets</Tag>
                <span className="soon">Soon</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                Thinking,<br />
                on <span className="nowrap">paper<Buddy color="#4DB49F" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">{TOTAL_SHEETS} structured worksheets in six kits, each built for a different room and a different reader. Every sheet works one move at a time.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="toolkit-counters">
                <div><strong>{TOTAL_SHEETS}</strong><span>worksheets</span></div>
                <div><strong>{worksheetKits.length}</strong><span>kits</span></div>
                <div><strong>5</strong><span>moves</span></div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoWorksheet} alt="A student writing on a TARK worksheet: flip a school rule completely" loading="eager" />
            <Buddy color="#FFD167" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="wave" width={130} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── Kits ────────────────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">Six kits, one for every room</h2></Reveal>
            <Reveal delay={0.05} className="section-head__aside">
              <p>The kits are being designed now. Tap “Notify me” on any kit and we will write when it is ready.</p>
            </Reveal>
          </div>
          <div className="six">
            {worksheetKits.map((k, i) => (
              <Reveal key={k.id} delay={(i % 3) * 0.06} style={{ height: '100%' }}>
                <KitCard kit={k} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How they work ───────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap split">
          <div>
            <Reveal><h2 className="display-lg">One move<br />at a time.</h2></Reveal>
            <Reveal delay={0.08} className="side-photo">
              <figure>
                <SoftImg src={photoGuide} alt="The TARK facilitator guide for teachers and session leaders" />
                <figcaption><i aria-hidden="true" />Every kit comes with a one-page facilitator guide</figcaption>
              </figure>
            </Reveal>
          </div>
          <ol className="steps" style={{ marginTop: 0 }}>
            {[
              { t: 'Pick a kit',      d: 'Choose the kit that matches your context: classroom, home, or a specific literacy area.', c: '#FFD167' },
              { t: 'Choose a move',   d: "Each kit covers all five TARK moves. Start with OPEN if you're new to the framework.", c: '#E27238' },
              { t: 'Run the session', d: 'Worksheets are self-contained. Facilitators get a one-page guide. Students need only a pen.', c: '#465BA4' },
              { t: 'Reflect',         d: 'Every worksheet ends with a reflection prompt that makes the thinking visible.', c: '#4DB49F' },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.07}>
                <li>
                  <Buddy color={s.c} size={44} delay={0.08 * i} />
                  <div><h3>{s.t}</h3><p>{s.d}</p></div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-surface)' }}>
        <Squiggle kind="zigzag" width={150} color="#4DB49F" className="home-close__sq1" />
        <Squiggle kind="loop" width={130} color="#E27238" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">Can’t wait for the kits?</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>The tools are<br />ready now.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <Pill to="/toolkit" variant="ink">Browse the toolkit</Pill>
              <Pill to="/thinking-partner" variant="ghost">Try the Thinking Partner</Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
