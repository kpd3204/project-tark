/* The "Thinking in progress" stamp, the sixth face of the TARK dice. */

export function ThinkingStamp({ className }: { className?: string }) {
  return (
    <svg className={`stamp ${className || ''}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id="stamp-top" d="M 40 100 A 60 60 0 0 1 160 100" />
        <path id="stamp-bottom" d="M 22 100 A 78 78 0 0 0 178 100" />
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="5" />
      <text className="stamp__text"><textPath href="#stamp-top" startOffset="50%" textAnchor="middle">THINKING</textPath></text>
      <text className="stamp__text"><textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">IN PROGRESS</textPath></text>
      <circle cx="80" cy="100" r="5" fill="currentColor" />
      <circle cx="100" cy="100" r="5" fill="currentColor" />
      <circle cx="120" cy="100" r="5" fill="currentColor" />
    </svg>
  );
}

