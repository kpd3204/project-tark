import { Link } from 'react-router';
import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal, MOVE_COLORS, MOVE_ORDER } from '../components/kit';
import { Buddy, Squiggle, Tag, Pill, SoftImg } from '../components/play';
import photoSession from '../../imports/photos/presentation-screen.jpg';

const MOVES_APPLIED: Record<string, string> = {
  OPEN: 'Persona and audience work',
  TRACE: 'Trust hierarchy and journey',
  SHIFT: 'Positioning and perception',
  SURFACE: 'Language audit',
  COMMIT: 'Direction and promise',
};

export function CaseStudiesPage() {
  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap tk-head__grid">
          <div>
            <Reveal><Tag bg="#DA3832" tilt={-3}>Case studies</Tag></Reveal>
            <Reveal delay={0.05}>
              <h1 className="display-xl tk-head__title">
                TARK in<br />
                the <span className="nowrap">field<Buddy color="#E27238" size={0} className="buddy--inline" delay={0.3} /></span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">Real deployments of the framework: how the five moves have been used across different rooms, teams and organisations.</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={40} className="tk-head__photo">
            <SoftImg src={photoSession} alt="A TARK session in progress, with the framework on the screen" loading="eager" />
            <Buddy color="#465BA4" size={64} className="tk-head__buddy" delay={0.4} />
            <Squiggle kind="arrow" width={90} color="var(--ink)" className="tk-head__sq" delay={0.5} />
          </Reveal>
        </div>
      </header>

      {/* ── Cases ───────────────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap">
          <Reveal>
            <article className="case">
              <div className="case__main">
                <div className="case__meta">
                  <span className="mini-chip">Case study 01</span>
                  <span className="mini-chip">2026</span>
                  <span className="mini-chip">Samvardhan × Studio Carbon</span>
                </div>
                <h2 className="case__title">
                  <Link to="/case-studies/zenovocare" className="case__link">ZenovoCare</Link>
                </h2>
                <p className="case__sub">Brand strategy and future positioning</p>
                <p className="case__text">
                  The TARK framework was deployed within Samvardhan, a Studio Carbon programme, to guide
                  ZenovoCare through a structured brand strategy process. The five moves were used to
                  surface assumptions in their positioning, trace the origins of their market beliefs,
                  and build a more grounded foundation for what comes next.
                </p>
                <div className="case__tags">
                  {['Brand strategy', 'Future positioning', 'Assumption surfacing', 'Organisational thinking'].map((t) => (
                    <span key={t} className="mini-chip">{t}</span>
                  ))}
                </div>
              </div>

              <div className="case__side">
                <h3 className="mini-head">Moves applied</h3>
                <ul className="case__moves">
                  {MOVE_ORDER.map((k) => (
                    <li key={k}>
                      <MoveIcon move={k as MoveKey} size={22} variant="color" />
                      <strong>{k}</strong>
                      <span>{MOVES_APPLIED[k]}</span>
                    </li>
                  ))}
                </ul>
                <span className="case__go">Read the case study <span aria-hidden="true">→</span></span>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="soon-card">
              <div className="soon-card__diamonds" aria-hidden="true">
                {MOVE_ORDER.map((k) => <i key={k} style={{ borderColor: MOVE_COLORS[k] }} />)}
              </div>
              <h3>More case studies are being documented</h3>
              <p>As TARK is used across programmes, organisations and classrooms, each one will be written up and published here.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: 'var(--tint-commit)' }}>
        <Squiggle kind="wave" width={150} color="#DA3832" className="home-close__sq1" />
        <Squiggle kind="spiral" width={90} color="#E27238" className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">Running TARK with your team?</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>Tell us how<br />it went.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <a className="pill pill--ink" href="mailto:project.tark@gmail.com"><span>project.tark@gmail.com</span><span className="pill__arrow" aria-hidden="true">→</span></a>
              <Pill to="/research" variant="ghost">See the evidence</Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
