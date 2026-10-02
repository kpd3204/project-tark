import { PageFooter } from '../components/PageFooter';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoGroup from '../../imports/photos/butterfly-effect-group.jpg';


const notifyHref = `mailto:project.tark@gmail.com?subject=${encodeURIComponent('Notify me: TARK games')}&body=${encodeURIComponent('Please let me know when the TARK games are ready.')}`;

export function GamesPage() {
  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal>
              <div className="tag-row">
                <Tag bg="#FFD167" color="#1D1B16" tilt={-3}>Games</Tag>
                <span className="soon">Soon</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                Thinking,<br />
                <span className="nowrap">played<Buddy color="#DA3832" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">Games that bring the five moves into play are on the way. Leave your email and we’ll tell you when they’re ready.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="head-actions">
                <a className="pill pill--ink" href={notifyHref}><span>Tell me when they’re ready</span><span className="pill__arrow" aria-hidden="true">→</span></a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoGroup} alt="A group playing through the Butterfly Effect tool together" loading="eager" />
            <Buddy color="#4DB49F" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="loop" width={120} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-open)' }}>
        <Squiggle kind="spiral" width={90} color="#E27238" className="home-close__sq1" />
        <Squiggle kind="zigzag" width={130} color="#DA3832" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">While the games are being built</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>Play with<br />the tools.</h2>
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
