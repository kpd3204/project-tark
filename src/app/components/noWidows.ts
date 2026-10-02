/* No widows: bind the last two words of every heading and paragraph with a
   no-break space, so a line never ends with one word left on its own.
   Runs on every change to the page, and is safe to run repeatedly. */

const SELECTOR = 'h1, h2, h3, h4, h5, p, li, dd, figcaption, blockquote';
const NBSP = ' ';

function bindLastWords(el: Element) {
  // text nodes and line breaks, in order; never bind across a <br>
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => (node.nodeType === Node.TEXT_NODE || (node as Element).tagName === 'BR' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  const nodes: (Text | Element)[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text | Element);
  let seenWord = false;
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (node.nodeType !== Node.TEXT_NODE) return; // a <br>: the last line starts here
    const text = (node as Text).data;
    for (let j = text.length - 1; j >= 0; j--) {
      const ch = text[j];
      if (ch === NBSP) { if (seenWord) return; continue; }
      if (ch === ' ' || ch === '\n' || ch === '\t') {
        if (!seenWord) continue;
        (node as Text).data = text.slice(0, j) + NBSP + text.slice(j + 1);
        return;
      }
      seenWord = true;
    }
  }
}

export function watchWidows(root: HTMLElement = document.body) {
  let raf = 0;
  const run = () => { raf = 0; root.querySelectorAll(SELECTOR).forEach(bindLastWords); };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(run); };
  const mo = new MutationObserver(schedule);
  mo.observe(root, { childList: true, subtree: true, characterData: true });
  schedule();
  return () => { mo.disconnect(); if (raf) cancelAnimationFrame(raf); };
}
