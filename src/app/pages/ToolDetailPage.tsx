import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { getToolBySlug, getNextTool, toolsData } from '../data/tools';
import { PageFooter } from '../components/PageFooter';
import { MoveIcon } from '../components/MoveIcon';
import type { MoveKey } from '../components/MoveIcon';
import { Reveal } from '../components/kit';
import { Buddy, Squiggle, Pill } from '../components/play';

const FALLBACK_URL = 'https://drive.google.com/drive/folders/1ivpEmL7nj3No2GXXrpZAo_Qk70TGEpxL';
const TP_URL = 'https://thinkingpartner.netlify.app/';
const GPT_URL = 'https://chatgpt.com/g/g-69e25c86db488191824d86bf3399227f-trk-thinking-partner';
const GEM_URL = 'https://gemini.google.com/gem/1O2CGR8VO65PPOBuctSwskGO7RyGUsucZ?usp=sharing';

const TINT: Record<string, string> = {
  OPEN: 'var(--tint-open)', TRACE: 'var(--tint-trace)', SHIFT: 'var(--tint-shift)',
  SURFACE: 'var(--tint-surface)', COMMIT: 'var(--tint-commit)',
};
const TP_LABEL: Record<string, string> = {
  YES: 'Works with the Thinking Partner',
  PARTIAL: 'Partly works with the Thinking Partner',
  'SOLO ONLY': 'Best done on your own',
};

function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };
  return (
    <button type="button" className="pill pill--yellow" onClick={copy}>
      <span>{copied ? 'Copied' : 'Copy the prompt'}</span>
      <span className="pill__arrow" aria-hidden="true">{copied ? '✓' : '⧉'}</span>
    </button>
  );
}

export function ToolDetailPage() {
  const { move: moveParam, toolSlug } = useParams<{ move: string; toolSlug: string }>();
  const result = getToolBySlug(moveParam || '', toolSlug || '');
  const next = getNextTool(moveParam || '', toolSlug || '');

  if (!result) {
    return (
      <div className="page">
        <header className="tk-head">
          <div className="tk-wrap">
            <h1 className="display-lg">Tool not found.</h1>
            <div className="head-actions"><Pill to="/toolkit" variant="ink">Back to the toolkit</Pill></div>
          </div>
        </header>
        <PageFooter />
      </div>
    );
  }

  const { move, tool } = result;
  const key = move.key as MoveKey;
  const index = move.tools.findIndex((t) => t.slug === tool.slug);
  const number = String(index + 1).padStart(2, '0');
  const others = move.tools.filter((t) => t.slug !== tool.slug);
  const style = { ['--c' as string]: move.color, ['--t' as string]: TINT[move.key] };

  return (
    <div className="page tool-page" style={style}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="tk-head">
        <div className="tk-wrap">
          <Reveal>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/toolkit">Toolkit</Link>
              <span aria-hidden="true">→</span>
              <Link to={`/toolkit?move=${key.toLowerCase()}`}>{key}</Link>
              <span aria-hidden="true">→</span>
              <span>Tool {number}</span>
            </nav>
          </Reveal>
          <div className="tk-head__grid">
            <div>
              <Reveal>
                <span className="tool-move">
                  <MoveIcon move={key} size={22} variant="white" />
                  <strong>{key}</strong>
                  <span className="deva" lang="hi">{move.hindi}</span>
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="display-xl tk-head__title">{tool.name}</h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="lede" style={{ maxWidth: '38ch' }}>{tool.tagline}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="tool-facts">
                  {tool.audience.map((a) => <span key={a} className="mini-chip">{a}</span>)}
                  <span className="mini-chip">{TP_LABEL[tool.thinkingPartner] || tool.thinkingPartner}</span>
                </div>
                <div className="head-actions">
                  <Pill href={tool.driveUrl || FALLBACK_URL} variant="ink">Download the PDF</Pill>
                  {tool.thinkingPartner !== 'SOLO ONLY' && <Pill href={TP_URL} variant="ghost">Open the Thinking Partner</Pill>}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1} y={40}>
              <div className="tool-card">
                <div className="tool-card__top">
                  <span>Tool {number} of {String(move.tools.length).padStart(2, '0')}</span>
                  <Buddy color="#FFFFFF" size={44} />
                </div>
                <div className="tool-card__icon"><MoveIcon move={key} size={140} variant="white" /></div>
                <div className="tool-card__move">{key} <span className="deva" lang="hi">{move.hindi}</span></div>
                <div className="tool-card__tag">{move.tagline}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ── What it's for ───────────────────────────────────── */}
      <section className="sec sec--cream">
        <div className="tk-wrap split">
          <Reveal><h2 className="display-lg">What it’s for</h2></Reveal>
          <div>
            {tool.plainDescription && (
              <Reveal><p className="tool-lead">{tool.plainDescription}</p></Reveal>
            )}
            <Reveal delay={0.05}><p className="body-lg" style={{ marginTop: 18 }}>{tool.description}</p></Reveal>
          </div>
        </div>
      </section>

      {/* ── How to run it ───────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap split">
          <Reveal><h2 className="display-lg">How to run it</h2></Reveal>
          <ol className="tool-steps">
            {tool.howToUse.map((step, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <li>
                  <span className="ev__num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Example and Thinking Partner ───────────────────── */}
      <section className="sec sec--tight">
        <div className="tk-wrap">
          {tool.example && (
            <Reveal>
              <div className="tool-example">
                <span className="mini-head">For example</span>
                <p>{tool.example}</p>
                <Buddy color={move.color} size={56} className="tool-example__buddy" />
              </div>
            </Reveal>
          )}
          {tool.tpPrompt && (
            <Reveal className="tool-tp-wrap">
              <div className="tool-tp">
                <div className="tool-tp__head">
                  <div>
                    <span className="mini-head">Thinking Partner</span>
                    <h2 className="tool-tp__title">Run it with the Thinking Partner</h2>
                    <p className="tool-tp__note">{TP_LABEL[tool.thinkingPartner] || tool.thinkingPartner}. Copy the prompt, fill in the brackets, and paste it in.</p>
                  </div>
                  <CopyPrompt text={tool.tpPrompt} />
                </div>
                <pre className="tool-tp__prompt">{tool.tpPrompt}</pre>
                <p className="tool-tp__links">
                  Open it in the <a href={TP_URL} target="_blank" rel="noopener noreferrer">Thinking Partner</a>, the{' '}
                  <a href={GPT_URL} target="_blank" rel="noopener noreferrer">TARK GPT</a> or the{' '}
                  <a href={GEM_URL} target="_blank" rel="noopener noreferrer">TARK Gem</a>.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── More tools ──────────────────────────────────────── */}
      <section className="sec">
        <div className="tk-wrap">
          <div className="section-head">
            <Reveal><h2 className="display-lg">More {key} tools</h2></Reveal>
            {next && (
              <Reveal delay={0.05} className="section-head__aside">
                <p>Next up: {next.tool.name}{next.move.key !== move.key ? `, the first ${next.move.key} tool` : ''}.</p>
                <Pill to={`/toolkit/${next.move.key.toLowerCase()}/${next.tool.slug}`} variant="ink">Next tool</Pill>
              </Reveal>
            )}
          </div>
          <ul className="tool-list tool-more">
            {others.map((t) => {
              const i = move.tools.findIndex((x) => x.slug === t.slug);
              return (
                <li key={t.slug}>
                  <Link to={`/toolkit/${key.toLowerCase()}/${t.slug}`} className="tool-row">
                    <span className="tool-row__num"><i style={{ backgroundColor: move.color }} />{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="tool-row__name">{t.name}</span>
                      <span className="tool-row__tag">{t.tagline}</span>
                    </span>
                    <span className="tool-row__meta">{t.audience.map((a) => <span key={a} className="mini-chip">{a}</span>)}</span>
                    <span className="tool-row__go" aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Reveal>
            <h3 className="mini-head" style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>Other moves</h3>
            <nav className="jump" style={{ marginTop: 0 }} aria-label="Other moves">
              {toolsData.map((m) => (
                <Link key={m.key} to={`/toolkit/${m.key.toLowerCase()}/${m.tools[0].slug}`} className="jump__item"
                  style={{ backgroundColor: m.color, color: '#FFFFFF', outline: m.key === move.key ? '3px solid var(--ink)' : undefined, outlineOffset: 3 }}
                  aria-current={m.key === move.key ? 'true' : undefined}>
                  <MoveIcon move={m.key as MoveKey} size={26} variant="white" />
                  <span className="jump__name">{m.key}</span>
                  <span className="jump__hindi deva" lang="hi">{m.hindi}</span>
                  <span className="jump__go" aria-hidden="true">→</span>
                </Link>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────── */}
      <section className="home-close" style={{ background: TINT[move.key] }}>
        <Squiggle kind="loop" width={150} color={move.color} className="home-close__sq1" />
        <Squiggle kind="zigzag" width={120} color={move.color} className="home-close__sq2" delay={0.2} />
        <div className="tk-wrap home-close__inner">
          <Reveal><p className="home-close__kicker">Not quite the right kind of stuck?</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="home-close__title" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)' }}>See all<br />25 tools.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="home-close__actions">
              <Pill to="/toolkit" variant="ink">Browse the toolkit</Pill>
              <Pill to="/dice" variant="ghost">Roll the dice</Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
