import { Reveal } from './kit';
import { Buddy, Tag, Pill } from './play';

/* The final document of the project: everything behind TARK in one place */
export const DOC_URL = 'https://drive.google.com/file/d/1zmcBUGDYryq3EhvoEP7cRfvtQ0lVigAi/view?usp=sharing';

const STRIPES = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];

export function DocBand({ kicker = 'The final document' }: { kicker?: string }) {
  return (
    <Reveal>
      <a className="doc" href={DOC_URL} target="_blank" rel="noopener noreferrer">
        <div className="doc__text">
          <Tag bg="#FFD167" color="#1D1B16" tilt={-3}>{kicker}</Tag>
          <h2 className="doc__title">Everything behind TARK, in one document.</h2>
          <p className="doc__lede">The research, the process and the full framework from the graduation project.</p>
          <span className="pill pill--yellow doc__pill"><span>Read the document</span><span className="pill__arrow" aria-hidden="true">↗</span></span>
        </div>
        <div className="doc__art" aria-hidden="true">
          <div className="doc__page doc__page--back" />
          <div className="doc__page doc__page--mid" />
          <div className="doc__page">
            <span className="doc__brand">PROJECT <span className="deva">तर्क</span></span>
            <span className="doc__lines"><i /><i /><i /><i /></span>
            <span className="doc__stripes">{STRIPES.map((c) => <i key={c} style={{ backgroundColor: c }} />)}</span>
          </div>
          <Buddy color="#FFD167" size={56} className="doc__buddy" />
        </div>
      </a>
    </Reveal>
  );
}

/* Compact version for the Research header */
export function DocPill() {
  return <Pill href={DOC_URL} variant="ink">Read the full document</Pill>;
}
