/**
 * Minimal inline formatting for CMS prose: **bold** and *italic* only.
 *
 * Section copy is edited in Sveltia CMS as plain text, but the design uses a
 * little emphasis (bold key phrases, italic terms). Rather than pull a full
 * markdown engine, we escape HTML first — so any literal angle brackets an
 * editor types render as text and can't inject markup — then translate the two
 * markers we actually use.
 */
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function inline(s: string | undefined | null): string {
  if (!s) return '';
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>');
}
