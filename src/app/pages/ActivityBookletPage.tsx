import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoBooklet from '../../imports/photos/real/five-moves-booklet-grass.jpg';

const MOVES: { key: MoveKey; hindi: string; color: string; ink: string }[] = [
  { key: 'OPEN',    hindi: 'खुलना',      color: '#FFD167', ink: '#FFFFFF' },
  { key: 'TRACE',   hindi: 'खोजना',      color: '#E27238', ink: '#FFFFFF' },
  { key: 'SHIFT',   hindi: 'बदलना',      color: '#465BA4', ink: '#FFFFFF' },
  { key: 'SURFACE', hindi: 'उभरना',      color: '#4DB49F', ink: '#FFFFFF' },
  { key: 'COMMIT',  hindi: 'प्रतिबद्ध', color: '#DA3832', ink: '#FFFFFF' },
];

const notifyHref = `mailto:project.tark@gmail.com?subject=${encodeURIComponent('Notify me: Activity Booklet')}&body=${encodeURIComponent('Please let me know when the TARK Activity Booklet is ready.')}`;

export function ActivityBookletPage() {
  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal>
              <div className="tag-row">
                <Tag bg="#4DB49F" tilt={-3}>Activity Booklet</Tag>
                <span className="soon">Soon</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                Five moves,<br />
                unlimited<br />
                <span className="nowrap">possibilities<Buddy color="#E27238" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">A speculative thinking workbook for curious minds: 25 activities for young adults to think differently.</p>
              <p className="lede deva" lang="hi" style={{ marginTop: 10 }}>जिज्ञासु मन के लिए विचार अभ्यास पुस्तिका</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="toolkit-counters">
                <div><strong>25</strong><span>activities</span></div>
                <div><strong>5</strong><span>moves</span></div>
              </div>
              <a className="pill pill--ink" href={notifyHref}><span>Tell me when it’s ready</span><span className="pill__arrow" aria-hidden="true">→</span></a>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoBooklet} alt="The Five Moves, Unlimited Possibilities activity booklet lying on green leaves" loading="eager" />
            <Buddy color="#DA3832" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="loop" width={120} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── Across all five moves ───────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">Every move, on paper</h2></Reveal>
            <Reveal delay={0.05} className="section-head__aside">
              <p>A brand-new tool, separate from the toolkit. The activities work through all five moves, one page at a time, with a pen and an open mind.</p>
            </Reveal>
          </div>
          <div className="jump" style={{ marginTop: 0 }}>
            {MOVES.map((m) => (
              <Reveal key={m.key}>
                <div className="jump__item" style={{ backgroundColor: m.color, color: '#FFFFFF' }}>
                  <MoveIcon move={m.key} size={26} variant="white" />
                  <span className="jump__name">{m.key}</span>
                  <span className="jump__hindi deva" lang="hi">{m.hindi}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-surface)' }}>
        <Squiggle kind="zigzag" width={150} color="#4DB49F" className="home-close__sq1" />
        <Squiggle kind="spiral" width={90} color="#E27238" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">While the booklet is being finished</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>Start with<br />the tools.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <Pill to="/toolkit" variant="ink">Browse the toolkit</Pill>
              <Pill to="/framework" variant="ghost">Learn the five moves</Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
