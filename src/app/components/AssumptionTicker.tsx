import { Tag, Pill } from './play';

const ITEMS = [
  'Hard work always leads to success.',
  'Science is more important than arts.',
  'You should know what you want by 17.',
  'Marks measure intelligence.',
  "There's one right answer.",
  'The teacher always knows best.',
  'Engineering is the safe option.',
  "Failure means you didn't try hard enough.",
  'Success means a stable job.',
  'Reading is less useful than practice.',
];

const COLORS = ['#FFD167', '#E27238', '#465BA4', '#4DB49F', '#DA3832'];
const TILTS = [-2.5, 1.5, -1, 2.5, -1.8];

/* A band of everyday assumptions drifting past as tilted tags.
   Hover pauses it; the action asks the reader to question them. */
export function AssumptionTicker() {

  return (
    <section className="ticker">
      <div className="tk-wrap ticker__head">
        <h2 className="ticker__title">
          Are these <Tag bg="#FFD167" color="#1D1B16" tilt={-3}>facts?</Tag>
        </h2>
        <Pill to="/framework#open" variant="paper">Question them</Pill>
      </div>

      <div className="ticker__track" aria-label="Common assumptions">
        <div className="ticker__run">
          {[...ITEMS, ...ITEMS].map((item, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              <Tag
                key={i}
                bg={c}
                color={c === '#FFD167' ? '#1D1B16' : '#FFFFFF'}
                tilt={TILTS[i % TILTS.length]}
                className="ticker__tag"
              >
                {item}
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
