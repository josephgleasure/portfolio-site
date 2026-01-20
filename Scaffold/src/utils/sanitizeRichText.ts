// Minimal HTML sanitizer for locally-authored rich text.
// Allows only a small set of tags used for formatting copy (e.g. <p>).
// This is NOT a general-purpose sanitizer, but it prevents obvious script injection.

const allowedTags = new Set([
  'P',
  'BR',
  'EM',
  'STRONG',
  'B',
  'I',
  'UL',
  'OL',
  'LI',
  'A',
  'H1',
  'H2',
  'H3',
  'H4',
  'BLOCKQUOTE',
  'PRE',
  'CODE',
  'HR',
]);

const allowedAttrs: Record<string, Set<string>> = {
  A: new Set(['href', 'target', 'rel']),
};

function isSafeHref(href: string): boolean {
  const trimmed = href.trim().toLowerCase();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  );
}

export function sanitizeRichTextHtml(input: string): string {
  if (!input) return '';

  // Fast path: no tags
  if (!input.includes('<')) return input;

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const toRemove: Element[] = [];

  while (walker.nextNode()) {
    const el = walker.currentNode as Element;
    if (!allowedTags.has(el.tagName)) {
      toRemove.push(el);
      continue;
    }

    // Strip attributes except allowlist
    const allowed = allowedAttrs[el.tagName] ?? new Set<string>();
    Array.from(el.attributes).forEach(attr => {
      if (!allowed.has(attr.name)) el.removeAttribute(attr.name);
    });

    if (el.tagName === 'A') {
      const href = el.getAttribute('href') ?? '';
      if (!isSafeHref(href)) {
        el.removeAttribute('href');
      }
      // Safe defaults
      el.setAttribute('rel', 'noopener noreferrer');
      if (el.getAttribute('target') === '_blank') {
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
  }

  // Replace disallowed elements with their text content
  toRemove.forEach(el => {
    const text = doc.createTextNode(el.textContent ?? '');
    el.replaceWith(text);
  });

  return doc.body.innerHTML;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function markdownToHtml(md: string): string {
  const src = md.replace(/\r\n/g, '\n').trim();
  if (!src) return '';

  const blocks = src.split(/\n{2,}/g);

  const renderInline = (raw: string) => {
    let s = escapeHtml(raw);

    // Links: [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
      const safeUrl = String(url);
      const tgt = safeUrl.startsWith('http') ? ' target="_blank"' : '';
      return `<a href="${escapeHtml(safeUrl)}"${tgt}>${text}</a>`;
    });

    // Bold / italic
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Line breaks inside paragraphs
    s = s.replace(/\n/g, '<br/>');
    return s;
  };

  const out: string[] = [];

  for (const block of blocks) {
    // Headings
    const headingMatch = block.match(/^(#{1,4})\s+([\s\S]+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      out.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Unordered list
    const lines = block.split('\n');
    const isUl = lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
    if (isUl) {
      const items = lines
        .map(l => l.trim().slice(2))
        .map(item => `<li>${renderInline(item)}</li>`)
        .join('');
      out.push(`<ul>${items}</ul>`);
      continue;
    }

    // Ordered list
    const isOl = lines.every(l => /^\s*\d+\.\s+/.test(l));
    if (isOl) {
      const items = lines
        .map(l => l.replace(/^\s*\d+\.\s+/, ''))
        .map(item => `<li>${renderInline(item)}</li>`)
        .join('');
      out.push(`<ol>${items}</ol>`);
      continue;
    }

    // Blockquote
    const isQuote = lines.every(l => l.trim().startsWith('>'));
    if (isQuote) {
      const text = lines.map(l => l.trim().replace(/^>\s?/, '')).join('\n');
      out.push(`<blockquote><p>${renderInline(text)}</p></blockquote>`);
      continue;
    }

    out.push(`<p>${renderInline(block)}</p>`);
  }

  return out.join('\n');
}

export function renderRichTextHtml(input: string): string {
  if (!input) return '';
  // If it already looks like HTML, sanitize that.
  if (input.includes('<')) return sanitizeRichTextHtml(input);
  // Otherwise treat it as Markdown and sanitize the generated HTML.
  return sanitizeRichTextHtml(markdownToHtml(input));
}

